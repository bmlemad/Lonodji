/* Outil généalogique ADEB LONODJI — entièrement local.
   Aucune donnée n'est envoyée : travail dans le navigateur, archive par fichier exporté. */
window.__initGenealogie = function () {
  'use strict';
  var __root = document.querySelector("#gn-outil");
  if (!__root || __root.__inited) return;
  __root.__inited = true;

  var KEY = 'lonodji-genealogie-v1';
  var REPERES = [
    '16 mai 1903 — Koumra résiste à une attaque d’esclavagistes',
    '1905 — mort du chef sara Mode',
    '1908-1912 — première révolte du Mandoul',
    '1921-1934 — chemin de fer Congo-Océan',
    '1927-1928 — résistances au recrutement forcé',
    '1928-1929 — « guerre de Bouna » et sa répression',
    '11 août 1960 — indépendance du Tchad',
    '1978 — mission comboniana de Bédjondo',
    '1986 — premières discussions de l’association',
    '1993 — recensement (4 344 habitants)',
    '1995 — reconnaissance de l’association',
    'décembre 2003 — forum de Bébo-Pen',
    '2009 — recensement (11 086 habitants)',
    'avril 2023 — assemblée générale de Kokotan',
    '12 août 2023 — érection du diocèse de Koumra',
    'juin-juillet 2026 — recensement RGPH-3'
  ];

  var db = { v: 1, famille: {}, personnes: [] };
  var stockageOk = true;
  var editId = null;

  /* ---------- stockage ---------- */
  function charger() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.personnes) db = d;
      }
    } catch (e) { stockageOk = false; }
  }
  function sauver() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { stockageOk = false; majStockage(); }
  }
  function majStockage() {
    var n = document.getElementById('gn-stockage');
    if (!n) return;
    n.textContent = stockageOk
      ? 'Travail enregistré dans ce navigateur. Exportez le fichier pour en garder l’archive.'
      : 'Ce navigateur refuse l’enregistrement local : votre saisie ne survivra pas à la fermeture de la page. Exportez le fichier avant de fermer.';
    n.className = stockageOk ? 'gn-flash' : 'gn-flash gn-flash--alerte';
  }

  /* ---------- numéros d'Aboville ---------- */
  function cle(num) {
    // "1.2bis.10" -> [[1,0],[2,1],[10,0]] ; le suffixe bis se classe juste après sa base
    return String(num || '').split('.').map(function (seg) {
      var m = /^(\d+)(bis|ter)?$/.exec(seg.trim());
      if (!m) return [Number.MAX_SAFE_INTEGER, 0];
      return [parseInt(m[1], 10), m[2] === 'bis' ? 1 : (m[2] === 'ter' ? 2 : 0)];
    });
  }
  function compare(a, b) {
    var ka = cle(a.num), kb = cle(b.num), i;
    for (i = 0; i < Math.max(ka.length, kb.length); i++) {
      var sa = ka[i], sb = kb[i];
      if (!sa) return -1;
      if (!sb) return 1;
      if (sa[0] !== sb[0]) return sa[0] - sb[0];
      if (sa[1] !== sb[1]) return sa[1] - sb[1];
    }
    return 0;
  }
  function profondeur(num) { return String(num || '').split('.').length; }
  function parent(num) {
    var p = String(num || '').split('.');
    p.pop();
    return p.join('.');
  }
  function numValide(num) {
    return /^\d+(bis|ter)?(\.\d+(bis|ter)?)*$/.test(String(num || '').trim());
  }

  /* ---------- utilitaires ---------- */
  function el(id) { return document.getElementById(id); }
  function txt(s) { return document.createTextNode(s == null ? '' : String(s)); }
  function vide(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function mk(tag, cls, contenu) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (contenu != null) n.appendChild(txt(contenu));
    return n;
  }
  function uid() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function parNum(num) {
    for (var i = 0; i < db.personnes.length; i++) {
      if (db.personnes[i].num === num) return db.personnes[i];
    }
    return null;
  }
  function nomCourt(p) {
    return (p.nom || '(sans nom)') + (p.num ? ' · ' + p.num : '');
  }
  function quand(p) {
    if (p.annee) return p.annee;
    if (p.repere) return p.repere;
    return 'année inconnue';
  }

  /* ---------- rendu : liste de descendance ---------- */
  function rendreDescendance() {
    var hote = el('gn-descendance');
    if (!hote) return;
    vide(hote);
    var liste = db.personnes.slice().filter(function (p) { return numValide(p.num); }).sort(compare);
    if (!liste.length) {
      hote.appendChild(mk('p', 'form-note', 'Aucune personne enregistrée pour le moment. La liste se remplit et se décale d’elle-même à mesure que vous ajoutez des numéros.'));
      return;
    }
    var ol = mk('ol', 'gn-desc');
    liste.forEach(function (p) {
      var d = Math.min(profondeur(p.num), 8);
      var li = mk('li', 'gn-desc-l gn-d' + d);
      var b = mk('span', 'gn-desc-num', p.num);
      li.appendChild(b);
      li.appendChild(mk('span', 'gn-desc-nom', p.nom || '(sans nom)'));
      var det = [];
      if (p.sexe) det.push(p.sexe);
      det.push(quand(p));
      if (p.mereNom) det.push('mère : ' + p.mereNom);
      if (p.villageNaissance) det.push(p.villageNaissance);
      li.appendChild(mk('span', 'gn-desc-det', det.join(' · ')));
      var bt = mk('button', 'gn-mini', 'Modifier');
      bt.type = 'button';
      bt.setAttribute('aria-label', 'Modifier la fiche de ' + nomCourt(p));
      bt.addEventListener('click', function () { ouvrirFiche(p.id); });
      li.appendChild(bt);
      ol.appendChild(li);
    });
    hote.appendChild(ol);
  }

  /* ---------- rendu : vue par maison ---------- */
  function rendreMaisons() {
    var hote = el('gn-maisons');
    if (!hote) return;
    vide(hote);
    var groupes = {};
    db.personnes.forEach(function (p) {
      var pere = parent(p.num);
      if (!pere) return; // la racine du cahier n'est l'enfant de personne ici
      var maison = p.maison || (p.mereNom ? p.mereNom : '(mère non renseignée)');
      var k = pere + '||' + maison;
      if (!groupes[k]) groupes[k] = { pere: pere, maison: maison, mere: p.mereNom || '', enfants: [] };
      groupes[k].enfants.push(p);
    });
    var cles = Object.keys(groupes).sort(function (a, b) {
      return compare({ num: groupes[a].pere }, { num: groupes[b].pere })
        || (groupes[a].maison < groupes[b].maison ? -1 : (groupes[a].maison > groupes[b].maison ? 1 : 0));
    });
    if (!cles.length) {
      hote.appendChild(mk('p', 'form-note', 'Les maisons apparaîtront ici dès que vous aurez enregistré des personnes avec le nom de leur mère.'));
      return;
    }
    cles.forEach(function (k) {
      var g = groupes[k];
      var pereP = parNum(g.pere);
      var bloc = mk('div', 'gn-maison');
      var t = mk('h3', null, null);
      t.appendChild(txt('Père : ' + (pereP ? nomCourt(pereP) : g.pere + ' — fiche absente')));
      bloc.appendChild(t);
      var st = mk('p', 'gn-maison-mere', 'Maison : ' + g.maison + (g.mere && g.mere !== g.maison ? ' · mère : ' + g.mere : ''));
      bloc.appendChild(st);
      var wrap = mk('div', 'table-wrap');
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Enfants de ' + (pereP ? nomCourt(pereP) : g.pere)
        + ', maison ' + g.maison);
      var tb = mk('table', 'plea-table indic-table');
      var cap = mk('caption', 'sr-only', 'Enfants rangés sous leur mère, dans l’ordre des numéros');
      tb.appendChild(cap);
      var thead = document.createElement('thead');
      var tr = document.createElement('tr');
      ['Rang', 'Numéro', 'Nom', 'Quand', 'Observations'].forEach(function (h) {
        var th = mk('th', null, h);
        th.setAttribute('scope', 'col');
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      tb.appendChild(thead);
      var tbody = document.createElement('tbody');
      g.enfants.sort(compare).forEach(function (p) {
        var r = document.createElement('tr');
        var th = mk('th', null, p.rang || '—');
        th.setAttribute('scope', 'row');
        r.appendChild(th);
        [p.num, p.nom || '(sans nom)', quand(p), p.note || ''].forEach(function (v) {
          r.appendChild(mk('td', null, v));
        });
        tbody.appendChild(r);
      });
      tb.appendChild(tbody);
      wrap.appendChild(tb);
      bloc.appendChild(wrap);
      hote.appendChild(bloc);
    });
  }

  /* ---------- contrôles de cohérence ---------- */
  function controles() {
    var out = [];
    var nums = {};
    db.personnes.forEach(function (p) {
      if (!p.num) { out.push(['manquant', 'Une personne (' + (p.nom || 'sans nom') + ') n’a pas de numéro.']); return; }
      if (!numValide(p.num)) out.push(['forme', 'Le numéro « ' + p.num + ' » n’a pas la forme attendue (1, 1.2, 1.2bis, 1.2.3).']);
      if (nums[p.num]) out.push(['double', 'Le numéro ' + p.num + ' est utilisé deux fois : ' + nums[p.num] + ' et ' + (p.nom || 'sans nom') + '. Un numéro ne se réattribue jamais.']);
      else nums[p.num] = p.nom || 'sans nom';
    });
    db.personnes.forEach(function (p) {
      var pr = parent(p.num);
      if (pr && !nums[pr]) out.push(['trou', p.num + ' existe mais ' + pr + ' est absent du cahier : la personne dont il descend n’a pas de fiche.']);
      if (!p.mereNom && profondeur(p.num) > 1) out.push(['mere', p.num + ' (' + (p.nom || 'sans nom') + ') n’indique pas sa mère. C’est l’information la plus souvent perdue.']);
      if (!p.annee && !p.repere) out.push(['date', p.num + ' (' + (p.nom || 'sans nom') + ') n’a ni année ni événement repère. Une case vide est permise ; un repère vaut mieux.']);
      if (!p.source) out.push(['source', p.num + ' (' + (p.nom || 'sans nom') + ') n’indique pas de qui l’on tient ces renseignements.']);
    });
    // rangs en double dans une même maison
    var parMaison = {};
    db.personnes.forEach(function (p) {
      if (!p.rang) return;
      var k = (parent(p.num) || '~') + '||' + (p.maison || p.mereNom || '~');
      parMaison[k] = parMaison[k] || {};
      if (parMaison[k][p.rang]) out.push(['rang', 'Deux enfants portent le rang ' + p.rang + ' dans la même maison (' + (p.maison || p.mereNom || 'maison non nommée') + ').']);
      else parMaison[k][p.rang] = true;
    });
    return out;
  }

  var CTRL_TITRES = {
    manquant: 'Fiches sans num\u00e9ro',
    forme: 'Num\u00e9ros dont la forme est invalide',
    double: 'Num\u00e9ros utilis\u00e9s deux fois',
    trou: 'Descendants dont l\u2019anc\u00eatre n\u2019a pas de fiche',
    rang: 'Deux enfants au m\u00eame rang dans une maison',
    mere: 'Fiches sans le nom de la m\u00e8re',
    date: 'Fiches sans ann\u00e9e ni \u00e9v\u00e9nement rep\u00e8re',
    source: 'Fiches sans informateur indiqu\u00e9'
  };
  var CTRL_ORDRE = ['double', 'forme', 'manquant', 'trou', 'rang', 'mere', 'date', 'source'];
  var CTRL_MAX = 8;

  function rendreControles() {
    var hote = el('gn-controles');
    if (!hote) return;
    vide(hote);
    var c = controles();
    var compteur = el('gn-controles-compte');
    if (compteur) {
      compteur.textContent = c.length === 0
        ? 'Aucune incoh\u00e9rence d\u00e9tect\u00e9e.'
        : (c.length === 1 ? '1 point \u00e0 v\u00e9rifier.' : c.length + ' points \u00e0 v\u00e9rifier.');
    }
    if (!c.length) {
      hote.appendChild(mk('p', 'form-note', 'Rien \u00e0 signaler. Ces contr\u00f4les ne disent pas que le cahier est juste : ils disent seulement qu\u2019il est coh\u00e9rent avec lui-m\u00eame.'));
      return;
    }
    // regrouper par nature : une liste plate de plusieurs centaines de lignes est illisible
    var par = {};
    c.forEach(function (x) { (par[x[0]] = par[x[0]] || []).push(x[1]); });
    CTRL_ORDRE.forEach(function (k) {
      if (!par[k]) return;
      var lot = par[k];
      var bloc = mk('div', 'gn-ctrl-bloc');
      var h = mk('h3', null, CTRL_TITRES[k] || k);
      h.appendChild(mk('span', 'gn-ctrl-compte', lot.length === 1 ? '1 cas' : lot.length + ' cas'));
      bloc.appendChild(h);
      var ul = mk('ul', 'gn-ctrl gn-ctrl-' + k);
      lot.slice(0, CTRL_MAX).forEach(function (t) { ul.appendChild(mk('li', null, t)); });
      bloc.appendChild(ul);
      if (lot.length > CTRL_MAX) {
        bloc.appendChild(mk('p', 'form-note gn-ctrl-reste',
          'et ' + (lot.length - CTRL_MAX) + ' autre' + (lot.length - CTRL_MAX > 1 ? 's' : '')
          + ' du m\u00eame genre. Corrigez ceux-ci d\u2019abord : la liste se raccourcira d\u2019elle-m\u00eame.'));
      }
      hote.appendChild(bloc);
    });
  }

  /* ---------- compteurs ---------- */
  function rendreCompteurs() {
    var n = db.personnes.length;
    var prof = 0, sansDate = 0, sansSource = 0;
    db.personnes.forEach(function (p) {
      prof = Math.max(prof, profondeur(p.num));
      if (!p.annee && !p.repere) sansDate++;
      if (!p.source) sansSource++;
    });
    var m = { 'gn-c-personnes': n, 'gn-c-generations': n ? prof : 0,
              'gn-c-sansdate': sansDate, 'gn-c-sanssource': sansSource };
    Object.keys(m).forEach(function (k) { if (el(k)) el(k).textContent = m[k]; });
  }

  /* ---------- fiche : ouvrir / enregistrer ---------- */
  var CHAMPS = ['num', 'nom', 'autres', 'sexe', 'statut', 'villageNaissance', 'annee', 'repere',
                'rang', 'chef', 'deces', 'mereNom', 'mereVillage', 'maison', 'conjoints',
                'residence', 'metier', 'note', 'source', 'dateFiche'];

  function ouvrirFiche(id) {
    editId = id || null;
    var p = id ? db.personnes.filter(function (x) { return x.id === id; })[0] : null;
    CHAMPS.forEach(function (c) {
      var n = el('gn-f-' + c);
      if (n) n.value = p ? (p[c] || '') : '';
    });
    el('gn-f-titre').textContent = p ? 'Modifier la fiche de ' + nomCourt(p) : 'Nouvelle fiche de personne';
    el('gn-supprimer').hidden = !p;
    var form = el('gn-form');
    form.hidden = false;
    el('gn-f-num').focus();
    form.scrollIntoView({ block: 'start' });
  }

  function fermerFiche() {
    el('gn-form').hidden = true;
    editId = null;
  }

  function enregistrerFiche(ev) {
    ev.preventDefault();
    var num = el('gn-f-num').value.trim();
    var msg = el('gn-f-erreur');
    if (!num) { msg.textContent = 'Le numéro est obligatoire : c’est lui qui tient le cahier.'; return; }
    if (!numValide(num)) { msg.textContent = 'Le numéro doit avoir la forme 1, 1.2, 1.2bis ou 1.2.3.'; return; }
    var autre = parNum(num);
    if (autre && autre.id !== editId) {
      msg.textContent = 'Le numéro ' + num + ' est déjà pris par ' + (autre.nom || 'une autre fiche') + '. Un numéro ne se réattribue jamais.';
      return;
    }
    msg.textContent = '';
    var p = editId ? db.personnes.filter(function (x) { return x.id === editId; })[0] : { id: uid() };
    CHAMPS.forEach(function (c) {
      var n = el('gn-f-' + c);
      if (n) p[c] = n.value.trim();
    });
    if (!editId) db.personnes.push(p);
    sauver();
    fermerFiche();
    rendreTout();
    flash(editId ? 'Fiche modifiée.' : 'Fiche ajoutée.');
  }

  function supprimerFiche() {
    if (!editId) return;
    var p = db.personnes.filter(function (x) { return x.id === editId; })[0];
    var enfants = db.personnes.filter(function (x) { return parent(x.num) === p.num; });
    var avert = enfants.length
      ? '\n\nAttention : ' + enfants.length + ' fiche(s) descendent de ce numéro et deviendraient orphelines.'
      : '';
    if (!window.confirm('Supprimer définitivement la fiche ' + nomCourt(p) + ' ?' + avert)) return;
    db.personnes = db.personnes.filter(function (x) { return x.id !== editId; });
    sauver();
    fermerFiche();
    rendreTout();
    flash('Fiche supprimée.');
  }

  function flash(m) {
    var n = el('gn-flash');
    if (!n) return;
    n.textContent = m;
    window.setTimeout(function () { if (n.textContent === m) n.textContent = ''; }, 6000);
  }

  /* ---------- famille ---------- */
  var CH_FAM = ['fNom', 'fVillage', 'fCanton', 'fTenuPar', 'fOuvertLe'];
  function chargerFamille() {
    CH_FAM.forEach(function (c) {
      var n = el('gn-' + c);
      if (n) n.value = (db.famille && db.famille[c]) || '';
    });
  }
  function enregistrerFamille() {
    db.famille = db.famille || {};
    CH_FAM.forEach(function (c) {
      var n = el('gn-' + c);
      if (n) db.famille[c] = n.value.trim();
    });
    sauver();
    flash('En-tête de la famille enregistré.');
  }

  /* ---------- export / import ---------- */
  function nomFichier() {
    var base = (db.famille && db.famille.fNom ? db.famille.fNom : 'famille')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'famille';
    var d = new Date();
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    return 'genealogie-' + base + '-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
  }
  function exporter() {
    db.exporteLe = new Date().toISOString().slice(0, 10);
    sauver();
    telecharger(nomFichier() + '.json', JSON.stringify(db, null, 2), 'application/json');
    flash('Fichier exporté. C’est lui, et non le navigateur, qui est votre archive.');
  }
  function exporterCsv() {
    var cols = ['num', 'nom', 'sexe', 'statut', 'annee', 'repere', 'rang', 'mereNom', 'maison',
                'villageNaissance', 'chef', 'deces', 'conjoints', 'residence', 'metier', 'note', 'source'];
    var esc = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var lignes = [cols.map(esc).join(';')];
    db.personnes.slice().sort(compare).forEach(function (p) {
      lignes.push(cols.map(function (c) { return esc(p[c]); }).join(';'));
    });
    telecharger(nomFichier() + '.csv', '﻿' + lignes.join('\r\n'), 'text/csv');
    flash('Tableau exporté.');
  }
  function telecharger(nom, contenu, type) {
    var b = new Blob([contenu], { type: type + ';charset=utf-8' });
    var u = URL.createObjectURL(b);
    var a = document.createElement('a');
    a.href = u; a.download = nom;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  }
  function importer(ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var d;
      try { d = JSON.parse(String(r.result)); }
      catch (e) { flash('Ce fichier n’est pas lisible : ce n’est pas un export de cet outil.'); return; }
      if (!d || !Array.isArray(d.personnes)) { flash('Ce fichier ne contient pas de liste de personnes.'); return; }
      var n = db.personnes.length;
      if (n && !window.confirm('Remplacer le cahier ouvert (' + n + ' fiche(s)) par celui du fichier ?')) { ev.target.value = ''; return; }
      db = { v: 1, famille: d.famille || {}, personnes: d.personnes.map(function (p) {
        if (!p.id) p.id = uid();
        return p;
      }) };
      sauver();
      chargerFamille();
      rendreTout();
      flash('Cahier importé : ' + db.personnes.length + ' fiche(s).');
      ev.target.value = '';
    };
    r.readAsText(f);
  }
  function toutEffacer() {
    if (!window.confirm('Effacer tout le cahier de ce navigateur ? Cette action est définitive. Exportez le fichier d’abord si vous voulez le garder.')) return;
    if (!window.confirm('Dernière confirmation : effacer ' + db.personnes.length + ' fiche(s) ?')) return;
    db = { v: 1, famille: {}, personnes: [] };
    try { localStorage.removeItem(KEY); } catch (e) {}
    chargerFamille();
    rendreTout();
    flash('Cahier effacé de ce navigateur.');
  }

  /* ---------- onglets ---------- */
  function onglets() {
    var bs = Array.prototype.slice.call(document.querySelectorAll('.gn-tab'));
    function montrer(cible) {
      bs.forEach(function (b) {
        var on = b.getAttribute('data-vue') === cible;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        var panneau = el('gn-vue-' + b.getAttribute('data-vue'));
        if (panneau) panneau.hidden = !on;
      });
    }
    bs.forEach(function (b) {
      b.addEventListener('click', function () { montrer(b.getAttribute('data-vue')); });
      b.addEventListener('keydown', function (e) {
        var i = bs.indexOf(b), j = -1;
        if (e.key === 'ArrowRight') j = (i + 1) % bs.length;
        if (e.key === 'ArrowLeft') j = (i - 1 + bs.length) % bs.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = bs.length - 1;
        if (j >= 0) { e.preventDefault(); bs[j].focus(); montrer(bs[j].getAttribute('data-vue')); }
      });
    });
    if (bs.length) montrer(bs[0].getAttribute('data-vue'));
  }

  /* ---------- repères ---------- */
  function remplirReperes() {
    var s = el('gn-reperes');
    if (!s) return;
    REPERES.forEach(function (r) {
      var o = document.createElement('option');
      o.value = r;
      s.appendChild(o);
    });
  }

  function rendreTout() {
    rendreDescendance();
    rendreMaisons();
    rendreControles();
    rendreCompteurs();
  }

  function init() {
    if (!el('gn-outil')) return;
    charger();
    majStockage();
    chargerFamille();
    remplirReperes();
    onglets();
    rendreTout();
    el('gn-nouvelle').addEventListener('click', function () { ouvrirFiche(null); });
    el('gn-form').addEventListener('submit', enregistrerFiche);
    el('gn-annuler').addEventListener('click', fermerFiche);
    el('gn-supprimer').addEventListener('click', supprimerFiche);
    el('gn-famille-enr').addEventListener('click', enregistrerFamille);
    el('gn-export').addEventListener('click', exporter);
    el('gn-export-csv').addEventListener('click', exporterCsv);
    el('gn-import').addEventListener('change', importer);
    el('gn-effacer').addEventListener('click', toutEffacer);
    el('gn-imprimer').addEventListener('click', function () { window.print(); });
  }

  init();
};
window.__initGenealogie();
