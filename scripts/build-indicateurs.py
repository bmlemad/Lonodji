#!/usr/bin/env python3
"""Génère content/indicateurs.json : les chiffres du tableau de bord d'impact.

Trois familles de chiffres, chacune avec sa source et sa date :
- « contenu » : compté dans content/ et public/carte au moment de la génération
  (plaidoyers, coordinations, articles, documents, corrections, engagements,
  problématiques du diagnostic, localités et équipements cartographiés, projets).
- « formulaires » : ce que le site a reçu par ses formulaires Netlify. Sans jeton
  d'accès, le script fige le dernier relevé manuel (RELEVE ci-dessous) ; avec
  NETLIFY_FORMS_TOKEN dans l'environnement, il interroge l'API et met le relevé à
  jour. Seuls des comptes sortent d'ici : jamais un nom, un courriel, un message.
- « bureau » : les chiffres que seule l'association détient (adhérents à jour de
  cotisation, besoins résolus). Ils restent « non publiés » tant que le bureau
  ne les a pas transmis avec leur date ; le site ne les invente pas.

Usage : python3 scripts/build-indicateurs.py
        NETLIFY_FORMS_TOKEN=... python3 scripts/build-indicateurs.py   (relevé en direct)
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = CONTENT / "indicateurs.json"
SITE_ID = "17ccf3c4-041d-471c-93c5-87730d0b8106"

# Dernier relevé manuel des formulaires (console Netlify, envois de test retirés).
RELEVE = {
    "date": "2026-09-28",
    "methode": "Console Netlify Forms, après retrait des six envois de test des 20 et 21 septembre. Les intentions d’adhésion sont comptées par personne (un même courriel envoyé plusieurs fois compte une fois).",
    "comptes": {
        "intention-adhesion": {"envois": 3, "personnes": 2},
        "signalement-besoin": {"envois": 0},
        "soutien-plaidoyer": {"envois": 0},
        "promesse-contribution": {"envois": 0},
        "proposition-article": {"envois": 0},
        "lettre-info": {"envois": 0},
        "temoignage-lignee": {"envois": 0},
        "lieu-sacre": {"envois": 0},
        "mesure-debit": {"envois": 0},
        "diaspora-competences": {"envois": 0},
        "temoignage": {"envois": 0},
        "depot-document": {"envois": 0},
        "mot-nangnda": {"envois": 0},
        "proposition-projet": {"envois": 0},
    },
}
# Les deux formulaires d'abonnement (corps de page et pied de page) comptent ensemble.
FUSIONS = {"lettre-info-pied": "lettre-info"}
# Jamais comptés, comme les mentions légales le promettent : contact, message en
# anglais, personnes handicapées, veuves, plaintes.
JAMAIS_COMPTES = {"contact", "message-en", "handicap", "veuves", "plainte"}

# Projets suivis par le site et leur stade — un jugement éditorial, tenu à jour ici
# plutôt que deviné dans le texte des pages.
# Projets : content/projets.json (plateforme de projets, /projets) — une entrée par projet, à tenir à jour à la main.
_PROJETS_JSON = json.loads((CONTENT / "projets.json").read_text("utf8"))
PROJETS = [{k: p[k] for k in ("slug", "nom", "stade", "libelle", "route")} for p in _PROJETS_JSON["projets"]]
STADES_ACTIFS = {"essai", "realisation", "service"}


def page(slug: str) -> dict:
    return json.loads((CONTENT / "pages" / f"{slug}.json").read_text("utf8"))


def compter_contenu() -> dict:
    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    carte = json.loads((ROOT / "public" / "carte" / "donnees.json").read_text("utf8"))

    plaidoyers = idx["plaidoyers"]
    envoyes = [p for p in plaidoyers if not re.search(r"à envoyer", p["sent"], re.I)]
    repondus = [p for p in plaidoyers if p["answer"].strip() not in ("", "—", "-")]

    poles = idx["structure"]["poles"]
    thematiques = [t for p in poles for t in p["items"]]
    cellules = idx["structure"]["cellules"]["items"]

    redev = page("redevabilite")
    corrections_html = next((s["html"] for s in redev["sections"] if s.get("id") == "corrections"), "")
    corrections = len(re.findall(r'class="info-card"', corrections_html))

    engagements = page("engagements")
    eng_html = " ".join(s.get("html", "") for s in engagements["sections"])
    nb_engagements = len(re.findall(r'class="info-card"', eng_html))
    eng_realises = 0  # la page l'écrit elle-même : aucun n'est confirmé réalisé
    for pill in engagements.get("pills", []):
        m = re.match(r"(\d+)\s+confirmé", pill)
        if m:
            eng_realises = int(m.group(1))

    diag = page("problematiques")
    diag_html = " ".join(s.get("html", "") for s in diag["sections"])
    statuts = {k: len(re.findall(r">\s*" + k + r"\s*<", diag_html)) for k in ("Documenté", "Partiel", "Inconnu")}
    total_pb = None
    for pill in diag.get("pills", []):
        m = re.match(r"(\d+)\s+problématiques", pill)
        if m:
            total_pb = int(m.group(1))
    if total_pb is None:
        total_pb = sum(statuts.values())
    chantiers = 0
    for pill in diag.get("pills", []):
        m = re.match(r"(\d+)\s+priorités", pill)
        if m:
            chantiers = int(m.group(1))

    documents = idx["documents"]
    pdf = [d for d in documents if d.get("pdf")]
    # + les PDF produits hors de l'ancien site (livre blanc du projet ODEB, public/odeb/)
    pdf_site = sorted((ROOT / "public" / "odeb").glob("*.pdf")) if (ROOT / "public" / "odeb").exists() else []
    # + les recueils listés sur /documents (fiches de mission, affiche générale), comptés une fois chacun
    pdf_site += [f for f in (ROOT / "public" / "missions" / "fiches-de-mission-adeb-lonodji.pdf", ROOT / "public" / "carte" / "affiches" / "affiche-villages.pdf") if f.exists()]

    return {
        "plaidoyers": {"publies": len(plaidoyers), "envoyes": len(envoyes), "reponses": len(repondus)},
        "coordinations": {"pourvues": sum(1 for t in thematiques if t["filled"]), "total": len(thematiques), "cellulesPourvues": sum(1 for c in cellules if c["filled"]), "cellulesTotal": len(cellules)},
        "articles": len(idx["articles"]),
        "premierArticle": min(a["date"] for a in idx["articles"]) if idx["articles"] else None,
        "documentsPdf": len(pdf) + len(pdf_site),
        "documentsAnnonces": len(documents) - len(pdf),
        "corrections": corrections,
        "engagements": {"total": nb_engagements, "realises": eng_realises},
        "problematiques": {"total": total_pb, "documentees": statuts["Documenté"], "partielles": statuts["Partiel"], "inconnues": statuts["Inconnu"], "chantiersPrioritaires": chantiers},
        "carte": {"unites": len(carte["unites"]), "localites": len(carte["villages"]), "localitesNommees": sum(1 for v in carte["villages"] if v[2]), "equipements": len(carte["equipements"]), "genere": carte["genere"]},
        "pages": len(idx["pages"]),
        "projets": {"actifs": sum(1 for p in PROJETS if p["stade"] in STADES_ACTIFS), "annonces": sum(1 for p in PROJETS if p["stade"] not in STADES_ACTIFS), "finances": 0, "liste": PROJETS},
    }


def releve_en_direct(jeton: str) -> dict | None:
    """Relit les compteurs sur l'API Netlify. Ne conserve que des nombres."""
    def get(url: str):
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {jeton}", "User-Agent": "lonodji-indicateurs"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode("utf8"))

    try:
        forms = get(f"https://api.netlify.com/api/v1/sites/{SITE_ID}/forms")
    except Exception as e:  # réseau coupé, jeton invalide : on garde le relevé manuel
        print(f"relevé en direct impossible ({e}) ; relevé manuel conservé", file=sys.stderr)
        return None
    comptes: dict[str, dict] = {}
    for f in forms:
        nom = FUSIONS.get(f["name"], f["name"])
        if nom in JAMAIS_COMPTES:
            continue
        c = comptes.setdefault(nom, {"envois": 0})
        c["envois"] += int(f.get("submission_count") or 0)
        if nom in ("intention-adhesion", "diaspora-competences") and c["envois"]:
            try:
                subs = get(f"https://api.netlify.com/api/v1/forms/{f['id']}/submissions?per_page=100")
                cles = set()
                for s in subs:
                    d = s.get("data") or {}
                    cle = (d.get("email") or "").strip().lower() or re.sub(r"\D", "", d.get("telephone") or "") or s.get("id")
                    cles.add(cle)
                c["personnes"] = len(cles)
            except Exception as e:
                print(f"dédoublonnage impossible ({e})", file=sys.stderr)
    return {
        "date": dt.date.today().isoformat(),
        "methode": "API Netlify Forms, relevé automatique. Les intentions d’adhésion sont comptées par personne (un même courriel envoyé plusieurs fois compte une fois).",
        "comptes": comptes,
    }


def main() -> None:
    contenu = compter_contenu()
    releve = None
    jeton = os.environ.get("NETLIFY_FORMS_TOKEN")
    if jeton:
        releve = releve_en_direct(jeton)
    releve = releve or RELEVE
    data = {
        "genere": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "contenu": contenu,
        "formulaires": releve,
        "bureau": {
            "adherents": None,
            "besoinsResolus": 0,
            "note": "Le nombre d'adhérents à jour de cotisation est tenu par le bureau ; il paraîtra ici, daté, dès sa première transmission. Aucun besoin recensé n'est à ce jour confirmé résolu.",
        },
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", "utf8")
    c = contenu
    print(f"{OUT.relative_to(ROOT)} : {c['plaidoyers']['publies']} plaidoyers ({c['plaidoyers']['envoyes']} envoyés), "
          f"{c['coordinations']['pourvues']}/{c['coordinations']['total']} coordinations, {c['articles']} articles, "
          f"{c['documentsPdf']} PDF, {c['corrections']} corrections, {c['engagements']['total']} engagements, "
          f"{c['problematiques']['total']} problématiques, {c['carte']['localites']} localités, {c['carte']['equipements']} équipements, "
          f"projets {c['projets']['actifs']} actif(s) / {c['projets']['annonces']} annoncé(s) ; "
          f"formulaires relevés le {releve['date']} : {releve['comptes'].get('intention-adhesion', {})}")


if __name__ == "__main__":
    main()
