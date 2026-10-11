#!/usr/bin/env python3
"""Référentiel, rattachements et lecture mobile/bureau ; aucun envoi."""
import json
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
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
        for route in ('/','/en/index','/association/architecture','/programmes','/en/themes','/association/election-vice-presidences'):
            response = page.goto(base+route,wait_until='networkidle')
            assert response.status == 200, route
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, route)
            if route in ('/','/en/index'):
                # Le raccourci doit amener à la grille, puis la carte ouvrir le bon pilier.
                page.locator('.acc-raccourcis a[href="#poles-title"]').click()
                expect(page.locator('#poles-title')).to_be_in_viewport()
                page.locator('.acc-piliers a').last.click()
                reference = architecture['piliers'][-1]
                destination = '#pole-'+str(len(piliers)) if route == '/en/index' else '#pilier-'+reference['roman'].lower()
                heading = page.locator(destination+' h2')
                expect(heading).to_have_text(reference['nomEn'] if route == '/en/index' else reference['nom'])
                expect(heading).to_be_in_viewport()
            elif route == '/association/architecture':
                for reference in architecture['piliers']:
                    section = page.locator('#pilier-'+reference['roman'].lower())
                    expect(section.locator('h2')).to_have_text(reference['nom'])
                    assert section.locator('li').count() == len(reference['thematiques'])
                # Le partage de cette page ne doit pas envoyer les lecteurs vers l'accueil.
                share_url = 'https://lonodji.org'+route
                whatsapp = page.locator('.partage-btn--wa').get_attribute('href')
                assert share_url in parse_qs(urlsplit(whatsapp).query)['text'][0]
                facebook = page.locator('.partage a[href*="facebook.com/sharer"]').get_attribute('href')
                assert parse_qs(urlsplit(facebook).query)['u'] == [share_url]
            elif route == '/programmes':
                page.locator('.piliers-sommaire summary').click()
                page.locator('.piliers-sommaire a').last.click()
                expect(page.locator(f'#pole-{len(piliers)}-titre')).to_be_in_viewport()
                for i, reference in enumerate(architecture['piliers'],1):
                    expect(page.locator(f'#pole-{i}-titre')).to_have_text(reference['nom'])
            elif route == '/en/themes':
                page.locator('.piliers-sommaire summary').click()
                page.locator('.piliers-sommaire a').last.click()
                expect(page.locator(f'#pole-{len(piliers)} h2')).to_be_in_viewport()
                for i, reference in enumerate(architecture['piliers'],1):
                    section = page.locator(f'#pole-{i}')
                    expect(section.locator('h2')).to_have_text(reference['nomEn'])
                    expected = ['theme-'+t['number'] for t in piliers[i-1]['items']]
                    assert section.locator('.pole-card[id]').evaluate_all('(cards) => cards.map(c => c.id)') == expected
                    direction = piliers[i-1]['direction']
                    if direction['filled']:
                        expect(section.locator('.pole-direction')).to_contain_text(direction['name'])
                    else:
                        section.locator('.pole-direction a').click()
                        expect(page.locator('select[name="pole"]')).to_have_value('Vice-présidence du pilier '+reference['roman']+' — '+reference['nom'])
                        page.goto(base+route,wait_until='networkidle')
                page.locator('.vues-them a[href="/en/sectors"]').click()
                expect(page.locator('.vues-them [aria-current="page"] strong')).to_have_text('By sector')
                page.locator('.vues-them a[href="/en/themes"]').click()
                expect(page.locator('.vues-them [aria-current="page"] strong')).to_have_text('By pillar')
            else:
                for reference in architecture['piliers'][2:]:
                    expect(page.get_by_role('heading',name=reference['nom'],exact=True)).to_be_visible()
        for reference in architecture['piliers']:
            page.goto(base+'/participer?direction='+reference['roman'],wait_until='networkidle')
            expect(page.locator('select[name="pole"]')).to_have_value('Vice-présidence du pilier '+reference['roman']+' — '+reference['nom'])
        assert not errors, errors
        context.close()
    # Le choix d'un pilier reste utilisable avant hydratation ou sans JavaScript.
    context = browser.new_context(viewport={'width':320,'height':740}, java_script_enabled=False)
    page = context.new_page()
    for route in ('/programmes','/en/themes'):
        page.goto(base+route,wait_until='networkidle')
        page.locator('.piliers-sommaire summary').click()
        page.locator('.piliers-sommaire a').last.click()
        target = f'#pole-{len(piliers)}'+(' h2' if route == '/en/themes' else '-titre')
        expect(page.locator(target)).to_be_in_viewport()
    context.close()
    browser.close()
print(f'Architecture : {len(piliers)} piliers, {len(ids)} rattachements uniques, missions exactes, FR/EN, élections et reflux à 320/390/844/1440 px : OK.')
