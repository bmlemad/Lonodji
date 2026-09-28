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
    {"t": "Racontez Bédjondo : témoignages et banque d’images", "r": "/temoignages", "k": "Page",
     "d": "Un ancien qui raconte, une femme qui fait bouger les choses, un jeune talent, un paysage, les forums de 2000 et 2003 : envoyez votre récit, votre photo ou votre enregistrement.",
     "x": "témoignages récits photos banque d’images portraits des anciens femmes leaders jeunes talents paysages de Bédjondo activités de terrain archives forums 2000 2003 enregistrement audio vidéo consentement mineurs relecture crédit photo patrimoine vivant storytelling"},
    {"t": "Les villages du pays bedjond : une fiche par localité", "r": "/villages", "k": "Page",
     "d": "Retrouvez votre village, votre quartier, votre canton : 966 localités nommées, chacune avec ce que les données ouvertes en savent, ce que le site en dit et ce qui reste à documenter.",
     "x": "villages fiches localités hameaux bourgs villes cantons sous-préfectures retrouver son village pays bedjond Bangoul Bébopen Bédjondo Békamba Nderguigui Péni Yomi Bodo Béboto Béti Yamodo Koumogo Moussafoyo Moïssala équipements école forage centre de santé histoire habitants"},
    {"t": "Bibliothèque numérique bedjond", "r": "/bibliotheque", "k": "Page",
     "d": "Thèses, articles, ouvrages, rapports, archives et publications d’ADEB LONODJI sur le pays bedjond, les Sara et le nangnda ; les chercheurs qui les ont signés ; dépôt de document.",
     "x": "bibliothèque numérique bedjond références thèses mémoires articles scientifiques ouvrages lexiques rapports d’enquête archives presse publications ADEB chercheurs Miaro-II Keegan Dinguemrebeye Johnson Djarangar Madjiradé Alladoum Béoss Kosmadji déposer un document droits"},
    {"t": "La langue nangnda (bedjond)", "r": "/langue", "k": "Page",
     "d": "Le nangnda, langue sara du pays bedjond : nom, parenté, où on la parle, lexique en ligne avec l’audio, références, et le dictionnaire numérique qui commence par vos mots.",
     "x": "langue nangnda nangda bedjond bediondo bedjonde sara Doba bebot gor mango lexique Dinguemrebeye Keegan Kokotan SIL Johnson Djarangar proverbes dictionnaire numérique alphabet prononciation apprendre un mot"},
    {"t": "Tableau de bord d’impact", "r": "/impact", "k": "Page",
     "d": "Adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets actifs : six indicateurs datés et sourcés, puis ce que le site produit et reçoit.",
     "x": "tableau de bord impact indicateurs adhérents coordonnateurs plaidoyers besoins recensés résolus projets actifs compteurs formulaires règle de preuve chiffres datés sourcés"},
]
PAGES_SITE += [
    {"t": "Projet ODEB LONODJI — Vision 2030", "r": "/odeb", "k": "Page",
     "d": "L’Organisation pour le Développement et l’Émergence Bedjonde : un projet porté par ADEB LONODJI pour doter le pays bedjond d’un outil permanent de recherche, de documentation, de développement territorial, d’innovation, de patrimoine et de diaspora.",
     "x": "ODEB projet vision 2030 quarante ans 40 ans anniversaire fondations 1986 réflexion lancement organisation développement émergence bedjonde transformation institutionnelle outil permanent six missions recherche documentation développement territorial innovation préservation du patrimoine mobilisation de la diaspora pourquoi créer l’ODEB ONG conversion organisation de référence"},
    {"t": "Livre blanc du projet ODEB LONODJI", "r": "/odeb/livre-blanc", "k": "Page",
     "d": "Le document fondateur, en version de travail : d’où nous partons, pourquoi une organisation, la vision 2030, six missions, cinq programmes, principes de gouvernance et de redevabilité, ressources, feuille de route, statut du document.",
     "x": "livre blanc document fondateur ODEB version de travail préambule vision 2030 missions programmes principes gouvernance redevabilité ressources partenaires diaspora chercheurs données ouvertes feuille de route statut adoption assemblée PDF"},
    {"t": "Feuille de route 2026-2030 du projet ODEB", "r": "/odeb/feuille-de-route", "k": "Page",
     "d": "Trois phases, de la relance de 2026 à l’organisation de référence de 2030 : chaque chantier avec son état réel — réalisé, en cours, à venir, à décider.",
     "x": "feuille de route 2026 2030 phases tableau de bord dynamique cartographie communautaire espace membre registre des compétences plateforme de projets bibliothèque numérique observatoire du Mandoul Occidental patrimoine vivant multimédia académie numérique application mobile bilan plan d’action rapport annuel organisation constituée"},
    {"t": "Les cinq programmes du projet ODEB", "r": "/odeb/programmes", "k": "Page",
     "d": "Mémoire et Patrimoine, Recherche, Développement territorial, Jeunesse et Innovation, Diaspora : axes, thématiques mobilisées, coordination.",
     "x": "programmes ODEB mémoire patrimoine recherche développement territorial jeunesse innovation diaspora thématiques coordonnateurs articulation pôles"},
    {"t": "Programme Mémoire et Patrimoine (ODEB)", "r": "/odeb/programmes/memoire-patrimoine", "k": "Page",
     "d": "Histoire des peuples bedjonds, atlas patrimonial, bibliothèque numérique : ce qui existe, ce que le programme construira.",
     "x": "programme mémoire patrimoine histoire des peuples bedjonds manuscrit atlas patrimonial lieux sacrés sépultures généalogies bibliothèque numérique bibliothèque orale musée numérique dictionnaire nangnda"},
    {"t": "Programme Recherche (ODEB)", "r": "/odeb/programmes/recherche", "k": "Page",
     "d": "Centre de documentation, base scientifique, publications : ce qui existe, ce que le programme construira.",
     "x": "programme recherche centre de documentation institut numérique du patrimoine bedjond base scientifique données ouvertes publications rapport annuel cahiers de recherche chercheurs"},
    {"t": "Programme Développement territorial (ODEB)", "r": "/odeb/programmes/developpement-territorial", "k": "Page",
     "d": "Observatoire, données, diagnostics : ce qui existe, ce que le programme construira.",
     "x": "programme développement territorial observatoire du Mandoul Occidental données équipements diagnostics problématiques plaidoyers besoins signalés résolus unités"},
    {"t": "Programme Jeunesse et Innovation (ODEB)", "r": "/odeb/programmes/jeunesse-innovation", "k": "Page",
     "d": "Académie numérique, intelligence artificielle, compétences : ce qui existe, ce que le programme construira.",
     "x": "programme jeunesse innovation académie numérique espace numérique communautaire intelligence artificielle IA données compétences mentorat formation à distance jeunes"},
    {"t": "Programme Diaspora (ODEB)", "r": "/odeb/programmes/diaspora", "k": "Page",
     "d": "Experts, investissements, mentorat : ce qui existe, ce que le programme construira.",
     "x": "programme diaspora experts répertoire des compétences réseau annuaire investissements compte bancaire projets financés mentorat jeunes"},
]
PAGES_SITE.append({"t": "Plateforme de projets", "r": "/projets", "k": "Page",
     "d": "Espace numérique communautaire, application pour téléphone, complexe sportif, Air Bedjondo : chaque projet avec son stade, ce qui existe, ce qui manque, son budget et comment contribuer ; proposer un projet.",
     "x": "projets plateforme stade idée étude annoncé souscription financé réalisation essai service espace numérique application complexe sportif Air Bedjondo budget devis calendrier porteur thématique promesse de contribution proposer un projet forage école pont bibliothèque atelier"})
PAGES_SITE.append({"t": "Observatoire du Mandoul Occidental", "r": "/observatoire", "k": "Page",
     "d": "Le territoire en chiffres, unité par unité : localités, équipements connus, couverture, diagnostic par domaine, suivi des plaidoyers et des besoins signalés — et ce que l’observatoire ne sait pas.",
     "x": "observatoire Mandoul Occidental unités localités équipements écoles santé eau marchés couverture diagnostic domaines documenté partiel inconnu qui décide plaidoyers transmis réponse besoins signalés résolus population RGPH indicateurs sources"})
PAGES_SITE.append({"t": "Espace presse et partenaires", "r": "/presse", "k": "Page",
     "d": "ADEB LONODJI en cinq lignes, les chiffres datés, six dates, le bureau, les communiqués, les logos et leurs règles, le dossier de présentation, le livre blanc, et à qui écrire.",
     "x": "presse journalistes partenaires bailleurs médias communiqué citation en bref chiffres dates 1986 1995 2000 2003 2026 bureau président contact logo pictogramme SVG PNG dossier de présentation livre blanc droit de réponse exactitude protection des personnes"})
PAGES_SITE.append({"t": "The ODEB LONODJI project — Vision 2030 (in English)", "r": "/en/odeb", "k": "In English",
     "d": "A project led by ADEB LONODJI to give the Bedjond country a permanent institution by 2030: six missions, five programmes, a roadmap, a white paper.",
     "x": "ODEB LONODJI project English vision 2030 organisation development emergence Bedjond people missions research documentation territorial development innovation heritage diaspora programmes roadmap white paper take part skills register"})
PAGES_SITE.append({"t": "Déclaration d’accessibilité", "r": "/accessibilite", "k": "Page",
     "d": "Niveau visé WCAG 2.1 AA, ce qui est vérifié avant chaque mise en ligne, les limites connues (carte, PDF, contenus importés) et comment signaler un obstacle.",
     "x": "accessibilité déclaration WCAG 2.1 AA lecteur d’écran clavier contraste hors ligne téléphone connexion lente axe-core limites carte PDF signaler un obstacle réponse 48 heures"})
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
