import data from "../content/auto-evaluation.json";

export type Etat = "present" | "partiel" | "absent";
export type Critere = { critere: string; etat: string; preuve: string; href: string };
export type Bloc = { id: string; titre: string; criteres: Critere[] };
export type Suite = { id: string; quoi: string; qui: string; quand: string };
export type AutoEvaluation = { date: string; titre: string; methode: string; echelle: Record<Etat, string>; blocs: Bloc[]; suites: Suite[] };

export const AUTO_EVALUATION = data as AutoEvaluation;
export const ETATS: Record<Etat, string> = { present: "Présent", partiel: "Partiel", absent: "Absent" };

export function comptes(): Record<Etat, number> {
  const c: Record<Etat, number> = { present: 0, partiel: 0, absent: 0 };
  for (const b of AUTO_EVALUATION.blocs) for (const k of b.criteres) c[k.etat as Etat] += 1;
  return c;
}

export const dateLongue = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
