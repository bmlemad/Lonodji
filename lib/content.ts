import fs from "node:fs";
import path from "node:path";
import { GROUPE_WHATSAPP, RESEAUX, TELEPHONE, TELEPHONE_HREF, WHATSAPP } from "./contact";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Section = { id: string; alt: boolean; cls: string; tag?: string; html: string };
export type TocItem = { href: string; label: string };

export type LegacyPage = {
  slug: string;
  route: string;
  kind: "hub" | "dossier" | "en";
  legacy: string;
  lang: string;
  documentTitle: string;
  description: string;
  title: string;
  eyebrow: string;
  lede: string;
  pills: string[];
  kicker?: string;
  crumbs: string[];
  parent: string;
  resume?: string[];
  toc?: TocItem[];
  sections: Section[];
  words: number;
  forms: string[];
  hasMap: boolean;
  scripts?: string[];
  rootAttrs?: Record<string, string>;
};

export type Article = LegacyPage & {
  date: string;
  dateLabel: string;
  readTime: string;
  byline: string;
  tag: string;
  category: string;
  summary: string;
};

export type ArticleSummary = {
  slug: string;
  route: string;
  title: string;
  date: string;
  dateLabel: string;
  tag: string;
  category: string;
  summary: string;
  readTime: string;
  words: number;
  byline: string;
  pills: string[];
};

export type OddChip = { num: string; name: string; cible: string; title: string; accent: string; ink: string };
export type Thematique = {
  id: string;
  number: string;
  kind: "thematique" | "cellule";
  name: string;
  status: string;
  filled: boolean;
  coordinator: string;
  coordinatorLabel: string;
  description: string;
  descriptionText: string;
  tags: string[];
  odd: OddChip[];
  links: { label: string; href: string }[];
};
export type Direction = { label: string; rang: string; name: string; filled: boolean };
export type Pole = { id: string; roman: string; eyebrow: string; name: string; intro: string; items: Thematique[]; direction?: Direction };
export type Plaidoyer = {
  id: string; title: string; href: string; theme: string; themeHref: string; status: string; demand: string;
  recipients: string; published: string; sent: string; answer: string; pdf: string;
};
export type DocumentItem = {
  title: string; status: string; meta: string; description: string; pdf: string; links: { label: string; href: string }[];
};
export type HistoryItem = { year: string; title: string; text: string };

export type ContentIndex = {
  pages: { slug: string; route: string; kind: string; title: string; eyebrow: string; lede: string; description: string; parent: string; words: number; hasMap: boolean }[];
  articles: ArticleSummary[];
  journalCategories: { slug: string; label: string }[];
  structure: { poles: Pole[]; cellules: Pole };
  plaidoyers: Plaidoyer[];
  documents: DocumentItem[];
  history: HistoryItem[];
};

let indexCache: ContentIndex | null = null;

/* Les textes courts (chapôs, résumés, repères) sont extraits de l'ancien site balise par balise :
   un lien ou un gras suivi d'une virgule y laissait une espace parasite (« adhésion , sans paiement »).
   On la retire à la lecture, sans toucher au HTML des sections ni aux adresses. */
const ESPACE_PARASITE = /(?<=[\p{L}\p{N}»)’])[ \u00a0]+(?=[,.](?:\s|$))/gu;
const CLES_INTACTES = new Set(["html", "href", "route", "slug", "pdf", "legacy", "themeHref"]);
function sansEspaceParasite<T>(v: T, cle = ""): T {
  if (typeof v === "string") return (CLES_INTACTES.has(cle) ? v : v.replace(ESPACE_PARASITE, "")) as T;
  if (Array.isArray(v)) return v.map((x) => sansEspaceParasite(x, cle)) as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = sansEspaceParasite(x, k);
    return o as T;
  }
  return v;
}

export function getIndex(): ContentIndex {
  if (!indexCache) {
    indexCache = sansEspaceParasite(JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "index.json"), "utf8")) as ContentIndex);
  }
  return indexCache;
}

export function getPage(slug: string): LegacyPage {
  const file = path.join(CONTENT_DIR, "pages", `${slug.replace("/", "--")}.json`);
  return sansEspaceParasite(JSON.parse(fs.readFileSync(file, "utf8")) as LegacyPage);
}

export function hasPage(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, "pages", `${slug.replace("/", "--")}.json`));
}

export function getArticle(slug: string): Article {
  const file = path.join(CONTENT_DIR, "articles", `${slug}.json`);
  return sansEspaceParasite(JSON.parse(fs.readFileSync(file, "utf8")) as Article);
}

export function listArticleSlugs(): string[] {
  return fs.readdirSync(path.join(CONTENT_DIR, "articles")).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}

export function listDossierSlugs(): string[] {
  return getIndex().pages.filter((p) => p.kind === "dossier").map((p) => p.slug);
}

export function listEnSlugs(): string[] {
  return getIndex().pages.filter((p) => p.kind === "en").map((p) => p.slug.replace("en/", ""));
}

/** Sections d'une page de fond, filtrées par identifiant ou par exclusion. */
export function pickSections(page: LegacyPage, opts: { only?: string[]; exclude?: string[] } = {}): Section[] {
  return page.sections.filter((s) => {
    if (opts.only && !opts.only.includes(s.id)) return false;
    if (opts.exclude && opts.exclude.includes(s.id)) return false;
    return true;
  });
}

export const thematiqueCount = (idx: ContentIndex) => idx.structure.poles.reduce((n, p) => n + p.items.length, 0);

export const filledCount = (idx: ContentIndex) => idx.structure.poles.reduce((n, p) => n + p.items.filter((t) => t.filled).length, 0);
/* Vice-présidences de pôle (directions de pôle jusqu'au 01/10/2026) : pourvues / total. */
export const directionsCount = (idx: ContentIndex) => ({ total: idx.structure.poles.filter((p) => p.direction).length, pourvues: idx.structure.poles.filter((p) => p.direction?.filled).length });
/* Nombres en lettres (0 à 69), pour les phrases qui comptent thématiques, mesures, projets. */
const LETTRES = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
/* 21 à 69 (au féminin, comme « une ») : « vingt et une », « vingt-neuf », « trente-quatre »… ; au-delà, en chiffres. */
const DIZAINES: Record<number, string> = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante" };
const lettres = (n: number): string => {
  if (LETTRES[n]) return LETTRES[n];
  const d = Math.floor(n / 10), u = n % 10;
  if (!DIZAINES[d]) return String(n);
  return u === 0 ? DIZAINES[d] : u === 1 ? `${DIZAINES[d]} et une` : `${DIZAINES[d]}-${LETTRES[u]}`;
};
export const enLettres = (n: number, majuscule = false) => { const t = lettres(n); return majuscule ? t.charAt(0).toUpperCase() + t.slice(1) : t; };

export const ORG = {
  name: "ADEB LONODJI",
  fullName: "Association de Développement et d’Entraide de Bédjondo",
  tagline: "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond.",
  motto: "Courage · Discipline · Héritage",
  place: "Bédjondo · Mandoul Occidental · Mandoul, Tchad",
  phone: TELEPHONE,
  phoneHref: TELEPHONE_HREF,
  whatsapp: WHATSAPP,
  whatsappGroupe: GROUPE_WHATSAPP,   // groupe WhatsApp « Lonodji », lien communiqué le 2 octobre 2026
  ...RESEAUX,   // Facebook, X, YouTube, LinkedIn : lib/contact.ts
  url: "https://lonodji.org",
  bureau: [
    { role: "Président", name: "Adoumbé Maoura", note: "Contact officiel de l’association : appel et WhatsApp" },
    { role: "Vice-présidente", name: "Célestine Moyombaye", note: "" },
    { role: "Secrétaire général", name: "Salomon Ngarbaye", note: "" },
    { role: "Trésorière", name: "Élisabeth Neloumngaye Ndodinguem", note: "Collecte suspendue jusqu’à l’ouverture d’un compte au nom de l’association" },
    { role: "Animateur", name: "Bignéro Moïalbéi LE MADANG", note: "Animation générale de l’association, communication et numérique" },
  ],
};

/** Coupe une description à 160 caractères sur une limite de mot (balises meta). */
export function metaDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  // QA du 1er octobre 2026 : un aperçu de partage (WhatsApp, Facebook, moteurs) qui finit par « … » au milieu d'une
  // phrase se lit mal. On garde d'abord les phrases entières qui tiennent (70 caractères au moins), sinon on coupe
  // au dernier mot.
  const phrases = t.slice(0, max + 1).match(/^.*[.!?][»)]?(?=\s|$)/);
  if (phrases && phrases[0].length >= 70 && phrases[0].length <= max) return phrases[0];
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}

/* Image de partage d'une route (Open Graph / Twitter) : public/og/<route>.jpg
   quand scripts/build-og.py l'a produite, sinon l'image générale du site. */
export function ogImage(route: string) {
  const name = route === "/" ? "index" : route.replace(/^\//, "").replace(/\//g, "--");
  const file = path.join(process.cwd(), "public", "og", `${name}.jpg`);
  const url = fs.existsSync(file) ? `/og/${name}.jpg` : "/og/index.jpg";   // JPEG léger : WhatsApp ignore les aperçus de plus de 300 ko environ
  return [{ url, width: 1200, height: 630, alt: "ADEB LONODJI" }];
}

/* Bloc Open Graph d'une route : titre et description viennent des métadonnées
   de la page (Next les reprend), le reste est commun au site. */
export function ogFor(route: string, lang: "fr" | "en" = "fr") {
  return { siteName: ORG.name, locale: lang === "en" ? "en_GB" : "fr_FR", type: "website" as const, url: route, images: ogImage(route) };
}

/* Pages anglaises écrites dans l'appli (hors import de l'ancien site) : plan du site, sitemap, index de recherche. */
export const EN_PAGES_APP: { route: string; title: string }[] = [
  { route: "/en/odeb", title: "The ODEB LONODJI project — Vision 2030" },
  { route: "/en/villages", title: "Find your village — the Bedjond country, unit by unit" },
  { route: "/en/projects", title: "Projects — each one with its stage, what is missing and how to help" },
  { route: "/en/impact", title: "Impact dashboard — six dated, sourced indicators" },
  { route: "/en/sectors", title: "Our sectors of work — WASH, health, nutrition, emergencies, DRR" },
  { route: "/en/donors", title: "Donor programmes in Chad — World Bank, EU, UN, AfDB, and where we connect" },
];
