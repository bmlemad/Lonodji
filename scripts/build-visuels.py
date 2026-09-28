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
ODEB_EMBLEME = _og.ODEB_EMBLEME

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
        {"nom": "40-ans-reflexion-odeb", "odeb": True, "eyebrow": "1986 → 2026 · quarante ans des fondations",
         "titre": "ADEB LONODJI ouvre la <em>réflexion ODEB LONODJI</em>",
         "lignes": ["Organisation pour le Développement et l’Émergence Bedjonde", "Vision 2030 · six missions · cinq programmes", "Un livre blanc en version de travail, à discuter"],
         "url": "lonodji.org/odeb"},
        {"nom": "livre-blanc-odeb", "odeb": True, "eyebrow": "Projet ODEB LONODJI · document fondateur",
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
body{{position:relative;color:#fff;font-family:"DM Sans",Arial,sans-serif;background:linear-gradient(150deg,#0f3327 0%,#123a2b 50%,#071b15 100%)}}
.orb{{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}}
.orb-a{{width:700px;height:700px;right:-220px;top:-320px;background:rgba(242,201,76,.38)}}
.orb-b{{width:620px;height:620px;left:-240px;bottom:-300px;background:rgba(182,207,69,.28)}}
.orb-c{{width:640px;height:640px;left:120px;top:-200px;background:rgba(47,107,74,.7)}}
.orb-d{{width:520px;height:520px;right:60px;bottom:-260px;background:rgba(13,90,74,.6)}}
.grain{{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")}}
.vignette{{position:absolute;inset:0;background:radial-gradient(75% 75% at 50% 50%,transparent 55%,rgba(0,0,0,.45) 100%)}}
.panneau{{position:absolute;inset:36px;border-radius:38px;padding:40px 46px 40px;background:linear-gradient(160deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.05) 55%,rgba(255,255,255,.09) 100%);border:1px solid rgba(255,255,255,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),inset 0 -1px 0 rgba(255,255,255,.08),0 34px 90px rgba(0,0,0,.5);-webkit-backdrop-filter:blur(26px) saturate(140%);backdrop-filter:blur(26px) saturate(140%);overflow:hidden}}
.panneau:after{{content:"";position:absolute;inset:0;background:linear-gradient(112deg,transparent 42%,rgba(255,255,255,.07) 50%,transparent 58%);pointer-events:none}}
.reflet{{position:absolute;left:-10%;top:-30%;width:60%;height:55%;background:radial-gradient(closest-side,rgba(255,255,255,.2),transparent);pointer-events:none}}
.head{{position:relative;display:inline-flex;align-items:center;gap:16px;padding:9px 22px 9px 9px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.28)}}
.head img{{width:62px;height:62px;border-radius:50%;box-shadow:0 8px 24px rgba(0,0,0,.35)}}
.head strong{{display:block;font-size:24px;letter-spacing:.1em;font-weight:700}}
.head strong b{{font-weight:400}}
.head small{{display:block;margin-top:3px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#c9d5cc}}
.eyebrow{{position:relative;margin:96px 0 0;font-size:18px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#f2c94c;max-width:900px}}
.line{{position:relative;width:70px;height:4px;border-radius:4px;background:linear-gradient(90deg,#f2c94c,#b6cf45);margin:20px 0 26px}}
h1{{position:relative;margin:0;font-weight:700;font-size:{size}px;line-height:1.02;letter-spacing:-.035em;max-width:920px;text-shadow:0 2px 24px rgba(0,0,0,.25)}}
h1 em{{font-family:"Playfair Display",Georgia,serif;font-weight:500;font-style:italic;color:#f4ecc9}}
ul{{position:relative;list-style:none;margin:40px 0 0;padding:0;max-width:900px;display:flex;flex-direction:column;gap:10px}}
li{{font-size:25px;line-height:1.3;color:#e6eee6;padding:14px 22px 14px 56px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.14);position:relative}}
li::before{{content:"";position:absolute;left:24px;top:24px;width:12px;height:12px;border-radius:50%;background:linear-gradient(135deg,#f2c94c,#b6cf45);box-shadow:0 0 14px rgba(242,201,76,.6)}}
.url{{position:absolute;left:46px;right:46px;bottom:40px;display:flex;justify-content:space-between;align-items:center;font-size:23px;letter-spacing:.06em;color:#fff;font-weight:700;margin:0}}
.url span{{padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}}
.url small{{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#c9d5cc;font-weight:600}}
.odeb{{position:absolute;right:40px;top:40px;width:300px;height:300px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.4))}}
body.avec-odeb .eyebrow{{margin-top:220px}} body.avec-odeb h1{{max-width:900px}}
</style>
<body class="{classe}">
<div class="orb orb-c"></div><div class="orb orb-a"></div><div class="orb orb-b"></div><div class="orb orb-d"></div><div class="vignette"></div><div class="grain"></div>
<div class="panneau"><div class="reflet"></div>
<div class="head"><img src="file://{logo}" alt=""><div><strong>ADEB <b>LONODJI</b></strong><small>Courage · Discipline · Héritage</small></div></div>{odeb}
<p class="eyebrow">{eyebrow}</p><div class="line"></div>
<h1>{titre}</h1>
<ul>{lignes}</ul>
<p class="url"><span>{url}</span><small>Site officiel · septembre 2026</small></p>
</div>
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
            odeb = v.get("odeb") and ODEB_EMBLEME.exists()
            html = TEMPLATE.format(fonts=fonts, logo=LOGO, eyebrow=esc(v["eyebrow"]), titre=v["titre"], lignes="".join(f"<li>{esc(l)}</li>" for l in v["lignes"]), url=esc(v["url"]), size=size,
                                   classe="avec-odeb" if odeb else "", odeb=f'<img class="odeb" src="file://{ODEB_EMBLEME}" alt="">' if odeb else "")
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")
            page.wait_for_timeout(150)
            page.screenshot(path=str(OUT / f"{v['nom']}.png"), type="png")
            print(f"public/partage/{v['nom']}.png")
        b.close()
    tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
