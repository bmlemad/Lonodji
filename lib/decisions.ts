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
    id: "2026-36", date: "2026-09-18", type: "decision",
    titre: "Réactivation de l’association et principe de l’ODEB LONODJI",
    texte: "Le bureau exécutif élargi, réuni à N’Djamena, adopte six résolutions : engager officiellement la réactivation de l’association ; mettre en place un Comité de réactivation, de modernisation et de transformation institutionnelle ; préparer une assemblée générale de relance ; élaborer de nouveaux statuts et un règlement intérieur ; adopter le principe de la transformation progressive en ODEB LONODJI (Organisation pour le Développement et l’Émergence Bedjonde), sous réserve de l’approbation de l’assemblée générale ; définir une feuille de route vers le statut d’ONG. Il retient pour l’ODEB une vision, une mission, sept valeurs, la devise « Unité • Solidarité • Développement », une ambition 2035 et huit axes stratégiques, ainsi qu’un chronogramme indicatif en quatre phases jusqu’en mars 2027. Compte rendu publié le 2 octobre 2026, approuvé par tous les participants ; la version signée suivra.",
    sources: [{ label: "Article du 2 octobre 2026", href: "/journal/2026-10-02-relance-bureau-18-septembre" }, { label: "Compte rendu CR-BE-2026-01 (PDF)", href: "/organisation/compte-rendu-bureau-2026-09-18.pdf" }, { label: "Le projet ODEB LONODJI", href: "/odeb#bureau-18-septembre" }, { label: "Le calendrier", href: "/odeb/feuille-de-route#calendrier-bureau" }],
    suite: "Composition du Comité et désignation de son coordonnateur (échéance du 3 octobre 2026) ; date et lieu de l’assemblée générale de relance (17 novembre 2026) ; version signée du compte rendu.",
    instance: "Bureau exécutif élargi",
  },
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
    id: "2026-35", date: "2026-10-01", type: "decision",
    titre: "Six pôles et vingt-deux thématiques : des nombres pairs",
    texte: "Le bureau exécutif complète le même jour la décision 2026-31 et revient sur sa clause « pas de nouveau redécoupage avant au moins un trimestre » : l’association compte six pôles et vingt-deux thématiques. Le pôle V devient « Économie & ressources naturelles » (04 Agriculture, élevage & sécurité alimentaire ; 05 Entrepreneuriat & finance inclusive ; 06 Environnement, climat & ressources naturelles) ; un pôle VI, « Infrastructures, territoire & risques », reçoit 08 Routes & urbanisme, 20 Urgences & risques et 21 Énergie. Une thématique 22, Sport, arts & loisirs, rejoint le pôle II, Services essentiels. Aucune thématique n’est supprimée ni renumérotée ; les sept thématiques prioritaires ne changent pas. La vice-présidence du pôle VI est élue avec les autres, selon la procédure et le calendrier de la décision 2026-33.",
    sources: [{ label: "Article du 1er octobre 2026", href: "/journal/2026-10-01-six-poles-vingt-deux-thematiques" }, { label: "Nos actions", href: "/programmes" }, { label: "L’élection des vice-présidences", href: "/association/election-vice-presidences" }],
    suite: "Thématique 22 à pourvoir ; vice-présidences des pôles III, IV, V et VI élues le 22 octobre 2026.",
    instance: "Bureau exécutif",
  },
  {
    id: "2026-33", date: "2026-10-01", type: "decision",
    titre: "Élection des vice-présidences des pôles III, IV et V : procédure et calendrier",
    texte: "En application de la décision 2026-31, le bureau exécutif adopte la procédure d’élection des vice-présidences sans titulaire. Candidats : membres de l’association ou personnes ayant déposé leur déclaration d’adhésion, au Tchad comme dans la diaspora, une seule vice-présidence chacun. Électeurs : le collège des responsables — bureau exécutif, vice-présidences en fonction, coordonnateurs titulaires des thématiques et des cellules —, la prochaine assemblée générale confirmant les élus. Quorum de la moitié du collège ; vote en réunion, sur place et à distance, à main levée ou au scrutin secret si un membre le demande ; majorité absolue au premier tour, relative au second. Mandat jusqu’à la prochaine assemblée générale ordinaire. Candidatures du 2 au 15 octobre 2026, liste des candidats le 17, vote le 22, résultats le 23, réclamations jusqu’au 30 octobre.",
    sources: [{ label: "Article du 1er octobre 2026", href: "/journal/2026-10-01-election-vice-presidences" }, { label: "L’élection des vice-présidences", href: "/association/election-vice-presidences" }, { label: "Postes ouverts", href: "/participer#postes-ouverts" }],
    suite: "Candidatures ouvertes du 2 au 15 octobre 2026 ; vote le 22 octobre 2026. Le pôle VI, créé le même jour (2026-35), est ajouté à l’élection.",
    instance: "Bureau exécutif",
  },
  {
    id: "2026-34", date: "2026-10-01", type: "decision",
    titre: "Un plan annuel pour chacune des sept thématiques prioritaires",
    texte: "En application de la décision 2026-31, le bureau exécutif adopte le modèle de plan annuel des thématiques prioritaires. Chaque plan reprend ce que l’association a déjà publié — plaidoyers et leurs destinataires, engagements écrits, chantier des propositions à la commune — ; le titulaire, avec son adjoint, y fixe pour chaque action l’échéance, le responsable, les moyens et l’indicateur. La vice-présidence du pôle le valide et le suit chaque trimestre ; là où elle est à pourvoir, le bureau exécutif le fait. Le plan couvre douze mois à compter de sa validation ; toute dépense attend les trois conditions de la décision 2026-16.",
    sources: [{ label: "Les plans annuels à compléter (PDF)", href: "/organisation/plans-annuels-priorites.pdf" }, { label: "Décisions d’organisation", href: "/association/propositions-organisation#plans-annuels" }],
    suite: "Plans à compléter par les titulaires ; chacun sera publié, daté, une fois validé.",
    instance: "Bureau exécutif",
  },
  {
    id: "2026-31", date: "2026-10-01", type: "decision",
    titre: "Le bureau adopte les huit décisions d’organisation : cinq pôles, sept thématiques prioritaires",
    texte: "Le bureau exécutif adopte les huit propositions du même jour (2026-30). Le pôle II est scindé : il devient « Services essentiels » (07, 09, 10, 11, 12), et un pôle V, « Économie, territoire & risques », réunit les thématiques 04, 05, 06, 08, 20 et 21, sans renumérotation. Sept thématiques sont prioritaires — 07, 08, 09, 11, 13, 17 et 21, celles des huit dossiers de plaidoyer —, chacune avec un titulaire et un adjoint, et rattachée à un chantier des propositions à la commune. Les directions de pôle deviennent des vice-présidences déléguées, pourvues par élection ; les deux titulaires gardent leur fonction. Une personne coordonne une seule thématique. La fonction « Projets, suivi & redevabilité » devient une mission du secrétariat général. On pilote par pôles et thématiques seulement : programmes ODEB et secteurs deviennent des tables de correspondance.",
    sources: [{ label: "Article du 1er octobre 2026", href: "/journal/2026-10-01-cinq-poles-sept-priorites" }, { label: "Décisions d’organisation", href: "/association/propositions-organisation" }, { label: "Nos actions", href: "/programmes" }],
    suite: "Vice-présidences des pôles III, IV et V : élection le 22 octobre 2026 (2026-33) ; plans annuels des priorités à compléter (2026-34) ; adjoints des thématiques prioritaires à trouver ; cumuls à revoir avec les personnes concernées. Pas de nouveau redécoupage avant au moins un trimestre.",
    instance: "Bureau exécutif",
  },
  {
    id: "2026-32", date: "2026-10-01", type: "nomination",
    titre: "Cellule Financement & ressources : la trésorière, par intérim",
    texte: "En application de la décision 2026-31, la cellule Financement & ressources, vacante depuis sa création, est confiée par intérim à la trésorière élue, Élisabeth Neloumngaye Ndodinguem : l’argent relève du bureau. Un commissaire aux comptes sera prévu avant toute réouverture de la collecte.",
    sources: [{ label: "Nos actions", href: "/programmes#cellule-financement-ressources" }],
    suite: "La collecte reste suspendue jusqu’aux trois conditions déjà publiées (décision 2026-16).",
    instance: "Bureau exécutif",
  },
  {
    id: "2026-30", date: "2026-10-01", type: "publication",
    titre: "Huit propositions d’organisation soumises au bureau",
    texte: "Tirées d’une comparaison avec dix organisations et cadres : n’avoir que cinq à sept thématiques prioritaires à la fois, d’abord les sept qui portent les huit dossiers de plaidoyer ; scinder le pôle II en « Services essentiels » et « Économie, territoire & risques » ; confier la cellule Financement & ressources à la trésorerie élue par intérim ; créer une fonction « Projets, suivi & redevabilité » ; faire des directions de pôle des vice-présidences déléguées ; une personne par thématique, avec un adjoint ; une seule grille de pilotage ; rattacher chaque thématique prioritaire au plan de la commune.",
    sources: [{ label: "Propositions d’organisation", href: "/association/propositions-organisation" }],
    suite: "Adoptées le jour même par le bureau exécutif (2026-31).",
  },
  {
    id: "2026-29", date: "2026-09-30", type: "decision",
    titre: "Une thématique 21, Énergie ; la 08 devient Routes & urbanisme",
    texte: "L’énergie, rattachée le 29 septembre 2026 à la thématique 08 (décision 2026-14), devient une thématique à part entière, la 21, au pôle Développement humain & moyens d’existence : électricité par le réseau, les mini-réseaux ou le solaire, éclairage public, électrification des équipements publics. Elle porte le plaidoyer « De la lumière pour Bédjondo ». La 08 prend le nom de Routes & urbanisme et garde les routes, les ponts, les pistes et l’urbanisme de Bédjondo, avec le plaidoyer pour la voirie. Les deux métiers, leurs interlocuteurs et leurs bailleurs sont distincts.",
    sources: [{ label: "Nos actions", href: "/programmes#energie" }, { label: "Programmes des bailleurs", href: "/bailleurs" }],
    suite: "La 21 est à pourvoir ; depuis le 1er octobre 2026, elle relève du pôle VI, Infrastructures, territoire & risques (2026-35).",
  },
  {
    id: "2026-28", date: "2026-09-30", type: "nomination",
    titre: "Mémoire & héritage : Félix Mbété Nangmbatnan coordonnateur",
    texte: "La coordination de la thématique 01, Mémoire & héritage (pôle Mémoire, culture & patrimoine), est confiée à Félix Mbété Nangmbatnan. Il succède au Dr Bé-Rammaj Miaro-II, qui dirige le pôle depuis le même jour (2026-26). Félix Mbété Nangmbatnan avait coordonné Culture & patrimoine vivant du 22 au 28 septembre 2026.",
    sources: [{ label: "Nos actions", href: "/programmes#memoire-heritage" }],
    suite: "Le nombre de thématiques pourvues ne change pas avec cette succession.",
  },
  {
    id: "2026-27", date: "2026-09-30", type: "nomination",
    titre: "Direction du pôle Développement humain & moyens d’existence : Franco Joseph Ngarlena",
    texte: "La direction du pôle II, Développement humain & moyens d’existence, au rang de chef de projet, est confiée à Franco Joseph Ngarlena. C’est la deuxième des quatre directions de pôle créées le 28 septembre 2026 à être pourvue, après celle du pôle I.",
    sources: [{ label: "Nos actions", href: "/programmes#pole-2" }, { label: "Fiches de mission", href: "/programmes/fiches-de-mission" }],
    suite: "Les directions des pôles III et IV restent à pourvoir.",
  },
  {
    id: "2026-26", date: "2026-09-30", type: "nomination",
    titre: "Direction du pôle Mémoire, culture & patrimoine : Dr Bé-Rammaj Miaro-II",
    texte: "La direction du pôle I, Mémoire, culture & patrimoine, au rang de chef de projet, est confiée au Dr Bé-Rammaj Miaro-II, déjà coordonnateur de la thématique Mémoire & héritage. C’est la première des quatre directions de pôle créées le 28 septembre 2026 à être pourvue.",
    sources: [{ label: "Nos actions", href: "/programmes#pole-1" }, { label: "Fiches de mission", href: "/programmes/fiches-de-mission" }],
    suite: "Le même jour, la direction du pôle II est confiée à Franco Joseph Ngarlena (2026-27).",
  },
  {
    id: "2026-25", date: "2026-09-30", type: "nomination",
    titre: "Entrepreneuriat & finance inclusive : Tamar Neloum DOUMANBE coordonnatrice",
    texte: "La coordination de la thématique 05, Entrepreneuriat & finance inclusive (pôle Développement humain & moyens d’existence), jusqu’ici à pourvoir, est confiée à Tamar Neloum DOUMANBE.",
    sources: [{ label: "Nos actions", href: "/programmes#entrepreneuriat-finance-inclusive" }],
    suite: "Seize thématiques sur vingt ont désormais leur coordination ; quatre restent à pourvoir, avec la cellule Financement & ressources.",
  },
  {
    id: "2026-24", date: "2026-09-30", type: "nomination",
    titre: "Compétences & entrepreneuriat numérique : Rosine Mbaïnodoum coordonnatrice",
    texte: "La coordination de la thématique 19, Compétences & entrepreneuriat numérique (pôle Numérique & innovation), est confiée à Rosine Mbaïnodoum. Elle succède à Bignéro Moïalbéi LE MADANG, qui garde Connectivité & services numériques.",
    sources: [{ label: "Nos actions", href: "/programmes#competences-entrepreneuriat-numerique" }],
    suite: "Le nombre de thématiques pourvues ne change pas avec cette succession.",
  },
  {
    id: "2026-23", date: "2026-09-30", type: "nomination",
    titre: "Intelligence artificielle & données : Bonheur Allahaddje coordonnateur",
    texte: "La coordination de la thématique 18, Intelligence artificielle & données (pôle Numérique & innovation), est confiée à Bonheur Allahaddje. Il succède à Bignéro Moïalbéi LE MADANG, qui coordonnait depuis le 28 septembre 2026 les trois thématiques du pôle et garde les deux autres.",
    sources: [{ label: "Nos actions", href: "/programmes#intelligence-artificielle-donnees" }],
    suite: "Le nombre de thématiques pourvues ne change pas avec cette succession.",
  },
  {
    id: "2026-22", date: "2026-09-30", type: "annonce",
    titre: "Dix projets prioritaires proposés à la commune de Bédjondo",
    texte: "L’association propose à la commune dix projets prioritaires — eau potable, marché moderne, transformation agricole, Maison de la Femme et de la Jeunesse, assainissement, centre numérique, maraîchage irrigué, reboisement, fonds de microprojets, actualisation du plan de développement communal — et recommande de réunir les plus porteurs dans un projet intégré de développement économique local.",
    sources: [{ label: "Nos propositions à la commune", href: "/territoire/propositions-commune#projets-prioritaires" }],
    suite: "Ce sont des propositions à débattre avec la commune : aucune étude, aucun budget, aucun financement à ce jour.",
  },
  {
    id: "2026-21", date: "2026-09-29", type: "annonce",
    titre: "Air Bedjondo devient Bedjondo Transport et Logistique",
    texte: "Le projet de transport et de logistique terrestres annoncé le 19 septembre 2026 change de nom : l’ancien laissait croire à un projet aérien. Six propositions pour le mener sont publiées avec lui, soumises au bureau et à l’assemblée.",
    sources: [{ label: "Page du projet", href: "/projets/bedjondo-transport-logistique" }],
    suite: "Rien n’est décidé sur le projet lui-même : ni étude, ni montage, ni financement, ni calendrier.",
  },
  {
    id: "2026-05", date: "2026-09-19", type: "annonce",
    titre: "Air Bedjondo, un projet de transport terrestre",
    texte: "Une intention annoncée par l’animateur de l’association et relayée par elle sans en être le porteur : ni étude, ni financement, ni calendrier. Depuis le 28 septembre 2026, l’entreprise de transport et de logistique figure parmi les quatre entreprises phares proposées par le programme 06.",
    sources: [{ label: "Article du 19 septembre 2026", href: "/journal/2026-09-19-annonce-air-bedjondo" }, { label: "Plateforme de projets", href: "/projets#bedjondo-transport-logistique" }],
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
    suite: "Les quatre directions étaient à pourvoir à leur création ; celles des pôles I et II sont pourvues le 30 septembre 2026 (2026-26, 2026-27). Le 1er octobre 2026, elles deviennent des vice-présidences, et un cinquième pôle est créé (2026-31).",
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
    sources: [{ label: "Nos actions — vice-présider un pôle", href: "/programmes#diriger-un-pole" }, { label: "Fiches de mission", href: "/programmes/fiches-de-mission" }],
    suite: "Remplacée le 1er octobre 2026 (2026-31) : les directions de pôle deviennent des vice-présidences déléguées, pourvues par élection ; en anglais, « Pillar Vice-President ».",
  },
  {
    id: "2026-14", date: "2026-09-29", type: "decision",
    titre: "Quatre intitulés alignés sur les activités",
    texte: "07 Eau, assainissement & hygiène (le WASH des ONG) ; 08 Énergie, routes & urbanisme (les infrastructures, dont l’énergie venue de la 07) ; 09 Éducation, jeunesse & formation (jusqu’ici Jeunesse & réussite) ; 17 Connectivité & services numériques (la connexion internet venue de la 07). Numéros, liens et coordinations inchangés.",
    sources: [{ label: "Nos actions", href: "/programmes#pole-2" }, { label: "Secteurs d’intervention", href: "/secteurs" }],
    suite: "Le 30 septembre 2026, l’énergie devient une thématique à part, la 21 ; la 08 devient Routes & urbanisme (2026-29).",
  },
  {
    id: "2026-20", date: "2026-09-22", type: "nomination",
    titre: "Coordination de la thématique Culture & patrimoine vivant",
    texte: "La coordination est confiée à Félix Mbété Nangmbatnan le 22 septembre 2026. Le 28 septembre 2026, le Dr Yaphete Madjiradé lui succède (entrée 2026-08).",
    sources: [{ label: "Nos actions", href: "/programmes#culture-patrimoine-vivant" }, { label: "Journal des corrections", href: "/transparence#corrections" }],
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
    sources: [{ label: "Démarches — vers le statut d’ONG", href: "/association/demarches#vers-ong" }],
    suite: "Vérifier d’abord l’autorisation de l’association au titre de l’ordonnance de 2018 ; nom et objet à fixer par l’assemblée générale.",
  },
  {
    id: "regle-01", date: "2026-09-23", type: "regle", datee: true,
    titre: "Aucune collecte avant l’autorisation, le vote de la grille et un compte au nom de l’association",
    texte: "Collecte suspendue depuis le 23 septembre 2026 (journal des corrections, 23 septembre 2026), jusqu’à ce que les trois conditions de la décision 2026-16 soient réunies ; les intentions d’adhésion et les promesses de contribution n’engagent aucun paiement.",
    sources: [{ label: "Journal des corrections, 23 septembre 2026", href: "/transparence#corrections" }, { label: "Notre mission — le bureau", href: "/mission" }, { label: "Plateforme de projets", href: "/projets" }],
  },
  {
    id: "regle-02", date: "2026-09-11", type: "regle",
    titre: "Lieux sacrés et sépultures : ne rien publier",
    texte: "Le registre des lieux sacrés et des sépultures est tenu avec les chefs ; rien n’en paraît sur la carte ni sur le site.",
    sources: [{ label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" }],
  },
  {
    id: "regle-03", date: "2026-09-11", type: "regle",
    titre: "Réponse sous 48 heures ouvrées, plainte possible, corrections datées",
    texte: "Toute demande reçoit une réponse sous 48 heures ouvrées ; une plainte est possible, même anonyme ; chaque erreur de fait est corrigée et datée dans le journal des corrections.",
    sources: [{ label: "Redevabilité & transparence", href: "/transparence" }],
  },
];

export const decisionsTriees = () => [...DECISIONS].sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : b.date.localeCompare(a.date)));
