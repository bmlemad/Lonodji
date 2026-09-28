#!/usr/bin/env python3
"""Concept d'identité ODEB LONODJI — « Les Pas vers l'Avenir » (28/09/2026).

Trois empreintes stylisées, une par génération — les ancêtres, la génération
actuelle, les générations futures —, qui avancent vers un soleil levant.
Produit les SVG (emblème, logo horizontal, monochrome, réserve blanche) dans
design/odeb/ et des aperçus PNG. Rien n'est publié sur le site : c'est un concept
soumis à l'association.

    python3 design/odeb/build-logo.py
"""
from __future__ import annotations

import importlib.util
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]

DEEP = "#173b2d"      # vert profond du site
LEAF = "#2f6b4a"      # vert feuille (halo)
LIME = "#b6cf45"      # accent
GOLD = "#f2c94c"      # soleil
SABLE = "#f4f6f1"     # fond clair
INK = "#10241e"

# Empreinte de pied droit stylisée : plante large à l'avant, talon étroit, voûte
# creusée du côté du gros orteil ; cinq orteils décroissants. Centrée sur (0, 0), ~46 × 84.
PIED = (
    '<g id="pied">'
    '<path d="M1,-30 C14,-30 24,-22 23,-10 C22,3 17,16 15,27 C13,37 7,42 1,42 '
    'C-6,42 -11,36 -11,27 C-11,15 -7,4 -9,-6 C-11,-16 -23,-16 -22,-22 C-21,-28 -10,-30 1,-30 Z"/>'
    '<circle cx="-13" cy="-38" r="7"/><circle cx="-1" cy="-43" r="5.2"/><circle cx="9" cy="-42" r="4.6"/>'
    '<circle cx="17" cy="-38" r="4"/><circle cx="23" cy="-32" r="3.4"/>'
    '</g>'
)


def soleil(cx: float, cy: float, r: float, rayons: bool = True, fill: str = "url(#soleil)", stroke: str = GOLD) -> str:
    """Demi-disque posé sur l'horizon, rayons courts au-dessus."""
    out = [f'<path d="M{cx - r},{cy} A{r},{r} 0 0 1 {cx + r},{cy} Z" fill="{fill}"/>']
    if rayons:
        import math
        for deg in (18, 42, 66, 90, 114, 138, 162):
            a = math.radians(deg)
            x1, y1 = cx + math.cos(a) * (r + 16), cy - math.sin(a) * (r + 16)
            x2, y2 = cx + math.cos(a) * (r + 34), cy - math.sin(a) * (r + 34)
            out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="7" stroke-linecap="round"/>')
    return "".join(out)


def pas(couleurs: tuple[str, str, str], opacites=(0.62, 0.82, 1.0)) -> str:
    """Trois empreintes qui montent vers le soleil : ancêtres, présent, avenir."""
    return "".join([
        # ancêtres : pied gauche, le plus grand, en bas à gauche
        f'<use href="#pied" transform="translate(168,404) rotate(-22) scale(-1.5,1.5)" fill="{couleurs[0]}" opacity="{opacites[0]}"/>',
        # génération actuelle : pied droit, au milieu
        f'<use href="#pied" transform="translate(292,330) rotate(-12) scale(1.22)" fill="{couleurs[1]}" opacity="{opacites[1]}"/>',
        # générations futures : pied gauche, le plus petit et le plus clair, sous le soleil
        f'<use href="#pied" transform="translate(228,258) rotate(-6) scale(-0.95,0.95)" fill="{couleurs[2]}" opacity="{opacites[2]}"/>',
    ])


def embleme(fond: str = "disque", mono: str | None = None) -> str:
    """Emblème carré 512 : disque vert, horizon, soleil levant, trois empreintes."""
    defs = (
        '<defs>'
        f'<linearGradient id="soleil" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{GOLD}"/><stop offset="1" stop-color="{LIME}"/></linearGradient>'
        f'<radialGradient id="halo" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="{LEAF}"/><stop offset="1" stop-color="{DEEP}"/></radialGradient>'
        f'{PIED}'
        '</defs>'
    )
    if mono:  # monochrome : tout en une couleur, disque en contour
        corps = (
            f'<circle cx="256" cy="256" r="244" fill="none" stroke="{mono}" stroke-width="10"/>'
            f'<line x1="104" y1="188" x2="408" y2="188" stroke="{mono}" stroke-width="6" stroke-linecap="round"/>'
            + soleil(256, 188, 66, fill=mono, stroke=mono)
            + pas((mono, mono, mono), (0.45, 0.7, 1.0))
        )
    elif fond == "reserve":  # réserve blanche sur fond de couleur : pas de disque
        corps = (
            '<line x1="104" y1="188" x2="408" y2="188" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/>'
            + soleil(256, 188, 66, fill="#fff", stroke="#fff")
            + pas(("#fff", "#fff", "#fff"))
        )
    else:
        corps = (
            '<circle cx="256" cy="256" r="248" fill="url(#halo)"/>'
            '<line x1="104" y1="188" x2="408" y2="188" stroke="#fff" stroke-opacity=".42" stroke-width="5" stroke-linecap="round"/>'
            + soleil(256, 188, 66)
            + pas(("#e9d9b6", "#f3f0c2", "#ffffff"))
        )
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="ODEB LONODJI — Les Pas vers l’Avenir">{defs}{corps}</svg>'


def logo_horizontal(sombre: bool = False) -> str:
    """Emblème + nom + développement du sigle + devise, 1700 × 520."""
    ink = "#fff" if sombre else INK
    muted = "#c9d5cc" if sombre else "#526159"
    fond = f'<rect width="1700" height="520" fill="{DEEP}"/>' if sombre else ""
    emb = embleme("reserve") if sombre else embleme()
    inner = emb.split(">", 1)[1].rsplit("</svg>", 1)[0]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1700 520" width="1700" height="520" role="img" aria-label="ODEB LONODJI — Organisation pour le Développement et l’Émergence Bedjonde">'
        f'{fond}'
        f'<g transform="translate(60,36) scale(0.875)">{inner}</g>'
        f'<text x="560" y="206" font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="700" font-size="124" letter-spacing="5" fill="{ink}">ODEB <tspan font-weight="400">LONODJI</tspan></text>'
        f'<text x="563" y="258" font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="600" font-size="27" letter-spacing="6" fill="{muted}">ORGANISATION POUR LE DÉVELOPPEMENT</text>'
        f'<text x="563" y="296" font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="600" font-size="27" letter-spacing="6" fill="{muted}">ET L’ÉMERGENCE BEDJONDE</text>'
        f'<line x1="563" y1="336" x2="643" y2="336" stroke="{LIME}" stroke-width="6" stroke-linecap="round"/>'
        f'<text x="563" y="400" font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="38" fill="{ink}">« Sur les traces de nos ancêtres, bâtissons notre avenir. »</text>'
        '</svg>'
    )


def logo_vertical(sombre: bool = False) -> str:
    """Emblème au-dessus du nom, centré : avatars, affiches, couvertures. 900 × 1080."""
    ink = "#fff" if sombre else INK
    muted = "#c9d5cc" if sombre else "#526159"
    fond = f'<rect width="900" height="1080" fill="{DEEP}"/>' if sombre else ""
    emb = embleme("reserve") if sombre else embleme()
    inner = emb.split(">", 1)[1].rsplit("</svg>", 1)[0]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1080" width="900" height="1080" role="img" aria-label="ODEB LONODJI — Organisation pour le Développement et l’Émergence Bedjonde">'
        f'{fond}'
        f'<g transform="translate(194,60)">{inner}</g>'
        f'<text x="450" y="720" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="700" font-size="112" letter-spacing="5" fill="{ink}">ODEB <tspan font-weight="400">LONODJI</tspan></text>'
        f'<text x="450" y="774" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="600" font-size="24" letter-spacing="6" fill="{muted}">ORGANISATION POUR LE DÉVELOPPEMENT</text>'
        f'<text x="450" y="810" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="600" font-size="24" letter-spacing="6" fill="{muted}">ET L’ÉMERGENCE BEDJONDE</text>'
        f'<line x1="410" y1="852" x2="490" y2="852" stroke="{LIME}" stroke-width="6" stroke-linecap="round"/>'
        f'<text x="450" y="922" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="34" fill="{ink}">« Sur les traces de nos ancêtres,</text>'
        f'<text x="450" y="968" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="34" fill="{ink}">bâtissons notre avenir. »</text>'
        '</svg>'
    )


def main() -> None:
    fichiers = {
        "odeb-embleme.svg": embleme(),
        "odeb-embleme-reserve.svg": embleme("reserve"),
        "odeb-embleme-mono.svg": embleme(mono=INK),
        "odeb-logo-horizontal.svg": logo_horizontal(False),
        "odeb-logo-horizontal-sombre.svg": logo_horizontal(True),
        "odeb-logo-vertical.svg": logo_vertical(False),
        "odeb-logo-vertical-sombre.svg": logo_vertical(True),
    }
    for nom, svg in fichiers.items():
        (HERE / nom).write_text(svg, encoding="utf-8")
        print(nom)

    # aperçus PNG (polices du site) et planche de présentation
    from playwright.sync_api import sync_playwright
    spec = importlib.util.spec_from_file_location("build_og", ROOT / "scripts" / "build-og.py")
    og = importlib.util.module_from_spec(spec); assert spec.loader; spec.loader.exec_module(og)
    fonts = og.font_faces()
    planche = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}
    *{{box-sizing:border-box}} body{{margin:0;width:1600px;background:{SABLE};font-family:"DM Sans",Arial,sans-serif;color:{INK};padding:56px 64px}}
    h1{{margin:0 0 6px;font-size:40px;letter-spacing:-.02em}} .sub{{margin:0 0 34px;font-size:18px;color:#526159}}
    .grid{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;margin-bottom:30px}}
    .card{{background:#fff;border:1px solid rgba(16,36,30,.12);border-radius:24px;padding:26px;text-align:center}}
    .card.dark{{background:{DEEP};color:#fff}} .card>svg{{width:300px;height:300px}} .card p{{margin:14px 0 0;font-size:15px;color:#526159}} .card.dark p{{color:#c9d5cc}}
    .wide{{background:#fff;border:1px solid rgba(16,36,30,.12);border-radius:24px;padding:20px;margin-bottom:26px}} .wide svg{{width:100%;height:auto}} .wide.dark{{background:{DEEP}}}
    .legende{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;font-size:15px;line-height:1.5;color:#3f4f48}} .legende b{{display:block;color:{INK};font-size:16px;margin-bottom:4px}}
    </style><body>
    <h1>ODEB LONODJI — concept 1 amélioré : « Les Pas vers l’Avenir »</h1>
    <p class="sub">Trois empreintes, une par génération, qui avancent vers un soleil levant. Concept du 28 septembre 2026, soumis à l’association ; rien n’est publié.</p>
    <div class="grid">
      <div class="card">{fichiers["odeb-embleme.svg"]}<p>Emblème couleur, fond clair</p></div>
      <div class="card dark">{fichiers["odeb-embleme-reserve.svg"]}<p>Réserve blanche, fond vert ou photo</p></div>
      <div class="card">{fichiers["odeb-embleme-mono.svg"]}<p>Monochrome, tampon, photocopie, gravure</p></div>
    </div>
    <div class="wide">{fichiers["odeb-logo-horizontal.svg"]}</div>
    <div class="wide dark">{fichiers["odeb-logo-horizontal-sombre.svg"]}</div>
    <div class="grid">
      <div class="card">{fichiers["odeb-logo-vertical.svg"].replace('width="900" height="1080"', 'width="300" height="360"')}<p>Version verticale : avatars, affiches, couvertures</p></div>
      <div class="card dark">{fichiers["odeb-logo-vertical-sombre.svg"].replace('width="900" height="1080"', 'width="300" height="360"')}<p>Verticale sur fond vert</p></div>
      <div class="card"><div style="display:flex;align-items:flex-end;justify-content:center;gap:28px;height:300px">{fichiers["odeb-embleme.svg"].replace('width="512" height="512"', 'width="160" height="160"')}{fichiers["odeb-embleme.svg"].replace('width="512" height="512"', 'width="96" height="96"')}{fichiers["odeb-embleme.svg"].replace('width="512" height="512"', 'width="48" height="48"')}{fichiers["odeb-embleme.svg"].replace('width="512" height="512"', 'width="32" height="32"')}</div><p>Tenue aux petites tailles : 160, 96, 48 et 32 px (icône de site, WhatsApp)</p></div>
    </div>
    <div class="legende">
      <div><b>Les trois pas</b>La première empreinte, la plus grande et la plus proche, ce sont les ancêtres ; la deuxième, la génération actuelle ; la troisième, la plus claire, près du soleil, les générations futures. Elles se suivent comme on marche : un pied gauche, un pied droit.</div>
      <div><b>Le soleil levant</b>Posé sur l’horizon, sept rayons, du doré au vert acacia du site : l’espoir, le développement, l’avenir. Le disque vert profond reprend la couleur du site et le disque du logo d’ADEB LONODJI, dont l’ODEB est la suite.</div>
      <div><b>Ce qui reste à décider</b>Le nom en capitales, la devise en italique ; les couleurs peuvent basculer vers le bleu du logo ADEB pour marquer la filiation, ou rester vertes pour marquer l’étape nouvelle. Les textes seront convertis en tracés dans la version finale.</div>
    </div></body></html>"""
    (HERE / "planche.html").write_text(planche, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1600, "height": 1200}, device_scale_factor=1)
        pg.goto((HERE / "planche.html").as_uri(), wait_until="load")
        pg.screenshot(path=str(HERE / "planche-les-pas-vers-l-avenir.png"), full_page=True)
        for nom in ("odeb-embleme.svg", "odeb-embleme-reserve.svg", "odeb-embleme-mono.svg"):
            page = b.new_page(viewport={"width": 1024, "height": 1024})
            fond = DEEP if "reserve" in nom else "transparent"
            grand = fichiers[nom].replace('width="512" height="512"', 'width="1024" height="1024"')
            page.set_content(f'<html><body style="margin:0;background:{fond}">{grand}</body></html>')
            page.screenshot(path=str(HERE / nom.replace(".svg", "-1024.png")), omit_background=(fond == "transparent"))
            page.close()
        b.close()
    print("planche-les-pas-vers-l-avenir.png")


if __name__ == "__main__":
    main()
