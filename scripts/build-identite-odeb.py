#!/usr/bin/env python3
"""Identité visuelle du projet ODEB LONODJI — « Les Pas vers l'Avenir » (verre).

Produit dans public/odeb/identite/ tout ce que le site et les tiers utilisent :

- les emblèmes SVG (verre sur fond, verre superposable, verre clair, à plat,
  monochrome, réserve blanche) et les logos horizontal / vertical, dont les
  textes sont convertis en tracés (DM Sans, Playfair Display) pour s'afficher
  partout sans les polices ;
- les PNG (emblème 2048 / 1024 / 512, superposable et clair en 1024, logos) ;
- la planche PDF pour les imprimeurs ;
- le papier à en-tête (DOCX et PDF) ;
- le kit ZIP qui rassemble le tout avec un LISEZMOI.

Les dessins viennent de design/odeb/build-logo.py (à plat) et
design/odeb/build-logo-verre.py (verre) ; ce script ne redessine rien.

    npm run build && python3 scripts/build-identite-odeb.py

(le build sert aux polices auto-hébergées, décompressées ici pour harfbuzz.)
"""
from __future__ import annotations

import importlib.util
import math
import re
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "odeb" / "identite"
TMP = ROOT / ".next" / "identite-tmp"


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


plat = charger("build_logo", ROOT / "design" / "odeb" / "build-logo.py")
verre = charger("build_logo_verre", ROOT / "design" / "odeb" / "build-logo-verre.py")
og = charger("build_og", ROOT / "scripts" / "build-og.py")

DEVISE = "« Sur les traces de nos ancêtres, bâtissons notre avenir. »"
SOUS_TITRE = ("ORGANISATION POUR LE DÉVELOPPEMENT", "ET L’ÉMERGENCE BEDJONDE")
TEL = "+235 66 29 94 03"
# Un emblème, deux noms : l'association (logo adopté le 28/09/2026) et son projet.
MARQUES = {
    "odeb": {"sigle": "ODEB", "nom": "LONODJI", "sous_titre": SOUS_TITRE, "devise": DEVISE},
    "adeb": {"sigle": "ADEB", "nom": "LONODJI", "sous_titre": ("ASSOCIATION DE DÉVELOPPEMENT", "ET D’ENTRAIDE DE BÉDJONDO"), "devise": "Courage · Discipline · Héritage"},
}
MARQUE = MARQUES["odeb"]


# ---------------------------------------------------------------- textes en tracés
def polices() -> dict[str, Path]:
    """Décompresse les woff2 du site (DM Sans, Playfair Display) en TTF pour harfbuzz."""
    from fontTools.ttLib import TTFont

    TMP.mkdir(parents=True, exist_ok=True)
    out: dict[str, Path] = {}
    for f in sorted((ROOT / ".next" / "static" / "media").glob("*.woff2")):
        t = TTFont(f)
        nom = t["name"].getDebugName(4) or ""
        n = len(t.getBestCmap())
        cle = "dm" if nom.startswith("DM Sans") else "playfair" if nom.startswith("Playfair") else None
        if cle and (cle not in out or n > out[cle][1]):  # le sous-ensemble latin le plus complet
            out[cle] = (f, n)  # type: ignore[assignment]
    if set(out) != {"dm", "playfair"}:
        raise SystemExit("polices introuvables : lancer npm run build d'abord")
    chemins = {}
    for cle, (f, _) in out.items():  # type: ignore[misc]
        t = TTFont(f)
        t.flavor = None
        dest = TMP / f"{cle}.ttf"
        t.save(dest)
        chemins[cle] = dest
    return chemins


class Traceur:
    """Convertit un texte en tracés SVG avec harfbuzz (crénage, poids variable)."""

    def __init__(self, chemins: dict[str, Path]):
        import uharfbuzz as hb

        self.hb = hb
        self.fonts = {}
        for cle, p in chemins.items():
            face = hb.Face(hb.Blob.from_file_path(str(p)))
            self.fonts[cle] = (face, hb.Font(face))

    def tracer(self, texte: str, police: str, taille: float, poids: float, espacement: float = 0, inclinaison: float = 0) -> tuple[str, float]:
        """Retourne (chemins SVG à l'origine (0, 0 = ligne de base), largeur totale)."""
        from fontTools.pens.svgPathPen import SVGPathPen
        from fontTools.pens.transformPen import TransformPen

        face, font = self.fonts[police]
        font.set_variations({"wght": poids})
        buf = self.hb.Buffer()
        buf.add_str(texte)
        buf.guess_segment_properties()
        self.hb.shape(font, buf, {"kern": True, "liga": True})
        s = taille / face.upem
        k = math.tan(math.radians(inclinaison)) * s
        x = 0.0
        d = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            pen = SVGPathPen(None, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
            font.draw_glyph_with_pen(info.codepoint, TransformPen(pen, (s, 0, k, -s, x + pos.x_offset * s, -pos.y_offset * s)))
            c = pen.getCommands()
            if c:
                d.append(c)
            x += pos.x_advance * s + espacement
        return "".join(d), x

    def texte(self, texte: str, police: str, taille: float, poids: float, x: float, y: float, fill: str, ancre: str = "start", espacement: float = 0, inclinaison: float = 0) -> str:
        d, w = self.tracer(texte, police, taille, poids, espacement, inclinaison)
        dx = x - w / 2 if ancre == "middle" else x - w if ancre == "end" else x
        return f'<path transform="translate({dx:.2f},{y:.2f})" fill="{fill}" d="{d}"/>'


TRACEUR: Traceur | None = None


def texte_marque_traces(x: float, y: float, ancre: str, theme: str, taille: float = 150, devise_taille: float = 44, empile: bool = False) -> str:
    """Même mise en page que verre.texte_marque, en tracés : nom, développement du sigle, filet, devise."""
    assert TRACEUR
    sombre = theme == "sombre"
    ink = "#fff" if sombre else verre.INK
    doux = "#c9d5cc" if sombre else "#526159"
    dev = verre.GOLD_CLAIR if sombre else "#5a4a12"
    st = taille * .2
    out = []
    # « ODEB » gras puis « LONODJI » fin, en un seul bloc centré ou aligné
    d1, w1 = TRACEUR.tracer(MARQUE["sigle"] + " ", "dm", taille, 800, taille * .04)
    d2, w2 = TRACEUR.tracer(MARQUE["nom"], "dm", taille, 250, taille * .06)
    w = w1 + w2
    dx = x - w / 2 if ancre == "middle" else x
    out.append(f'<g transform="translate({dx:.2f},{y:.2f})" fill="{ink}"><path d="{d1}"/><path transform="translate({w1:.2f},0)" d="{d2}"/></g>')
    out.append(TRACEUR.texte(MARQUE["sous_titre"][0], "dm", st, 500, x + (0 if ancre == "middle" else 2), y + st * 2.1, doux, ancre, st * .3))
    out.append(TRACEUR.texte(MARQUE["sous_titre"][1], "dm", st, 500, x + (0 if ancre == "middle" else 2), y + st * 3.5, doux, ancre, st * .3))
    ly = y + st * 4.7
    if ancre == "middle":
        out.append(f'<line x1="{x - 46}" y1="{ly:.0f}" x2="{x + 46}" y2="{ly:.0f}" stroke="{verre.GOLD}" stroke-width="4" stroke-linecap="round"/>')
    else:
        out.append(f'<line x1="{x + 2}" y1="{ly:.0f}" x2="{x + 96}" y2="{ly:.0f}" stroke="{verre.GOLD}" stroke-width="4" stroke-linecap="round"/>')
    devise = MARQUE["devise"]
    if empile and ", " in devise:
        a, b = devise.split(", ", 1)
        out.append(TRACEUR.texte(a + ",", "playfair", devise_taille, 400, x, ly + devise_taille * 1.7, dev, ancre, 0, 12))
        out.append(TRACEUR.texte(b, "playfair", devise_taille, 400, x, ly + devise_taille * 3.0, dev, ancre, 0, 12))
    elif empile:
        out.append(TRACEUR.texte(devise, "playfair", devise_taille, 400, x, ly + devise_taille * 2.2, dev, ancre, 0, 12))
    else:
        out.append(TRACEUR.texte(devise, "playfair", devise_taille, 400, x + 2, ly + devise_taille * 1.7, dev, "start", 0, 12))
    return "".join(out)


# ---------------------------------------------------------------- fichiers
def fichiers_svg() -> dict[str, str]:
    global MARQUE
    verre.texte_marque = texte_marque_traces  # svg_horizontal / svg_vertical appellent texte_marque par son nom
    MARQUE = MARQUES["adeb"]
    adeb = {
        "adeb-lonodji-logo-horizontal.svg": verre.svg_horizontal("sombre"),
        "adeb-lonodji-logo-horizontal-clair.svg": verre.svg_horizontal("clair"),
        "adeb-lonodji-logo-horizontal-superposable.svg": verre.svg_horizontal("sombre", False),
        "adeb-lonodji-logo-horizontal-clair-superposable.svg": verre.svg_horizontal("clair", False),
        "adeb-lonodji-logo-vertical.svg": verre.svg_vertical("sombre"),
        "adeb-lonodji-logo-vertical-clair.svg": verre.svg_vertical("clair"),
    }
    for k in adeb:  # le générateur écrit le libellé du projet : celui de l'association pour ses fichiers
        adeb[k] = adeb[k].replace('aria-label="ODEB LONODJI — Organisation pour le Développement et l’Émergence Bedjonde"', 'aria-label="ADEB LONODJI — Association de Développement et d’Entraide de Bédjondo"', 1)
    MARQUE = MARQUES["odeb"]
    return adeb | {
        "odeb-lonodji-embleme.svg": verre.svg_embleme("sombre", True),
        "odeb-lonodji-embleme-superposable.svg": verre.svg_embleme("sombre", False),
        "odeb-lonodji-embleme-clair.svg": verre.svg_embleme("clair", True),
        "odeb-lonodji-embleme-clair-superposable.svg": verre.svg_embleme("clair", False),
        "odeb-lonodji-embleme-plat.svg": plat.embleme(),
        "odeb-lonodji-embleme-mono.svg": plat.embleme(mono=plat.INK),
        "odeb-lonodji-embleme-reserve.svg": plat.embleme("reserve"),
        "odeb-lonodji-logo-horizontal.svg": verre.svg_horizontal("sombre"),
        "odeb-lonodji-logo-horizontal-clair.svg": verre.svg_horizontal("clair"),
        "odeb-lonodji-logo-horizontal-superposable.svg": verre.svg_horizontal("sombre", False),
        "odeb-lonodji-logo-horizontal-clair-superposable.svg": verre.svg_horizontal("clair", False),
        "odeb-lonodji-logo-vertical.svg": verre.svg_vertical("sombre"),
        "odeb-lonodji-logo-vertical-clair.svg": verre.svg_vertical("clair"),
    }


LISEZMOI = """ADEB LONODJI et projet ODEB LONODJI — identité visuelle « Les Pas vers l'Avenir »
Kit du 28 septembre 2026 · lonodji.org/odeb/identite

Un emblème, deux noms : le logo a été adopté le 28 septembre 2026 par l'association
ADEB LONODJI, qui l'utilise pour elle-même (fichiers adeb-lonodji-…) et pour son
projet ODEB LONODJI (fichiers odeb-lonodji-…). Les emblèmes seuls sont communs.

Le sens : trois empreintes, une par génération — les ancêtres (la plus grande,
la plus transparente), la génération actuelle, les générations futures (la plus
petite, la plus lumineuse) — avancent vers un soleil levant posé sur l'horizon.
Devise : « Sur les traces de nos ancêtres, bâtissons notre avenir. »

Fichiers
  odeb-lonodji-embleme.svg / -2048.png / -1024.png / -512.png
      emblème en verre sur son fond vert profond : écrans, réseaux, vidéos
  odeb-lonodji-embleme-superposable.svg / -1024.png (fond transparent)
      emblème en verre sans fond : à poser sur une photo ou un fond sombre
  odeb-lonodji-embleme-clair.svg / -1024.png, -clair-superposable.svg
      verre clair : papeterie, fonds blancs ou sable
  odeb-lonodji-embleme-plat.svg, -mono.svg, -reserve.svg
      versions à plat : impression courante, tampon, gravure, photocopie,
      broderie, petites tailles (en dessous de 40 px, prendre la version à plat)
  adeb-lonodji-logo-horizontal(.svg/.png), -clair, -superposable, -clair-superposable,
  adeb-lonodji-logo-vertical, -clair
      emblème + « ADEB LONODJI » + Association de Développement et d'Entraide de
      Bédjondo + Courage · Discipline · Héritage
  odeb-lonodji-logo-horizontal(.svg/.png), -clair, -superposable, -clair-superposable,
  odeb-lonodji-logo-vertical, -clair
      emblème + « ODEB LONODJI » + développement du sigle + devise du projet ;
      les textes sont en tracés : aucune police à installer ;
      « superposable » = sans fond, pour les en-têtes de documents et les photos
  odeb-lonodji-planche.pdf
      toutes les versions et les règles, pour l'imprimeur
  papier-en-tete-adeb-lonodji.docx / .pdf, papier-en-tete-odeb-lonodji.docx / .pdf
      papiers à en-tête A4 (association, projet)
  adeb-lonodji-banniere-…png, odeb-lonodji-banniere-…png
      bannières prêtes à poser : Facebook (1640 × 624), LinkedIn (1584 × 396),
      X (1500 × 500), YouTube (2560 × 1440, en JPEG) ; le logo tient dans la
      zone sûre des recadrages mobiles
  embleme-profil-1024.png, embleme-profil-whatsapp-640.png
      image de profil (Facebook, LinkedIn, WhatsApp) et icône de groupe WhatsApp :
      l'emblème sur fond vert profond, prévu pour le recadrage rond
  signature-e-mail-adeb-lonodji.html, signature-e-mail-odeb-lonodji.html
      signature de messagerie : ouvrir dans un navigateur, tout sélectionner,
      copier, coller dans Gmail (Paramètres → Signature), Outlook ou Thunderbird,
      puis remplacer les trois lignes entre crochets ; le logo est hébergé sur
      lonodji.org (…-signature-logo.png), rien à joindre
  carte-de-visite-adeb-lonodji.pdf, carte-de-visite-adeb-lonodji-planche-a4.pdf
      carte de visite 85 × 55 mm recto verso (nom, fonction, téléphone à
      remplacer par l'imprimeur ou dans un éditeur PDF) et planche A4 de dix
      cartes (recto puis verso, à retourner sur le bord long)
  modele-diaporama-adeb-lonodji.pptx, modele-diaporama-odeb-lonodji.pptx
      modèles PowerPoint 16:9 (titre, section, texte, deux colonnes, chiffres,
      fin) aux couleurs de l'identité ; installer DM Sans et Playfair Display
      (gratuites, Google Fonts) pour retrouver les polices, sinon Calibri et
      Cambria prennent le relais

Règles courtes
  - Ne pas déformer, recolorer, incliner ni séparer les empreintes du soleil.
  - Zone de protection : la hauteur d'une empreinte tout autour.
  - Taille minimale : emblème 40 px à l'écran, 12 mm imprimé ;
    logo horizontal 180 px / 45 mm. En dessous, l'emblème à plat.
  - Sur photo : version superposable ou réserve blanche, jamais l'emblème à plat couleur.
  - Un emblème, deux noms : jamais les deux noms sous le même emblème ; l'ancien
    logo bleu (avant le 28 septembre 2026) ne se mélange pas au nouveau.
  - Couleurs : vert profond #173B2D, vert feuille #2F6B4A, acacia #B6CF45,
    doré #F2C94C, encre #10241E, sable #F4F6F1.
  - Polices : DM Sans (nom, textes), Playfair Display (devise, titres).

Le logo appartient à l'association ADEB LONODJI. Usage libre pour parler de
l'association ou du projet ODEB LONODJI, à condition de ne pas le modifier ; toute
autre utilisation, écrire à l'association (lonodji.org/participer).
"""


def page_html(corps: str, fonts: str, largeur: int, hauteur: int, fond: str = "transparent") -> str:
    return (f'<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts} *{{box-sizing:border-box}} html,body{{margin:0;width:{largeur}px;height:{hauteur}px;background:{fond};overflow:hidden}} '
            f'svg{{display:block;width:{largeur}px;height:{hauteur}px}}</style><body>{corps}</body></html>')


def prefixe(svg: str, p: str) -> str:
    return verre.prefixe(svg, p)


PLANCHE_CSS = """
@page{size:A4;margin:14mm}
*{box-sizing:border-box} body{margin:0;font-family:"DM Sans",Arial,sans-serif;color:#10241e;font-size:10.5pt;line-height:1.45}
h1{font-size:22pt;letter-spacing:-.02em;margin:0 0 2mm} h2{font-size:13pt;margin:0 0 3mm;letter-spacing:-.01em}
.sub{color:#526159;margin:0 0 8mm;font-size:10pt}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5mm;margin-bottom:6mm}
.cell{border:1px solid #d5ddd6;border-radius:4mm;padding:4mm;text-align:center;page-break-inside:avoid}
.cell.dark{background:#173b2d;color:#fff} .cell.sable{background:#f4f6f1}
.cell svg{width:38mm;height:38mm;display:block;margin:0 auto 3mm} .cell b{display:block;font-size:9pt} .cell small{display:block;color:#526159;font-size:8pt} .cell.dark small{color:#c9d5cc}
.wide{border:1px solid #d5ddd6;border-radius:4mm;padding:3mm;margin-bottom:5mm;page-break-inside:avoid} .wide svg{width:100%;height:auto;display:block} .wide.dark{background:#173b2d}
.regles{display:grid;grid-template-columns:1fr 1fr;gap:6mm 8mm;margin-top:4mm} .regles p{margin:0 0 2mm} .regles b{display:block;margin-bottom:1mm}
.couleurs{display:flex;gap:3mm;margin:3mm 0 6mm} .couleurs div{flex:1;border-radius:3mm;padding:3mm;font-size:8pt;color:#fff;min-height:20mm} .couleurs div.clair{color:#10241e;border:1px solid #d5ddd6}
.pied{margin-top:8mm;color:#526159;font-size:8.5pt}
.saut{page-break-before:always}
"""


def planche_pdf(svgs: dict[str, str], fonts: str, pdf: Path) -> None:
    from playwright.sync_api import sync_playwright

    def cell(nom: str, legende: str, note: str, classe: str = "", pre: str = "a") -> str:
        s = prefixe(svgs[nom], pre)
        s = re.sub(r' width="\d+" height="\d+"', "", s, count=1)
        return f'<div class="cell {classe}">{s}<b>{legende}</b><small>{note}</small></div>'

    def wide(nom: str, pre: str) -> str:
        return re.sub(r' width="\d+" height="\d+"', "", prefixe(svgs[nom], pre), count=1)

    horizontal_clair, horizontal = wide("odeb-lonodji-logo-horizontal-clair.svg", "g"), wide("odeb-lonodji-logo-horizontal.svg", "h")
    adeb_clair, adeb = wide("adeb-lonodji-logo-horizontal-clair.svg", "i"), wide("adeb-lonodji-logo-horizontal.svg", "j")
    html = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{PLANCHE_CSS}</style><body>
    <h1>ADEB LONODJI · projet ODEB LONODJI — identité visuelle « Les Pas vers l’Avenir »</h1>
    <p class="sub">Planche pour l’imprimeur et les partenaires · logo adopté le 28 septembre 2026 par l’association, pour elle-même et pour son projet · lonodji.org/odeb/identite</p>
    <div class="grid">
      {cell("odeb-lonodji-embleme.svg", "Emblème verre", "écrans, réseaux, vidéos", "", "a")}
      {cell("odeb-lonodji-embleme-clair.svg", "Verre clair", "papeterie, fonds blancs", "", "b")}
      {cell("odeb-lonodji-embleme-superposable.svg", "Superposable", "sur photo ou fond sombre", "dark", "c")}
      {cell("odeb-lonodji-embleme-plat.svg", "À plat, couleur", "impression courante, petites tailles", "sable", "d")}
      {cell("odeb-lonodji-embleme-mono.svg", "Monochrome", "tampon, gravure, photocopie", "", "e")}
      {cell("odeb-lonodji-embleme-reserve.svg", "Réserve blanche", "sur couleur ou photo", "dark", "f")}
    </div>
    <div class="wide">{adeb_clair}</div>
    <div class="wide dark saut">{adeb}</div>
    <div class="wide">{horizontal_clair}</div>
    <div class="wide dark">{horizontal}</div>
    <h2 class="saut">Le sens, les couleurs, les règles</h2>
    <div class="regles">
      <div><b>Trois empreintes, trois générations</b><p>La première, la plus grande et la plus transparente : les ancêtres. La deuxième : la génération actuelle. La troisième, la plus petite et la plus lumineuse, sous le soleil : les générations futures. Elles se suivent comme on marche — pied gauche, pied droit — et rapetissent vers l’horizon.</p><b>Le soleil levant</b><p>Posé sur l’horizon, sept rayons, du doré au vert acacia : l’espoir, le développement, l’avenir. Le disque vert profond reprend la couleur du site et le disque du logo d’ADEB LONODJI, dont l’ODEB est la suite.</p><b>Devise</b><p>{DEVISE}</p></div>
      <div><b>Ce qu’on ne fait pas</b><p>Déformer, incliner, recolorer, ajouter une ombre ou un contour, séparer les empreintes du soleil, changer l’ordre ou le nombre des empreintes, réécrire le nom dans une autre police.</p><b>Zone de protection, tailles</b><p>Tout autour, la hauteur d’une empreinte. Emblème : 40 px à l’écran, 12 mm imprimé ; logo horizontal : 180 px ou 45 mm. En dessous, l’emblème à plat. Le verre s’écrase en noir et blanc : pour le tampon, la gravure et la photocopie, la version monochrome.</p><b>Un emblème, deux noms</b><p>« ADEB LONODJI » pour l’association, « ODEB LONODJI » pour le projet qu’elle porte ; jamais les deux noms sous le même emblème. L’ancien logo bleu (disque, empreintes, poignée de main) reste sur les documents publiés avant le 28 septembre 2026 et ne se mélange pas au nouveau.</p></div>
    </div>
    <div class="couleurs">
      <div style="background:#173b2d"><b>Vert profond</b><br>#173B2D · CMJN 85 45 70 45</div>
      <div style="background:#2f6b4a"><b>Vert feuille</b><br>#2F6B4A · CMJN 78 30 75 15</div>
      <div style="background:#b6cf45;color:#10241e"><b>Acacia</b><br>#B6CF45 · CMJN 35 0 85 0</div>
      <div style="background:#f2c94c;color:#10241e"><b>Doré</b><br>#F2C94C · CMJN 5 18 80 0</div>
      <div style="background:#10241e"><b>Encre</b><br>#10241E · CMJN 85 55 70 65</div>
      <div class="clair" style="background:#f4f6f1"><b>Sable</b><br>#F4F6F1 · CMJN 3 1 5 0</div>
    </div>
    <p><b>Polices.</b> DM Sans pour le nom et les textes (gras 800 pour « ODEB », fin 250 pour « LONODJI », lettres espacées) ; Playfair Display en italique pour la devise et les titres. Les logos de ce kit ont leurs textes convertis en tracés : aucune police à installer. Les équivalents CMJN sont indicatifs ; l’imprimeur ajuste sur épreuve.</p>
    <p class="pied">Identité adoptée le 28 septembre 2026 par ADEB LONODJI (Association de Développement et d’Entraide de Bédjondo, reconnue en 1995), pour l’association et pour son projet ODEB LONODJI. Bédjondo · Mandoul, Tchad · {TEL} · lonodji.org. Usage libre pour parler de l’association ou du projet sans modifier le logo ; toute autre utilisation, écrire à l’association.</p>
    </body></html>"""
    tmp = TMP / "planche.html"
    tmp.write_text(html, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(tmp.as_uri(), wait_until="load")
        pg.evaluate("document.fonts.ready")
        pg.pdf(path=str(pdf), format="A4", print_background=True, margin={"top": "14mm", "bottom": "14mm", "left": "14mm", "right": "14mm"})
        b.close()


EN_TETE_CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box} html,body{margin:0;width:210mm;height:297mm;font-family:"DM Sans",Arial,sans-serif;color:#10241e;font-size:11pt;line-height:1.5}
.tete{position:absolute;left:0;right:0;top:0;height:42mm;padding:12mm 18mm 0;display:flex;justify-content:space-between;align-items:flex-start}
.tete img{height:22mm;width:auto} .tete .adeb{text-align:right;font-size:8.5pt;color:#526159;line-height:1.4;padding-top:2mm} .tete .adeb b{display:block;color:#10241e;font-size:9.5pt;letter-spacing:.06em}
.filet{position:absolute;left:18mm;right:18mm;top:42mm;height:1px;background:linear-gradient(90deg,#f2c94c,#b6cf45 40%,rgba(182,207,69,0))}
.corps{position:absolute;left:18mm;right:18mm;top:54mm;bottom:34mm}
.corps p{margin:0 0 5mm} .corps .ref{color:#526159;font-size:9.5pt} .corps .objet b{letter-spacing:.02em}
.pied{position:absolute;left:18mm;right:18mm;bottom:12mm;border-top:1px solid #d5ddd6;padding-top:3mm;font-size:8pt;color:#526159;line-height:1.5;display:flex;justify-content:space-between;gap:8mm}
.pied b{color:#10241e}
"""


def papier_en_tete(fonts: str, logo_png: Path, pdf: Path, docx_path: Path, marque: str = "odeb") -> None:
    from playwright.sync_api import sync_playwright

    if marque == "adeb":
        ref, signature, pied_gauche, tete_droite = ("ADEB-2026-…", "Le président de l’association ADEB LONODJI", "<b>ADEB LONODJI</b> · Association de Développement et d’Entraide de Bédjondo · reconnue en 1995 · Courage · Discipline · Héritage · lonodji.org",
                                                    "<b>ASSOCIATION DE DÉVELOPPEMENT ET D’ENTRAIDE DE BÉDJONDO</b>reconnue en 1995 · Bédjondo, Mandoul, Tchad<br>Courage · Discipline · Héritage")
    else:
        ref, signature, pied_gauche, tete_droite = ("ODEB-2026-…", "Pour le projet ODEB LONODJI,<br>Le président de l’association ADEB LONODJI", "<b>ODEB LONODJI</b> · Organisation pour le Développement et l’Émergence Bedjonde · projet stratégique porté par l’ADEB LONODJI · lonodji.org/odeb",
                                                    "<b>PROJET PORTÉ PAR ADEB LONODJI</b>Association de Développement et d’Entraide de Bédjondo<br>reconnue en 1995 · Bédjondo, Mandoul, Tchad")
    corps = f"""<p class="ref">Bédjondo, le ……………………… · Réf. {ref}</p>
    <p class="objet"><b>Objet :</b> …………………………………………………………………………</p>
    <p>Madame, Monsieur,</p>
    <p>…</p>
    <p>Nous vous prions d’agréer, Madame, Monsieur, l’expression de notre considération distinguée.</p>
    <p style="margin-top:14mm">{signature}</p>"""
    html = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{EN_TETE_CSS}</style><body>
    <div class="tete"><img src="file://{logo_png}" alt=""><div class="adeb">{tete_droite}</div></div>
    <div class="filet"></div>
    <div class="corps">{corps}</div>
    <div class="pied"><div>{pied_gauche}</div><div><b>Contact</b> · {TEL} (appel et WhatsApp) · lonodji.org/participer</div></div>
    </body></html>"""
    tmp = TMP / "en-tete.html"
    tmp.write_text(html, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(tmp.as_uri(), wait_until="load")
        pg.evaluate("document.fonts.ready")
        pg.pdf(path=str(pdf), format="A4", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        b.close()

    # DOCX : même en-tête et pied, corps modifiable
    from docx import Document
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Mm, Pt, RGBColor

    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Mm(297), Mm(210)
    sec.left_margin = sec.right_margin = Mm(18)
    sec.top_margin, sec.bottom_margin = Mm(16), Mm(18)
    sec.header_distance, sec.footer_distance = Mm(10), Mm(8)
    style = doc.styles["Normal"]
    style.font.name = "DM Sans"
    style.font.size = Pt(11)
    style.font.color.rgb = RGBColor(0x10, 0x24, 0x1E)
    tete = sec.header.paragraphs[0]
    tete.add_run().add_picture(str(logo_png), height=Mm(20))
    p2 = sec.header.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p2.add_run(re.sub(r"<[^>]+>", " ", tete_droite.replace("<br>", " · ")).replace("  ", " ").strip())
    r.font.size, r.font.color.rgb = Pt(8), RGBColor(0x52, 0x61, 0x59)
    pied = sec.footer.paragraphs[0]
    r = pied.add_run(re.sub(r"<[^>]+>", "", pied_gauche) + f" · {TEL} (appel et WhatsApp)")
    r.font.size, r.font.color.rgb = Pt(8), RGBColor(0x52, 0x61, 0x59)
    for texte in [f"Bédjondo, le ……………………… · Réf. {ref}", "Objet : …", "", "Madame, Monsieur,", "", "…", "",
                  "Nous vous prions d’agréer, Madame, Monsieur, l’expression de notre considération distinguée.", "", ""] + signature.split("<br>"):
        doc.add_paragraph(texte)
    doc.save(str(docx_path))


# ---------------------------------------------------------------- réseaux sociaux, signature, cartes de visite
FOND_RESEAU = "background:radial-gradient(circle at 18% 20%, rgba(182,207,69,.22), transparent 38%), radial-gradient(circle at 84% 78%, rgba(242,201,76,.16), transparent 34%), linear-gradient(120deg,#0f3327 0%,#123a2b 55%,#071b15 100%)"
BANNIERES = [  # (suffixe, largeur, hauteur, hauteur du logo en % de la hauteur)
    ("banniere-facebook-1640x624", 1640, 624, 62),
    ("banniere-linkedin-1584x396", 1584, 396, 64),
    ("banniere-x-1500x500", 1500, 500, 62),
    ("banniere-youtube-2560x1440", 2560, 1440, 34),
]


def reseaux_sociaux(b, fonts: str, svgs: dict[str, str]) -> list[str]:
    """Bannières (Facebook, LinkedIn, X, YouTube) pour les deux noms, image de
    profil et icône de groupe WhatsApp (emblème commun)."""
    faits = []
    for marque in ("adeb", "odeb"):
        logo = svgs[f"{marque}-lonodji-logo-horizontal-superposable.svg"]
        logo = re.sub(r' width="\d+" height="\d+"', "", logo, count=1)
        for suffixe, w, h, pct in BANNIERES:
            hl = h * pct / 100
            # zone sûre : le logo tient dans les 60 % centraux (recadrage mobile de Facebook, avatar de LinkedIn en bas à gauche)
            corps = (f'<div style="position:relative;width:{w}px;height:{h}px;{FOND_RESEAU}">'
                     f'<div style="position:absolute;inset:0;display:grid;place-items:center"><div style="width:{hl * 2000 / 640:.0f}px;height:{hl:.0f}px">{logo}</div></div>'
                     f'<div style="position:absolute;right:{h * .06:.0f}px;bottom:{h * .06:.0f}px;font:600 {h * .035:.0f}px/1 \'DM Sans\',system-ui,sans-serif;letter-spacing:.14em;color:rgba(255,255,255,.62)">LONODJI.ORG</div></div>')
            page = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            page.set_content(page_html(corps, fonts, w, h))
            page.wait_for_timeout(120)
            nom = f"{marque}-lonodji-{suffixe}." + ("jpg" if w >= 2000 else "png")  # YouTube en JPEG : 2560 px en PNG pèserait 2 Mo
            page.screenshot(path=str(OUT / nom), type="jpeg", quality=90) if nom.endswith(".jpg") else page.screenshot(path=str(OUT / nom))
            page.close()
            faits.append(nom)
            if suffixe.startswith("banniere-facebook"):  # aperçu léger pour la page Identité (et la charte PDF)
                from PIL import Image

                im = Image.open(OUT / nom).convert("RGB")
                im.thumbnail((820, 312))
                im.save(OUT / f"{marque}-lonodji-banniere-apercu.jpg", "JPEG", quality=82, optimize=True)
                faits.append(f"{marque}-lonodji-banniere-apercu.jpg")
    # fond des diapositives sombres (modèles PowerPoint), 16:9 sans logo
    page = b.new_page(viewport={"width": 2560, "height": 1440}, device_scale_factor=1)
    page.set_content(page_html(f'<div style="width:2560px;height:1440px;{FOND_RESEAU}"></div>', fonts, 2560, 1440))
    page.wait_for_timeout(80)
    page.screenshot(path=str(OUT / "fond-diaporama-sombre-2560x1440.jpg"), type="jpeg", quality=88)
    page.close()
    faits.append("fond-diaporama-sombre-2560x1440.jpg")
    # logos horizontaux allégés (1000 px) pour les diaporamas
    from PIL import Image

    for marque in ("adeb", "odeb"):
        im = Image.open(OUT / f"{marque}-lonodji-logo-horizontal-superposable.png")
        im.thumbnail((1000, 320))
        im.save(OUT / f"{marque}-lonodji-logo-horizontal-superposable-1000.png", "PNG", optimize=True)
        faits.append(f"{marque}-lonodji-logo-horizontal-superposable-1000.png")
    # profil (Facebook, LinkedIn, WhatsApp) : l'emblème sur un carré vert profond, à l'aise dans le recadrage rond
    emb = re.sub(r' width="\d+" height="\d+"', "", svgs["odeb-lonodji-embleme.svg"], count=1)
    for taille, nom in ((1024, "embleme-profil-1024.png"), (640, "embleme-profil-whatsapp-640.png")):
        page = b.new_page(viewport={"width": taille, "height": taille}, device_scale_factor=1)
        page.set_content(page_html(f'<div style="width:{taille}px;height:{taille}px;display:grid;place-items:center;background:#173b2d"><div style="width:{taille * .84:.0f}px;height:{taille * .84:.0f}px">{emb}</div></div>', fonts, taille, taille))
        page.wait_for_timeout(120)
        page.screenshot(path=str(OUT / nom))
        page.close()
        faits.append(nom)
    return faits


SIGNATURE = """<!doctype html><html lang="fr"><meta charset="utf-8"><title>Signature e-mail — {NOM}</title>
<!-- Signature e-mail {NOM}. Ouvrir ce fichier dans un navigateur, tout sélectionner (Ctrl+A), copier (Ctrl+C),
     puis coller dans Gmail (Paramètres → Signature), Outlook ou Thunderbird. Remplacer les trois lignes entre crochets. -->
<body style="margin:24px;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#10241e">
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#10241e;font-size:14px;line-height:1.45">
<tr>
<td style="padding:0 18px 0 0;border-right:1px solid #d5ddd6;vertical-align:middle"><a href="{URL}" style="text-decoration:none"><img src="https://lonodji.org/odeb/identite/{LOGO}" width="200" height="64" alt="{NOM}" style="display:block;width:200px;height:64px;border:0"></a></td>
<td style="padding:0 0 0 18px;vertical-align:middle">
<div style="font-size:16px;font-weight:700;letter-spacing:.01em">[Prénom NOM]</div>
<div style="color:#526159;margin:2px 0 8px">[Fonction] · <b style="color:#173b2d">{NOM}</b></div>
<div style="font-size:13px;color:#526159">{DESCRIPTION}</div>
<div style="font-size:13px;margin-top:8px"><a href="tel:{TELHREF}" style="color:#173b2d;text-decoration:none">[+235 …]</a> · <a href="mailto:" style="color:#173b2d;text-decoration:none">[prenom.nom@…]</a> · <a href="{URL}" style="color:#173b2d;text-decoration:none;font-weight:700">{URLCOURTE}</a></div>
</td>
</tr>
</table>
</body></html>
"""


def signatures_email(b, fonts: str) -> list[str]:
    """Deux signatures HTML (association, projet) et le petit logo hébergé qu'elles affichent."""
    faits = []
    for marque, nom, description, url, url_courte in (
        ("adeb", "ADEB LONODJI", "Association de Développement et d’Entraide de Bédjondo · Courage · Discipline · Héritage", "https://lonodji.org", "lonodji.org"),
        ("odeb", "ODEB LONODJI", "Organisation pour le Développement et l’Émergence Bedjonde · projet porté par l’ADEB LONODJI", "https://lonodji.org/odeb", "lonodji.org/odeb"),
    ):
        logo = f"{marque}-lonodji-signature-logo.png"
        # logo clair superposable, 400 × 128 (affiché 200 × 64), pour les fonds blancs des messageries
        from PIL import Image

        im = Image.open(OUT / f"{marque}-lonodji-logo-horizontal-clair-superposable.png")
        im.thumbnail((400, 128))
        im.save(OUT / logo, "PNG", optimize=True)
        html = SIGNATURE.replace("{NOM}", nom).replace("{LOGO}", logo).replace("{DESCRIPTION}", description).replace("{URL}", url).replace("{URLCOURTE}", url_courte).replace("{TELHREF}", "")
        (OUT / f"signature-e-mail-{marque}-lonodji.html").write_text(html, encoding="utf-8")
        faits += [logo, f"signature-e-mail-{marque}-lonodji.html"]
    return faits


CARTE_CSS = """
*{box-sizing:border-box} html,body{margin:0;font-family:'DM Sans',Arial,sans-serif;color:#10241e;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.carte{position:relative;width:85mm;height:55mm;overflow:hidden;page-break-after:always}
.recto{background:radial-gradient(circle at 18% 20%, rgba(182,207,69,.22), transparent 38%), radial-gradient(circle at 84% 78%, rgba(242,201,76,.16), transparent 34%), linear-gradient(120deg,#0f3327 0%,#123a2b 55%,#071b15 100%);display:grid;place-items:center}
.recto svg{width:62mm;height:auto}
.verso{background:#fff;padding:7mm 7mm 6mm}
.verso .nom{font-size:12.5pt;font-weight:700;letter-spacing:.01em;margin:0}
.verso .fonction{font-size:8.5pt;color:#526159;margin:1mm 0 0}
.verso .orga{font-size:8pt;color:#173b2d;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:4mm 0 0}
.verso .orga small{display:block;font-weight:500;letter-spacing:0;text-transform:none;color:#526159;font-size:7.5pt;margin-top:.5mm}
.verso .contact{position:absolute;left:7mm;bottom:6mm;font-size:8pt;line-height:1.55;color:#10241e}
.verso .contact b{color:#173b2d}
.verso .qr{position:absolute;right:7mm;bottom:6mm;width:15mm;height:15mm}
.verso .qr svg{width:100%;height:100%}
.verso .emb{position:absolute;right:7mm;top:6mm;width:11mm;height:11mm}
.verso .emb svg{width:100%;height:100%}
.verso .filet{position:absolute;left:7mm;right:7mm;bottom:22mm;height:1px;background:linear-gradient(90deg,#f2c94c,#b6cf45 40%,rgba(182,207,69,0))}
"""
PLANCHE_CARTES_CSS = """
@page{size:A4;margin:0}
html,body{margin:0;width:210mm;height:297mm}
.page{position:relative;width:210mm;height:297mm;page-break-after:always}
.grille{position:absolute;left:14mm;top:11mm;display:grid;grid-template-columns:85mm 85mm;grid-auto-rows:55mm;gap:0 12mm}
.grille .carte{page-break-after:auto;outline:.2mm solid #cfd8d0}
.repere{position:absolute;left:14mm;right:14mm;bottom:8mm;font:7.5pt 'DM Sans',Arial,sans-serif;color:#607069;text-align:center}
"""


def cartes_de_visite(fonts: str, svgs: dict[str, str]) -> list[str]:
    """Carte de visite ADEB LONODJI (85 × 55 mm, recto verso) et planche A4 de dix cartes."""
    import segno
    from playwright.sync_api import sync_playwright

    logo = re.sub(r' width="\d+" height="\d+"', "", svgs["adeb-lonodji-logo-horizontal-superposable.svg"], count=1)
    emb = re.sub(r' width="\d+" height="\d+"', "", svgs["odeb-lonodji-embleme-plat.svg"], count=1)
    q = segno.make("https://lonodji.org", error="m")
    w, h = q.symbol_size(scale=1, border=0)
    qr = q.svg_inline(scale=1, border=0, dark="#173b2d", light=None).replace("<svg ", f'<svg viewBox="0 0 {w} {h}" shape-rendering="crispEdges" ', 1)
    recto = f'<div class="carte recto">{logo}</div>'
    verso = f"""<div class="carte verso"><div class="emb">{emb}</div>
    <p class="nom">Prénom NOM</p><p class="fonction">Fonction dans l’association</p>
    <p class="orga">ADEB LONODJI<small>Association de Développement et d’Entraide de Bédjondo · Courage · Discipline · Héritage</small></p>
    <div class="filet"></div>
    <div class="contact"><b>+235 00 00 00 00</b> · appel et WhatsApp<br>prenom.nom@…<br><b>lonodji.org</b></div>
    <div class="qr">{qr}</div></div>"""
    faits = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        tmp = TMP / "carte.html"
        tmp.write_text(f'<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{CARTE_CSS} @page{{size:85mm 55mm;margin:0}}</style><body>{recto}{verso}</body></html>', encoding="utf-8")
        pg.goto(tmp.as_uri(), wait_until="load"); pg.evaluate("document.fonts.ready")
        pg.pdf(path=str(OUT / "carte-de-visite-adeb-lonodji.pdf"), width="85mm", height="55mm", print_background=True, prefer_css_page_size=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        faits.append("carte-de-visite-adeb-lonodji.pdf")
        # planche A4 : dix cartes recto, puis dix versos (même ordre : impression recto verso retournée sur le bord long)
        pages = "".join(f'<div class="page"><div class="grille">{face * 10}</div><div class="repere">{titre} · 10 cartes de 85 × 55 mm · découper sur le trait · ADEB LONODJI · lonodji.org/odeb/identite</div></div>' for face, titre in ((recto, "Recto"), (verso, "Verso")))
        tmp.write_text(f'<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{CARTE_CSS}{PLANCHE_CARTES_CSS}</style><body>{pages}</body></html>', encoding="utf-8")
        pg.goto(tmp.as_uri(), wait_until="load"); pg.evaluate("document.fonts.ready")
        pg.pdf(path=str(OUT / "carte-de-visite-adeb-lonodji-planche-a4.pdf"), format="A4", print_background=True, prefer_css_page_size=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        faits.append("carte-de-visite-adeb-lonodji-planche-a4.pdf")
        b.close()
    return faits


def main() -> None:
    global TRACEUR
    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    fonts = og.font_faces()
    TRACEUR = Traceur(polices())
    svgs = fichiers_svg()
    for nom, svg in svgs.items():
        (OUT / nom).write_text(svg, encoding="utf-8")
    print(f"{len(svgs)} SVG")

    # PNG
    rendus = [
        ("odeb-lonodji-embleme.svg", 1024, 1024, 2, "odeb-lonodji-embleme-2048.png"),
        ("odeb-lonodji-embleme.svg", 1024, 1024, 1, "odeb-lonodji-embleme-1024.png"),
        ("odeb-lonodji-embleme.svg", 512, 512, 1, "odeb-lonodji-embleme-512.png"),
        ("odeb-lonodji-embleme-superposable.svg", 1024, 1024, 1, "odeb-lonodji-embleme-superposable-1024.png"),
        ("odeb-lonodji-embleme-superposable.svg", 512, 512, 1, "odeb-lonodji-embleme-superposable-512.png"),
        ("odeb-lonodji-embleme-clair-superposable.svg", 512, 512, 1, "odeb-lonodji-embleme-clair-superposable-512.png"),
        ("odeb-lonodji-embleme-clair.svg", 1024, 1024, 1, "odeb-lonodji-embleme-clair-1024.png"),
        ("odeb-lonodji-embleme-plat.svg", 512, 512, 2, "odeb-lonodji-embleme-plat-1024.png"),
        ("odeb-lonodji-logo-horizontal.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal.png"),
        ("odeb-lonodji-logo-horizontal-clair.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal-clair.png"),
        ("odeb-lonodji-logo-horizontal-superposable.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal-superposable.png"),
        ("odeb-lonodji-logo-horizontal-clair-superposable.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal-clair-superposable.png"),
        ("odeb-lonodji-logo-vertical.svg", 1080, 1350, 1, "odeb-lonodji-logo-vertical.png"),
        ("odeb-lonodji-logo-vertical-clair.svg", 1080, 1350, 1, "odeb-lonodji-logo-vertical-clair.png"),
        ("adeb-lonodji-logo-horizontal.svg", 2000, 640, 1, "adeb-lonodji-logo-horizontal.png"),
        ("adeb-lonodji-logo-horizontal-clair.svg", 2000, 640, 1, "adeb-lonodji-logo-horizontal-clair.png"),
        ("adeb-lonodji-logo-horizontal-superposable.svg", 2000, 640, 1, "adeb-lonodji-logo-horizontal-superposable.png"),
        ("adeb-lonodji-logo-horizontal-clair-superposable.svg", 2000, 640, 1, "adeb-lonodji-logo-horizontal-clair-superposable.png"),
        ("adeb-lonodji-logo-vertical.svg", 1080, 1350, 1, "adeb-lonodji-logo-vertical.png"),
        ("adeb-lonodji-logo-vertical-clair.svg", 1080, 1350, 1, "adeb-lonodji-logo-vertical-clair.png"),
    ]
    with sync_playwright() as p:
        b = p.chromium.launch()
        for nom, w, h, scale, png in rendus:
            page = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
            svg = svgs[nom]
            svg = re.sub(r' width="\d+" height="\d+"', f' width="{w}" height="{h}"', svg, count=1)
            page.set_content(page_html(svg, fonts, w, h))
            page.wait_for_timeout(150)
            page.screenshot(path=str(OUT / png), omit_background=True)
            page.close()
        # icônes du site (favicon, écran d'accueil, application) : l'emblème sur son fond, rond ou carré
        ICONES = ROOT / "public" / "icones"
        ICONES.mkdir(parents=True, exist_ok=True)
        for taille, nom, rond in ((512, ICONES / "icone-512.png", True), (192, ICONES / "icone-192.png", True), (512, ICONES / "icone-512-maskable.png", False), (180, ROOT / "app" / "apple-icon.png", False), (96, ICONES / "raccourci-odeb.png", True)):
            page = b.new_page(viewport={"width": taille, "height": taille}, device_scale_factor=1)
            svg = re.sub(r' width="\d+" height="\d+"', f' width="{taille}" height="{taille}"', svgs["odeb-lonodji-embleme.svg"], count=1)
            style = "border-radius:50%;overflow:hidden" if rond else ""
            page.set_content(page_html(f'<div style="width:{taille}px;height:{taille}px;{style}">{svg}</div>', fonts, taille, taille))
            page.wait_for_timeout(100)
            page.screenshot(path=str(nom), omit_background=True)
            page.close()
        reseaux = reseaux_sociaux(b, fonts, svgs)
        b.close()
    print(f"{len(rendus)} PNG + icônes + {len(reseaux)} images pour les réseaux")
    (ROOT / "app" / "icon.svg").write_text(svgs["odeb-lonodji-embleme-plat.svg"].replace('width="512" height="512"', 'width="64" height="64"'), encoding="utf-8")

    planche_pdf(svgs, fonts, OUT / "odeb-lonodji-planche.pdf")
    print("planche PDF")
    papier_en_tete(fonts, OUT / "odeb-lonodji-logo-horizontal-clair-superposable.png", OUT / "papier-en-tete-odeb-lonodji.pdf", OUT / "papier-en-tete-odeb-lonodji.docx")
    papier_en_tete(fonts, OUT / "adeb-lonodji-logo-horizontal-clair-superposable.png", OUT / "papier-en-tete-adeb-lonodji.pdf", OUT / "papier-en-tete-adeb-lonodji.docx", "adeb")
    print("papiers à en-tête PDF + DOCX (ODEB, ADEB)")
    with sync_playwright() as p:
        b = p.chromium.launch()
        signatures_email(b, fonts)
        b.close()
    cartes_de_visite(fonts, svgs)
    print("signatures e-mail, cartes de visite")
    import subprocess

    subprocess.run(["node", str(ROOT / "scripts" / "build-diaporama.js"), "--modeles"], check=True)
    print("modèles de diaporama PPTX")

    (OUT / "LISEZMOI.txt").write_text(LISEZMOI, encoding="utf-8")
    kit = OUT / "kit-logo-odeb-lonodji.zip"
    with zipfile.ZipFile(kit, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.iterdir()):
            if f.suffix in {".svg", ".png", ".jpg", ".pdf", ".docx", ".txt", ".html", ".pptx"} and f.name != kit.name and not f.name.startswith("fond-diaporama") and "-1000." not in f.name and "-apercu." not in f.name:
                z.write(f, f"kit-logo-odeb-lonodji/{f.name}")
    print(f"kit : {kit.relative_to(ROOT)} ({kit.stat().st_size // 1024} Ko)")
    shutil.rmtree(TMP, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
