import data from "../content/nomenclature.json";

/* Nomenclature des thématiques (5 octobre 2026) : intitulé standard, ancien intitulé, codes CAD de l'OCDE
   (CRS), cluster humanitaire et cibles ODD. Une seule source : content/nomenclature.json, lue aussi par
   scripts/import-legacy.py et scripts/build-fiches-mission.py. Import statique (pas de node:fs) : ce module
   est chargé par components/blocks.tsx, qui sert aussi côté client. */
export type Nomenclature = { num: string; ancien: string; fr: string; ancienEn: string; en: string; cad: string[]; cluster: string | null; odd: string[] };
export const NOMENCLATURE = data as { date: string; motif: string; thematiques: Nomenclature[] };
export const nomenclatureDe = (num: string) => NOMENCLATURE.thematiques.find((t) => t.num === num);
