/* Secteurs d'intervention : les vingt thématiques de l'association lues dans la
   langue des ONG de développement et d'aide (clusters humanitaires de l'IASC,
   codes-objet du CAD de l'OCDE, ODD). Chaque activité dit son état réel :
   « fait » quand un document ou une page existe (lien), « piste » quand ce n'est
   qu'envisagé. Rien n'est chiffré ni engagé au-delà de ce que le site montre.
   Page : /secteurs (et /en/sectors). */

export type EtatSecteur = "couvert" | "elargi" | "nouveau";
export type Activite = { texte: string; etat: "fait" | "piste"; href?: string };
export type Secteur = {
  id: string;
  groupe: "essentiels" | "existence" | "urgences" | "droits" | "singularites";
  nom: string;
  sigle: string; // l'étiquette que les partenaires emploient
  en: string;
  enTexte: string;
  cadre: { cluster?: string; cad: string; odd: string };
  etat: EtatSecteur;
  thematiques: string[]; // identifiants de content/index.json
  activites: Activite[];
};

export const GROUPES_SECTEURS: { id: Secteur["groupe"]; nom: string; en: string; texte: string }[] = [
  { id: "essentiels", nom: "Services essentiels", en: "Essential services", texte: "Ce que les ONG appellent les services sociaux de base : l’eau, l’hygiène, la santé, la nutrition, l’école." },
  { id: "existence", nom: "Moyens d’existence et territoire", en: "Livelihoods and territory", texte: "Nourrir, gagner sa vie, protéger les terres, désenclaver : le développement au sens économique." },
  { id: "urgences", nom: "Urgences et résilience", en: "Emergencies and resilience", texte: "Se préparer aux crises et, quand elles arrivent, informer, orienter et relayer plutôt que doubler les acteurs humanitaires." },
  { id: "droits", nom: "Protection, droits et gouvernance", en: "Protection, rights and governance", texte: "Protéger les plus exposés, défendre les droits, plaider auprès de ceux qui décident, garder la paix." },
  { id: "singularites", nom: "Ce que peu d’ONG font", en: "What few NGOs do", texte: "Trois secteurs où l’association va plus loin que la norme : la mémoire, le numérique et la diaspora." },
];

export const ETATS_SECTEUR: Record<EtatSecteur, { label: string; en: string }> = {
  couvert: { label: "Couvert", en: "Covered" },
  elargi: { label: "Élargi le 29 septembre 2026", en: "Extended on 29 September 2026" },
  nouveau: { label: "Nouveau le 29 septembre 2026", en: "New on 29 September 2026" },
};

const P = "/journal/2026-09-17-plaidoyer-";

export const SECTEURS: Secteur[] = [
  {
    id: "wash", groupe: "essentiels", nom: "Eau, assainissement et hygiène", sigle: "WASH / EAH", en: "Water, sanitation and hygiene (WASH)",
    enTexte: "Drinking water in every neighbourhood, latrines and handwashing at school and at the market, waste and wastewater.",
    cadre: { cluster: "Cluster WASH", cad: "CAD 140", odd: "ODD 6" }, etat: "elargi",
    thematiques: ["eau-energie-connectivite", "sante-prevention"],
    activites: [
      { texte: "Plaidoyer : de l’eau potable pour chaque quartier de Bédjondo", etat: "fait", href: `${P}eau-potable-bedjondo` },
      { texte: "Recenser les besoins en eau, localité par localité", etat: "fait", href: "/dossiers/besoins" },
      { texte: "Latrines et lavage des mains à l’école et au marché", etat: "piste" },
      { texte: "Gestion des déchets et des eaux usées avec la commune", etat: "piste" },
    ],
  },
  {
    id: "sante", groupe: "essentiels", nom: "Santé", sigle: "Santé", en: "Health",
    enTexte: "A health advocacy brief tracked indicator by indicator, prevention campaigns, and a staged hospital idea.",
    cadre: { cluster: "Cluster Santé", cad: "CAD 121-122", odd: "ODD 3" }, etat: "couvert",
    thematiques: ["sante-prevention"],
    activites: [
      { texte: "Plaidoyer : soigner à Bédjondo — maternité, chaîne du froid, laboratoire, ambulance", etat: "fait", href: `${P}sante-bedjondo` },
      { texte: "Prévention : l’alcool frelaté, l’hygiène", etat: "piste" },
      { texte: "Centre médical puis hôpital, en étapes (programme 06)", etat: "piste", href: "/projets#chu-bedjondo" },
    ],
  },
  {
    id: "nutrition", groupe: "essentiels", nom: "Nutrition", sigle: "Nutrition", en: "Nutrition",
    enTexte: "Screening young children for malnutrition, feeding pregnant and breastfeeding women, with the health centres and farmers.",
    cadre: { cluster: "Cluster Nutrition", cad: "CAD 12240", odd: "ODD 2" }, etat: "elargi",
    thematiques: ["sante-prevention", "agriculture-elevage-securite-alimentaire"],
    activites: [
      { texte: "Dépistage de la malnutrition des jeunes enfants, avec les centres de santé", etat: "piste" },
      { texte: "Alimentation des femmes enceintes et allaitantes", etat: "piste" },
      { texte: "Lien avec les cultures et l’élevage du pays bedjond", etat: "piste", href: "/dossiers/agriculture-securite-alimentaire" },
    ],
  },
  {
    id: "education", groupe: "essentiels", nom: "Éducation et formation", sigle: "Éducation", en: "Education and training",
    enTexte: "School and vocational-training advocacy, libraries, digital skills, a boarding school idea.",
    cadre: { cluster: "Cluster Éducation", cad: "CAD 110", odd: "ODD 4" }, etat: "couvert",
    thematiques: ["jeunesse-reussite", "competences-entrepreneuriat-numerique", "savoirs-innovation"],
    activites: [
      { texte: "Plaidoyer : une école à la hauteur des enfants de Bédjondo", etat: "fait", href: `${P}education-bedjondo` },
      { texte: "Plaidoyer : faire vivre le centre de formation professionnelle", etat: "fait", href: `${P}formation-professionnelle-bedjondo` },
      { texte: "Un fonds bedjond et sara pour les bibliothèques du Mandoul Occidental", etat: "fait", href: "/journal/2026-09-16-bibliotheques-mandoul-occidental" },
      { texte: "Collège-lycée avec internat dès la sixième (programme 06)", etat: "piste", href: "/projets#complexe-scolaire-internat" },
    ],
  },
  {
    id: "fsl", groupe: "existence", nom: "Sécurité alimentaire", sigle: "FSL", en: "Food security",
    enTexte: "Cooperatives and local value chains, storage and group sales, a model farm.",
    cadre: { cluster: "Cluster Sécurité alimentaire", cad: "CAD 311", odd: "ODD 2" }, etat: "couvert",
    thematiques: ["agriculture-elevage-securite-alimentaire"],
    activites: [
      { texte: "Hub filières et appuis techniques", etat: "fait", href: "/dossiers/agriculture-securite-alimentaire" },
      { texte: "Agriculteurs et éleveurs : prévenir les conflits", etat: "fait", href: "/dossiers/agriculteurs-eleveurs" },
      { texte: "Stockage, vente groupée, transformation des récoltes (programme 06)", etat: "piste", href: "/odeb/programmes/economie-sociale#portefeuille" },
    ],
  },
  {
    id: "livelihoods", groupe: "existence", nom: "Moyens d’existence et inclusion financière", sigle: "Livelihoods", en: "Livelihoods and financial inclusion",
    enTexte: "A mutual-aid fund, savings groups, microcredit, digital entrepreneurship, social businesses whose profits fund projects.",
    cadre: { cluster: "Relèvement précoce", cad: "CAD 240-250", odd: "ODD 1 · 8" }, etat: "couvert",
    thematiques: ["entrepreneuriat-finance-inclusive", "solidarite-inclusion", "competences-entrepreneuriat-numerique"],
    activites: [
      { texte: "Une caisse d’entraide entre membres", etat: "fait", href: "/journal/2026-09-14-caisse-entraide-solidarite-en-acte" },
      { texte: "Tontines et microcrédit", etat: "piste", href: "/dossiers/solidarite-inclusion#entraide-economique" },
      { texte: "Entreprises d’économie sociale (programme 06)", etat: "piste", href: "/odeb/programmes/economie-sociale" },
    ],
  },
  {
    id: "climat", groupe: "existence", nom: "Environnement et climat", sigle: "Climat", en: "Environment and climate",
    enTexte: "Land and natural resources, adapting farming to irregular rains, reforestation, riverbank protection.",
    cadre: { cad: "CAD 410", odd: "ODD 13 · 15" }, etat: "elargi",
    thematiques: ["environnement-ressources"],
    activites: [
      { texte: "Hub environnement : foncier, ressources naturelles", etat: "fait", href: "/dossiers/environnement" },
      { texte: "Adapter les pratiques agricoles aux pluies irrégulières", etat: "piste" },
      { texte: "Reboisement, protection des berges", etat: "piste" },
    ],
  },
  {
    id: "infrastructures", groupe: "existence", nom: "Énergie, connectivité et transport", sigle: "Infrastructures", en: "Energy, connectivity and transport",
    enTexte: "Advocacy for electricity, broadband, roads and bridges; a community digital space; a land transport project.",
    cadre: { cad: "CAD 210-230", odd: "ODD 7 · 9" }, etat: "couvert",
    thematiques: ["eau-energie-connectivite", "desenclavement-urbanisation", "transformation-numerique-services"],
    activites: [
      { texte: "Plaidoyer : de la lumière pour Bédjondo", etat: "fait", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" },
      { texte: "Plaidoyer : Bédjondo a droit au haut débit", etat: "fait", href: "/journal/2026-09-16-plaidoyer-internet-haut-debit-bedjondo" },
      { texte: "Plaidoyer : une voirie pour Bédjondo, des pistes pour ses cantons", etat: "fait", href: `${P}routes-ponts-bedjondo` },
      { texte: "Espace numérique communautaire (souscription ouverte, sans paiement)", etat: "piste", href: "/projets#espace-numerique" },
    ],
  },
  {
    id: "relief", groupe: "urgences", nom: "Réponse aux urgences", sigle: "Relief", en: "Emergency response (relief)",
    enTexte: "When a crisis hits: inform, guide, record needs for the State, the Chad Red Cross and humanitarian agencies — never collect money before the association has an account.",
    cadre: { cad: "CAD 720", odd: "ODD 1.5" }, etat: "nouveau",
    thematiques: ["urgences-risques", "solidarite-inclusion"],
    activites: [
      { texte: "Recenser les besoins d’une localité touchée, par le formulaire du site", etat: "fait", href: "/dossiers/besoins" },
      { texte: "Informer et orienter les familles vers les secours officiels", etat: "piste" },
      { texte: "Relayer les besoins recensés à l’État, à la Croix-Rouge du Tchad, aux agences", etat: "piste" },
      { texte: "Aide d’urgence seulement par des circuits vérifiables et publiés, après l’ouverture du compte", etat: "piste" },
    ],
  },
  {
    id: "drr", groupe: "urgences", nom: "Réduction des risques de catastrophe", sigle: "DRR / RRC", en: "Disaster risk reduction (DRR)",
    enTexte: "Mapping flood-prone areas with the villages, a contingency plan per canton, an alert network over WhatsApp and community radio.",
    cadre: { cad: "CAD 740", odd: "ODD 11.5 · 13.1" }, etat: "nouveau",
    thematiques: ["urgences-risques", "environnement-ressources"],
    activites: [
      { texte: "Carte du territoire, base de la cartographie des risques", etat: "fait", href: "/carte" },
      { texte: "Zones inondables et points d’eau exposés, relevés avec les villages", etat: "piste" },
      { texte: "Un plan de contingence simple par canton", etat: "piste" },
      { texte: "Un réseau d’alerte par WhatsApp et radio communautaire", etat: "piste" },
    ],
  },
  {
    id: "protection", groupe: "droits", nom: "Protection", sigle: "Protection", en: "Protection",
    enTexte: "Child protection (birth registration, out-of-school children, early marriage), people with disabilities, widows; a safeguarding policy.",
    cadre: { cluster: "Cluster Protection (enfance, VBG)", cad: "CAD 16010 · 15180", odd: "ODD 5 · 16" }, etat: "elargi",
    thematiques: ["solidarite-inclusion", "leadership-feminin", "justice-droits-homme"],
    activites: [
      { texte: "Politique de protection des enfants et des personnes vulnérables", etat: "fait", href: "/transparence" },
      { texte: "Plan handicap", etat: "fait", href: "/dossiers/handicap" },
      { texte: "Plan veuves", etat: "fait", href: "/dossiers/veuves" },
      { texte: "Enregistrement des naissances, enfants hors de l’école, mariages précoces", etat: "piste" },
    ],
  },
  {
    id: "gouvernance", groupe: "droits", nom: "Gouvernance et société civile", sigle: "Gouvernance", en: "Governance and civil society",
    enTexte: "Eight sourced advocacy briefs, a note to the commune, a public register of decisions, a corrections log.",
    cadre: { cad: "CAD 151", odd: "ODD 16" }, etat: "couvert",
    thematiques: ["gouvernance-plaidoyer", "justice-droits-homme"],
    activites: [
      { texte: "Huit plaidoyers publiés, sourcés, avec leurs destinataires", etat: "fait", href: "/actions" },
      { texte: "Note à la commune de Bédjondo : six propositions", etat: "fait", href: "/journal/2026-09-16-note-commune-bedjondo" },
      { texte: "Registre public des décisions", etat: "fait", href: "/transparence/decisions" },
      { texte: "Décentralisation : ce que la commune peut faire", etat: "fait", href: "/dossiers/decentralisation" },
    ],
  },
  {
    id: "paix", groupe: "droits", nom: "Paix et cohésion sociale", sigle: "Paix", en: "Peace and social cohesion",
    enTexte: "Local mediation of land and family disputes, dialogue between religions, relations with neighbouring communities.",
    cadre: { cad: "CAD 152", odd: "ODD 16" }, etat: "couvert",
    thematiques: ["paix-cohesion"],
    activites: [
      { texte: "Agriculteurs et éleveurs : prévenir les conflits", etat: "fait", href: "/dossiers/agriculteurs-eleveurs" },
      { texte: "Médiation de proximité pour les différends fonciers ou familiaux", etat: "piste" },
    ],
  },
  {
    id: "genre", groupe: "droits", nom: "Égalité femmes-hommes", sigle: "Genre", en: "Gender equality",
    enTexte: "Women’s leadership in the association and the villages; the gender marker applied to every theme.",
    cadre: { cad: "marqueur genre du CAD", odd: "ODD 5" }, etat: "couvert",
    thematiques: ["leadership-feminin"],
    activites: [
      { texte: "Femmes de Bédjondo : une thématique à prendre", etat: "fait", href: "/journal/2026-09-14-femmes-bedjondo-leadership-feminin" },
      { texte: "Accès des femmes au crédit, à la terre, aux responsabilités", etat: "piste" },
    ],
  },
  {
    id: "culture", groupe: "singularites", nom: "Culture et patrimoine", sigle: "Culture", en: "Culture and heritage",
    enTexte: "History, the Nangnda language, genealogies, a digital library; sacred sites protected by publishing nothing.",
    cadre: { cad: "CAD 16061", odd: "ODD 11.4" }, etat: "couvert",
    thematiques: ["memoire-heritage", "culture-patrimoine-vivant", "savoirs-innovation"],
    activites: [
      { texte: "Histoire et patrimoine bedjond", etat: "fait", href: "/histoire" },
      { texte: "La langue nangnda et son dictionnaire", etat: "fait", href: "/langue" },
      { texte: "Bibliothèque numérique", etat: "fait", href: "/bibliotheque" },
      { texte: "Lieux sacrés et sépultures : ne rien publier", etat: "fait", href: "/dossiers/lieux-sacres" },
    ],
  },
  {
    id: "numerique", groupe: "singularites", nom: "Numérique pour le développement", sigle: "ICT4D", en: "Digital for development (ICT4D)",
    enTexte: "This site and its app, open village data, a community digital space, AI for the language.",
    cadre: { cad: "CAD 220", odd: "ODD 9" }, etat: "couvert",
    thematiques: ["transformation-numerique-services", "intelligence-artificielle-donnees", "competences-entrepreneuriat-numerique"],
    activites: [
      { texte: "Une fiche par village, 966 localités", etat: "fait", href: "/villages" },
      { texte: "L’application pour téléphone", etat: "fait", href: "/dossiers/application" },
      { texte: "Drones et innovation", etat: "fait", href: "/dossiers/drones-innovation" },
      { texte: "Espace numérique communautaire", etat: "piste", href: "/projets#espace-numerique" },
    ],
  },
  {
    id: "diaspora", groupe: "singularites", nom: "Diaspora et compétences", sigle: "Diaspora", en: "Diaspora and skills",
    enTexte: "A skills directory of the diaspora, called on only for what each person offered.",
    cadre: { cad: "hors nomenclature CAD", odd: "ODD 17" }, etat: "couvert",
    thematiques: ["reseau-experts-diaspora"],
    activites: [
      { texte: "Répertoire des compétences de la diaspora", etat: "fait", href: "/diaspora" },
      { texte: "La diaspora bedjond, un pont vers le terroir", etat: "fait", href: "/journal/2026-09-14-diaspora-bedjond-pont-vers-terroir" },
    ],
  },
];

/* Secteurs des ONG que l'association ne couvre pas, et vers qui elle oriente. */
export const NON_COUVERTS: { nom: string; sigle: string; en: string; pourquoi: string }[] = [
  { nom: "Abris et articles non alimentaires", sigle: "Shelter / NFI", en: "Shelter and non-food items", pourquoi: "Distribuer des bâches, des kits, reconstruire des abris demande des stocks, de la logistique et des fonds que l’association n’a pas." },
  { nom: "Gestion de sites de déplacés", sigle: "CCCM", en: "Camp coordination and management", pourquoi: "C’est le rôle de l’État et des agences mandatées ; l’association peut informer et orienter." },
  { nom: "Logistique et télécommunications d’urgence", sigle: "Logistique · ETC", en: "Logistics and emergency telecoms", pourquoi: "Hors de portée d’une association sans moyens propres ; son réseau d’alerte WhatsApp en tient lieu localement." },
];

export const secteursDeThematique = (id: string) => SECTEURS.filter((s) => s.thematiques.includes(id));
