/* ADEB LONODJI — service worker.
   But : qu'une page déjà ouverte reste lisible quand le réseau tombe.
   Ce n'est pas un mode hors ligne complet : ce qui n'a jamais été ouvert
   n'est pas disponible. Le réseau garde la priorité, pour que personne ne
   lise une version périmée quand la connexion est là.
   Réseau très lent (30/09/2026) : si une page déjà lue n'est pas arrivée au bout
   de 4 secondes, sa copie enregistrée s'affiche ; la page reçue ensuite remplace
   la copie pour la prochaine fois. */
/* 06/10/2026 : garder aussi les documents ouverts par navigation Next.js
   et les fichiers de la première visite, avant que le worker la contrôle. */
var ATTENTE_MAX = 4000;

var VERSION = 'lonodji-next-v6';
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
        return fetch(new Request(u, { cache: 'reload' })).then(function (rep) {
          return garderPage(new Request(u), rep);
        }).catch(function () {});
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
    }).then(function () {
      return caches.open(PAGES).then(function (c) {
        return c.keys().then(function (cles) {
          return Promise.all(cles.filter(function (req) { return exclue(new URL(req.url)); }).map(function (req) { return c.delete(req); }));
        });
      });
    }).then(function () { return self.clients.claim(); }).then(function () {
      return self.clients.matchAll({ type: 'window' }).then(function (clients) {
        return Promise.all(clients.map(function (client) { return garderDocument(new URL(client.url)); }));
      });
    })
  );
});

function estStatique(url) {
  return url.pathname.indexOf('/_next/static/') === 0 ||
    /\.(css|js|json|svg|png|jpg|jpeg|webp|gif|ico|woff2?|webmanifest)$/i.test(url.pathname);
}

function exclue(url) {
  return url.origin !== self.location.origin || url.pathname.indexOf('/api/') === 0 ||
    /^\/redaction(?:\/|$)/.test(url.pathname) || url.pathname === '/__forms.html';
}

function peutGarder(rep) {
  return rep && rep.ok && rep.type !== 'opaque' && !/\b(no-store|private)\b/i.test(rep.headers.get('cache-control') || '');
}

function garder(nomCache, req, rep) {
  if (!peutGarder(rep)) return Promise.resolve();
  if (/\.pdf$/i.test(new URL(req.url).pathname) && Number(rep.headers.get('content-length') || 0) > PDF_MAX) return Promise.resolve();
  var copie = rep.clone();
  return caches.open(nomCache).then(function (c) {
    return c.put(req, copie).then(function () {
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
  }).catch(function () {}); // quota ou stockage indisponible : la lecture continue
}

function garderPage(req, rep) {
  if (!peutGarder(rep)) return Promise.resolve();
  var html = /text\/html/i.test(rep.headers.get('content-type') || '') ? rep.clone().text() : Promise.resolve('');
  return Promise.all([garder(PAGES, req, rep), html.then(function (texte) {
    var fichiers = [];
    var attribut = /(?:href|src)="([^"]+)"/g;
    var match;
    while ((match = attribut.exec(texte))) {
      var url = new URL(match[1].replace(/&amp;/g, '&'), req.url);
      if (url.origin === self.location.origin && url.pathname.indexOf('/_next/static/') === 0 && fichiers.indexOf(url.href) === -1) fichiers.push(url.href);
    }
    return Promise.all(fichiers.map(function (u) {
      return caches.match(u, { cacheName: ASSETS }).then(function (dep) {
        if (dep) return; // les fichiers à empreinte ne changent pas
        return fetch(u).then(function (rep) { return garder(ASSETS, new Request(u), rep); });
      }).catch(function () {});
    }));
  })]);
}

var documentsEnCours = {};
function garderDocument(url) {
  if (exclue(url)) return Promise.resolve();
  url.searchParams.delete('_rsc');
  var u = url.href;
  if (documentsEnCours[u]) return documentsEnCours[u];
  documentsEnCours[u] = fetch(new Request(u)).then(function (rep) {
    return garderPage(new Request(u), rep);
  }).catch(function () {}).then(function () { delete documentsEnCours[u]; });
  return documentsEnCours[u];
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (exclue(url)) return; // aucun envoi, API, espace privé ou fichier extérieur

  // Un clic Next.js reçoit un flux React, pas le document HTML. Conserver
  // celui-ci séparément permet de rouvrir cette page après fermeture hors ligne.
  // Aucun préchargement de lien : seules les pages effectivement demandées.
  if (req.headers.get('RSC') === '1' && !req.headers.has('Next-Router-Prefetch')) {
    var navigation = fetch(req);
    e.respondWith(navigation);
    e.waitUntil(navigation.then(function (rep) { if (rep.ok) return garderDocument(url); }).catch(function () {}));
    return;
  }

  if (req.mode === 'navigate') {
    // Réseau d'abord ; la page lue est gardée pour la prochaine coupure.
    // Au-delà de ATTENTE_MAX, la copie enregistrée (s'il y en a une) répond à la place du réseau.
    var reseau = fetch(req);
    var lent = new Promise(function (ok) {
      setTimeout(function () {
        caches.match(req, { ignoreSearch: true, cacheName: PAGES }).then(function (dep) { if (dep) ok(dep); });
      }, ATTENTE_MAX);
    });
    // la page reçue après coup est quand même enregistrée
    e.waitUntil(reseau.then(function (rep) { return garderPage(req, rep); }).catch(function () {}));
    e.respondWith(
      Promise.race([reseau, lent]).catch(function () {
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
    var rafraichir = fetch(req).then(function (rep) {
      return garder(ASSETS, req, rep).then(function () { return rep; });
    });
    e.waitUntil(rafraichir.catch(function () {}));
    e.respondWith(
      caches.match(req, { cacheName: ASSETS }).then(function (dep) {
        return dep || rafraichir;
      })
    );
  }
});
