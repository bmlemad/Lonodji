#!/usr/bin/env python3
"""La lettre d'information : versions PDF des numéros publiés au journal
(rubrique « lettre ») et brouillon du numéro suivant.

    python3 scripts/build-lettre.py                    PDF de chaque numéro → public/lettres/, index content/lettres.json
    python3 scripts/build-lettre.py --brouillon 2026-10   brouillon Markdown du numéro du mois → content/brouillons/lettre-2026-10.md

Le brouillon ne s'écrit pas tout seul : il rassemble ce que le site a publié
depuis le numéro précédent (articles par rubrique, avec leur chapô), les
postes ouverts (content/missions.json) et les chiffres datés du tableau de
bord (content/indicateurs.json) ; la partie « ce qui a été décidé » reste à
écrire par l'association. Une fois relu, le fichier se publie avec
scripts/publier-article.py. Lancer après `npm run build` (polices)."""
from __future__ import annotations

import argparse
import base64
import html as h
import importlib.util
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "lettres"
LOGO = ROOT / "public" / "odeb" / "identite" / "adeb-lonodji-logo-horizontal-clair-superposable.png"
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
SITE = "https://lonodji.org"


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


og = charger("build_og", ROOT / "scripts" / "build-og.py")

CSS = """
@page{size:A4;margin:18mm 18mm 20mm}
*{box-sizing:border-box}
html,body{margin:0;color:#10241e;font-family:'DM Sans',system-ui,sans-serif;font-size:11pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tete{display:flex;justify-content:space-between;align-items:flex-start;gap:8mm;padding-bottom:4mm;border-bottom:1px solid #d5ddd6;margin-bottom:7mm}
.tete img{height:18mm;width:auto}
.tete .meta{text-align:right;font-size:8.5pt;color:#526159;line-height:1.5}
.tete .meta b{display:block;color:#10241e;font-size:9.5pt;letter-spacing:.12em;text-transform:uppercase}
.eyebrow{font-size:8.5pt;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#526159;margin:0 0 2mm}
h1{margin:0 0 4mm;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:24pt;line-height:1.1;letter-spacing:-.01em}
.lede{font-size:12.5pt;line-height:1.5;color:#33443c;margin:0 0 6mm}
.corps h2{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:16pt;margin:7mm 0 2.5mm;line-height:1.2}
.corps h3{font-size:11.5pt;margin:5mm 0 1.5mm}
.corps p{margin:0 0 3mm}
.corps ul,.corps ol{margin:0 0 3mm;padding-left:5mm}
.corps li{margin:0 0 1.2mm}
.corps a{color:#173b2d;text-decoration:underline;text-underline-offset:2px}
.corps blockquote{margin:3mm 0;padding:2mm 0 2mm 5mm;border-left:2px solid #b6cf45;color:#33443c;font-style:italic}
.corps hr{border:0;border-top:1px solid #d5ddd6;margin:6mm 0}
.pied{margin-top:8mm;padding-top:3mm;border-top:1px solid #d5ddd6;font-size:8.5pt;color:#607069;line-height:1.5}
"""


def jour(iso: str) -> str:
    a, m, j = iso[:10].split("-")
    return f"{int(j)} {MOIS[int(m) - 1]} {a}"


def lettres() -> list[dict]:
    d = json.loads((ROOT / "content" / "index.json").read_text(encoding="utf-8"))
    out = []
    for a in d["articles"]:
        if a.get("category") != "lettre":
            continue
        art = json.loads((ROOT / "content" / "articles" / f"{a['slug']}.json").read_text(encoding="utf-8"))
        m = re.search(r"n°\s*(\d+)", a["title"])
        out.append({"slug": a["slug"], "route": a["route"], "titre": a["title"], "date": a["date"], "dateLabel": a["dateLabel"], "numero": int(m.group(1)) if m else 0, "resume": a.get("summary", ""), "lede": art.get("lede", ""), "html": "\n".join(s["html"] for s in art["sections"]), "pdf": f"/lettres/lettre-{a['slug']}.pdf", "lecture": a.get("readTime", "")})
    return sorted(out, key=lambda x: x["date"])


def pdf_lettres() -> None:
    from playwright.sync_api import sync_playwright

    fonts = og.font_faces()
    logo = "data:image/png;base64," + base64.b64encode(LOGO.read_bytes()).decode()
    OUT.mkdir(parents=True, exist_ok=True)
    liste = lettres()
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        for L in liste:
            corps = re.sub(r'href="/', f'href="{SITE}/', L["html"])
            html_page = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{CSS}</style><body>
<div class="tete"><img src="{logo}" alt="ADEB LONODJI"><div class="meta"><b>Lettre d’information</b>n° {L['numero']} · {L['dateLabel']}<br>Association de Développement et d’Entraide de Bédjondo<br>lonodji.org/lettre</div></div>
<p class="eyebrow">Lettre d’information · n° {L['numero']}</p>
<h1>{h.escape(L['titre'])}</h1>
<p class="lede">{h.escape(L['lede'])}</p>
<div class="corps">{corps}</div>
<div class="pied">Lettre publiée le {L['dateLabel']} sur lonodji.org{L['route']} — s’abonner, lire les numéros précédents : lonodji.org/lettre. Ce PDF est fait pour être transmis tel quel, par WhatsApp ou par e-mail. Une erreur de fait ? lonodji.org/transparence#corrections : elle sera corrigée et datée.</div>
</body></html>"""
            pg.set_content(html_page, wait_until="load")
            pg.evaluate("document.fonts.ready")
            pg.pdf(path=str(ROOT / "public" / L["pdf"].lstrip("/")), format="A4", print_background=True, prefer_css_page_size=True)
        b.close()
    index = [{k: L[k] for k in ("slug", "route", "titre", "date", "dateLabel", "numero", "resume", "pdf", "lecture")} for L in liste]
    (ROOT / "content" / "lettres.json").write_text(json.dumps({"genere": date.today().isoformat(), "lettres": index}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(liste)} lettres en PDF dans {OUT.relative_to(ROOT)} ; content/lettres.json")


def brouillon(mois: str) -> None:
    d = json.loads((ROOT / "content" / "index.json").read_text(encoding="utf-8"))
    liste = lettres()
    precedente = liste[-1] if liste else None
    depuis = precedente["date"] if precedente else "0000-00-00"
    numero = (precedente["numero"] if precedente else 0) + 1
    a, m = mois.split("-")
    titre_mois = f"{MOIS[int(m) - 1]} {a}"
    cats = {c["slug"]: c["label"] for c in d["journalCategories"]}
    articles = [x for x in d["articles"] if x["date"] > depuis and x.get("category") != "lettre" and x["date"].startswith(mois)]
    par_cat: dict[str, list[dict]] = {}
    for x in sorted(articles, key=lambda x: x["date"]):
        par_cat.setdefault(x.get("category", "autre"), []).append(x)
    lignes = [
        "---",
        f"titre: Lettre d’information n° {numero} — {titre_mois}",
        f"chapo: [À écrire : une phrase sur ce que le mois a publié, décidé ou ouvert — sans annonce sans suite.]",
        "rubrique: lettre",
        "statut: brouillon",
        "auteur: Rédaction ADEB LONODJI",
        f"date: {mois}-{'30' if m in ('04', '06', '09', '11') else '28' if m == '02' else '31'}",
        "---",
        "",
        f"La lettre paraît chaque mois et ne dit qu’une chose : ce que l’association a publié, décidé ou ouvert depuis le numéro précédent{(' (n° ' + str(precedente['numero']) + ', ' + precedente['dateLabel'] + ')') if precedente else ''}. Quand il n’y a rien à dire, nous le disons aussi.",
        "",
        "## Ce qui a été décidé",
        "",
        "[À écrire par l’association : les décisions du mois, datées, avec leur source (procès-verbal, article du journal). Rien de ce qui n’est pas décidé.]",
        "",
        "## Ce qui a été publié",
        "",
    ]
    if not articles:
        lignes.append(f"Aucun article publié en {titre_mois}. [Le dire tel quel, ou retirer la lettre.]")
    for cat, xs in par_cat.items():
        lignes.append(f"### {cats.get(cat, cat)}")
        lignes.append("")
        for x in xs:
            lignes.append(f"- [{x['title']}]({SITE}{x['route']}) ({jour(x['date'])}) — {x.get('summary', '').strip()}")
        lignes.append("")
    miss = ROOT / "content" / "missions.json"
    if miss.exists():
        mj = json.loads(miss.read_text(encoding="utf-8"))
        dv = [f"pôle {x['roman']} ({x['nom']})" for x in mj["directions"] if not x["pourvue"]]
        cv = [f"{x['numero']} {x['nom']}" for x in mj["coordinations"] if not x["pourvue"]] + [f"cellule {x['nom']}" for x in mj["cellules"] if not x["pourvue"]]
        lignes += ["## Ce qui est ouvert", "", f"- Directions de pôle à pourvoir, au rang de chef de projet : {', '.join(dv) if dv else 'aucune'} — [les fiches de mission]({SITE}/programmes/fiches-de-mission).",
                   f"- Coordinations à pourvoir : {', '.join(cv) if cv else 'aucune'} — [candidater]({SITE}/participer?coordo=1#contact).", ""]
    ind = ROOT / "content" / "indicateurs.json"
    if ind.exists():
        ij = json.loads(ind.read_text(encoding="utf-8"))
        c = ij.get("contenu", {})
        co, pl, pb, ca = c.get("coordinations", {}), c.get("plaidoyers", {}), c.get("problematiques", {}), c.get("carte", {})
        lignes += ["## Les chiffres du mois", "",
                   f"- {c.get('articles', 0)} articles publiés au journal depuis le {jour(c['premierArticle']) if c.get('premierArticle') else '…'} ;",
                   f"- {co.get('pourvues', 0)} coordinations pourvues sur {co.get('total', 0)}, {co.get('cellulesPourvues', 0)} cellule sur {co.get('cellulesTotal', 0)} ;",
                   f"- {pl.get('publies', 0)} plaidoyers publiés, {pl.get('envoyes', 0)} transmis, {pl.get('reponses', 0)} réponse(s) ;",
                   f"- {pb.get('documentees', 0)} problématiques documentées sur {pb.get('total', 0)}, {pb.get('chantiersPrioritaires', 0)} chantiers prioritaires ;",
                   f"- {ca.get('localitesNommees', 0)} localités nommées sur {ca.get('unites', 0)} unités ;",
                   f"- {c.get('corrections', 0)} corrections publiées et datées.",
                   "", f"Chiffres du tableau de bord ({SITE}/impact) au {jour(ij['genere']) if ij.get('genere') else '…'}, à rafraîchir le jour de la parution (python3 scripts/build-indicateurs.py).", ""]
    lignes += ["## Le mois prochain", "", "[À écrire : ce qui est prévu, avec sa date, ou rien.]", "", f"Pour s’abonner ou lire les numéros précédents : {SITE}/lettre. Écrire à l’association : {SITE}/participer.", ""]
    dest = ROOT / "content" / "brouillons" / f"lettre-{mois}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(lignes), encoding="utf-8")
    print(f"brouillon : {dest.relative_to(ROOT)} ({len(articles)} articles depuis le n° {precedente['numero'] if precedente else 0}) — à relire, puis : python3 scripts/publier-article.py {dest.relative_to(ROOT)}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brouillon", metavar="AAAA-MM", help="écrire le brouillon du numéro du mois")
    args = ap.parse_args()
    if args.brouillon:
        brouillon(args.brouillon)
    else:
        pdf_lettres()


if __name__ == "__main__":
    sys.exit(main())
