import fs from "node:fs";
import path from "node:path";

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
export type Pole = { id: string; roman: string; eyebrow: string; name: string; intro: string; items: Thematique[] };
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

export function getIndex(): ContentIndex {
  if (!indexCache) {
    indexCache = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "index.json"), "utf8")) as ContentIndex;
  }
  return indexCache;
}

export function getPage(slug: string): LegacyPage {
  const file = path.join(CONTENT_DIR, "pages", `${slug.replace("/", "--")}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8")) as LegacyPage;
}

export function hasPage(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, "pages", `${slug.replace("/", "--")}.json`));
}

export function getArticle(slug: string): Article {
  const file = path.join(CONTENT_DIR, "articles", `${slug}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8")) as Article;
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
/* Nombres en lettres (0 à 20), pour les phrases qui comptent les thématiques. */
const LETTRES = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
export const enLettres = (n: number, majuscule = false) => { const t = LETTRES[n] ?? String(n); return majuscule ? t.charAt(0).toUpperCase() + t.slice(1) : t; };

export const ORG = {
  name: "ADEB LONODJI",
  fullName: "Association de Développement et d’Entraide de Bédjondo",
  tagline: "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond.",
  motto: "Courage • Discipline • Héritage",
  place: "Bédjondo · Mandoul Occidental · Mandoul, Tchad",
  phone: "+235 66 29 94 03",
  phoneHref: "tel:+23566299403",
  whatsapp: "https://wa.me/23566299403",
  url: "https://lonodji.org",
  bureau: [
    { role: "Président", name: "Adoumbé Maoura", note: "Contact officiel de l’association : appel et WhatsApp" },
    { role: "Vice-présidente", name: "Célestine Moyombaye", note: "" },
    { role: "Secrétaire général", name: "Salomon Ngarbaye", note: "" },
    { role: "Trésorière", name: "Élisabeth Neloumngaye Ndodinguem", note: "Collecte suspendue jusqu’à l’ouverture d’un compte au nom de l’association" },
    { role: "Animateur", name: "Bignéro Moïalbéi Le Madang", note: "Animation générale de l’association, communication et numérique" },
  ],
};

/** Coupe une description à 160 caractères sur une limite de mot (balises meta). */
export function metaDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}

/* Image de partage d'une route (Open Graph / Twitter) : public/og/<route>.jpg
   quand scripts/build-og.py l'a produite, sinon l'image générale du site. */
export function ogImage(route: string) {
  const name = route === "/" ? "index" : route.replace(/^\//, "").replace(/\//g, "--");
  const file = path.join(process.cwd(), "public", "og", `${name}.jpg`);
  const url = fs.existsSync(file) ? `/og/${name}.jpg` : "/og-image.png";
  return [{ url, width: 1200, height: 630, alt: "ADEB LONODJI" }];
}

/* Bloc Open Graph d'une route : titre et description viennent des métadonnées
   de la page (Next les reprend), le reste est commun au site. */
export function ogFor(route: string, lang: "fr" | "en" = "fr") {
  return { siteName: ORG.name, locale: lang === "en" ? "en_GB" : "fr_FR", type: "website" as const, url: route, images: ogImage(route) };
}
