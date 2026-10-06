#!/usr/bin/env python3
"""Référentiel, rattachements et lecture mobile/bureau ; aucun envoi."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

root = Path(__file__).resolve().parents[2]
architecture = json.loads((root/'content/architecture.json').read_text())
index = json.loads((root/'content/index.json').read_text())
piliers = index['structure']['poles']
assert len(piliers) == len(architecture['piliers'])
ids = [t['id'] for p in piliers for t in p['items']]
assert len(ids) == len(set(ids))
for reference, pilier in zip(architecture['piliers'], piliers):
    assert (pilier['roman'], pilier['name'], pilier['intro']) == (reference['roman'], reference['nom'], reference['mission'])
    assert [t['id'] for t in pilier['items']] == reference['thematiques']
base = (sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3100').rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height in ((320,740),(390,844),(844,390),(1440,900)):
        context = browser.new_context(viewport={'width':width,'height':height}, service_workers='block')
        page = context.new_page()
        errors = []
        page.on('pageerror',lambda error: errors.append(str(error)))
        for route in ('/association/architecture','/programmes','/en/themes','/association/election-vice-presidences'):
            response = page.goto(base+route,wait_until='networkidle')
            assert response.status == 200, route
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, route)
            if route == '/association/architecture':
                for reference in architecture['piliers']:
                    section = page.locator('#pilier-'+reference['roman'].lower())
                    expect(section.locator('h2')).to_have_text(reference['nom'])
                    assert section.locator('li').count() == len(reference['thematiques'])
            elif route == '/programmes':
                for i, reference in enumerate(architecture['piliers'],1):
                    expect(page.locator(f'#pole-{i}-titre')).to_have_text(reference['nom'])
            elif route == '/en/themes':
                for i, reference in enumerate(architecture['piliers'],1):
                    expect(page.locator(f'#pole-{i} h2')).to_have_text(reference['nomEn'])
            else:
                for reference in architecture['piliers'][2:]:
                    expect(page.get_by_role('heading',name=reference['nom'],exact=True)).to_be_visible()
        for reference in architecture['piliers']:
            page.goto(base+'/participer?direction='+reference['roman'],wait_until='networkidle')
            expect(page.locator('select[name="pole"]')).to_have_value('Vice-présidence du pilier '+reference['roman']+' — '+reference['nom'])
        assert not errors, errors
        context.close()
    browser.close()
print(f'Architecture : {len(piliers)} piliers, {len(ids)} rattachements uniques, missions exactes, FR/EN, élections et reflux à 320/390/844/1440 px : OK.')
