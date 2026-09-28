
/* ------------------------------------------------------------------
   La carte du pays bedjond, interactive.

   Une seule geometrie, projetee une fois (Albers equivalent) a partir
   des frontieres GADM, reutilisee sur les trois pages. Tout est contenu
   dans la page : aucune tuile, aucune bibliotheque, aucun appel reseau.
   La carte fonctionne donc hors ligne, dans le service worker, et sur
   une connexion de village.

   Le deplacement au doigt demande deux doigts : un seul doigt fait
   defiler la page, comme partout ailleurs. A la souris, le glissement
   simple deplace la carte. La molette seule ne capture jamais le
   defilement de la page : il faut Ctrl (ou Cmd) pour zoomer.
   ------------------------------------------------------------------ */
window.__initGeo = function () {
  var figures = document.querySelectorAll('[data-geo]:not([data-geo-pret])');
  if (!figures.length) return;

  var ZOOM_MAX = 9;
  var PAS = 1.55;
  var doux = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function borne(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function Carte(fig) {
    var svg = fig.querySelector('.geo-svg');
    var plan = fig.querySelector('[data-geo-plan]');
    var panneau = fig.querySelector('[data-geo-panneau]');
    var balise = fig.querySelector('[data-geo-donnees]');
    if (!svg || !plan || !balise) return;

    var base = svg.getAttribute('data-geo-base').split(/\s+/).map(Number);
    var donnees = {};
    try { donnees = JSON.parse(balise.textContent || '{}'); } catch (e) { return; }

    // Cadrage qu'obtiendrait chaque unite si on la selectionnait : seule
    // source de verite, reutilisee par selectionner() plus bas et par le
    // calcul des bornes de deplacement juste apres.
    function cadrageDe(d) {
      var m = Math.max(d.bw, d.bh * base[2] / base[3]) * 0.16 + 10;
      var w = Math.max(d.bw + 2 * m, (d.bh + 2 * m) * base[2] / base[3]);
      var h = w * base[3] / base[2];
      return { x: d.bx + d.bw / 2 - w / 2, y: d.by + d.bh / 2 - h / 2, w: w, h: h };
    }

    // Bornes de deplacement : la marge d'origine (60% du cadre de depart)
    // elargie, unite par unite, a l'exact cadrage de selectionner() -- ainsi
    // chaque lieu de la liste reste entierement atteignable en glissant ou
    // en zoomant, meme la diaspora bien au-dela du coeur (Koumogo,
    // Moussafoyo, Moissala au Moyen-Chari/Barh Sara).
    var limGauche = base[0] - base[2] * 0.6, limDroite = base[0] + base[2] * 1.6;
    var limHaut = base[1] - base[3] * 0.6, limBas = base[1] + base[3] * 1.6;
    Object.keys(donnees).forEach(function (id) {
      var c = cadrageDe(donnees[id]);
      limGauche = Math.min(limGauche, c.x);
      limHaut = Math.min(limHaut, c.y);
      limDroite = Math.max(limDroite, c.x + c.w);
      limBas = Math.max(limBas, c.y + c.h);
    });

    var vue = base.slice();
    var choisi = null;
    var ech = fig.querySelector('.geo-ech');
    var echTrait = fig.querySelector('[data-geo-ech-trait]');
    var echTxt = fig.querySelector('[data-geo-ech-txt]');
    var nord = fig.querySelector('.geo-nord');
    var uParKm = parseFloat(fig.getAttribute('data-geo-km')) || 7.644;

    // --- rendu -----------------------------------------------------
    function appliquer() {
      svg.setAttribute('viewBox', vue.map(function (v) { return Math.round(v * 10) / 10; }).join(' '));
      var k = base[2] / vue[2];                      // facteur de grossissement
      fig.style.setProperty('--geo-k', k.toFixed(3));
      decorer(k);
    }

    function decorer(k) {
      // L'echelle et la rose restent dans le coin, a taille d'ecran constante.
      if (ech && echTrait && echTxt) {
        var large = vue[2] * 0.32;
        var km = 1;
        [1, 2, 5, 10, 20, 50, 100].forEach(function (v) { if (v * uParKm <= large) km = v; });
        var w = km * uParKm;
        var x = vue[0] + 16 / k * (base[2] / base[2]);
        var pad = 14 / k;
        x = vue[0] + pad + 8 / k;
        var y = vue[1] + vue[3] - pad - 10 / k;
        echTrait.setAttribute('d', 'M' + x + ' ' + y + ' h' + w +
                              ' M' + x + ' ' + (y - 3.5 / k) + ' v' + (7 / k) +
                              ' M' + (x + w) + ' ' + (y - 3.5 / k) + ' v' + (7 / k));
        echTxt.setAttribute('x', x + w + 7 / k);
        echTxt.setAttribute('y', y + 3.5 / k);
        echTxt.textContent = km + ' km';
        var f = ech.querySelector('.geo-ech-fond');
        if (f) {
          f.setAttribute('x', x - 8 / k); f.setAttribute('y', y - 17 / k);
          f.setAttribute('width', w + 52 / k); f.setAttribute('height', 26 / k);
          f.setAttribute('rx', 6 / k);
        }
      }
      if (nord) {
        var nx = vue[0] + vue[2] - 34 / k, ny = vue[1] + 30 / k;
        nord.setAttribute('transform',
          'translate(' + nx + ' ' + ny + ') scale(' + (1 / k) + ') translate(' + (-nx) + ' ' + (-ny) + ')');
        var c = nord.querySelector('.geo-nord-fond'), a = nord.querySelector('.geo-nord-aig'),
            t = nord.querySelector('.geo-nord-txt');
        if (c) { c.setAttribute('cx', nx); c.setAttribute('cy', ny); }
        if (a) a.setAttribute('d', 'M' + nx + ' ' + (ny - 12) + ' l6 13 -6 -4 -6 4 Z');
        if (t) { t.setAttribute('x', nx); t.setAttribute('y', ny + 15); }
      }
    }

    function aller(cible, anime) {
      cible = cible.slice();
      // On ne sort jamais completement du fond de carte.
      cible[2] = borne(cible[2], base[2] / ZOOM_MAX, base[2] * 1.15);
      cible[3] = cible[2] * base[3] / base[2];
      cible[0] = borne(cible[0], limGauche, limDroite - cible[2]);
      cible[1] = borne(cible[1], limHaut, limBas - cible[3]);
      if (!anime || !doux) { vue = cible; appliquer(); return; }
      var depart = vue.slice(), t0 = null, duree = 380;
      function pas(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / duree, 1);
        var e = 1 - Math.pow(1 - p, 3);
        vue = depart.map(function (v, i) { return v + (cible[i] - v) * e; });
        appliquer();
        if (p < 1) requestAnimationFrame(pas);
      }
      requestAnimationFrame(pas);
    }

    function zoomer(facteur, cx, cy) {
      var nw = vue[2] / facteur;
      nw = borne(nw, base[2] / ZOOM_MAX, base[2] * 1.15);
      var nh = nw * base[3] / base[2];
      if (cx === undefined) { cx = vue[0] + vue[2] / 2; cy = vue[1] + vue[3] / 2; }
      var rx = (cx - vue[0]) / vue[2], ry = (cy - vue[1]) / vue[3];
      aller([cx - rx * nw, cy - ry * nh, nw, nh], false);
    }

    // --- coordonnees ------------------------------------------------
    function versSvg(clientX, clientY) {
      var r = svg.getBoundingClientRect();
      // preserveAspectRatio="xMidYMid meet" : on retrouve l'echelle reelle
      var s = Math.min(r.width / vue[2], r.height / vue[3]);
      var ox = (r.width - vue[2] * s) / 2, oy = (r.height - vue[3] * s) / 2;
      return { x: vue[0] + (clientX - r.left - ox) / s, y: vue[1] + (clientY - r.top - oy) / s };
    }

    // --- selection --------------------------------------------------
    function selectionner(id, anime) {
      var d = donnees[id];
      if (!d) return;
      choisi = id;
      Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-u]'), function (p) {
        p.classList.toggle('is-choisi', p.getAttribute('data-geo-u') === id);
      });
      Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-pt]'), function (p) {
        p.classList.toggle('is-choisi', p.getAttribute('data-geo-pt') === id);
      });
      Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-nom]'), function (p) {
        p.classList.toggle('is-choisi', p.getAttribute('data-geo-nom') === id);
      });
      Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-choix]'), function (b) {
        var on = b.getAttribute('data-geo-choix') === id;
        b.classList.toggle('is-choisi', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (panneau) {
        var h = document.createElement('div');
        h.className = 'geo-fiche';
        var t = document.createElement('h3');
        t.className = 'geo-fiche-titre';
        t.textContent = d.nom;
        var s2 = document.createElement('p');
        s2.className = 'geo-fiche-lieu';
        s2.textContent = d.dep + ' · ' + d.prov;
        h.appendChild(t); h.appendChild(s2);
        if (d.notice) {
          var p2 = document.createElement('p');
          p2.className = 'geo-fiche-txt';
          p2.innerHTML = d.notice;
          h.appendChild(p2);
        }
        var n = document.createElement('p');
        n.className = 'geo-fiche-src';
        n.textContent = 'Contour : GADM 4.1, unité « ' + d.gadm + ' ». Repère : ' + d.origine + '.';
        h.appendChild(n);
        panneau.textContent = '';
        panneau.appendChild(h);
      }
      // On cadre l'etendue reelle de l'unite, pas un carre arbitraire.
      var c = cadrageDe(d);
      aller([c.x, c.y, c.w, c.h], anime !== false);
    }

    // --- evenements -------------------------------------------------
    Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-choix]'), function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { selectionner(b.getAttribute('data-geo-choix'), true); });
    });
    Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-zoom]'), function (b) {
      b.addEventListener('click', function () {
        zoomer(parseInt(b.getAttribute('data-geo-zoom'), 10) > 0 ? PAS : 1 / PAS);
      });
    });
    var reset = fig.querySelector('[data-geo-reset]');
    if (reset) reset.addEventListener('click', function () {
      choisi = null;
      Array.prototype.forEach.call(fig.querySelectorAll('.is-choisi'), function (e) {
        e.classList.remove('is-choisi');
        if (e.hasAttribute('aria-pressed')) e.setAttribute('aria-pressed', 'false');
      });
      if (panneau) panneau.innerHTML = '<p class="geo-panneau-vide">Choisissez une unité ci-dessous, ou touchez-la sur la carte.</p>';
      aller(base, true);
    });

    // clic ou touche sur une unite
    Array.prototype.forEach.call(fig.querySelectorAll('[data-geo-u]'), function (p) {
      p.addEventListener('click', function () { selectionner(p.getAttribute('data-geo-u'), true); });
    });

    // molette : seulement avec Ctrl / Cmd, pour ne pas voler le defilement
    var souffle = null;
    svg.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey)) {
        if (!souffle) {
          souffle = document.createElement('p');
          souffle.className = 'geo-souffle';
          souffle.textContent = 'Ctrl + molette pour zoomer';
          fig.querySelector('.geo-cadre').appendChild(souffle);
        }
        souffle.classList.add('is-vu');
        clearTimeout(souffle._t);
        souffle._t = setTimeout(function () { souffle.classList.remove('is-vu'); }, 1400);
        return;
      }
      e.preventDefault();
      var p = versSvg(e.clientX, e.clientY);
      zoomer(e.deltaY < 0 ? 1.18 : 1 / 1.18, p.x, p.y);
    }, { passive: false });

    // deplacement : souris a un bouton, ou deux doigts
    var actifs = {}, dernier = null, ecart0 = 0, vue0 = null, bouge = 0;

    function pointeurs() { return Object.keys(actifs).map(function (k) { return actifs[k]; }); }

    svg.addEventListener('pointerdown', function (e) {
      actifs[e.pointerId] = { x: e.clientX, y: e.clientY, type: e.pointerType };
      bouge = 0;
      var ps = pointeurs();
      if (e.pointerType === 'mouse' && ps.length === 1) {
        // Pas de setPointerCapture : il redirigerait le clic vers le <svg>
        // et le clic sur un canton ne le selectionnerait plus. On suit donc
        // le pointeur sur la fenetre, ce qui laisse le clic a sa cible.
        dernier = versSvg(e.clientX, e.clientY);
        window.addEventListener('pointermove', bouger, { passive: false });
        window.addEventListener('pointerup', relacher);
        window.addEventListener('pointercancel', relacher);
        fig.classList.add('is-glisse');
      } else if (ps.length === 2) {
        ecart0 = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
        vue0 = vue.slice();
        fig.classList.add('is-glisse');
      }
    });

    function bouger(e) {
      if (!actifs[e.pointerId]) return;
      var av = actifs[e.pointerId];
      bouge += Math.abs(e.clientX - av.x) + Math.abs(e.clientY - av.y);
      actifs[e.pointerId] = { x: e.clientX, y: e.clientY, type: e.pointerType };
      var ps = pointeurs();
      if (ps.length === 2 && ecart0) {
        e.preventDefault();
        var d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
        if (d > 4) {
          var r = svg.getBoundingClientRect();
          var mx = (ps[0].x + ps[1].x) / 2, my = (ps[0].y + ps[1].y) / 2;
          var s = Math.min(r.width / vue0[2], r.height / vue0[3]);
          var ox = (r.width - vue0[2] * s) / 2, oy = (r.height - vue0[3] * s) / 2;
          var cx = vue0[0] + (mx - r.left - ox) / s, cy = vue0[1] + (my - r.top - oy) / s;
          var nw = borne(vue0[2] * ecart0 / d, base[2] / ZOOM_MAX, base[2] * 1.15);
          var nh = nw * base[3] / base[2];
          var rx = (cx - vue0[0]) / vue0[2], ry = (cy - vue0[1]) / vue0[3];
          aller([cx - rx * nw, cy - ry * nh, nw, nh], false);
        }
        return;
      }
      if (ps.length === 1 && e.pointerType === 'mouse' && dernier) {
        e.preventDefault();
        var p = versSvg(e.clientX, e.clientY);
        aller([vue[0] - (p.x - dernier.x), vue[1] - (p.y - dernier.y), vue[2], vue[3]], false);
      }
    }
    svg.addEventListener('pointermove', bouger, { passive: false });

    function relacher(e) {
      delete actifs[e.pointerId];
      if (!pointeurs().length) {
        dernier = null; ecart0 = 0; vue0 = null;
        fig.classList.remove('is-glisse');
        window.removeEventListener('pointermove', bouger);
        window.removeEventListener('pointerup', relacher);
        window.removeEventListener('pointercancel', relacher);
      }
    }
    svg.addEventListener('pointerup', relacher);
    svg.addEventListener('pointercancel', relacher);

    fig.setAttribute('data-geo-pret', '');
    appliquer();
    return { selectionner: selectionner, aller: aller, base: base };
  }

  window.__cartes = [];
  Array.prototype.forEach.call(figures, function (f) {
    var c = Carte(f);
    if (c) window.__cartes.push(c);
  });
};
window.__initGeo();
