#!/usr/bin/env python3
"""Captures réelles de la version construite, référencées par le manifeste.
Lancer après npm run build, contre le serveur local ; aucun envoi.
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3100').rstrip('/')
root = Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, route in (('accueil','/'), ('villages','/villages'), ('programmes','/programmes'), ('carte','/carte'), ('ordinateur','/')):
        mobile = name != 'ordinateur'
        context = browser.new_context(viewport={'width':360,'height':640} if mobile else {'width':1280,'height':800}, device_scale_factor=3 if mobile else 1, is_mobile=mobile, has_touch=mobile, service_workers='block', reduced_motion='reduce')
        if mobile:
            context.add_init_script("Object.defineProperty(navigator,'standalone',{get:()=>true})")
        page = context.new_page()
        page.goto(base+route, wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        if mobile:
            expect(page.locator('html')).to_have_class(__import__('re').compile(r'is-standalone'))
        if route == '/carte':
            page.wait_for_timeout(16000) # garder l'état réel du fond de carte et son éventuel repli
        assert page.evaluate('document.documentElement.scrollWidth') <= (360 if mobile else 1280)+1
        dest = root/'public'/'icones'/f'capture-{name}.jpg'
        page.screenshot(path=str(dest), type='jpeg', quality=78, animations='disabled')
        print(dest.relative_to(root))
        context.close()
    # Vérifier aussi le guide sur les petites largeurs avant la publication.
    context = browser.new_context(service_workers='block')
    page = context.new_page()
    for width in (320,390,844):
        page.set_viewport_size({'width':width,'height':844 if width<800 else 390})
        page.goto(base+'/projets/application',wait_until='networkidle')
        expect(page.locator('#installer-sur-iphone')).to_be_visible()
        assert page.locator('#installer-sur-iphone li').count() == 4
        assert page.evaluate('document.documentElement.scrollWidth') <= width+1
    browser.close()
print('5 aperçus actuels et guide iPhone à 320/390/844 px : OK.')
