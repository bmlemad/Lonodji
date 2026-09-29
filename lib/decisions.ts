/* Registre public des décisions : ce que l'association a décidé, nommé,
   annoncé ou proposé, tel que le site l'a publié — rien d'autre. Chaque ligne
   cite sa source (article, lettre, page) ; le statut distingue ce qui est
   décidé de ce qui n'est que proposé ou annoncé. Les procès-verbaux ne sont
   pas encore publiés : le registre reprend les décisions rendues publiques,
   il ne les remplace pas. Tenu à la main ; une entrée par fait daté. */
export type TypeDecision = "decision" | "nomination" | "annonce" | "proposition" | "publication" | "regle";
export type Decision = {
  id: string;
  date: string; // AAAA-MM-JJ ; pour une règle sans date de vote connue, la date de mise en ligne
  type: TypeDecision;
  titre: string;
  texte: string;
  sources: { label: string; href: string }[];
  /* ce que l'entrée attend encore, s'il y a lieu */
  suite?: string;
  /* qui a décidé, quand le site le dit ; sinon « non précisée publiquement » */
  instance?: string;
  /* à la place de la date, quand la date exacte n'est pas publiée (date sert alors au tri) */
  dateLabel?: string;
  /* règle dont la date de départ est connue : affichée « depuis le … » */
  datee?: boolean;
};

export const INSTANCE_PAR_DEFAUT = "non précisée publiquement";

export const TYPES: Record<TypeDecision, { label: string; court: string; note: string }> = {
  decision: { label: "Décision", court: "Décidé", note: "prise par l’association et rendue publique" },
  nomination: { label: "Nomination", court: "Nommé", note: "coordination ou fonction confiée à une personne" },
  annonce: { label: "Annonce", court: "Annoncé", note: "intention rendue publique, sans budget ni calendrier" },
  proposition: { label: "Proposition", court: "À décider", note: "soumise à l’assemblée ou au bureau, pas encore décidée" },
  publication: { label: "Publication", court: "Publié", note: "un texte qui engage l’association, publié sur le site" },
  regle: { label: "Règle", court: "En vigueur", note: "que l’association s’impose, dès sa mise en ligne" },
};

export const DECISIONS: Decision[] = [
  {
    id: "2026-01", date: "2026-09-11", type: "decision",
    titre: "L’association s’organise en pôles et thématiques",
    texte: "Trois pôles et douze thématiques le 11 septembre 2026, élargis avant le 14 septembre à quatre pôles, dix-neuf thématiques et deux cellules transversales — la structure que présente la page Nos actions.",
    sources: [{ label: "Article du 11 septembre 2026", href: "/journal/2026-09-11-structuration-poles" }, { label: "Appel du 14 septembre 2026", href: "/journal/2026-09-14-appel-filles-fils-bedjondo" }, { label: "Nos actions", href: "/programmes" }],
  },
  {
    id: "2026-02", date: "2026-09-12", type: "nomination",
    titre: "Coordination de la thématique Mémoire & héritage",
    texte: "Le Dr Bé-Rammaj Miaro-II, historien, prend en charge la thématique ; Recherche & savoirs est coordonnée par Sylvain Nomaye.",
    sources: [{ label: "Article du 12 septembre 2026", href: "/journal/2026-09-12-lancement-memoire-heritage" }],
  },
  {
    id: "2026-03", date: "2026-09-17", type: "publication",
    titre: "Sept plaidoyers et une note à la commune de Bédjondo",
    texte: "Eau potable, électricité, haut débit, santé, école, formation professionnelle, routes et ponts, et six propositions à la commune : huit textes qui citent leurs sources et disent ce que l’association ignore encore.",
    sources: [{ label: "Plaidoyers & engagements", href: "/actions" }, { label: "Lettre n° 1", href: "/journal/2026-09-21-lettre-information-01" }],
    suite: "Publiés, aucun encore transmis à ses destinataires : les lettres attendent la signature du bureau.",
  },
  {
    id: "2026-04", date: "2026-09-19", type: "decision",
    titre: "Deux sièges : N’Djamena et Bédjondo",
    texte: "Un siège national à N’Djamena, tourné vers les institutions, les partenaires et la diaspora ; un siège des opérations à Bédjondo, où se décide et se mène le travail de terrain.",
    sources: [{ label: "Article du 19 septembre 2026", href: "/journal/2026-09-19-annonce-deux-sieges" }, { label: "Lettre n° 1", href: "/journal/2026-09-21-lettre-information-01" }],
    suite: "L’adresse de chaque siège, sa date d’ouverture et le partage des responsabilités ne sont pas encore fixés publiquement.",
  },
  {
    id: "2026-05", date: "2026-09-19", type: "annonce",
    titre: "Air Bedjondo, un projet de transport terrestre",
    texte: "Une intention annoncée par l’animateur de l’association et relayée par elle sans en être le porteur : ni étude, ni financement, ni calendrier. Depuis le 28 septembre 2026, l’entreprise de transport et de logistique figure parmi les quatre entreprises phares proposées du programme 06.",
    sources: [{ label: "Article du 19 septembre 2026", href: "/journal/2026-09-19-annonce-air-bedjondo" }, { label: "Plateforme de projets", href: "/projets#air-bedjondo" }],
  },
  {
    id: "2026-06", date: "2026-09-21", type: "nomination",
    titre: "Quatre coordinations pourvues au 21 septembre 2026",
    texte: "Mémoire & héritage (Dr Bé-Rammaj Miaro-II), Recherche & savoirs (Sylvain Nomaye), Genre & autonomisation des femmes (Odette Tolmbaye), Santé & prévention (Dr Nestor Alladoumdjim).",
    sources: [{ label: "Lettre n° 1", href: "/journal/2026-09-21-lettre-information-01" }],
  },
  {
    id: "2026-07", date: "2026-09-28", type: "decision",
    titre: "Lancement de la réflexion ODEB LONODJI",
    texte: "Pour les quarante ans de ses fondations, l’association ouvre la réflexion sur une Organisation pour le Développement et l’Émergence Bedjonde à l’horizon 2030, avec quatre pièces en ligne : la vision et ses six missions, les programmes, la feuille de route 2026-2030, le livre blanc en version de travail.",
    sources: [{ label: "Article du 28 septembre 2026", href: "/journal/2026-09-28-quarante-ans-reflexion-odeb-lonodji" }, { label: "Le projet ODEB LONODJI", href: "/odeb" }],
    suite: "Rien n’est décidé sur l’ODEB elle-même : ni statut, ni budget, ni personnel ; le livre blanc est fait pour être discuté.",
  },
  {
    id: "2026-08", date: "2026-09-28", type: "nomination",
    titre: "Onze coordinations confiées le même jour",
    texte: "Culture & patrimoine vivant (Dr Yaphete Madjiradé), Agriculture, élevage & sécurité alimentaire (Olivier Allaramadji Nomaye), Jeunesse & réussite (Bruno Kodjadoum NGARTEL), Gouvernance & plaidoyer (Adoumbé Maoura), Paix & cohésion (Sa Majesté Moulbe Brahim Nadoumbeye), Réseau d’experts & diaspora (Edgard Djerassem Djimhotengar), Justice & droits humains (Dr Eugène Ngartebaye Le Yotha), les trois thématiques du pôle Numérique & innovation (Bignéro Moïalbéi LE MADANG), la cellule Communication & numérique (Djimtebaye Mahamat Mamadou Banadji).",
    sources: [{ label: "Lettre n° 2", href: "/journal/2026-09-28-lettre-information-02" }, { label: "Nos actions", href: "/programmes" }],
    suite: "Quatre thématiques et la cellule Financement & ressources restaient à pourvoir ; s’y ajoute Urgences & risques, créée le 29 septembre 2026.",
  },
  {
    id: "2026-09", date: "2026-09-28", type: "decision",
    titre: "Adoption du logo « Les Pas vers l’Avenir »",
    texte: "Dessiné le soir même du lancement de la réflexion ODEB, le logo est adopté par l’association pour elle-même et pour son projet : un emblème, deux noms. L’ancien logo reste sur les documents publiés avant cette date.",
    sources: [{ label: "Article du 28 septembre 2026", href: "/journal/2026-09-28-identite-visuelle-odeb-lonodji" }, { label: "Identité visuelle", href: "/odeb/identite" }],
  },
  {
    id: "2026-10", date: "2026-09-28", type: "decision",
    titre: "Création des directions de pôle, au rang de chef de projet",
    texte: "Chaque pôle a désormais une direction, distincte de la coordination des thématiques : elle anime les coordonnateurs, tient le plan d’action et le calendrier du pôle, suit les plaidoyers et les projets, rend compte au bureau et à l’assemblée. Quatre postes ouverts à tout membre.",
    sources: [{ label: "Article du 28 septembre 2026", href: "/journal/2026-09-28-directions-de-pole" }, { label: "Fiches de mission", href: "/programmes/fiches-de-mission" }],
    suite: "Les quatre directions sont à pourvoir.",
  },
  {
    id: "2026-11", date: "2026-09-28", type: "proposition",
    titre: "Programme 06 « Économie sociale et revenus » : cinq règles à voter",
    texte: "Des entreprises distinctes de l’association dont les bénéfices iraient aux projets de développement et de bien-être. Cinq règles sont proposées avec le programme — une société, pas l’association ; des bénéfices affectés aux projets et des comptes publiés ; ce qui manque au pays bedjond ; de l’argent propre sans promesse de rendement ; une entreprise à la fois —, à voter par l’assemblée avant toute création, avec la règle d’affectation des bénéfices.",
    sources: [{ label: "Article du 28 septembre 2026", href: "/journal/2026-09-28-sixieme-programme-economie-sociale" }, { label: "Programme 06", href: "/odeb/programmes/economie-sociale#principes" }],
    suite: "Vote de l’assemblée attendu ; aucune entreprise n’est créée, rien n’est chiffré.",
  },
  {
    id: "2026-12", date: "2026-09-29", type: "decision",
    titre: "Vingt thématiques : quatre périmètres élargis et une thématique Urgences & risques",
    texte: "Pour couvrir les secteurs des ONG de développement et d’aide : Eau, énergie & connectivité, devenue le même jour Eau, assainissement & hygiène (l’assainissement et l’hygiène) ; Santé, nutrition & prévention (la nutrition) ; Environnement, climat & ressources naturelles (l’adaptation au changement climatique) ; Protection sociale, enfance & inclusion (la protection de l’enfance). Une vingtième thématique, Urgences & risques, rejoint le pôle II : préparation aux inondations et aux épidémies, plan de contingence par canton, réseau d’alerte, relais avec l’État et les agences humanitaires.",
    sources: [{ label: "Article du 29 septembre 2026", href: "/journal/2026-09-29-vingt-thematiques-urgences-risques" }, { label: "Nos actions", href: "/programmes#urgences-risques" }],
    suite: "La coordination d’Urgences & risques est à pourvoir ; rien n’est encore engagé, aucune collecte avant un compte au nom de l’association.",
  },
  {
    id: "2026-13", date: "2026-09-29", type: "decision",
    titre: "Directions de pôle : le titre reste, avec son équivalent international",
    texte: "Le titre « directeur ou directrice de pôle », au rang de chef de projet, est maintenu : « directeur de programme » aurait prêté à confusion avec les six programmes du projet ODEB, qui croisent les pôles. Pour les partenaires internationaux, les fiches de mission et les pages anglaises donnent l’équivalent « Pillar Lead (programme-manager level) ».",
    sources: [{ label: "Nos actions — diriger un pôle", href: "/programmes#diriger-un-pole" }, { label: "Fiches de mission", href: "/programmes/fiches-de-mission" }],
  },
  {
    id: "2026-14", date: "2026-09-29", type: "decision",
    titre: "Quatre intitulés alignés sur les activités",
    texte: "07 Eau, assainissement & hygiène (le WASH des ONG) ; 08 Énergie, routes & urbanisme (les infrastructures, dont l’énergie venue de la 07) ; 09 Éducation, jeunesse & formation (jusqu’ici Jeunesse & réussite) ; 17 Connectivité & services numériques (la connexion internet venue de la 07). Numéros, liens et coordinations inchangés.",
    sources: [{ label: "Nos actions", href: "/programmes#pole-2" }, { label: "Secteurs d’intervention", href: "/secteurs" }],
  },
  {
    id: "2026-15", date: "2026-09-23", type: "nomination", dateLabel: "date non publiée, au plus tard le 23 septembre 2026",
    titre: "Coordination de la thématique Protection sociale, enfance & inclusion",
    texte: "La coordination est confiée à Solkem Ngarmbatina. Le journal des corrections du 23 septembre 2026 la cite déjà parmi les six thématiques pourvues.",
    sources: [{ label: "Journal des corrections, 23 septembre 2026", href: "/transparence#corrections" }, { label: "Nos actions", href: "/programmes#solidarite-inclusion" }],
  },
  {
    id: "2026-16", date: "2026-09-23", type: "decision",
    titre: "Suspension de la collecte sur le compte personnel de la trésorière",
    texte: "La collecte est suspendue, en espèces comme par Mobile Money, jusqu’à ce que trois conditions soient réunies : l’autorisation de l’association au titre de l’ordonnance n° 023/PR/2018, le vote de la grille de cotisation par l’assemblée générale, et un compte au nom de l’association, à double signature. Le numéro de la trésorière est retiré du site.",
    sources: [{ label: "Journal des corrections, 23 septembre 2026", href: "/transparence#corrections" }],
    suite: "Les trois conditions ne sont pas réunies à ce jour.",
  },
  {
    id: "2026-17", date: "2026-09-23", type: "proposition",
    titre: "Cinq politiques d’intégrité",
    texte: "Conflits d’intérêts, fraude et corruption, données personnelles, achats et dépenses, exploitation et abus sexuels : cinq politiques écrites, rédigées en projet le 23 septembre 2026 et soumises au bureau exécutif.",
    sources: [{ label: "Redevabilité & transparence", href: "/transparence" }],
    suite: "Proposition — projets du 23 septembre 2026, soumis au bureau exécutif ; non adoptés à ce jour.",
  },
  {
    id: "2026-18", date: "2026-09-24", type: "decision", instance: "Décision de l’animation, à confirmer par l’assemblée générale",
    titre: "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond",
    texte: "La présentation change : les actions de développement servent tous les habitants de Bédjondo, sans distinction d’origine ; la sauvegarde du patrimoine, de la langue et de l’histoire du peuple bedjond reste au cœur de l’objet.",
    sources: [{ label: "Journal des corrections, 24 septembre 2026", href: "/transparence#corrections" }],
    suite: "Confirmation par l’assemblée générale ; le nom et l’objet de la future ONG seront fixés par elle.",
  },
  {
    id: "2026-19", date: "2026-09-24", type: "annonce", dateLabel: "date non publiée ; en ligne au plus tard le 24 septembre 2026",
    titre: "Conversion en ONG, sous le nom ODEB LONODJI",
    texte: "L’association annonce son intention de passer du statut d’association à celui d’ONG, sous le nom d’ODEB LONODJI. L’instance et la date de la décision ne sont pas publiées ; aucun dossier n’est déposé.",
    sources: [{ label: "Démarches — vers le statut d’ONG", href: "/dossiers/demarches#vers-ong" }],
    suite: "Vérifier d’abord l’autorisation de l’association au titre de l’ordonnance de 2018 ; nom et objet à fixer par l’assemblée générale.",
  },
  {
    id: "regle-01", date: "2026-09-23", type: "regle", datee: true,
    titre: "Aucune collecte avant un compte bancaire au nom de l’association",
    texte: "Collecte suspendue depuis le 23 septembre 2026 (journal des corrections, 23 septembre 2026), jusqu’à l’ouverture d’un compte au nom de l’association ; les intentions d’adhésion et les promesses de contribution n’engagent aucun paiement.",
    sources: [{ label: "Journal des corrections, 23 septembre 2026", href: "/transparence#corrections" }, { label: "Notre mission — le bureau", href: "/mission" }, { label: "Plateforme de projets", href: "/projets" }],
  },
  {
    id: "regle-02", date: "2026-09-11", type: "regle",
    titre: "Lieux sacrés et sépultures : ne rien publier",
    texte: "Le registre des lieux sacrés et des sépultures est tenu avec les chefs ; rien n’en paraît sur la carte ni sur le site.",
    sources: [{ label: "Lieux sacrés et sépultures", href: "/dossiers/lieux-sacres" }],
  },
  {
    id: "regle-03", date: "2026-09-11", type: "regle",
    titre: "Réponse sous 48 heures ouvrées, plainte possible, corrections datées",
    texte: "Toute demande reçoit une réponse sous 48 heures ouvrées ; une plainte est possible, même anonyme ; chaque erreur de fait est corrigée et datée dans le journal des corrections.",
    sources: [{ label: "Redevabilité & transparence", href: "/transparence" }],
  },
];

export const decisionsTriees = () => [...DECISIONS].sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : b.date.localeCompare(a.date)));
