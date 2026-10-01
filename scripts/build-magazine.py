#!/usr/bin/env python3
"""« Lonodji », le magazine trimestriel d'ADEB LONODJI (janvier, avril, juillet, octobre).

Chaque numéro est décrit dans content/magazine/numeros.json : la une, l'édito (seul texte propre au magazine)
et le sommaire. Tout le reste est repris tel quel de ce que le site a publié : articles du journal,
registre des décisions (lib/decisions.ts), plaidoyers et leur transmission (content/transmissions.json),
structure (content/index.json), postes ouverts (même calcul que lib/postes.ts, via build-postes.py).

Produit, pour chaque numéro :
  public/magazine/lonodji-NN-AAAA-MM.pdf        le magazine, A4, à imprimer ou à partager
  public/magazine/lonodji-NN-couverture.jpg     la couverture (page /magazine, partage)
  content/magazine/index.json                   ce que lit la page /magazine (pages, sommaire, chiffres)

    npm run build && python3 scripts/build-magazine.py [--numero N]

Un numéro paru n'est jamais réécrit (texte daté) : seul --forcer le refait.
Deux passes : la première repère la page où commence chaque rubrique, la seconde l'écrit au sommaire.
"""
from __future__ import annotations

import argparse
import base64
import html as h
import importlib.util
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "magazine"
CONTENT = ROOT / "content"
SITE = "lonodji.org"
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
LETTRES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize",
           "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"]


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


def en_lettres(n: int) -> str:
    if n < len(LETTRES):
        return LETTRES[n]
    dizaines = {20: "vingt", 30: "trente", 40: "quarante", 50: "cinquante", 60: "soixante"}
    d, u = divmod(n, 10)
    if d * 10 in dizaines:
        return dizaines[d * 10] + ("" if u == 0 else " et un" if u == 1 else "-" + LETTRES[u])
    return str(n)


def date_fr(iso: str) -> str:
    a, m, j = (int(x) for x in iso.split("-"))
    return f"{'1er' if j == 1 else j} {MOIS[m - 1]} {a}"


def esc(t: str) -> str:
    return h.escape(t, quote=False)


def nettoyer(html: str) -> str:
    """HTML d'un article pour l'imprimé : liens réduits à leur texte, attributs inutiles retirés."""
    html = re.sub(r"</?a\b[^>]*>", "", html)
    html = re.sub(r"<(h2|h3|p|ul|ol|li)\s+id=\"[^\"]*\"", r"<\1", html)
    return html.replace(' class="form-note"', ' class="sources"').replace(' class="prose-note"', ' class="sources"')


def decisions(debut: str, fin: str) -> list[dict]:
    src = (ROOT / "lib" / "decisions.ts").read_text("utf8")
    types = dict(re.findall(r'(\w+): \{ label: "[^"]+", court: "([^"]+)"', src.split("export const TYPES", 1)[1].split("};", 1)[0]))
    corps = src.split("export const DECISIONS", 1)[1]
    chaine = r'"((?:[^"\\]|\\.)*)"'
    out = []
    for m in re.finditer(rf'id: "([^"]+)", date: "([^"]+)", type: "([^"]+)",\s*titre: {chaine},\s*texte: {chaine}', corps):
        ident, d, typ, titre, texte = m.groups()
        if debut <= d <= fin:
            out.append({"id": ident, "date": d, "type": typ, "court": types.get(typ, typ), "titre": titre, "texte": premiere_phrase(texte)})
    return sorted(out, key=lambda x: (x["date"], x["id"]))


def premiere_phrase(t: str, maxi: int = 140) -> str:
    """La première phrase d'une entrée du registre (le texte complet reste sur /transparence)."""
    m = re.match(r"(.+?[.!?])(\s|$)", t)
    p = m.group(1) if m else t
    if len(p) > maxi:
        p = p[:maxi].rsplit(" ", 1)[0].rstrip(" ,;:—") + "…"
    return p


def lien_org(cle: str) -> str:
    m = re.search(rf'^\s*{cle}: "([^"]+)"', (ROOT / "lib" / "content.ts").read_text("utf8"), re.M)
    return m.group(1) if m else ""


def qr(url: str) -> str:
    import segno
    import io
    buf = io.BytesIO()
    segno.make(url, error="m").save(buf, kind="svg", scale=4, border=2, dark="#10241e", light="#ffffff")
    return "data:image/svg+xml;base64," + base64.b64encode(buf.getvalue()).decode()


def image(chemin: Path) -> str:
    mime = "image/svg+xml" if chemin.suffix == ".svg" else "image/png" if chemin.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(chemin.read_bytes()).decode()


def embleme_leger(chemin: Path) -> str:
    """L'emblème en JPEG de 700 px (le PNG de 1024 px pèserait 1 Mo dans le PDF partagé sur WhatsApp)."""
    import io
    from PIL import Image
    im = Image.open(chemin).convert("RGB")
    im.thumbnail((700, 700), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=86, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


CSS = """
@page{size:A4;margin:15mm 15mm 17mm}
@page couverture{margin:0}
*{box-sizing:border-box}
html,body{margin:0;color:#10241e;font-family:'DM Sans',system-ui,sans-serif;font-size:9.6pt;line-height:1.52;-webkit-print-color-adjust:exact;print-color-adjust:exact;hyphens:auto}
em{font-style:italic}
.couverture{page:couverture;position:relative;width:210mm;height:297mm;overflow:hidden;color:#fff;background:linear-gradient(160deg,#0f3327 0%,#173b2d 46%,#071b15 100%);break-after:page}
.couverture .orbe{position:absolute;border-radius:50%;filter:blur(60px)}
.couverture .o1{width:150mm;height:150mm;right:-50mm;top:-60mm;background:rgba(242,201,76,.30)}
.couverture .o2{width:160mm;height:160mm;left:-70mm;bottom:-70mm;background:rgba(182,207,69,.22)}
.couverture .o3{width:120mm;height:120mm;left:40mm;top:70mm;background:rgba(47,107,74,.55)}
.couverture .dedans{position:absolute;inset:14mm 15mm 14mm;display:flex;flex-direction:column}
.titre-mag{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid rgba(255,255,255,.35);padding-bottom:4mm}
.titre-mag h1{margin:0;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-style:italic;font-size:88pt;line-height:.82;letter-spacing:-.02em;color:#f4ecc9}
.titre-mag .num{text-align:right;font-size:8.5pt;letter-spacing:.18em;text-transform:uppercase;color:#d6e2d8;line-height:1.7}
.titre-mag .num b{display:block;font-size:20pt;letter-spacing:.02em;color:#fff;font-weight:700;text-transform:none}
.sous-mag{margin:3mm 0 0;font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;color:#c9d5cc}
.embleme{position:absolute;right:-4mm;top:66mm;width:92mm;height:92mm;border-radius:50%;box-shadow:0 18mm 30mm rgba(0,0,0,.45);opacity:.96}
.une{margin-top:auto;max-width:150mm}
.une .sur{display:inline-block;font-size:9pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#f2c94c;margin-bottom:4mm}
.une h2{margin:0;font-size:46pt;line-height:1;letter-spacing:-.035em;font-weight:700}
.une h2 em{font-family:'Playfair Display',Georgia,serif;font-weight:500;color:#f4ecc9}
.une p{margin:5mm 0 0;font-size:12pt;line-height:1.45;color:#e6eee6;max-width:135mm}
.accroches{list-style:none;margin:10mm 0 0;padding:6mm 0 0;border-top:1px solid rgba(255,255,255,.35);display:grid;grid-template-columns:repeat(5,1fr);gap:4mm}
.accroches li{font-size:9.5pt;line-height:1.3;color:#fff;font-weight:600}
.accroches li span{display:block;font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#f2c94c;font-weight:700;margin-bottom:1.5mm}
.pied-couv{display:flex;justify-content:space-between;margin-top:7mm;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:#c9d5cc}

.page{break-before:page}
.rub{display:flex;align-items:center;gap:3mm;margin:0 0 5mm;font-size:7.5pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#173b2d}
.rub:before{content:"";width:9mm;height:1.2mm;border-radius:1mm;background:linear-gradient(90deg,#f2c94c,#b6cf45)}
.rub span{margin-left:auto;font-weight:500;letter-spacing:.08em;color:#6a776f;text-transform:none}
h1.titre{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:25pt;line-height:1.06;letter-spacing:-.01em;margin:0 0 3.5mm;color:#10241e}
.chapo{font-size:11.2pt;line-height:1.42;color:#2c3d36;margin:0 0 3mm;max-width:165mm}
.meta{font-size:8pt;color:#6a776f;letter-spacing:.04em;margin:0 0 5mm;padding-bottom:2.5mm;border-bottom:1px solid #d5ddd6}
.cols{column-count:2;column-gap:7mm;column-fill:balance}
.cols p{margin:0 0 2.4mm;text-align:justify}
.cols h2{font-size:11pt;line-height:1.25;margin:4mm 0 2mm;color:#173b2d;break-after:avoid}
.cols h3{font-size:10pt;margin:3mm 0 1.5mm;break-after:avoid}
.cols ul,.cols ol{margin:0 0 2.5mm;padding-left:4.5mm}
.cols li{margin:0 0 1.2mm}
.cols .sources,.sources{font-size:7.4pt;line-height:1.4;color:#5a6962;border-top:1px solid #d5ddd6;padding-top:2mm;margin-top:3mm;text-align:left}
.cols table{width:100%;border-collapse:collapse;font-size:8pt;margin:2mm 0 3mm}
.cols td,.cols th{border-bottom:1px solid #d5ddd6;padding:1mm;text-align:left;vertical-align:top}
figure{margin:0 0 5mm;break-inside:avoid}
figure img{width:100%;max-height:105mm;object-fit:contain;border-radius:3mm;background:#f2f5ef}
figcaption{font-size:7.6pt;color:#5a6962;margin-top:1.5mm}

.ouverture{display:grid;grid-template-columns:1.12fr .88fr;gap:9mm}
.edito h1{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:24pt;margin:0 0 4mm}
.edito p{font-size:10pt;line-height:1.5;margin:0 0 3.2mm;text-align:justify}
.edito p:first-of-type:first-letter{float:left;font-family:'Playfair Display',Georgia,serif;font-size:39pt;line-height:.9;padding:1mm 2mm 0 0;color:#173b2d}
.signature{font-size:9pt;color:#5a6962;margin-top:4mm}
.sommaire{background:#f2f5ef;border-radius:4mm;padding:6mm 6mm 4mm}
.sommaire h2{margin:0 0 4mm;font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:#173b2d}
.sommaire ol{list-style:none;margin:0;padding:0}
.sommaire li{display:grid;grid-template-columns:9mm 1fr;gap:2mm;padding:1.25mm 0;border-bottom:1px solid #d5ddd6}
.sommaire li b{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:16pt;line-height:1;color:#173b2d}
.sommaire li span{display:block;font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#6a776f;font-weight:700}
.sommaire li strong{display:block;font-size:9pt;line-height:1.22;margin-top:.3mm}
.ours{margin-top:4mm;font-size:7pt;line-height:1.5;color:#5a6962}
.ours b{color:#10241e}

.frise{column-count:2;column-gap:7mm}
.frise article{break-inside:avoid;display:grid;grid-template-columns:21mm 1fr;gap:3mm;padding:2mm 0;border-bottom:1px solid #d5ddd6}
.frise time{font-size:8pt;font-weight:700;color:#173b2d;line-height:1.3}
.frise time small{display:inline-block;margin-top:1mm;font-size:6.6pt;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#173b2d;background:#e9f0cf;padding:.4mm 1.6mm;border-radius:3mm}
.frise h3{font-size:9pt;line-height:1.3;margin:0 0 .8mm}
.frise p{font-size:8pt;line-height:1.42;margin:0;color:#34443d}

.poles{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:6mm;break-inside:avoid}
.pole{border:1px solid #d5ddd6;border-radius:3mm;padding:4mm;break-inside:avoid}
.pole h3{margin:0 0 1mm;font-size:10pt;line-height:1.25}
.pole h3 b{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:15pt;color:#173b2d;margin-right:1.5mm}
.pole .vp{font-size:7.6pt;color:#5a6962;margin:0 0 2mm}
.pole ul{list-style:none;margin:0;padding:0}
.pole li{font-size:7.8pt;line-height:1.35;padding:1mm 0;border-top:1px solid #edf1ec}
.pole li i{font-style:normal;color:#6a776f}
.pole li.prio{font-weight:700}
.pole li.prio:after{content:" ★";color:#c9a227}
.legende{font-size:7.6pt;color:#5a6962;margin-top:2mm}

.cartes{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.carte{border:1px solid #d5ddd6;border-radius:3mm;padding:3mm 4mm;break-inside:avoid;background:#fff}
.carte .tag{font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#173b2d}
.carte h3{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:12pt;line-height:1.15;margin:1mm 0 1.5mm}
.carte p{font-size:8pt;line-height:1.4;margin:0 0 1.5mm}
.carte .etat{font-size:7.4pt;color:#5a6962;border-top:1px solid #edf1ec;padding-top:1.6mm;margin:0}
.intro{font-size:10.5pt;line-height:1.5;max-width:170mm;margin:0 0 6mm;color:#2c3d36}

.breves{column-count:2;column-gap:7mm}
.breves article{break-inside:avoid;padding:0 0 3mm;margin:0 0 3mm;border-bottom:1px solid #d5ddd6}
.breves time{font-size:7pt;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#6a776f}
.breves h3{font-size:10.5pt;line-height:1.25;margin:1mm 0 1.2mm}
.breves p{font-size:8.6pt;line-height:1.45;margin:0 0 1mm}
.breves .url{font-size:7.2pt;color:#173b2d;word-break:break-all}

.postes{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.poste{border:1px solid #d5ddd6;border-radius:3mm;padding:3.2mm 3.6mm;break-inside:avoid}
.poste span{font-size:6.6pt;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#173b2d}
.poste strong{display:block;font-size:9.4pt;line-height:1.25;margin:1mm 0 .8mm}
.poste small{font-size:7.4pt;color:#5a6962}
.poste.vp{background:#173b2d;color:#fff;border-color:#173b2d}
.poste.vp span{color:#f2c94c} .poste.vp small{color:#c9d5cc}

.dos-couv{break-before:page;break-after:auto}
.dos-couv .titre-mag h1{font-size:54pt}
.rejoindre{margin-top:28mm;max-width:150mm}
.rejoindre h2{margin:0 0 6mm;font-size:34pt;line-height:1.02;letter-spacing:-.03em}
.rejoindre h2 em{font-family:'Playfair Display',Georgia,serif;font-weight:500;color:#f4ecc9}
.rejoindre p{font-size:12pt;line-height:1.5;color:#e6eee6;margin:0 0 8mm}
.rejoindre ul{list-style:none;margin:0;padding:0}
.rejoindre li{font-size:12.5pt;font-weight:600;padding:3.2mm 0;border-top:1px solid rgba(255,255,255,.22)}
.rejoindre li span{display:block;font-size:7.5pt;letter-spacing:.18em;text-transform:uppercase;color:#f2c94c;font-weight:700;margin-bottom:1mm}
.qr-couv{margin-top:auto;display:flex;align-items:center;gap:6mm}
.qr-couv img{width:34mm;height:34mm;border-radius:2mm}
.qr-couv p{margin:0;font-size:10pt;line-height:1.5;color:#e6eee6}
.dos{display:grid;grid-template-columns:1fr 46mm;gap:8mm;align-items:start;margin-top:8mm;padding:6mm;border-radius:4mm;background:#f2f5ef;break-inside:avoid}
.dos h2{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:20pt;margin:0 0 3mm}
.dos ul{margin:0;padding-left:4.5mm;font-size:9.4pt;line-height:1.55}
.dos .qr{text-align:center;font-size:7.4pt;color:#5a6962}
.dos .qr img{width:40mm;height:40mm;display:block;margin:0 auto 2mm}
"""


def couverture(n: dict, ctx: dict) -> str:
    acc = "".join(f"<li><span>{esc(r)}</span>{esc(t.format(**ctx))}</li>" for r, t in n["accroches"])
    une = n["une"]
    a, m, _ = n["parution"].split("-")
    return f"""<section class="couverture"><div class="orbe o1"></div><div class="orbe o3"></div><div class="orbe o2"></div>
<img class="embleme" src="{ctx['embleme']}" alt="">
<div class="dedans">
<div class="titre-mag"><h1>Lonodji</h1><div class="num">Trimestriel<b>N° {n['numero']}</b>{esc(n['periode'])}</div></div>
<p class="sous-mag">Le magazine d’ADEB LONODJI · Bédjondo, Mandoul Occidental, et sa diaspora</p>
<div class="une"><span class="sur">{esc(une['surtitre'])}</span><h2>{une['titre']}</h2><p>{esc(une['chapo'])}</p></div>
<ul class="accroches">{acc}</ul>
<div class="pied-couv"><span>{SITE}/magazine</span><span>Courage · Discipline · Héritage</span><span>Gratuit · à faire circuler</span></div>
</div></section>"""


def ouverture(n: dict, ctx: dict, pages: dict, entrees: list[tuple[str, str]]) -> str:
    edito = "".join(f"<p>{p.format(**ctx)}</p>" for p in n["edito"])
    items = "".join(f"<li><b>{pages.get(i, '…')}</b><div><span>{esc(r)}</span><strong>{t}</strong></div></li>" for i, (r, t) in enumerate(entrees))
    return f"""<section class="page"><div class="rub">Édito<span>Lonodji n° {n['numero']} · {esc(n['periode'])}</span></div>
<div class="ouverture"><div class="edito"><h1>Un numéro <em>qu’on garde</em></h1>{edito}<p class="signature">La rédaction d’ADEB LONODJI</p></div>
<div><div class="sommaire"><h2>Au sommaire</h2><ol>{items}</ol></div>
<p class="ours"><b>Lonodji</b>, magazine trimestriel d’ADEB LONODJI, Association de Développement et d’Entraide de Bédjondo (Mandoul Occidental, Tchad), reconnue en 1995. Sièges : N’Djamena et Bédjondo. Numéro {n['numero']}, paru le {date_fr(n['parution'])}{(' ; ' + esc(n['edition'])) if n.get('edition') else ''}. Textes : rédaction d’ADEB LONODJI, sauf mention ; tous publiés d’abord sur {SITE}, où ils gardent leurs liens et leurs sources. Libre de reproduction et de diffusion, sans modification et avec mention de la source. Contact : {esc(ctx['telephone'])} (appel et WhatsApp) · {SITE}/participer.</p></div></div></section>"""


def section_article(e: dict, art: dict, n: dict) -> str:
    chapo = art.get("lede") or art.get("summary") or ""
    corps = nettoyer("".join(s["html"] for s in art["sections"]))
    fig = ""
    if e.get("image"):
        fig = f'<figure><img src="{image(ROOT / "public" / e["image"].lstrip("/"))}" alt=""><figcaption>{esc(e.get("legende", ""))}</figcaption></figure>'
    poles = e.get("_poles", "")
    return f"""<section class="page"><div class="rub">{esc(e['rubrique'])}<span>{SITE}{esc(art['route'])}</span></div>
<h1 class="titre">{esc(art['title'])}</h1>{f'<p class="chapo">{esc(chapo)}</p>' if chapo else ''}
<p class="meta">{esc(art.get('byline') or 'Rédaction ADEB LONODJI')} · publié le {esc(art.get('dateLabel') or date_fr(art['date']))} · {esc(art.get('readTime', ''))}</p>
{fig}<div class="cols">{corps}</div>{poles}</section>"""


def bloc_poles(idx: dict, prio: list[str], au: str) -> str:
    cartes = []
    for p in idx["structure"]["poles"]:
        d = p.get("direction") or {}
        vp = f"Vice-présidence : {esc(d['name'])}" if d.get("filled") else "Vice-présidence : à élire"
        lis = "".join(f'<li class="{"prio" if t["id"] in prio else ""}">{esc(t["number"])}. {esc(t["name"])} <i>— {esc(t["coordinator"]) if t["filled"] else "à pourvoir"}</i></li>' for t in p["items"])
        cartes.append(f'<div class="pole"><h3><b>{p["roman"]}</b>{esc(p["name"])}</h3><p class="vp">{vp}</p><ul>{lis}</ul></div>')
    return f'<div class="page"><div class="rub">Dossier<span>{SITE}/programmes</span></div><h1 class="titre">Qui coordonne quoi, <em>pôle par pôle</em></h1><p class="intro">Les {en_lettres(len(idx["structure"]["poles"]))} pôles et leurs {en_lettres(sum(len(p["items"]) for p in idx["structure"]["poles"])).replace("vingt-un", "vingt et une").replace("et un", "et une")} thématiques après les décisions du 1er octobre 2026, avec les noms publiés sur la page Nos actions. Les sept thématiques prioritaires sont marquées d’une étoile.</p><div class="poles">{"".join(cartes)}</div><p class="legende">★ thématique prioritaire : un titulaire et un adjoint. Situation au {date_fr(au)}, telle que la publie la page Nos actions ({SITE}/programmes).</p></div>'


def section_trimestre(e: dict, n: dict, decs: list[dict]) -> str:
    def texte(d: dict) -> str:
        return "" if d["type"] == "nomination" else f"<p>{esc(d['texte'])}</p>"
    items = "".join(f'<article><time>{date_fr(d["date"]).replace(" 2026", "")}<br><small>{esc(d["court"])}</small></time><div><h3>{esc(d["titre"])}</h3>{texte(d)}</div></article>' for d in decs)
    return f"""<section class="page"><div class="rub">{esc(e['rubrique'])}<span>{SITE}/transparence</span></div>
<h1 class="titre">{esc(e['titre'])}</h1>
<p class="intro">Les {en_lettres(len(decs))} entrées du registre public des décisions entre le {date_fr(n['couvre'][0])} et le {date_fr(n['couvre'][1])} : ce qui a été décidé, nommé, annoncé, proposé ou publié. Chaque entrée est résumée ici à sa première phrase ; le texte complet et ses sources sont sur {SITE}/transparence.</p>
<div class="frise">{items}</div></section>"""


def section_plaidoyers(e: dict, idx: dict, tr: dict, ctx: dict) -> str:
    cartes = []
    for p in idx["plaidoyers"]:
        t = tr.get(p["id"], {})
        dest = t.get("destinataires", [])
        envoyes = sum(1 for d in dest if d.get("statut") != "a-signer")
        etat = (f"{len(dest)} destinataire{'s' if len(dest) > 1 else ''} · "
                + (f"{envoyes} lettre{'s' if envoyes > 1 else ''} envoyée{'s' if envoyes > 1 else ''}" if envoyes else "lettres prêtes, à signer"))
        cartes.append(f'<div class="carte"><span class="tag">{esc(p["theme"])}</span><h3>{esc(p["title"])}</h3><p>{esc(p["demand"])}</p><p class="etat">Publié le {esc(p["published"])} · {etat}</p></div>')
    return f"""<section class="page"><div class="rub">{esc(e['rubrique'])}<span>{SITE}/actions</span></div>
<h1 class="titre">{esc(e['titre'].format(**ctx))}</h1>
<p class="intro">Sept plaidoyers et une note à la commune de Bédjondo, publiés les 16 et 17 septembre 2026. Chacun part avec une lettre d’envoi par destinataire, signée par le président et le secrétaire général ; au {date_fr(ctx['_parution'])}, {('aucune n’est encore partie' if not ctx['envoyees'] else en_lettres(ctx['envoyees']) + ' sont parties')}. La page Plaidoyers &amp; engagements datera chaque envoi et chaque réponse.</p>
<div class="cartes">{"".join(cartes)}</div></section>"""


def section_breves(e: dict) -> str:
    items = []
    for s in e["slugs"]:
        a = json.loads((CONTENT / "articles" / f"{s}.json").read_text("utf8"))
        resume = a.get("summary") or ""
        if resume.endswith("…") or not resume:
            resume = a.get("lede") or resume
        items.append(f'<article><time>{esc(a.get("dateLabel") or date_fr(a["date"]))}</time><h3>{esc(a["title"])}</h3><p>{esc(resume)}</p><p class="url">{SITE}{esc(a["route"])}</p></article>')
    return f"""<section class="page"><div class="rub">{esc(e['rubrique'])}<span>{SITE}/journal</span></div>
<h1 class="titre">{esc(e['titre'])}</h1><div class="breves">{"".join(items)}</div></section>"""


def section_contribuer(e: dict, n: dict) -> str:
    """Rubrique permanente : comment écrire dans le magazine (texte propre au magazine, comme l'édito)."""
    blocs = [
        ("Proposer un article", "Toute personne peut proposer un article : il est relu, sourcé, puis publié sous le nom de son auteur sur le site, et repris dans le numéro suivant.", f"{SITE}/participer#proposer"),
        ("Raconter Bédjondo", "Un ancien qui raconte, une femme qui fait bouger les choses, un jeune talent, une photo de forum : rien n’est publié sans votre relecture.", f"{SITE}/temoignages"),
        ("Signaler un besoin", "Un forage en panne, une école sans latrines, une piste coupée : chaque signalement est rattaché à sa localité, et la synthèse paraît dans la lettre et dans ce magazine.", f"{SITE}/territoire/besoins"),
        ("Corriger une erreur", "Une erreur de fait se corrige toujours à découvert : elle est datée dans le journal des corrections, et le numéro suivant la signale.", f"{SITE}/transparence"),
    ]
    items = "".join(f'<div class="carte"><span class="tag">{esc(t)}</span><p>{esc(x)}</p><p class="etat">{esc(u)}</p></div>' for t, x, u in blocs)
    return f"""<section class="page"><div class="rub">{esc(e['rubrique'])}<span>{SITE}/magazine</span></div>
<h1 class="titre">{esc(e['titre'])}</h1>
<p class="intro"><em>Lonodji</em> ne publie rien qui n’ait d’abord paru sur {SITE}. Le numéro de {esc(n['prochain'])} reprendra ce que le site aura publié d’ici là : c’est donc sur le site que l’on écrit dans le magazine.</p>
<div class="cartes">{items}</div>
<div class="dos"><div><h2>Imprimer et faire circuler</h2><ul>
<li>Le PDF s’imprime en A4, recto verso ; il se partage tel quel sur WhatsApp.</li>
<li>Il peut être reproduit et distribué librement, sans modification et avec sa source.</li>
<li>Les numéros parus restent en ligne sur {SITE}/magazine ; après son jour de parution, un numéro n’est plus modifié.</li></ul></div>
<div class="qr"><img src="{qr("https://lonodji.org/magazine")}" alt="">{SITE}/magazine</div></div></section>"""


def section_postes(e: dict, postes: list[dict], ctx: dict) -> str:
    items = "".join(f'<div class="poste{" vp" if p["genre"] == "vice-presidence" else ""}"><span>{esc(p["eyebrow"].replace("Poste ouvert · ", ""))}</span><strong>{esc(p["role"])} — {esc(p["nom"])}</strong><small>{esc(p["pole"])}</small></div>' for p in postes)
    return f"""<section class="page"><div class="rub">{esc(e['rubrique'])}<span>{SITE}/participer</span></div>
<h1 class="titre">{esc(e['titre'].format(**ctx))}</h1>
<p class="intro">Depuis le 1er octobre 2026, chaque thématique prioritaire a un titulaire et un adjoint, et chaque pôle une vice-présidence élue. Ces postes sont libres. Tous sont bénévoles et s’exercent depuis Bédjondo, N’Djamena ou la diaspora ; chacun a sa fiche de mission en ligne.</p>
<div class="postes">{items}</div>
</section>"""


def dos_couverture(n: dict, ctx: dict) -> str:
    return f"""<section class="couverture dos-couv"><div class="orbe o1"></div><div class="orbe o3"></div><div class="orbe o2"></div>
<div class="dedans">
<div class="titre-mag"><h1>Lonodji</h1><div class="num">Prochain numéro<b>{esc(n['prochain'])}</b>{SITE}/magazine</div></div>
<div class="rejoindre"><h2>Rejoindre <em>ADEB LONODJI</em></h2>
<p>Au Tchad comme dans la diaspora, avec un peu de temps ou une compétence : une thématique à coordonner ou à seconder, une vice-présidence à briguer, un besoin à signaler, un témoignage à confier.</p>
<ul><li><span>Se proposer, adhérer, signaler</span>{SITE}/participer</li>
<li><span>Appel et WhatsApp</span>{esc(ctx['telephone'])}</li>
<li><span>Réseaux</span>Facebook « Lonodji » · X @adeb_lonodji · YouTube @adeb.lonodji</li>
<li><span>La lettre mensuelle</span>{SITE}/participer#newsletter</li></ul></div>
<div class="qr-couv"><img src="{ctx['qr']}" alt=""><p>Scannez pour ouvrir<br>{SITE}/participer</p></div>
<div class="pied-couv"><span>ADEB LONODJI · Bédjondo · N’Djamena</span><span>Courage · Discipline · Héritage</span><span>Gratuit · à faire circuler</span></div>
</div></section>"""


def construire(n: dict, ctx: dict, pages: dict) -> tuple[str, list[tuple[str, str]]]:
    idx, tr, postes, decs, prio = ctx["_idx"], ctx["_tr"], ctx["_postes"], ctx["_decs"], ctx["_prio"]
    corps, entrees = [], []
    for e in n["sommaire"]:
        if e["type"] == "article":
            art = json.loads((CONTENT / "articles" / f"{e['slug']}.json").read_text("utf8"))
            if e.get("poles"):
                e = {**e, "_poles": bloc_poles(idx, prio, n["parution"])}
            corps.append(section_article(e, art, n))
            entrees.append((e["rubrique"], esc(art["title"])))
        elif e["type"] == "trimestre":
            corps.append(section_trimestre(e, n, decs))
            entrees.append((e["rubrique"], esc(e["titre"])))
        elif e["type"] == "plaidoyers":
            corps.append(section_plaidoyers(e, idx, tr, ctx))
            entrees.append((e["rubrique"], esc(e["titre"].format(**ctx))))
        elif e["type"] == "breves":
            corps.append(section_breves(e))
            entrees.append((e["rubrique"], esc(e["titre"])))
        elif e["type"] == "contribuer":
            corps.append(section_contribuer(e, n))
            entrees.append((e["rubrique"], esc(e["titre"])))
        elif e["type"] == "postes":
            corps.append(section_postes(e, postes, ctx))
            entrees.append((e["rubrique"], esc(e["titre"].format(**ctx))))
    html = couverture(n, ctx) + ouverture(n, ctx, pages, entrees) + "".join(corps) + dos_couverture(n, ctx)
    return html, entrees


def typo(html: str) -> str:
    """Espaces insécables de la typographie française dans les nœuds de texte (pas de « : » ni de « » » en début de ligne)."""
    def fixe(m: re.Match) -> str:
        t = re.sub(r" ([:;!?»])", "\u00a0\\1", m.group(1))
        t = t.replace("« ", "«\u00a0").replace("N° ", "N°\u00a0").replace("n° ", "n°\u00a0")
        return ">" + t + "<"
    return re.sub(r">([^<]+)<", fixe, html)


def normal(t: str) -> str:
    t = h.unescape(re.sub(r"<[^>]+>", "", t))
    return re.sub(r"\s+", " ", t.replace("­", "")).strip().lower()


def reperer(pdf: Path, entrees: list[tuple[str, str]]) -> dict:
    """Page (numérotée à partir de 1 = couverture) où commence chaque rubrique : celle dont le texte contient son titre."""
    import pymupdf as fitz
    doc = fitz.open(pdf)
    textes = [normal(p.get_text()) for p in doc]
    pages, depart = {}, 2
    for i, (_, titre) in enumerate(entrees):
        cle = normal(titre)[:48]
        for k in range(depart, len(textes)):
            if cle in textes[k]:
                pages[i] = k + 1
                depart = k + 1
                break
    return pages


def sans_pied(pdf: Path) -> None:
    """Retire le folio des deux couvertures (première et dernière page), dessiné par Chromium dans la marge."""
    import pymupdf as fitz
    doc = fitz.open(pdf)
    for k in (0, doc.page_count - 1):
        p = doc[k]
        p.add_redact_annot(fitz.Rect(0, p.rect.height - 30, p.rect.width, p.rect.height), fill=False)
        p.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE)
    doc.save(pdf.with_suffix(".tmp.pdf"), garbage=3, deflate=True)
    doc.close()
    pdf.with_suffix(".tmp.pdf").replace(pdf)


def main() -> None:
    from playwright.sync_api import sync_playwright

    ap = argparse.ArgumentParser()
    ap.add_argument("--numero", type=int, help="ne refaire que ce numéro")
    ap.add_argument("--forcer", action="store_true", help="refaire un numéro déjà paru (sinon un PDF existant n'est jamais réécrit)")
    args = ap.parse_args()

    og = charger("build_og", ROOT / "scripts" / "build-og.py")
    bp = charger("build_postes", ROOT / "scripts" / "build-postes.py")
    from org import TELEPHONE  # seule source : lib/contact.ts

    conf = json.loads((CONTENT / "magazine" / "numeros.json").read_text("utf8"))
    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    tr = {k: v for k, v in json.loads((CONTENT / "transmissions.json").read_text("utf8")).items() if not k.startswith("_")}
    postes = bp.postes()
    fonts = og.font_faces()
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = ROOT / ".next" / "magazine-tmp.html"
    sortie = {"numeros": []}
    ancien = CONTENT / "magazine" / "index.json"
    deja = {x["numero"]: x for x in json.loads(ancien.read_text("utf8"))["numeros"]} if ancien.exists() else {}

    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        for n in conf["numeros"]:
            if args.numero and n["numero"] != args.numero:
                if n["numero"] in deja:
                    sortie["numeros"].append(deja[n["numero"]])
                continue
            a, m, _ = n["parution"].split("-")
            if (OUT / f"lonodji-{n['numero']:02d}-{a}-{m}.pdf").exists() and n["numero"] in deja and not args.forcer:
                sortie["numeros"].append(deja[n["numero"]])   # numéro paru : figé, comme tout texte daté
                continue
            fin = n["couvre"][1]
            lettres = sum(len(t["destinataires"]) for t in tr.values())
            envoyees = sum(1 for t in tr.values() for d in t["destinataires"] if d.get("statut") != "a-signer")
            ctx = {
                "articles": en_lettres(sum(1 for a in idx["articles"] if n["couvre"][0] <= a["date"] <= fin)),
                "plaidoyers": en_lettres(len(idx["plaidoyers"])), "lettres": lettres, "envoyees": envoyees,
                "postes": en_lettres(len(postes)).capitalize(), "prochain": n["prochain"], "telephone": TELEPHONE,
                "embleme": embleme_leger(og.LOGO), "qr": qr("https://lonodji.org/participer"),
                "_idx": idx, "_tr": tr, "_parution": n["parution"], "_postes": postes, "_decs": decisions(n["couvre"][0], fin), "_prio": bp.prioritaires(),
            }
            ctx["postes_min"] = ctx["postes"].lower()
            a, m, _ = n["parution"].split("-")
            nom = f"lonodji-{n['numero']:02d}-{a}-{m}"
            pdf = OUT / f"{nom}.pdf"
            pied = (f'<div style="width:100%;font:7pt DM Sans,Arial,sans-serif;color:#6a776f;padding:0 15mm;display:flex;justify-content:space-between">'
                    f'<span>Lonodji · n° {n["numero"]} · {esc(n["periode"])}</span><span>{SITE}/magazine</span><span class="pageNumber"></span></div>')
            pages: dict = {}
            for passe in (1, 2):
                html, entrees = construire(n, ctx, pages)
                tmp.write_text(f'<!doctype html><html lang="fr"><meta charset="utf-8"><title>Lonodji n° {n["numero"]}</title><style>{fonts}{CSS}</style><body>{typo(html)}</body></html>', encoding="utf-8")
                pg.goto(tmp.as_uri(), wait_until="load")
                pg.evaluate("document.fonts.ready")
                pg.pdf(path=str(pdf), format="A4", print_background=True, prefer_css_page_size=True,
                       display_header_footer=True, header_template="<span></span>", footer_template=pied)
                sans_pied(pdf)
                pages = reperer(pdf, entrees)
            # couverture en image, pour la page /magazine et le partage
            pg.set_viewport_size({"width": 794, "height": 1123})
            pg.goto(tmp.as_uri(), wait_until="load")
            pg.evaluate("document.fonts.ready")
            couv = OUT / f"lonodji-{n['numero']:02d}-couverture.png"
            pg.locator(".couverture").first.screenshot(path=str(couv))
            from PIL import Image
            im = Image.open(couv).convert("RGB")
            im.resize((800, round(800 * im.height / im.width)), Image.LANCZOS).save(couv.with_suffix(".jpg"), quality=86, optimize=True)
            couv.unlink()
            import pymupdf as fitz
            total = fitz.open(pdf).page_count
            sortie["numeros"].append({
                "numero": n["numero"], "periode": n["periode"], "parution": n["parution"], "parutionLabel": date_fr(n["parution"]),
                "prochain": n["prochain"], "titre": re.sub(r"<[^>]+>", "", n["une"]["titre"]), "chapo": n["une"]["chapo"], "edition": n.get("edition", ""),
                "pdf": f"/magazine/{pdf.name}", "couverture": f"/magazine/{couv.with_suffix('.jpg').name}", "pages": total,
                "taille": f"{pdf.stat().st_size / 1_000_000:.1f} Mo".replace(".", ","),
                "sommaire": [{"rubrique": r, "titre": h.unescape(re.sub(r"<[^>]+>", "", t)), "page": pages.get(i)} for i, (r, t) in enumerate(entrees)],
            })
            print(f"{pdf.relative_to(ROOT)} : {total} pages ; sommaire {[pages.get(i) for i in range(len(entrees))]}")
        b.close()
    tmp.unlink(missing_ok=True)
    sortie["numeros"].sort(key=lambda x: -x["numero"])
    sortie["rythme"] = conf["rythme"]
    ancien.write_text(json.dumps(sortie, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
