#!/usr/bin/env python3
"""Fond externe simulé : panne, reprise et perte du réseau après zoom.
Les réponses de test restent locales ; aucune requête de tuile n'est envoyée.
"""
import io
import sys
import http.client
import ssl
import subprocess
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from PIL import Image
from playwright.sync_api import sync_playwright, expect

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100').rstrip('/')
# Comme le contrôle iOS, conserver upgrade-insecure-requests avec WebKit :
# une passerelle locale HTTPS évite de modifier la CSP de production.
source = urlsplit(base)
class Passerelle(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        conn = http.client.HTTPConnection(source.hostname, source.port, timeout=20)
        try:
            conn.request('GET', self.path, headers={k: v for k, v in self.headers.items() if k.lower() not in ('host', 'connection', 'accept-encoding')})
            response = conn.getresponse()
            body = response.read()
            self.send_response(response.status)
            for key, value in response.getheaders():
                if key.lower() not in ('connection', 'transfer-encoding', 'content-length', 'content-encoding'):
                    self.send_header(key, value)
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        finally:
            conn.close()

server = None
certificate = tempfile.TemporaryDirectory(prefix='lonodji-carte-')
if '--webkit' in sys.argv and source.scheme == 'http':
    cert, key = Path(certificate.name)/'cert.pem', Path(certificate.name)/'key.pem'
    subprocess.run(['openssl', 'req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', str(key), '-out', str(cert), '-days', '1', '-subj', '/CN=localhost'], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    server = ThreadingHTTPServer(('127.0.0.1', 0), Passerelle)
    tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    tls.load_cert_chain(cert, key)
    server.socket = tls.wrap_socket(server.socket, server_side=True)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'https://127.0.0.1:{server.server_port}'
image = io.BytesIO()
Image.new('RGB', (256, 256), '#eee9df').save(image, format='PNG')
with sync_playwright() as p:
    engine = p.webkit if '--webkit' in sys.argv else p.chromium
    browser = engine.launch()
    for width, height in ((390, 844), (844, 390)):
        context = browser.new_context(viewport={'width': width, 'height': height},
                                      has_touch=True, ignore_https_errors='--webkit' in sys.argv, service_workers='block', reduced_motion='reduce')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        state = {'mode': 'panne', 'requests': 0}

        def tile(route):
            state['requests'] += 1
            failed = state['mode'] == 'panne' or (state['mode'] == 'partiel' and state['requests'] <= 4)
            route.fulfill(status=503 if failed else 200,
                          content_type='text/plain' if failed else 'image/png',
                          body=b'indisponible' if failed else image.getvalue())

        page.route('https://*.tile.openstreetmap.fr/**', tile)
        page.goto(base + '/carte', wait_until='domcontentloaded')
        page.locator('.ct-carte').scroll_into_view_if_needed()
        status = page.locator('.ct-fond [role="status"]')
        retry = page.get_by_role('button', name='Réessayer le fond de carte')
        expect(status).to_contain_text('Fond de carte indisponible', timeout=20000)
        assert page.locator('.leaflet-overlay-pane canvas').count() > 0
        stopped = state['requests']
        page.get_by_role('button', name='Zoomer', exact=True).tap()
        page.wait_for_timeout(1000)
        assert state['requests'] == stopped, 'Demandes relancées sans action de reprise'
        page.get_by_role('searchbox', name='Chercher une localité ou une unité').fill('Bédjondo')
        page.locator('#ct-resultats button').first.click()
        expect(page.locator('.ct-fiche h2')).to_contain_text('Bédjondo')
        # Attendre le déplacement de 0,8 s vers la fiche avant la reprise.
        page.wait_for_timeout(1200)
        state.update(mode='disponible', requests=0)
        retry.click()
        expect(status).to_contain_text('France affiché', timeout=20000)
        expect(retry).not_to_be_visible()
        page.wait_for_timeout(500)
        state['mode'] = 'panne'
        page.get_by_role('button', name='Zoomer', exact=True).tap()
        expect(status).to_contain_text('Fond de carte indisponible', timeout=20000)
        state.update(mode='partiel', requests=0)
        retry.click()
        expect(status).to_contain_text('partiellement', timeout=20000)
        assert page.locator('.leaflet-tile-loaded').count() > 0
        expect(retry).not_to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        assert not errors, errors
        context.close()
    browser.close()
print(f'Carte ({engine.name}) : panne initiale, arrêt des demandes, recherche, reprise, panne après zoom et fond partiel vérifiés en portrait/paysage.')

if server:
    server.shutdown()
certificate.cleanup()
