#!/usr/bin/env python3
"""Métadonnées Apple, mode installé et zones système simulées ; aucun envoi.
--webkit utilise le moteur WebKit local ; cela ne remplace pas un iPhone réel.
"""
import http.client
import re
import ssl
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
webkit = '--webkit' in sys.argv

# WebKit applique upgrade-insecure-requests aux ressources locales : conserver
# la CSP du site et tester via une passerelle HTTPS, certificat de QA uniquement.
class Passerelle(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        cible = urlsplit(base)
        conn = http.client.HTTPConnection(cible.hostname, cible.port, timeout=20)
        try:
            conn.request('GET', self.path, headers={k: v for k, v in self.headers.items() if k.lower() not in ('host', 'connection', 'accept-encoding')})
            rep = conn.getresponse()
            body = rep.read()
            self.send_response(rep.status)
            for k, v in rep.getheaders():
                if k.lower() not in ('connection', 'transfer-encoding', 'content-length', 'content-encoding'):
                    self.send_header(k, v)
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (OSError, http.client.HTTPException):
            self.close_connection = True
        finally:
            conn.close()

with tempfile.TemporaryDirectory(prefix='lonodji-ios-') as dossier:
    serveur = None
    url = base
    if webkit and urlsplit(base).scheme == 'http':
        cert, key = Path(dossier)/'cert.pem', Path(dossier)/'key.pem'
        subprocess.run(['openssl', 'req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', str(key), '-out', str(cert), '-days', '1', '-subj', '/CN=localhost'], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        serveur = ThreadingHTTPServer(('127.0.0.1', 0), Passerelle)
        tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        tls.load_cert_chain(cert, key)
        serveur.socket = tls.wrap_socket(serveur.socket, server_side=True)
        threading.Thread(target=serveur.serve_forever, daemon=True).start()
        url = f'https://127.0.0.1:{serveur.server_port}'
    try:
        with sync_playwright() as p:
            browser = (p.webkit if webkit else p.chromium).launch()
            cas = 0
            for route in ('/', '/en/index', '/participer', '/secteurs'):
                for width, height, top, left, bottom in ((390,844,59,0,34), (844,390,0,44,21)):
                    context = browser.new_context(viewport={'width':width,'height':height}, is_mobile=True, has_touch=True, ignore_https_errors=webkit, service_workers='block', reduced_motion='reduce')
                    context.add_init_script("Object.defineProperty(navigator,'standalone',{get:()=>true})")
                    page = context.new_page()
                    page.goto(url+route, wait_until='networkidle')
                    expect(page.locator('html')).to_have_class(re.compile(r'is-standalone'))
                    viewport = page.locator('meta[name="viewport"]').get_attribute('content')
                    assert 'viewport-fit=cover' in viewport and 'user-scalable=no' not in viewport
                    assert page.locator('meta[name="apple-mobile-web-app-title"]').get_attribute('content') == 'LONODJI'
                    assert page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').get_attribute('content') == 'black-translucent'
                    assert page.locator('link[rel="apple-touch-icon"]').count() > 0
                    # Variables de test : les valeurs env() réelles ne sont pas fournies par WebKit Linux.
                    page.evaluate('(v)=>{for(const [k,val] of Object.entries(v))document.documentElement.style.setProperty(k,val+"px")}', {'--safe-top':top,'--safe-left':left,'--safe-right':left,'--safe-bottom':bottom})
                    page.wait_for_timeout(300)
                    assert page.evaluate('document.documentElement.scrollWidth') <= width+1
                    nav = page.locator('.nav').bounding_box()
                    assert nav['y'] >= top and nav['x'] >= left and nav['x']+nav['width'] <= width-left+1, nav
                    trigger = page.locator('.tab--menu' if width <= 800 else '.menu-toggle')
                    if width <= 800:
                        tab = page.locator('.tab--menu').bounding_box()
                        assert tab['y']+tab['height'] <= height-bottom+1, tab
                    trigger.tap()
                    page.locator('#mm-q').tap()
                    close = page.locator('.mm-close')
                    box = close.bounding_box()
                    assert box['y'] >= top and box['x'] >= left and box['x']+box['width'] <= width-left+1, box
                    close.tap()
                    page.locator('.nav-search').tap()
                    page.locator('.palette-boite').evaluate('e=>Promise.all(e.getAnimations().map(a=>a.finished))')
                    box = page.locator('.palette-fermer').bounding_box()
                    assert box['y'] >= top and box['x'] >= left and box['x']+box['width'] <= width-left+1, box
                    page.locator('.palette-fermer').tap()
                    page.locator('.nav-share').tap()
                    page.locator('.feuille-boite').evaluate('e=>Promise.all(e.getAnimations().map(a=>a.finished))')
                    box = page.locator('.feuille-fermer').bounding_box()
                    assert box['y'] >= top and box['x'] >= left and box['x']+box['width'] <= width-left+1, box
                    page.locator('.feuille-fermer').tap()
                    assert page.evaluate('document.documentElement.scrollWidth') <= width+1
                    context.close()
                    cas += 1
            browser.close()
            print(f'iOS ({"WebKit" if webkit else "Chromium"}) : {cas} vues, métadonnées Apple, mode installé, zones système simulées, menu/recherche/partage : OK. iPhone physique non testé.')
    finally:
        if serveur:
            serveur.shutdown()
            serveur.server_close()
