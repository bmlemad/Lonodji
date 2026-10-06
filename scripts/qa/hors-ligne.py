#!/usr/bin/env python3
"""Lecture PWA après une coupure réelle de la passerelle locale (pas du cache HTTP).
Aucun POST transmis : le formulaire utilise uniquement une réponse simulée.
"""
import asyncio
import http.client
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
from playwright.async_api import async_playwright, expect

cible = urlsplit(sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3100')
etat = {'coupe': False, 'lent': False, 'posts': 0}

class Passerelle(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if etat['coupe']:
            self.close_connection = True
            return
        if etat['lent'] and urlsplit(self.path).path == '/impact' and not self.headers.get('RSC'):
            time.sleep(6)
        connexion = http.client.HTTPConnection(cible.hostname, cible.port, timeout=15)
        try:
            headers = {k: v for k, v in self.headers.items() if k.lower() not in ('host', 'connection', 'accept-encoding')}
            connexion.request('GET', self.path, headers=headers)
            rep = connexion.getresponse()
            contenu = rep.read()
            self.send_response(rep.status)
            for k, v in rep.getheaders():
                if k.lower() not in ('connection', 'transfer-encoding', 'content-length', 'content-encoding'):
                    self.send_header(k, v)
            self.send_header('Content-Length', str(len(contenu)))
            self.send_header('X-QA-Reprise', 'lente' if etat['lent'] else 'normale')
            self.end_headers()
            self.wfile.write(contenu)
        except (OSError, http.client.HTTPException):
            self.close_connection = True
        finally:
            connexion.close()

    def do_POST(self):
        self.rfile.read(int(self.headers.get('Content-Length', 0)))
        if etat['coupe']:
            self.close_connection = True
            return
        etat['posts'] += 1
        self.send_response(200)
        self.send_header('Content-Length', '0')
        self.end_headers()

async def attendre(page, expression, message):
    for _ in range(200):
        if await page.evaluate(expression):
            return
        await page.wait_for_timeout(100)
    raise AssertionError(message)

async def main():
    serveur = ThreadingHTTPServer(('127.0.0.1', 0), Passerelle)
    threading.Thread(target=serveur.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{serveur.server_port}'
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            context = await browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
            page = await context.new_page()
            session = await context.new_cdp_session(page)
            await session.send('Network.setCacheDisabled', {'cacheDisabled': True})
            await page.goto(base + '/favicon.svg')
            # Une mise à jour nettoie les anciennes copies privées et garde la lecture publique.
            await page.evaluate("caches.open('lonodji-next-v6-pages').then(async c=>{await c.put('/redaction',new Response('QA privée')); await c.put('/qa-page-deja-lue',new Response('QA publique'));})")
            await page.goto(base + '/', wait_until='networkidle')
            await attendre(page, '!!navigator.serviceWorker.controller', 'Worker non activé')
            assert not await page.evaluate("caches.match('/redaction', {cacheName:'lonodji-next-v6-pages'}).then(Boolean)")
            assert await page.evaluate("caches.match('/qa-page-deja-lue', {cacheName:'lonodji-next-v6-pages'}).then(Boolean)")
            await attendre(page, "caches.open('lonodji-next-v6-assets').then(c=>c.keys()).then(cles=>cles.some(r=>r.url.endsWith('.css')))", 'Styles initiaux non conservés')
            await page.locator('a.acc-bouton[href="/impact"]').click()
            await page.wait_for_url('**/impact')
            titre = await page.locator('h1').text_content()
            await attendre(page, "caches.match('/impact', {cacheName:'lonodji-next-v6-pages'}).then(Boolean)", 'Page ouverte par lien non conservée')

            etat['coupe'] = True
            rep = await page.reload(wait_until='networkidle')
            assert rep.from_service_worker
            await expect(page.locator('h1')).to_have_text(titre)
            assert await page.evaluate('document.styleSheets.length') >= 2
            assert await page.evaluate('document.documentElement.scrollWidth') <= 391
            # Une nouvelle fenêtre n'a pas de cache de navigation Next.js.
            nouvelle = await context.new_page()
            await nouvelle.goto(base + '/impact', wait_until='networkidle')
            await expect(nouvelle.locator('h1')).to_have_text(titre)
            await nouvelle.goto(base + '/programme-jamais-ouvert-qa', wait_until='networkidle')
            await expect(nouvelle.locator('h1')).to_contain_text('Pas de connexion')
            assert await nouvelle.evaluate('document.styleSheets.length') >= 2
            await nouvelle.close()

            etat['coupe'] = False
            etat['lent'] = True
            debut = time.monotonic()
            rep = await page.reload(wait_until='domcontentloaded')
            duree = time.monotonic() - debut
            assert rep.from_service_worker and 3.5 <= duree < 5.8, f'Copie lente arrivée en {duree:.1f}s'
            await attendre(page, "caches.match('/impact', {cacheName:'lonodji-next-v6-pages'}).then(r=>r?.headers.get('X-QA-Reprise')==='lente')", 'Réponse tardive non conservée')
            etat['lent'] = False

            # L'espace privé et les APIs ne doivent jamais entrer dans le cache.
            await page.goto(base + '/redaction', wait_until='networkidle')
            await page.evaluate("fetch('/api/redaction')")
            await page.wait_for_timeout(300)
            assert await page.evaluate("caches.keys().then(async noms=>(await Promise.all(noms.map(async n=>(await (await caches.open(n)).keys()).some(r=>/\\/(redaction|api)($|\\/|\\?)/.test(new URL(r.url).pathname))))).every(v=>!v))")

            await page.goto(base + '/', wait_until='networkidle')
            form = page.locator('form[name="lettre-info-pied"]')
            await form.locator('input[type="email"]').fill('qa-offline@example.invalid')
            await form.locator('input[type="checkbox"]').check()
            etat['coupe'] = True
            await form.locator('button[type="submit"]').click()
            await expect(form.locator('[role="alert"]')).to_be_visible()
            await expect(form.locator('input[type="email"]')).to_have_value('qa-offline@example.invalid')
            await expect(form.locator('input[type="checkbox"]')).to_be_checked()
            etat['coupe'] = False
            await form.locator('button[type="submit"]').click()
            await expect(page.locator('footer [role="status"]')).to_contain_text('Merci')
            assert etat['posts'] == 1
            assert await page.evaluate("caches.keys().then(async noms=>(await Promise.all(noms.map(async n=>(await (await caches.open(n)).keys()).some(r=>new URL(r.url).pathname==='/__forms.html')))).every(v=>!v))")
            await browser.close()
            print(f'PWA mobile : première visite, lien interne, réouverture, page inconnue, reprise lente ({duree:.1f}s), cache privé et formulaire après coupure : OK. Aucun envoi réel.')
    finally:
        serveur.shutdown()
        serveur.server_close()

asyncio.run(main())
