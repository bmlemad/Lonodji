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
