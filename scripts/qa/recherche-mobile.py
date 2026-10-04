#!/usr/bin/env python3
"""Recherche, filtres, retour et reprise de l'index, sans envoi de formulaire."""
import sys
import json
import re
import unicodedata
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
fixture = [dict(t=t, r=r, k=k, d=t, x=t) for t,r,k in (
    ('Alpha article', '/journal', 'Article'), ('Alpha document', '/documents', 'Document'), ('Beta document', '/documents', 'Document'))]
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(service_workers='block', viewport={'width':390,'height':844}, is_mobile=True, has_touch=True)
    context.route('**/search-index.json', lambda route: route.fulfill(content_type='application/json',body=json.dumps(fixture)))
    page = context.new_page()
    page.goto(base+'/recherche', wait_until='networkidle')
    page.locator('#site-search').fill('Alpha')
    page.locator('.cat-list a').filter(has_text='Article').tap()
    expect(page.locator('.journal-count')).to_have_text('1 résultat (2 au total)')
    page.locator('#site-search').fill('Beta')
    expect(page.locator('#resultats a')).to_have_text('Beta document')
    expect(page.locator('.cat-list a[aria-current=true]')).to_have_text('Tous')
    page.locator('#site-search').fill('')
    expect(page.locator('#resultats li')).to_have_count(0)
    expect(page.locator('.journal-count')).to_contain_text('3 pages')
    context.close()

    context = browser.new_context(service_workers='block', viewport={'width':390,'height':844})
    pending = []
    context.route('**/search-index.json', lambda route: pending.append(route))
    page = context.new_page()
    page.goto(base+'/recherche', wait_until='domcontentloaded')
    page.locator('#site-search').fill('Alpha')
    expect(page.locator('.journal-count')).to_contain_text('Chargement')
    assert pending
    pending.pop().fulfill(status=503,body='Indisponible')
    retry = page.get_by_role('button',name='Réessayer le chargement')
    expect(retry).to_be_visible()
    context.unroute('**/search-index.json')
    context.route('**/search-index.json', lambda route: route.fulfill(content_type='application/json', body=json.dumps(fixture)))
    with page.expect_response("**/search-index.json"):
        retry.click()
    expect(page.locator('#site-search')).to_have_value('Alpha')
    expect(page.locator('#resultats li')).to_have_count(2)
    expect(retry).to_have_count(0)
    context.close()

    context = browser.new_context(service_workers='block', viewport={'width':390,'height':844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    page.goto(base+'/villages', wait_until='networkidle')
    page.locator('#vl-q').fill('Bedjondo')
    expect(page).to_have_url(re.compile(r'q=Bedjondo'))
    target=page.locator('#vl-resultats a').first.get_attribute('href')
    page.locator('#vl-resultats a').first.tap()
    expect(page).to_have_url(base+target)
    page.go_back(wait_until='networkidle')
    expect(page.locator('#vl-q')).to_have_value('Bedjondo')
    page.reload(wait_until='networkidle')
    expect(page.locator('#vl-q')).to_have_value('Bedjondo')
    page.locator('#vl-q').fill('be')
    data=json.loads(Path('content/villages.json').read_text())
    normalize=lambda text: ''.join(c for c in unicodedata.normalize('NFD',text.lower()) if not unicodedata.combining(c))
    total=sum('be' in normalize(v['nom']) for v in data['villages'])
    expect(page.locator('#vl-aide')).to_contain_text(str(total)+' localités trouvées')
    expect(page.locator('#vl-resultats li')).to_have_count(min(40,total))
    page.locator('#vl-q').fill('')
    assert 'q=' not in page.url
    expect(page.locator('#vl-resultats')).to_have_count(0)

    page.goto(base+'/journal', wait_until='networkidle')
    page.locator('.cat-list a').nth(1).tap()
    category=page.locator('.cat-list [aria-current=true]').inner_text()
    query=page.locator('#articles h3 a').first.inner_text().split()[0]
    page.locator('.journal-search input').fill(query)
    target=page.locator('#articles h3 a').first.get_attribute('href')
    page.locator('#articles h3 a').first.tap()
    expect(page).to_have_url(base+target)
    page.go_back(wait_until='networkidle')
    expect(page.locator('.journal-search input')).to_have_value(query)
    expect(page.locator('.cat-list [aria-current=true]')).to_have_text(category)
    page.reload(wait_until='networkidle')
    expect(page.locator('.journal-search input')).to_have_value(query)
    page.goto(base+'/journal', wait_until='networkidle')
    page.locator('.journal-plus button').tap()
    expect(page).to_have_url(re.compile(r'tout=1'))
    page.reload(wait_until='networkidle')
    expect(page.locator('.journal-plus')).to_have_count(0)
    browser.close()
print('Recherche mobile : filtres cohérents, chargement lent et reprise, compte des villages et retour aux recherches/journal vérifiés.')
