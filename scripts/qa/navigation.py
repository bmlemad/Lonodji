#!/usr/bin/env python3
"""Navigation clavier mobile, application et bureau ; aucune soumission de formulaire."""
import sys
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch()
    for route in ('/', '/en/index'):
        for application in (False, True):
            options = {'viewport': {'width': 390, 'height': 844}}
            if application:
                options['user_agent'] = 'Mozilla/5.0 LONODJI-iOS'
            context = browser.new_context(**options)
            page = context.new_page()
            page.goto(base + route, wait_until='networkidle')
            trigger = page.locator('.tab--menu' if application else '.menu-toggle')
            trigger.click()
            expect(page.locator("#mm-q")).to_be_visible()
            expect(trigger).to_be_focused()
            assert page.locator('main').evaluate('(el) => el.inert')
            page.keyboard.press('Shift+Tab')
            last = page.locator('#mobile-menu .mm-foot a').last
            expect(last).to_be_focused()
            page.keyboard.press('Tab')
            expect(trigger).to_be_focused()
            page.keyboard.press('Tab')
            expect(page.locator('#mm-q')).to_be_focused()
            page.keyboard.press('Escape')
            expect(trigger).to_be_focused()
            expect(trigger).to_have_attribute('aria-expanded', 'false')
            assert not page.locator('main').evaluate('(el) => el.inert')
            trigger.click()
            page.keyboard.press('Control+k')
            expect(page.locator('.palette input')).to_be_focused()
            focuses = set()
            for _ in range(5):
                page.keyboard.press('Tab')
                assert page.evaluate('!!document.activeElement.closest(".palette")')
                focuses.add(page.evaluate('document.activeElement.outerHTML'))
            assert len(focuses) > 1
            page.keyboard.press('Escape')
            expect(page.locator('.palette')).to_have_count(0)
            expect(trigger).to_have_attribute('aria-expanded', 'true')
            page.set_viewport_size({'width': 1440, 'height': 900})
            expect(page.locator('#mobile-menu')).to_have_attribute('aria-hidden', 'true')
            assert not page.locator('main').evaluate('(el) => el.inert')
            assert not page.locator('body').evaluate('(el) => el.classList.contains("menu-open")')
            context.close()
    context = browser.new_context(viewport={'width': 1440, 'height': 900})
    page = context.new_page()
    page.goto(base + '/', wait_until='networkidle')
    trigger = page.locator('[aria-controls="mega-actions"]')
    trigger.focus()
    page.keyboard.press('ArrowDown')
    expect(page.locator('#mega-actions a').first).to_be_focused()
    page.keyboard.press('Escape')
    expect(trigger).to_be_focused()
    expect(trigger).to_have_attribute('aria-expanded', 'false')
    page.goto(base + '/participer', wait_until='networkidle')
    page.locator('[aria-controls="mega-participer"]').click()
    page.locator('#mega-participer a[href="/participer?coordo=1#contact"]').click()
    expect(page.locator('input[name="candidature_coordo"]')).to_be_checked()
    browser.close()
print('Navigation : boucle clavier, retour au bouton d’origine, passage mobile/bureau et méga-menu vérifiés en FR/EN et mode application.')
