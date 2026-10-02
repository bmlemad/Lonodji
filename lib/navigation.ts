/* Navigation du site : une seule source pour le méga-menu de l'en-tête, le
   menu mobile, le pied de page et le plan du site. Pas d'accès au disque :
   ce module est aussi chargé côté client (composants « use client »). */
import { IDENTITE, ODEB } from "./odeb";

export type NavLien = { label: string; href: string; note?: string; externe?: boolean; fr?: boolean };
export type NavColonne = { titre: string; liens: NavLien[] };
/* Chiffres du site passés à l'en-tête pour les cartes en vedette des panneaux. */
export type NavChiffres = { pourvues: number; total: number; fiches: number; articles: number; corrections: number };
export type NavVedette = { kicker: string; titre: (c: NavChiffres) => string; texte: (c: NavChiffres) => string; href: string; label: string; image?: string };
export type NavEntree = { id: string; label: string; court?: string; href: string; colonnes?: NavColonne[]; vedette?: NavVedette };

/* Six entrées depuis la restructuration du 29/09/2026 : l'association (et sa vision 2030), nos actions,
   le territoire, le patrimoine, le journal, participer. Une page n'apparaît qu'à un seul endroit du menu. */
export const NAVIGATION: NavEntree[] = [
  {
    id: "association", label: "L’association", court: "Association", href: "/mission",
    colonnes: [
      { titre: "Qui nous sommes", liens: [
        { label: "Notre mission", href: "/mission", note: "Objet, valeurs, bureau exécutif, repères" },
        { label: "Presse & partenaires", href: "/presse", note: "En bref, chiffres, logos, contacts" },
        { label: "Événements", href: "/association/evenements", note: "Réunions, assemblées, activités" },
        { label: "ONG & bailleurs : notre statut", href: "/association/ong-partenaires", note: "Statut, partenaires présents au Mandoul" },
        { label: "Les démarches, pas à pas", href: "/association/demarches", note: "Statut, récépissé, vers l’ONG" },
        { label: "Décisions d’organisation", href: "/association/propositions-organisation", note: "Six pôles, sept priorités : décidé le 1er octobre 2026" },
        { label: "Élection des vice-présidences", href: "/association/election-vice-presidences", note: "Candidatures du 2 au 15 octobre, vote le 22" },
      ] },
      { titre: "Rendre des comptes", liens: [
        { label: "Redevabilité & transparence", href: "/transparence", note: "Réponse sous 48 h, plainte, protection" },
        { label: "Registre des décisions", href: "/transparence/decisions", note: "Décidé, nommé, annoncé, proposé" },
        { label: "Nos engagements publics", href: "/association/engagements", note: "Ce que nous promettons, où nous en sommes" },
        { label: "Journal des corrections", href: "/transparence#corrections", note: "Chaque erreur, datée, à découvert" },
        { label: "Documents à télécharger", href: "/documents", note: "Kits, cahiers, plaidoyers en PDF" },
      ] },
      { titre: "Vision 2030 — projet ODEB", liens: [
        { label: "La vision et les six missions", href: "/odeb", note: "D’une association à un outil permanent" },
        { label: "Les six programmes", href: "/odeb/programmes", note: "Et les thématiques qu’ils mobilisent" },
        { label: "Livre blanc", href: "/odeb/livre-blanc", note: "Le document fondateur, version de travail" },
        { label: "Feuille de route 2026-2030", href: "/odeb/feuille-de-route", note: "Ce qui est fait, ce qui reste" },
        { label: "Identité visuelle", href: "/odeb/identite", note: "Le logo « Les Pas vers l’Avenir »" },
      ] },
    ],
    vedette: { kicker: `1986 → 2026 · réflexion ${ODEB.sigle} · vision ${ODEB.horizon}`, titre: () => ODEB.nom, texte: () => "Le projet de l’association pour doter le pays bedjond d’un outil permanent de recherche, de développement, de patrimoine et de diaspora.", href: "/odeb/livre-blanc", label: "Lire le livre blanc", image: IDENTITE.superposable },
  },
  {
    id: "actions", label: "Nos actions", href: "/programmes",
    colonnes: [
      { titre: "Six pôles · thématiques structurées", liens: [
        { label: "Mémoire, culture & patrimoine", href: "/programmes#pole-1", note: "Pôle I" },
        { label: "Services essentiels", href: "/programmes#pole-2", note: "Pôle II" },
        { label: "Gouvernance, paix & plaidoyer", href: "/programmes#pole-3", note: "Pôle III" },
        { label: "Numérique & innovation", href: "/programmes#pole-4", note: "Pôle IV" },
        { label: "Économie & ressources naturelles", href: "/programmes#pole-5", note: "Pôle V" },
        { label: "Infrastructures, territoire & risques", href: "/programmes#pole-6", note: "Pôle VI" },
        { label: "Secteurs d’intervention", href: "/secteurs", note: "Les mêmes thématiques, en langue ONG" },
        { label: "Fiches de mission (PDF)", href: "/programmes/fiches-de-mission", note: "Vice-présider un pôle, coordonner une thématique" },
      ] },
      { titre: "Ce que nous faisons", liens: [
        { label: "Plaidoyers & engagements", href: "/actions", note: "Huit dossiers, destinataires nommés" },
        { label: "Projets", href: "/projets", note: "Chaque projet, son stade, ce qui manque" },
        { label: "Programmes des bailleurs", href: "/bailleurs", note: "Banque mondiale, UE, ONU, BAD : où nous nous raccrochons" },
        { label: "Tableau de suivi", href: "/impact", note: "Indicateurs, plaidoyers, engagements, décisions" },
      ] },
      { titre: "Plans d’action", liens: [
        { label: "Agriculture, élevage & sécurité alimentaire", href: "/programmes/agriculture-securite-alimentaire" },
        { label: "Environnement & durabilité", href: "/programmes/environnement" },
        { label: "Jeunes mères, orphelins, personnes isolées", href: "/programmes/solidarite-inclusion" },
        { label: "Plan pour les veuves", href: "/programmes/veuves" },
        { label: "Plan handicap", href: "/programmes/handicap" },
        { label: "Agriculteurs et éleveurs : prévenir les conflits", href: "/programmes/agriculteurs-eleveurs" },
        { label: "Nos thématiques et les ODD", href: "/programmes/odd" },
      ] },
    ],
    vedette: { kicker: "Où nous en sommes", titre: (c) => `${c.pourvues} thématiques pourvues sur ${c.total}`, texte: (c) => `${c.total - c.pourvues} cherchent leur coordonnateur. Une compétence ponctuelle suffit souvent à faire avancer un dossier prêt.`, href: "/participer?coordo=1#contact", label: "Rejoindre une thématique" },
  },
  {
    id: "territoire", label: "Territoire", href: "/territoire",
    colonnes: [
      { titre: "Le pays bedjond", liens: [
        { label: "Carte du territoire", href: "/carte", note: "Quatorze unités, localités, équipements" },
        { label: "Les villages", href: "/villages", note: "Une fiche par localité" },
        { label: "Bédjondo", href: "/territoire/bedjondo", note: "Village devenu ville" },
        { label: "Gouvernance locale", href: "/territoire/gouvernance-locale", note: "Qui décide quoi, du canton à l’État" },
        { label: "Décentralisation & développement local", href: "/territoire/decentralisation", note: "Commune, canton, sous-préfecture" },
        { label: "Nos propositions à la commune", href: "/territoire/propositions-commune", note: "Dix projets prioritaires, mesures sourcées" },
        { label: "Sous-sol & ressources naturelles", href: "/territoire/sous-sol", note: "Pétrole, mines : savoir avant de promettre" },
      ] },
      { titre: "Comprendre et mesurer", liens: [
        { label: "Observatoire du Mandoul Occidental", href: "/observatoire", note: "Le territoire en chiffres, unité par unité" },
        { label: "Diagnostic territorial", href: "/territoire/diagnostic", note: "Eau, santé, école, routes, réseau" },
        { label: "Carte des besoins", href: "/territoire/besoins", note: "Signaler, localité par localité" },
        { label: "Enquêtes de terrain", href: "/territoire/enquetes", note: "Huit inconnues, huit enquêtes" },
      ] },
    ],
    vedette: { kicker: "Retrouver son village", titre: (c) => `${new Intl.NumberFormat("fr-FR").format(c.fiches)} fiches de localités`, texte: () => "Ce que les données ouvertes en savent, ce que le site en dit, ce qui reste à documenter — et le formulaire pour le faire.", href: "/villages", label: "Chercher un village" },
  },
  {
    id: "patrimoine", label: "Patrimoine", href: "/patrimoine",
    colonnes: [
      { titre: "Mémoire", liens: [
        { label: "Histoire & grandes figures", href: "/histoire", note: "De Narmbang à 2026, les chefs de canton" },
        { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres", note: "Recenser sans publier" },
        { label: "Généalogies", href: "/patrimoine/genealogies", note: "Cahier de terrain et cahier en ligne" },
        { label: "Racontez Bédjondo", href: "/temoignages", note: "Témoignages, photos, voix" },
      ] },
      { titre: "Savoirs", liens: [
        { label: "La langue nangnda", href: "/langue", note: "Lexique audio, dictionnaire numérique" },
        { label: "Bibliothèque numérique", href: "/bibliotheque", note: "Thèses, articles, archives, chercheurs" },
        { label: "Base de recherche", href: "/patrimoine/base-de-recherche", note: "Quarante références commentées" },
      ] },
    ],
    vedette: { kicker: "Le dictionnaire commence par vos mots", titre: () => "La langue nangnda", texte: () => "Un mot, sa prononciation, son sens : chaque proposition est relue avant d’entrer dans le dictionnaire numérique.", href: "/langue#dictionnaire", label: "Proposer un mot" },
  },
  { id: "journal", label: "Journal", href: "/journal" },
  {
    id: "participer", label: "Participer", href: "/participer",
    colonnes: [
      { titre: "Agir", liens: [
        { label: "Nous écrire", href: "/participer#contact", note: "Réponse sous 48 h ouvrées" },
        { label: "Rejoindre ou coordonner une thématique", href: "/participer?coordo=1#contact", note: "Proposer sa candidature" },
        { label: "Se faire recenser", href: "/participer/recensement", note: "Membres et sympathisants, deux minutes" },
        { label: "Adhérer (déclaration d’intention)", href: "/participer#adherer", note: "Aucun paiement tant que le compte n’est pas ouvert" },
        { label: "Nous soutenir", href: "/participer#soutenir", note: "Promesse de contribution" },
      ] },
      { titre: "Contribuer", liens: [
        { label: "Inscrire ses compétences", href: "/diaspora", note: "Répertoire de la diaspora" },
        { label: "Signaler un besoin", href: "/territoire/besoins", note: "Forage, école, pont, réseau" },
        { label: "Envoyer un récit, une photo, une voix", href: "/temoignages#envoyer", note: "Rien de publié sans relecture" },
        { label: "Déposer un document", href: "/bibliotheque#deposer", note: "Thèse, article, archive" },
        { label: "Proposer un article", href: "/participer#proposer", note: "Pour le journal" },
      ] },
      { titre: "Outils", liens: [
        { label: "Quelle thématique pour vous ?", href: "/participer/trouver-ma-thematique", note: "Trois questions, une orientation" },
        { label: "Kit de mobilisation", href: "/participer/kit-mobilisation", note: "Relayer autour de vous" },
        { label: "Lettre d’information", href: "/lettre", note: "Les nouvelles de l’association" },
        { label: "Lonodji, le magazine", href: "/magazine", note: "Trimestriel, en PDF à imprimer" },
        { label: "Installer l’application", href: "/projets/application", note: "Android, iPhone, hors ligne" },
      ] },
    ],
    vedette: { kicker: "Une place pour chaque contribution", titre: () => "Nous répondons sous 48 heures ouvrées", texte: () => "Par le formulaire, par WhatsApp ou par téléphone : le contact officiel est celui du président de l’association.", href: "/participer#contact", label: "Nous écrire" },
  },
];

/* Menu anglais (30/09/2026) : les mêmes six rubriques que le menu français. Un lien vers une page qui n'existe
   qu'en français porte fr: true (marque « FR » dans le menu, hreflang="fr"). */
export const NAVIGATION_EN: NavEntree[] = [
  {
    id: "association", label: "The association", court: "About", href: "/en/about",
    colonnes: [
      { titre: "Who we are", liens: [
        { label: "About us", href: "/en/about", note: "Purpose, values, executive board, milestones" },
        { label: "How we are organised", href: "/en/organisation", note: "Six pillars, twenty-two themes, seven priorities" },
        { label: "Election of the vice-presidents", href: "/en/election", note: "Vote on 22 October 2026" },
        { label: "Press & partners", href: "/presse", note: "Key facts, figures, logos, contacts", fr: true },
        { label: "NGOs & funders: our status", href: "/association/ong-partenaires", note: "Our status, partners present in Mandoul", fr: true },
      ] },
      { titre: "Accountability", liens: [
        { label: "Accountability & transparency", href: "/transparence", note: "48-hour reply, complaints, safeguarding", fr: true },
        { label: "Decision register", href: "/transparence/decisions", note: "Decided, appointed, announced, proposed", fr: true },
        { label: "Public commitments", href: "/association/engagements", note: "What we promise, where we stand", fr: true },
        { label: "Documents", href: "/documents", note: "Kits, field notebooks, advocacy files (PDF)", fr: true },
      ] },
      { titre: "Vision 2030 — the ODEB project", liens: [
        { label: "The vision", href: "/en/odeb", note: "From an association to a permanent institution" },
        { label: "The six programmes", href: "/odeb/programmes", note: "And the themes they draw on", fr: true },
        { label: "White paper", href: "/odeb/livre-blanc", note: "The founding document, working version", fr: true },
        { label: "Roadmap 2026-2030", href: "/odeb/feuille-de-route", note: "What is done, what remains", fr: true },
      ] },
    ],
    vedette: { kicker: `1986 → 2026 · ${ODEB.sigle} · vision ${ODEB.horizon}`, titre: () => ODEB.nom, texte: () => "The association’s project to give the Bedjond country a permanent institution for research, development, heritage and the diaspora.", href: "/en/odeb", label: "Read about the vision", image: IDENTITE.superposable },
  },
  {
    id: "actions", label: "Our work", href: "/en/themes",
    colonnes: [
      { titre: "How we are organised", liens: [
        { label: "Six pillars · themes being inventoried", href: "/en/themes", note: "Coordinators, objectives, SDGs" },
        { label: "Sectors", href: "/en/sectors", note: "Our work in the donors’ sector vocabulary" },
        { label: "Mission descriptions", href: "/programmes/fiches-de-mission", note: "One PDF per role", fr: true },
      ] },
      { titre: "Advocacy & projects", liens: [
        { label: "Advocacy", href: "/en/advocacy", note: "Advocacy files and a note to the commune" },
        { label: "Projects", href: "/en/projects", note: "What is under way, what is waiting" },
        { label: "Impact dashboard", href: "/en/impact", note: "Every figure with its source and date" },
      ] },
      { titre: "Partners", liens: [
        { label: "Donor programmes in Chad", href: "/en/donors", note: "World Bank, EU, UN, AfDB: where we connect" },
        { label: "Proposals to the commune", href: "/en/commune", note: "Ten priority projects for Bédjondo" },
      ] },
    ],
    vedette: { kicker: "Where we stand", titre: (c) => `${c.pourvues} of ${c.total} themes have a coordinator`, texte: (c) => `${c.total - c.pourvues} are still looking for someone to lead them. Occasional help is often enough to move a file forward.`, href: "/en/contact", label: "Offer your help" },
  },
  {
    id: "territoire", label: "Territory", href: "/en/villages",
    colonnes: [
      { titre: "The Bedjond country", liens: [
        { label: "Villages", href: "/en/villages", note: "One record per locality" },
        { label: "Bédjondo, our town", href: "/en/bedjondo", note: "A village that became a town" },
        { label: "Map of the territory", href: "/carte", note: "Fourteen units, localities, facilities", fr: true },
        { label: "Local governance", href: "/en/governance", note: "Who decides what, from the canton to the State" },
        { label: "Subsoil & natural resources", href: "/en/subsoil", note: "Oil, iron, gold: know before promising" },
        { label: "Decentralisation", href: "/territoire/decentralisation", note: "Commune, canton, sub-prefecture", fr: true },
      ] },
      { titre: "Understand and measure", liens: [
        { label: "Observatory", href: "/observatoire", note: "The territory in figures, unit by unit", fr: true },
        { label: "Territorial diagnosis", href: "/territoire/diagnostic", note: "Water, health, school, roads, network", fr: true },
        { label: "Needs map", href: "/territoire/besoins", note: "Report a need, locality by locality", fr: true },
      ] },
    ],
    vedette: { kicker: "Find your village", titre: (c) => `${new Intl.NumberFormat("en-GB").format(c.fiches)} locality records`, texte: () => "What open data says about each locality, what the site says, and what remains to be documented.", href: "/en/villages", label: "Search a village" },
  },
  {
    id: "patrimoine", label: "Heritage", href: "/patrimoine",
    colonnes: [
      { titre: "Memory", liens: [
        { label: "History & great figures", href: "/histoire", note: "From Narmbang to 2026", fr: true },
        { label: "Sacred sites and burial grounds", href: "/patrimoine/lieux-sacres", note: "Recorded, never published", fr: true },
        { label: "Genealogies", href: "/patrimoine/genealogies", note: "Field notebook and online notebook", fr: true },
        { label: "Tell us about Bédjondo", href: "/temoignages", note: "Stories, photos, voices", fr: true },
      ] },
      { titre: "Knowledge", liens: [
        { label: "The Nangnda language", href: "/langue", note: "Audio lexicon, digital dictionary", fr: true },
        { label: "Digital library", href: "/bibliotheque", note: "Theses, articles, archives, researchers", fr: true },
        { label: "Research base", href: "/patrimoine/base-de-recherche", note: "Forty annotated references", fr: true },
      ] },
    ],
  },
  { id: "journal", label: "News", href: "/journal" },
  {
    id: "participer", label: "Get involved", href: "/en/contact",
    colonnes: [
      { titre: "Act", liens: [
        { label: "Write to us", href: "/en/contact", note: "Reply within 48 working hours" },
        { label: "Join (declaration of intent)", href: "/participer#adherer", note: "No payment until the bank account is open", fr: true },
        { label: "Support us", href: "/participer#soutenir", note: "Pledge a contribution", fr: true },
      ] },
      { titre: "Contribute", liens: [
        { label: "Register your skills", href: "/diaspora", note: "Diaspora skills directory", fr: true },
        { label: "Report a need", href: "/territoire/besoins", note: "Borehole, school, bridge, network", fr: true },
        { label: "Send a story, a photo, a voice", href: "/temoignages#envoyer", note: "Nothing published without review", fr: true },
      ] },
    ],
    vedette: { kicker: "A place for every contribution", titre: () => "We reply within 48 working hours", texte: () => "By the form, by WhatsApp or by phone: the official contact is the president of the association.", href: "/en/contact", label: "Write to us" },
  },
];

/* Rubrique courante d'une page anglaise (ou d'une page française atteinte depuis le menu anglais). */
export function entreeCouranteEn(pathname: string): string {
  if (/^\/en\/(about|odeb)/.test(pathname)) return "association";
  if (/^\/en\/(themes|sectors|advocacy|projects|donors|impact|commune)/.test(pathname)) return "actions";
  if (/^\/en\/(villages|bedjondo)/.test(pathname)) return "territoire";
  if (/^\/en\/contact/.test(pathname)) return "participer";
  return pathname.startsWith("/en/") ? "" : entreeCourante(pathname);
}

/* Section courante d'une page, pour surligner l'entrée du menu. */
export function entreeCourante(pathname: string): string {
  if (pathname === "/") return "";
  if (pathname.startsWith("/journal") || pathname.startsWith("/lettre") || pathname.startsWith("/magazine")) return "journal";
  if (/^\/(participer|diaspora)/.test(pathname)) return "participer";
  if (/^\/(territoire|carte|villages|observatoire)/.test(pathname)) return "territoire";
  if (/^\/(patrimoine|histoire|langue|bibliotheque|temoignages)/.test(pathname)) return "patrimoine";
  if (/^\/(mission|odeb|association|transparence|documents|presse|accessibilite|mentions-legales|archives|plan-du-site)/.test(pathname)) return "association";
  if (/^\/(programmes|actions|impact|dossiers|projets|secteurs|bailleurs)/.test(pathname)) return "actions";
  return "";
}

/* Pied de page : cinq colonnes, les mêmes rubriques que le menu. */
export const PIED: { titre: string; liens: NavLien[] }[] = [
  { titre: "L’association", liens: [
    { label: "Notre mission", href: "/mission" }, { label: "Vision 2030 — projet ODEB", href: "/odeb" }, { label: "Redevabilité & transparence", href: "/transparence" },
    { label: "Registre des décisions", href: "/transparence/decisions" }, { label: "Nos engagements", href: "/association/engagements" }, { label: "Documents", href: "/documents" },
    { label: "ONG & bailleurs : notre statut", href: "/association/ong-partenaires" }, { label: "Presse & partenaires", href: "/presse" },
  ] },
  { titre: "Nos actions", liens: [
    { label: "Pôles & thématiques", href: "/programmes" }, { label: "Secteurs d’intervention", href: "/secteurs" }, { label: "Plaidoyers & engagements", href: "/actions" },
    { label: "Projets", href: "/projets" }, { label: "Programmes des bailleurs", href: "/bailleurs" }, { label: "Tableau de suivi", href: "/impact" }, { label: "Fiches de mission", href: "/programmes/fiches-de-mission" },
  ] },
  { titre: "Territoire", liens: [
    { label: "Carte du territoire", href: "/carte" }, { label: "Les villages", href: "/villages" }, { label: "Bédjondo", href: "/territoire/bedjondo" },
    { label: "Gouvernance locale", href: "/territoire/gouvernance-locale" }, { label: "Propositions à la commune", href: "/territoire/propositions-commune" }, { label: "Sous-sol", href: "/territoire/sous-sol" }, { label: "Observatoire", href: "/observatoire" }, { label: "Diagnostic territorial", href: "/territoire/diagnostic" }, { label: "Enquêtes de terrain", href: "/territoire/enquetes" },
  ] },
  { titre: "Patrimoine", liens: [
    { label: "Histoire & grandes figures", href: "/histoire" }, { label: "La langue nangnda", href: "/langue" }, { label: "Bibliothèque numérique", href: "/bibliotheque" },
    { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" }, { label: "Généalogies", href: "/patrimoine/genealogies" }, { label: "Racontez Bédjondo", href: "/temoignages" },
  ] },
  { titre: "Participer", liens: [
    { label: "Se faire recenser", href: "/participer/recensement" }, { label: "Adhérer (déclaration d’intention)", href: "/participer#adherer" }, { label: "Nous soutenir", href: "/participer#soutenir" }, { label: "Signaler un besoin", href: "/territoire/besoins" },
    { label: "Le journal", href: "/journal" }, { label: "La lettre d’information", href: "/lettre" }, { label: "Lonodji, le magazine", href: "/magazine" }, { label: "Installer l’application", href: "/projets/application" },
  ] },
];

/* Les autres pages de la même rubrique du menu (six au plus) : bloc « Dans la même rubrique » en pied
   des pages de fond, importées ou conçues (components/pages-voisines.tsx). */
export function voisinesDe(route: string): { label: string; href: string; note?: string }[] {
  const entree = NAVIGATION.find((e) => e.colonnes?.some((c) => c.liens.some((l) => l.href === route)));
  if (!entree?.colonnes) return [];
  return entree.colonnes.flatMap((c) => c.liens).filter((l) => l.href !== route && !l.href.includes("#") && !l.externe).slice(0, 6);
}
