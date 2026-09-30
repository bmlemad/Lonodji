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
OUT_PALETTE = ROOT / "public" / "search-palette.json"  # index allégé (titre, route, type, description) pour la palette « Aller à… »
MAX_TEXT = 3500

KIND_LABEL = {"hub": "Page", "dossier": "Dossier", "en": "In English", "article": "Article"}
HUB_TITLES = {
    "mission": "Notre mission", "poles": "Nos actions : quatre pôles, vingt et une thématiques", "plaidoyers": "Plaidoyers & engagements",
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
    if d["slug"] == "air-bedjondo":  # renommé le 29/09/2026 : entrée écrite plus bas
        continue
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
     "d": "Le document fondateur, en version de travail : d’où nous partons, pourquoi une organisation, la vision 2030, six missions, six programmes, principes de gouvernance et de redevabilité, ressources, feuille de route, statut du document.",
     "x": "livre blanc document fondateur ODEB version de travail préambule vision 2030 missions programmes principes gouvernance redevabilité ressources partenaires diaspora chercheurs données ouvertes feuille de route statut adoption assemblée PDF"},
    {"t": "Feuille de route 2026-2030 du projet ODEB", "r": "/odeb/feuille-de-route", "k": "Page",
     "d": "Trois phases, de la relance de 2026 à l’organisation de référence de 2030 : chaque chantier avec son état réel — réalisé, en cours, à venir, à décider.",
     "x": "feuille de route 2026 2030 phases tableau de bord dynamique cartographie communautaire espace membre registre des compétences plateforme de projets bibliothèque numérique observatoire du Mandoul Occidental patrimoine vivant multimédia académie numérique application mobile bilan plan d’action rapport annuel organisation constituée"},
    {"t": "Les six programmes du projet ODEB", "r": "/odeb/programmes", "k": "Page",
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
PAGES_SITE.append({"t": "Programme Économie sociale et revenus (ODEB)", "r": "/odeb/programmes/economie-sociale", "k": "Page",
     "d": "Des entreprises distinctes de l’association dont les bénéfices financent les projets : complexe hôtelier à Bédjondo, collège-lycée avec internat dès la sixième, transport et logistique terrestres, CHU moderne avec ses annexes et des partenaires financiers, et dix autres activités proposées ; cinq règles, trois étapes.",
     "x": "programme économie sociale revenus activités génératrices de revenus lucratif CHU centre hospitalier universitaire hôpital santé dernière génération urgences maternité chirurgie imagerie laboratoire dialyse télémédecine ambulances école d’infirmiers faculté de médecine partenaires financiers partenariat public-privé mutuelle de santé dossier médical numérique entreprises bénéfices projets développement bien-être complexe hôtelier hôtel Bédjondo complexe scolaire internat sixième collège lycée élites bourses société de transport logistique terrestre Air Bedjondo huilerie arachide sésame moulin stockage warrantage ferme agro-pastorale briqueterie matériaux énergie solaire kiosque centre de services numériques mobile money galerie marchande logements loyers pharmacie centre médical tarif solidaire station carburant boutique du terroir diaspora caisse d’épargne microfinance COBAC société coopérative OHADA dividendes comptes publiés audit"})
PAGES_SITE.append({"t": "Note de synthèse des huit dossiers de plaidoyer (PDF, 2 pages)", "r": "/notes/note-synthese-bedjondo.pdf", "k": "Document",
     "d": "Bédjondo en chiffres sourcés, les huit demandes, les programmes des bailleurs à rejoindre ; à joindre aux courriers.",
     "x": "note synthèse plaidoyer PDF bailleurs partenaires courrier eau électricité haut débit santé école formation routes commune"})
PAGES_SITE.append({"t": "Bedjondo Transport et Logistique (ex-Air Bedjondo)", "r": "/projets/bedjondo-transport-logistique", "k": "Dossier",
     "d": "Le projet de transport et de logistique terrestres de Bédjondo, renommé le 29 septembre 2026, et six propositions pour le mener.",
     "x": "Bedjondo Transport et Logistique Air Bedjondo transport logistique pistes navette marché récoltes fret colis diaspora évacuation sanitaire tricycle pick-up coopérative programme économie sociale"})
PAGES_SITE.append({"t": "Gouvernance locale", "r": "/territoire/gouvernance-locale", "k": "Page",
     "d": "Qui décide quoi — État, province, département, commune, chefferies, quartiers —, nos demandes à chacun, leurs articulations et les indicateurs pour les suivre.",
     "x": "gouvernance locale décentralisation commune conseil communal maire préfet sous-préfet province gouverneur chefferie chef de canton chef de village chef de quartier comité de quartier doléances cahier de médiation subsidiarité indicateurs"})
PAGES_SITE.append({"t": "Sous-sol & ressources naturelles", "r": "/territoire/sous-sol", "k": "Page",
     "d": "Le sous-sol du Mandoul Occidental : pétrole du bassin voisin de Doba, fer des anciens fondeurs, or du Nord, ce qui reste inconnu, les leçons de Doba et nos propositions avant tout forage.",
     "x": "sous-sol ressources naturelles pétrole hydrocarbures bassin de Doba Doseo Komé Belanga mines minerais fer minerai de fer hauts fourneaux fondeurs métallurgie or orpaillage carrières latérite permis sismique levés sismiques 2D 3D BGP Glencore Delonex ERHC puits ITIE transparence revenus pétroliers 5 % région productrice Logone Oriental géologie"})
PAGES_SITE.append({"t": "Nos propositions à la commune de Bédjondo", "r": "/territoire/propositions-commune", "k": "Page",
     "d": "Dix projets prioritaires, un projet intégré de développement économique local, et toutes les mesures proposées à la mairie, chacune avec sa source.",
     "x": "projets prioritaires PNUD développement économique local marché moderne centre de transformation agricole Maison de la Femme et de la Jeunesse maraîchage irrigation reboisement fonds microprojets assainissement centre numérique commune mairie maire conseil communal propositions plan de développement communal schéma d’aménagement cadastre adressage droits de marché budget session publique comité de quartier doléances convention jumelage éclairage solaire marché voirie eau santé école formation"})
PAGES_SITE.append({"t": "Territoire — le pays bedjond", "r": "/territoire", "k": "Page",
     "d": "La carte, les villages, Bédjondo, la décentralisation, l’observatoire, le diagnostic territorial, les besoins et les enquêtes.",
     "x": "territoire carte villages Bédjondo décentralisation observatoire diagnostic besoins enquêtes Mandoul Occidental"})
PAGES_SITE.append({"t": "Patrimoine — la mémoire du pays bedjond", "r": "/patrimoine", "k": "Page",
     "d": "Histoire et grandes figures, lieux sacrés, généalogies, témoignages, la langue nangnda, la bibliothèque et la base de recherche.",
     "x": "patrimoine mémoire histoire figures chefs de canton lieux sacrés généalogies témoignages langue nangnda bibliothèque recherche"})
PAGES_SITE.append({"t": "Plateforme de projets", "r": "/projets", "k": "Page",
     "d": "Espace numérique communautaire, application pour téléphone, complexe sportif, Air Bedjondo : chaque projet avec son stade, ce qui existe, ce qui manque, son budget et comment contribuer ; proposer un projet.",
     "x": "projets plateforme stade idée étude annoncé souscription financé réalisation essai service espace numérique application complexe sportif Air Bedjondo budget devis calendrier porteur thématique promesse de contribution proposer un projet forage école pont bibliothèque atelier"})
PAGES_SITE.append({"t": "Observatoire du Mandoul Occidental", "r": "/observatoire", "k": "Page",
     "d": "Le territoire en chiffres, unité par unité : localités, équipements connus, couverture, diagnostic par domaine, suivi des plaidoyers et des besoins signalés — et ce que l’observatoire ne sait pas.",
     "x": "observatoire Mandoul Occidental unités localités équipements écoles santé eau marchés couverture diagnostic domaines documenté partiel inconnu qui décide plaidoyers transmis réponse besoins signalés résolus population RGPH indicateurs sources"})
PAGES_SITE.append({"t": "Espace presse et partenaires", "r": "/presse", "k": "Page",
     "d": "ADEB LONODJI en cinq lignes, les chiffres datés, six dates, le bureau, les communiqués, les logos et leurs règles, le dossier de présentation, le livre blanc, et à qui écrire.",
     "x": "presse journalistes partenaires bailleurs médias communiqué citation en bref chiffres dates 1986 1995 2000 2003 2026 bureau président contact logo pictogramme SVG PNG dossier de présentation livre blanc droit de réponse exactitude protection des personnes"})
PAGES_SITE.append({"t": "Identité visuelle : le logo « Les Pas vers l’Avenir », adopté le 28 septembre 2026", "r": "/odeb/identite", "k": "Page",
     "d": "Trois empreintes — les ancêtres, la génération actuelle, les générations futures — vers un soleil levant : le logo du projet, ses versions, ses couleurs, ses règles, le kit à télécharger et le papier à en-tête.",
     "x": "logo ODEB identité visuelle charte graphique emblème empreintes pas générations soleil levant verre devise sur les traces de nos ancêtres bâtissons notre avenir couleurs vert profond acacia doré polices DM Sans Playfair kit ZIP SVG PNG papier à en-tête planche imprimeur règles zone de protection tailles minimales monochrome réserve blanche"})
PAGES_SITE.append({"t": "Programmes des bailleurs au Tchad, et où nous nous raccrochons", "r": "/bailleurs", "k": "Page",
     "d": "Banque mondiale, Union européenne, Nations unies, BAD, coopération suisse, AFD : les programmes en cours au Tchad, ceux qui touchent le Mandoul, et nos points d’entrée par plaidoyer.",
     "x": "bailleurs bailleur partenaires techniques et financiers PTF Banque mondiale IDA Union européenne UE délégation AFD coopération suisse DDC GIZ Nations unies ONU PNUD UNICEF UNFPA PAM FAO FIDA OCHA BAD Banque africaine de développement PAEPA PAAET PRPSS SWEDD PATN SmartEd Fonds mondial financement guichet appel à projets subvention"})
PAGES_SITE.append({"t": "Secteurs d’intervention : WASH, santé, nutrition, urgences…", "r": "/secteurs", "k": "Page",
     "d": "Les vingt et une thématiques dans la langue des ONG de développement et d’aide : dix-sept secteurs, leurs clusters, codes CAD et ODD, ce qui est fait et ce qui n’est qu’une piste.",
     "x": "secteurs secteur d’intervention WASH EAH eau assainissement hygiène santé nutrition éducation sécurité alimentaire FSL moyens d’existence livelihoods relief urgence humanitaire DRR RRC réduction des risques catastrophe protection enfance VBG gouvernance paix genre climat infrastructures ICT4D numérique culture diaspora cluster IASC CAD OCDE ODD bailleur ONG partenaire abris CCCM"})
PAGES_SITE.append({"t": "Donor programmes in Chad — World Bank, EU, UN, AfDB (in English)", "r": "/en/donors", "k": "In English",
     "d": "Programmes under way in Chad, those reaching Mandoul, and how the association connects to each.",
     "x": "English donors funders World Bank European Union United Nations UNICEF UNDP UNFPA AfDB IFAD AFD Swiss cooperation GIZ programme project Mandoul Koumra water health education energy digital funding window grant"})
PAGES_SITE.append({"t": "Sectors of intervention — WASH, health, nutrition, relief, DRR (in English)", "r": "/en/sectors", "k": "In English",
     "d": "Twenty-one themes mapped to NGO sectors: IASC clusters, OECD-DAC codes, SDGs.",
     "x": "English sectors WASH health nutrition education food security livelihoods relief emergency DRR protection governance peace gender climate ICT4D culture diaspora cluster DAC SDG donor NGO partner"})
PAGES_SITE.append({"t": "Fiches de mission : diriger un pôle, coordonner une thématique", "r": "/programmes/fiches-de-mission", "k": "Page",
     "d": "Vingt-sept fiches en PDF — quatre directions de pôle au rang de chef de projet, vingt et une coordinations, deux cellules — avec le rôle, le périmètre, les quatre étapes et le lien pour candidater.",
     "x": "fiche de mission fiches poste directeur directrice de pôle chef de projet coordonnateur coordonnatrice coordination thématique cellule candidater candidature recrutement bénévole rôle périmètre étapes PDF recueil à pourvoir vacant"})
PAGES_SITE.append({"t": "La lettre d’information : chaque mois, publié, décidé, ouvert", "r": "/lettre", "k": "Page",
     "d": "Les numéros de la lettre d’ADEB LONODJI, à lire en ligne ou à transmettre en PDF sur WhatsApp ; l’abonnement par e-mail ; la règle de la lettre.",
     "x": "lettre d’information newsletter infolettre numéros abonnement s’abonner e-mail mensuelle PDF WhatsApp transmettre publié décidé ouvert archive"})
PAGES_SITE.append({"t": "Registre public des décisions", "r": "/transparence/decisions", "k": "Page",
     "d": "Ce que l’association a décidé, nommé, annoncé ou proposé depuis septembre 2026, tel que le site l’a publié, avec la source de chaque ligne et ce qui reste attendu.",
     "x": "registre décisions décidé nommé nomination annoncé annonce proposé proposition à voter règle en vigueur procès-verbal PV assemblée bureau transparence redevabilité source daté logo directions de pôle sièges ODEB programme 06"})
PAGES_SITE.append({"t": "Quinze affiches « Retrouvez votre village » à imprimer", "r": "/villages#affiches", "k": "Document PDF",
     "d": "Une affiche A4 par unité et une affiche générale, avec un code QR vers les villages et l’adresse en toutes lettres — pour les chefs, les relais, les écoles, les centres de santé.",
     "x": "affiche affiches imprimer A4 PDF code QR village unité chef de canton relais école centre de santé lieu de culte accrocher papier"})
PAGES_SITE.append({"t": "Présentation du projet ODEB à l’assemblée (PDF, PowerPoint)", "r": "/odeb#presentation", "k": "Document PDF",
     "d": "Vingt-six diapositives faites depuis les pages du site : vision, repères 2030, missions, programmes, cinq règles à voter, gouvernance, feuille de route, décisions attendues.",
     "x": "présentation diaporama diapositives PowerPoint PPTX PDF assemblée générale AG projeter ODEB programmes règles vote décisions"})
PAGES_SITE.append({"t": "Bannières, image de profil, signature e-mail, cartes de visite, modèles de diaporama", "r": "/odeb/identite#reseaux", "k": "Document PDF",
     "d": "Le kit complété : bannières Facebook, LinkedIn, X, YouTube pour les deux noms, image de profil et icône de groupe WhatsApp, signatures e-mail, carte de visite et planche A4, modèles PowerPoint.",
     "x": "bannière bannières Facebook LinkedIn X Twitter YouTube image de profil icône groupe WhatsApp signature e-mail carte de visite cartes planche modèle PowerPoint diaporama kit logo"})
PAGES_SITE.append({"t": "The ODEB LONODJI project — Vision 2030 (in English)", "r": "/en/odeb", "k": "In English",
     "d": "A project led by ADEB LONODJI to give the Bedjond country a permanent institution by 2030: six missions, six programmes, a roadmap, a white paper.",
     "x": "ODEB LONODJI project English vision 2030 organisation development emergence Bedjond people missions research documentation territorial development innovation heritage diaspora programmes roadmap white paper take part skills register"})
PAGES_SITE.append({"t": "Local governance in Bédjondo — who decides what (in English)", "r": "/en/governance", "k": "In English",
     "d": "State, province, department, commune, chieftaincies, neighbourhoods: what our files ask of each level, where they must act together, and the indicators to follow it.",
     "x": "English local governance decentralisation commune council mayor prefect province governor chieftaincy canton chief village chief neighbourhood committee complaints register mediation logbook subsidiarity indicators"})
PAGES_SITE.append({"t": "The subsoil of Mandoul Occidental — oil, iron, gold (in English)", "r": "/en/subsoil", "k": "In English",
     "d": "What public sources establish about oil in the Doba basin, seismic surveys, iron and gold, what remains unknown, the lessons of Doba and our proposals before any drilling.",
     "x": "English subsoil natural resources oil petroleum Doba basin Doseo seismic survey 2D 3D wells permits blocks iron ore laterite smelters gold artisanal mining EITI revenue producing region Komé extractive"})
PAGES_SITE.append({"t": "Find your village — the Bedjond country, unit by unit (in English)", "r": "/en/villages", "k": "In English",
     "d": "Fourteen units, 966 named localities, one page per village: what open data knows, what the site says, what is still to document.",
     "x": "English villages units Mandoul Occidental localities map find your village canton neighbourhood diaspora report a need GADM OpenStreetMap"})
PAGES_SITE.append({"t": "Projects — each one with its stage, what is missing and how to help (in English)", "r": "/en/projects", "k": "In English",
     "d": "From idea to service: community digital space, mobile app, sports complex, transport company, hotel, boarding school, university hospital; what exists, what is missing, how to contribute.",
     "x": "English projects stages idea study announced subscription funded in progress trial in service digital space app sports complex Air Bedjondo transport hotel boarding school university hospital CHU pledge skills"})
PAGES_SITE.append({"t": "Impact dashboard — six dated, sourced indicators (in English)", "r": "/en/impact", "k": "In English",
     "d": "Members, coordinators, advocacy briefs, needs recorded and solved, active projects; what the site produces and receives; zeros published as zeros.",
     "x": "English dashboard impact indicators members coordinators advocacy briefs needs solved projects articles PDF corrections commitments method counted not estimated"})
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

# directions de pôle (rang de chef de projet), décision du 28/09/2026
for pole in idx["structure"]["poles"]:
    d = pole.get("direction")
    if d:
        entries.append({"t": f"Direction du pôle {pole['roman']} — {pole['name']}", "r": f"/programmes#{pole['id']}", "k": "Direction de pôle",
                        "d": (f"Direction : {d['name']}. " if d["filled"] else "Direction à pourvoir. ") + f"{d['label']}, {d['rang']} : anime les coordonnateurs des thématiques du pôle, tient le plan d’action et le calendrier, rend compte au bureau.",
                        "x": "directeur de pôle directrice direction rang de chef de projet project manager diriger un pôle candidater " + " ".join(t["name"] for t in pole["items"])})

for p in idx["plaidoyers"]:
    entries.append({"t": p["title"], "r": f"/actions#{p['id']}", "k": "Plaidoyer", "d": p["demand"], "x": f"{p['theme']} {p['recipients']} {p['status']} {p['published']}"})

for d in idx["documents"]:
    entries.append({"t": d["title"], "r": d["pdf"] or "/documents", "k": "Document PDF" if d["pdf"] else "Document à venir", "d": d["description"], "x": d.get("meta", "")})

OUT.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
palette = [{"t": e["t"], "r": e["r"], "k": e["k"], "d": (e.get("d") or "")[:150]} for e in entries]
OUT_PALETTE.write_text(json.dumps(palette, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"search-index.json : {len(entries)} entrées, {OUT.stat().st_size // 1024} Ko")
