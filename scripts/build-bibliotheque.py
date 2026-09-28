#!/usr/bin/env python3
"""Bibliothèque numérique bedjond : content/bibliotheque.json.

Reclasse les références de la base de recherche (content/pages/recherche.json,
importée de l'ancien site) par rubrique documentaire, relève leurs auteurs, et
rattache les publications de l'association (documents PDF, articles du journal).
Rien n'est ajouté à la base ici : chaque entrée renvoie à sa fiche existante.

    python3 scripts/build-bibliotheque.py
"""
from __future__ import annotations

import json
import re
import unicodedata
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = CONTENT / "bibliotheque.json"

# type de source (tel qu'écrit dans la base) → rubrique
RUBRIQUES = [
    ("theses", "Thèses, mémoires et études universitaires", {"Thèse universitaire", "Étude universitaire"}),
    ("articles", "Articles et études scientifiques", {"Article scientifique", "Étude linguistique", "Étude génétique", "Étude historique", "Étude", "Synthèse"}),
    ("ouvrages", "Ouvrages, lexiques et recueils", {"Ouvrage", "Lexique", "Recueil de proverbes", "Encyclopédie"}),
    ("rapports", "Rapports d’enquête, données et sources institutionnelles", {"Rapport d’enquête", "Enquête de terrain", "Données publiques", "Source institutionnelle", "Documents institutionnels", "Centre de recherche"}),
    ("archives", "Archives, presse et ressources documentaires", {"Presse", "Presse & institutionnel", "Source secondaire", "Ressource documentaire", "Ressource communautaire"}),
]

# Chercheurs du pays bedjond (recommandation « centre de documentation », 28/09/2026) : motifs de reconnaissance dans les auteurs
CHERCHEURS = [
    ("be-rammaj-miaro-ii", "Bé-Rammaj Miaro-II", "historien ; coordonnateur de la thématique Mémoire & héritage", r"miaro"),
    ("john-m-keegan", "John M. Keegan", "linguiste, Sara Bagirmi Language Project (Morkeg Books)", r"keegan"),
    ("roger-dinguemrebeye", "Roger Dinguemrebeye", "linguiste-traducteur, co-auteur du Lexique Nangnda", r"dinguemrebeye"),
    ("eric-c-johnson", "Eric C. Johnson", "SIL International, enquête sociolinguistique de la région de Doba", r"johnson"),
    ("djarangar-djita-issa", "Djarangar Djita Issa", "linguiste, professeur titulaire, École normale supérieure de Bongor", r"djarangar"),
    ("yaphete-madjirade", "Yaphete Madjiradé", "coordonnateur de la thématique Culture & patrimoine vivant", r"madjira[bd]"),
    ("service-alladoum", "Service Alladoum", "linguistique du nangnda (travaux à référencer)", r"alladoum"),
    ("masnan-beoss", "Masnan Béoss", "historien, ACAREF", r"b[eé]oss"),
    ("kosmadji-merci", "Kosmadji Merci", "travaux à référencer", r"kosmadji"),
]


def plain(html: str) -> str:
    t = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", unescape(t)).strip()


def sans_accents(t: str) -> str:
    t = unicodedata.normalize("NFKD", t)
    return "".join(ch for ch in t if not unicodedata.combining(ch)).lower()


def main() -> None:
    page = json.loads((CONTENT / "pages" / "recherche.json").read_text("utf8"))
    html = " ".join(s["html"] for s in page["sections"])
    cartes = re.findall(r'<article class="source-card" data-cat="([^"]+)" id="([^"]+)">(.*?)</article>', html, re.S)
    references = []
    for cat, sid, corps in cartes:
        corps = re.sub(r"<button.*?</button>", "", corps, flags=re.S)
        titre = plain(re.search(r"<h3>(.*?)</h3>", corps, re.S).group(1))
        typ = plain(re.search(r'source-type">(.*?)</span>', corps, re.S).group(1))
        meta_html = re.search(r'source-meta">(.*?)</p>', corps, re.S)
        meta = plain(meta_html.group(1)) if meta_html else ""
        auteurs = meta.split(" — ")[0].split(" · ")[0].strip()
        paras = [plain(p) for p in re.findall(r"<p(?![^>]*class=\"source-meta\")[^>]*>(.*?)</p>", corps, re.S)]
        resume = next((p for p in paras if p and not p.startswith("Ce que nous ne savons")), "")
        liens = [u for u in re.findall(r'href="(https?://[^"]+)"', corps)]
        rubrique = next((r[0] for r in RUBRIQUES if typ in r[2]), "archives")
        references.append({
            "id": sid, "cat": cat, "type": typ, "rubrique": rubrique, "titre": titre, "auteurs": auteurs, "meta": meta,
            "resume": resume[:320] + ("…" if len(resume) > 320 else ""), "liens": liens[:2], "route": f"/dossiers/recherche#{sid}",
        })

    chercheurs = []
    for cid, nom, role, motif in CHERCHEURS:
        oeuvres = [r["id"] for r in references if re.search(motif, sans_accents(r["auteurs"] + " " + r["meta"]))]
        chercheurs.append({"id": cid, "nom": nom, "role": role, "references": oeuvres})

    # tous les auteurs de la base (pour la liste complète), regroupés par nom d'auteur tel qu'écrit
    auteurs: dict[str, list[str]] = {}
    for r in references:
        for a in re.split(r"\s*(?:&amp;|&|,|\bet\b)\s*", r["auteurs"]):
            a = a.strip()
            if len(a) < 4 or a.lower().startswith(("wikip", "étude", "etude", "article", "tchadinfos", "vatican", "inseed", "bureau", "ambassade", "sciences po", "comboni", "mars imperium", "initiative", "nature", "scielo", "morkeg")):
                continue
            auteurs.setdefault(a, []).append(r["id"])

    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    documents = [{"titre": d["title"], "pdf": d["pdf"], "description": d.get("description", ""), "meta": d.get("meta", "")} for d in idx["documents"] if d.get("pdf")]
    articles_par_rubrique: dict[str, int] = {}
    for a in idx["articles"]:
        articles_par_rubrique[a["category"]] = articles_par_rubrique.get(a["category"], 0) + 1
    rubriques_journal = {c["slug"]: c["label"] for c in idx["journalCategories"]}

    data = {
        "genere": idx.get("generatedFrom", {}).get("legacyVersion", ""),
        "rubriques": [{"id": r[0], "titre": r[1], "references": [x["id"] for x in references if x["rubrique"] == r[0]]} for r in RUBRIQUES],
        "references": references,
        "chercheurs": chercheurs,
        "auteurs": sorted(({"nom": k, "references": v} for k, v in auteurs.items()), key=lambda a: sans_accents(a["nom"])),
        "documents": documents,
        "journal": [{"slug": s, "label": rubriques_journal.get(s, s), "articles": n} for s, n in sorted(articles_par_rubrique.items(), key=lambda t: -t[1])],
        "totalArticles": len(idx["articles"]),
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", "utf8")
    print(f"{OUT.relative_to(ROOT)} : {len(references)} références, {sum(1 for c in chercheurs if c['references'])}/{len(chercheurs)} chercheurs avec des œuvres référencées, "
          f"{len(auteurs)} auteurs, {len(documents)} PDF, {len(idx['articles'])} articles")


if __name__ == "__main__":
    main()
