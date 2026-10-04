#!/usr/bin/env python3
"""Fermetures tactiles et retour au déclencheur ; aucun partage ni envoi."""
import sys
import re
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch()
    for route in ('/', '/en/index'):
        for application in (False, True):
            options = dict(viewport={'width': 390, 'height': 600}, is_mobile=True, has_touch=True)
            if application:
                options['user_agent'] = 'Mozilla/5.0 LONODJI-iOS'
            context = browser.new_context(**options)
            page = context.new_page()
            page.goto(base + route, wait_until='networkidle')
            trigger = page.locator('.tab--menu' if application else '.menu-toggle')
            trigger.tap()
            page.locator('#mm-q').tap()
            expect(page.locator('html')).to_have_class(re.compile(r'kb-open'))
            expect(page.locator('.tabbar')).not_to_be_visible()
            close = page.locator('.mm-close')
            expect(close).to_be_visible()
            page.locator('.mm-foot').scroll_into_view_if_needed()
            box = close.bounding_box()
            assert box and 0 <= box['y'] and box['y'] + box['height'] <= 600, box
            close.tap()
            expect(page.locator('#mobile-menu')).to_have_attribute('aria-hidden', 'true')
            expect(trigger).to_be_focused()
            expect(page.locator('.tabbar')).to_be_visible()
            assert not page.locator('main').evaluate('e => e.inert')
            page.locator('.nav-search').tap()
            expect(page.locator('.palette input')).to_be_focused()
            close = page.locator('.palette-fermer')
            box = close.bounding_box()
            assert box and box['width'] >= 43.5 and box['height'] >= 43.5, box
            close.tap()
            expect(page.locator('.palette')).to_have_count(0)
            expect(page.locator('.nav-search')).to_be_focused()
            page.locator('.nav-share').tap()
            expect(page.locator('.feuille')).to_be_visible()
            page.locator('.partage-message summary').tap()
            page.locator('.feuille textarea').tap()
            close = page.locator('.feuille-fermer')
            box = close.bounding_box()
            assert box and box['width'] >= 43.5 and box['height'] >= 43.5, box
            close.tap()
            expect(page.locator('.feuille')).to_have_count(0)
            expect(page.locator('.nav-share')).to_be_focused()
            expect(page.locator('.tabbar')).to_be_visible()
            context.close()
    browser.close()
print('Fenêtres mobiles : fermeture pendant la saisie, après défilement, recherche et partage vérifiés en FR/EN et application.')
