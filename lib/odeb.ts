/* Projet ODEB LONODJI — Vision 2030. Données des pages /odeb (vision, livre
   blanc, feuille de route, programmes) et du menu « Projet ODEB LONODJI ».
   Sources : les documents de stratégie transmis par l'association en septembre
   2026 (plan d'action 2026-2028, « ADEB LONODJI 2030 », recommandations
   2027-2030, « Projet ODEB LONODJI — Vision 2030 »). Rien ici n'est décidé :
   le projet est porté par ADEB LONODJI et son adoption lui appartient.
   Ce fichier ne lit pas le disque : il est aussi importé côté client (menu). */

export type Lien = { label: string; href: string };

export const ODEB = {
  sigle: "ODEB LONODJI",
  nom: "Organisation pour le Développement et l’Émergence Bedjonde",
  horizon: "2030",
  presente: "2026-09-28",
  presenteLabel: "28 septembre 2026",
  /* Lancée pour les quarante ans des fondations de l'association (premières réflexions de 1986). */
  anniversaire: "les quarante ans des fondations d’ADEB LONODJI (1986-2026)",
  article: "/journal/2026-09-28-quarante-ans-reflexion-odeb-lonodji",
  /* Formulation institutionnelle recommandée, reprise telle quelle. */
  formulation:
    "L’ODEB LONODJI est un projet stratégique porté par l’ADEB LONODJI visant à constituer, à terme, une organisation de référence dédiée au développement durable, à la recherche, au patrimoine et à l’émergence du pays bedjond.",
  objet: "Projet de transformation institutionnelle visant à doter le pays bedjond d’un outil permanent de recherche, de documentation, de développement territorial, d’innovation, de préservation du patrimoine et de mobilisation de la diaspora.",
  livreBlancPdf: "/odeb/livre-blanc-odeb-lonodji-2026.pdf",
  devise: "Sur les traces de nos ancêtres, bâtissons notre avenir.",
};

/* L'identité visuelle du projet, « Les Pas vers l'Avenir », retenue le 28
   septembre 2026 : trois empreintes — les ancêtres, la génération actuelle,
   les générations futures — qui avancent vers un soleil levant. Les fichiers
   sont produits par scripts/build-identite-odeb.py dans public/odeb/identite/
   (dessins : design/odeb/). */
const ID = "/odeb/identite";
export const IDENTITE = {
  nom: "Les Pas vers l’Avenir",
  retenue: "2026-09-28",
  retenueLabel: "28 septembre 2026",
  page: "/odeb/identite",
  /* emblèmes : verre sur fond, verre sans fond (sur fond sombre ou photo), verre clair, à plat */
  embleme: `${ID}/odeb-lonodji-embleme.svg`,
  superposable: `${ID}/odeb-lonodji-embleme-superposable.svg`,
  clair: `${ID}/odeb-lonodji-embleme-clair.svg`,
  clairSuperposable: `${ID}/odeb-lonodji-embleme-clair-superposable.svg`,
  plat: `${ID}/odeb-lonodji-embleme-plat.svg`,
  mono: `${ID}/odeb-lonodji-embleme-mono.svg`,
  reserve: `${ID}/odeb-lonodji-embleme-reserve.svg`,
  /* logos complets (emblème + nom + devise), textes en tracés */
  horizontal: `${ID}/odeb-lonodji-logo-horizontal.svg`,
  horizontalClair: `${ID}/odeb-lonodji-logo-horizontal-clair.svg`,
  horizontalSuperposable: `${ID}/odeb-lonodji-logo-horizontal-superposable.svg`,
  horizontalClairSuperposable: `${ID}/odeb-lonodji-logo-horizontal-clair-superposable.svg`,
  vertical: `${ID}/odeb-lonodji-logo-vertical.svg`,
  verticalClair: `${ID}/odeb-lonodji-logo-vertical-clair.svg`,
  png: { embleme2048: `${ID}/odeb-lonodji-embleme-2048.png`, embleme1024: `${ID}/odeb-lonodji-embleme-1024.png`, embleme512: `${ID}/odeb-lonodji-embleme-512.png`, superposable1024: `${ID}/odeb-lonodji-embleme-superposable-1024.png`, clair1024: `${ID}/odeb-lonodji-embleme-clair-1024.png`, plat1024: `${ID}/odeb-lonodji-embleme-plat-1024.png`, horizontal: `${ID}/odeb-lonodji-logo-horizontal.png`, horizontalClair: `${ID}/odeb-lonodji-logo-horizontal-clair.png`, vertical: `${ID}/odeb-lonodji-logo-vertical.png` },
  /* documents */
  kit: `${ID}/kit-logo-odeb-lonodji.zip`,
  planche: `${ID}/odeb-lonodji-planche.pdf`,
  enTeteDocx: `${ID}/papier-en-tete-odeb-lonodji.docx`,
  enTetePdf: `${ID}/papier-en-tete-odeb-lonodji.pdf`,
  charte: "/odeb/charte-identite-odeb-lonodji-2026.pdf",
  couleurs: [
    { nom: "Vert profond", hex: "#173B2D", cmjn: "85 45 70 45", role: "le disque, les fonds, les textes sur fond clair" },
    { nom: "Vert feuille", hex: "#2F6B4A", cmjn: "78 30 75 15", role: "le halo du disque, les liens" },
    { nom: "Acacia", hex: "#B6CF45", cmjn: "35 0 85 0", role: "les rayons, les filets, les accents" },
    { nom: "Doré", hex: "#F2C94C", cmjn: "5 18 80 0", role: "le soleil, le bord du verre" },
    { nom: "Encre", hex: "#10241E", cmjn: "85 55 70 65", role: "le nom, les textes" },
    { nom: "Sable", hex: "#F4F6F1", cmjn: "3 1 5 0", role: "les fonds clairs, le papier" },
  ],
  polices: [
    { nom: "DM Sans", usage: "le nom (« ODEB » en gras 800, « LONODJI » en fin 250, lettres espacées), le développement du sigle, les textes courants" },
    { nom: "Playfair Display", usage: "la devise en italique, les titres du site" },
  ],
};

/* Le menu « Projet ODEB LONODJI », tel que l'association l'a demandé :
   Vision (pourquoi, livre blanc, feuille de route) puis les cinq programmes. */
export const MENU_ODEB: { titre: string; liens: (Lien & { note?: string })[] }[] = [
  {
    titre: "Vision",
    liens: [
      { label: "La vision 2030", href: "/odeb", note: "Ce qu’est l’ODEB, ses six missions" },
      { label: "Pourquoi créer l’ODEB ?", href: "/odeb#pourquoi", note: "D’une association à un outil permanent" },
      { label: "Livre blanc", href: "/odeb/livre-blanc", note: "Le document fondateur, version de travail" },
      { label: "Feuille de route 2026-2030", href: "/odeb/feuille-de-route", note: "Trois phases, ce qui est fait, ce qui reste" },
      { label: "Identité visuelle", href: "/odeb/identite", note: "Le logo « Les Pas vers l’Avenir », ses règles, le kit" },
      { label: "The ODEB project, in English", href: "/en/odeb", note: "A summary for the diaspora and partners" },
    ],
  },
  {
    titre: "Programmes",
    liens: [
      { label: "Mémoire et Patrimoine", href: "/odeb/programmes/memoire-patrimoine", note: "Histoire, atlas, bibliothèque" },
      { label: "Recherche", href: "/odeb/programmes/recherche", note: "Documentation, données, publications" },
      { label: "Développement territorial", href: "/odeb/programmes/developpement-territorial", note: "Observatoire, données, diagnostics" },
      { label: "Jeunesse et Innovation", href: "/odeb/programmes/jeunesse-innovation", note: "Académie numérique, IA, compétences" },
      { label: "Diaspora", href: "/odeb/programmes/diaspora", note: "Experts, investissements, mentorat" },
      { label: "Les cinq programmes", href: "/odeb/programmes", note: "Vue d’ensemble et thématiques mobilisées" },
    ],
  },
];

/* Les six fonctions que l'ODEB doit assurer de façon permanente (document du
   28/09/2026), avec ce que le site couvre déjà pour chacune. */
export type Mission = { id: string; nom: string; texte: string; existant: Lien[] };
export const MISSIONS: Mission[] = [
  { id: "recherche", nom: "Recherche", texte: "Produire et rassembler des connaissances vérifiées sur le pays bedjond : histoire, langue, territoire, société.", existant: [{ label: "Bibliothèque numérique", href: "/bibliotheque" }, { label: "Base de recherche", href: "/dossiers/recherche" }, { label: "Thématique Recherche & savoirs", href: "/programmes#savoirs-innovation" }] },
  { id: "documentation", nom: "Documentation", texte: "Garder, classer, dater et rendre accessibles les documents, les données et les témoignages.", existant: [{ label: "Documents à télécharger", href: "/documents" }, { label: "Témoignages et banque d’images", href: "/temoignages" }, { label: "Journal des corrections", href: "/transparence#corrections" }] },
  { id: "developpement", nom: "Développement territorial", texte: "Diagnostiquer, prioriser, plaider et suivre, village par village, ce qui manque et ce qui avance.", existant: [{ label: "Observatoire", href: "/observatoire" }, { label: "Diagnostic territorial", href: "/dossiers/problematiques" }, { label: "Plaidoyers", href: "/actions" }, { label: "Carte des besoins", href: "/dossiers/besoins" }, { label: "Tableau de bord", href: "/impact" }] },
  { id: "innovation", nom: "Innovation", texte: "Mettre le numérique, les données et l’intelligence artificielle au service du territoire, de la langue et des jeunes.", existant: [{ label: "Espace numérique communautaire", href: "/dossiers/espace-numerique" }, { label: "Application pour téléphone", href: "/dossiers/application" }, { label: "Pôle Numérique & innovation", href: "/programmes#pole-4" }] },
  { id: "patrimoine", nom: "Préservation du patrimoine", texte: "Protéger et transmettre la langue nangnda, les lieux, les généalogies et la mémoire des anciens.", existant: [{ label: "La langue nangnda", href: "/langue" }, { label: "Lieux sacrés et sépultures", href: "/dossiers/lieux-sacres" }, { label: "Généalogies", href: "/dossiers/genealogies" }, { label: "Histoire & patrimoine", href: "/histoire" }] },
  { id: "diaspora", nom: "Mobilisation de la diaspora", texte: "Relier les compétences, les moyens et l’attention de la diaspora aux besoins du pays bedjond.", existant: [{ label: "Répertoire des compétences", href: "/diaspora" }, { label: "Nous soutenir", href: "/participer#soutenir" }, { label: "Thématique Réseau d’experts & diaspora", href: "/programmes#reseau-experts-diaspora" }] },
];

/* Ce que l'ODEB devra être en 2030 : les cinq repères énoncés par l'association
   le 28 septembre 2026 avec sa feuille de route. */
export const REPERES_2030 = [
  "la mémoire numérique du peuple bedjond",
  "la principale plateforme de mobilisation de la diaspora bedjond",
  "un observatoire citoyen du Mandoul Occidental",
  "un centre de compétences communautaires",
  "une référence africaine de développement territorial piloté par la communauté",
];

/* Les cinq programmes. `axes` reprend les trois sous-titres donnés par
   l'association pour chaque programme ; `existant` renvoie à ce que le site
   fait déjà, `suite` dit ce que le programme construira — au conditionnel des
   documents de stratégie, jamais comme un fait acquis. `thematiques` : les
   identifiants des thématiques (content/index.json) qui portent le programme ;
   leurs coordonnateurs sont lus à la construction. */
export type Axe = { titre: string; texte: string; existant: Lien[]; suite: string };
export type Programme = {
  slug: string; numero: string; nom: string; accroche: string; objet: string;
  missions: string[]; axes: Axe[]; thematiques: string[]; contribuer: Lien[];
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "memoire-patrimoine", numero: "01", nom: "Mémoire et Patrimoine",
    accroche: "Écrire l’histoire des peuples bedjonds, cartographier le patrimoine, garder les livres et les voix.",
    objet: "Le programme rassemble ce qui fait la mémoire du pays bedjond — son histoire, ses lieux, ses lignées, ses livres, sa langue — et le rend accessible à ceux qui vivent à Bédjondo comme à la diaspora. Il prolonge le pôle I de l’association et les recommandations 2027-2030 : centre de documentation, atlas patrimonial, bibliothèque orale.",
    missions: ["patrimoine", "documentation", "recherche"],
    axes: [
      { titre: "Histoire des peuples bedjonds", texte: "Rassembler ce qui est établi sur l’origine des Bedjond, la lignée des chefs de canton, les forums fondateurs, et le publier avec ses sources.",
        existant: [{ label: "Histoire & patrimoine, grandes figures", href: "/histoire" }, { label: "Qui sont les Ndjan ?", href: "/journal" }, { label: "Bédjondo, repères", href: "/dossiers/bedjondo" }, { label: "Portraits des anciens", href: "/temoignages#series" }],
        suite: "Le manuscrit « Histoire et origines des peuples bedjonds », annoncé dans les recommandations 2027-2030, serait publié en chapitres, en PDF et avec un glossaire dès qu’il sera transmis ; les récits des anciens recueillis par « Racontez Bédjondo » viendraient l’éclairer." },
      { titre: "Atlas patrimonial", texte: "Une carte du pays bedjond qui ne montre pas seulement les villages et les forages, mais ce qui fait lieu : sites historiques, généalogies, toponymes.",
        existant: [{ label: "Carte du territoire", href: "/carte" }, { label: "966 fiches de villages", href: "/villages" }, { label: "Lieux sacrés et sépultures", href: "/dossiers/lieux-sacres" }, { label: "Cahier généalogique en ligne", href: "/dossiers/genealogie-outil" }],
        suite: "La couche patrimoniale de l’atlas — lieux sacrés et sépultures compris — n’existerait que sur décision de l’association : la règle du site, à ce jour, est de ne rien publier de la localisation des lieux sacrés, dont le registre reste tenu par la chefferie." },
      { titre: "Bibliothèque numérique", texte: "Thèses, articles, ouvrages, rapports et archives sur le pays bedjond, les Sara et le nangnda, avec les chercheurs qui les ont signés.",
        existant: [{ label: "Bibliothèque numérique bedjond", href: "/bibliotheque" }, { label: "La langue nangnda et son lexique", href: "/langue" }, { label: "Déposer un document", href: "/bibliotheque#deposer" }],
        suite: "La bibliothèque s’étendrait à l’oral (enregistrements en nangnda, récits, chants), au dictionnaire numérique alimenté par les mots reçus, puis à un musée numérique des objets et des images, selon les recommandations 2027-2030." },
    ],
    thematiques: ["memoire-heritage", "culture-patrimoine-vivant"],
    contribuer: [{ label: "Envoyer un récit, une photo, une voix", href: "/temoignages#envoyer" }, { label: "Déposer un document", href: "/bibliotheque#deposer" }, { label: "Proposer un mot en nangnda", href: "/langue#dictionnaire" }],
  },
  {
    slug: "recherche", numero: "02", nom: "Recherche",
    accroche: "Un centre de documentation, une base scientifique, des publications datées et sourcées.",
    objet: "Le programme donne au pays bedjond ce qu’aucune structure ne lui assure aujourd’hui : un lieu où la connaissance se rassemble, se vérifie et se publie. Il s’appuie sur la thématique Recherche & savoirs, sur les neuf chercheurs déjà recensés par la bibliothèque et sur la règle de preuve du site — chaque chiffre avec sa source, chaque erreur corrigée à découvert.",
    missions: ["recherche", "documentation"],
    axes: [
      { titre: "Centre de documentation", texte: "Rassembler en un seul fonds les travaux sur le pays bedjond, quel que soit leur support, et les décrire de façon à ce qu’un étudiant de N’Djamena ou de Montréal les trouve.",
        existant: [{ label: "Bibliothèque numérique : rubriques, chercheurs, PDF", href: "/bibliotheque" }, { label: "Base de recherche bibliographique", href: "/dossiers/recherche" }],
        suite: "Le centre de documentation des recommandations 2027-2030 réunirait les chercheurs recensés autour d’un fonds commun, avec des accords de dépôt ; le nom d’« Institut numérique du patrimoine bedjond » y est proposé, sans décision à ce jour." },
      { titre: "Base scientifique", texte: "Des données ouvertes, datées, réutilisables : localités, équipements, besoins, problématiques, indicateurs.",
        existant: [{ label: "Diagnostic territorial : 34 problématiques", href: "/dossiers/problematiques" }, { label: "Enquêtes de terrain", href: "/dossiers/enquetes" }, { label: "Données de la carte (GADM, OpenStreetMap)", href: "/carte" }, { label: "Indicateurs du tableau de bord", href: "/impact" }],
        suite: "Les jeux de données du site seraient publiés comme tels, avec leur méthode, et complétés par les enquêtes de terrain que le diagnostic appelle — onze problématiques sur trente-quatre restent « inconnues »." },
      { titre: "Publications", texte: "Le journal, les plaidoyers, les cahiers et les rapports : ce que l’association écrit, signé, daté, corrigé s’il le faut.",
        existant: [{ label: "Le journal", href: "/journal" }, { label: "Documents à télécharger", href: "/documents" }, { label: "Plaidoyers", href: "/actions" }],
        suite: "S’y ajouteraient un rapport annuel, des cahiers de recherche et, avec leur accord, les travaux des chercheurs associés." },
    ],
    thematiques: ["savoirs-innovation", "memoire-heritage"],
    contribuer: [{ label: "Déposer une thèse, un article, un rapport", href: "/bibliotheque#deposer" }, { label: "Proposer un article au journal", href: "/participer#proposer" }, { label: "Inscrire ses compétences (chercheurs, enseignants)", href: "/diaspora#inscription" }],
  },
  {
    slug: "developpement-territorial", numero: "03", nom: "Développement territorial",
    accroche: "Un observatoire, des données, des diagnostics : savoir ce qui manque, où, et suivre ce qui change.",
    objet: "Le programme fait du diagnostic territorial une fonction permanente : des données village par village, des diagnostics tenus à jour, un observatoire qui suit les besoins signalés jusqu’à leur résolution et les plaidoyers jusqu’à leur réponse. Il s’appuie sur le pôle II de l’association et sur la thématique Gouvernance & plaidoyer.",
    missions: ["developpement", "recherche"],
    axes: [
      { titre: "Observatoire", texte: "Suivre, dans la durée et publiquement, les besoins du Mandoul Occidental : signalés, vérifiés, portés, résolus.",
        existant: [{ label: "Observatoire du Mandoul Occidental (première version)", href: "/observatoire" }, { label: "Tableau de bord d’impact", href: "/impact" }, { label: "Carte des besoins", href: "/dossiers/besoins" }, { label: "Suivi des plaidoyers", href: "/actions" }],
        suite: "L’observatoire du Mandoul Occidental (phase 3 de la feuille de route) donnerait à chaque unité son tableau : besoins signalés et résolus, équipements, plaidoyers en cours, avec les mêmes règles de preuve que le tableau de bord." },
      { titre: "Données", texte: "Ce que l’on sait de chaque localité : position, unité, équipements, ce que le site en dit, ce qui reste à documenter.",
        existant: [{ label: "Carte du territoire : 14 unités, 1 259 localités", href: "/carte" }, { label: "Fiches des villages", href: "/villages" }],
        suite: "Les données ouvertes ne connaissent presque aucun équipement au cœur du pays bedjond : écoles, forages, centres de santé et marchés seraient relevés sur le terrain, fiche par fiche, avec les formulaires déjà en place." },
      { titre: "Diagnostics", texte: "Trente-quatre problématiques classées par domaine, sept chantiers prioritaires, huit plaidoyers publiés : le diagnostic existe, il doit vivre.",
        existant: [{ label: "Diagnostic territorial du Mandoul Occidental", href: "/dossiers/problematiques" }, { label: "Huit enquêtes de terrain", href: "/dossiers/enquetes" }, { label: "Décentralisation & développement local", href: "/dossiers/decentralisation" }],
        suite: "Les diagnostics seraient déclinés par unité et actualisés chaque année ; les plaidoyers, transmis à leurs destinataires — aucun ne l’a encore été — et suivis jusqu’à la réponse." },
    ],
    thematiques: ["agriculture-elevage-securite-alimentaire", "environnement-ressources", "eau-energie-connectivite", "desenclavement-urbanisation", "sante-prevention", "gouvernance-plaidoyer"],
    contribuer: [{ label: "Signaler un besoin, localité par localité", href: "/dossiers/besoins" }, { label: "Soutenir un plaidoyer", href: "/actions" }, { label: "Coordonner une thématique à pourvoir", href: "/participer?coordo=1#contact" }],
  },
  {
    slug: "jeunesse-innovation", numero: "04", nom: "Jeunesse et Innovation",
    accroche: "Une académie numérique, l’intelligence artificielle, des compétences : préparer ceux qui feront Bédjondo.",
    objet: "Le programme s’adresse aux jeunes de Bédjondo et de ses cantons : apprendre, se former, entreprendre, sans quitter le pays bedjond pour cela. Il réunit la thématique Jeunesse & réussite et les trois thématiques du pôle Numérique & innovation, ainsi que l’espace numérique communautaire, premier chantier de l’association.",
    missions: ["innovation", "developpement"],
    axes: [
      { titre: "Académie numérique", texte: "Un lieu et un programme pour apprendre le numérique à Bédjondo : bureautique, code, données, métiers en ligne.",
        existant: [{ label: "L’espace numérique communautaire", href: "/dossiers/espace-numerique" }, { label: "Faire vivre le centre de formation professionnelle", href: "/actions#plaidoyer-formation-pro" }, { label: "Compétences & entrepreneuriat numérique", href: "/programmes#competences-entrepreneuriat-numerique" }],
        suite: "L’académie numérique (phase 3 de la feuille de route) ouvrirait dans l’espace numérique communautaire, dont la souscription est ouverte sans financement confirmé ; les formations à distance offertes par la diaspora en seraient le premier contenu." },
      { titre: "Intelligence artificielle", texte: "Ce que l’IA peut apporter au pays bedjond : transcrire et traduire le nangnda, exploiter les données du territoire, aider à documenter.",
        existant: [{ label: "Intelligence artificielle & données", href: "/programmes#intelligence-artificielle-donnees" }, { label: "Drones & innovation", href: "/dossiers/drones-innovation" }, { label: "Un mot en nangnda : le dictionnaire numérique", href: "/langue#dictionnaire" }],
        suite: "Les usages seraient cadrés par la thématique Intelligence artificielle & données, en commençant par la langue — enregistrements, transcription, dictionnaire — et par les données territoriales." },
      { titre: "Compétences", texte: "Parcours, mentorat, premiers emplois : relier chaque jeune à quelqu’un qui sait, ici ou dans la diaspora.",
        existant: [{ label: "Jeunesse & réussite", href: "/programmes#jeunesse-reussite" }, { label: "Jeunes talents : racontez-vous", href: "/temoignages#series" }, { label: "Complexe de formation sportive (à l’étude)", href: "/dossiers/complexe-sportif" }],
        suite: "Le mentorat proposé par les inscrits du répertoire de la diaspora serait organisé en parcours, avec la plateforme d’engagement prévue par le plan d’action 2026-2028." },
    ],
    thematiques: ["jeunesse-reussite", "transformation-numerique-services", "intelligence-artificielle-donnees", "competences-entrepreneuriat-numerique", "entrepreneuriat-finance-inclusive"],
    contribuer: [{ label: "Souscrire à l’espace numérique", href: "/dossiers/espace-numerique" }, { label: "Offrir un mentorat ou une formation à distance", href: "/diaspora#inscription" }, { label: "Coordonner Entrepreneuriat & finance inclusive", href: "/participer?theme=05&coordo=1#contact" }],
  },
  {
    slug: "diaspora", numero: "05", nom: "Diaspora",
    accroche: "Des experts, des investissements, du mentorat : la diaspora comme partie prenante, pas comme guichet.",
    objet: "Le programme organise ce que la diaspora bedjond peut apporter — du savoir, du temps, des moyens — et ce qu’elle est en droit d’attendre en retour : des comptes, des preuves, des résultats. Il s’appuie sur le répertoire des compétences ouvert en septembre 2026 et sur la thématique Réseau d’experts & diaspora.",
    missions: ["diaspora", "developpement"],
    axes: [
      { titre: "Experts", texte: "Savoir qui sait quoi, et solliciter chacun seulement pour ce qu’il a dit pouvoir faire.",
        existant: [{ label: "Répertoire des compétences", href: "/diaspora" }, { label: "Réseau d’experts & diaspora", href: "/programmes#reseau-experts-diaspora" }],
        suite: "Le répertoire deviendrait un réseau d’experts par domaine, avec un annuaire public pour ceux qui l’acceptent, et des mises en relation qui ne passeraient plus seulement par le bureau." },
      { titre: "Investissements", texte: "Financer des projets identifiés, avec un compte au nom de l’association, des comptes publiés et des projets documentés avant d’être financés.",
        existant: [{ label: "Plateforme de projets : stades, budgets, ce qui manque", href: "/projets" }, { label: "Nous soutenir (collecte suspendue jusqu’à l’ouverture d’un compte)", href: "/participer#soutenir" }, { label: "Espace numérique : souscription", href: "/dossiers/espace-numerique" }, { label: "Cellule Financement & ressources", href: "/programmes#cellule-financement-ressources" }],
        suite: "Un cadre d’investissement ne s’ouvrirait qu’après le récépissé et le compte bancaire de l’association ; chaque projet finançable serait publié avec son budget, son calendrier et son suivi sur le tableau de bord." },
      { titre: "Mentorat", texte: "Un jeune, une personne qui l’accompagne, un objectif : la forme la plus simple du lien entre Bédjondo et sa diaspora.",
        existant: [{ label: "Offrir un mentorat (répertoire)", href: "/diaspora#inscription" }, { label: "Jeunesse & réussite", href: "/programmes#jeunesse-reussite" }],
        suite: "Le mentorat serait organisé avec le programme Jeunesse et Innovation : parcours, durée, point d’étape, et une place sur le tableau de bord." },
    ],
    thematiques: ["reseau-experts-diaspora", "entrepreneuriat-finance-inclusive", "jeunesse-reussite", "cellule-financement-ressources"],
    contribuer: [{ label: "Inscrire ses compétences", href: "/diaspora#inscription" }, { label: "Proposer ou soutenir un projet", href: "/projets" }, { label: "Adhérer à l’association", href: "/participer#adherer" }],
  },
];

export const programme = (slug: string) => PROGRAMMES.find((p) => p.slug === slug);
export const routeProgramme = (p: Programme) => `/odeb/programmes/${p.slug}`;

/* Feuille de route 2026-2030. Les trois phases (0-6, 6-18 et 18-36 mois) et
   leur contenu sont ceux énoncés par l'association le 28 septembre 2026 ; les
   dates sont comptées depuis cette présentation. L'état de chaque chantier est
   celui du site à la date de construction, avec ses chiffres du moment. */
export type Etat = "fait" | "en-cours" | "a-venir" | "a-decider";
export const ETATS: Record<Etat, string> = { fait: "Réalisé", "en-cours": "En cours", "a-venir": "À venir", "a-decider": "À décider" };
export type Chantier = { titre: string; etat: Etat; note: string; href?: string };
export type Phase = { id: string; periode: string; titre: string; texte: string; chantiers: Chantier[] };

/* Chiffres du site à la construction (content/*.json), passés par la page. */
export type Chiffres = {
  pages: number; articles: number; formulaires: number; problematiques: number; chantiersPrioritaires: number; inconnues: number;
  unites: number; localites: number; fiches: number; references: number; pdf: number; chercheurs: number;
  vacantes: number; cellulesVacantes: number; pourvues: number; total: number; projets: number; projetsActifs: number; plaidoyers: number; plaidoyersEnvoyes: number; corrections: number;
};

const nf = new Intl.NumberFormat("fr-FR");

export function feuilleDeRoute(c: Chiffres): Phase[] {
  const pluriel = (n: number, un: string, des: string) => (n === 1 ? un : des);
  return [
    {
      id: "2026", periode: "2026", titre: "Relance et fondations",
      texte: "Quarante ans après les premières réflexions, l’association se remet en mouvement : une structure, un site qui date ses faits, des plaidoyers, un diagnostic, une carte. Tout ce qui suit s’appuie dessus.",
      chantiers: [
        { titre: "Quatre pôles, dix-neuf thématiques, deux cellules", etat: c.vacantes + c.cellulesVacantes ? "en-cours" : "fait", note: `${c.pourvues} coordinations pourvues sur ${c.total}${c.vacantes ? ` ; ${c.vacantes} ${pluriel(c.vacantes, "thématique reste", "thématiques restent")} à pourvoir` : ""}${c.cellulesVacantes ? (c.cellulesVacantes === 1 ? ", et une des deux cellules" : ", et les deux cellules") : ""}`, href: "/programmes" },
        { titre: "Le site lonodji.org", etat: "fait", note: `${c.pages} pages, ${c.articles} articles, ${c.formulaires} formulaires, une version anglaise, une appli installable`, href: "/" },
        { titre: `${enLettresMaj(c.plaidoyers)} plaidoyers publiés`, etat: c.plaidoyersEnvoyes ? "fait" : "en-cours", note: c.plaidoyersEnvoyes ? `${c.plaidoyersEnvoyes} sur ${c.plaidoyers} transmis à leurs destinataires` : "publiés, aucun encore transmis : les lettres attendent la signature du bureau", href: "/actions" },
        { titre: "Diagnostic territorial", etat: "fait", note: `${c.problematiques} problématiques, ${c.chantiersPrioritaires} chantiers prioritaires, huit enquêtes de terrain`, href: "/dossiers/problematiques" },
        { titre: "Carte du territoire et fiches des villages", etat: "fait", note: `${c.unites} unités, ${nf.format(c.localites)} localités, ${nf.format(c.fiches)} fiches`, href: "/villages" },
        { titre: "Lancement de la réflexion ODEB LONODJI", etat: "fait", note: "28 septembre 2026, pour les quarante ans des fondations : vision, programmes, livre blanc en version de travail", href: "/odeb" },
      ],
    },
    {
      id: "phase-1", periode: "Phase 1 · 0 à 6 mois", titre: "Rendre le site vivant",
      texte: "Jusqu’au printemps 2027 : un tableau de bord qui bouge, une cartographie que la communauté remplit, un espace pour les membres.",
      chantiers: [
        { titre: "Tableau de bord dynamique", etat: "fait", note: "six indicateurs datés et sourcés ; compteurs des formulaires relevés, en direct dès que l’accès est configuré", href: "/impact" },
        { titre: "Cartographie communautaire", etat: "fait", note: "carte, fiches de villages, signalement des besoins prérempli par lieu", href: "/carte" },
        { titre: "Espace membre", etat: "a-venir", note: "adhésion, cotisation et suivi en ligne ; dépend du compte bancaire au nom de l’association" },
        { titre: "Transmission des plaidoyers", etat: c.plaidoyersEnvoyes ? "fait" : "en-cours", note: "lettres préparées le 24 septembre 2026, à signer", href: "/actions" },
        { titre: "Compte bancaire et récépissé", etat: "a-venir", note: "la collecte reste suspendue jusque-là ; les documents constitutifs seront publiés à leur adoption", href: "/documents#a-venir" },
      ],
    },
    {
      id: "phase-2", periode: "Phase 2 · 6 à 18 mois", titre: "Outiller la communauté",
      texte: "De 2027 au début de 2028 : les compétences de la diaspora, une plateforme de projets, la bibliothèque numérique — et le pas institutionnel.",
      chantiers: [
        { titre: "Registre des compétences de la diaspora", etat: "fait", note: "ouvert dès septembre 2026, comptes publiés, rien de nominatif sans accord", href: "/diaspora" },
        { titre: "Bibliothèque numérique bedjond", etat: "fait", note: `première version : ${c.references} références, ${c.pdf} PDF, ${c.chercheurs} chercheurs, dépôt de document`, href: "/bibliotheque" },
        { titre: "Plateforme de projets", etat: "fait", note: `ouverte le 28 septembre 2026 : ${enLettresMin(c.projets)} projets décrits avec leur stade, ce qui manque et comment contribuer, ${enLettresMin(c.projetsActifs)} ${pluriel(c.projetsActifs, "actif", "actifs")}, aucun financé ; formulaire pour en proposer`, href: "/projets" },
        { titre: "« Histoire et origines des peuples bedjonds »", etat: "a-venir", note: "publication en chapitres, PDF et glossaire dès transmission du manuscrit", href: "/odeb/programmes/memoire-patrimoine" },
        { titre: "Banque d’images : cent photographies", etat: "en-cours", note: "action 1.2 du plan d’action ; aucune photo publiée à ce jour, les envois sont ouverts", href: "/temoignages" },
        { titre: "Conversion en ONG sous le nom ODEB LONODJI", etat: "a-decider", note: "décision annoncée, aucun dossier déposé ; la démarche est décrite pas à pas", href: "/dossiers/demarches#vers-ong" },
      ],
    },
    {
      id: "phase-3", periode: "Phase 3 · 18 à 36 mois", titre: "L’observatoire et l’académie",
      texte: "De 2028 à 2029 : ce qui fait d’un site une organisation — un observatoire du Mandoul Occidental, un patrimoine vivant en images et en sons, une académie numérique, une application complète.",
      chantiers: [
        { titre: "Observatoire du Mandoul Occidental", etat: "en-cours", note: "première version ouverte le 28 septembre 2026 : localités, équipements, couverture, diagnostic et plaidoyers par unité ; besoins résolus et population attendus", href: "/observatoire" },
        { titre: "Patrimoine vivant multimédia", etat: "a-venir", note: "bibliothèque orale, centre de mémoire vivante, musée numérique ; les témoignages sont déjà recueillis", href: "/temoignages" },
        { titre: "Académie numérique", etat: "a-venir", note: "dans l’espace numérique communautaire, dont la souscription est ouverte", href: "/dossiers/espace-numerique" },
        { titre: "Application mobile complète", etat: "en-cours", note: "version d’essai Android en ligne ; boutiques et cotisation par mobile money après le récépissé et le compte", href: "/dossiers/application" },
        { titre: "Atlas patrimonial : lieux sacrés et sépultures", etat: "a-decider", note: "la règle actuelle est de ne rien publier ; toute couche patrimoniale de la carte suppose une décision de l’association", href: "/dossiers/lieux-sacres" },
      ],
    },
    {
      id: "2028", periode: "2028", titre: "Bilan du plan d’action 2026-2028",
      texte: "Le plan d’action se termine : ses six indicateurs sont publiés avec leur évolution, et le rapport annuel prévu par les recommandations dit ce qui a été fait, ce qui ne l’a pas été, et pourquoi.",
      chantiers: [
        { titre: "Six indicateurs d’impact, trois années", etat: "a-venir", note: "adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets actifs", href: "/impact" },
        { titre: "Premier rapport annuel", etat: "a-venir", note: "publié dans les documents, avec ses sources", href: "/documents" },
      ],
    },
    {
      id: "2030", periode: "2029-2030", titre: "L’organisation de référence",
      texte: "L’ODEB LONODJI est constituée : une organisation permanente de recherche, de documentation, de développement territorial, d’innovation, de patrimoine et de mobilisation de la diaspora, qui rend des comptes et tient dans la durée.",
      chantiers: [
        { titre: "ODEB LONODJI constituée", etat: "a-venir", note: "statut, gouvernance et moyens propres ; le nom est celui prévu pour l’ONG", href: "/odeb/livre-blanc" },
        { titre: "« Institut numérique du patrimoine bedjond »", etat: "a-decider", note: "nom proposé par les recommandations 2027-2030 pour le centre de documentation", href: "/odeb/programmes/recherche" },
      ],
    },
  ];
}

/* Nombres en lettres, sans dépendre de lib/content.ts (qui lit le disque). */
const LETTRES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
export const enLettresMin = (n: number) => LETTRES[n] ?? String(n);
export const enLettresMaj = (n: number) => { const t = enLettresMin(n); return t.charAt(0).toUpperCase() + t.slice(1); };
