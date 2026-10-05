#!/usr/bin/env python3
"""Confort tactile, champs et rotation ; aucun formulaire envoyé."""
import sys
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
routes = ('/', '/participer', '/impact', '/actions', '/mission', '/journal', '/villages', '/observatoire', '/programmes', '/histoire', '/bibliotheque', '/odeb/livre-blanc', '/territoire/besoins', '/en/index', '/en/contact', '/en/sectors')
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 320, 'height': 640}, is_mobile=True, has_touch=True)
    page = context.new_page()
    for width in (320, 360, 390, 430):
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
            # Commandes de page : déplier, partager et télécharger au toucher.
            targets = page.locator('main button, main summary, main .button, main .partage-btn, footer button, footer .button, .footer-cols a, .footer-contact a, .footer-bottom a').evaluate_all('''els => els.filter(e => {
                if (!e.checkVisibility()) return false;
                const r = e.getBoundingClientRect();
                return r.width > 0 && (r.width < 43.5 || r.height < 43.5);
            }).map(e => ({className: e.className, text: e.textContent.trim().slice(0,60), height:e.getBoundingClientRect().height}))''')
            assert not targets, (route, width, targets)
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
    # Téléphone en paysage : les commandes restent tactiles au-delà de 800 px.
    page.set_viewport_size({'width': 844, 'height': 390})
    page.emulate_media(reduced_motion='reduce')
    for route in ('/', '/en/index'):
        page.goto(base + route, wait_until='networkidle')
        fields = page.locator('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea').evaluate_all('''els => els.filter(e => e.checkVisibility() && parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.name || e.id)''')
        assert not fields, (route, 'paysage', fields)
        for selector in ('.nav-search', '.nav-share', '.nav-cta', '.menu-toggle', '.nav-langue'):
            box = page.locator('.nav ' + selector).bounding_box()
            assert box and box['height'] >= 43.5 and box['width'] >= 43.5, (route, selector, box)
        page.locator('.menu-toggle').tap()
        close = page.locator('.mm-close')
        expect(close).to_be_visible()
        menu_targets = page.locator('#mobile-menu a').evaluate_all('''els => els.filter(e => e.checkVisibility() && e.getBoundingClientRect().height < 43.5).map(e => e.textContent.trim())''')
        assert not menu_targets, (route, menu_targets)
        box = close.bounding_box()
        assert box and box['y'] >= 0 and box['y'] + box['height'] <= 390, box
        close.tap()
        expect(page.locator('#mobile-menu')).to_have_attribute('aria-hidden', 'true')
    # Entre 640 et 760 px, ces tableaux défilent au lieu de s'empiler.
    page.set_viewport_size({'width': 720, 'height': 900})
    for route, selector in (('/secteurs', '.ob-table-wrap'), ('/en/sectors', '.ob-table-wrap'), ('/territoire/besoins', '.table-wrap')):
        page.goto(base + route, wait_until='networkidle')
        cadre = page.locator('main ' + selector).first
        expect(cadre).to_have_attribute('tabindex', '0')
        expect(cadre).to_have_attribute('role', 'region')
        assert cadre.get_attribute('aria-label') or cadre.get_attribute('aria-labelledby'), route
        cadre.focus()
        expect(cadre).to_be_focused()
        page.keyboard.press('ArrowRight')
        for _ in range(20):
            if cadre.evaluate('e => e.scrollLeft > 0'):
                break
            page.wait_for_timeout(50)
        assert cadre.evaluate('e => e.scrollLeft > 0'), route
        assert page.evaluate('document.documentElement.scrollWidth') <= 721, route
    browser.close()
print(f'Mobile : {len(routes)} pages à 320/360/390/430 px, champs, commandes de page, cibles tactiles, pied de page, menu en paysage FR/EN et tableaux défilants au clavier vérifiés.')
