/* Propositions d'organisation du 1er octobre 2026, tirées d'un benchmark de la structure (4 pôles, 21 thématiques,
   2 cellules) comparée à dix organisations et cadres. Ce sont des PROPOSITIONS soumises au bureau exécutif : rien
   n'est décidé, et la structure publiée sur /programmes ne change pas tant qu'il n'a pas tranché.
   Page : /association/propositions-organisation ; registre : /transparence/decisions (entrée 2026-30). */

export type Source = { id: string; titre: string; editeur: string; href: string };

export const SOURCES: Record<string, Source> = {
  forim: { id: "forim", titre: "Notre organisation", editeur: "FORIM (France)", href: "https://forim.net/notre-organisation/" },
  caderkaf: { id: "caderkaf", titre: "Répertoire des associations de la région de Kayes en France — CADERKAF", editeur: "GRDR", href: "https://grdr.org/IMG/pdf/CADERKAF_17-12-13_BD.pdf" },
  grdr: { id: "grdr", titre: "Les associations villageoises de migrants dans le développement communal (Traverses n° 10, 2001)", editeur: "GRDR", href: "https://grdr.org/IMG/pdf/traverse_10_GRDR_migrant.pdf" },
  fafd: { id: "fafd", titre: "À propos de nous ; plan stratégique 2026-2030", editeur: "FAFD (Sénégal)", href: "https://fafd.info/a-propos-de-nous/" },
  moyenchari: { id: "moyenchari", titre: "Association Moyen-Chari", editeur: "Association Moyen-Chari (France, Tchad)", href: "https://www.associationmoyenchari.org/" },
  chefferies: { id: "chefferies", titre: "La Route des Chefferies", editeur: "La Route des Chefferies (Cameroun)", href: "https://routedeschefferies.com/la-route-des-chefferies.html" },
  mandjafa: { id: "mandjafa", titre: "Plan de développement local du canton Mandjafa 2014-2017", editeur: "République du Tchad", href: "https://www.eeas.europa.eu/sites/default/files/pdl_mandjafa.pdf" },
  chari: { id: "chari", titre: "Plan de développement départemental du Chari (validé le 31 août 2024)", editeur: "Département du Chari, Tchad", href: "https://accept-tchad.org/fileadmin/user_upload/accept/Outils_aide_decision/PDD_CHARI_Version_Validee_CDA_31_08_2024.pdf" },
  cvd: { id: "cvd", titre: "Décret n° 2007-032 sur les conseils villageois de développement", editeur: "Burkina Faso", href: "https://faolex.fao.org/docs/pdf/bkf148394.pdf" },
  rotary: { id: "rotary", titre: "Supporting the Environment: Seventh Area of Focus", editeur: "Rotary, district 5770", href: "https://www.rotary5770.com/stories/supporting-the-environment-seventh-area-of-focus" },
  iasc: { id: "iasc", titre: "Humanitarian Cluster System", editeur: "Wikipédia (en)", href: "https://en.wikipedia.org/wiki/Humanitarian_Cluster_System" },
};

/* Nombre de grands domaines par organisation comparée (sources ci-dessus, lues le 1er octobre 2026). */
export const COMPARES: { nom: string; domaines: number; unite: string; genre: "benevole" | "mondial"; source: string }[] = [
  { nom: "CADERKAF (diaspora de Kayes, France et Mali)", domaines: 8, unite: "portefeuilles", genre: "benevole", source: "caderkaf" },
  { nom: "Plan de développement local de Mandjafa (Tchad)", domaines: 7, unite: "commissions", genre: "benevole", source: "mandjafa" },
  { nom: "Rotary", domaines: 7, unite: "domaines", genre: "benevole", source: "rotary" },
  { nom: "FAFD (Fouta, Sénégal), plan 2026-2030", domaines: 5, unite: "axes", genre: "benevole", source: "fafd" },
  { nom: "La Route des Chefferies (Cameroun)", domaines: 5, unite: "pôles de métiers", genre: "benevole", source: "chefferies" },
  { nom: "Association Moyen-Chari (France, Tchad)", domaines: 3, unite: "champs d’action", genre: "benevole", source: "moyenchari" },
  { nom: "Plan départemental du Chari (Tchad)", domaines: 3, unite: "axes", genre: "benevole", source: "chari" },
  { nom: "Clusters humanitaires de l’IASC (cadre mondial, agences salariées)", domaines: 11, unite: "clusters", genre: "mondial", source: "iasc" },
];

export type Recommandation = { id: string; titre: string; texte: string; change: string; sources: string[]; applique?: string };

export const RECOMMANDATIONS: Recommandation[] = [
  { id: "r1", titre: "Peu de thématiques actives à la fois",
    texte: "Garder les vingt et une thématiques comme carte des sujets, mais n’en déclarer « prioritaires » que cinq à sept à la fois, chacune avec un plan annuel, au moins deux membres et un compte rendu. Une thématique devient prioritaire quand une action démarre, pas avant.",
    change: "Les sept thématiques qui portent nos huit dossiers de plaidoyer sont proposées comme premières prioritaires (ci-dessous) ; les autres restent ouvertes, en veille.",
    sources: ["cvd", "mandjafa", "rotary", "caderkaf"],
    applique: "Affiché sur le site dès le 1er octobre 2026, comme proposition." },
  { id: "r2", titre: "Rééquilibrer le pôle II",
    texte: "Le pôle Développement humain & moyens d’existence porte onze thématiques sur vingt et une, et les cinq postes vacants. Proposition : le scinder en deux pôles, « Services essentiels » (07 Eau, assainissement & hygiène, 09 Éducation, 10 Genre, 11 Santé, 12 Protection sociale) et « Économie, territoire & risques » (04 Agriculture, 05 Entrepreneuriat, 06 Environnement, 08 Routes & urbanisme, 20 Urgences & risques, 21 Énergie).",
    change: "Cinq pôles au lieu de quatre, aucune thématique supprimée ni renumérotée. Une fois décidé, plus de redécoupage pendant au moins un trimestre.",
    sources: ["chari", "fafd", "mandjafa"] },
  { id: "r3", titre: "La cellule Financement tenue par le bureau",
    texte: "Chez toutes les associations comparées, l’argent relève du bureau élu. Proposition : confier la cellule Financement & ressources, vacante, à la trésorerie élue par intérim, et prévoir un commissaire aux comptes avant toute réouverture de la collecte.",
    change: "La cellule cesse d’être un poste vacant ; la collecte reste suspendue jusqu’aux trois conditions déjà publiées.",
    sources: ["caderkaf", "mandjafa", "cvd", "moyenchari"] },
  { id: "r4", titre: "Une fonction « Projets, suivi & redevabilité »",
    texte: "Les comparables ont une fonction pour monter les dossiers, suivre les actions et rendre compte. Proposition : une troisième cellule transversale, ou une mission du secrétariat général, chargée du montage des dossiers, du tableau de suivi et d’un rapport annuel.",
    change: "Le tableau de suivi et les engagements publics ont enfin quelqu’un qui en répond.",
    sources: ["fafd", "caderkaf", "forim", "cvd"] },
  { id: "r5", titre: "Des directions de pôle élues",
    texte: "Le titre « au rang de chef de projet » vient des ONG salariées. Proposition : faire des directions de pôle des vice-présidences déléguées — des élus qui réunissent leurs coordonnateurs chaque trimestre — et réserver le rang de chef de projet à la future ONG, quand elle aura des moyens.",
    change: "Les deux directions pourvues gardent leurs titulaires ; seul l’intitulé et le mode de désignation changeraient.",
    sources: ["forim", "caderkaf"] },
  { id: "r6", titre: "Une personne, une thématique, un adjoint",
    texte: "Proposition : une personne coordonne une seule thématique, et chaque thématique prioritaire a un titulaire et un adjoint, pour que rien ne dépende d’une seule personne.",
    change: "Les cumuls actuels seraient revus par le bureau avec les personnes concernées ; aucun titulaire n’est retiré par cette page.",
    sources: ["cvd", "caderkaf"] },
  { id: "r7", titre: "Une seule grille de pilotage",
    texte: "Le site superpose quatre grilles : pôles et thématiques, six missions et six programmes du projet ODEB, dix-sept secteurs. Proposition : piloter par pôles et thématiques seulement ; présenter programmes et secteurs comme des tables de correspondance ; faire du genre et du climat des critères de chaque action, en plus des thématiques 10 et 06.",
    change: "Les pages des programmes ODEB et des secteurs le disent désormais en tête.",
    sources: ["iasc", "fafd"],
    applique: "Affiché sur le site dès le 1er octobre 2026." },
  { id: "r8", titre: "Se caler sur le plan de la commune",
    texte: "Les plans tchadiens raisonnent en trois axes (département) ou en sept commissions (canton), et associent les services techniques de l’État. Proposition : rattacher chaque thématique prioritaire à un chantier de nos propositions à la commune et au futur plan de développement communal, et y inviter un agent du service technique concerné.",
    change: "Le tableau ci-dessous fait déjà ce rattachement pour les sept thématiques proposées.",
    sources: ["grdr", "mandjafa", "chari"],
    applique: "Rattachement affiché sur le site dès le 1er octobre 2026." },
];

/* R1 + R8 : les sept thématiques qui portent les huit dossiers de plaidoyer, et le chantier de la commune qu'elles servent. */
export const PRIORITAIRES: { id: string; plaidoyers: { label: string; href: string }[]; commune: { label: string; href: string }[] }[] = [
  { id: "eau-energie-connectivite", plaidoyers: [{ label: "Eau potable", href: "/journal/2026-09-17-plaidoyer-eau-potable-bedjondo" }],
    commune: [{ label: "Programme d’accès à l’eau potable", href: "/territoire/propositions-commune#projet-eau" }, { label: "Assainissement", href: "/territoire/propositions-commune#projet-assainissement" }] },
  { id: "energie", plaidoyers: [{ label: "Électricité", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" }],
    commune: [{ label: "Services de base : électricité", href: "/territoire/propositions-commune#services" }] },
  { id: "desenclavement-urbanisation", plaidoyers: [{ label: "Voirie et ponts", href: "/journal/2026-09-17-plaidoyer-routes-ponts-bedjondo" }],
    commune: [{ label: "Planifier la ville", href: "/territoire/propositions-commune#planifier" }] },
  { id: "sante-prevention", plaidoyers: [{ label: "Santé", href: "/journal/2026-09-17-plaidoyer-sante-bedjondo" }],
    commune: [{ label: "Services de base : santé", href: "/territoire/propositions-commune#services" }] },
  { id: "jeunesse-reussite", plaidoyers: [{ label: "École", href: "/journal/2026-09-17-plaidoyer-education-bedjondo" }, { label: "Formation professionnelle", href: "/journal/2026-09-17-plaidoyer-formation-professionnelle-bedjondo" }],
    commune: [{ label: "Maison de la Femme et de la Jeunesse", href: "/territoire/propositions-commune#projet-maison-femme-jeunesse" }, { label: "Services de base : école", href: "/territoire/propositions-commune#services" }] },
  { id: "transformation-numerique-services", plaidoyers: [{ label: "Haut débit", href: "/journal/2026-09-16-plaidoyer-internet-haut-debit-bedjondo" }],
    commune: [{ label: "Centre numérique communal", href: "/territoire/propositions-commune#projet-centre-numerique" }] },
  { id: "gouvernance-plaidoyer", plaidoyers: [{ label: "Note à la commune", href: "/journal/2026-09-16-note-commune-bedjondo" }],
    commune: [{ label: "Ouvrir le conseil", href: "/territoire/propositions-commune#ouvrir" }, { label: "Actualiser le plan de développement communal", href: "/territoire/propositions-commune#projet-pdc" }] },
];
