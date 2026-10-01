import fs from "node:fs";
import path from "node:path";

/* « Lonodji », le magazine trimestriel (janvier, avril, juillet, octobre) : numéros décrits dans
   content/magazine/numeros.json, PDF et couverture faits par scripts/build-magazine.py, qui écrit
   content/magazine/index.json (lu ici). Après son jour de parution, un numéro n'est plus réécrit ; une édition du jour même est datée (champ edition). */
export type Numero = {
  numero: number; periode: string; parution: string; parutionLabel: string; prochain: string; titre: string; chapo: string;
  edition?: string; pdf: string; couverture: string; pages: number; taille: string; sommaire: { rubrique: string; titre: string; page: number | null }[];
};

let cache: { numeros: Numero[]; rythme: string[] } | null = null;
export function getMagazine(): { numeros: Numero[]; rythme: string[] } {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "magazine", "index.json"), "utf8"));
  return cache!;
}
