/* Organisation de l'association, décidée le 1er octobre 2026. Huit propositions tirées d'un benchmark de la structure
   (4 pôles, 21 thématiques, 2 cellules) comparée à dix organisations et cadres, soumises au bureau exécutif et adoptées
   par lui le même jour (registre : /transparence/decisions, entrées 2026-30 et 2026-31). Page :
   /association/propositions-organisation. La structure elle-même (cinq pôles, vice-présidences, cellule Financement)
   est dans scripts/import-legacy.py (structure_01_10, DIRECTIONS_POLES, NOMINATIONS). */
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

export const DATE_DECISION = "1er octobre 2026";

export type Recommandation = { id: string; titre: string; texte: string; change: string; sources: string[]; applique?: string };

export const RECOMMANDATIONS: Recommandation[] = [
  { id: "r1", titre: "Peu de thématiques prioritaires à la fois",
    texte: "Les vingt et une thématiques restent la carte des sujets de l’association, mais cinq à sept seulement sont « prioritaires » à la fois, chacune avec un plan annuel, au moins deux membres et un compte rendu. Une thématique devient prioritaire quand une action démarre, pas avant.",
    change: "Les sept thématiques qui portent nos huit dossiers de plaidoyer sont les premières prioritaires (ci-dessous) ; les autres restent ouvertes, en veille.",
    sources: ["cvd", "mandjafa", "rotary", "caderkaf"],
    applique: "Sur la page Nos actions, chaque thématique prioritaire porte la mention « Thématique prioritaire » ; le modèle de plan annuel, prérempli, est adopté le même jour (décision 2026-34) et attend ses titulaires." },
  { id: "r2", titre: "Le pôle II scindé en deux",
    texte: "Le pôle Développement humain & moyens d’existence portait onze thématiques sur vingt et une, et les cinq postes vacants. Il est scindé : le pôle II devient « Services essentiels » (07 Eau, assainissement & hygiène, 09 Éducation, 10 Genre, 11 Santé, 12 Protection sociale) ; un pôle V, « Économie, territoire & risques », réunit 04 Agriculture, 05 Entrepreneuriat, 06 Environnement, 08 Routes & urbanisme, 20 Urgences & risques et 21 Énergie.",
    change: "Cinq pôles au lieu de quatre ; aucune thématique supprimée ni renumérotée. Plus de redécoupage pendant au moins un trimestre.",
    sources: ["chari", "fafd", "mandjafa"],
    applique: "Cinq pôles sur la page Nos actions ; la vice-présidence du pôle V est à pourvoir." },
  { id: "r3", titre: "La cellule Financement tenue par le bureau",
    texte: "Chez toutes les associations comparées, l’argent relève du bureau élu. La cellule Financement & ressources, vacante, est confiée par intérim à la trésorière élue, Élisabeth Neloumngaye Ndodinguem ; un commissaire aux comptes sera prévu avant toute réouverture de la collecte.",
    change: "La cellule n’est plus un poste vacant ; la collecte reste suspendue jusqu’aux trois conditions déjà publiées.",
    sources: ["caderkaf", "mandjafa", "cvd", "moyenchari"],
    applique: "La cellule figure comme pourvue, par intérim, sur la page Nos actions." },
  { id: "r4", titre: "Une fonction « Projets, suivi & redevabilité »",
    texte: "Les comparables ont une fonction pour monter les dossiers, suivre les actions et rendre compte. Chez nous, elle devient une mission du secrétariat général : montage des dossiers, tableau de suivi et rapport annuel.",
    change: "Le tableau de suivi et les engagements publics ont quelqu’un qui en répond, sans créer de poste vacant de plus.",
    sources: ["fafd", "caderkaf", "forim", "cvd"] },
  { id: "r5", titre: "Des vice-présidences de pôle, élues",
    texte: "Le titre « au rang de chef de projet » venait des ONG salariées. Les directions de pôle deviennent des vice-présidences déléguées, pourvues par élection : des élus qui réunissent leurs coordonnateurs chaque trimestre. Le rang de chef de projet est réservé à la future ONG, quand elle aura des moyens.",
    change: "Les deux titulaires, le Dr Bé-Rammaj Miaro-II (pôle I) et Franco Joseph Ngarlena (pôle II), gardent leur fonction sous le nouvel intitulé ; les vice-présidences des pôles III, IV et V seront pourvues par élection.",
    sources: ["forim", "caderkaf"],
    applique: "Intitulé changé sur la page Nos actions, les fiches de mission et le formulaire de candidature ; procédure d’élection adoptée le même jour (décision 2026-33) : candidatures du 2 au 15 octobre 2026, vote le 22 octobre." },
  { id: "r6", titre: "Une personne, une thématique, un adjoint",
    texte: "Une personne coordonne une seule thématique, et chaque thématique prioritaire a un titulaire et un adjoint, pour que rien ne dépende d’une seule personne.",
    change: "Les cumuls actuels sont revus par le bureau avec les personnes concernées ; personne n’est retiré de son poste par cette décision. Les adjoints des thématiques prioritaires sont recherchés dès maintenant.",
    sources: ["cvd", "caderkaf"],
    applique: "Chaque thématique prioritaire propose, sur la page Nos actions, de devenir adjoint." },
  { id: "r7", titre: "Une seule grille de pilotage",
    texte: "Le site superposait quatre grilles : pôles et thématiques, six missions et six programmes du projet ODEB, dix-sept secteurs. On pilote désormais par pôles et thématiques seulement ; programmes et secteurs sont des tables de correspondance ; le genre et le climat deviennent des critères de chaque action, en plus des thématiques 10 et 06.",
    change: "Une seule organisation à suivre, à rendre compte et à présenter aux partenaires.",
    sources: ["iasc", "fafd"],
    applique: "Les pages des programmes ODEB et des secteurs le disent en tête." },
  { id: "r8", titre: "Se caler sur le plan de la commune",
    texte: "Les plans tchadiens raisonnent en trois axes (département) ou en sept commissions (canton), et associent les services techniques de l’État. Chaque thématique prioritaire est rattachée à un chantier de nos propositions à la commune et au futur plan de développement communal ; un agent du service technique concerné y sera invité.",
    change: "Le tableau ci-dessous fait ce rattachement pour les sept thématiques prioritaires.",
    sources: ["grdr", "mandjafa", "chari"],
    applique: "Rattachement affiché sur cette page." },
];

/* Décisions 1 et 8 : les sept thématiques prioritaires (celles qui portent les huit dossiers de plaidoyer), et le chantier
   de la commune qu'elles servent. */
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

export const estPrioritaire = (id: string) => PRIORITAIRES.some((p) => p.id === id);
