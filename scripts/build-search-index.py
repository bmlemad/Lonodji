#!/usr/bin/env python3
"""Génère public/search-index.json à partir du contenu importé (content/).

Chaque entrée : t (titre), r (route), k (type), d (description courte), x (texte brut, tronqué).
Usage : python3 scripts/build-search-index.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "public" / "search-index.json"
MAX_TEXT = 3500

KIND_LABEL = {"hub": "Page", "dossier": "Dossier", "en": "In English", "article": "Article"}
HUB_TITLES = {
    "mission": "Notre mission", "poles": "Nos actions : quatre pôles, dix-neuf thématiques", "plaidoyers": "Plaidoyers & engagements",
    "suivi": "Suivi & tableau de bord", "contact": "Participer : nous écrire", "adherer": "Adhérer et cotiser", "soutenir": "Nous soutenir",
    "redevabilite": "Redevabilité & transparence", "mentions-legales": "Mentions légales & confidentialité", "figures": "Histoire : grandes figures",
    "documents": "Documents à télécharger", "actualites": "Le journal",
}


def plain(html: str) -> str:
    html = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", html, flags=re.S)
    html = re.sub(r"<[^>]+>", " ", html)
    html = html.replace("&nbsp;", " ").replace("&amp;", "&").replace("&rsquo;", "’").replace("&eacute;", "é").replace("&egrave;", "è")
    html = re.sub(r"&#?\w+;", " ", html)
    return re.sub(r"\s+", " ", html).strip()


entries = []
idx = json.load(open(CONTENT / "index.json", encoding="utf-8"))

for f in sorted((CONTENT / "pages").glob("*.json")):
    d = json.load(open(f, encoding="utf-8"))
    text = plain(" ".join(s["html"] for s in d["sections"]))
    route = d["route"]
    if d["kind"] == "hub":
        route = {"contact": "/participer#contact", "adherer": "/participer#adherer", "soutenir": "/participer#soutenir"}.get(d["slug"], route)
    entries.append({
        "t": HUB_TITLES.get(d["slug"], d["title"]) if d["kind"] == "hub" else d["title"],
        "r": route,
        "k": KIND_LABEL.get(d["kind"], "Page"),
        "d": d.get("lede") or d.get("description") or "",
        "x": text[:MAX_TEXT],
    })

# Pages conçues hors de l'ancien site (app/…), sans JSON dans content/
PAGES_SITE = [
    {"t": "Carte du territoire bedjond", "r": "/carte", "k": "Page",
     "d": "Les quatorze unités du pays bedjond, leurs localités et équipements connus des données ouvertes ; une fiche par lieu, un bouton pour signaler un besoin.",
     "x": "carte interactive territoire pays bedjond Mandoul Occidental cantons sous-préfectures villages localités écoles centres de santé forages marchés OpenStreetMap signaler un besoin Bédjondo Bébopen Bédaya Bessada Koumra Moïssala Logone Oriental Moyen-Chari diaspora agricole"},
    {"t": "Répertoire des compétences de la diaspora", "r": "/diaspora", "k": "Page",
     "d": "Médecins, enseignants, ingénieurs, juristes, entrepreneurs, informaticiens : inscrire ses compétences pour qu’une thématique ou un plaidoyer trouve la personne qui sait.",
     "x": "diaspora répertoire compétences inscription médecin enseignant ingénieur juriste entrepreneur informaticien mentorat mission formation à distance réseau d’experts pays de résidence N’Djamena Paris Montréal annuaire données protégées retrait"},
    {"t": "Tableau de bord d’impact", "r": "/impact", "k": "Page",
     "d": "Adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets actifs : six indicateurs datés et sourcés, puis ce que le site produit et reçoit.",
     "x": "tableau de bord impact indicateurs adhérents coordonnateurs plaidoyers besoins recensés résolus projets actifs compteurs formulaires règle de preuve chiffres datés sourcés"},
]
entries.extend(PAGES_SITE)

for f in sorted((CONTENT / "articles").glob("*.json")):
    d = json.load(open(f, encoding="utf-8"))
    text = plain(" ".join(s["html"] for s in d["sections"]))
    entries.append({
        "t": d["title"], "r": d["route"], "k": "Article", "d": d.get("summary") or d.get("description") or "",
        "x": text[:MAX_TEXT], "date": d.get("dateLabel", ""), "tag": d.get("tag", ""),
    })

for pole in idx["structure"]["poles"] + ([idx["structure"]["cellules"]] if idx["structure"].get("cellules") else []):
    for t in pole["items"]:
        entries.append({
            "t": f"{'Thématique ' + t['number'] + ' — ' if t['kind'] == 'thematique' else 'Cellule — '}{t['name']}",
            "r": f"/programmes#{t['id']}", "k": "Thématique",
            "d": (("Coordination : " + t["coordinator"] + ". ") if t["filled"] else "Coordination à pourvoir. ") + " ".join(t["tags"]),
            "x": plain(t["description"])[:MAX_TEXT],
        })

for p in idx["plaidoyers"]:
    entries.append({"t": p["title"], "r": f"/actions#{p['id']}", "k": "Plaidoyer", "d": p["demand"], "x": f"{p['theme']} {p['recipients']} {p['status']} {p['published']}"})

for d in idx["documents"]:
    entries.append({"t": d["title"], "r": d["pdf"] or "/documents", "k": "Document PDF" if d["pdf"] else "Document à venir", "d": d["description"], "x": d.get("meta", "")})

OUT.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"search-index.json : {len(entries)} entrées, {OUT.stat().st_size // 1024} Ko")
