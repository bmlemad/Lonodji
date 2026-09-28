import fs from "node:fs";
import path from "node:path";

/* Observatoire du Mandoul Occidental : content/observatoire.json, produit par
   scripts/build-observatoire.py à partir de la carte, des fiches de villages,
   du diagnostic territorial, des plaidoyers et des indicateurs. */
export type UniteObs = {
  id: string; nom: string; groupe: string; dep: string; prov: string; kmBedjondo: number;
  localites: number; nommees: number; equipements: { total: number; familles: Record<string, number> };
  couvertes: number; citees: number; pages: number; plaidoyers: number; route: string;
};
export type Domaine = {
  nom: string; ancre: string; total: number; documente: number; partiel: number; ailleurs: number; inconnu: number;
  decideurs: Record<string, number>; thematiques: Record<string, number>;
  problemes: { id: string; texte: string; statut: string; decideur: string; thematique: string | null }[];
};
export type Observatoire = {
  genere: string; sources: { carte: string; villages: string; releve: string };
  familles: Record<string, { libelle: string; total: number }>;
  totaux: { unites: number; localites: number; nommees: number; equipements: number; couvertes: number; citees: number };
  unites: UniteObs[];
  diagnostic: { total: number; statuts: Record<string, number>; decideurs: Record<string, number>; domaines: Domaine[] };
  plaidoyers: { id: string; title: string; theme: string; status: string; recipients: string; published: string; sent: string; answer: string; href: string }[];
  besoins: { signales: number; resolus: number | null; note: string };
  engagements: { total: number; realises: number };
};

let cache: Observatoire | null = null;
export function getObservatoire(): Observatoire {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "observatoire.json"), "utf8")) as Observatoire;
  return cache;
}
