#!/usr/bin/env python3
"""Visuels du kit de mobilisation (public/kit/visuel-*.png, 1080 × 1080), à poster avec les messages de
/participer/kit-mobilisation sur WhatsApp, Facebook ou Instagram.

L'import de l'ancien site recopie dans public/kit les visuels de septembre 2026 (ancien logo bleu, « 19
thématiques », anciens résumés des plaidoyers). Ce script les remplace par des visuels dans la charte actuelle
(même gabarit que scripts/build-visuels.py), dont les faits sont ceux des dossiers à jour et dont les chiffres sont
lus dans content/. À lancer après chaque import (pipeline) ; mêmes noms de fichiers, donc mêmes liens.

    python3 scripts/build-kit-visuels.py
"""
from __future__ import annotations

import importlib.util
import json
from datetime import date
from pathlib import Path

_spec = importlib.util.spec_from_file_location("build_visuels", Path(__file__).resolve().parent / "build-visuels.py")
_v = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_v)

ROOT = _v.ROOT
OUT = ROOT / "public" / "kit"
CONTENT = ROOT / "content"


def visuels() -> list[dict]:
    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    them = [t for p in idx["structure"]["poles"] for t in p["items"]]
    vacantes = sum(1 for t in them if not t["filled"])
    poles = len(idx["structure"]["poles"])
    dossiers = len(idx["plaidoyers"])
    lettres = {4: "quatre", 8: "huit"}
    plaidoyer = "lonodji.org/actions"
    # titres = ceux des cartes du kit (h3 et texte alternatif de l'image) ; lignes = faits des dossiers à jour
    return [
        {"nom": "visuel-adeb-lonodji", "eyebrow": "Association · Bédjondo · diaspora",
         "titre": "ADEB LONODJI <em>rassemble Bédjondo et sa diaspora</em>",
         "lignes": [f"{poles} pôles · {len(them)} thématiques", f"{lettres.get(dossiers, dossiers)} dossiers de plaidoyer publiés".capitalize(),
                    "Courage · Discipline · Héritage"],
         "url": "lonodji.org"},
        {"nom": "visuel-internet", "eyebrow": "Plaidoyer · haut débit",
         "titre": "Bédjondo a droit <em>au haut débit</em>",
         "lignes": ["Réseau lent, données trop chères, aucun point d’accès public", "Ministère, ARCEP, opérateurs et Starlink Tchad",
                    "Connecter notre ville"], "url": plaidoyer},
        {"nom": "visuel-electricite", "eyebrow": "Plaidoyer · électricité",
         "titre": "De la lumière <em>pour Bédjondo</em>",
         "lignes": ["6 % d’accès à l’électricité au Tchad, 1 à 2 % en zone rurale", "Inscrire Bédjondo au PAAET et à la Mission 300",
                    "Éclairer le marché en solaire, avec la diaspora"], "url": plaidoyer},
        {"nom": "visuel-eau", "eyebrow": "Plaidoyer · eau potable",
         "titre": "De l’eau potable <em>pour chaque quartier</em>",
         "lignes": ["Un château d’eau qui ne dessert qu’un village", "Solariser le pompage, étendre le réseau à la ville",
                    "Des comités de gestion"], "url": plaidoyer},
        {"nom": "visuel-sante", "eyebrow": "Plaidoyer · santé",
         "titre": "Soigner à Bédjondo, <em>pas seulement à Koumra</em>",
         "lignes": ["Au Tchad, près d’une naissance sur cent coûte la vie à la mère", "Une sage-femme, un laboratoire, une chaîne du froid",
                    "Une ambulance et un protocole d’évacuation"], "url": plaidoyer},
        {"nom": "visuel-routes", "eyebrow": "Plaidoyer · voirie et ponts",
         "titre": "Désenclaver <em>Bédjondo</em>",
         "lignes": ["Une ville desservie par la nationale, sans rues ni caniveaux", "Le pont de l’axe Bédjondo–Békamba, demandé depuis 2023",
                    "Le pont de Hoblo, et des pistes pour nos cantons"], "url": plaidoyer},
        {"nom": "visuel-education", "eyebrow": "Plaidoyer · éducation",
         "titre": "Une école <em>à la hauteur de nos enfants</em>",
         "lignes": ["Au Tchad, 73 élèves par maître, des classes de 83", "Des enseignants, des salles en dur avec eau et latrines",
                    "Un lycée équipé, la relève du ProQEB"], "url": plaidoyer},
        {"nom": "visuel-besoins", "eyebrow": "Carte des besoins",
         "titre": "Où l’eau manque-t-elle <em>chez vous ?</em>",
         "lignes": ["Signalez le besoin de votre quartier ou de votre village", "En deux minutes, sur la carte des besoins",
                    "Chaque signalement sera remis à la commune"], "url": "lonodji.org/territoire/besoins"},
        {"nom": "visuel-rejoindre", "eyebrow": "Rejoindre ADEB LONODJI",
         "titre": "Filles et fils de Bédjondo, <em>rejoignez-nous</em>",
         "lignes": [f"{_v.EN_LETTRES.get(vacantes, str(vacantes))} thématiques sur {len(them)} cherchent encore un coordonnateur",
                    "Votre temps, vos compétences, votre voix", "Au Tchad comme dans la diaspora"], "url": "lonodji.org/participer"},
    ]


def main() -> None:
    from playwright.sync_api import sync_playwright
    from PIL import Image

    OUT.mkdir(parents=True, exist_ok=True)
    fonts = _v.font_faces()
    tmp = ROOT / ".next" / "kit-tmp.html"
    tmp.parent.mkdir(exist_ok=True)
    mois = f"{_v.MOIS[date.today().month - 1]} {date.today().year}"
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={"width": 1080, "height": 1080}, device_scale_factor=1)
        for v in visuels():
            brut = len(v["titre"].replace("<em>", "").replace("</em>", ""))
            size = 76 if brut < 40 else 66 if brut < 60 else 58
            html = _v.TEMPLATE.format(mois=mois, fonts=fonts, logo=_v.LOGO, eyebrow=_v.esc(v["eyebrow"]), titre=v["titre"],
                                      lignes="".join(f"<li>{_v.esc(l)}</li>" for l in v["lignes"]), url=_v.esc(v["url"]), size=size,
                                      classe="", odeb="")
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")
            page.wait_for_timeout(150)
            dest = OUT / f"{v['nom']}.png"
            page.screenshot(path=str(dest), type="png")
            _v.alleger(dest)
            print(f"public/kit/{v['nom']}.png")
        b.close()
    tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
