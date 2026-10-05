#!/usr/bin/env python3
"""Validation et réponses simulées localement : aucune donnée envoyée à Netlify."""
import sys
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
cases = (
    ('/participer/recensement', 'recensement-membres'),
    ('/participer/mise-a-jour', 'demande-mise-a-jour'),
    ('/temoignages', 'temoignage'),
    ('/bibliotheque', 'depot-document'),
    ('/langue', 'mot-nangnda'),
    ('/', 'lettre-info-pied'),
    ('/en/index', 'lettre-info-pied'),
)
with sync_playwright() as p:
    browser = p.chromium.launch()
    # Le cache de l'application ne doit pas intercepter les réponses simulées.
    context = browser.new_context(service_workers='block', viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    attempts = []
    def simulated(route):
        assert route.request.method == 'POST'
        attempts.append(route.request.url)
        route.fulfill(status=503 if len(attempts) % 2 else 200, body='Simulation QA locale')
    context.route('**/__forms.html', simulated)
    page = context.new_page()
    for path, name in cases:
        page.goto(base + path, wait_until='networkidle')
        form = page.locator(f'form[name="{name}"]')
        form.locator('button[type=submit]').tap()
        assert len(attempts) % 2 == 0, 'La validation native doit empêcher un envoi incomplet'
        assert form.locator(':invalid').count() > 0
        for select in form.locator('select[required]').all():
            select.select_option(index=2 if select.get_attribute('name') == 'tranche_age' else 1)
        for field in form.locator('input[required], textarea[required]').all():
            kind = field.get_attribute('type')
            if kind == 'checkbox':
                field.check()
            else:
                field.fill('essai@example.invalid' if kind == 'email' else '0000000000' if kind == 'tel' else 'Essai QA — donnée fictive')
        before = form.locator('input[required]:not([type=checkbox]), textarea[required]').evaluate_all('els => els.map(e=>e.value)')
        form.locator('button[type=submit]').tap()
        error = form.locator('[role=alert]')
        expect(error).to_be_focused()
        box = error.bounding_box()
        assert box and 0 <= box['y'] and box['y'] + box['height'] <= 844, (path, box)
        assert before == form.locator('input[required]:not([type=checkbox]), textarea[required]').evaluate_all('els => els.map(e=>e.value)')
        expect(form.locator('button[type=submit]')).to_be_enabled()
        form.locator('button[type=submit]').tap()
        expect(form).to_have_count(0)
        expect(page.locator('[role=status][tabindex="-1"]')).to_be_focused()
        box = page.locator('[role=status][tabindex="-1"]').bounding_box()
        assert box and 0 <= box['y'] and box['y'] + box['height'] <= 844, (path, box)
    assert len(attempts) == 14
    browser.close()
print('Formulaires : 7 parcours, validation native, erreur avec saisie conservée et confirmation focalisée ; 14 réponses simulées, aucun envoi réel.')
