#!/usr/bin/env python3
"""Fiches de mission en PDF (A4) : les vice-présidences de pilier (directions de
pilier jusqu'au 1er octobre 2026), les vingt-deux
coordinations de thématique et les deux cellules transversales, dans
public/missions/, plus un recueil complet. Tout le texte vient de
content/index.json (structure importée du site) et des formulations déjà
publiées (pages Nos actions, Mission, Participer, article du 28 septembre
2026 sur les directions de pilier) : rien n'est inventé, l'état (pourvu, à
pourvoir) est celui du site à la génération. Lancer après `npm run build`
(polices auto-hébergées) :

    python3 scripts/build-fiches-mission.py"""
from __future__ import annotations

import base64
import html as h
import importlib.util
import json
import re
import sys
from datetime import date
from pathlib import Path
from org import TELEPHONE  # seule source : lib/contact.ts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "missions"
SITE = "https://lonodji.org"
LOGO = ROOT / "public" / "odeb" / "identite" / "adeb-lonodji-logo-horizontal-clair-superposable.png"
TEL = TELEPHONE
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


og = charger("build_og", ROOT / "scripts" / "build-og.py")

# Formulations du site, reprises telles quelles.
DIRECTION_FAIT = [
    "réunit chaque trimestre les coordonnateurs et coordonnatrices des thématiques de son pilier ;",
    "tient le plan d’action et le calendrier du pilier ;",
    "suit les plaidoyers et les projets qui en relèvent ;",
    "rend compte au bureau et à l’assemblée.",
]
DIRECTION_NOTE = ("Il ou elle ne remplace pas les coordonnateurs : il les tient ensemble. La vice-présidence de pilier est une fonction élue, distincte de la coordination des thématiques ; "
                  "créée le 28 septembre 2026 sous le nom de direction de pilier, au rang de chef de projet, elle a pris son nom actuel le 1er octobre 2026 (décision du bureau exécutif). "
                  "Une même personne ne coordonne qu’une thématique.")
COORDINATION_FAIT = [
    "réunit les membres intéressés par la thématique ;",
    "propose un plan d’action simple à la thématique ;",
    "fait avancer la thématique de manière autonome au quotidien, avec l’appui des deux cellules transversales si besoin ;",
    "rend compte de l’avancement lors des assemblées de l’association, devant l’ensemble des membres.",
]
COORDINATION_NOTE = "Coordonner une thématique demande de la régularité ; contribuer ponctuellement est déjà précieux. Le coordonnateur ou la coordonnatrice travaille avec la vice-présidence de son pilier, qui tient le plan d’action et le calendrier de l’ensemble ; une même personne ne coordonne qu’une thématique (décision du 1er octobre 2026)."
# Thématiques prioritaires (décision du 1er octobre 2026, lib/organisation.ts PRIORITAIRES) : un titulaire et un adjoint.
PRIORITAIRES = {"eau-energie-connectivite", "energie", "desenclavement-urbanisation", "sante-prevention", "jeunesse-reussite",
                "transformation-numerique-services", "gouvernance-plaidoyer"}
# Engagement commun à toutes les fiches : la charte de redevabilité (/transparence) exige déjà
# la déclaration de tout intérêt personnel ou familial dans une décision.
ENGAGEMENT = ("<b>Fonction bénévole.</b> La personne retenue s’engage à respecter la charte de redevabilité (lonodji.org/transparence), "
              "dont la protection des enfants, l’interdiction de l’exploitation et des abus sexuels, et la déclaration de tout intérêt personnel "
              "ou familial dans une décision, à laquelle elle ne prend alors pas part.")
ETAPES = [
    ("Candidature", "Tout membre de l’association peut candidater, par le formulaire de contact du site."),
    ("Plan d’action", "La personne retenue réunit les membres intéressés et propose un plan d’action simple."),
    ("Mise en œuvre", "La thématique — ou le pilier — agit de manière autonome au quotidien, avec l’appui des cellules transversales si besoin."),
    ("Compte-rendu", "La personne rend compte de l’avancement lors des assemblées de l’association, devant l’ensemble des membres."),
]

CSS = """
@page{size:A4;margin:16mm 16mm 18mm}
*{box-sizing:border-box}
html,body{margin:0;color:#10241e;font-family:'DM Sans',system-ui,sans-serif;font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.fiche{page-break-after:always}
.fiche:last-child{page-break-after:auto}
.tete{display:flex;justify-content:space-between;align-items:flex-start;gap:8mm;padding-bottom:4mm;border-bottom:1px solid #d5ddd6;margin-bottom:6mm}
.tete img{height:18mm;width:auto}
.tete .meta{text-align:right;font-size:8.5pt;color:#526159;line-height:1.5}
.tete .meta b{display:block;color:#10241e;font-size:9.5pt;letter-spacing:.12em;text-transform:uppercase}
.eyebrow{font-size:8.5pt;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#526159;margin:0 0 2mm}
h1{margin:0;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:22pt;line-height:1.12;letter-spacing:-.01em}
h1 small{display:block;font-family:'DM Sans',system-ui,sans-serif;font-size:11pt;font-weight:500;color:#526159;margin-top:2mm;letter-spacing:0}
.etat{display:inline-block;margin:4mm 0 0;padding:1.5mm 3.5mm;border-radius:99px;font-size:8.5pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:1px solid #d5ddd6;color:#4b5a52;background:#eef2e9}
.etat.pourvu{background:rgba(182,207,69,.28);border-color:rgba(182,207,69,.7);color:#173b2d}
h2{font-size:9pt;letter-spacing:.16em;text-transform:uppercase;color:#173b2d;margin:6mm 0 2mm;padding-top:4mm;border-top:1px solid #d5ddd6}
p{margin:0 0 2.5mm}
ul,ol{margin:0 0 2mm;padding-left:5mm}
li{margin:0 0 1.2mm}
.grille{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.carte{border:1px solid #d5ddd6;border-radius:3mm;padding:3.5mm 4mm;background:#f7f9f4;break-inside:avoid}
.carte b{display:block;font-size:10pt}
.carte span{display:block;font-size:9pt;color:#526159;margin-top:1mm}
.etapes{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}
.etapes div{border-top:2px solid #b6cf45;padding-top:2mm}
.etapes b{display:block;font-size:9.5pt}
.etapes span{display:block;font-size:8.5pt;color:#526159;line-height:1.45;margin-top:1mm}
.nomenclature{font-size:9.5pt;color:#53625b;margin:0 0 6pt}.nomenclature b{font-weight:600;color:#3c4a44}
.odd{display:flex;flex-wrap:wrap;gap:2mm}
.odd span{display:inline-block;padding:1mm 2.5mm;border-radius:2mm;font-size:8.5pt;font-weight:700;color:#fff}
.candidater{margin-top:6mm;padding:4mm 5mm;border-radius:3mm;background:#173b2d;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:6mm;break-inside:avoid}
.candidater b{display:block;font-size:11pt}
.candidater span{display:block;font-size:9pt;color:#dce6dc;margin-top:1mm}
.candidater code{font-family:ui-monospace,Menlo,Consolas,monospace;color:#f2c94c;font-size:9pt}
.engagement{margin-top:5mm;padding:3mm 4mm;border-left:2px solid #b6cf45;background:#f7f9f4;font-size:9pt;break-inside:avoid}
.pied{margin-top:6mm;font-size:8pt;color:#607069;line-height:1.5}
"""


def strip(t: str) -> str:
    return re.sub(r"\s+", " ", h.unescape(re.sub(r"<[^>]+>", " ", t))).strip()


def entete(logo: str, jour: str, kind: str) -> str:
    return f'<div class="tete"><img src="{logo}" alt="ADEB LONODJI"><div class="meta"><b>Fiche de mission</b>{kind}<br>Association de Développement et d’Entraide de Bédjondo<br>État du site au {jour} · lonodji.org/programmes</div></div>'


def etapes_html() -> str:
    return '<div class="etapes">' + "".join(f"<div><b>{i + 1}. {t}</b><span>{x}</span></div>" for i, (t, x) in enumerate(ETAPES)) + "</div>"


def candidater(url: str, texte: str) -> str:
    return f'<div class="candidater"><div><b>{texte}</b><span>Formulaire de contact du site, choix pré-rempli : <code>{url}</code><br>Ou par téléphone et WhatsApp : {TEL}</span></div></div>'


def fiche_direction(pole: dict, logo: str, jour: str) -> str:
    d = pole["direction"]
    pourvu = d["filled"]
    them = "".join(f'<div class="carte"><b>{t["number"]} · {h.escape(t["name"])}</b><span>{"Coordination : " + h.escape(t["coordinator"]) if t["filled"] else "Coordination à pourvoir"}</span></div>' for t in pole["items"])
    url = f"{SITE}/participer?direction={pole['roman']}&coordo=1"
    return f"""<section class="fiche">{entete(logo, jour, "Vice-présidence de pilier · fonction élue · Pillar Vice-President")}
<p class="eyebrow">Pilier {pole['roman']} · {len(pole['items'])} thématiques</p>
<h1>Vice-présidence du pilier {pole['roman']} — {h.escape(pole['name'])}<small>Vice-président délégué ou vice-présidente déléguée, pourvu par élection — en anglais : Pillar Vice-President</small></h1>
<span class="etat{' pourvu' if pourvu else ''}">{'Pourvue : ' + h.escape(d['name']) if pourvu else 'À pourvoir'}</span>
<h2>Ce que fait la vice-présidence du pilier</h2>
<p>Le vice-président délégué ou la vice-présidente déléguée :</p>
<ul>{''.join(f'<li>{x}</li>' for x in DIRECTION_FAIT)}</ul>
<p>{DIRECTION_NOTE}</p>
<h2>Le périmètre : les thématiques du pilier</h2>
<div class="grille">{them}</div>
<h2>Comment cela se passe</h2>
{etapes_html()}
<p class="engagement">{ENGAGEMENT}</p>
{candidater(url, "Se porter candidat à la vice-présidence du pilier " + pole['roman'])}
<p class="pied">Sources : architecture institutionnelle du 6 octobre 2026 (lonodji.org/association/architecture), page Nos actions (lonodji.org/programmes), décisions d’organisation du 1er octobre 2026 (lonodji.org/association/propositions-organisation), article du 28 septembre 2026 sur les anciennes directions de pôle, page Mission (comment l’association est organisée). Les coordinations indiquées sont celles publiées sur le site à la date de la fiche ; les nominations sont publiées, datées, dans le journal.</p>
</section>"""


def nomenclature_html(t: dict) -> str:
    """Ligne « CAD · cluster · ODD · anciennement » (content/nomenclature.json, 5 octobre 2026)."""
    if t.get("kind") != "thematique":
        return ""
    data = json.loads((ROOT / "content" / "nomenclature.json").read_text(encoding="utf-8"))
    n = next((x for x in data["thematiques"] if x["num"] == t["number"]), None)
    if not n:
        return ""
    parts = [f"<b>Secteur CAD (OCDE)</b> {', '.join(n['cad'])}"]
    if n.get("cluster"):
        parts.append(f"<b>Cluster</b> {h.escape(n['cluster'])}")
    parts.append(f"<b>ODD</b> {', '.join(n['odd'])}")
    parts.append(f"<i>anciennement « {h.escape(n['ancien'])} »</i>")
    return '<p class="nomenclature">' + " · ".join(parts) + "</p>"


def fiche_coordination(t: dict, pole: dict | None, logo: str, jour: str, cellule: bool = False) -> str:
    pourvu = t["filled"]
    odd = "".join(f'<span style="background:{o["accent"]};color:{o["ink"]}">ODD {o["num"]} · {h.escape(o["name"])} · {h.escape(o["cible"])}</span>' for o in t.get("odd", []))
    liens = "".join(f"<li>{h.escape(strip(l['label']).rstrip(' →'))} — lonodji.org{l['href'].split('#')[0]}</li>" for l in t.get("links", []) if not l["href"].startswith("/participer"))
    if cellule:
        url = f"{SITE}/participer#contact"
        kind, eyebrow, titre, sous = "Cellule transversale", "Cellule transversale · appui à toutes les thématiques", f"Cellule {h.escape(t['name'])}", "Coordonnateur ou coordonnatrice de la cellule"
        direction = "<p>Les deux cellules transversales — Financement &amp; ressources, Communication &amp; numérique — appuient chacune des vingt-deux thématiques et les six piliers.</p>"
    else:
        assert pole
        url = f"{SITE}/participer?theme={t['number']}&coordo=1"
        kind, eyebrow, titre, sous = "Coordination de thématique", f"Pilier {pole['roman']} · {h.escape(pole['name'])} · thématique {t['number']}", f"Coordination de la thématique {t['number']} — {h.escape(t['name'])}", "Coordonnateur ou coordonnatrice de thématique"
        d = pole["direction"]
        direction = f"<p>La thématique relève du pilier {pole['roman']} ({h.escape(pole['name'])}), dont la vice-présidence est {('assurée par ' + h.escape(d['name'])) if d['filled'] else 'à pourvoir, par élection'}.</p>" + ("<p><b>Thématique prioritaire</b> depuis le 1er octobre 2026 : un titulaire et un adjoint ; l’adjoint est à trouver (lonodji.org/participer).</p>" if t['id'] in PRIORITAIRES else "")
    return f"""<section class="fiche">{entete(logo, jour, kind)}
<p class="eyebrow">{eyebrow}</p>
<h1>{titre}<small>{sous}</small></h1>
<span class="etat{' pourvu' if pourvu else ''}">{'Pourvue : ' + h.escape(t['coordinator']) if pourvu else 'À pourvoir'}</span>
<h2>La thématique</h2>
{nomenclature_html(t)}
<p>{h.escape(t['descriptionText'])}</p>
{('<p class="odd">' + odd + '</p>') if odd else ''}
{direction}
<h2>Ce que fait la coordination</h2>
<p>Le coordonnateur ou la coordonnatrice :</p>
<ul>{''.join(f'<li>{x}</li>' for x in COORDINATION_FAIT)}</ul>
<p>{COORDINATION_NOTE}</p>
{('<h2>Sur le site</h2><ul>' + liens + '</ul>') if liens else ''}
<h2>Comment cela se passe</h2>
{etapes_html()}
<p class="engagement">{ENGAGEMENT}</p>
{candidater(url, "Candidater à la coordination" + ("" if cellule else " de la thématique " + t['number']))}
<p class="pied">Sources : architecture institutionnelle du 6 octobre 2026 (lonodji.org/association/architecture), page Nos actions (lonodji.org/programmes), page Mission (comment l’association est organisée), page Participer. La description de la thématique est celle publiée sur le site à la date de la fiche ; les nominations sont publiées, datées, dans le journal.</p>
</section>"""


def main() -> None:
    from playwright.sync_api import sync_playwright

    d = json.loads((ROOT / "content" / "index.json").read_text(encoding="utf-8"))
    s = d["structure"]
    fonts = og.font_faces()
    logo = "data:image/png;base64," + base64.b64encode(LOGO.read_bytes()).decode()
    auj = date.today()
    jour = f"{'1er' if auj.day == 1 else auj.day} {MOIS[auj.month - 1]} {auj.year}"
    OUT.mkdir(parents=True, exist_ok=True)
    fiches: list[tuple[str, str]] = []
    for p in s["poles"]:
        fiches.append((f"fiche-mission-direction-{p['id']}.pdf", fiche_direction(p, logo, jour)))
    for p in s["poles"]:
        for t in p["items"]:
            fiches.append((f"fiche-mission-coordination-{t['id']}.pdf", fiche_coordination(t, p, logo, jour)))
    for t in s["cellules"]["items"]:
        fiches.append((f"fiche-mission-{t['id']}.pdf", fiche_coordination(t, None, logo, jour, cellule=True)))
    page_html = lambda corps: f'<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{CSS}</style><body>{corps}</body></html>'
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        for nom, corps in fiches:
            pg.set_content(page_html(corps), wait_until="load")
            pg.evaluate("document.fonts.ready")
            pg.pdf(path=str(OUT / nom), format="A4", print_background=True, prefer_css_page_size=True)
        pg.set_content(page_html("".join(c for _, c in fiches)), wait_until="load")
        pg.evaluate("document.fonts.ready")
        pg.pdf(path=str(OUT / "fiches-de-mission-adeb-lonodji.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
        b.close()
    index = {
        "genere": auj.isoformat(),
        "recueil": "/missions/fiches-de-mission-adeb-lonodji.pdf",
        "directions": [{"pole": p["id"], "roman": p["roman"], "nom": p["name"], "pourvue": p["direction"]["filled"], "qui": p["direction"]["name"], "pdf": f"/missions/fiche-mission-direction-{p['id']}.pdf", "thematiques": len(p["items"])} for p in s["poles"]],
        "coordinations": [{"id": t["id"], "numero": t["number"], "nom": t["name"], "pole": p["roman"], "poleNom": p["name"], "pourvue": t["filled"], "qui": t["coordinator"], "pdf": f"/missions/fiche-mission-coordination-{t['id']}.pdf"} for p in s["poles"] for t in p["items"]],
        "cellules": [{"id": t["id"], "nom": t["name"], "pourvue": t["filled"], "qui": t["coordinator"], "pdf": f"/missions/fiche-mission-{t['id']}.pdf"} for t in s["cellules"]["items"]],
    }
    (ROOT / "content" / "missions.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    taille = sum(f.stat().st_size for f in OUT.glob("*.pdf"))
    print(f"{len(fiches)} fiches + recueil dans {OUT.relative_to(ROOT)} ({taille // 1024} Ko) ; content/missions.json")


if __name__ == "__main__":
    sys.exit(main())
