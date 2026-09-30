/* Sous-sol et ressources naturelles du Mandoul Occidental (page /territoire/sous-sol, 30 septembre 2026).
   Règle de la page : chaque constat renvoie à une source publique lue le 30 septembre 2026 ; ce qui n'a pas été
   trouvé est écrit comme inconnu, jamais supposé. Les propositions sont à valider par le bureau. */

export type Source = { id: string; titre: string; editeur: string; date: string; href: string };
export type Lien = { label: string; href: string };

export const SOURCES: Record<string, Source> = {
  manara: { id: "manara", titre: "Tchad : 8 dates qui ont marqué 22 ans d’exploitation pétrolière", editeur: "Manara Radio Télévision", date: "s. d.", href: "https://manara.td/tchad-8-dates-qui-ont-marque-22-ans-dexploitation-petroliere/" },
  itie2018: { id: "itie2018", titre: "Rapport ITIE Tchad 2018", editeur: "ITIE Tchad", date: "exercice 2018", href: "https://eiti.org/sites/default/files/attachments/rapport-itie-tchad-2018-signe.pdf" },
  doba: { id: "doba", titre: "Doba, Chad", editeur: "Wikipédia (en)", date: "consulté le 30 septembre 2026", href: "https://en.wikipedia.org/wiki/Doba,_Chad" },
  ecofin2014: { id: "ecofin2014", titre: "Tchad : United Hydrocarbon croise 16,5 m de pétrole avec Belanga North-1 sur le bassin Doba", editeur: "Agence Ecofin", date: "2 avril 2014", href: "https://www.agenceecofin.com/hydrocarbures/0204-18894-tchad-united-hydrocarbon-croise-16-5-m-de-petrole-avec-belanga-north-1-sur-le-bassin-doba" },
  ecomatin2025: { id: "ecomatin2025", titre: "Le Tchad annonce l’entrée en production du champ pétrolier de Belanga au troisième trimestre 2025", editeur: "Ecomatin", date: "13 mars 2025", href: "https://ecomatin.net/le-tchad-annonce-lentree-en-production-du-champ-petrolier-de-belanga-au-troisieme-trimestre-2025" },
  erhc: { id: "erhc", titre: "ERHC’s Oil and Gas Exploration Interests in Chad", editeur: "ERHC Energy", date: "consulté le 30 septembre 2026", href: "https://www.erhc.com/chad/" },
  bm2023: { id: "bm2023", titre: "Tchad : rapport diagnostique du secteur minier", editeur: "Banque mondiale", date: "août 2023", href: "https://documents1.worldbank.org/curated/en/099645309252323668/pdf/IDU0b334e5b70c5d2043790b4b40b8eb3b140716.pdf" },
  orTchad: { id: "orTchad", titre: "Exploitation aurifère au Tchad", editeur: "Wikipédia", date: "consulté le 30 septembre 2026", href: "https://fr.wikipedia.org/wiki/Exploitation_aurif%C3%A8re_au_Tchad" },
  crs2004: { id: "crs2004", titre: "Le pétrole tchadien : miracle ou mirage ? Suivre l’argent au dernier-né", editeur: "Catholic Relief Services et Bank Information Center", date: "décembre 2004", href: "https://www.liberationafrique.org/IMG/pdf/chad_oil_report_fr-2.pdf" },
  afrik2005: { id: "afrik2005", titre: "Le Tchad révise sa loi sur le pétrole", editeur: "Afrik.com", date: "30 décembre 2005", href: "https://www.afrik.com/le-tchad-revise-sa-loi-sur-le-petrole" },
  kome2021: { id: "kome2021", titre: "À Komé, où est passé le magot du pétrole ? (reportage de Libération)", editeur: "Le Tchadanthropus-tribune", date: "21 mai 2021", href: "https://www.letchadanthropus-tribune.com/tchad-petrole-a-kome-ou-est-passe-le-magot-du-petrole-reportage/" },
};

export type Constat = { titre: string; texte: string; sources: string[]; liens?: Lien[] };

/* Ce qui est établi, par une source publique. */
export const SAVOIRS: Constat[] = [
  {
    titre: "Le pétrole est exploité chez le voisin depuis 2003",
    texte: "Le bassin de Doba est en exploitation depuis son inauguration le 10 octobre 2003 ; ses champs (Komé, Bolobo, Miandoum, Nya, Moundouli, Maikeri, Timbré) étaient conduits par le consortium mené par Esso, autour de Doba, chef-lieu du Logone Oriental. En 2023, le Parlement de transition a nationalisé les actifs d’ExxonMobil au Tchad.",
    sources: ["manara", "itie2018", "doba"],
  },
  {
    titre: "Le bassin de Doba est encore exploré",
    texte: "En 2014, United Hydrocarbon annonçait du pétrole au puits Belanga North-1, dans le bassin de Doba. En mars 2025, le gouvernement annonçait l’entrée en production du champ de Belanga pour le troisième trimestre 2025. Nous ne savons ni si elle a eu lieu, ni où se trouve précisément le champ.",
    sources: ["ecofin2014", "ecomatin2025"],
  },
  {
    titre: "Des blocs à cheval sur deux bassins",
    texte: "ERHC Energy a signé en 2011 un contrat de partage de production pour le bloc BDS 2008 (41 800 km²), qui couvre des zones des bassins de Doseo et de Doba. Nous n’avons pas trouvé ce que ce bloc couvre dans le Mandoul, ni s’il est toujours actif.",
    sources: ["erhc"],
  },
  {
    titre: "Un sous-sol très peu étudié",
    texte: "Selon la Banque mondiale, les levés géophysiques aéroportés ne couvrent que 5 % du territoire tchadien. Dire que le sous-sol du Mandoul Occidental est prometteur est donc une hypothèse raisonnable, au voisinage d’un bassin producteur : ce n’est pas encore un fait établi.",
    sources: ["bm2023"],
  },
  {
    titre: "Le fer, une richesse ancienne du pays sara",
    texte: "Dans le pays sara, le fer venait d’un minerai local, extrait puis fondu dans des hauts fourneaux par des fondeurs installés dans les régions riches en minerai ; c’est le fer, plutôt que les cauris ou le bétail, qui servait de monnaie au sud du lac Tchad (Josette Rivallain, ORSTOM, 1988). Les Ndjan, à l’origine de Bédjondo et de Bédaya, sont reconnus pour leur maîtrise de cette métallurgie. Qu’il existe aujourd’hui dans le département un minerai de fer exploitable en quantité, aucune source publique que nous avons consultée ne le dit : c’est à vérifier.",
    sources: [],
    liens: [{ label: "Le Kul et les monnaies de fer", href: "/journal/2026-09-15-monnaie-kul-echanges-economiques" }, { label: "La fondation ndjan", href: "/journal/2026-09-13-bedjondo-bedaya-fondation-ndjan" }],
  },
  {
    titre: "L’or, pour l’instant, est ailleurs — et il attire nos enfants",
    texte: "L’orpaillage au Tchad est signalé dans le Nord, au Tibesti, depuis 2012. Notre diagnostic territorial documente déjà le départ d’enfants du département vers les sites aurifères du Nord, Péni étant expressément citée.",
    sources: ["orTchad"],
    liens: [{ label: "Diagnostic territorial", href: "/territoire/diagnostic#prob-06" }],
  },
];

/* Ce que nous n'avons trouvé dans aucune source publique. */
export const INCONNUES: string[] = [
  "Si un permis pétrolier, minier ou de carrière couvre aujourd’hui tout ou partie du Mandoul Occidental, au profit de qui, et jusqu’à quand : nous n’avons pas trouvé de carte des permis publiée en ligne.",
  "Si des levés sismiques ou des forages ont déjà eu lieu dans le département, et ce qu’ils ont montré.",
  "Où se trouvaient les minières et les hauts fourneaux des anciens fondeurs, et ce que vaut aujourd’hui le minerai de fer du département : teneur, étendue, profondeur. Aucune analyse publique ne le dit.",
  "S’il existe des sites d’orpaillage ou des carrières en activité dans le département (sable, gravier, latérite, argile), et qui les autorise.",
  "Ce que la région productrice a reçu au titre de sa part des revenus pétroliers : le rapport ITIE 2018 n’a pas pu obtenir ces données de l’organe qui la gère.",
  "L’état initial de l’eau et des sols du département : sans lui, aucun dommage futur ne pourra être prouvé.",
];

/* Leçons tirées de l'expérience de Doba. */
export const LECONS: Constat[] = [
  {
    titre: "Une part locale écrite dans la loi…",
    texte: "La loi n° 001/PR/1999 réservait à la région productrice du Sud 4,5 % des revenus pétroliers directs, en financement supplémentaire. Le Tchad adhère à l’Initiative pour la transparence des industries extractives (ITIE) depuis le 20 août 2007 ; selon le rapport ITIE 2018, la gestion des revenus pétroliers relevait alors de la loi n° 02/2014.",
    sources: ["crs2004", "itie2018"],
  },
  {
    titre: "… qui ne suffit pas",
    texte: "La révision de la loi, fin 2005, a supprimé le fonds pour les générations futures et porté de 15 à 30 % la part versée au budget général. En 2021, un reportage à Komé rapporte que l’électricité des installations n’a jamais atteint les villages voisins et que des bâtiments financés par la part régionale ont été construits « dans des endroits absurdes ».",
    sources: ["afrik2005", "kome2021"],
  },
  {
    titre: "Ce que nous en retenons",
    texte: "Une ressource ne profite pas d’elle-même à ceux qui vivent dessus. Les règles se fixent avant le premier forage, pas après : qui est consulté, ce qui est protégé, ce qui revient au territoire, et comment on le vérifie.",
    sources: [],
  },
];

export type Proposition = { qui: string; texte: string; liens?: Lien[] };

/* Propositions du 30 septembre 2026, à valider par le bureau. */
export const PROPOSITIONS: Proposition[] = [
  { qui: "État · ministères du Pétrole et des Mines", texte: "Publier les permis pétroliers, miniers et de carrière qui couvrent le Mandoul Occidental : titulaire, dates, périmètre. Le Tchad ayant adhéré à l’ITIE, ces informations ont vocation à être publiques." },
  { qui: "Préfecture · sous-préfectures", texte: "Informer par écrit la commune et les chefs de canton avant tout levé, forage ou ouverture de site, et réunir les communautés concernées avant les travaux, pas après.", liens: [{ label: "Gouvernance locale", href: "/territoire/gouvernance-locale" }] },
  { qui: "Commune · chefferies", texte: "Inscrire au plan communal le périmètre des lieux sacrés et des sépultures avant toute exploration, et garantir par écrit les compensations foncières.", liens: [{ label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" }] },
  { qui: "Opérateurs, s’il y en a", texte: "Publier un état initial de l’eau et des sols avant les travaux ; recruter et former d’abord dans le département ; faire profiter les villages voisins de l’électricité produite sur les sites.", liens: [{ label: "Plaidoyer formation professionnelle", href: "/journal/2026-09-17-plaidoyer-formation-professionnelle-bedjondo" }, { label: "Plaidoyer électricité", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" }] },
  { qui: "Tous", texte: "Aucun enfant sur un site d’extraction, ici ou au Nord.", liens: [{ label: "Protection sociale, enfance & inclusion", href: "/programmes#solidarite-inclusion" }] },
];

/* Ce que l'association s'engage à faire elle-même (la contrepartie). */
export const ENGAGEMENTS: Proposition[] = [
  { qui: "Écrire", texte: "Demander par écrit aux ministères la carte des permis couvrant le département, et publier la réponse — ou le silence." },
  { qui: "Documenter", texte: "Rassembler dans la bibliothèque les études publiques sur la géologie du pays bedjond et du bassin de Doba.", liens: [{ label: "Bibliothèque", href: "/bibliotheque" }] },
  { qui: "Enquêter", texte: "Mener l’enquête de terrain sur les départs vers les sites aurifères, toujours à deux enquêteurs, sans que les fiches remplies quittent le bureau.", liens: [{ label: "Enquêtes de terrain", href: "/territoire/enquetes" }] },
  { qui: "Rester indépendants", texte: "N’accepter aucun financement d’une société extractive sans le publier." },
];
