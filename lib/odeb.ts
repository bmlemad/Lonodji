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
  anniversaire: "les quarante ans de ses fondations (1986-2026)",
  article: "/journal/2026-09-28-quarante-ans-reflexion-odeb-lonodji",
  /* Formulation institutionnelle recommandée, reprise telle quelle. */
  formulation:
    "L’ODEB LONODJI est un projet stratégique porté par l’ADEB LONODJI visant à constituer, à terme, une organisation de référence dédiée au développement durable, à la recherche, au patrimoine et à l’émergence du pays bedjond.",
  objet: "Projet de transformation institutionnelle visant à doter le pays bedjond d’un outil permanent de recherche, de documentation, de développement territorial, d’innovation, de préservation du patrimoine et de mobilisation de la diaspora.",
  livreBlancPdf: "/odeb/livre-blanc-odeb-lonodji-2026.pdf",
  /* Devise retenue par le bureau exécutif élargi le 18 septembre 2026 (compte rendu CR-BE-2026-01). */
  devise: "Unité • Solidarité • Développement",
  /* Phrase de l'identité visuelle « Les Pas vers l'Avenir » (28 septembre 2026) : le sens de l'emblème ; elle était
     dans les logos complets jusqu'au 2 octobre 2026, qui portent depuis la devise ci-dessus. */
  signature: "Sur les traces de nos ancêtres, bâtissons notre avenir.",
  /* horizon gardé à 2030 (2 octobre 2026), le compte rendu du 18 septembre écrivant « Ambition 2035 » */
  ambition: "2030",
};

/* Ce que le bureau exécutif élargi a retenu le 18 septembre 2026 pour l'ODEB LONODJI (compte rendu CR-BE-2026-01,
   publié le 2 octobre 2026 ; version signée à suivre). Textes recopiés du compte rendu. La vision, la mission et les
   valeurs sont à finaliser en phase 2 (au 17 novembre 2026) ; la transformation reste soumise à l'assemblée générale. */
export const BUREAU_18_SEPTEMBRE = {
  date: "2026-09-18",
  dateLabel: "18 septembre 2026",
  reference: "CR-BE-2026-01",
  pdf: "/organisation/compte-rendu-bureau-2026-09-18.pdf",
  vision: "Unir le peuple bedjonde autour d’une vision commune de solidarité, d’entraide et de développement durable, afin de bâtir un avenir prospère, inclusif et solidaire pour les générations présentes et futures.",
  mission: "Mobiliser les filles et fils bedjonde, promouvoir l’entraide et mettre en œuvre des initiatives de développement socio-économique, culturel et éducatif au service du bien-être des communautés.",
  valeurs: ["Unité", "Solidarité", "Respect", "Intégrité", "Responsabilité", "Excellence", "Innovation"],
  /* « Ambition 2035 » dans le compte rendu ; l'association garde l'horizon 2030 (2 octobre 2026) */
  ambition: "Faire de l’ODEB Lonodji l’organisation de référence du peuple bedjonde en matière d’entraide, de développement communautaire, de promotion culturelle et de représentation auprès des partenaires nationaux et internationaux.",
  /* les huit axes stratégiques prioritaires ; « portePar » : où le site range aujourd'hui ce travail (correspondance
     établie le 2 octobre 2026, pas dans le compte rendu) */
  axes: [
    { titre: "Unité et cohésion communautaire", contenu: "Renforcement de l’unité du peuple bedjonde ; promotion du dialogue et du vivre-ensemble ; organisation de rencontres communautaires.", portePar: [{ label: "14 Paix & cohésion", href: "/programmes#paix-cohesion" }, { label: "15 Réseau d’experts & diaspora", href: "/programmes#reseau-experts-diaspora" }] },
    { titre: "Éducation et jeunesse", contenu: "Promotion de l’excellence scolaire et universitaire ; formation professionnelle ; mentorat et accompagnement des jeunes.", portePar: [{ label: "09 Éducation, jeunesse & formation", href: "/programmes#jeunesse-reussite" }, { label: "19 Compétences & entrepreneuriat numérique", href: "/programmes#competences-entrepreneuriat-numerique" }] },
    { titre: "Développement économique", contenu: "Appui à l’entrepreneuriat ; promotion des initiatives économiques ; soutien aux activités génératrices de revenus.", portePar: [{ label: "Pôle V : 04, 05, 06", href: "/programmes#entrepreneuriat-finance-inclusive" }] },
    { titre: "Entraide et action sociale", contenu: "Renforcement de la solidarité communautaire ; assistance aux membres en situation de besoin ; mise en place progressive d’un mécanisme de solidarité.", portePar: [{ label: "12 Protection sociale, enfance & inclusion", href: "/programmes#solidarite-inclusion" }] },
    { titre: "Culture et patrimoine", contenu: "Préservation de la langue et des traditions bedjonde ; valorisation de l’histoire et de l’identité culturelle ; transmission du patrimoine aux générations futures.", portePar: [{ label: "Pôle I : 01, 02, 03", href: "/programmes#memoire-heritage" }] },
    { titre: "Partenariats et coopération", contenu: "Développement de partenariats institutionnels ; coopération avec les acteurs du développement ; mobilisation de ressources techniques et financières.", portePar: [{ label: "Cellule Financement & ressources", href: "/programmes#cellule-financement-ressources" }, { label: "Bailleurs", href: "/bailleurs" }] },
    { titre: "Transformation numérique", contenu: "Modernisation des outils de communication ; digitalisation de la gestion associative ; renforcement de la présence numérique.", portePar: [{ label: "Pôle IV : 17, 18, 19", href: "/programmes#transformation-numerique-services" }, { label: "Cellule Communication & numérique", href: "/programmes#cellule-communication-numerique" }] },
    { titre: "Gouvernance et leadership", contenu: "Renforcement des capacités des dirigeants ; promotion du leadership des jeunes et des femmes ; transparence, redevabilité et bonne gouvernance.", portePar: [{ label: "13 Gouvernance & plaidoyer", href: "/programmes#gouvernance-plaidoyer" }, { label: "10 Genre & autonomisation des femmes", href: "/programmes#leadership-feminin" }, { label: "Redevabilité", href: "/transparence" }] },
  ],
  resolutions: [
    "Engager officiellement le processus de réactivation de l’ADEB Lonodji.",
    "Mettre en place le Comité de réactivation, de modernisation et de transformation institutionnelle.",
    "Préparer une assemblée générale de relance.",
    "Élaborer de nouveaux statuts et un règlement intérieur adaptés aux ambitions futures de l’organisation.",
    "Adopter le principe de la transformation progressive de l’ADEB Lonodji en Organisation pour le Développement et l’Émergence Bedjonde (ODEB Lonodji), sous réserve de l’approbation de l’assemblée générale.",
    "Définir une feuille de route devant conduire, à terme, à l’obtention du statut d’ONG.",
  ],
  comite: {
    nom: "Comité de réactivation, de modernisation et de transformation institutionnelle",
    mandat: ["préparer les nouveaux statuts", "élaborer le règlement intérieur", "définir le futur organigramme", "préparer l’assemblée générale de relance", "élaborer le plan stratégique de l’ODEB Lonodji", "étudier les conditions d’accès au statut d’ONG", "assurer le suivi de la mise en œuvre des résolutions adoptées"],
    composition: "à arrêter par le bureau exécutif (coordonnateur, membres, personnes ressources) au plus tard le 3 octobre 2026",
  },
  /* chronogramme indicatif, J = 18 septembre 2026 */
  chronogramme: [
    { phase: "Phase 1 — Organisation et préparation", echeance: "J + 30, au 18 octobre 2026", actions: "Mise en place officielle du Comité ; recensement des membres ; mise à jour de la base de données ; collecte et examen des documents administratifs ; réactivation des canaux officiels de communication ; note d’orientation stratégique." },
    { phase: "Phase 2 — Réformes et mobilisation", echeance: "J + 30 à J + 60, au 17 novembre 2026", actions: "Consultation des membres et personnes ressources ; nouveaux statuts et règlement intérieur ; finalisation de la vision, de la mission et des valeurs ; campagne de mobilisation et d’adhésion ; préparation de l’assemblée générale." },
    { phase: "Phase 3 — Relance institutionnelle", echeance: "J + 60 à J + 90, au 17 décembre 2026", actions: "Assemblée générale de relance ; adoption des nouveaux textes ; validation de la transformation en ODEB Lonodji ; mise en place ou renouvellement des organes de gouvernance ; adoption du plan d’actions prioritaires." },
    { phase: "Phase 4 — Déploiement et développement", echeance: "J + 90 à J + 180, au 17 mars 2027", actions: "Lancement officiel des activités de l’ODEB Lonodji ; premiers projets ; partenariats stratégiques ; structuration des commissions thématiques ; programme pluriannuel de développement." },
    { phase: "Perspective à moyen terme", echeance: "1 à 3 ans, 2027-2029", actions: "Consolidation institutionnelle ; rayonnement national et international ; projets structurants ; mise en conformité réglementaire ; dossier d’obtention du statut d’ONG." },
  ],
  /* suivi des décisions du compte rendu */
  suivi: [
    { action: "Arrêter la composition du Comité et désigner son coordonnateur", qui: "Bureau exécutif", echeance: "2026-10-03" },
    { action: "Lancer le recensement des membres et la mise à jour de la base de données", qui: "Comité", echeance: "2026-10-18", enCours: "Formulaire de recensement en ligne depuis le 2 octobre 2026", href: "/participer/recensement" },
    { action: "Réactiver les canaux officiels de communication (groupe WhatsApp, site web, réseaux sociaux)", qui: "Comité", echeance: "2026-10-18", fait: "Groupe WhatsApp, site, pages Facebook et X, chaîne YouTube en ligne au 2 octobre 2026 ; page LinkedIn le 3 octobre" },
    { action: "Rédiger la note d’orientation stratégique", qui: "Comité", echeance: "2026-10-18" },
    { action: "Produire les projets de statuts et de règlement intérieur", qui: "Comité", echeance: "2026-11-17" },
    { action: "Fixer la date et le lieu de l’assemblée générale de relance", qui: "Bureau exécutif", echeance: "2026-11-17" },
    { action: "Étudier les conditions et le calendrier d’accès au statut d’ONG", qui: "Comité", echeance: "2026-12-17" },
    { action: "Diffuser le compte rendu aux membres du bureau exécutif", qui: "Secrétaire général", echeance: "2026-10-02", fait: "Publié sur le site le 2 octobre 2026" },
  ] as { action: string; qui: string; echeance: string; fait?: string; enCours?: string; href?: string }[],
};

/* L'identité visuelle « Les Pas vers l'Avenir », adoptée le 28 septembre 2026
   par l'association pour elle-même et pour son projet ODEB : trois empreintes —
   les ancêtres, la génération actuelle, les générations futures — qui avancent
   vers un soleil levant. Un emblème, deux noms (« ADEB LONODJI », « ODEB
   LONODJI »). L'emblème est aussi le logo du site (en-tête, pied, icônes,
   images de partage). Les fichiers sont produits par
   scripts/build-identite-odeb.py dans public/odeb/identite/ (dessins : design/odeb/). */
const ID = "/odeb/identite";
export const IDENTITE = {
  nom: "Les Pas vers l’Avenir",
  retenue: "2026-09-28",
  retenueLabel: "28 septembre 2026",
  /* adoptée par l'association comme son logo, le même jour */
  adopteeLabel: "28 septembre 2026",
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
  /* les mêmes, au nom de l'association */
  adeb: {
    horizontal: `${ID}/adeb-lonodji-logo-horizontal.svg`, horizontalClair: `${ID}/adeb-lonodji-logo-horizontal-clair.svg`,
    horizontalSuperposable: `${ID}/adeb-lonodji-logo-horizontal-superposable.svg`, horizontalClairSuperposable: `${ID}/adeb-lonodji-logo-horizontal-clair-superposable.svg`,
    vertical: `${ID}/adeb-lonodji-logo-vertical.svg`, verticalClair: `${ID}/adeb-lonodji-logo-vertical-clair.svg`,
    png: { horizontal: `${ID}/adeb-lonodji-logo-horizontal.png`, horizontalClair: `${ID}/adeb-lonodji-logo-horizontal-clair.png`, vertical: `${ID}/adeb-lonodji-logo-vertical.png`, verticalClair: `${ID}/adeb-lonodji-logo-vertical-clair.png` },
    enTeteDocx: `${ID}/papier-en-tete-adeb-lonodji.docx`, enTetePdf: `${ID}/papier-en-tete-adeb-lonodji.pdf`,
  },
  png: { embleme2048: `${ID}/odeb-lonodji-embleme-2048.png`, embleme1024: `${ID}/odeb-lonodji-embleme-1024.png`, embleme512: `${ID}/odeb-lonodji-embleme-512.png`, superposable1024: `${ID}/odeb-lonodji-embleme-superposable-1024.png`, clair1024: `${ID}/odeb-lonodji-embleme-clair-1024.png`, plat1024: `${ID}/odeb-lonodji-embleme-plat-1024.png`, horizontal: `${ID}/odeb-lonodji-logo-horizontal.png`, horizontalClair: `${ID}/odeb-lonodji-logo-horizontal-clair.png`, vertical: `${ID}/odeb-lonodji-logo-vertical.png` },
  /* documents */
  kit: `${ID}/kit-logo-odeb-lonodji.zip`,
  planche: `${ID}/odeb-lonodji-planche.pdf`,
  enTeteDocx: `${ID}/papier-en-tete-odeb-lonodji.docx`,
  enTetePdf: `${ID}/papier-en-tete-odeb-lonodji.pdf`,
  charte: "/odeb/charte-identite-odeb-lonodji-2026.pdf",
  /* ajoutés au kit le 29 septembre 2026 : réseaux sociaux, messagerie, cartes, diaporamas */
  reseaux: {
    facebook: { adeb: `${ID}/adeb-lonodji-banniere-facebook-1640x624.png`, odeb: `${ID}/odeb-lonodji-banniere-facebook-1640x624.png`, taille: "1 640 × 624" },
    linkedin: { adeb: `${ID}/adeb-lonodji-banniere-linkedin-1584x396.png`, odeb: `${ID}/odeb-lonodji-banniere-linkedin-1584x396.png`, taille: "1 584 × 396" },
    x: { adeb: `${ID}/adeb-lonodji-banniere-x-1500x500.png`, odeb: `${ID}/odeb-lonodji-banniere-x-1500x500.png`, taille: "1 500 × 500" },
    youtube: { adeb: `${ID}/adeb-lonodji-banniere-youtube-2560x1440.jpg`, odeb: `${ID}/odeb-lonodji-banniere-youtube-2560x1440.jpg`, taille: "2 560 × 1 440" },
    apercu: { adeb: `${ID}/adeb-lonodji-banniere-apercu.jpg`, odeb: `${ID}/odeb-lonodji-banniere-apercu.jpg` },
    profil: `${ID}/embleme-profil-1024.png`,
    whatsapp: `${ID}/embleme-profil-whatsapp-640.png`,
  },
  signature: { adeb: `${ID}/signature-e-mail-adeb-lonodji.html`, odeb: `${ID}/signature-e-mail-odeb-lonodji.html` },
  cartes: { pdf: `${ID}/carte-de-visite-adeb-lonodji.pdf`, planche: `${ID}/carte-de-visite-adeb-lonodji-planche-a4.pdf` },
  diaporama: { adeb: `${ID}/modele-diaporama-adeb-lonodji.pptx`, odeb: `${ID}/modele-diaporama-odeb-lonodji.pptx` },
  /* présentation du projet à l'assemblée, produite par scripts/build-diaporama.js depuis les données du site */
  presentation: { pptx: "/odeb/odeb-lonodji-presentation-assemblee-2026.pptx", pdf: "/odeb/odeb-lonodji-presentation-assemblee-2026.pdf", diapositives: 26 },
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
   Vision (pourquoi, livre blanc, feuille de route) puis les six programmes. */
export const MENU_ODEB: { titre: string; liens: (Lien & { note?: string })[] }[] = [
  {
    titre: "Vision",
    liens: [
      { label: "La vision 2030", href: "/odeb", note: "Ce qu’est l’ODEB, ses six missions" },
      { label: "Pourquoi créer l’ODEB ?", href: "/odeb#pourquoi", note: "D’une association à un outil permanent" },
      { label: "Livre blanc", href: "/odeb/livre-blanc", note: "Le document fondateur, version de travail" },
      { label: "Feuille de route 2026-2030", href: "/odeb/feuille-de-route", note: "Trois phases, ce qui est fait, ce qui reste" },
      { label: "Identité visuelle", href: "/odeb/identite", note: "Le logo « Les Pas vers l’Avenir », commun à l’association et au projet" },
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
      { label: "Économie sociale et revenus", href: "/odeb/programmes/economie-sociale", note: "Hôtel, collège-internat, transport : des revenus pour les projets" },
      { label: "Les six programmes", href: "/odeb/programmes", note: "Vue d’ensemble et thématiques mobilisées" },
    ],
  },
];

/* Les six fonctions que l'ODEB doit assurer de façon permanente (document du
   28/09/2026), avec ce que le site couvre déjà pour chacune. */
export type Mission = { id: string; nom: string; texte: string; existant: Lien[] };
export const MISSIONS: Mission[] = [
  { id: "recherche", nom: "Recherche", texte: "Produire et rassembler des connaissances vérifiées sur le pays bedjond : histoire, langue, territoire, société.", existant: [{ label: "Bibliothèque numérique", href: "/bibliotheque" }, { label: "Base de recherche", href: "/patrimoine/base-de-recherche" }, { label: "Thématique Recherche & savoirs", href: "/programmes#savoirs-innovation" }] },
  { id: "documentation", nom: "Documentation", texte: "Garder, classer, dater et rendre accessibles les documents, les données et les témoignages.", existant: [{ label: "Documents à télécharger", href: "/documents" }, { label: "Témoignages et banque d’images", href: "/temoignages" }, { label: "Journal des corrections", href: "/transparence#corrections" }] },
  { id: "developpement", nom: "Développement territorial", texte: "Diagnostiquer, prioriser, plaider et suivre, village par village, ce qui manque et ce qui avance.", existant: [{ label: "Observatoire", href: "/observatoire" }, { label: "Diagnostic territorial", href: "/territoire/diagnostic" }, { label: "Plaidoyers", href: "/actions" }, { label: "Carte des besoins", href: "/territoire/besoins" }, { label: "Tableau de bord", href: "/impact" }] },
  { id: "innovation", nom: "Innovation", texte: "Mettre le numérique, les données et l’intelligence artificielle au service du territoire, de la langue et des jeunes.", existant: [{ label: "Espace numérique communautaire (projet, souscription sans paiement)", href: "/projets/espace-numerique" }, { label: "Application pour téléphone", href: "/projets/application" }, { label: "Pôle Numérique & innovation", href: "/programmes#pole-4" }] },
  { id: "patrimoine", nom: "Préservation du patrimoine", texte: "Protéger et transmettre la langue nangnda, les lieux, les généalogies et la mémoire des anciens.", existant: [{ label: "La langue nangnda", href: "/langue" }, { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" }, { label: "Généalogies", href: "/patrimoine/genealogies" }, { label: "Histoire & patrimoine", href: "/histoire" }] },
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

/* Les six programmes. `axes` reprend les trois sous-titres donnés par
   l'association pour chaque programme ; `existant` renvoie à ce que le site
   fait déjà, `suite` dit ce que le programme construira — au conditionnel des
   documents de stratégie, jamais comme un fait acquis. `thematiques` : les
   identifiants des thématiques (content/index.json) qui portent le programme ;
   leurs coordonnateurs sont lus à la construction. */
export type Axe = { titre: string; texte: string; existant: Lien[]; suite: string };
/* Une activité génératrice de revenus proposée (programme 06) : rien n'est décidé ni chiffré. */
export type Activite = { nom: string; quoi: string; pourquoi: string; revenus: string; finance: string; prealables: string; risque: string; thematiques: string[]; projet?: string };
export type Programme = {
  slug: string; numero: string; nom: string; accroche: string; objet: string;
  missions: string[]; axes: Axe[]; thematiques: string[]; contribuer: Lien[];
  /* programme 06 : les règles du jeu, le portefeuille d'activités proposées, les étapes */
  principes?: { titre: string; texte: string }[];
  portefeuille?: Activite[];
  etapes?: { periode: string; titre: string; texte: string }[];
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "memoire-patrimoine", numero: "01", nom: "Mémoire et Patrimoine",
    accroche: "Écrire l’histoire des peuples bedjonds, cartographier le patrimoine, garder les livres et les voix.",
    objet: "Le programme rassemble ce qui fait la mémoire du pays bedjond — son histoire, ses lieux, ses lignées, ses livres, sa langue — et le rend accessible à ceux qui vivent à Bédjondo comme à la diaspora. Il prolonge le pôle I de l’association et les recommandations 2027-2030 : centre de documentation, atlas patrimonial, bibliothèque orale.",
    missions: ["patrimoine", "documentation", "recherche"],
    axes: [
      { titre: "Histoire des peuples bedjonds", texte: "Rassembler ce qui est établi sur l’origine des Bedjond, la lignée des chefs de canton, les forums fondateurs, et le publier avec ses sources.",
        existant: [{ label: "Histoire & patrimoine, grandes figures", href: "/histoire" }, { label: "Qui sont les Ndjan ?", href: "/journal" }, { label: "Bédjondo, repères", href: "/territoire/bedjondo" }, { label: "Portraits des anciens", href: "/temoignages#series" }],
        suite: "Le manuscrit « Histoire et origines des peuples bedjonds », annoncé dans les recommandations 2027-2030, serait publié en chapitres, en PDF et avec un glossaire dès qu’il sera transmis ; les récits des anciens recueillis par « Racontez Bédjondo » viendraient l’éclairer." },
      { titre: "Atlas patrimonial", texte: "Une carte du pays bedjond qui ne montre pas seulement les villages et les forages, mais ce qui fait lieu : sites historiques, généalogies, toponymes.",
        existant: [{ label: "Carte du territoire", href: "/carte" }, { label: "966 fiches de villages", href: "/villages" }, { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" }, { label: "Cahier généalogique en ligne", href: "/patrimoine/genealogie-outil" }],
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
        existant: [{ label: "Bibliothèque numérique : rubriques, chercheurs, PDF", href: "/bibliotheque" }, { label: "Base de recherche bibliographique", href: "/patrimoine/base-de-recherche" }],
        suite: "Le centre de documentation des recommandations 2027-2030 réunirait les chercheurs recensés autour d’un fonds commun, avec des accords de dépôt ; le nom d’« Institut numérique du patrimoine bedjond » y est proposé, sans décision à ce jour." },
      { titre: "Base scientifique", texte: "Des données ouvertes, datées, réutilisables : localités, équipements, besoins, problématiques, indicateurs.",
        existant: [{ label: "Diagnostic territorial : 34 problématiques", href: "/territoire/diagnostic" }, { label: "Enquêtes de terrain", href: "/territoire/enquetes" }, { label: "Données de la carte (GADM, OpenStreetMap)", href: "/carte" }, { label: "Indicateurs du tableau de bord", href: "/impact" }],
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
    objet: "Le programme fait du diagnostic territorial une fonction permanente : des données village par village, des diagnostics tenus à jour, un observatoire qui suit les besoins signalés jusqu’à leur résolution et les plaidoyers jusqu’à leur réponse. Il s’appuie sur les pôles II et V de l’association et sur le pôle III : Gouvernance & plaidoyer, et, depuis le 1er octobre 2026, Paix & cohésion — les conflits entre agriculteurs et éleveurs, la médiation — et Justice & droits humains — l’accès au droit et à l’état civil.",
    missions: ["developpement", "recherche"],
    axes: [
      { titre: "Observatoire", texte: "Suivre, dans la durée et publiquement, les besoins du Mandoul Occidental : signalés, vérifiés, portés, résolus.",
        existant: [{ label: "Observatoire du Mandoul Occidental (première version)", href: "/observatoire" }, { label: "Tableau de suivi", href: "/impact" }, { label: "Carte des besoins", href: "/territoire/besoins" }, { label: "Suivi des plaidoyers", href: "/actions" }],
        suite: "L’observatoire du Mandoul Occidental (phase 3 de la feuille de route) donnerait à chaque unité son tableau : besoins signalés et résolus, équipements, plaidoyers en cours, avec les mêmes règles de preuve que le tableau de bord." },
      { titre: "Données", texte: "Ce que l’on sait de chaque localité : position, unité, équipements, ce que le site en dit, ce qui reste à documenter.",
        existant: [{ label: "Carte du territoire : 14 unités, 1 259 localités", href: "/carte" }, { label: "Fiches des villages", href: "/villages" }],
        suite: "Les données ouvertes ne connaissent presque aucun équipement au cœur du pays bedjond : écoles, forages, centres de santé et marchés seraient relevés sur le terrain, fiche par fiche, avec les formulaires déjà en place." },
      { titre: "Diagnostics", texte: "Trente-quatre problématiques classées par domaine, sept chantiers prioritaires, huit dossiers de plaidoyer publiés : le diagnostic existe, il doit vivre.",
        existant: [{ label: "Diagnostic territorial du Mandoul Occidental", href: "/territoire/diagnostic" }, { label: "Huit enquêtes de terrain", href: "/territoire/enquetes" }, { label: "Décentralisation & développement local", href: "/territoire/decentralisation" }],
        suite: "Les diagnostics seraient déclinés par unité et actualisés chaque année ; les plaidoyers, transmis à leurs destinataires — aucun ne l’a encore été — et suivis jusqu’à la réponse." },
    ],
    thematiques: ["agriculture-elevage-securite-alimentaire", "environnement-ressources", "eau-energie-connectivite", "energie", "desenclavement-urbanisation", "sante-prevention", "urgences-risques", "gouvernance-plaidoyer", "paix-cohesion", "justice-droits-homme"],
    contribuer: [{ label: "Signaler un besoin, localité par localité", href: "/territoire/besoins" }, { label: "Soutenir un plaidoyer", href: "/actions" }, { label: "Coordonner une thématique à pourvoir", href: "/participer?coordo=1#contact" }],
  },
  {
    slug: "jeunesse-innovation", numero: "04", nom: "Jeunesse et Innovation",
    accroche: "Une académie numérique, l’intelligence artificielle, des compétences : préparer ceux qui feront Bédjondo.",
    objet: "Le programme s’adresse aux jeunes de Bédjondo et de ses cantons : apprendre, se former, entreprendre, sans quitter le pays bedjond pour cela. Il réunit la thématique Éducation, jeunesse & formation, les trois thématiques du pôle Numérique & innovation et la thématique Entrepreneuriat & finance inclusive, ainsi que l’espace numérique communautaire, premier chantier de l’association.",
    missions: ["innovation", "developpement"],
    axes: [
      { titre: "Académie numérique", texte: "Un lieu et un programme pour apprendre le numérique à Bédjondo : bureautique, code, données, métiers en ligne.",
        existant: [{ label: "L’espace numérique communautaire", href: "/projets/espace-numerique" }, { label: "Faire vivre le centre de formation professionnelle", href: "/actions#plaidoyer-formation-pro" }, { label: "Compétences & entrepreneuriat numérique", href: "/programmes#competences-entrepreneuriat-numerique" }],
        suite: "L’académie numérique (phase 3 de la feuille de route) ouvrirait dans l’espace numérique communautaire, ouvert aux promesses de contribution, sans paiement ni financement confirmé ; les formations à distance offertes par la diaspora en seraient le premier contenu." },
      { titre: "Intelligence artificielle", texte: "Ce que l’IA peut apporter au pays bedjond : transcrire et traduire le nangnda, exploiter les données du territoire, aider à documenter.",
        existant: [{ label: "Intelligence artificielle & données", href: "/programmes#intelligence-artificielle-donnees" }, { label: "Drones & innovation", href: "/projets/drones-innovation" }, { label: "Un mot en nangnda : le dictionnaire numérique", href: "/langue#dictionnaire" }],
        suite: "Les usages seraient cadrés par la thématique Intelligence artificielle & données, en commençant par la langue — enregistrements, transcription, dictionnaire — et par les données territoriales." },
      { titre: "Compétences", texte: "Parcours, mentorat, premiers emplois : relier chaque jeune à quelqu’un qui sait, ici ou dans la diaspora.",
        existant: [{ label: "Éducation, jeunesse & formation", href: "/programmes#jeunesse-reussite" }, { label: "Jeunes talents : racontez-vous", href: "/temoignages#series" }, { label: "Complexe de formation sportive (à l’étude)", href: "/projets/complexe-sportif" }],
        suite: "Le mentorat proposé par les inscrits du répertoire de la diaspora serait organisé en parcours, avec la plateforme d’engagement prévue par le plan d’action 2026-2028." },
    ],
    thematiques: ["jeunesse-reussite", "transformation-numerique-services", "intelligence-artificielle-donnees", "competences-entrepreneuriat-numerique", "entrepreneuriat-finance-inclusive", "sport-arts-loisirs"],
    contribuer: [{ label: "Souscrire à l’espace numérique", href: "/projets/espace-numerique" }, { label: "Offrir un mentorat ou une formation à distance", href: "/diaspora#inscription" }, { label: "Trouver sa thématique", href: "/participer/trouver-ma-thematique" }],
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
        existant: [{ label: "Plateforme de projets : stades, budgets, ce qui manque", href: "/projets" }, { label: "Nous soutenir (collecte suspendue jusqu’à l’ouverture d’un compte)", href: "/participer#soutenir" }, { label: "Espace numérique : souscription", href: "/projets/espace-numerique" }, { label: "Cellule Financement & ressources", href: "/programmes#cellule-financement-ressources" }],
        suite: "Un cadre d’investissement ne s’ouvrirait qu’après le récépissé et le compte bancaire de l’association ; chaque projet finançable serait publié avec son budget, son calendrier et son suivi sur le tableau de bord." },
      { titre: "Mentorat", texte: "Un jeune, une personne qui l’accompagne, un objectif : la forme la plus simple du lien entre Bédjondo et sa diaspora.",
        existant: [{ label: "Offrir un mentorat (répertoire)", href: "/diaspora#inscription" }, { label: "Éducation, jeunesse & formation", href: "/programmes#jeunesse-reussite" }],
        suite: "Le mentorat serait organisé avec le programme Jeunesse et Innovation : parcours, durée, point d’étape, et une place sur le tableau de bord." },
    ],
    thematiques: ["reseau-experts-diaspora", "entrepreneuriat-finance-inclusive", "jeunesse-reussite", "cellule-financement-ressources"],
    contribuer: [{ label: "Inscrire ses compétences", href: "/diaspora#inscription" }, { label: "Proposer ou soutenir un projet", href: "/projets" }, { label: "Adhérer à l’association", href: "/participer#adherer" }],
  },
  {
    slug: "economie-sociale", numero: "06", nom: "Économie sociale et revenus",
    accroche: "Des activités qui rapportent, pour financer celles qui ne rapportent pas : le développement et le bien-être.",
    objet: "Le programme créerait, sous une forme juridique distincte de l’association, des entreprises dont les bénéfices, hors la part réinvestie, reviendraient aux projets de développement et de bien-être du pays bedjond. Il ne s’agit pas de gagner de l’argent pour lui-même, mais d’avoir des revenus propres et durables, pour que les projets ne dépendent plus seulement des cotisations et des dons. Quatre entreprises phares ont été proposées le 28 septembre 2026 — un complexe hôtelier à Bédjondo, un complexe scolaire avec internat à partir de la sixième, une société de transport et de logistique terrestres, et un centre hospitalier universitaire moderne avec tous ses services annexes, monté avec des partenaires financiers — et une dizaine d’autres activités sont proposées ici pour être étudiées. Rien n’est créé, ni étudié, ni financé à ce jour.",
    missions: ["developpement", "diaspora", "innovation"],
    axes: [
      { titre: "Hôtellerie et accueil", texte: "Un complexe hôtelier à Bédjondo : chambres, restauration, salle de réunion et d’événements, pour les missions administratives et associatives, les commerçants, les visiteurs et la diaspora de passage. Ses bénéfices financeraient les projets.",
        existant: [{ label: "Bédjondo, chef-lieu : repères", href: "/territoire/bedjondo" }, { label: "Plateforme de projets : le complexe hôtelier", href: "/projets#complexe-hotelier" }, { label: "Répertoire des compétences (hôtellerie, gestion)", href: "/diaspora" }],
        suite: "Une étude de marché dirait d’abord qui dort et se réunit à Bédjondo aujourd’hui, et où ; une première phase — une maison d’hôtes d’une dizaine de chambres avec une salle — précéderait le complexe, avec un exploitant formé et des comptes publiés. Terrain, coût et calendrier restent à établir." },
      { titre: "Éducation d’excellence", texte: "Un complexe scolaire avec internat à partir de la sixième, pour former les futures élites du pays bedjond : collège puis lycée, exigeants, ouverts par des bourses aux élèves méritants sans moyens. Les frais de scolarité couvriraient les charges et dégageraient un excédent pour les projets.",
        existant: [{ label: "Thématique Éducation, jeunesse & formation", href: "/programmes#jeunesse-reussite" }, { label: "Complexe sportif (à l’étude)", href: "/projets#complexe-sportif" }, { label: "Espace numérique communautaire", href: "/projets/espace-numerique" }, { label: "Plateforme de projets : le complexe scolaire", href: "/projets#complexe-scolaire-internat" }],
        suite: "Le collège viendrait d’abord (quatre classes, un internat), le lycée ensuite ; il faudrait l’agrément du ministère, un terrain, des enseignants, un règlement des bourses et un conseil d’établissement. La démographie scolaire du Mandoul Occidental et les établissements existants seraient étudiés avant toute décision." },
      { titre: "Transport et logistique terrestres", texte: "Une société de transport de personnes et de marchandises reliant Bédjondo à ses cantons, à Koumra, Moundou et N’Djamena, avec une logistique agricole — collecte des récoltes, acheminement des intrants — là où les pistes le permettent.",
        existant: [{ label: "Bedjondo Transport et Logistique (annoncé, ex-Air Bedjondo)", href: "/projets/bedjondo-transport-logistique" }, { label: "Thématique Routes & urbanisme", href: "/programmes#desenclavement-urbanisation" }, { label: "Diagnostic : pistes et routes", href: "/territoire/diagnostic" }],
        suite: "Le projet Bedjondo Transport et Logistique (annoncé sous le nom d’Air Bedjondo) deviendrait l’entreprise de transport du programme : étude des flux et des saisons, un véhicule sur un axe pour commencer, entretien et sécurité, tarifs publiés, partenariats avec les transporteurs existants plutôt que contre eux." },
      { titre: "Santé de dernière génération", texte: "Un centre hospitalier universitaire moderne, monté avec des partenaires financiers, et tout ce qui fait un système de santé complet autour de lui : urgences, maternité, pédiatrie, chirurgie, imagerie, laboratoire, pharmacie centrale, dialyse, télémédecine avec les spécialistes de la diaspora, ambulances ; une école d’infirmiers et de sages-femmes et un partenariat universitaire pour former sur place ; les centres de santé des cantons reliés au CHU, un dossier médical numérique, l’énergie solaire, l’eau, les logements du personnel, une mutuelle de santé communautaire. Les soins payants des uns financeraient les soins gratuits des autres.",
        existant: [{ label: "Thématique Santé, nutrition & prévention", href: "/programmes#sante-prevention" }, { label: "Diagnostic : la santé parmi les premiers besoins", href: "/territoire/diagnostic" }, { label: "Plaidoyers publiés", href: "/actions" }, { label: "Répertoire des compétences : médecins et soignants de la diaspora", href: "/diaspora" }, { label: "Plateforme de projets : le CHU", href: "/projets#chu-bedjondo" }],
        suite: "C’est le projet le plus lourd du portefeuille, et il se construirait par étapes : d’abord un centre médical et une pharmacie à tarif solidaire (activité 06.12 ci-dessous), puis un hôpital, puis le statut universitaire avec une faculté partenaire. Avant tout : la carte sanitaire et l’accord du ministère de la Santé, une étude de faisabilité, un montage en partenariat public-privé, un consortium de partenaires financiers — banques de développement, fondations, agences de coopération, diaspora par parts sans dividende —, un terrain, l’énergie et l’eau, la route (l’entreprise de transport), la maintenance biomédicale et, surtout, les médecins : ceux de la diaspora, ceux que l’école formerait." },
    ],
    thematiques: ["entrepreneuriat-finance-inclusive", "agriculture-elevage-securite-alimentaire", "desenclavement-urbanisation", "jeunesse-reussite", "sante-prevention", "reseau-experts-diaspora", "cellule-financement-ressources"],
    contribuer: [{ label: "Apporter une compétence : hôtellerie, enseignement, transport, santé, gestion, finance", href: "/diaspora#inscription" }, { label: "Proposer une activité génératrice de revenus", href: "/projets#proposer" }, { label: "Coordonner Routes & urbanisme", href: "/participer?theme=08&coordo=1#contact" }, { label: "Prendre la cellule Financement & ressources", href: "/participer?theme=financement&coordo=1#contact" }],
    principes: [
      { titre: "Une société, pas l’association", texte: "Une association ne partage pas de bénéfices et ne doit pas mêler ses comptes à ceux d’un commerce. Les activités seraient portées par une société distincte — société commerciale ou société coopérative du droit OHADA, qui s’applique au Tchad — détenue par l’association (demain par l’ODEB), dont les statuts affectent les bénéfices aux projets. Ni dividendes ni parts pour les membres." },
      { titre: "Les bénéfices vont aux projets, et on le voit", texte: "Chaque entreprise tient ses propres comptes et les publie chaque année ; le tableau de suivi du site montre ce qu’elle a versé au fonds des projets de développement et de bien-être. Proposition à trancher par l’assemblée : une part réinvestie dans l’entreprise, le reste versé au fonds — par exemple un tiers et deux tiers." },
      { titre: "Ce qui manque à Bédjondo, pas ce qui y existe déjà", texte: "Les entreprises visent ce qui n’existe pas ou ce qui manque de qualité ; elles ne viennent pas écraser les commerçants et les transporteurs du pays bedjond, elles travaillent avec eux. Emploi local et achats locaux d’abord ; les prix restent ceux du marché." },
      { titre: "De l’argent propre, sans promesse de rendement", texte: "Le capital viendrait des membres et de la diaspora sous forme de parts sans dividende, de partenaires et de prêts ; aucune collecte avant le compte bancaire au nom de l’association et la création de la société, aucune promesse de gain à quiconque. Un audit indépendant à partir de la deuxième année." },
      { titre: "Une entreprise à la fois", texte: "On commence par celle dont la clientèle est la plus sûre et le capital le plus faible, on la fait tourner un an, on publie ses comptes, puis on lance la suivante. Chaque activité passe par la plateforme de projets, avec son stade : idée, étude, annonce, souscription, financée, réalisation, essai, en service." },
    ],
    portefeuille: [
      { nom: "Transformation des récoltes", quoi: "Une huilerie d’arachide et de sésame, une décortiqueuse, un moulin : transformer sur place ce que le Mandoul cultive au lieu de le vendre brut.", pourquoi: "Le Mandoul est une région agricole ; la valeur ajoutée part aujourd’hui ailleurs.", revenus: "Vente d’huile, de tourteaux, de farine ; prestation de service aux producteurs.", finance: "Les projets d’eau et de santé des villages producteurs.", prealables: "Étude des volumes, énergie, local, normes sanitaires.", risque: "Approvisionnement irrégulier selon les saisons et les prix.", thematiques: ["agriculture-elevage-securite-alimentaire", "entrepreneuriat-finance-inclusive"] },
      { nom: "Stockage et vente groupée", quoi: "Des magasins de stockage où les producteurs déposent leurs récoltes et les vendent en contre-saison, à meilleur prix, avec une avance possible (warrantage).", pourquoi: "Les récoltes se vendent au plus bas, à la récolte, faute de stockage.", revenus: "Frais de stockage, marge sur la vente groupée.", finance: "Le fonds de bourses du collège-internat.", prealables: "Entrepôts, pesage, règles claires, partenariat avec une institution financière agréée.", risque: "Gestion des stocks et des impayés.", thematiques: ["agriculture-elevage-securite-alimentaire", "entrepreneuriat-finance-inclusive"] },
      { nom: "Ferme agro-pastorale modèle", quoi: "Embouche bovine et caprine, aviculture, maraîchage irrigué, doublés d’un centre de formation pratique pour les jeunes.", pourquoi: "Former en produisant, et montrer ce que donnent de meilleures pratiques.", revenus: "Vente de bétail, d’œufs, de légumes ; formations payantes pour les projets financés.", finance: "Les projets des cantons ruraux.", prealables: "Terrain, eau, vétérinaire, semences ; accord des chefs de terre.", risque: "Épizooties, sécheresse, vols.", thematiques: ["agriculture-elevage-securite-alimentaire", "jeunesse-reussite"] },
      { nom: "Matériaux de construction", quoi: "Une briqueterie (briques de terre stabilisée, parpaings) et un atelier de menuiserie qui fournissent d’abord les chantiers du programme — hôtel, collège — puis les particuliers.", pourquoi: "Les chantiers du programme pourraient s’y fournir, après mise en concurrence et dans le respect des règles d’achat de leurs financeurs ; qui y aurait un intérêt personnel ou familial le déclarerait et ne prendrait pas part à la décision, comme le veut la charte de redevabilité. Le reste se vend.", revenus: "Vente de briques, de charpentes, de portes et fenêtres.", finance: "Le réinvestissement dans les chantiers suivants.", prealables: "Presse à briques, carrière autorisée, formation.", risque: "Concurrence des matériaux importés, saisonnalité.", thematiques: ["desenclavement-urbanisation", "competences-entrepreneuriat-numerique"] },
      { nom: "Énergie solaire de proximité", quoi: "Des kiosques de recharge et de vente d’énergie, la location-vente de kits solaires pour les foyers, puis une mini-centrale pour le marché et le centre de santé.", pourquoi: "Bédjondo et ses villages n’ont pas de réseau électrique fiable ; l’énergie est un besoin recensé par le diagnostic.", revenus: "Recharge, abonnements, mensualités des kits.", finance: "L’électrification des écoles et des centres de santé.", prealables: "Étude de la demande, fournisseur, maintenance, autorisation.", risque: "Impayés, matériel de mauvaise qualité.", thematiques: ["energie", "entrepreneuriat-finance-inclusive"] },
      { nom: "Centre de services numériques et financiers", quoi: "Adossé à l’espace numérique communautaire : impression, photocopie, formation, télécentre, agent de mobile money, démarches en ligne.", pourquoi: "Le premier chantier de l’association (l’espace numérique) doit pouvoir payer sa connexion et son animateur.", revenus: "Services, formations, commissions d’agent.", finance: "La connexion et l’animation de l’espace numérique, puis l’académie numérique.", prealables: "L’espace numérique lui-même ; un agrément d’agent auprès d’un opérateur.", risque: "Faible pouvoir d’achat, coupures.", thematiques: ["transformation-numerique-services", "competences-entrepreneuriat-numerique"], projet: "/projets/espace-numerique" },
      { nom: "Galerie marchande et logements", quoi: "Des boutiques en location autour du marché de Bédjondo et quelques logements pour les fonctionnaires et enseignants affectés au chef-lieu.", pourquoi: "Des loyers réguliers sont le revenu le plus stable qu’une organisation puisse avoir.", revenus: "Loyers.", finance: "Le fonds de bien-être : santé, veuves, personnes handicapées.", prealables: "Foncier sécurisé, accord de la commune, construction par l’entreprise de matériaux.", risque: "Foncier contesté, vacance des locaux.", thematiques: ["desenclavement-urbanisation", "solidarite-inclusion"] },
      { nom: "Pharmacie et centre médical à tarif solidaire", quoi: "Une pharmacie agréée et un centre médical privé à tarifs modérés, dont l’excédent finance les soins gratuits des plus démunis : la première marche du CHU (axe 06.4), qui fait ses preuves avant l’hôpital.", pourquoi: "La santé est l’un des premiers besoins du diagnostic ; la qualité manque autant que l’accès.", revenus: "Ventes de médicaments, consultations, analyses, imagerie de base.", finance: "La prise en charge des indigents et la prévention.", prealables: "Agréments, pharmacien et médecin, chaîne d’approvisionnement sûre.", risque: "Médicaments contrefaits, réglementation.", thematiques: ["sante-prevention", "solidarite-inclusion"], projet: "/projets#chu-bedjondo" },
      { nom: "Station multiservices", quoi: "Carburant, pièces et réparation pour motos et véhicules, sur l’axe de Bédjondo, en appui à l’entreprise de transport.", pourquoi: "Les transporteurs du programme et ceux du pays bedjond en ont besoin sur place.", revenus: "Carburant, pièces, main-d’œuvre.", finance: "L’entretien des pistes plaidé auprès des autorités, et les projets de désenclavement.", prealables: "Agrément de distribution, cuve, sécurité, terrain.", risque: "Marges faibles, réglementation du carburant.", thematiques: ["desenclavement-urbanisation"] },
      { nom: "La boutique du pays bedjond", quoi: "Vente aux diasporas de N’Djamena et d’ailleurs de produits du terroir et de l’artisanat — huile, miel, sésame, tissus, vannerie — par commande en ligne et expédition groupée.", pourquoi: "La diaspora achète déjà ces produits par des circuits informels ; elle est la première clientèle du site.", revenus: "Marge sur les produits, expédition.", finance: "Les artisans et les groupements de femmes, puis les projets culturels.", prealables: "Producteurs partenaires, emballage, logistique (l’entreprise de transport), paiement mobile.", risque: "Qualité inégale, douanes pour l’export.", thematiques: ["leadership-feminin", "culture-patrimoine-vivant", "transformation-numerique-services"] },
      { nom: "Caisse d’épargne et de crédit communautaire", quoi: "À plus long terme, une institution de microfinance agréée : épargne des membres, crédit aux petites activités, sous licence et contrôle.", pourquoi: "Aucune des activités ci-dessus ne démarre sans crédit ; la thématique Entrepreneuriat & finance inclusive le dit.", revenus: "Intérêts et frais, plafonnés.", finance: "Le crédit aux jeunes et aux femmes entrepreneurs.", prealables: "Agrément de la COBAC, capital minimal, gestionnaires formés : plusieurs années.", risque: "Le plus réglementé et le plus exposé de tous ; à ne tenter qu’une fois les autres entreprises stables.", thematiques: ["entrepreneuriat-finance-inclusive", "leadership-feminin"] },
    ],
    etapes: [
      { periode: "2027-2028", titre: "Études et cadre", texte: "Études de faisabilité des quatre entreprises phares — pour le CHU, la carte sanitaire, l’accord du ministère et la recherche des partenaires financiers ; choix de la forme juridique et rédaction des statuts de la société de développement ; règle d’affectation des bénéfices votée par l’assemblée ; compte bancaire et récépissé de l’association d’abord." },
      { periode: "2028-2029", titre: "Première entreprise", texte: "Création de la société, souscription des parts sans dividende, lancement de l’activité la plus sûre et la moins coûteuse ; premiers comptes publiés au bout d’un an." },
      { periode: "2029-2030", titre: "Deuxième et troisième", texte: "Une entreprise par an si la précédente tient ; le portefeuille se complète par les activités qui ont trouvé leur porteur ; l’ODEB constituée en hérite avec ses règles." },
    ],
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
        { titre: "Six pôles, vingt-deux thématiques, deux cellules", etat: c.vacantes + c.cellulesVacantes ? "en-cours" : "fait", note: `${c.pourvues} coordinations pourvues sur ${c.total}${c.vacantes ? ` ; ${c.vacantes} ${pluriel(c.vacantes, "thématique reste", "thématiques restent")} à pourvoir` : ""}${c.cellulesVacantes ? (c.cellulesVacantes === 1 ? ", et une des deux cellules" : ", et les deux cellules") : ""}`, href: "/programmes" },
        { titre: "Le site lonodji.org", etat: "fait", note: `${c.pages} pages, ${c.articles} articles, ${c.formulaires} formulaires, une version anglaise, une appli installable`, href: "/" },
        { titre: `${enLettresMaj(c.plaidoyers)} dossiers de plaidoyer publiés`, etat: c.plaidoyersEnvoyes ? "fait" : "en-cours", note: c.plaidoyersEnvoyes ? `${c.plaidoyersEnvoyes} sur ${c.plaidoyers} transmis à leurs destinataires` : "publiés, aucun encore transmis : les lettres attendent la signature du bureau", href: "/actions" },
        { titre: "Diagnostic territorial", etat: "fait", note: `${c.problematiques} problématiques, ${c.chantiersPrioritaires} chantiers prioritaires, huit enquêtes de terrain`, href: "/territoire/diagnostic" },
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
        { titre: "Bibliothèque numérique bedjond", etat: "fait", note: `première version : ${c.references} références, ${c.chercheurs} chercheurs, dépôt de document`, href: "/bibliotheque" },
        { titre: "Plateforme de projets", etat: "fait", note: `ouverte le 28 septembre 2026 : ${enLettresMin(c.projets)} projets décrits avec leur stade, ce qui manque et comment contribuer, ${enLettresMin(c.projetsActifs)} ${pluriel(c.projetsActifs, "actif", "actifs")}, aucun financé ; formulaire pour en proposer`, href: "/projets" },
        { titre: "« Histoire et origines des peuples bedjonds »", etat: "a-venir", note: "publication en chapitres, PDF et glossaire dès transmission du manuscrit", href: "/odeb/programmes/memoire-patrimoine" },
        { titre: "Banque d’images : cent photographies", etat: "en-cours", note: "action 1.2 du plan d’action ; aucune photo publiée à ce jour, les envois sont ouverts", href: "/temoignages" },
        { titre: "Conversion en ONG sous le nom ODEB LONODJI", etat: "a-decider", note: "décision annoncée, aucun dossier déposé ; la démarche est décrite pas à pas", href: "/association/demarches#vers-ong" },
        { titre: "Études de faisabilité des quatre entreprises phares", etat: "a-venir", note: "complexe hôtelier, collège-lycée avec internat, transport-logistique, CHU moderne avec ses annexes : proposées le 28 septembre 2026, rien d’étudié ni de chiffré", href: "/odeb/programmes/economie-sociale" },
        { titre: "Société de développement : forme juridique et règle d’affectation des bénéfices", etat: "a-decider", note: "société commerciale ou coopérative distincte de l’association ; part réinvestie et part versée aux projets, à voter par l’assemblée", href: "/odeb/programmes/economie-sociale#principes" },
      ],
    },
    {
      id: "phase-3", periode: "Phase 3 · 18 à 36 mois", titre: "L’observatoire et l’académie",
      texte: "De 2028 à 2029 : ce qui fait d’un site une organisation — un observatoire du Mandoul Occidental, un patrimoine vivant en images et en sons, une académie numérique, une application complète.",
      chantiers: [
        { titre: "Observatoire du Mandoul Occidental", etat: "en-cours", note: "première version ouverte le 28 septembre 2026 : localités, équipements, couverture, diagnostic et plaidoyers par unité ; besoins résolus et population attendus", href: "/observatoire" },
        { titre: "Patrimoine vivant multimédia", etat: "a-venir", note: "bibliothèque orale, centre de mémoire vivante, musée numérique ; le formulaire de témoignages est ouvert ; aucun envoi à ce jour", href: "/temoignages" },
        { titre: "Académie numérique", etat: "a-venir", note: "dans l’espace numérique communautaire, ouvert aux promesses de contribution, sans paiement", href: "/projets/espace-numerique" },
        { titre: "Application mobile complète", etat: "en-cours", note: "version d’essai Android en ligne ; boutiques et cotisation par mobile money après le récépissé et le compte", href: "/projets/application" },
        { titre: "Atlas patrimonial : lieux sacrés et sépultures", etat: "a-decider", note: "la règle actuelle est de ne rien publier ; toute couche patrimoniale de la carte suppose une décision de l’association", href: "/patrimoine/lieux-sacres" },
        { titre: "Première entreprise de développement en service", etat: "a-venir", note: "la plus sûre et la moins coûteuse d’abord ; comptes publiés au bout d’un an, bénéfices versés au fonds des projets", href: "/odeb/programmes/economie-sociale#etapes" },
      ],
    },
    {
      id: "2028", periode: "2028", titre: "Bilan du plan d’action 2026-2028",
      texte: "Le plan d’action se termine : ses six indicateurs sont publiés avec leur évolution, et le rapport annuel prévu par les recommandations dit ce qui a été fait, ce qui ne l’a pas été, et pourquoi.",
      chantiers: [
        { titre: "Six indicateurs de suivi, trois années", etat: "a-venir", note: "adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets actifs : ce que fait l’association, pas encore les changements pour les habitants", href: "/impact" },
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
