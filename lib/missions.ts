import fs from "node:fs";
import path from "node:path";

/* Fiches de mission produites par scripts/build-fiches-mission.py (PDF dans
   public/missions/, index content/missions.json). */
export type FicheDirection = { pole: string; roman: string; nom: string; pourvue: boolean; qui: string; pdf: string; thematiques: number };
export type FicheCoordination = { id: string; numero: string; nom: string; pole: string; poleNom: string; pourvue: boolean; qui: string; pdf: string };
export type FicheCellule = { id: string; nom: string; pourvue: boolean; qui: string; pdf: string };
export type Missions = { genere: string; recueil: string; directions: FicheDirection[]; coordinations: FicheCoordination[]; cellules: FicheCellule[] };

let cache: Missions | null = null;
export function getMissions(): Missions {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "missions.json"), "utf8")) as Missions;
  return cache;
}
export const ficheCoordination = (id: string) => getMissions().coordinations.find((c) => c.id === id) ?? getMissions().cellules.find((c) => c.id === id);
export const ficheDirection = (pole: string) => getMissions().directions.find((d) => d.pole === pole);
