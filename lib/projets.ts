import fs from "node:fs";
import path from "node:path";

/* Plateforme de projets : content/projets.json (à tenir à jour à la main),
   partagé avec scripts/build-indicateurs.py pour le tableau de bord. */
export type Stade = { id: string; nom: string; texte: string };
export type Projet = {
  slug: string; nom: string; stade: string; libelle: string; route: string; thematiques: string[];
  resume: string; existant: string[]; manque: string[]; budget: string; calendrier: string; contribuer: { label: string; href: string }[];
};
export type Projets = { genere: string; stades: Stade[]; projets: Projet[] };

let cache: Projets | null = null;
export function getProjets(): Projets {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "projets.json"), "utf8")) as Projets;
  return cache;
}

/* Stades « actifs » : une version existe, un chantier avance ou l'ouvrage sert. */
export const STADES_ACTIFS = new Set(["essai", "realisation", "service"]);
export const stadeIndex = (p: Projets, id: string) => p.stades.findIndex((s) => s.id === id);
