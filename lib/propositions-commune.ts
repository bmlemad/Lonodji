/* Propositions d'ADEB LONODJI à la commune de Bédjondo, regroupées (30/09/2026).
   Rien de nouveau ici : chaque ligne reprend une proposition déjà publiée — la note à la commune du 16 septembre 2026,
   l'article « Bédjondo, un village devenu ville », la section « À la commune » de chacun des sept plaidoyers,
   et les pages de fond — avec son lien. Pour ajouter une proposition : la publier d'abord dans son dossier,
   puis l'ajouter ici avec sa source. */

export type Source = { label: string; href: string };
export type Proposition = { texte: string; sources: Source[]; sansDepense?: boolean };
export type Groupe = { id: string; titre: string; em: string; intro: string; items: Proposition[] };

const NOTE = "/journal/2026-09-16-note-commune-bedjondo";
const VILLE = "/journal/2026-09-16-bedjondo-village-devenu-ville";
export const S = {
  note1: { label: "Note à la commune, § 1", href: NOTE },
  note2: { label: "Note à la commune, § 2", href: NOTE },
  note3: { label: "Note à la commune, § 3", href: NOTE },
  note4: { label: "Note à la commune, § 4", href: NOTE },
  note5: { label: "Note à la commune, § 5", href: NOTE },
  ville1: { label: "Village devenu ville, proposition 1", href: VILLE },
  ville2: { label: "Village devenu ville, proposition 2", href: VILLE },
  ville12: { label: "Village devenu ville, proposition 12", href: VILLE },
  decentralisation: { label: "Décentralisation", href: "/territoire/decentralisation" },
  eau: { label: "Plaidoyer eau potable", href: "/journal/2026-09-17-plaidoyer-eau-potable-bedjondo" },
  electricite: { label: "Plaidoyer électricité", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" },
  internet: { label: "Plaidoyer haut débit", href: "/journal/2026-09-16-plaidoyer-internet-haut-debit-bedjondo" },
  sante: { label: "Plaidoyer santé", href: "/journal/2026-09-17-plaidoyer-sante-bedjondo" },
  routes: { label: "Plaidoyer routes et ponts", href: "/journal/2026-09-17-plaidoyer-routes-ponts-bedjondo" },
  education: { label: "Plaidoyer école", href: "/journal/2026-09-17-plaidoyer-education-bedjondo" },
  formation: { label: "Plaidoyer formation professionnelle", href: "/journal/2026-09-17-plaidoyer-formation-professionnelle-bedjondo" },
  lieuxSacres: { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" },
  agriculture: { label: "Agriculture et sécurité alimentaire", href: "/programmes/agriculture-securite-alimentaire" },
  complexe: { label: "Complexe sportif", href: "/projets/complexe-sportif" },
} satisfies Record<string, Source>;

export const GROUPES: Groupe[] = [
  {
    id: "planifier", titre: "Planifier la ville", em: "avant de bâtir.",
    intro: "La loi confie à la commune le permis de construire et le domaine public ; sans plan de ville, ces compétences restent théoriques.",
    items: [
      { texte: "Rendre public le plan de développement communal : une page affichée à la mairie et diffusée en ligne, avec trois priorités datées et chiffrées, débattu en session.", sources: [S.note1, S.decentralisation], sansDepense: true },
      { texte: "L’adosser à un schéma d’aménagement simple : voies principales et secondaires, zones d’habitation, réserves pour les équipements publics, zones à ne pas bâtir.", sources: [S.note1, S.ville1] },
      { texte: "Prendre un premier arrêté gelant la construction dans les bas-fonds et les couloirs d’écoulement des eaux de pluie.", sources: [S.note1], sansDepense: true },
      { texte: "Porter sur ce schéma les périmètres des lieux sacrés et des sépultures, sur saisine de la chefferie : un contour sur un plan, sans motif ni nom, que les lotissements, pistes et chantiers respectent.", sources: [S.lieuxSacres, S.ville1] },
      { texte: "Recenser les parcelles et les concessions : un registre qui sert à la fois de cadastre, d’adressage des rues et d’assiette pour l’impôt foncier.", sources: [S.note2, S.ville2] },
      { texte: "Réserver dès maintenant, dans le plan, les emprises des équipements : extension du réseau d’eau et bornes-fontaines, voirie, terrains scolaires, terrain du centre de formation professionnelle, centrale solaire et éclairage public, espace numérique public.", sources: [S.eau, S.routes, S.education, S.formation, S.electricite, S.internet] },
      { texte: "Arrêter et afficher — en mairie, dans les cantons et sur le terrain — les couloirs de transhumance, aires de pâture et zones de culture tracés avec les chefs de canton, les agriculteurs et les éleveurs.", sources: [S.agriculture] },
    ],
  },
  {
    id: "financer", titre: "Financer,", em: "et rendre des comptes.",
    intro: "Droits de marché, patentes, impôt foncier : la transparence est ce qui convainc les habitants de payer et les partenaires de financer.",
    items: [
      { texte: "Régulariser la collecte des droits de marché : tickets numérotés, régie de recettes, affichage mensuel des sommes perçues.", sources: [S.note2, S.decentralisation] },
      { texte: "Ouvrir une ligne budgétaire « infrastructures et entretien », alimentée par une part fixe des recettes, pour que l’entretien de ce qui sera construit ne dépende pas du prochain budget.", sources: [S.note2] },
      { texte: "Y flécher notamment l’entretien des caniveaux et, pour l’éclairage solaire, celui des lampadaires et le remplacement des batteries.", sources: [S.routes, S.note5] },
      { texte: "Inscrire au budget, en attendant la solarisation du pompage, une ligne carburant sécurisée pour que la distribution d’eau ne s’arrête plus.", sources: [S.eau] },
    ],
  },
  {
    id: "ouvrir", titre: "Ouvrir le conseil,", em: "structurer les quartiers.",
    intro: "La loi organise déjà les sessions du conseil ; il ne manque souvent que la publicité.",
    items: [
      { texte: "Annoncer à l’avance les sessions du conseil, afficher l’ordre du jour, rendre les délibérations consultables ; tenir une session publique chaque trimestre.", sources: [S.note4, S.decentralisation], sansDepense: true },
      { texte: "Reconnaître par arrêté un comité de quartier dans chaque quartier : relayer les besoins, organiser les journées de salubrité, veiller à l’entretien des équipements de proximité.", sources: [S.note4] },
      { texte: "Tenir à la mairie un registre des doléances, lu en session.", sources: [S.note4] },
      { texte: "Présenter chaque année une reddition des comptes publique, lors de la cérémonie d’excellence qui rassemble déjà la ville chaque été.", sources: [S.note4] },
      { texte: "Ouvrir une page officielle de la mairie sur les réseaux sociaux ; saisir sur tableur, puis sauvegarder, les registres d’état civil et des parcelles.", sources: [S.note4] },
    ],
  },
  {
    id: "services", titre: "Les services de base,", em: "domaine par domaine.",
    intro: "Chacun de nos plaidoyers sépare ce qui relève de l’État de ce qui relève de la commune. Voici, rassemblées, les demandes adressées à la commune.",
    items: [
      { texte: "Eau — créer par arrêté un comité de gestion par point d’eau et un service communal de l’eau chargé de la maintenance, avec un tarif qui couvre l’entretien.", sources: [S.eau] },
      { texte: "Électricité — inscrire l’électrification dans le plan de développement communal et porter la demande dans les instances provinciales et nationales.", sources: [S.electricite] },
      { texte: "Haut débit — porter la demande dans les instances, prévoir une ligne pour un espace numérique public, relayer chaque avancée aux habitants.", sources: [S.internet] },
      { texte: "Santé — garantir l’eau, l’électricité solaire et l’assainissement du centre de santé ; organiser avec les chefs de quartier un relais communautaire (agents de santé communautaires, transport d’urgence).", sources: [S.sante] },
      { texte: "Voirie — inscrire un schéma de voirie et le drainage dans le plan de développement communal, réserver les emprises avant que les constructions ne les ferment, organiser avec les chefs de quartier l’entretien des voies.", sources: [S.routes] },
      { texte: "École — garantir l’eau et l’électricité solaire des établissements, soutenir l’association des parents d’élèves.", sources: [S.education] },
      { texte: "Formation professionnelle — garantir l’eau et l’électricité solaire du centre, introduire dans les marchés de la commune une clause de recours aux diplômés et artisans locaux, et passer sa première commande de mobilier scolaire et d’huisseries aux ateliers du centre.", sources: [S.formation] },
    ],
  },
  {
    id: "partenariats", titre: "Nouer des partenariats :", em: "la commune peut signer.",
    intro: "Une commune peut ce qu’une association ne peut pas : conventionner.",
    items: [
      { texte: "Solliciter formellement les programmes de la coopération suisse et de Caritas Suisse déjà actifs au Mandoul, pour que leurs prochaines réalisations soient inscrites à Bédjondo.", sources: [S.note3] },
      { texte: "Saisir l’État et la province sur le pont de l’axe Bédjondo–Békamba, demandé par les femmes de la ville dès novembre 2023.", sources: [S.note3, S.routes] },
      { texte: "Rechercher un jumelage avec une commune française ou suisse.", sources: [S.note3] },
      { texte: "Signer avec les associations des conventions écrites qui disent, pour chaque ouvrage cofinancé, qui le possède, qui l’entretient et avec quel budget — à commencer par une convention d’une page avec ADEB LONODJI.", sources: [S.note3, S.decentralisation], sansDepense: true },
      { texte: "Garantir par écrit, avec la chefferie, un terrain pour le complexe sportif, pour un usage sportif et une longue durée.", sources: [S.complexe] },
    ],
  },
  {
    id: "premier-chantier", titre: "Un premier chantier visible,", em: "en moins d’un an.",
    intro: "Une commune qui grandit a besoin d’une réussite visible pour rallier ses habitants.",
    items: [
      { texte: "L’éclairage solaire du marché et de l’axe principal : lampadaires autonomes, financés pour moitié par la commune et pour moitié par une souscription de la diaspora animée par ADEB LONODJI, avec une part des droits de marché fléchée sur l’entretien et le remplacement des batteries.", sources: [S.note5, S.electricite] },
    ],
  },
];

/* Ce que l'association apporte, et ce qu'elle demande en retour (note à la commune, § 6). */
export const APPORTS: Proposition[] = [
  { texte: "Mobiliser gratuitement les compétences de la diaspora et des cadres bedjond — urbanistes, géomètres, ingénieurs, hydrauliciens, informaticiens — pour les études que la commune ne peut financer : relevé et plan de la ville, avant-projet d’éclairage solaire, dossiers de demande de financement.", sources: [{ label: "Note à la commune, § 6", href: NOTE }] },
  { texte: "Conduire, avec les comités de quartier, le diagnostic participatif des équipements existants ; les signalements de la carte des besoins sont synthétisés pour la commune.", sources: [{ label: "Note à la commune, § 6", href: NOTE }, { label: "Carte des besoins", href: "/territoire/besoins" }] },
  { texte: "Réaliser l’inventaire des points d’eau et le relevé du réseau, et le relevé de la voirie de la ville (rues, points de stagnation des eaux, emprises encore libres).", sources: [S.eau, S.routes] },
  { texte: "Animer la souscription de la diaspora pour le premier chantier, et cofinancer avec la commune un premier ouvrage de franchissement ou une campagne de cantonnage si l’État en fournit l’encadrement technique.", sources: [{ label: "Note à la commune, § 6", href: NOTE }, S.routes] },
  { texte: "Organiser et cofinancer, avec la commune et l’état civil, une première campagne d’actes de naissance.", sources: [{ label: "Solidarité et inclusion", href: "/programmes/solidarite-inclusion" }] },
  { texte: "Installer les outils numériques de la mairie (page officielle, registres sur tableur) et former ceux qui les tiendront.", sources: [S.note4] },
  { texte: "Publier sur ce site l’avancement des engagements de chacun.", sources: [{ label: "Note à la commune, § 6", href: NOTE }] },
];

export const EN_RETOUR = [
  "un interlocuteur désigné à la mairie ;",
  "l’accès aux documents utiles : plan de développement communal, budget, registres ;",
  "une place, à titre consultatif, dans le cadre de concertation qui suivra le plan ;",
  "l’inscription de la note à l’ordre du jour d’une prochaine session, et le choix du premier chantier par lequel commencer.",
];

export const nombrePropositions = () => GROUPES.reduce((n, g) => n + g.items.length, 0);
export const nombreSansDepense = () => GROUPES.reduce((n, g) => n + g.items.filter((i) => i.sansDepense).length, 0);

/* Dix projets prioritaires proposés à la commune (proposition de l'association, 30/09/2026).
   Ce sont des propositions à débattre avec la commune : ni étude, ni budget, ni financement à ce jour.
   « deja » : ce que le site avait déjà publié sur le même sujet ; « programmes » : identifiants du relevé
   des bailleurs (lib/bailleurs.ts) dont le champ recoupe le projet — des portes à frapper, pas des financements acquis. */
export type ProjetPrioritaire = { id: string; titre: string; volets: string[]; deja: Source[]; programmes: string[]; porteur?: boolean;
  /* Ce que LONODJI pourrait apporter : uniquement des engagements déjà publiés dans nos dossiers, avec leur source ;
     sans engagement publié, « apport » reste vide et la carte le dit. */
  apport: Proposition[] };
const NOTE6: Source = { label: "Note à la commune, § 6", href: NOTE };
const SOLIDARITE: Source = { label: "Solidarité et inclusion", href: "/programmes/solidarite-inclusion" };

export const PROJETS_PRIORITAIRES: ProjetPrioritaire[] = [
  { id: "eau", titre: "Programme d’accès à l’eau potable", porteur: true,
    volets: ["Forages équipés de pompes solaires", "Réhabilitation des points d’eau existants", "Comités locaux de gestion de l’eau"],
    deja: [S.eau, { label: "Village devenu ville, proposition 4", href: VILLE }], programmes: ["paepa-2", "unicef", "nexsud", "hnrp"],
    apport: [
      { texte: "l’inventaire des points d’eau (état, débit, comité de gestion) et le relevé du réseau existant", sources: [S.eau] },
      { texte: "la réparation d’urgence, avec la diaspora, des forages en panne relevés par l’inventaire, et la formation d’artisans réparateurs", sources: [S.eau] },
      { texte: "l’appui aux comités de gestion et leur formation à la tenue des comptes", sources: [S.eau] },
    ] },
  { id: "marche", titre: "Marché moderne intercommunautaire", porteur: true,
    volets: ["Construction d’un marché couvert", "Espaces de stockage et de conservation", "Aires de vente pour les femmes commerçantes"],
    deja: [{ label: "Village devenu ville, proposition 7", href: VILLE }, S.note5], programmes: ["ddc-collectivites", "pea"],
    apport: [
      { texte: "les études et le dossier de demande de financement, confiés gratuitement aux compétences de la diaspora", sources: [NOTE6] },
      { texte: "la souscription de la diaspora pour l’éclairage solaire du marché, premier chantier proposé", sources: [S.note5] },
    ] },
  { id: "transformation", titre: "Centre de transformation agricole", porteur: true,
    volets: ["Transformation du manioc, du maïs, de l’arachide et du sésame", "Formation des coopératives", "Création de valeur ajoutée locale"],
    deja: [S.agriculture], programmes: ["sodefika", "pea", "renfort", "pfnl"],
    apport: [
      { texte: "le recensement des producteurs, des surfaces et des groupements, canton par canton, remis aux services agricoles et aux programmes", sources: [S.agriculture] },
      { texte: "le recensement des ateliers et des maîtres artisans, métier par métier", sources: [S.formation] },
    ] },
  { id: "maison-femme-jeunesse", titre: "Maison de la Femme et de la Jeunesse", porteur: true,
    volets: ["Formation professionnelle", "Alphabétisation fonctionnelle", "Appui à l’entrepreneuriat"],
    deja: [S.formation], programmes: ["swedd", "renfort", "corridor-competences"],
    apport: [
      { texte: "un atelier-école pilote en installation solaire, avec les ingénieurs et techniciens de la diaspora", sources: [S.formation] },
      { texte: "un réseau de parrainage des élèves par les cadres et étudiants bedjond, et un fonds de bourses", sources: [S.education] },
      { texte: "l’ouverture du fonds de bourses en priorité aux orphelins et aux jeunes mères qui reprennent leur scolarité", sources: [SOLIDARITE] },
    ] },
  { id: "assainissement", titre: "Programme communal d’assainissement",
    volets: ["Collecte et traitement des déchets", "Sensibilisation à l’hygiène", "Création d’emplois verts"],
    deja: [{ label: "Village devenu ville, proposition 6", href: VILLE }, { label: "Diagnostic : assainissement", href: "/territoire/diagnostic#prob-12" }], programmes: ["unicef", "hnrp"],
    apport: [] },
  { id: "centre-numerique", titre: "Centre numérique communal", porteur: true,
    volets: ["Services administratifs numérisés", "Formation aux compétences numériques", "Accès à Internet pour les jeunes"],
    deja: [{ label: "Projet : espace numérique", href: "/projets/espace-numerique" }, S.internet], programmes: ["patn"],
    apport: [
      { texte: "le cofinancement, avec la diaspora, d’un premier espace numérique communautaire (connexion satellitaire, alimentation solaire), ouvert aussi aux services de la commune", sources: [S.internet, { label: "Projet : espace numérique", href: "/projets/espace-numerique" }] },
      { texte: "l’installation des outils numériques de la mairie et la formation de ceux qui les tiendront", sources: [S.note4] },
      { texte: "la formation de jeunes de la ville à l’entretien des équipements", sources: [S.internet] },
    ] },
  { id: "maraichage", titre: "Périmètres maraîchers irrigués",
    volets: ["Irrigation solaire", "Production toute saison", "Coopératives de femmes et de jeunes"],
    deja: [S.agriculture], programmes: ["renfort", "nexsud"],
    apport: [
      { texte: "le recensement des producteurs, des surfaces et des groupements, canton par canton", sources: [S.agriculture] },
      { texte: "la formation de jeunes à l’installation et à la maintenance solaire, utile à l’irrigation", sources: [S.electricite] },
    ] },
  { id: "reboisement", titre: "Reboisement et protection de l’environnement",
    volets: ["Bois communaux", "Lutte contre la déforestation", "Valorisation des produits forestiers"],
    deja: [{ label: "Environnement et ressources", href: "/programmes/environnement" }], programmes: ["pfnl"],
    apport: [] },
  { id: "fonds-microprojets", titre: "Fonds communal d’appui aux microprojets",
    volets: ["Financement des initiatives locales", "Appui aux groupements", "Développement de l’économie locale"],
    deja: [], programmes: ["ddc-collectivites", "renfort", "swedd"],
    apport: [
      { texte: "la proposition, en assemblée générale, d’une caisse de solidarité avec règlement écrit et trésorier désigné", sources: [SOLIDARITE] },
      { texte: "le recensement, avec l’accord des intéressés, des groupes de tontine déjà actifs, et la recherche d’une institution de microfinance intervenant dans le Mandoul", sources: [SOLIDARITE] },
    ] },
  { id: "pdc", titre: "Actualisation du Plan de développement communal",
    volets: ["Diagnostic participatif", "Planification des investissements", "Mobilisation des partenaires techniques et financiers"],
    deja: [S.note1, S.ville12], programmes: ["pnud-rgdl", "ddc-collectivites", "unicef"],
    apport: [
      { texte: "le diagnostic participatif des équipements existants, avec les comités de quartier, et la synthèse des signalements de la carte des besoins", sources: [NOTE6, { label: "Carte des besoins", href: "/territoire/besoins" }] },
      { texte: "le relevé et le plan de la ville, par les urbanistes et géomètres de la diaspora", sources: [NOTE6] },
      { texte: "les dossiers de demande de financement auprès des partenaires", sources: [NOTE6] },
    ] },
];

/* Les trois ensembles jugés les plus porteurs pour un financement, et le projet intégré recommandé. */
export const PORTEURS = [
  { titre: "L’eau potable et l’énergie solaire", projets: ["eau"] },
  { titre: "Le centre de transformation agricole et le marché moderne", projets: ["transformation", "marche"] },
  { titre: "La Maison de la Femme et de la Jeunesse, avec son centre numérique", projets: ["maison-femme-jeunesse", "centre-numerique"] },
];
export const PROJET_INTEGRE = {
  titre: "Un projet intégré de développement économique local",
  composantes: ["un marché moderne", "un centre de transformation agricole", "des forages solaires", "un fonds d’appui aux jeunes et aux femmes"],
  pourquoi: "Ces projets combinent création d’emplois, réduction de la pauvreté, autonomisation des femmes et des jeunes et développement économique local : c’est le type de projet que les partenaires du développement local — PNUD, Banque mondiale, AFD — financent le plus souvent, par l’intermédiaire des communes et des ministères.",
};

/* La démarche avec la commune et les autorités locales (30/09/2026) : ce que l'association fera, dans l'ordre.
   « etat » dit où en est chaque étape ; à mettre à jour au fil des rencontres (et au journal des décisions). */
export const DEMARCHE: { etape: string; texte: string; etat: string }[] = [
  { etape: "Se mettre en règle", texte: "Récépissé à jour, bureau reconnu, compte bancaire au nom de l’association, et un point focal qui réside à Bédjondo : sans cela, aucune convention ne peut être signée.", etat: "en cours" },
  { etape: "Ouvrir le dialogue", texte: "Une audience chez le maire pour remettre la note et ces propositions ; des visites au préfet du Mandoul Occidental, au sous-préfet de Péni, aux chefs de canton de Bébopen, Nderguigui et Yomi et à la chefferie de Bédjondo.", etat: "à venir" },
  { etape: "Formaliser par écrit", texte: "Une convention-cadre d’une page — engagements de chacun, propriété et entretien des ouvrages, publication — et un comité de concertation trimestriel : mairie, association, autorités administratives et traditionnelles, femmes et jeunes.", etat: "à venir" },
  { etape: "Un premier résultat en six mois", texte: "Le diagnostic participatif et l’inventaire des points d’eau remis à la commune, ou les outils numériques de la mairie ; puis l’éclairage solaire du marché, premier chantier visible.", etat: "à venir" },
  { etape: "Chercher les financements avec la commune", texte: "La commune porte, l’association prépare : Bédjondo proposée comme commune pilote de l’appui suisse aux collectivités et du programme de gouvernance locale du PNUD.", etat: "à venir" },
];
export const REGLES_DEMARCHE = [
  "ni parti ni candidat, et aucune substitution à la commune ou aux chefferies ;",
  "aucune collecte d’argent avant l’ouverture d’un compte au nom de l’association ;",
  "rien de promis qui ne soit écrit ;",
  "chaque rencontre et chaque accord publiés et datés sur ce site.",
];
