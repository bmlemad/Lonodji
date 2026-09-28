#!/usr/bin/env python3
"""Visuels de partage (WhatsApp, Facebook, Instagram : 1080 × 1080) dans public/partage/.

Cartes carrées aux couleurs du site — logo, surtitre, titre, trois lignes, adresse —
rendues avec Playwright et les polices auto-hébergées (comme build-og.py). Les
textes sont dans VISUELS ; les chiffres sont lus dans content/ à la génération.

    npm run build && python3 scripts/build-visuels.py
"""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

# polices, logo et échappement : les mêmes que les images de partage (scripts/build-og.py)
_spec = importlib.util.spec_from_file_location("build_og", Path(__file__).resolve().parent / "build-og.py")
_og = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_og)
ROOT, LOGO, esc, font_faces = _og.ROOT, _og.LOGO, _og.esc, _og.font_faces

OUT = ROOT / "public" / "partage"
CONTENT = ROOT / "content"


def visuels() -> list[dict]:
    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    ind = json.loads((CONTENT / "indicateurs.json").read_text("utf8"))
    them = [t for p in idx["structure"]["poles"] for t in p["items"]]
    vacantes = [t for t in them if not t["filled"]]
    pourvues = len(them) - len(vacantes)
    c = ind["contenu"]
    return [
        {"nom": "40-ans-reflexion-odeb", "eyebrow": "1986 → 2026 · quarante ans des fondations",
         "titre": "ADEB LONODJI ouvre la <em>réflexion ODEB LONODJI</em>",
         "lignes": ["Organisation pour le Développement et l’Émergence Bedjonde", "Vision 2030 · six missions · cinq programmes", "Un livre blanc en version de travail, à discuter"],
         "url": "lonodji.org/odeb"},
        {"nom": "livre-blanc-odeb", "eyebrow": "Projet ODEB LONODJI · document fondateur",
         "titre": "Le livre blanc, <em>à lire et à discuter</em>",
         "lignes": ["D’où nous partons, pourquoi une organisation, la vision 2030", "Six missions, cinq programmes, une feuille de route 2026-2030", "Version de travail n° 1 · en ligne et en PDF"],
         "url": "lonodji.org/odeb/livre-blanc"},
        {"nom": "thematiques-a-pourvoir", "eyebrow": f"{pourvues} thématiques pourvues sur {len(them)}",
         "titre": f"{'Quatre' if len(vacantes) == 4 else len(vacantes)} thématiques <em>cherchent leur coordonnateur</em>",
         "lignes": [t["name"] for t in vacantes][:4],
         "url": "lonodji.org/participer"},
        {"nom": "retrouver-son-village", "eyebrow": "Territoire · fiches des villages",
         "titre": f"{c['carte']['localitesNommees']} localités, <em>une fiche chacune</em>",
         "lignes": ["Ce que les données ouvertes en savent", "Ce que le site en dit, ce qui reste à documenter", "Et le formulaire pour le faire"],
         "url": "lonodji.org/villages"},
        {"nom": "racontez-bedjondo", "eyebrow": "Témoignages · banque d’images",
         "titre": "Racontez Bédjondo <em>à ceux qui viennent</em>",
         "lignes": ["Un ancien qui raconte, une femme qui fait bouger les choses", "Un jeune talent, un paysage, une photo des forums", "Rien de publié sans votre relecture"],
         "url": "lonodji.org/temoignages"},
    ]


TEMPLATE = """<!doctype html><html lang="fr"><meta charset="utf-8">
<style>
{fonts}
*{{box-sizing:border-box}}
html,body{{margin:0;width:1080px;height:1080px;overflow:hidden}}
body{{position:relative;background:linear-gradient(150deg,#1b4434 0%,#173b2d 50%,#10241e 100%);color:#fff;font-family:"DM Sans",Arial,sans-serif;padding:72px 76px}}
.orb{{position:absolute;border-radius:50%;filter:blur(50px)}}
.orb-a{{width:620px;height:620px;right:-220px;top:-260px;background:rgba(182,207,69,.22)}}
.orb-b{{width:420px;height:420px;left:-160px;bottom:-220px;background:rgba(215,228,164,.12)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(180deg,rgba(0,0,0,.9),transparent 80%)}}
.head{{position:relative;display:flex;align-items:center;gap:18px}}
.head img{{width:72px;height:72px;border-radius:50%;box-shadow:0 8px 24px rgba(0,0,0,.25)}}
.head strong{{display:block;font-size:28px;letter-spacing:.1em;font-weight:700}}
.head strong b{{font-weight:500}}
.head small{{display:block;margin-top:4px;font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#aab9b0}}
.eyebrow{{position:relative;margin:120px 0 0;font-size:19px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#c9d97a;max-width:900px}}
.line{{position:relative;width:54px;height:5px;background:#b6cf45;margin:20px 0 26px}}
h1{{position:relative;margin:0;font-weight:700;font-size:{size}px;line-height:1.02;letter-spacing:-.035em;max-width:930px}}
h1 em{{font-family:"Playfair Display",Georgia,serif;font-weight:500;font-style:italic;color:#e7f0d2}}
ul{{position:relative;list-style:none;margin:44px 0 0;padding:0;max-width:900px}}
li{{font-size:27px;line-height:1.35;color:#d9e5da;padding:10px 0 10px 30px;border-top:1px solid rgba(255,255,255,.14);position:relative}}
li::before{{content:"";position:absolute;left:0;top:23px;width:12px;height:12px;border-radius:50%;background:#b6cf45}}
.url{{position:absolute;left:76px;right:76px;bottom:64px;display:flex;justify-content:space-between;align-items:center;font-size:24px;letter-spacing:.08em;color:#fff;font-weight:700}}
.url small{{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#aab9b0;font-weight:600}}
</style>
<body>
<div class="grid"></div><div class="orb orb-a"></div><div class="orb orb-b"></div>
<div class="head"><img src="file://{logo}" alt=""><div><strong>ADEB <b>LONODJI</b></strong><small>Courage · Discipline · Héritage</small></div></div>
<p class="eyebrow">{eyebrow}</p><div class="line"></div>
<h1>{titre}</h1>
<ul>{lignes}</ul>
<p class="url"><span>{url}</span><small>Site officiel · septembre 2026</small></p>
</body></html>"""


def main() -> None:
    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    fonts = font_faces()
    tmp = ROOT / ".next" / "visuel-tmp.html"
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={"width": 1080, "height": 1080}, device_scale_factor=1)
        for v in visuels():
            brut = len(v["titre"].replace("<em>", "").replace("</em>", ""))
            size = 76 if brut < 40 else 66 if brut < 60 else 58
            html = TEMPLATE.format(fonts=fonts, logo=LOGO, eyebrow=esc(v["eyebrow"]), titre=v["titre"], lignes="".join(f"<li>{esc(l)}</li>" for l in v["lignes"]), url=esc(v["url"]), size=size)
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")
            page.wait_for_timeout(150)
            page.screenshot(path=str(OUT / f"{v['nom']}.png"), type="png")
            print(f"public/partage/{v['nom']}.png")
        b.close()
    tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
