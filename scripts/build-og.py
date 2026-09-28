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
LOGO = ROOT / "public" / "identite" / "logo-adeb-lonodji-1024.png"
SKIP = {"/_global-error", "/_not-found", "/hors-ligne", "/en"}  # /en redirige vers /en/index

EYEBROWS = {
    "/": "Association · Bédjondo · diaspora",
    "/mission": "L’association",
    "/histoire": "Histoire & patrimoine",
    "/programmes": "Nos actions · 4 pôles, 19 thématiques",
    "/actions": "Plaidoyers & engagements",
    "/impact": "Suivi & tableau de bord",
    "/journal": "Le journal",
    "/documents": "Documents",
    "/dossiers": "Les dossiers",
    "/participer": "Participer",
    "/diaspora": "Diaspora · répertoire des compétences",
    "/temoignages": "Témoignages · banque d’images",
    "/villages": "Territoire · fiches des villages",
    "/transparence": "Redevabilité",
    "/archives": "Archives du site",
    "/mentions-legales": "Mentions légales",
    "/plan-du-site": "Plan du site",
    "/recherche": "Recherche",
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
body{{position:relative;background:linear-gradient(135deg,#1b4434 0%,#173b2d 45%,#10241e 100%);color:#fff;font-family:"DM Sans",Arial,sans-serif;padding:60px 64px 54px}}
.orb{{position:absolute;border-radius:50%;filter:blur(40px);pointer-events:none}}
.orb-a{{width:560px;height:560px;right:-160px;top:-220px;background:rgba(182,207,69,.22)}}
.orb-b{{width:360px;height:360px;right:120px;bottom:-240px;background:rgba(215,228,164,.12)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(180deg,rgba(0,0,0,.9),transparent 85%)}}
.head{{position:relative;display:flex;align-items:center;gap:16px}}
.head img{{width:58px;height:58px;border-radius:50%;box-shadow:0 8px 24px rgba(0,0,0,.25)}}
.head strong{{display:block;font-size:24px;letter-spacing:.1em;font-weight:700}}
.head strong b{{font-weight:500}}
.head small{{display:block;margin-top:3px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#aab9b0}}
.eyebrow{{position:relative;margin:54px 0 0;font-size:16px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#c9d97a}}
.line{{position:relative;width:46px;height:4px;background:#b6cf45;margin:16px 0 22px}}
h1{{position:relative;margin:0;font-weight:700;font-size:{size}px;line-height:1.02;letter-spacing:-.035em;max-width:1060px;overflow-wrap:anywhere}}
h1 em{{font-family:"Playfair Display",Georgia,serif;font-weight:500;font-style:italic;color:#e7f0d2}}
.desc{{position:absolute;left:64px;right:64px;bottom:54px;margin:0;font-size:24px;line-height:1.35;color:#aab9b0;max-height:66px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}}
.foot{{position:absolute;right:64px;top:64px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#aab9b0}}
</style>
<body>
<div class="grid"></div><div class="orb orb-a"></div><div class="orb orb-b"></div>
<div class="head"><img src="file://{logo}" alt=""><div><strong>ADEB <b>LONODJI</b></strong><small>Courage · Discipline · Héritage</small></div></div>
<p class="foot">lonodji.org</p>
<p class="eyebrow">{eyebrow}</p><div class="line"></div>
<h1 id="t">{title}</h1>
<p class="desc">{desc}</p>
</body></html>"""


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
        tmp.write_text(TEMPLATE.format(lang=lang, fonts=fonts, logo=LOGO, eyebrow=esc(eyebrow), title=split_title(title), desc=esc(desc), size=size), encoding="utf-8")
        page.goto(tmp.as_uri(), wait_until="load")
        page.evaluate("document.fonts.ready")
        page.evaluate("""() => { const t = document.getElementById('t'); const limite = 630 - 54 - 66 - 24; let fs = parseFloat(getComputedStyle(t).fontSize);
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
            html = TEMPLATE.format(lang=pg["lang"], fonts=fonts, logo=LOGO, eyebrow=esc(pg["eyebrow"]), title=split_title(pg["title"]), desc=esc(pg["desc"]), size=size)
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")   # ouvert en file:// pour que polices et logo (file://) se chargent
            page.evaluate("document.fonts.ready")
            # le titre ne doit pas déborder sur la description : on réduit la taille jusqu'à ce qu'il tienne
            page.evaluate("""() => { const t = document.getElementById('t'); const limite = 630 - 54 - 66 - 24; let fs = parseFloat(getComputedStyle(t).fontSize);
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
