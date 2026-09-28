/* ADEB LONODJI — « Trouver ma thématique » (v304, 23/09/2026).
   Tout se calcule dans le navigateur : rien n'est envoyé, rien n'est enregistré
   en dehors de l'adresse de la page (le choix est repris dans le # pour pouvoir
   être partagé ou retrouvé avec le bouton « précédent »). */
window.__initTrouver = function () {
  'use strict';
  var __root = document.querySelector("[data-tm]");
  if (!__root || __root.__inited) return;
  __root.__inited = true;
  var root = document.querySelector('[data-tm]');
  if (!root) return;

  /* ---- données : générées depuis les cartes de poles.html ---- */
  var DATA = [
  {
    "id": "memoire-heritage",
    "num": "01",
    "key": "01",
    "pole": "Pôle I · Thématique 01",
    "name": "Mémoire & héritage",
    "status": "filled",
    "coord": "Coordonnateur : Dr Bé-Rammaj Miaro-II, historien",
    "desc": "Origines, histoire des cantons, grandes figures, archives physiques et numériques et témoignages.",
    "page": [
      "/mission",
      "Explorer les origines"
    ],
    "suivi": true,
    "tier": 0
  },
  {
    "id": "culture-patrimoine-vivant",
    "num": "02",
    "key": "02",
    "pole": "Pôle I · Thématique 02",
    "name": "Culture & patrimoine vivant",
    "status": "filled",
    "coord": "Coordonnateur : Dr Yaphete Madjirabé",
    "desc": "Langues et parlers sara, à commencer par le bedjond (bedjond, bebote, yom, pen, maguer), berceau du mouvement.",
    "page": [
      "/mission",
      "Langue & culture bedjond"
    ],
    "suivi": true,
    "tier": 0
  },
  {
    "id": "savoirs-innovation",
    "num": "03",
    "key": "03",
    "pole": "Pôle I · Thématique 03",
    "name": "Recherche & savoirs",
    "status": "filled",
    "coord": "Coordonnateur : Sylvain Nomaye, ingénieur de conception en informatique",
    "desc": "Travaux universitaires, publications et valorisation de nos chercheurs, portées par le programme Bedjond Digital Heritage…",
    "page": [
      "/dossiers/recherche",
      "Base de recherche"
    ],
    "suivi": true,
    "tier": 0
  },
  {
    "id": "agriculture-elevage-securite-alimentaire",
    "num": "04",
    "key": "04",
    "pole": "Pôle II · Thématique 04",
    "name": "Agriculture, élevage & sécurité alimentaire",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Agriculture, élevage et sécurité alimentaire, sur une terre d’agriculture et d’élevage qui reste, aujourd’hui encore, le premier moyen de subsistance des villages du Mandoul Occidental.",
    "page": [
      "/dossiers/agriculture-securite-alimentaire",
      "Hub filières & appuis techniques"
    ],
    "suivi": true,
    "tier": 2
  },
  {
    "id": "entrepreneuriat-finance-inclusive",
    "num": "05",
    "key": "05",
    "pole": "Pôle II · Thématique 05",
    "name": "Entrepreneuriat & finance inclusive",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Commerce, emploi et initiatives économiques portées par les membres de la communauté.",
    "page": null,
    "suivi": true,
    "tier": 2
  },
  {
    "id": "environnement-ressources",
    "num": "06",
    "key": "06",
    "pole": "Pôle II · Thématique 06",
    "name": "Environnement & ressources naturelles",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Foncier, protection de l’environnement et gestion durable des ressources naturelles du territoire.",
    "page": [
      "/dossiers/environnement",
      "Environnement & durabilité"
    ],
    "suivi": true,
    "tier": 2
  },
  {
    "id": "eau-energie-connectivite",
    "num": "07",
    "key": "07",
    "pole": "Pôle II · Thématique 07",
    "name": "Eau, énergie & connectivité",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Accès à l’eau potable, à l’électricité et à la connexion internet : trois priorités identifiées par la communauté, encore insuffisantes sur le territoire.",
    "page": null,
    "suivi": true,
    "tier": 1
  },
  {
    "id": "desenclavement-urbanisation",
    "num": "08",
    "key": "08",
    "pole": "Pôle II · Thématique 08",
    "name": "Désenclavement & urbanisation",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Pistes et routes, désenclavement de Bédjondo : l’état des routes vers N’Djamena et les marchés régionaux pèse directement sur les échanges économiques et sur l’exode des jeunes évoqué par…",
    "page": [
      "/dossiers/air-bedjondo",
      "Air Bedjondo"
    ],
    "suivi": true,
    "tier": 1
  },
  {
    "id": "jeunesse-reussite",
    "num": "09",
    "key": "09",
    "pole": "Pôle II · Thématique 09",
    "name": "Jeunesse & réussite",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Orientation, mentorat, bourses, réussite scolaire, promotion de l’excellence, sport et loisirs pour les jeunes de la communauté.",
    "page": null,
    "suivi": true,
    "tier": 1
  },
  {
    "id": "leadership-feminin",
    "num": "10",
    "key": "10",
    "pole": "Pôle II · Thématique 10",
    "name": "Genre & autonomisation des femmes",
    "status": "filled",
    "coord": "Coordonnatrice : Odette Tolmbaye",
    "desc": "Autonomisation des femmes et participation pleine et entière aux décisions et au développement communautaire.",
    "page": [
      "/dossiers/veuves",
      "Plan pour les veuves"
    ],
    "suivi": true,
    "tier": 0
  },
  {
    "id": "sante-prevention",
    "num": "11",
    "key": "11",
    "pole": "Pôle II · Thématique 11",
    "name": "Santé & prévention",
    "status": "filled",
    "coord": "Coordonnateur : Dr Nestor Alladoumdjim",
    "desc": "Prévention, accès à des soins de santé de qualité — encore insuffisant sur le territoire — et sensibilisation sanitaire.",
    "page": null,
    "suivi": true,
    "tier": 0
  },
  {
    "id": "solidarite-inclusion",
    "num": "12",
    "key": "12",
    "pole": "Pôle II · Thématique 12",
    "name": "Protection sociale & inclusion",
    "status": "filled",
    "coord": "Coordonnatrice : Solkem Ngarmbatina",
    "desc": "Accompagnement social, soutien aux familles, solidarité dans les moments difficiles et aide d’urgence en cas de catastrophe ou d’épidémie.",
    "page": [
      "/dossiers/solidarite-inclusion",
      "Hub Personnes vulnérables"
    ],
    "suivi": true,
    "tier": 0
  },
  {
    "id": "gouvernance-plaidoyer",
    "num": "13",
    "key": "13",
    "pole": "Pôle III · Thématique 13",
    "name": "Gouvernance & plaidoyer",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Organisation communautaire, modernisation d’ADEB LONODJI, relations avec la chefferie traditionnelle, représentation et défense de nos intérêts, accès à l’état civil et aux droits.",
    "page": [
      "/actions",
      "Nos plaidoyers"
    ],
    "suivi": true,
    "tier": 1
  },
  {
    "id": "paix-cohesion",
    "num": "14",
    "key": "14",
    "pole": "Pôle III · Thématique 14",
    "name": "Paix & cohésion",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Prévention et règlement des conflits, médiation, relations avec les communautés voisines et dialogue entre les religions.",
    "page": [
      "/dossiers/agriculteurs-eleveurs",
      "Paix agriculteurs-éleveurs"
    ],
    "suivi": true,
    "tier": 2
  },
  {
    "id": "reseau-experts-diaspora",
    "num": "15",
    "key": "15",
    "pole": "Pôle III · Thématique 15",
    "name": "Réseau d’experts & diaspora",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Recensement et mise en relation des cadres et experts de la communauté, liens avec la diaspora, coopération nationale et internationale.",
    "page": [
      "/dossiers/evenements",
      "Événements"
    ],
    "suivi": false,
    "tier": 3
  },
  {
    "id": "justice-droits-homme",
    "num": "16",
    "key": "16",
    "pole": "Pôle III · Thématique 16",
    "name": "Justice & droits humains",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Sensibilisation au droit et à l’accès à la justice, veille et alerte sur les atteintes aux droits humains touchant la communauté…",
    "page": [
      "/dossiers/veuves",
      "Plan veuves"
    ],
    "suivi": false,
    "tier": 3
  },
  {
    "id": "transformation-numerique-services",
    "num": "17",
    "key": "17",
    "pole": "Pôle IV · Thématique 17",
    "name": "Transformation numérique & services",
    "status": "filled",
    "coord": "Coordonnateur : Bignéro Moïalbéi LE MADANG",
    "desc": "Faire entrer les services du quotidien dans le numérique, à Bédjondo comme dans les cantons…",
    "page": [
      "/dossiers/espace-numerique",
      "Espace numérique"
    ],
    "suivi": false,
    "tier": 3
  },
  {
    "id": "intelligence-artificielle-donnees",
    "num": "18",
    "key": "18",
    "pole": "Pôle IV · Thématique 18",
    "name": "Intelligence artificielle & données",
    "status": "filled",
    "coord": "Coordonnateur : Bignéro Moïalbéi LE MADANG",
    "desc": "Mettre l’intelligence artificielle et les données au service de la communauté.",
    "page": [
      "/dossiers/drones-innovation",
      "Drones & innovation"
    ],
    "suivi": false,
    "tier": 3
  },
  {
    "id": "competences-entrepreneuriat-numerique",
    "num": "19",
    "key": "19",
    "pole": "Pôle IV · Thématique 19",
    "name": "Compétences & entrepreneuriat numérique",
    "status": "filled",
    "coord": "Coordonnateur : Bignéro Moïalbéi LE MADANG",
    "desc": "Former les jeunes de Bédjondo aux métiers du numérique et leur ouvrir des débouchés sur place : initiation à l’informatique, au code, au design et aux outils bureautiques…",
    "page": null,
    "suivi": false,
    "tier": 3
  },
  {
    "id": "cellule-financement-ressources",
    "num": "",
    "key": "financement",
    "pole": "Cellule transversale",
    "name": "Financement & ressources",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Cotisations, collecte de fonds, recherche de financements et gestion transparente des ressources au service de toutes les thématiques.",
    "page": [
      "/documents",
      "Documents"
    ],
    "suivi": false,
    "tier": 0
  },
  {
    "id": "cellule-communication-numerique",
    "num": "",
    "key": "communication",
    "pole": "Cellule transversale",
    "name": "Communication & numérique",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Animation de l’association, diffusion des informations et conservation des documents produits par l’ensemble des thématiques — dont ce site, et l’espace Documents.",
    "page": [
      "/documents",
      "Documents"
    ],
    "suivi": false,
    "tier": 0
  }
];

  /* ---- ce que l'on peut cocher : chaque case pèse sur des thématiques
         principales (3 points) et secondaires (1 point) ---- */
  var CHIPS = {
  "agri": {
    "label": "Agriculture, élevage",
    "p": [
      "agriculture-elevage-securite-alimentaire"
    ],
    "s": [
      "paix-cohesion",
      "environnement-ressources"
    ]
  },
  "envi": {
    "label": "Environnement, eau, énergie",
    "p": [
      "environnement-ressources",
      "eau-energie-connectivite"
    ],
    "s": [
      "agriculture-elevage-securite-alimentaire"
    ]
  },
  "sante": {
    "label": "Santé, prévention",
    "p": [
      "sante-prevention"
    ],
    "s": [
      "solidarite-inclusion"
    ]
  },
  "educ": {
    "label": "Éducation, jeunesse, formation",
    "p": [
      "jeunesse-reussite",
      "competences-entrepreneuriat-numerique"
    ],
    "s": [
      "savoirs-innovation"
    ]
  },
  "droit": {
    "label": "Droit, justice, administration",
    "p": [
      "justice-droits-homme",
      "gouvernance-plaidoyer"
    ],
    "s": [
      "leadership-feminin"
    ]
  },
  "femmes": {
    "label": "Femmes, égalité",
    "p": [
      "leadership-feminin"
    ],
    "s": [
      "solidarite-inclusion",
      "justice-droits-homme"
    ]
  },
  "social": {
    "label": "Action sociale, handicap, entraide",
    "p": [
      "solidarite-inclusion"
    ],
    "s": [
      "justice-droits-homme",
      "leadership-feminin"
    ]
  },
  "histoire": {
    "label": "Histoire, mémoire, patrimoine",
    "p": [
      "memoire-heritage"
    ],
    "s": [
      "culture-patrimoine-vivant",
      "savoirs-innovation"
    ]
  },
  "langue": {
    "label": "Langue bedjond, culture, arts",
    "p": [
      "culture-patrimoine-vivant"
    ],
    "s": [
      "memoire-heritage",
      "intelligence-artificielle-donnees"
    ]
  },
  "recherche": {
    "label": "Recherche, université",
    "p": [
      "savoirs-innovation"
    ],
    "s": [
      "memoire-heritage",
      "intelligence-artificielle-donnees"
    ]
  },
  "num": {
    "label": "Informatique, numérique, données",
    "p": [
      "transformation-numerique-services",
      "intelligence-artificielle-donnees"
    ],
    "s": [
      "competences-entrepreneuriat-numerique",
      "cellule-communication-numerique"
    ]
  },
  "comm": {
    "label": "Communication, rédaction, médias",
    "p": [
      "cellule-communication-numerique"
    ],
    "s": [
      "gouvernance-plaidoyer",
      "savoirs-innovation"
    ]
  },
  "finance": {
    "label": "Finance, gestion, entrepreneuriat",
    "p": [
      "entrepreneuriat-finance-inclusive",
      "cellule-financement-ressources"
    ],
    "s": [
      "competences-entrepreneuriat-numerique"
    ]
  },
  "urba": {
    "label": "Urbanisme, routes, transport, BTP",
    "p": [
      "desenclavement-urbanisation"
    ],
    "s": [
      "eau-energie-connectivite"
    ]
  },
  "gouv": {
    "label": "Relations institutionnelles, plaidoyer",
    "p": [
      "gouvernance-plaidoyer"
    ],
    "s": [
      "reseau-experts-diaspora",
      "justice-droits-homme"
    ]
  },
  "paix": {
    "label": "Médiation, dialogue, cohésion",
    "p": [
      "paix-cohesion"
    ],
    "s": [
      "gouvernance-plaidoyer"
    ]
  },
  "diaspora": {
    "label": "Diaspora, réseaux, mise en relation",
    "p": [
      "reseau-experts-diaspora"
    ],
    "s": [
      "cellule-financement-ressources",
      "entrepreneuriat-finance-inclusive"
    ]
  }
};

  /* ---- où l'on est : +1 point aux thématiques qui se jouent surtout là ---- */
  var LOC = {
  "terrain": {
    "label": "Vous êtes à Bédjondo ou dans le Mandoul",
    "ids": [
      "agriculture-elevage-securite-alimentaire",
      "environnement-ressources",
      "eau-energie-connectivite",
      "desenclavement-urbanisation",
      "sante-prevention",
      "solidarite-inclusion",
      "paix-cohesion",
      "culture-patrimoine-vivant",
      "transformation-numerique-services"
    ]
  },
  "tchad": {
    "label": "Vous êtes ailleurs au Tchad",
    "ids": [
      "gouvernance-plaidoyer",
      "reseau-experts-diaspora",
      "savoirs-innovation",
      "entrepreneuriat-finance-inclusive",
      "jeunesse-reussite",
      "leadership-feminin"
    ]
  },
  "diaspora": {
    "label": "Vous êtes dans la diaspora",
    "ids": [
      "reseau-experts-diaspora",
      "intelligence-artificielle-donnees",
      "competences-entrepreneuriat-numerique",
      "entrepreneuriat-finance-inclusive",
      "savoirs-innovation",
      "cellule-financement-ressources",
      "cellule-communication-numerique"
    ]
  }
};

  var BY_ID = {};
  DATA.forEach(function (d) { BY_ID[d.id] = d; });

  var chips = Array.prototype.slice.call(root.querySelectorAll('.tm-chip'));
  var locInputs = Array.prototype.slice.call(root.querySelectorAll('input[name="tm-lieu"]'));
  var timeInputs = Array.prototype.slice.call(root.querySelectorAll('input[name="tm-temps"]'));
  var results = root.querySelector('[data-tm-results]');
  var summary = root.querySelector('[data-tm-summary]');
  var title = root.querySelector('[data-tm-title]');
  var resetBtn = root.querySelector('[data-tm-reset]');
  var counter = root.querySelector('[data-tm-count]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MOTS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept'];
  function mot(n, fem) { var m = MOTS[n]; if (!m) return String(n); return (n === 1 && fem) ? 'une' : m; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function selectedChips() { return chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).map(function (c) { return c.getAttribute('data-k'); }); }
  function checked(list) { var v = null; list.forEach(function (i) { if (i.checked) v = i.value; }); return v; }

  function score(sel, lieu) {
    var pts = {}, why = {};
    sel.forEach(function (k) {
      var c = CHIPS[k]; if (!c) return;
      c.p.forEach(function (id) { pts[id] = (pts[id] || 0) + 3; (why[id] = why[id] || []).push(c.label); });
      c.s.forEach(function (id) { pts[id] = (pts[id] || 0) + 1; (why[id] = why[id] || []).push(c.label); });
    });
    if (lieu && LOC[lieu]) {
      LOC[lieu].ids.forEach(function (id) { if (pts[id]) { pts[id] += 1; (why[id] = why[id] || []).push(LOC[lieu].label); } });
    }
    var out = [];
    Object.keys(pts).forEach(function (id) {
      var d = BY_ID[id]; if (!d) return;
      var s = pts[id] + (d.status === 'open' ? 0.5 : 0);
      out.push({ d: d, score: s, why: why[id] || [] });
    });
    out.sort(function (a, b) { return b.score - a.score || (a.d.num < b.d.num ? -1 : 1); });
    return out;
  }

  function badge(d) {
    return d.status === 'open'
      ? '<span class="pole-status pole-status--vacant">À pourvoir</span>'
      : '<span class="pole-status pole-status--pourvu">Pourvu</span>';
  }
  function flag(d) {
    if (d.status !== 'open') return '';
    if (d.tier === 1) return '<p class="tm-flag">Dossiers prêts&nbsp;: problématiques documentées et plaidoyer déjà publié. Il ne manque qu&rsquo;une personne pour les porter.</p>';
    if (d.tier === 2) return '<p class="tm-flag">Diagnostic fait, plaidoyer encore à écrire.</p>';
    if (d.tier === 3) return '<p class="tm-flag">Chantier tourné vers l&rsquo;avenir&nbsp;: tout reste à construire.</p>';
    return '';
  }
  function cta(d, temps) {
    var href = '/participer?theme=' + encodeURIComponent(d.key);
    if (d.status === 'open') {
      if (temps === 'peu') return '<a class="btn btn-primary" href="' + href + '">Proposer mon aide</a>';
      return '<a class="btn btn-primary" href="' + href + '&amp;coordo=1">Me porter volontaire</a>';
    }
    return '<a class="btn btn-primary" href="' + href + '">Rejoindre l&rsquo;équipe</a>';
  }
  function card(r, rank, temps) {
    var d = r.d;
    var uniq = []; r.why.forEach(function (w) { if (uniq.indexOf(w) < 0) uniq.push(w); });
    var why = uniq.length ? '<p class="tm-why"><strong>Pourquoi&nbsp;:</strong> ' + uniq.map(function (w) { return '<em>' + esc(w) + '</em>'; }).join(' · ') + '</p>' : '';
    var links = '<a class="pole-hub-link" href="/programmes#' + esc(d.id) + '">Voir la thématique &rarr;</a>';
    if (d.page) links += '<a class="pole-hub-link" href="' + esc(d.page[0]) + '">' + esc(d.page[1]) + ' &rarr;</a>';
    if (d.suivi) links += '<a class="pole-hub-link" href="/impact#' + esc(d.id) + '">Suivi &rarr;</a>';
    var coord = d.status === 'open' ? '' : '<p class="tm-coord">' + esc(d.coord) + '</p>';
    return '<article class="tm-card' + (rank <= 3 ? ' is-top' : '') + '">'
      + (rank <= 3 ? '<span class="tm-rank">Proposition ' + rank + '</span>' : '')
      + '<div class="tm-card-head"><span class="pole-num">' + esc(d.pole) + '</span>' + badge(d) + '</div>'
      + '<h3><a href="/programmes#' + esc(d.id) + '">' + esc(d.name) + '</a></h3>'
      + coord
      + '<p class="tm-desc">' + esc(d.desc) + '</p>'
      + why + flag(d)
      + '<div class="tm-actions">' + cta(d, temps) + links + '</div>'
      + '</article>';
  }

  function emptyState() {
    var groups = [
      [1, 'Dossiers prêts, il ne manque qu&rsquo;un coordonnateur'],
      [2, 'Diagnostic fait, plaidoyer à écrire'],
      [3, 'Chantiers tournés vers l&rsquo;avenir']
    ];
    var html = '<div class="tm-empty">';
    groups.forEach(function (g) {
      var items = DATA.filter(function (d) { return d.status === 'open' && d.tier === g[0]; });
      if (!items.length) return;
      html += '<div class="tm-group"><h3>' + g[1] + '</h3><div class="tm-group-list">'
        + items.map(function (d) { return '<a href="/programmes#' + esc(d.id) + '"><span class="tm-group-num">' + esc(d.num) + '</span>' + esc(d.name) + '</a>'; }).join('')
        + '</div></div>';
    });
    var cells = DATA.filter(function (d) { return d.status === 'open' && d.tier === 0; });
    if (cells.length) {
      html += '<div class="tm-group"><h3>Et deux cellules qui appuient toutes les thématiques</h3><div class="tm-group-list">'
        + cells.map(function (d) { return '<a href="/programmes#' + esc(d.id) + '">' + esc(d.name) + '</a>'; }).join('')
        + '</div></div>';
    }
    return html + '</div>';
  }

  function render() {
    var sel = selectedChips(), lieu = checked(locInputs), temps = checked(timeInputs);
    var open = DATA.filter(function (d) { return d.status === 'open' && d.tier > 0; }).length;
    if (counter) counter.textContent = sel.length ? (mot(sel.length, true).replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + (sel.length > 1 ? 'cases cochées' : 'case cochée')) : 'Aucune case cochée';
    if (!sel.length) {
      title.textContent = 'Cochez une case pour commencer';
      summary.innerHTML = 'En attendant, voici les ' + mot(open) + ' thématiques qui attendent un coordonnateur ou une coordonnatrice, par ordre d&rsquo;urgence.';
      results.innerHTML = emptyState();
      writeHash(sel, lieu, temps);
      return;
    }
    var ranked = score(sel, lieu).slice(0, 6);
    var n = Math.min(3, ranked.length);
    title.textContent = n === 1 ? 'Une thématique pour vous' : ['Deux', 'Trois'][n - 2] + ' thématiques pour vous';
    var openN = ranked.slice(0, 3).filter(function (r) { return r.d.status === 'open'; }).length;
    summary.innerHTML = 'D&rsquo;après ' + (sel.length > 1 ? 'vos ' + mot(sel.length) + ' choix' : 'votre choix')
      + (lieu && LOC[lieu] ? ' et votre situation' : '') + '. '
      + (openN ? (openN === n ? (n === 1 ? 'Elle attend' : 'Toutes attendent') : (openN === 1 ? 'L&rsquo;une d&rsquo;elles attend' : 'Deux d&rsquo;entre elles attendent')) + ' encore un coordonnateur&nbsp;: votre candidature y changerait tout. ' : '')
      + (temps === 'peu' ? 'Quelques heures par mois suffisent pour relire, vérifier, rédiger ou accompagner une démarche.' : 'Cochez d&rsquo;autres cases pour affiner, ou changez de lieu.');
    results.innerHTML = ranked.map(function (r, i) { return card(r, i + 1, temps); }).join('');
    writeHash(sel, lieu, temps);
  }

  /* ---- adresse partageable ---- */
  function writeHash(sel, lieu, temps) {
    if (!window.history || !history.replaceState) return;
    var parts = [];
    if (sel.length) parts.push('c=' + sel.join(','));
    if (lieu) parts.push('l=' + lieu);
    if (temps) parts.push('t=' + temps);
    var h = parts.length ? '#' + parts.join(';') : location.pathname + location.search;
    history.replaceState(null, '', h);
  }
  function readHash() {
    var h = location.hash.replace(/^#/, ''); if (!h || h.indexOf('=') < 0) return;
    h.split(';').forEach(function (p) {
      var kv = p.split('='); if (kv.length !== 2) return;
      if (kv[0] === 'c') kv[1].split(',').forEach(function (k) { chips.forEach(function (c) { if (c.getAttribute('data-k') === k) c.setAttribute('aria-pressed', 'true'); }); });
      if (kv[0] === 'l') locInputs.forEach(function (i) { if (i.value === kv[1]) i.checked = true; });
      if (kv[0] === 't') timeInputs.forEach(function (i) { if (i.value === kv[1]) i.checked = true; });
    });
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      render();
    });
  });
  locInputs.concat(timeInputs).forEach(function (i) { i.addEventListener('change', render); });
  if (resetBtn) resetBtn.addEventListener('click', function () {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    locInputs.concat(timeInputs).forEach(function (i) { i.checked = false; });
    render();
    chips[0].focus();
  });
  var goBtn = root.querySelector('[data-tm-go]');
  if (goBtn) goBtn.addEventListener('click', function () {
    var target = root.querySelector('#resultats');
    if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  readHash();
  render();
};
window.__initTrouver();
