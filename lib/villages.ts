import fs from "node:fs";
import path from "node:path";

/* Fiches des villages : content/villages.json, produit par scripts/build-villages.py
   à partir des données de la carte. Lu une fois par processus de construction. */

export type EquipementProche = { famille: string; nom: string; unite: string; km: number; detail: Record<string, string> };
export type Voisin = { nom: string; unite: string; slug: string; km: number };
export type Mention = { titre: string; route: string; type: string };
export type FicheVillage = {
  slug: string; nom: string; type: string; unite: string; lon: number; lat: number; kmBedjondo: number;
  equipements: EquipementProche[]; voisins: Voisin[]; mentions: Mention[];
};
export type UniteVillages = {
  id: string; nom: string; groupe: "coeur" | "sud" | "signale" | "diaspora"; dep: string; prov: string; notice: string; approx: boolean; origine: string;
  centre: [number, number]; comptes: { villages: number; nommes: number; equipements: number }; liens: { type: string; titre: string; route: string }[]; kmBedjondo: number;
};
export type DonneesVillages = { genere: string; sources: Record<string, string>; bedjondo: [number, number]; unites: Record<string, UniteVillages>; villages: FicheVillage[] };

let cache: DonneesVillages | null = null;

export function getVillages(): DonneesVillages {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "villages.json"), "utf8")) as DonneesVillages;
  return cache;
}

export function villagesDe(unite: string): FicheVillage[] {
  return getVillages().villages.filter((v) => v.unite === unite).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

export function ficheVillage(unite: string, slug: string): FicheVillage | undefined {
  return getVillages().villages.find((v) => v.unite === unite && v.slug === slug);
}

export const FAMILLES: Record<string, string> = {
  ecole: "École", sante: "Santé", eau: "Eau", marche: "Marché", culte: "Lieu de culte", energie: "Énergie", telecom: "Télécom", administration: "Administration", finance: "Services financiers",
};
export const TYPES: Record<string, string> = { city: "Ville", town: "Bourg", village: "Village", hamlet: "Hameau" };
export const GROUPES: Record<UniteVillages["groupe"], string> = {
  coeur: "Mandoul Occidental, cœur du pays bedjond",
  sud: "Logone Oriental, présence bedjond attestée",
  signale: "Logone Oriental, présence bedjond signalée",
  diaspora: "Diaspora agricole, présence signalée",
};
/* Ordre d'affichage des unités : le cœur d'abord, puis par distance à Bédjondo. */
export const ORDRE_GROUPES: UniteVillages["groupe"][] = ["coeur", "sud", "signale", "diaspora"];

export const nf = new Intl.NumberFormat("fr-FR");
export const km = (v: number) => (v < 1 ? `${nf.format(Math.round(v * 1000))} m` : `${nf.format(Math.round(v * 10) / 10)} km`);
export const routeVillage = (v: { unite: string; slug: string }) => `/villages/${v.unite}/${v.slug}`;
