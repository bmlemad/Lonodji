#!/usr/bin/env python3
"""Confort tactile, champs et rotation ; aucun formulaire envoyé."""
import sys
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
routes = ('/', '/participer', '/impact', '/actions', '/mission', '/journal', '/villages', '/observatoire', '/en/index', '/en/contact')
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 320, 'height': 640}, is_mobile=True, has_touch=True)
    page = context.new_page()
    for width in (320, 360, 390):
        page.set_viewport_size({'width': width, 'height': 844})
        for route in routes:
            response = page.goto(base + route, wait_until='networkidle')
            assert response.status == 200, route
            assert page.evaluate('document.documentElement.scrollWidth') <= width + 1, (route, width)
            problems = page.locator('input, select, textarea').evaluate_all('''els => els.filter(e =>
                !['checkbox','radio','range','hidden','submit','button'].includes(e.type) &&
                e.checkVisibility() && parseFloat(getComputedStyle(e).fontSize) < 16
            ).map(e => e.name || e.id)''')
            assert not problems, (route, width, problems)
        for selector in ('.nav-search', '.nav-cta', '.menu-toggle'):
            box = page.locator('.nav ' + selector).bounding_box()
            assert box and box['height'] >= 44 and box['width'] >= 44, (width, selector, box)
    page.goto(base + '/participer', wait_until='networkidle')
    cols = page.locator('details.footer-col')
    assert cols.count() > 0
    expect(cols.first).not_to_have_attribute('open', '')
    page.set_viewport_size({'width': 900, 'height': 600})
    for col in cols.all():
        expect(col).to_have_attribute('open', '')
    page.set_viewport_size({'width': 390, 'height': 844})
    expect(cols.first).not_to_have_attribute('open', '')
    cols.first.locator('summary').tap()
    expect(cols.first).to_have_attribute('open', '')
    page.set_viewport_size({'width': 400, 'height': 844})
    expect(cols.first).to_have_attribute('open', '')
    browser.close()
print('Mobile : 10 pages à 320/360/390 px, champs, cibles tactiles et rotation du pied de page vérifiés.')
