import { getPage } from "@/lib/content";

/* English names of the pillars and themes, read from the English themes page (content/pages/en--themes.json, built by
   the import from en/themes.html) — one source for the wording. */
let cache: { piliers: Record<string, string>; themes: Record<string, string> } | null = null;
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&rsquo;/g, "’").replace(/&eacute;/g, "é").replace(/<[^>]+>/g, "").trim();
export function nomsEn() {
  if (cache) return cache;
  const html = getPage("en--themes").sections.map((s) => s.html).join("");
  const piliers: Record<string, string> = {};
  for (const m of html.matchAll(/eyebrow">Pillar ([IVX]+)<\/div>\s*<h2>(.*?)<\/h2>/g)) piliers[m[1]] = decode(m[2]);
  const themes: Record<string, string> = {};
  for (const m of html.matchAll(/THEME (\d{2})<\/span><\/div>[\s\S]*?<h3>(.*?)<\/h3>/g)) themes[m[1]] = decode(m[2]);
  cache = { piliers, themes };
  return cache;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const dateEn = (iso: string, year = true) => {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j} ${MONTHS[m - 1]}${year ? ` ${a}` : ""}`;
};
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four"];
export const inWordsEn = (n: number, cap = false) => { const w = WORDS[n] ?? String(n); return cap ? w.charAt(0).toUpperCase() + w.slice(1) : w; };
