/* Navigation du site : une seule source pour le méga-menu de l'en-tête, le
   menu mobile, le pied de page et le plan du site. Pas d'accès au disque :
   ce module est aussi chargé côté client (composants « use client »). */
import { IDENTITE, ODEB } from "./odeb";

export type NavLien = { label: string; href: string; note?: string; externe?: boolean };
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
      { titre: "Quatre pôles, vingt thématiques", liens: [
        { label: "Mémoire, culture & patrimoine", href: "/programmes#pole-1", note: "Pôle I" },
        { label: "Développement humain & moyens d’existence", href: "/programmes#pole-2", note: "Pôle II" },
        { label: "Gouvernance, paix & plaidoyer", href: "/programmes#pole-3", note: "Pôle III" },
        { label: "Numérique & innovation", href: "/programmes#pole-4", note: "Pôle IV" },
        { label: "Secteurs d’intervention", href: "/secteurs", note: "Les mêmes thématiques, en langue ONG" },
        { label: "Fiches de mission (PDF)", href: "/programmes/fiches-de-mission", note: "Diriger un pôle, coordonner une thématique" },
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
        { label: "Décentralisation & développement local", href: "/territoire/decentralisation", note: "Commune, canton, sous-préfecture" },
        { label: "Nos propositions à la commune", href: "/territoire/propositions-commune", note: "Toutes réunies, chacune sourcée" },
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
        { label: "Installer l’application", href: "/projets/application", note: "Android, iPhone, hors ligne" },
      ] },
    ],
    vedette: { kicker: "Une place pour chaque contribution", titre: () => "Nous répondons sous 48 heures ouvrées", texte: () => "Par le formulaire, par WhatsApp ou par téléphone : le contact officiel est celui du président de l’association.", href: "/participer#contact", label: "Nous écrire" },
  },
];

/* Section courante d'une page, pour surligner l'entrée du menu. */
export function entreeCourante(pathname: string): string {
  if (pathname === "/") return "";
  if (pathname.startsWith("/journal") || pathname.startsWith("/lettre")) return "journal";
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
    { label: "Propositions à la commune", href: "/territoire/propositions-commune" }, { label: "Observatoire", href: "/observatoire" }, { label: "Diagnostic territorial", href: "/territoire/diagnostic" }, { label: "Enquêtes de terrain", href: "/territoire/enquetes" },
  ] },
  { titre: "Patrimoine", liens: [
    { label: "Histoire & grandes figures", href: "/histoire" }, { label: "La langue nangnda", href: "/langue" }, { label: "Bibliothèque numérique", href: "/bibliotheque" },
    { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" }, { label: "Généalogies", href: "/patrimoine/genealogies" }, { label: "Racontez Bédjondo", href: "/temoignages" },
  ] },
  { titre: "Participer", liens: [
    { label: "Adhérer (déclaration d’intention)", href: "/participer#adherer" }, { label: "Nous soutenir", href: "/participer#soutenir" }, { label: "Signaler un besoin", href: "/territoire/besoins" },
    { label: "Le journal", href: "/journal" }, { label: "La lettre d’information", href: "/lettre" }, { label: "Installer l’application", href: "/projets/application" },
  ] },
];
