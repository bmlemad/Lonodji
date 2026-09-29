"""Images de partage (Open Graph, 1200×630) pour chaque page du site.

Lit les pages construites (.next/server/app/**/*.html) pour reprendre leur titre
et leur description exacts, puis rend une carte par page avec Playwright, dans
la charte du site (encre profonde, accent, DM Sans / Playfair Display).

    npm run build && python3 scripts/build-og.py

Sortie : public/og/<route>.jpg (les « / » deviennent « -- », l'accueil = index),
et public/og-image.png (accueil, image de repli). lib/content.ts (ogImage)
déclare l'image d'une route quand le fichier existe.
"""
from __future__ import annotations

import json
import re
import sys
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILT = ROOT / ".next" / "server" / "app"
OUT = ROOT / "public" / "og"
LOGO = ROOT / "public" / "odeb" / "identite" / "odeb-lonodji-embleme-1024.png"  # logo adopté le 28/09/2026 (rond via border-radius)
ODEB_EMBLEME = ROOT / "public" / "odeb" / "identite" / "odeb-lonodji-embleme-superposable-1024.png"  # pages du projet ODEB
SKIP = {"/_global-error", "/_not-found", "/hors-ligne", "/en"}  # /en redirige vers /en/index

EYEBROWS = {
    "/": "Association · Bédjondo · diaspora",
    "/mission": "L’association",
    "/histoire": "Histoire & patrimoine",
    "/programmes": "Nos actions · 4 pôles, 20 thématiques",
    "/secteurs": "Nos actions · secteurs d’intervention",
    "/bailleurs": "Nos actions · programmes des bailleurs",
    "/territoire": "Territoire",
    "/patrimoine": "Patrimoine",
    "/projets/bedjondo-transport-logistique": "Nos actions · projet annoncé",
    "/actions": "Plaidoyers & engagements",
    "/impact": "Suivi & tableau de bord",
    "/journal": "Le journal",
    "/documents": "Documents",
    "/dossiers": "Les dossiers",
    "/participer": "Participer",
    "/diaspora": "Diaspora · répertoire des compétences",
    "/temoignages": "Témoignages · banque d’images",
    "/villages": "Territoire · fiches des villages",
    "/bibliotheque": "Bibliothèque numérique bedjond",
    "/langue": "Langue · nangnda",
    "/transparence": "Redevabilité",
    "/archives": "Archives du site",
    "/mentions-legales": "Mentions légales",
    "/plan-du-site": "Plan du site",
    "/recherche": "Recherche",
    "/projets": "Nos actions · plateforme de projets",
    "/presse": "Espace presse et partenaires",
    "/accessibilite": "Accessibilité",
    "/observatoire": "Territoire · observatoire du Mandoul Occidental",
    "/odeb": "Projet ODEB LONODJI · Vision 2030",
    "/odeb/livre-blanc": "Projet ODEB LONODJI · livre blanc",
    "/odeb/feuille-de-route": "Projet ODEB LONODJI · feuille de route 2026-2030",
    "/odeb/programmes": "Projet ODEB LONODJI · les cinq programmes",
    "/odeb/identite": "Projet ODEB LONODJI · identité visuelle",
}


def route_name(route: str) -> str:
    return "index" if route == "/" else route.strip("/").replace("/", "--")


def read_pages() -> list[dict]:
    idx = json.loads((ROOT / "content" / "index.json").read_text(encoding="utf-8"))
    articles = {a["route"]: a for a in idx["articles"]}
    pages = {p["route"]: p for p in idx["pages"]}
    out = []
    for f in sorted(BUILT.rglob("*.html")):
        route = "/" + f.relative_to(BUILT).with_suffix("").as_posix()
        if route == "/index":
            route = "/"
        if route in SKIP:
            continue
        html = f.read_text(encoding="utf-8")
        m = re.search(r"<title>(.*?)</title>", html, re.S)
        title = unescape(m.group(1)) if m else route
        title = re.sub(r"\s+—\s+ADEB LONODJI$", "", title).strip()
        m = re.search(r'<meta name="description" content="(.*?)"', html, re.S)
        desc = unescape(m.group(1)) if m else ""
        if route == "/":
            title = "Construire aujourd’hui. — Transmettre demain."
        if route in articles:
            a = articles[route]
            eyebrow = f"Le journal · {a['tag']} · {a['dateLabel']}"
            lang = "fr"
        elif route.startswith("/en/"):
            eyebrow = "ADEB LONODJI · in English"
            lang = "en"
        elif route in pages and pages[route]["kind"] == "dossier":
            eyebrow = "Dossier · " + (pages[route].get("eyebrow") or "ADEB LONODJI")
            lang = "fr"
        elif route.startswith("/odeb/programmes/"):
            eyebrow = "Projet ODEB LONODJI · programme"
            lang = "fr"
        else:
            eyebrow = EYEBROWS.get(route, "ADEB LONODJI")
            lang = "fr"
        out.append({"route": route, "name": route_name(route), "title": title, "desc": desc, "eyebrow": eyebrow, "lang": lang})
    return out


def font_faces() -> str:
    """Reprend les @font-face des polices auto-hébergées par Next (chemins absolus)."""
    css = ""
    for f in (ROOT / ".next" / "static" / "chunks").glob("*.css"):
        t = f.read_text(encoding="utf-8")
        if "@font-face{font-family:DM Sans" in t:
            css = t
            break
    if not css:
        raise SystemExit("polices introuvables : lancer npm run build d'abord")
    faces = re.findall(r"@font-face\{[^}]*\}", css)
    media = (ROOT / ".next" / "static" / "media").resolve()
    out = []
    for face in faces:
        if "src:local(" in face:
            continue
        face = re.sub(r"url\(\.\./media/([^)]+)\)", lambda m: f"url(file://{media}/{m.group(1)})", face)
        out.append(face)
    return "\n".join(out)


TEMPLATE = """<!doctype html><html lang="{lang}"><meta charset="utf-8">
<style>
{fonts}
*{{box-sizing:border-box}}
html,body{{margin:0;width:1200px;height:630px;overflow:hidden}}
body{{position:relative;color:#fff;font-family:"DM Sans",Arial,sans-serif;background:linear-gradient(135deg,#0f3327 0%,#123a2b 48%,#071b15 100%)}}
.orb{{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}}
.orb-a{{width:640px;height:640px;right:-120px;top:-300px;background:rgba(242,201,76,.38)}}
.orb-b{{width:560px;height:560px;left:-200px;bottom:-320px;background:rgba(182,207,69,.28)}}
.orb-c{{width:620px;height:620px;left:220px;top:-260px;background:rgba(47,107,74,.7)}}
.orb-d{{width:480px;height:480px;right:120px;bottom:-300px;background:rgba(13,90,74,.6)}}
.grain{{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")}}
.vignette{{position:absolute;inset:0;background:radial-gradient(75% 75% at 50% 50%,transparent 55%,rgba(0,0,0,.45) 100%)}}
.panneau{{position:absolute;inset:30px;border-radius:32px;padding:34px 40px 30px;background:linear-gradient(160deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.05) 55%,rgba(255,255,255,.09) 100%);border:1px solid rgba(255,255,255,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),inset 0 -1px 0 rgba(255,255,255,.08),0 34px 90px rgba(0,0,0,.5);-webkit-backdrop-filter:blur(26px) saturate(140%);backdrop-filter:blur(26px) saturate(140%);overflow:hidden}}
.panneau:after{{content:"";position:absolute;inset:0;background:linear-gradient(112deg,transparent 42%,rgba(255,255,255,.08) 50%,transparent 58%);pointer-events:none}}
.reflet{{position:absolute;left:-10%;top:-45%;width:60%;height:70%;background:radial-gradient(closest-side,rgba(255,255,255,.22),transparent);pointer-events:none}}
.head{{position:relative;display:inline-flex;align-items:center;gap:14px;padding:8px 18px 8px 8px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.28)}}
.head img{{width:50px;height:50px;border-radius:50%;box-shadow:0 8px 24px rgba(0,0,0,.35)}}
.head strong{{display:block;font-size:20px;letter-spacing:.1em;font-weight:700}}
.head strong b{{font-weight:400}}
.head small{{display:block;margin-top:2px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c9d5cc}}
.foot{{position:absolute;right:40px;top:44px;margin:0;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#c9d5cc}}
.eyebrow{{position:relative;margin:46px 0 0;font-size:15px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#f2c94c}}
.line{{position:relative;width:64px;height:3px;border-radius:3px;background:linear-gradient(90deg,#f2c94c,#b6cf45);margin:16px 0 20px}}
h1{{position:relative;margin:0;font-weight:700;font-size:{size}px;line-height:1.02;letter-spacing:-.035em;max-width:1000px;overflow-wrap:anywhere;text-shadow:0 2px 24px rgba(0,0,0,.25)}}
h1 em{{font-family:"Playfair Display",Georgia,serif;font-weight:500;font-style:italic;color:#f4ecc9}}
.desc{{position:absolute;left:40px;right:40px;bottom:30px;margin:0;font-size:22px;line-height:1.35;color:#c9d5cc;max-height:60px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}}
.odeb{{position:absolute;right:26px;top:84px;width:330px;height:330px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.4))}}
body.avec-odeb h1{{max-width:690px}} body.avec-odeb .desc{{right:400px}}
</style>
<body class="{classe}">
<div class="orb orb-c"></div><div class="orb orb-a"></div><div class="orb orb-b"></div><div class="orb orb-d"></div><div class="vignette"></div><div class="grain"></div>
<div class="panneau"><div class="reflet"></div>
<div class="head"><img src="file://{logo}" alt=""><div><strong>ADEB <b>LONODJI</b></strong><small>Courage · Discipline · Héritage</small></div></div>
<p class="foot">lonodji.org</p>{odeb}
<p class="eyebrow">{eyebrow}</p><div class="line"></div>
<h1 id="t">{title}</h1>
<p class="desc">{desc}</p>
</div>
</body></html>"""


def odeb_bloc(route: str) -> tuple[str, str]:
    """Sur les pages du projet ODEB, l'emblème « Les Pas vers l'Avenir » à droite de la carte."""
    if (route.startswith("/odeb") or route == "/en/odeb") and ODEB_EMBLEME.exists():
        return "avec-odeb", f'<img class="odeb" src="file://{ODEB_EMBLEME}" alt="">'
    return "", ""


def split_title(title: str) -> str:
    """Comme splitTitle côté site : la fin de phrase après le premier « : » ou « — » en italique."""
    m = re.match(r"^(.{12,}?)(\s+—|:)\s+(.{8,})$", title)
    if m:
        tete = m.group(1) + ("" if m.group(2).strip() == "—" else " :")
        return f"{esc(tete)}<br><em>{esc(m.group(3))}</em>"
    return esc(title)


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rendre_une(route: str, title: str, desc: str, eyebrow: str, lang: str = "fr") -> Path:
    """Rend l'image d'une seule route sans lire le site construit (utilisé par publier-article.py)."""
    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    fonts = font_faces()
    tmp = ROOT / ".next" / "og-tmp.html"
    dest = OUT / (route_name(route) + ".jpg")
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        size = 66 if len(title) < 60 else 56 if len(title) < 90 else 48
        classe, odeb = odeb_bloc(route)
        tmp.write_text(TEMPLATE.format(lang=lang, fonts=fonts, logo=LOGO, eyebrow=esc(eyebrow), title=split_title(title), desc=esc(desc), size=size, classe=classe, odeb=odeb), encoding="utf-8")
        page.goto(tmp.as_uri(), wait_until="load")
        page.evaluate("document.fonts.ready")
        page.evaluate("""() => { const t = document.getElementById('t'); const limite = 630 - 30 - 30 - 60 - 22; let fs = parseFloat(getComputedStyle(t).fontSize);
            while (t.getBoundingClientRect().bottom > limite && fs > 30) { fs -= 2; t.style.fontSize = fs + 'px'; } }""")
        page.wait_for_timeout(50)
        page.screenshot(path=str(dest), type="jpeg", quality=82)
        b.close()
    tmp.unlink(missing_ok=True)
    print(f"image de partage : {dest.relative_to(ROOT)}")
    return dest


def main():
    from playwright.sync_api import sync_playwright

    pages = read_pages()
    only = set(sys.argv[1:])
    OUT.mkdir(parents=True, exist_ok=True)
    fonts = font_faces()
    tmp = ROOT / ".next" / "og-tmp.html"
    n = 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        for pg in pages:
            if only and pg["route"] not in only and pg["name"] not in only:
                continue
            size = 66 if len(pg["title"]) < 60 else 56 if len(pg["title"]) < 90 else 48
            classe, odeb = odeb_bloc(pg["route"])
            html = TEMPLATE.format(lang=pg["lang"], fonts=fonts, logo=LOGO, eyebrow=esc(pg["eyebrow"]), title=split_title(pg["title"]), desc=esc(pg["desc"]), size=size, classe=classe, odeb=odeb)
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")   # ouvert en file:// pour que polices et logo (file://) se chargent
            page.evaluate("document.fonts.ready")
            # le titre ne doit pas déborder sur la description : on réduit la taille jusqu'à ce qu'il tienne
            page.evaluate("""() => { const t = document.getElementById('t'); const limite = 630 - 30 - 30 - 60 - 22; let fs = parseFloat(getComputedStyle(t).fontSize);
                while (t.getBoundingClientRect().bottom > limite && fs > 30) { fs -= 2; t.style.fontSize = fs + 'px'; } }""")
            page.wait_for_timeout(50)
            dest = OUT / (pg["name"] + ".jpg")
            page.screenshot(path=str(dest), type="jpeg", quality=82)
            if pg["route"] == "/":
                page.screenshot(path=str(ROOT / "public" / "og-image.png"), type="png")
            n += 1
        b.close()
    tmp.unlink(missing_ok=True)
    print(f"{n} images de partage dans {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
