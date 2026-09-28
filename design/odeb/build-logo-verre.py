#!/usr/bin/env python3
"""ODEB LONODJI — « Les Pas vers l'Avenir », version verre (glassmorphism).

Même concept que build-logo.py (trois empreintes, une par génération, vers un
soleil levant), traité en verre dépoli : disque translucide qui floute ce qu'il
y a derrière, bord lumineux, reflets, empreintes en verre, soleil en lumière.
Produit dans design/odeb/verre/ :

- odeb-verre-embleme.svg / -2048.png        emblème sur fond premium sombre
- odeb-verre-embleme-clair.svg / -2048.png  emblème en verre clair (fond sable)
- odeb-verre-embleme-superposable.svg       sans fond, à poser sur photo ou fond sombre
- odeb-verre-logo-horizontal.svg / .png     emblème + nom + devise (2000 × 640)
- odeb-verre-logo-vertical.svg / .png       version empilée (1080 × 1350)
- planche-verre.png                         planche de présentation

    python3 design/odeb/build-logo-verre.py
"""
from __future__ import annotations

import importlib.util
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "verre"
ROOT = HERE.parents[1]

GOLD, GOLD_CLAIR, GOLD_FONCE = "#f2c94c", "#fff1b8", "#d9a12b"
LIME, DEEP, LEAF, INK = "#b6cf45", "#173b2d", "#2f6b4a", "#10241e"

# Empreinte de pied droit (plante large, talon étroit, cinq orteils), ~46 × 84, centrée (0,0).
PIED_PATH = ("M1,-30 C14,-30 24,-22 23,-10 C22,3 17,16 15,27 C13,37 7,42 1,42 "
             "C-6,42 -11,36 -11,27 C-11,15 -7,4 -9,-6 C-11,-16 -23,-16 -22,-22 C-21,-28 -10,-30 1,-30 Z")
ORTEILS = [(-13, -38, 7), (-1, -43, 5.2), (9, -42, 4.6), (17, -38, 4), (23, -32, 3.4)]


def pied_verre(idx: int, fill_id: str, stroke: str, halo: str) -> str:
    """Un pied en verre : plante + orteils, remplissage dégradé, bord fin, reflet."""
    orteils = "".join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y, r in ORTEILS)
    return (
        f'<g id="pied{idx}">'
        f'<g fill="url(#{fill_id})" stroke="{stroke}" stroke-width="1.1">'
        f'<path d="{PIED_PATH}"/>{orteils}</g>'
        # reflets spéculaires : arc de lumière sur le bord haut-gauche de la plante, pointe sur le gros orteil
        # lumière venant du soleil, au-dessus : reflets sur les bords hauts (symétriques, donc justes aussi en miroir)
        f'<path d="M-17,-21 C-12,-28 -2,-30 9,-29 C15,-28 20,-25 21,-20" fill="none" stroke="{halo}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>'
        f'<path d="M-17.5,-41.5 C-15.5,-44.5 -10.5,-44.5 -8.5,-41.5" fill="none" stroke="{halo}" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>'
        '</g>'
    )


def rayons(cx: float, cy: float, r: float, couleur: str, largeur: float = 9) -> str:
    out = []
    for deg in (18, 42, 66, 90, 114, 138, 162):
        a = math.radians(deg)
        lg = 34 if deg in (42, 90, 138) else 26
        x1, y1 = cx + math.cos(a) * (r + 26), cy - math.sin(a) * (r + 26)
        x2, y2 = cx + math.cos(a) * (r + 26 + lg), cy - math.sin(a) * (r + 26 + lg)
        out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{couleur}" stroke-width="{largeur}" stroke-linecap="round"/>')
    return "".join(out)


def fond_sombre(w: int, h: int) -> str:
    """Fond premium : vert profond, halos dorés et acacia flous, vignette."""
    return (
        f'<rect width="{w}" height="{h}" fill="url(#fondg)"/>'
        f'<g filter="url(#flou-fond)">'
        f'<circle cx="{w * .74:.0f}" cy="{h * .2:.0f}" r="{min(w, h) * .27:.0f}" fill="{GOLD}" opacity=".38"/>'
        f'<circle cx="{w * .2:.0f}" cy="{h * .82:.0f}" r="{min(w, h) * .3:.0f}" fill="{LIME}" opacity=".26"/>'
        f'<circle cx="{w * .3:.0f}" cy="{h * .28:.0f}" r="{min(w, h) * .33:.0f}" fill="{LEAF}" opacity=".7"/>'
        f'<circle cx="{w * .85:.0f}" cy="{h * .85:.0f}" r="{min(w, h) * .25:.0f}" fill="#0d5a4a" opacity=".6"/>'
        '</g>'
        f'<rect width="{w}" height="{h}" fill="url(#vignette)"/>'
    )


def fond_clair(w: int, h: int) -> str:
    return (
        f'<rect width="{w}" height="{h}" fill="url(#fondc)"/>'
        f'<g filter="url(#flou-fond)">'
        f'<circle cx="{w * .76:.0f}" cy="{h * .18:.0f}" r="{min(w, h) * .26:.0f}" fill="{GOLD}" opacity=".45"/>'
        f'<circle cx="{w * .18:.0f}" cy="{h * .8:.0f}" r="{min(w, h) * .3:.0f}" fill="{LIME}" opacity=".35"/>'
        f'<circle cx="{w * .3:.0f}" cy="{h * .3:.0f}" r="{min(w, h) * .3:.0f}" fill="#9fc7b3" opacity=".5"/>'
        '</g>'
    )


def defs(theme: str) -> str:
    sombre = theme == "sombre"
    blanc = "#ffffff"
    encre = DEEP
    # remplissages des trois empreintes : de l'ancêtre (le plus transparent) à l'avenir (le plus lumineux)
    if sombre:
        pieds = [(blanc, .32, .18), (blanc, .58, .36), ("#fffaf0", .96, .78)]
        trait = "rgba(255,255,255,.75)"
        halo = "#fff"
    else:
        pieds = [(encre, .34, .22), (encre, .58, .42), (encre, .92, .8)]
        trait = "rgba(23,59,45,.55)"
        halo = "#fff"
    grads = "".join(
        f'<linearGradient id="pied-fill{i}" x1="0" y1="0" x2="0.3" y2="1">'
        f'<stop offset="0" stop-color="{c}" stop-opacity="{hi}"/><stop offset="1" stop-color="{c}" stop-opacity="{lo}"/></linearGradient>'
        for i, (c, hi, lo) in enumerate(pieds)
    )
    pieds_defs = "".join(pied_verre(i, f"pied-fill{i}", trait, halo) for i in range(3))
    return (
        '<defs>'
        f'<linearGradient id="fondg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f3327"/><stop offset=".55" stop-color="#123a2b"/><stop offset="1" stop-color="#071b15"/></linearGradient>'
        f'<linearGradient id="fondc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f8f3"/><stop offset="1" stop-color="#e3eae2"/></linearGradient>'
        '<radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>'
        '<filter id="flou-fond" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="110"/></filter>'
        '<filter id="flou-verre" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>'
        '<filter id="flou-doux" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
        '<filter id="flou-large" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>'
        f'<filter id="ombre-pied" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="{"#000" if sombre else DEEP}" flood-opacity="{".45" if sombre else ".28"}"/></filter>'
        f'<filter id="lueur-rayons" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        # verre : teinte, bord, reflets
        + (f'<linearGradient id="verre" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient>'
           if sombre else
           f'<linearGradient id="verre" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".78"/><stop offset=".5" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>')
        + (f'<linearGradient id="bord" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#fff" stop-opacity=".18"/><stop offset=".7" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="{GOLD_CLAIR}" stop-opacity=".7"/></linearGradient>'
           if sombre else
           f'<linearGradient id="bord" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".45" stop-color="{DEEP}" stop-opacity=".18"/><stop offset="1" stop-color="{DEEP}" stop-opacity=".35"/></linearGradient>')
        + '<linearGradient id="reflet-haut" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        '<radialGradient id="reflet" cx=".32" cy=".2" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
        f'<radialGradient id="lueur"><stop offset="0" stop-color="{GOLD_CLAIR}" stop-opacity=".9"/><stop offset=".35" stop-color="{GOLD}" stop-opacity=".42"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient>'
        f'<linearGradient id="soleil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GOLD_CLAIR}"/><stop offset=".55" stop-color="{GOLD}"/><stop offset="1" stop-color="{GOLD_FONCE}"/></linearGradient>'
        f'<linearGradient id="horizon" gradientUnits="userSpaceOnUse" x1="212" y1="0" x2="812" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="{".85" if sombre else ".95"}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        f'<linearGradient id="horizon-ombre" gradientUnits="userSpaceOnUse" x1="212" y1="0" x2="812" y2="0"><stop offset="0" stop-color="{DEEP}" stop-opacity="0"/><stop offset=".5" stop-color="{DEEP}" stop-opacity=".35"/><stop offset="1" stop-color="{DEEP}" stop-opacity="0"/></linearGradient>'
        '<clipPath id="disque"><circle cx="512" cy="512" r="384"/></clipPath>'
        f'{grads}{pieds_defs}'
        '</defs>'
    )


def embleme_corps(theme: str, fond_id: str | None) -> str:
    """Le disque de verre et son contenu, dans un repère 1024 × 1024 centré (512,512), r = 384."""
    sombre = theme == "sombre"
    cx, cy, r = 512, 512, 384
    hy = 396  # horizon
    out = []
    # ombre portée du disque
    out.append(f'<circle cx="{cx}" cy="{cy + 34}" r="{r}" fill="#000" opacity="{".55" if sombre else ".22"}" filter="url(#flou-large)"/>')
    if sombre:
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r + 6}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="18" filter="url(#flou-large)"/>')
    # ce qu'on voit à travers le verre : le fond flouté et éclairci
    if fond_id:
        out.append(f'<g clip-path="url(#disque)"><use href="#{fond_id}" filter="url(#flou-verre)"/></g>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#verre)"/>')
    # épaisseur : ombre interne au bord bas
    out.append(f'<g clip-path="url(#disque)"><circle cx="{cx}" cy="{cy}" r="{r + 14}" fill="none" stroke="{"#000" if sombre else DEEP}" stroke-opacity="{".35" if sombre else ".18"}" stroke-width="46" filter="url(#flou-verre)"/></g>')
    # lueur du soleil, derrière tout le reste
    out.append(f'<g clip-path="url(#disque)"><circle cx="{cx}" cy="{hy}" r="300" fill="url(#lueur)" opacity="{"1" if sombre else ".75"}"/>'
               f'<circle cx="{cx}" cy="{hy - 20}" r="150" fill="url(#lueur)" opacity="{".7" if sombre else ".4"}"/></g>')
    # horizon
    out.append(f'<line x1="{cx - 300}" y1="{hy + 3}" x2="{cx + 300}" y2="{hy + 3}" stroke="url(#horizon-ombre)" stroke-width="4"/>')
    out.append(f'<line x1="{cx - 300}" y1="{hy}" x2="{cx + 300}" y2="{hy}" stroke="url(#horizon)" stroke-width="3"/>')
    # soleil : rayons lumineux, demi-disque en verre doré, reflet
    out.append(f'<g filter="url(#lueur-rayons)">{rayons(cx, hy, 100, GOLD if sombre else GOLD_FONCE)}</g>')
    out.append(f'<path d="M{cx - 100},{hy} A100,100 0 0 1 {cx + 100},{hy} Z" fill="url(#soleil)" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>')
    out.append(f'<ellipse cx="{cx - 22}" cy="{hy - 62}" rx="42" ry="14" transform="rotate(-18 {cx - 22} {hy - 62})" fill="#fff" opacity=".55" filter="url(#flou-doux)"/>')
    # les trois pas : ancêtres, génération actuelle, générations futures
    out.append(f'<g filter="url(#ombre-pied)">'
               f'<use href="#pied0" transform="translate(338,806) rotate(-22) scale(-3,3)"/>'
               f'<use href="#pied1" transform="translate(584,660) rotate(-12) scale(2.44)"/>'
               f'<use href="#pied2" transform="translate(458,520) rotate(-6) scale(-1.9,1.9)"/>'
               '</g>')
    # reflets du verre : grand reflet diffus en haut à gauche, arc brillant sur le bord
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#reflet)"/>')
    out.append(f'<path d="M{cx - r + 30},{cy - 120} A{r - 6},{r - 6} 0 0 1 {cx + 90},{cy - r + 12}" fill="none" stroke="url(#reflet-haut)" stroke-width="5" stroke-linecap="round" filter="url(#flou-doux)"/>')
    out.append(f'<path d="M{cx - 120},{cy + r - 8} A{r - 6},{r - 6} 0 0 0 {cx + r - 40},{cy + 110}" fill="none" stroke="url(#reflet-haut)" stroke-width="3" stroke-linecap="round" opacity=".5" filter="url(#flou-doux)"/>')
    # bord du verre
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="url(#bord)" stroke-width="3"/>')
    return "".join(out)


def svg_embleme(theme: str = "sombre", avec_fond: bool = True) -> str:
    fond = ""
    fond_id = None
    if avec_fond:
        fond_id = "fond"
        fond = f'<g id="fond">{fond_sombre(1024, 1024) if theme == "sombre" else fond_clair(1024, 1024)}</g>'
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" role="img" '
        'aria-label="ODEB LONODJI — Les Pas vers l’Avenir, version verre">'
        f'{defs(theme)}{fond}{embleme_corps(theme, fond_id)}</svg>'
    )


def texte_marque(x: float, y: float, ancre: str, theme: str, taille: float = 150, devise_taille: float = 44, empile: bool = False) -> str:
    sombre = theme == "sombre"
    ink = "#fff" if sombre else INK
    doux = "rgba(255,255,255,.72)" if sombre else "#526159"
    dev = GOLD_CLAIR if sombre else "#5a4a12"
    anchor = f' text-anchor="{ancre}"' if ancre != "start" else ""
    st = taille * .2
    lines = [
        f'<text x="{x}" y="{y}"{anchor} font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="800" font-size="{taille}" letter-spacing="{taille * .04:.0f}" fill="{ink}">ODEB <tspan font-weight="250" letter-spacing="{taille * .06:.0f}">LONODJI</tspan></text>',
        f'<text x="{x + 2}" y="{y + st * 2.1:.0f}"{anchor} font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="500" font-size="{st:.0f}" letter-spacing="{st * .3:.1f}" fill="{doux}">ORGANISATION POUR LE DÉVELOPPEMENT</text>',
        f'<text x="{x + 2}" y="{y + st * 3.5:.0f}"{anchor} font-family="DM Sans, Helvetica, Arial, sans-serif" font-weight="500" font-size="{st:.0f}" letter-spacing="{st * .3:.1f}" fill="{doux}">ET L’ÉMERGENCE BEDJONDE</text>',
    ]
    ly = y + st * 4.7
    if ancre == "middle":
        lines.append(f'<line x1="{x - 46}" y1="{ly:.0f}" x2="{x + 46}" y2="{ly:.0f}" stroke="{GOLD}" stroke-width="4" stroke-linecap="round"/>')
    else:
        lines.append(f'<line x1="{x + 2}" y1="{ly:.0f}" x2="{x + 96}" y2="{ly:.0f}" stroke="{GOLD}" stroke-width="4" stroke-linecap="round"/>')
    if empile:
        lines.append(f'<text x="{x}" y="{ly + devise_taille * 1.7:.0f}"{anchor} font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="{devise_taille}" fill="{dev}">« Sur les traces de nos ancêtres,</text>')
        lines.append(f'<text x="{x}" y="{ly + devise_taille * 3.0:.0f}"{anchor} font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="{devise_taille}" fill="{dev}">bâtissons notre avenir. »</text>')
    else:
        lines.append(f'<text x="{x + 2}" y="{ly + devise_taille * 1.7:.0f}"{anchor} font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="{devise_taille}" fill="{dev}">« Sur les traces de nos ancêtres, bâtissons notre avenir. »</text>')
    return "".join(lines)


def svg_horizontal(theme: str = "sombre", avec_fond: bool = True) -> str:
    w, h = 2000, 640
    fond = (fond_sombre(w, h) if theme == "sombre" else fond_clair(w, h)) if avec_fond else ""
    s = 0.56
    y0 = (h - 1024 * s) / 2
    fond_local = f'<g id="fond-local" transform="scale({1 / s:.4f}) translate(-40,-{y0:.0f})">{fond}</g>' if avec_fond else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="ODEB LONODJI — Organisation pour le Développement et l’Émergence Bedjonde">'
        f'{defs(theme)}<g id="fond">{fond}</g>'
        # le disque de verre floute le fond : on passe le fond dans le repère du disque
        f'<g transform="translate(40,{y0:.0f}) scale({s})">{fond_local}{embleme_corps(theme, "fond-local" if avec_fond else None)}</g>'
        f'{texte_marque(680, 292, "start", theme, 150, 44)}'
        '</svg>'
    )


def svg_vertical(theme: str = "sombre", avec_fond: bool = True) -> str:
    w, h = 1080, 1350
    fond = (fond_sombre(w, h) if theme == "sombre" else fond_clair(w, h)) if avec_fond else ""
    s = 0.66
    x0 = (w - 1024 * s) / 2
    fond_local = f'<g id="fond-local" transform="scale({1 / s:.4f}) translate(-{x0:.0f},-70)">{fond}</g>' if avec_fond else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="ODEB LONODJI — Organisation pour le Développement et l’Émergence Bedjonde">'
        f'{defs(theme)}<g id="fond">{fond}</g>'
        f'<g transform="translate({x0:.0f},70) scale({s})">{fond_local}{embleme_corps(theme, "fond-local" if avec_fond else None)}</g>'
        f'{texte_marque(540, 900, "middle", theme, 118, 38, empile=True)}'
        '</svg>'
    )


import re


def prefixe(svg: str, p: str) -> str:
    """Rend les id uniques (plusieurs SVG dans une même page HTML partagent l'espace des id)."""
    svg = re.sub(r'id="([^"]+)"', lambda m: f'id="{p}-{m.group(1)}"', svg)
    svg = re.sub(r'url\(#([^)]+)\)', lambda m: f'url(#{p}-{m.group(1)})', svg)
    svg = re.sub(r'href="#([^"]+)"', lambda m: f'href="#{p}-{m.group(1)}"', svg)
    return svg


def main() -> None:
    OUT.mkdir(exist_ok=True)
    fichiers = {
        "odeb-verre-embleme.svg": svg_embleme("sombre", True),
        "odeb-verre-embleme-clair.svg": svg_embleme("clair", True),
        "odeb-verre-embleme-superposable.svg": svg_embleme("sombre", False),
        "odeb-verre-logo-horizontal.svg": svg_horizontal("sombre"),
        "odeb-verre-logo-horizontal-clair.svg": svg_horizontal("clair"),
        "odeb-verre-logo-vertical.svg": svg_vertical("sombre"),
    }
    for nom, svg in fichiers.items():
        (OUT / nom).write_text(svg, encoding="utf-8")
        print(nom)

    from playwright.sync_api import sync_playwright
    spec = importlib.util.spec_from_file_location("build_og", ROOT / "scripts" / "build-og.py")
    og = importlib.util.module_from_spec(spec); assert spec.loader; spec.loader.exec_module(og)
    fonts = og.font_faces()

    def page_svg(svg: str, w: int, h: int, fond: str = "transparent") -> str:
        return f'<!doctype html><html><meta charset="utf-8"><style>{fonts} html,body{{margin:0;width:{w}px;height:{h}px;background:{fond};overflow:hidden}} svg{{display:block;width:{w}px;height:{h}px}}</style><body>{svg}</body></html>'

    # superposable : on le montre sur une "photo" (dégradé chaud de fin de journée) pour juger la transparence
    photo = ('<div style="position:absolute;inset:0;background:'
             'radial-gradient(circle at 70% 20%, #f7d67a 0, rgba(247,214,122,0) 38%),'
             'radial-gradient(circle at 20% 80%, #7fae5a 0, rgba(127,174,90,0) 45%),'
             'linear-gradient(160deg,#8d5a2b 0%,#3d4d2a 45%,#0e2a1f 100%)"></div>'
             '<div style="position:absolute;left:0;right:0;top:56%;height:2px;background:rgba(255,255,255,.25)"></div>')

    planche = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}
    *{{box-sizing:border-box}} body{{margin:0;width:1800px;background:#071b15;font-family:"DM Sans",Arial,sans-serif;color:#fff;padding:60px 70px}}
    h1{{margin:0 0 8px;font-size:42px;letter-spacing:-.02em;font-weight:700}} .sub{{margin:0 0 36px;font-size:18px;color:rgba(255,255,255,.65)}}
    .row{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;margin-bottom:28px}}
    .cell{{border-radius:28px;overflow:hidden;position:relative;aspect-ratio:1;background:#0d2a20}} .cell svg{{position:absolute;inset:0;width:100%;height:100%}}
    .cell.superpose svg{{width:80%;height:80%;left:10%;top:10%}} .cell.petites svg{{position:static;width:auto;height:auto}}
    .cap{{position:absolute;left:0;right:0;bottom:0;padding:16px 20px;font-size:15px;background:linear-gradient(transparent,rgba(0,0,0,.55));color:#fff}}
    .wide{{border-radius:28px;overflow:hidden;margin-bottom:28px}} .wide svg{{display:block;width:100%;height:auto}}
    .small{{display:flex;gap:40px;align-items:flex-end;justify-content:center;padding:40px;background:#0d2a20;border-radius:28px;margin-bottom:28px}}
    .legende{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;font-size:15px;line-height:1.55;color:rgba(255,255,255,.72)}} .legende b{{display:block;color:#fff;font-size:16px;margin-bottom:4px}}
    </style><body>
    <h1>ODEB LONODJI — « Les Pas vers l’Avenir », version verre</h1>
    <p class="sub">Le même concept, traité en verre dépoli : le disque floute ce qu’il y a derrière lui, le bord capte la lumière, les empreintes sont taillées dans le verre et le soleil éclaire l’ensemble. Concept du 28 septembre 2026, soumis à l’association ; rien n’est publié.</p>
    <div class="row">
      <div class="cell">{prefixe(fichiers["odeb-verre-embleme.svg"], "a")}<div class="cap">Emblème verre, fond premium sombre</div></div>
      <div class="cell superpose">{photo}{prefixe(fichiers["odeb-verre-embleme-superposable.svg"], "b")}<div class="cap">Superposable : posé sur une photo, sans fond propre</div></div>
      <div class="cell">{prefixe(fichiers["odeb-verre-embleme-clair.svg"], "c")}<div class="cap">Verre clair, fond sable : papeterie, fonds blancs</div></div>
    </div>
    <div class="wide">{prefixe(fichiers["odeb-verre-logo-horizontal.svg"], "d")}</div>
    <div class="wide">{prefixe(fichiers["odeb-verre-logo-horizontal-clair.svg"], "e")}</div>
    <div class="row">
      <div class="cell" style="aspect-ratio:1080/1350">{prefixe(fichiers["odeb-verre-logo-vertical.svg"], "f")}<div class="cap">Version verticale : avatars, affiches, couvertures</div></div>
      <div class="cell petites" style="grid-column:span 2;aspect-ratio:auto;display:flex;align-items:flex-end;justify-content:center;gap:48px;padding:40px 40px 70px;background:{DEEP}">
        {prefixe(fichiers["odeb-verre-embleme.svg"].replace('width="1024" height="1024"', 'width="240" height="240"'), "g")}
        {prefixe(fichiers["odeb-verre-embleme.svg"].replace('width="1024" height="1024"', 'width="128" height="128"'), "h")}
        {prefixe(fichiers["odeb-verre-embleme.svg"].replace('width="1024" height="1024"', 'width="64" height="64"'), "i")}
        {prefixe(fichiers["odeb-verre-embleme.svg"].replace('width="1024" height="1024"', 'width="40" height="40"'), "j")}
        <div class="cap">Tenue aux petites tailles : 240, 128, 64 et 40 px</div>
      </div>
    </div>
    <div class="legende">
      <div><b>Ce qui change</b>Disque en verre dépoli (flou de ce qui est derrière, teinte blanche à 7–30 %), bord en dégradé de lumière blanc → doré, reflet diffus en haut à gauche, ombre portée profonde : le logo prend du volume. Le nom passe en « ODEB » gras + « LONODJI » fin, lettres espacées.</div>
      <div><b>Ce qui ne change pas</b>Les trois empreintes, de la plus transparente (les ancêtres) à la plus lumineuse (les générations futures), le soleil levant sur l’horizon, la devise. Le fond premium — vert profond, halos dorés et acacia — reprend les couleurs du site.</div>
      <div><b>Usages</b>Le verre est fait pour les écrans, les vidéos, les fonds photo et l’impression haut de gamme ; pour le tampon, la photocopie et la gravure, la version monochrome à plat (design/odeb/odeb-embleme-mono.svg) reste la référence. Une fois adopté : textes en tracés, PDF vectoriel, kit presse.</div>
    </div></body></html>"""
    (OUT / "planche.html").write_text(planche, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1800, "height": 1200}, device_scale_factor=1)
        pg.goto((OUT / "planche.html").as_uri(), wait_until="load")
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT / "planche-verre.png"), full_page=True)
        pg.close()
        rendus = [
            ("odeb-verre-embleme.svg", 1024, 1024, 2, "odeb-verre-embleme-2048.png", "transparent"),
            ("odeb-verre-embleme-clair.svg", 1024, 1024, 2, "odeb-verre-embleme-clair-2048.png", "transparent"),
            ("odeb-verre-logo-horizontal.svg", 2000, 640, 1, "odeb-verre-logo-horizontal.png", "transparent"),
            ("odeb-verre-logo-horizontal-clair.svg", 2000, 640, 1, "odeb-verre-logo-horizontal-clair.png", "transparent"),
            ("odeb-verre-logo-vertical.svg", 1080, 1350, 1, "odeb-verre-logo-vertical.png", "transparent"),
        ]
        for nom, w, h, scale, png, fond in rendus:
            page = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
            page.set_content(page_svg(fichiers[nom], w, h, fond))
            page.wait_for_timeout(200)
            page.screenshot(path=str(OUT / png), omit_background=True)
            page.close()
        b.close()
    (OUT / "planche.html").unlink()
    print("planche-verre.png + PNG")


if __name__ == "__main__":
    main()
