#!/usr/bin/env python3
"""Régressions des parcours simplifiés : ancres, dépliage et candidature.
Aucun formulaire n'est envoyé, aucune donnée personnelle n'est saisie.
"""
import sys
import re
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 390, 'height': 844})
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(base + '/participer', wait_until='networkidle')
    expect(page.locator('form[name="contact"]')).to_be_visible()
    expect(page.locator('#postes-ouverts')).not_to_have_attribute('open', '')
    page.locator('nav.participer-choix a[href="#postes-ouverts"]').click()
    expect(page.locator('#postes-ouverts')).to_have_attribute('open', '')
    candidate = page.locator('#postes-ouverts a[href*="theme=07"][href*="coordo=1"]').first
    candidate.click()
    expect(page.locator('form[name="contact"] select[name="pole"]')).to_have_value(re.compile(r'^07\.'))
    expect(page.locator('input[name="candidature_coordo"]')).to_be_checked()
    expect(page.locator('form[name="contact"]')).to_be_visible()
    page.goto(base + '/participer#newsletter', wait_until='networkidle')
    expect(page.locator('#newsletter')).to_have_attribute('open', '')
    expect(page.locator('#newsletter form')).to_be_visible()
    page.goto(base + '/impact', wait_until='networkidle')
    expect(page.locator('#indicateur-adherents .eyebrow')).to_have_text('Intentions d’adhésion')
    expect(page.locator('#suivi-thematique')).not_to_have_attribute('open', '')
    target = page.locator('#suivi-thematique [id]').first.get_attribute('id')
    page.goto(base + '/impact#' + target, wait_until='networkidle')
    expect(page.locator('#suivi-thematique')).to_have_attribute('open', '')
    expect(page.locator('[id="' + target + '"]')).to_be_visible()
    page.goto(base + '/impact#comptes-detail', wait_until='networkidle')
    expect(page.locator('#comptes-detail')).to_have_attribute('open', '')
    page.goto(base + '/participer#%E0%A4%A', wait_until='networkidle')
    for route in ('/', '/en/index', '/participer', '/impact'):
        page.goto(base + route, wait_until='networkidle')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), route + ': débordement mobile'
    for slug in ('2026-10-01-cinq-poles-sept-priorites', '2026-10-01-election-vice-presidences'):
        page.goto(base + '/journal/' + slug, wait_until='networkidle')
        expect(page.locator('aside[aria-label="Mise à jour de cet article"]')).to_contain_text('4 octobre 2026')
    assert not errors, errors
    browser.close()
print('Parcours revue : contact visible, candidature préremplie, ancres dépliées, mobile et notes datées vérifiés.')
