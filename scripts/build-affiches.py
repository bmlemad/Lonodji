#!/usr/bin/env python3
"""Affiches A4 « Retrouvez votre village » : une par unité (14) et une générale,
en PDF dans public/carte/affiches/, avec un code QR vers la page de l'unité.
Pour les chefs, les relais, les écoles, les centres de santé : à imprimer
librement. Lancer après `npm run build` (polices auto-hébergées) :

    python3 scripts/build-affiches.py

Données : content/villages.json (scripts/build-villages.py)."""
from __future__ import annotations

import base64
import importlib.util
import json
import sys
from pathlib import Path

import segno

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "carte" / "affiches"
SITE = "https://lonodji.org"
LOGO = ROOT / "public" / "odeb" / "identite" / "adeb-lonodji-logo-horizontal-superposable.png"
EMBLEME = ROOT / "public" / "odeb" / "identite" / "odeb-lonodji-embleme-plat.svg"
GROUPES = {"coeur": "cœur du pays bedjond", "sud": "présence bedjond attestée", "signale": "présence bedjond signalée", "diaspora": "diaspora agricole, présence signalée"}  # mêmes libellés que lib/villages.ts
WHATSAPP = "+235 66 29 94 03"


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


og = charger("build_og", ROOT / "scripts" / "build-og.py")

CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;width:210mm;height:297mm;background:#fff;color:#10241e;font-family:'DM Sans',system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.a{position:relative;width:210mm;height:297mm;overflow:hidden;display:flex;flex-direction:column}
.tete{background:#173b2d;color:#fff;padding:10mm 16mm 9mm;display:flex;align-items:center;justify-content:space-between;gap:10mm}
.tete img{height:27mm;width:auto}
.tete .kicker{font-size:8.5pt;letter-spacing:.2em;text-transform:uppercase;color:#b6cf45;font-weight:700;text-align:right;line-height:1.5}
.corps{padding:12mm 16mm 0;flex:1;display:flex;flex-direction:column}
.eyebrow{font-size:9pt;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:#526159;margin:0 0 5mm}
h1{margin:0;font-size:34pt;line-height:.98;letter-spacing:-.03em;font-weight:700}
h1 em{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-style:italic}
.unite{margin:6mm 0 0;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:60pt;line-height:.95;letter-spacing:-.02em;color:#173b2d}
.sous{margin:3mm 0 0;font-size:12.5pt;color:#526159}
.grille{display:grid;grid-template-columns:1fr 66mm;gap:9mm;align-items:start;margin-top:9mm}
.chiffres{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.chiffre{border:1px solid #d5ddd6;border-radius:5mm;padding:5mm 5mm 4mm;background:#f7f9f4}
.chiffre b{display:block;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:30pt;line-height:1;color:#173b2d;letter-spacing:-.02em}
.chiffre span{display:block;margin-top:2mm;font-size:9.5pt;font-weight:600;line-height:1.35}
.chiffre small{display:block;margin-top:1mm;font-size:8.5pt;color:#607069;line-height:1.35}
.texte{margin:6mm 0 0;font-size:11.5pt;line-height:1.55;color:#33443c}
.texte strong{color:#10241e}
.qr{border:1px solid #d5ddd6;border-radius:6mm;padding:5mm;background:#fff;text-align:center}
.qr svg{display:block;width:56mm;height:56mm;margin:0 auto}
.qr .adr{display:block;margin-top:4mm;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:8.5pt;font-weight:700;color:#173b2d;word-break:keep-all;line-height:1.4}
.qr .lib{display:block;margin-top:1.5mm;font-size:8.5pt;color:#607069;line-height:1.4}
.actions{margin-top:8mm;display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.action{border-top:3px solid #b6cf45;padding-top:3mm}
.action b{display:block;font-size:11.5pt;line-height:1.3}
.action span{display:block;margin-top:1.5mm;font-size:9.5pt;color:#526159;line-height:1.5}
.action code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:8.5pt;color:#173b2d}
.pied{margin-top:auto;padding:6mm 16mm 10mm;border-top:1px solid #d5ddd6;display:flex;justify-content:space-between;align-items:center;gap:8mm;font-size:8.5pt;color:#607069;line-height:1.45}
.pied img{height:13mm;width:auto}
.pied .g{max-width:120mm}
"""


def logo_png() -> bytes:
    """Le logo horizontal blanc, réduit (800 px) pour ne pas alourdir chaque PDF."""
    import io

    from PIL import Image

    im = Image.open(LOGO)
    im.thumbnail((800, 256))
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def qr_svg(url: str) -> str:
    q = segno.make(url, error="m")
    w, h = q.symbol_size(scale=1, border=0)
    svg = q.svg_inline(scale=1, border=0, dark="#10241e", light=None)
    return svg.replace("<svg ", f'<svg viewBox="0 0 {w} {h}" shape-rendering="crispEdges" role="img" aria-label="Code QR : {url}" ', 1)


def n(x: int) -> str:
    return f"{x:,}".replace(",", " ")


def html(fonts: str, *, titre: str, unite: str | None, sous: str, chiffres: list[tuple[str, str, str]], url: str, texte: str, date: str) -> str:
    logo = "data:image/png;base64," + base64.b64encode(logo_png()).decode()
    emb = "data:image/svg+xml;base64," + base64.b64encode(EMBLEME.read_bytes()).decode()
    ch = "".join(f'<div class="chiffre"><b>{v}</b><span>{l}</span><small>{s}</small></div>' for v, l, s in chiffres)
    unite_html = f'<p class="unite">{unite}</p>' if unite else ""
    adresse = url.replace("https://", "").replace("/", "/<wbr>")
    return f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{CSS}</style><body><div class="a">
<div class="tete"><img src="{logo}" alt="ADEB LONODJI"><div class="kicker">Association de développement<br>et d’entraide de Bédjondo<br>lonodji.org</div></div>
<div class="corps">
<p class="eyebrow">Territoire · une fiche par village</p>
<h1>{titre}</h1>
{unite_html}
<p class="sous">{sous}</p>
<div class="grille">
<div><div class="chiffres">{ch}</div><p class="texte">{texte}</p></div>
<div class="qr">{qr_svg(url)}<span class="adr">{adresse}</span><span class="lib">Scannez avec l’appareil photo du téléphone, ou tapez l’adresse.</span></div>
</div>
<div class="actions">
<div class="action"><b>Signaler un besoin</b><span>Eau, école, santé, route : le nom du lieu, le besoin, l’urgence.<br><code>lonodji.org/territoire/besoins</code></span></div>
<div class="action"><b>Raconter le village</b><span>Son histoire, ses familles, ses lieux : ce que les données ne savent pas.<br><code>lonodji.org/temoignages</code></span></div>
<div class="action"><b>Écrire à l’association</b><span>Appel et WhatsApp : <code>{WHATSAPP}</code><br><code>lonodji.org/participer</code></span></div>
</div>
</div>
<div class="pied"><div class="g">Les lieux sacrés et les tombes ne sont jamais sur la carte : ce registre reste avec les chefs. Données ouvertes (OpenStreetMap, GADM, GeoNames) du {date}, approximatives ; un nom mal écrit se corrige sur le site. Affiche à imprimer librement — lonodji.org/carte/affiches</div><img src="{emb}" alt=""></div>
</div></body></html>"""


def main() -> None:
    from playwright.sync_api import sync_playwright

    d = json.loads((ROOT / "content" / "villages.json").read_text(encoding="utf-8"))
    fonts = og.font_faces()
    OUT.mkdir(parents=True, exist_ok=True)
    date = d["genere"][:10]
    MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    a, m, j = date.split("-")
    jour = f"{int(j)} {MOIS[int(m) - 1]} {a}"
    unites = list(d["unites"].values())
    total_nommes = sum(u["comptes"]["nommes"] for u in unites)
    total_villages = sum(u["comptes"]["villages"] for u in unites)
    pages: list[tuple[str, str]] = []
    pages.append(("affiche-villages", html(
        fonts, titre="Retrouvez <em>votre village</em>", unite=None,
        sous=f"{len(unites)} unités du Mandoul Occidental et d’autour, du cœur du pays bedjond aux villes de la diaspora.",
        chiffres=[(str(len(unites)), "unités", "sous-préfectures et voisines"), (n(total_nommes), "localités nommées", f"sur {n(total_villages)} relevées"), ("1", "fiche par village", "ce que l’on sait, ce qui manque"), ("6", "questions à répondre", "sur chaque fiche, par ceux qui savent")],
        url=f"{SITE}/villages", date=jour,
        texte="<strong>Chaque village, quartier ou canton a sa page</strong> : sa position, les équipements connus à moins de dix kilomètres, les pages du site qui le citent, et six questions auxquelles personne n’a encore répondu. Vous y vivez, vous en venez, vous y avez de la famille : vous savez.")))
    for u in sorted(unites, key=lambda x: x["kmBedjondo"]):
        c = u["comptes"]
        km = f" · à {round(u['kmBedjondo'])} km de Bédjondo" if u["kmBedjondo"] >= 1 and u["id"] != "bedjondo" else ""
        pages.append((f"affiche-{u['id']}", html(
            fonts, titre="Retrouvez <em>votre village</em>", unite=u["nom"],
            sous=f"{u['dep']}{' · ' + u['prov'] if u['prov'] != u['dep'] else ''} · {GROUPES.get(u['groupe'], '')}{km}",
            chiffres=[(n(c["nommes"]), "localités nommées", f"sur {n(c['villages'])} relevées"), (str(c["equipements"]), "équipement connu" if c["equipements"] == 1 else "équipements connus", "école, santé, eau, marché : ce que les données ouvertes savent, c’est peu"), ("1", "fiche par village", "position, voisins, pages du site"), ("6", "questions à répondre", "histoire, familles, eau, école, santé, marché")],
            url=f"{SITE}/villages/{u['id']}", date=jour,
            texte=f"<strong>Les villages de {u['nom']} ont chacun leur page</strong> sur le site de l’association : ce que les données ouvertes en savent, ce que le site en a écrit, ce qui reste à documenter. Cherchez le vôtre, corrigez son nom, répondez aux six questions : chaque réponse vérifiée est publiée, datée et sourcée.")))
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 794, "height": 1123})
        for nom, h in pages:
            pg.set_content(h, wait_until="load")
            pg.evaluate("document.fonts.ready")
            pg.pdf(path=str(OUT / f"{nom}.pdf"), format="A4", print_background=True, prefer_css_page_size=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
            if nom == "affiche-villages":
                pg.screenshot(path=str(OUT / "affiche-villages.jpg"), type="jpeg", quality=82, clip={"x": 0, "y": 0, "width": 794, "height": 1123})
        b.close()
    tailles = sum(f.stat().st_size for f in OUT.glob("*.pdf"))
    print(f"{len(pages)} affiches dans {OUT.relative_to(ROOT)} ({tailles / 1024:.0f} ko)")


if __name__ == "__main__":
    sys.exit(main())
