import fs from "node:fs";
import path from "node:path";
import { getIndex, ORG } from "@/lib/content";

/* Élection des vice-présidences de pôle sans titulaire : procédure et calendrier adoptés par le bureau exécutif le
   1er octobre 2026 (registre 2026-33). Seule source : content/election.json (lu aussi par scripts/build-postes.py et
   scripts/build-dossier-bureau.py). */
export type Etape = { cle: string; date: string; quoi: string; quoi_en?: string };
export type Regle = { point: string; texte: string; note: string; point_en?: string; texte_en?: string; note_en?: string };
export type Candidat = { nom: string; pole: string; presentation: string };
export type Election = {
  adoptee: string; instance: string; poles: string[]; calendrier: Etape[]; regles: Regle[]; organisation: string[]; organisation_en?: string[];
  candidats: Candidat[]; resultats: null | { pole: string; elu: string; votants: number; exprimes: number }[];
};

let cache: Election | null = null;
export function getElection(): Election {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "election.json"), "utf8"));
  return cache!;
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export const dateFr = (iso: string, annee = true) => {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j === 1 ? "1er" : j} ${MOIS[m - 1]}${annee ? ` ${a}` : ""}`;
};
export const etape = (cle: string) => getElection().calendrier.find((e) => e.cle === cle)!;

/* Le collège des responsables : bureau exécutif, vice-présidences en fonction, coordonnateurs titulaires des
   thématiques et des cellules — personnes distinctes, d'après la page Nos actions. */
export function college(): number {
  const idx = getIndex();
  const noms = new Set(ORG.bureau.map((b) => b.name));
  for (const p of [...idx.structure.poles, idx.structure.cellules]) {
    for (const t of p.items) if (t.filled && t.coordinator) noms.add(t.coordinator.replace(/,.*$/, "").trim());
  }
  for (const p of idx.structure.poles) if (p.direction?.filled) noms.add(p.direction.name);
  return noms.size;
}

/* « du 2 au 15 octobre 2026 » (ou « du 28 octobre au 4 novembre 2026 » si les mois diffèrent). */
export function periodeCandidatures(): string {
  const ap = etape("appel").date, cl = etape("cloture").date;
  return `du ${ap.slice(0, 7) === cl.slice(0, 7) ? dateFr(ap).split(" ")[0] : dateFr(ap, false)} au ${dateFr(cl)}`;
}

/* L'élection en une ligne, pour les cartes et les annonces (sans dépendre du jour de construction du site). */
export function etatElection(): string {
  const e = getElection();
  if (e.resultats) return "Élection faite : résultats publiés";
  return `Candidatures ${periodeCandidatures()} · vote le ${dateFr(etape("vote").date)}`;
}
