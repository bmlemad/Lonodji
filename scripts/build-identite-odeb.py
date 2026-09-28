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
    d1, w1 = TRACEUR.tracer("ODEB ", "dm", taille, 800, taille * .04)
    d2, w2 = TRACEUR.tracer("LONODJI", "dm", taille, 250, taille * .06)
    w = w1 + w2
    dx = x - w / 2 if ancre == "middle" else x
    out.append(f'<g transform="translate({dx:.2f},{y:.2f})" fill="{ink}"><path d="{d1}"/><path transform="translate({w1:.2f},0)" d="{d2}"/></g>')
    out.append(TRACEUR.texte(SOUS_TITRE[0], "dm", st, 500, x + (0 if ancre == "middle" else 2), y + st * 2.1, doux, ancre, st * .3))
    out.append(TRACEUR.texte(SOUS_TITRE[1], "dm", st, 500, x + (0 if ancre == "middle" else 2), y + st * 3.5, doux, ancre, st * .3))
    ly = y + st * 4.7
    if ancre == "middle":
        out.append(f'<line x1="{x - 46}" y1="{ly:.0f}" x2="{x + 46}" y2="{ly:.0f}" stroke="{verre.GOLD}" stroke-width="4" stroke-linecap="round"/>')
    else:
        out.append(f'<line x1="{x + 2}" y1="{ly:.0f}" x2="{x + 96}" y2="{ly:.0f}" stroke="{verre.GOLD}" stroke-width="4" stroke-linecap="round"/>')
    if empile:
        a, b = DEVISE.split(", ")
        out.append(TRACEUR.texte(a + ",", "playfair", devise_taille, 400, x, ly + devise_taille * 1.7, dev, ancre, 0, 12))
        out.append(TRACEUR.texte(b, "playfair", devise_taille, 400, x, ly + devise_taille * 3.0, dev, ancre, 0, 12))
    else:
        out.append(TRACEUR.texte(DEVISE, "playfair", devise_taille, 400, x + 2, ly + devise_taille * 1.7, dev, "start", 0, 12))
    return "".join(out)


# ---------------------------------------------------------------- fichiers
def fichiers_svg() -> dict[str, str]:
    verre.texte_marque = texte_marque_traces  # svg_horizontal / svg_vertical appellent texte_marque par son nom
    return {
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


LISEZMOI = """ODEB LONODJI — identité visuelle « Les Pas vers l'Avenir »
Kit du 28 septembre 2026 · lonodji.org/odeb/identite

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
  odeb-lonodji-logo-horizontal(.svg/.png), -clair, -superposable, -clair-superposable,
  odeb-lonodji-logo-vertical, -clair
      emblème + nom + devise ; les textes sont en tracés : aucune police à installer ;
      « superposable » = sans fond, pour les en-têtes de documents et les photos
  odeb-lonodji-planche.pdf
      toutes les versions et les règles, pour l'imprimeur
  papier-en-tete-odeb-lonodji.docx / .pdf
      papier à en-tête A4

Règles courtes
  - Ne pas déformer, recolorer, incliner ni séparer les empreintes du soleil.
  - Zone de protection : la hauteur d'une empreinte tout autour.
  - Taille minimale : emblème 40 px à l'écran, 12 mm imprimé ;
    logo horizontal 180 px / 45 mm. En dessous, l'emblème à plat.
  - Sur photo : version superposable ou réserve blanche, jamais l'emblème à plat couleur.
  - Le projet est porté par ADEB LONODJI : quand les deux logos sont présents,
    celui de l'association vient en premier.
  - Couleurs : vert profond #173B2D, vert feuille #2F6B4A, acacia #B6CF45,
    doré #F2C94C, encre #10241E, sable #F4F6F1.
  - Polices : DM Sans (nom, textes), Playfair Display (devise, titres).

Le logo appartient à l'association ADEB LONODJI. Usage libre pour parler du
projet ODEB LONODJI, à condition de ne pas le modifier ; toute autre utilisation,
écrire à l'association (lonodji.org/participer, objet « Le projet ODEB LONODJI »).
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
    html = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{PLANCHE_CSS}</style><body>
    <h1>ODEB LONODJI — identité visuelle « Les Pas vers l’Avenir »</h1>
    <p class="sub">Planche pour l’imprimeur et les partenaires · kit du 28 septembre 2026 · lonodji.org/odeb/identite · le logo appartient à l’association ADEB LONODJI, qui porte le projet.</p>
    <div class="grid">
      {cell("odeb-lonodji-embleme.svg", "Emblème verre", "écrans, réseaux, vidéos", "", "a")}
      {cell("odeb-lonodji-embleme-clair.svg", "Verre clair", "papeterie, fonds blancs", "", "b")}
      {cell("odeb-lonodji-embleme-superposable.svg", "Superposable", "sur photo ou fond sombre", "dark", "c")}
      {cell("odeb-lonodji-embleme-plat.svg", "À plat, couleur", "impression courante, petites tailles", "sable", "d")}
      {cell("odeb-lonodji-embleme-mono.svg", "Monochrome", "tampon, gravure, photocopie", "", "e")}
      {cell("odeb-lonodji-embleme-reserve.svg", "Réserve blanche", "sur couleur ou photo", "dark", "f")}
    </div>
    <div class="wide">{horizontal_clair}</div>
    <div class="wide dark saut">{horizontal}</div>
    <h2>Le sens, les couleurs, les règles</h2>
    <div class="regles">
      <div><b>Trois empreintes, trois générations</b><p>La première, la plus grande et la plus transparente : les ancêtres. La deuxième : la génération actuelle. La troisième, la plus petite et la plus lumineuse, sous le soleil : les générations futures. Elles se suivent comme on marche — pied gauche, pied droit — et rapetissent vers l’horizon.</p><b>Le soleil levant</b><p>Posé sur l’horizon, sept rayons, du doré au vert acacia : l’espoir, le développement, l’avenir. Le disque vert profond reprend la couleur du site et le disque du logo d’ADEB LONODJI, dont l’ODEB est la suite.</p><b>Devise</b><p>{DEVISE}</p></div>
      <div><b>Ce qu’on ne fait pas</b><p>Déformer, incliner, recolorer, ajouter une ombre ou un contour, séparer les empreintes du soleil, changer l’ordre ou le nombre des empreintes, réécrire le nom dans une autre police.</p><b>Zone de protection, tailles</b><p>Tout autour, la hauteur d’une empreinte. Emblème : 40 px à l’écran, 12 mm imprimé ; logo horizontal : 180 px ou 45 mm. En dessous, l’emblème à plat. Le verre s’écrase en noir et blanc : pour le tampon, la gravure et la photocopie, la version monochrome.</p><b>Avec le logo d’ADEB LONODJI</b><p>Le projet est porté par l’association : quand les deux logos sont présents, celui de l’association vient en premier, à la même hauteur d’emblème.</p></div>
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
    <p class="pied">Identité retenue le 28 septembre 2026 pour le projet ODEB LONODJI, porté par ADEB LONODJI (Association de Développement et d’Entraide de Bédjondo, reconnue en 1995). Bédjondo · Mandoul, Tchad · {TEL} · lonodji.org/odeb. Usage libre pour parler du projet sans modifier le logo ; toute autre utilisation, écrire à l’association.</p>
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


def papier_en_tete(fonts: str, logo_png: Path, pdf: Path, docx_path: Path) -> None:
    from playwright.sync_api import sync_playwright

    corps = """<p class="ref">Bédjondo, le ……………………… · Réf. ODEB-2026-…</p>
    <p class="objet"><b>Objet :</b> …………………………………………………………………………</p>
    <p>Madame, Monsieur,</p>
    <p>…</p>
    <p>Nous vous prions d’agréer, Madame, Monsieur, l’expression de notre considération distinguée.</p>
    <p style="margin-top:14mm">Pour le projet ODEB LONODJI,<br>Le président de l’association ADEB LONODJI</p>"""
    html = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{EN_TETE_CSS}</style><body>
    <div class="tete"><img src="file://{logo_png}" alt="ODEB LONODJI"><div class="adeb"><b>PROJET PORTÉ PAR ADEB LONODJI</b>Association de Développement et d’Entraide de Bédjondo<br>reconnue en 1995 · Bédjondo, Mandoul, Tchad</div></div>
    <div class="filet"></div>
    <div class="corps">{corps}</div>
    <div class="pied"><div><b>ODEB LONODJI</b> · Organisation pour le Développement et l’Émergence Bedjonde · projet stratégique porté par l’ADEB LONODJI · lonodji.org/odeb</div><div><b>Contact</b> · {TEL} (appel et WhatsApp) · lonodji.org/participer</div></div>
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
    r = p2.add_run("PROJET PORTÉ PAR ADEB LONODJI — Association de Développement et d’Entraide de Bédjondo, reconnue en 1995 · Bédjondo, Mandoul, Tchad")
    r.font.size, r.font.color.rgb = Pt(8), RGBColor(0x52, 0x61, 0x59)
    pied = sec.footer.paragraphs[0]
    r = pied.add_run(f"ODEB LONODJI · Organisation pour le Développement et l’Émergence Bedjonde · projet stratégique porté par l’ADEB LONODJI · lonodji.org/odeb · {TEL} (appel et WhatsApp)")
    r.font.size, r.font.color.rgb = Pt(8), RGBColor(0x52, 0x61, 0x59)
    for texte in ["Bédjondo, le ……………………… · Réf. ODEB-2026-…", "Objet : …", "", "Madame, Monsieur,", "", "…", "",
                  "Nous vous prions d’agréer, Madame, Monsieur, l’expression de notre considération distinguée.", "", "",
                  "Pour le projet ODEB LONODJI,", "Le président de l’association ADEB LONODJI"]:
        doc.add_paragraph(texte)
    doc.save(str(docx_path))


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
        ("odeb-lonodji-embleme-clair.svg", 1024, 1024, 1, "odeb-lonodji-embleme-clair-1024.png"),
        ("odeb-lonodji-embleme-plat.svg", 512, 512, 2, "odeb-lonodji-embleme-plat-1024.png"),
        ("odeb-lonodji-logo-horizontal.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal.png"),
        ("odeb-lonodji-logo-horizontal-clair.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal-clair.png"),
        ("odeb-lonodji-logo-horizontal-superposable.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal-superposable.png"),
        ("odeb-lonodji-logo-horizontal-clair-superposable.svg", 2000, 640, 1, "odeb-lonodji-logo-horizontal-clair-superposable.png"),
        ("odeb-lonodji-logo-vertical.svg", 1080, 1350, 1, "odeb-lonodji-logo-vertical.png"),
        ("odeb-lonodji-logo-vertical-clair.svg", 1080, 1350, 1, "odeb-lonodji-logo-vertical-clair.png"),
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
        b.close()
    print(f"{len(rendus)} PNG")

    planche_pdf(svgs, fonts, OUT / "odeb-lonodji-planche.pdf")
    print("planche PDF")
    papier_en_tete(fonts, OUT / "odeb-lonodji-logo-horizontal-clair-superposable.png", OUT / "papier-en-tete-odeb-lonodji.pdf", OUT / "papier-en-tete-odeb-lonodji.docx")
    print("papier à en-tête PDF + DOCX")

    (OUT / "LISEZMOI.txt").write_text(LISEZMOI, encoding="utf-8")
    kit = OUT / "kit-logo-odeb-lonodji.zip"
    with zipfile.ZipFile(kit, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.iterdir()):
            if f.suffix in {".svg", ".png", ".pdf", ".docx", ".txt"} and f.name != kit.name:
                z.write(f, f"kit-logo-odeb-lonodji/{f.name}")
    print(f"kit : {kit.relative_to(ROOT)} ({kit.stat().st_size // 1024} Ko)")
    shutil.rmtree(TMP, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
