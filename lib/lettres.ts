import fs from "node:fs";
import path from "node:path";

/* Les numéros de la lettre d'information : articles du journal (rubrique
   « lettre ») et leur PDF, index content/lettres.json produit par
   scripts/build-lettre.py. */
export type Lettre = { slug: string; route: string; titre: string; date: string; dateLabel: string; numero: number; resume: string; pdf: string; lecture: string };

let cache: { genere: string; lettres: Lettre[] } | null = null;
export function getLettres(): { genere: string; lettres: Lettre[] } {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "lettres.json"), "utf8"));
  return cache!;
}
