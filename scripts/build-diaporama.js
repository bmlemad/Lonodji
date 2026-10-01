#!/usr/bin/env node
/* Diaporamas PowerPoint aux couleurs de l'identité « Les Pas vers l'Avenir ».

     node scripts/build-diaporama.js --modeles     modèles vides (ADEB, ODEB) → public/odeb/identite/
     node scripts/build-diaporama.js --assemblee   présentation du projet ODEB pour l'assemblée → public/odeb/

   Les images (fond, logos, emblème) viennent de scripts/build-identite-odeb.py ;
   les textes de la présentation viennent de lib/odeb.ts et content/ (rien
   n'est écrit ici qui ne soit déjà sur le site). Polices : Playfair Display
   (titres) et DM Sans (textes) ; PowerPoint prend Cambria et Calibri si elles
   manquent. */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const pptxgen = require("pptxgenjs");
// Contact officiel : seule source lib/contact.ts
const TELEPHONE = /TELEPHONE = "([^"]+)"/.exec(require("fs").readFileSync(require("path").join(__dirname, "..", "lib", "contact.ts"), "utf8"))[1];

const ROOT = path.resolve(__dirname, "..");
const ID = path.join(ROOT, "public", "odeb", "identite");
const IMG = (n) => path.join(ID, n);

// lib/*.ts en Node : transpilation à la volée (modules CommonJS)
require.extensions[".ts"] = (module, filename) => {
  const src = fs.readFileSync(filename, "utf8");
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true } }).outputText;
  module._compile(out, filename);
};

const C = { deep: "173B2D", ink: "10241E", paper: "F4F6F1", accent: "B6CF45", gold: "F2C94C", muted: "526159", leaf: "2F6B4A", white: "FFFFFF", line: "D5DDD6" };
const F = { titre: "Playfair Display", texte: "DM Sans" };
const W = 13.333, H = 7.5;

function marque(m) {
  return m === "adeb"
    ? { nom: "ADEB LONODJI", long: "Association de Développement et d’Entraide de Bédjondo", devise: "Courage · Discipline · Héritage", url: "lonodji.org", logoSombre: IMG("adeb-lonodji-logo-horizontal-superposable-1000.png"), logoClair: IMG("adeb-lonodji-logo-horizontal-clair-superposable.png") }
    : { nom: "ODEB LONODJI", long: "Organisation pour le Développement et l’Émergence Bedjonde", devise: "Sur les traces de nos ancêtres, bâtissons notre avenir.", url: "lonodji.org/odeb", logoSombre: IMG("odeb-lonodji-logo-horizontal-superposable-1000.png"), logoClair: IMG("odeb-lonodji-logo-horizontal-clair-superposable.png") };
}

/* ------------------------------------------------------------ briques */
function nouveau(titre, sujet) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "ADEB LONODJI";
  pres.company = "ADEB LONODJI";
  pres.title = titre;
  pres.subject = sujet;
  pres.lang = "fr-FR";
  // le fond sombre vit dans un masque : l'image n'est stockée qu'une fois dans le fichier
  // (pptxgenjs recopie une image à chaque diapositive : les emblèmes récurrents vivent aussi dans les masques)
  pres.defineSlideMaster({ title: "SOMBRE", background: { path: IMG("fond-diaporama-sombre-2560x1440.jpg") } });
  pres.defineSlideMaster({ title: "SECTION", background: { path: IMG("fond-diaporama-sombre-2560x1440.jpg") }, objects: [{ image: { path: IMG("odeb-lonodji-embleme-superposable-512.png"), x: W - 2.3, y: H - 2.6, w: 1.7, h: 1.7 } }] });
  pres.defineSlideMaster({ title: "CLAIR", background: { color: C.white }, objects: [{ image: { path: IMG("odeb-lonodji-embleme-clair-superposable-512.png"), x: W - 1.5, y: 0.35, w: 0.95, h: 0.95 } }] });
  return pres;
}

const sombre = (pres) => pres.addSlide({ masterName: "SOMBRE" });
const section = (pres) => pres.addSlide({ masterName: "SECTION" });
const clair = (pres) => pres.addSlide({ masterName: "CLAIR" });

function pied(slide, m, n, total, sombre) {
  const couleur = sombre ? "AAB9B0" : C.muted;
  slide.addText(`${m.nom} · ${m.url}`, { x: 0.6, y: H - 0.55, w: 8, h: 0.3, fontFace: F.texte, fontSize: 9, color: couleur, charSpacing: 2, margin: 0, isTextBox: true });
  if (n) slide.addText(`${n} / ${total}`, { x: W - 2.6, y: H - 0.55, w: 2, h: 0.3, fontFace: F.texte, fontSize: 9, color: couleur, align: "right", margin: 0, isTextBox: true });
}

function embleme(slide, x, y, taille, sombre = true) {
  slide.addImage({ path: IMG(sombre ? "odeb-lonodji-embleme-superposable-512.png" : "odeb-lonodji-embleme-clair-superposable-512.png"), x, y, w: taille, h: taille });
}

function titreDiapo(slide, texte, options = {}) {
  const sombre = !!options.sombre;
  slide.addText(texte, { x: 0.6, y: 0.55, w: options.w || 8.6, h: 1.05, fontFace: F.titre, fontSize: options.taille || 34, color: sombre ? C.white : C.ink, bold: false, valign: "top", margin: 0, isTextBox: true, fit: "shrink" });
  if (options.eyebrow) slide.addText(options.eyebrow.toUpperCase(), { x: 0.6, y: 0.25, w: 8, h: 0.3, fontFace: F.texte, fontSize: 9, bold: true, charSpacing: 3, color: sombre ? C.accent : C.muted, margin: 0, isTextBox: true });
}

function carte(slide, x, y, w, h, opts = {}) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.16, fill: { color: opts.fond || C.paper }, line: { color: opts.bord || C.line, width: 0.75 }, shadow: opts.ombre ? { type: "outer", color: "10241E", blur: 6, offset: 2, angle: 90, opacity: 0.08 } : undefined });
}

function pastille(slide, x, y, texte, opts = {}) {
  const d = opts.d || 0.5;
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: opts.fond || C.accent }, line: { color: opts.fond || C.accent, width: 0 } });
  slide.addText(texte, { x, y, w: d, h: d, fontFace: F.texte, fontSize: opts.taille || 12, bold: true, color: opts.couleur || C.deep, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

function diapoTitre(pres, m, { titre, sousTitre, note }) {
  const s = sombre(pres);
  s.addImage({ path: m.logoSombre, x: 0.45, y: 0.4, w: 5.3, h: 1.7 });
  s.addText(titre, { x: 0.6, y: 2.35, w: 9.4, h: 2.2, fontFace: F.titre, fontSize: 46, color: C.white, valign: "bottom", margin: 0, isTextBox: true, fit: "shrink" });
  s.addText(sousTitre, { x: 0.6, y: 4.75, w: 9, h: 0.9, fontFace: F.texte, fontSize: 18, color: "DCE6DC", margin: 0, isTextBox: true });
  if (note) s.addText(note, { x: 0.6, y: 5.8, w: 9, h: 0.5, fontFace: F.texte, fontSize: 11, color: "AAB9B0", margin: 0, isTextBox: true });
  pied(s, m, null, null, true);
  return s;
}

function diapoSection(pres, m, n, total, { numero, titre, texte }) {
  const s = section(pres);
  s.addText(numero, { x: 0.6, y: 1.4, w: 4, h: 1.6, fontFace: F.titre, fontSize: 96, color: C.gold, margin: 0, isTextBox: true });
  s.addText(titre, { x: 0.6, y: 3.2, w: 10, h: 1.4, fontFace: F.titre, fontSize: 40, color: C.white, margin: 0, isTextBox: true, fit: "shrink" });
  if (texte) s.addText(texte, { x: 0.6, y: 4.7, w: 9.5, h: 1.3, fontFace: F.texte, fontSize: 16, color: "DCE6DC", margin: 0, isTextBox: true, fit: "shrink" });
  pied(s, m, n, total, true);
  return s;
}

function diapoTexte(pres, m, n, total, { eyebrow, titre, paragraphes, points }) {
  const s = clair(pres);
  titreDiapo(s, titre, { eyebrow });
  const corps = [];
  for (const p of paragraphes || []) corps.push({ text: p, options: { breakLine: true, paraSpaceAfter: 10 } });
  for (const p of points || []) corps.push({ text: p, options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 6 } });
  if (corps.length) corps[corps.length - 1].options.breakLine = false;
  s.addText(corps, { x: 0.6, y: 1.85, w: 11.9, h: 4.6, fontFace: F.texte, fontSize: 16, color: C.ink, valign: "top", margin: 0, isTextBox: true, fit: "shrink", lineSpacingMultiple: 1.15 });
  pied(s, m, n, total, false);
  return s;
}

function diapoColonnes(pres, m, n, total, { eyebrow, titre, intro, colonnes, taille }) {
  const s = clair(pres);
  titreDiapo(s, titre, { eyebrow });
  if (intro) s.addText(intro, { x: 0.6, y: 1.65, w: 11.9, h: 0.6, fontFace: F.texte, fontSize: 12.5, color: C.muted, valign: "top", margin: 0, isTextBox: true, fit: "shrink" });
  const k = colonnes.length, gap = 0.3, w = (W - 1.2 - gap * (k - 1)) / k, y = intro ? 2.35 : 1.9, h = intro ? 4.15 : 4.6;
  colonnes.forEach((c, i) => {
    const x = 0.6 + i * (w + gap);
    carte(s, x, y, w, h);
    if (c.numero) pastille(s, x + 0.3, y + 0.3, c.numero, { d: 0.5 });
    s.addText(c.titre, { x: x + (c.numero ? 0.95 : 0.3), y: y + 0.27, w: w - (c.numero ? 1.15 : 0.6), h: 0.6, fontFace: F.texte, fontSize: k > 4 ? 10.5 : 15, bold: true, color: C.deep, valign: "middle", margin: 0, isTextBox: true, fit: "shrink" });
    const corps = (c.points || []).map((p, j, a) => ({ text: p, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } }));
    if (c.texte) corps.unshift({ text: c.texte, options: { breakLine: corps.length > 0, paraSpaceAfter: 8 } });
    s.addText(corps, { x: x + 0.3, y: y + 1.05, w: w - 0.6, h: h - 1.35, fontFace: F.texte, fontSize: taille || 12.5, color: C.ink, valign: "top", margin: 0, isTextBox: true, fit: "shrink", lineSpacingMultiple: 1.1 });
  });
  pied(s, m, n, total, false);
  return s;
}

function diapoChiffres(pres, m, n, total, { eyebrow, titre, chiffres, note }) {
  const s = clair(pres);
  titreDiapo(s, titre, { eyebrow });
  const k = chiffres.length, gap = 0.3, w = (W - 1.2 - gap * (k - 1)) / k, y = 2.0, h = 3.2;
  chiffres.forEach((c, i) => {
    const x = 0.6 + i * (w + gap);
    carte(s, x, y, w, h);
    s.addText(c.valeur, { x: x + 0.3, y: y + 0.3, w: w - 0.6, h: 1.4, fontFace: F.titre, fontSize: 54, color: C.deep, margin: 0, isTextBox: true, fit: "shrink" });
    s.addText(c.label, { x: x + 0.3, y: y + 1.75, w: w - 0.6, h: 0.5, fontFace: F.texte, fontSize: 14, bold: true, color: C.ink, margin: 0, isTextBox: true, fit: "shrink" });
    if (c.note) s.addText(c.note, { x: x + 0.3, y: y + 2.25, w: w - 0.6, h: 0.8, fontFace: F.texte, fontSize: 11, color: C.muted, margin: 0, isTextBox: true, fit: "shrink" });
  });
  if (note) s.addText(note, { x: 0.6, y: 5.5, w: 11.9, h: 0.8, fontFace: F.texte, fontSize: 12, color: C.muted, margin: 0, isTextBox: true, fit: "shrink" });
  pied(s, m, n, total, false);
  return s;
}

function diapoEtapes(pres, m, n, total, { eyebrow, titre, etapes, depart = 1 }) {
  const s = clair(pres);
  titreDiapo(s, titre, { eyebrow });
  const y0 = 1.95, hh = Math.min(1.45, 4.6 / etapes.length);
  etapes.forEach((e, i) => {
    const y = y0 + i * hh;
    pastille(s, 0.6, y + 0.08, String(i + depart), { d: 0.5 });
    if (e.texte) {
      s.addText(e.titre, { x: 1.35, y, w: 3.4, h: hh - 0.15, fontFace: F.texte, fontSize: 14, bold: true, color: C.deep, valign: "top", margin: 0, isTextBox: true, fit: "shrink" });
      s.addText(e.texte, { x: 4.9, y, w: 7.8, h: hh - 0.15, fontFace: F.texte, fontSize: 12.5, color: C.ink, valign: "top", margin: 0, isTextBox: true, fit: "shrink", lineSpacingMultiple: 1.1 });
    } else {
      s.addText(e.titre, { x: 1.35, y, w: 11.35, h: hh - 0.15, fontFace: F.texte, fontSize: 18, color: C.ink, valign: "middle", margin: 0, isTextBox: true, fit: "shrink" });
    }
    if (i < etapes.length - 1) s.addShape("line", { x: 1.35, y: y + hh - 0.08, w: 11.35, h: 0, line: { color: C.line, width: 0.75 } });
  });
  pied(s, m, n, total, false);
  return s;
}

function diapoFin(pres, m, { titre, lignes }) {
  const s = sombre(pres);
  embleme(s, W / 2 - 1.1, 1.0, 2.2);
  s.addText(titre, { x: 1.5, y: 3.45, w: W - 3, h: 1.2, fontFace: F.titre, fontSize: 30, italic: true, color: C.white, align: "center", margin: 0, isTextBox: true, fit: "shrink" });
  s.addText(lignes.map((l, i) => ({ text: l, options: { breakLine: i < lignes.length - 1 } })), { x: 1.5, y: 4.85, w: W - 3, h: 1.4, fontFace: F.texte, fontSize: 14, color: "DCE6DC", align: "center", margin: 0, isTextBox: true });
  pied(s, m, null, null, true);
  return s;
}

/* ------------------------------------------------------------ modèles vides */
async function modeles() {
  for (const cle of ["adeb", "odeb"]) {
    const m = marque(cle);
    const pres = nouveau(`Modèle de diaporama ${m.nom}`, "Identité visuelle « Les Pas vers l'Avenir »");
    const total = 7;
    diapoTitre(pres, m, { titre: "Titre de la présentation", sousTitre: "Sous-titre, occasion, lieu", note: "Date · nom de l’intervenant" });
    diapoSection(pres, m, 2, total, { numero: "01", titre: "Titre de la partie", texte: "Une phrase qui annonce ce que la partie va montrer." });
    diapoTexte(pres, m, 3, total, { eyebrow: "Titre et texte", titre: "Une idée par diapositive", paragraphes: ["Le texte courant se lit à seize points ; une diapositive ne porte qu’une idée, dite en trois lignes au plus."], points: ["Un point court", "Un deuxième point", "Un troisième, pas davantage"] });
    diapoColonnes(pres, m, 4, total, { eyebrow: "Deux ou trois colonnes", titre: "Comparer, mettre côte à côte", colonnes: [{ numero: "1", titre: "Première colonne", texte: "Ce qu’elle contient.", points: ["Un point", "Un autre"] }, { numero: "2", titre: "Deuxième colonne", texte: "Ce qu’elle contient.", points: ["Un point", "Un autre"] }, { numero: "3", titre: "Troisième colonne", texte: "Ce qu’elle contient.", points: ["Un point", "Un autre"] }] });
    diapoChiffres(pres, m, 5, total, { eyebrow: "Chiffres", titre: "Trois chiffres, datés et sourcés", chiffres: [{ valeur: "12", label: "Ce que le chiffre compte", note: "Source, date" }, { valeur: "345", label: "Ce que le chiffre compte", note: "Source, date" }, { valeur: "6 %", label: "Ce que le chiffre compte", note: "Source, date" }], note: "Un chiffre sans sa source et sa date ne se présente pas." });
    diapoEtapes(pres, m, 6, total, { eyebrow: "Étapes", titre: "Ce qui vient ensuite", etapes: [{ titre: "Première étape", texte: "Ce qu’elle demande, qui la porte, quand." }, { titre: "Deuxième étape", texte: "Ce qu’elle demande, qui la porte, quand." }, { titre: "Troisième étape", texte: "Ce qu’elle demande, qui la porte, quand." }] });
    diapoFin(pres, m, { titre: m.devise, lignes: [m.long, `${m.url} · ${TELEPHONE} (appel et WhatsApp)`] });
    const out = path.join(ID, `modele-diaporama-${cle}-lonodji.pptx`);
    await pres.writeFile({ fileName: out });
    console.log("modèle :", path.relative(ROOT, out));
  }
}

/* ------------------------------------------------------------ présentation à l'assemblée */
async function assemblee() {
  const { ODEB, MISSIONS, REPERES_2030, PROGRAMMES, feuilleDeRoute, enLettresMaj } = require(path.join(ROOT, "lib", "odeb.ts"));
  const { chiffresOdeb } = require(path.join(ROOT, "lib", "odeb-chiffres.ts"));
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "index.json"), "utf8"));
  const projets = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "projets.json"), "utf8"));
  const c = chiffresOdeb();
  const phases = feuilleDeRoute(c);
  const poles = index.structure.poles;
  const cellules = (index.structure.cellules && index.structure.cellules.items) || [];
  const dirOuvertes = poles.filter((p) => p.direction && !p.direction.filled).length;
  const m = marque("odeb");
  const pres = nouveau("Projet ODEB LONODJI — présentation à l’assemblée", "Vision 2030, six programmes, cinq règles à voter");
  const p06 = PROGRAMMES.find((p) => p.numero === "06");
  const total = 14 + 2 * PROGRAMMES.length;
  let n = 1;

  diapoTitre(pres, m, { titre: "Projet ODEB LONODJI\nVision 2030", sousTitre: "Présentation à l’assemblée de l’association ADEB LONODJI", note: `Document de travail préparé à partir du livre blanc (${ODEB.presenteLabel}). Rien de ce qui suit n’est décidé ni financé : l’assemblée tranche.` });

  n += 1;
  diapoTexte(pres, m, n, total, { eyebrow: "Pourquoi", titre: "Un projet pour les quarante ans des fondations", paragraphes: [ODEB.formulation, ODEB.objet, `Présenté le ${ODEB.presenteLabel}, pour ${ODEB.anniversaire}. Le livre blanc, les six programmes et la feuille de route sont publiés sur lonodji.org/odeb.`] });

  n += 1;
  diapoEtapes(pres, m, n, total, { eyebrow: "Ce que l’ODEB devra être en 2030", titre: "Cinq repères", etapes: REPERES_2030.map((r) => ({ titre: r.charAt(0).toUpperCase() + r.slice(1) })) });

  n += 1;
  diapoColonnes(pres, m, n, total, { eyebrow: "Six missions", titre: "Ce que le projet fait déjà, mission par mission", colonnes: MISSIONS.slice(0, 3).map((mi, i) => ({ numero: String(i + 1), titre: mi.nom, texte: mi.texte, points: mi.existant.slice(0, 3).map((l) => l.label) })) });
  n += 1;
  diapoColonnes(pres, m, n, total, { eyebrow: "Six missions (suite)", titre: "Ce que le projet fait déjà, mission par mission", colonnes: MISSIONS.slice(3).map((mi, i) => ({ numero: String(i + 4), titre: mi.nom, texte: mi.texte, points: mi.existant.slice(0, 3).map((l) => l.label) })) });

  n += 1;
  diapoColonnes(pres, m, n, total, { eyebrow: "Six programmes", titre: "Les six programmes du projet", colonnes: PROGRAMMES.slice(0, 3).map((p) => ({ numero: p.numero, titre: p.nom, texte: p.accroche })) });
  n += 1;
  diapoColonnes(pres, m, n, total, { eyebrow: "Six programmes (suite)", titre: "Les six programmes du projet", colonnes: PROGRAMMES.slice(3).map((p) => ({ numero: p.numero, titre: p.nom, texte: p.accroche })) });

  for (const p of PROGRAMMES) {
    n += 1;
    diapoSection(pres, m, n, total, { numero: p.numero, titre: p.nom, texte: p.accroche });
    n += 1;
    diapoColonnes(pres, m, n, total, { eyebrow: `Programme ${p.numero} · ${enLettresMaj(p.axes.length)} axes`, titre: p.nom, intro: p.objet, colonnes: p.axes.map((a, i) => ({ numero: `${p.numero.replace(/^0/, "")}.${i + 1}`, titre: a.titre, texte: a.texte })), taille: p.axes.length > 3 ? 11 : 12 });
  }

  const regles = p06.principes.map((r) => ({ titre: r.titre, texte: r.texte }));
  n += 1;
  diapoEtapes(pres, m, n, total, { eyebrow: "Programme 06 · à voter (1/2)", titre: "Cinq règles du jeu, proposées à l’assemblée", etapes: regles.slice(0, 3) });
  n += 1;
  diapoEtapes(pres, m, n, total, { eyebrow: "Programme 06 · à voter (2/2)", titre: "Cinq règles du jeu, proposées à l’assemblée", etapes: regles.slice(3), depart: 4 });

  n += 1;
  const idees = projets.projets.filter((x) => x.stade === "idee").length;
  diapoChiffres(pres, m, n, total, { eyebrow: "Programme 06 · portefeuille", titre: "Des pistes, pas des promesses", chiffres: [{ valeur: String(p06.axes.length), label: "entreprises phares", note: p06.axes.map((a) => a.titre).join(" · ") }, { valeur: String(p06.portefeuille.length), label: "activités de plus, à étudier", note: "aucune décidée, rien n’est chiffré" }, { valeur: String(idees), label: "idées sur la plateforme de projets", note: "au stade « idée » : ni étude, ni budget, ni calendrier" }], note: p06.portefeuille.map((a) => a.nom).join(" · ") });

  n += 1;
  const pourvues = poles.flatMap((p) => p.items).filter((t) => t.filled).length;
  const thematiques = poles.flatMap((p) => p.items).length;
  diapoColonnes(pres, m, n, total, { eyebrow: "Qui porte le projet", titre: `${enLettresMaj(poles.length)} pôles, ${thematiques === 21 ? "vingt et une" : thematiques === 22 ? "vingt-deux" : enLettresMaj(thematiques).toLowerCase()} thématiques, ${pourvues} coordinations pourvues`, colonnes: poles.map((p) => ({ numero: p.roman, titre: p.name, texte: `Vice-présidence : ${p.direction.filled ? p.direction.name : "à pourvoir, par élection"}.`, points: p.items.map((t) => `${t.name} — ${t.filled ? t.coordinator : "à pourvoir"}`) })), taille: 9.5 });

  n += 1;
  diapoEtapes(pres, m, n, total, { eyebrow: "Feuille de route 2026-2030", titre: `${enLettresMaj(phases.length)} phases`, etapes: phases.map((ph) => ({ titre: `${ph.periode} · ${ph.titre}`, texte: ph.texte })) });

  n += 1;
  const aDecider = phases.flatMap((ph) => ph.chantiers.filter((ch) => ch.etat === "a-decider").map((ch) => `${ch.titre} — ${ch.note}`));
  diapoTexte(pres, m, n, total, { eyebrow: "Ce que l’assemblée décide", titre: "Les décisions attendues", points: ["Les cinq règles du programme 06 (règle d’affectation des bénéfices comprise)", ...(dirOuvertes ? [dirOuvertes === poles.length ? `Les ${enLettresMaj(poles.length).toLowerCase()} vice-présidences de pôle, à élire` : `Les vice-présidences de pôle à élire : ${dirOuvertes === 1 ? "une" : enLettresMaj(dirOuvertes).toLowerCase()} sur ${enLettresMaj(poles.length).toLowerCase()} (pôles ${poles.filter((p) => !p.direction.filled).map((p) => p.roman).join(", ")})`] : []), `Les coordinations restant à pourvoir : ${thematiques - pourvues} thématique${thematiques - pourvues > 1 ? "s" : ""}${cellules.filter((x) => !x.filled).length ? ` et ${cellules.filter((x) => !x.filled).length} cellule${cellules.filter((x) => !x.filled).length > 1 ? "s" : ""}` : ""}`, ...aDecider] });

  diapoFin(pres, m, { titre: ODEB.devise, lignes: ["Livre blanc, programmes, feuille de route : lonodji.org/odeb", `Écrire à l’association : lonodji.org/participer · ${TELEPHONE}`] });

  const out = path.join(ROOT, "public", "odeb", "odeb-lonodji-presentation-assemblee-2026.pptx");
  await pres.writeFile({ fileName: out });
  console.log("présentation :", path.relative(ROOT, out), `(${n + 1} diapositives)`);
}

(async () => {
  const args = process.argv.slice(2);
  if (args.includes("--modeles")) await modeles();
  if (args.includes("--assemblee")) await assemblee();
  if (!args.length) { await modeles(); await assemblee(); }
})().catch((e) => { console.error(e); process.exit(1); });
