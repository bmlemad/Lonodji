/* ADEB LONODJI — service worker.
   But : qu'une page déjà ouverte reste lisible quand le réseau tombe.
   Ce n'est pas un mode hors ligne complet : ce qui n'a jamais été ouvert
   n'est pas disponible. Le réseau garde la priorité, pour que personne ne
   lise une version périmée quand la connexion est là. */

var VERSION = 'lonodji-next-v5';
var PAGES = VERSION + '-pages';
var ASSETS = VERSION + '-assets';
var HORS_LIGNE = '/hors-ligne';
var MAX_PAGES = 80;
var MAX_ASSETS = 150;          // fichiers statiques gardés (les plus anciens s'effacent d'abord)
var PDF_MAX = 2000000;         // les PDF de plus de 2 Mo ne sont pas gardés hors ligne
var COQUILLE = [
  '/',
  HORS_LIGNE,
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icones/icone-192.png',
  '/icones/icone-512.png',
  '/carte/territoire.svg',
  '/villages'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(PAGES).then(function (c) {
      // addAll échoue en entier si un seul fichier manque : on prend un par un.
      return Promise.all(COQUILLE.map(function (u) {
        return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.map(function (n) {
        return n === PAGES || n === ASSETS ? null : caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function estStatique(url) {
  return url.pathname.indexOf('/_next/static/') === 0 ||
    /\.(css|js|json|svg|png|jpg|jpeg|webp|gif|ico|woff2?|webmanifest)$/i.test(url.pathname);
}

function garder(nomCache, req, rep) {
  if (!rep || !rep.ok || rep.type === 'opaque') return;
  if (/\.pdf$/i.test(new URL(req.url).pathname) && Number(rep.headers.get('content-length') || 0) > PDF_MAX) return;
  var copie = rep.clone();
  caches.open(nomCache).then(function (c) {
    c.put(req, copie).then(function () {
      return c.keys().then(function (cles) {
        if (nomCache === ASSETS) {
          var surplus = cles.length - MAX_ASSETS;
          return Promise.all(cles.slice(0, surplus > 0 ? surplus : 0).map(function (k) { return c.delete(k); }));
        }
        // les pages les plus anciennes s'effacent d'abord (la coquille reste)
        var trop = cles.length - MAX_PAGES;
        return Promise.all(cles.filter(function (k) {
          var p = new URL(k.url).pathname;
          return COQUILLE.indexOf(p) === -1;
        }).slice(0, trop > 0 ? trop : 0).map(function (k) { return c.delete(k); }));
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   // rien d'extérieur n'est mis en cache
  if (url.pathname.indexOf('/api/') === 0 || url.pathname === '/__forms.html') return;

  if (req.mode === 'navigate') {
    // Réseau d'abord ; la page lue est gardée pour la prochaine coupure.
    e.respondWith(
      fetch(req).then(function (rep) {
        garder(PAGES, req, rep);
        return rep;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true, cacheName: PAGES }).then(function (dep) {
          return dep || caches.match(HORS_LIGNE, { cacheName: PAGES }).then(function (h) {
            return h || new Response(
              '<!DOCTYPE html><html lang="fr"><meta charset="utf-8">' +
              '<title>Hors ligne</title><p>Pas de connexion, et cette page ' +
              'n’a pas encore été ouverte sur cet appareil.',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
          });
        });
      })
    );
    return;
  }

  if (estStatique(url) || /\.pdf$/i.test(url.pathname)) {
    // Cache d'abord, puis rafraîchissement en arrière-plan.
    e.respondWith(
      caches.match(req, { cacheName: ASSETS }).then(function (dep) {
        var reseau = fetch(req).then(function (rep) {
          garder(ASSETS, req, rep);
          return rep;
        });
        if (dep) { reseau.catch(function () {}); return dep; }
        return reseau;
      }).catch(function () { return fetch(req); })
    );
  }
});
