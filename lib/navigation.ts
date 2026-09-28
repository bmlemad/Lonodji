/* Navigation du site : une seule source pour le méga-menu de l'en-tête, le
   menu mobile, le pied de page et le plan du site. Pas d'accès au disque :
   ce module est aussi chargé côté client (composants « use client »). */
import { MENU_ODEB, ODEB } from "./odeb";

export type NavLien = { label: string; href: string; note?: string; externe?: boolean };
export type NavColonne = { titre: string; liens: NavLien[] };
/* Chiffres du site passés à l'en-tête pour les cartes en vedette des panneaux. */
export type NavChiffres = { pourvues: number; total: number; fiches: number; articles: number; corrections: number };
export type NavVedette = { kicker: string; titre: (c: NavChiffres) => string; texte: (c: NavChiffres) => string; href: string; label: string };
export type NavEntree = { id: string; label: string; court?: string; href: string; colonnes?: NavColonne[]; vedette?: NavVedette };

export const NAVIGATION: NavEntree[] = [
  {
    id: "association", label: "L’association", court: "Association", href: "/mission",
    colonnes: [
      { titre: "Qui nous sommes", liens: [
        { label: "Notre mission", href: "/mission", note: "Objet, valeurs, bureau exécutif" },
        { label: "Histoire & patrimoine", href: "/histoire", note: "De 1986 à la relance de 2026, grandes figures" },
        { label: "Bédjondo", href: "/dossiers/bedjondo", note: "Repères, langue, statut de commune" },
        { label: "Le journal", href: "/journal", note: "Articles datés et sourcés" },
      ] },
      { titre: "Rendre des comptes", liens: [
        { label: "Redevabilité & transparence", href: "/transparence", note: "Réponse sous 48 h, plainte, protection" },
        { label: "Journal des corrections", href: "/transparence#corrections", note: "Chaque erreur, datée, à découvert" },
        { label: "Nos engagements publics", href: "/dossiers/engagements", note: "Ce que nous promettons, où nous en sommes" },
        { label: "Documents à télécharger", href: "/documents", note: "Kits, cahiers, plaidoyers en PDF" },
        { label: "Les démarches, pas à pas", href: "/dossiers/demarches", note: "Statut, récépissé, vers l’ONG" },
      ] },
    ],
    vedette: { kicker: "Une association qui rend des comptes", titre: (c) => `${c.corrections} corrections publiées`, texte: () => "Ce qui n’est pas encore fait est écrit comme tel ; ce qui était faux est corrigé et daté.", href: "/transparence", label: "Notre charte de redevabilité" },
  },
  {
    id: "actions", label: "Nos actions", href: "/programmes",
    colonnes: [
      { titre: "Quatre pôles, dix-neuf thématiques", liens: [
        { label: "Mémoire, culture & patrimoine", href: "/programmes#pole-1", note: "Pôle I" },
        { label: "Développement humain & moyens d’existence", href: "/programmes#pole-2", note: "Pôle II" },
        { label: "Gouvernance, paix & plaidoyer", href: "/programmes#pole-3", note: "Pôle III" },
        { label: "Numérique & innovation", href: "/programmes#pole-4", note: "Pôle IV" },
        { label: "Les deux cellules transversales", href: "/programmes#cellules", note: "Financement, communication" },
      ] },
      { titre: "Plaidoyers & suivi", liens: [
        { label: "Plaidoyers & engagements", href: "/actions", note: "Destinataires nommés, suivi public" },
        { label: "Tableau de bord d’impact", href: "/impact", note: "Six indicateurs datés et sourcés" },
        { label: "Plateforme de projets", href: "/projets", note: "Chaque projet, son stade, ce qui manque" },
        { label: "Diagnostic territorial", href: "/dossiers/problematiques", note: "Eau, santé, école, routes, réseau" },
        { label: "Carte des besoins", href: "/dossiers/besoins", note: "Signaler, localité par localité" },
        { label: "Enquêtes de terrain", href: "/dossiers/enquetes", note: "Huit inconnues, huit enquêtes" },
      ] },
      { titre: "Outils", liens: [
        { label: "Tous les dossiers", href: "/dossiers", note: "Par thème, de A à Z" },
        { label: "Quelle thématique pour vous ?", href: "/dossiers/trouver-ma-thematique", note: "Trois questions, une orientation" },
        { label: "Kit de mobilisation", href: "/dossiers/kit-mobilisation", note: "Relayer autour de vous" },
        { label: "Nos thématiques et les ODD", href: "/dossiers/odd", note: "Le lien avec l’Agenda 2030" },
      ] },
    ],
    vedette: { kicker: "Où nous en sommes", titre: (c) => `${c.pourvues} thématiques pourvues sur ${c.total}`, texte: (c) => `${c.total - c.pourvues} cherchent leur coordonnateur. Une compétence ponctuelle suffit souvent à faire avancer un dossier prêt.`, href: "/participer?coordo=1#contact", label: "Rejoindre une thématique" },
  },
  {
    id: "territoire", label: "Territoire & patrimoine", court: "Territoire", href: "/carte",
    colonnes: [
      { titre: "Le territoire", liens: [
        { label: "Carte du territoire", href: "/carte", note: "Quatorze unités, localités, équipements" },
        { label: "Les villages", href: "/villages", note: "Une fiche par localité" },
        { label: "Observatoire du Mandoul Occidental", href: "/observatoire", note: "Le territoire en chiffres, unité par unité" },
        { label: "Bédjondo", href: "/dossiers/bedjondo", note: "Village devenu ville" },
        { label: "Décentralisation & développement local", href: "/dossiers/decentralisation", note: "Commune, canton, sous-préfecture" },
      ] },
      { titre: "Le patrimoine", liens: [
        { label: "Grandes figures", href: "/histoire#figures", note: "Chefs de canton, fondateurs, chercheurs" },
        { label: "Lieux sacrés et sépultures", href: "/dossiers/lieux-sacres", note: "Recenser sans publier" },
        { label: "Écrire la généalogie de sa famille", href: "/dossiers/genealogies", note: "Cahier de terrain" },
        { label: "Cahier généalogique en ligne", href: "/dossiers/genealogie-outil", note: "Sans envoi de données" },
      ] },
      { titre: "Savoirs", liens: [
        { label: "Bibliothèque numérique bedjond", href: "/bibliotheque", note: "Thèses, articles, archives, chercheurs" },
        { label: "La langue nangnda", href: "/langue", note: "Lexique audio, dictionnaire numérique" },
        { label: "Racontez Bédjondo", href: "/temoignages", note: "Témoignages, photos, voix" },
      ] },
    ],
    vedette: { kicker: "Retrouver son village", titre: (c) => `${new Intl.NumberFormat("fr-FR").format(c.fiches)} fiches de localités`, texte: () => "Ce que les données ouvertes en savent, ce que le site en dit, ce qui reste à documenter — et le formulaire pour le faire.", href: "/villages", label: "Chercher un village" },
  },
  {
    id: "odeb", label: "Projet ODEB", href: "/odeb",
    colonnes: MENU_ODEB.map((g) => ({ titre: g.titre, liens: g.liens.map((l) => ({ label: l.label, href: l.href, note: l.note })) })),
    vedette: { kicker: `1986 → 2026 · réflexion ${ODEB.sigle} · vision ${ODEB.horizon}`, titre: () => ODEB.nom, texte: () => "Un projet de transformation institutionnelle : doter le pays bedjond d’un outil permanent de recherche, de documentation, de développement, d’innovation, de patrimoine et de diaspora.", href: "/odeb/livre-blanc", label: "Lire le livre blanc" },
  },
  { id: "journal", label: "Journal", href: "/journal" },
  {
    id: "participer", label: "Participer", href: "/participer",
    colonnes: [
      { titre: "Agir", liens: [
        { label: "Nous écrire", href: "/participer#contact", note: "Réponse sous 48 h ouvrées" },
        { label: "Rejoindre ou coordonner une thématique", href: "/participer?coordo=1#contact", note: "Proposer sa candidature" },
        { label: "Adhérer & cotiser", href: "/participer#adherer", note: "Collecte suspendue jusqu’au compte" },
        { label: "Nous soutenir", href: "/participer#soutenir", note: "Promesse de contribution" },
      ] },
      { titre: "Contribuer", liens: [
        { label: "Inscrire ses compétences", href: "/diaspora", note: "Répertoire de la diaspora" },
        { label: "Envoyer un récit, une photo, une voix", href: "/temoignages#envoyer", note: "Rien de publié sans relecture" },
        { label: "Signaler un besoin", href: "/dossiers/besoins", note: "Forage, école, pont, réseau" },
        { label: "Déposer un document", href: "/bibliotheque#deposer", note: "Thèse, article, archive" },
        { label: "Proposer un mot en nangnda", href: "/langue#dictionnaire", note: "Le dictionnaire commence par vos mots" },
        { label: "Proposer un article", href: "/participer#proposer", note: "Pour le journal" },
      ] },
      { titre: "Rester en lien", liens: [
        { label: "Lettre d’information", href: "/participer#newsletter", note: "Les nouvelles de l’association" },
        { label: "Installer l’application", href: "/dossiers/application", note: "Android, iPhone, hors ligne" },
        { label: "In English", href: "/en/index", note: "The association in English" },
      ] },
    ],
    vedette: { kicker: "Une place pour chaque contribution", titre: () => "Nous répondons sous 48 heures ouvrées", texte: () => "Par le formulaire, par WhatsApp ou par téléphone : le contact officiel est celui du président de l’association.", href: "/participer#contact", label: "Nous écrire" },
  },
];

/* Section courante d'une page, pour surligner l'entrée du menu. */
export function entreeCourante(pathname: string): string {
  if (pathname === "/") return "";
  if (pathname.startsWith("/odeb")) return "odeb";
  if (pathname.startsWith("/journal")) return "journal";
  if (/^\/(participer|diaspora|temoignages)/.test(pathname)) return "participer";
  if (/^\/(carte|villages|observatoire|bibliotheque|langue|histoire)/.test(pathname) || /^\/dossiers\/(bedjondo|lieux-sacres|genealogies|genealogie-outil|decentralisation)/.test(pathname)) return "territoire";
  if (/^\/(mission|transparence|documents|mentions-legales|archives|plan-du-site)/.test(pathname) || /^\/dossiers\/(engagements|demarches)/.test(pathname)) return "association";
  if (/^\/(programmes|actions|impact|dossiers|projets)/.test(pathname)) return "actions";
  return "";
}

/* Pied de page : cinq colonnes, choisies à la main pour rester lisibles. */
export const PIED: { titre: string; liens: NavLien[] }[] = [
  { titre: "L’association", liens: [
    { label: "Notre mission", href: "/mission" }, { label: "Histoire & patrimoine", href: "/histoire" }, { label: "Le journal", href: "/journal" },
    { label: "Redevabilité & transparence", href: "/transparence" }, { label: "Documents", href: "/documents" }, { label: "Les démarches", href: "/dossiers/demarches" }, { label: "Archives du site", href: "/archives" },
  ] },
  { titre: "Nos actions", liens: [
    { label: "Quatre pôles, dix-neuf thématiques", href: "/programmes" }, { label: "Plaidoyers & engagements", href: "/actions" }, { label: "Tableau de bord d’impact", href: "/impact" },
    { label: "Plateforme de projets", href: "/projets" }, { label: "Diagnostic territorial", href: "/dossiers/problematiques" }, { label: "Carte des besoins", href: "/dossiers/besoins" }, { label: "Tous les dossiers", href: "/dossiers" }, { label: "Quelle thématique pour vous ?", href: "/dossiers/trouver-ma-thematique" },
  ] },
  { titre: "Territoire & patrimoine", liens: [
    { label: "Carte du territoire", href: "/carte" }, { label: "Les villages", href: "/villages" }, { label: "Observatoire", href: "/observatoire" }, { label: "Bédjondo", href: "/dossiers/bedjondo" },
    { label: "Bibliothèque numérique", href: "/bibliotheque" }, { label: "La langue nangnda", href: "/langue" }, { label: "Lieux sacrés et sépultures", href: "/dossiers/lieux-sacres" }, { label: "Généalogies", href: "/dossiers/genealogies" },
  ] },
  { titre: "Participer", liens: [
    { label: "Nous écrire", href: "/participer#contact" }, { label: "Adhérer & cotiser", href: "/participer#adherer" }, { label: "Nous soutenir", href: "/participer#soutenir" },
    { label: "Inscrire ses compétences", href: "/diaspora" }, { label: "Racontez Bédjondo", href: "/temoignages" }, { label: "Signaler un besoin", href: "/dossiers/besoins" }, { label: "Installer l’application", href: "/dossiers/application" },
  ] },
  { titre: "Projet ODEB · Vision 2030", liens: [
    { label: "La vision", href: "/odeb" }, { label: "Pourquoi créer l’ODEB ?", href: "/odeb#pourquoi" }, { label: "Livre blanc", href: "/odeb/livre-blanc" }, { label: "Feuille de route 2026-2030", href: "/odeb/feuille-de-route" },
    { label: "Les cinq programmes", href: "/odeb/programmes" },
  ] },
];
