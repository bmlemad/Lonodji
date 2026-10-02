/* Repères internationaux de chaque thématique (revue du 2 octobre 2026) : cluster humanitaire, World Vision,
   plan national « Tchad Connexion 2030 ». Données : content/reperes.json (aussi lu par scripts/import-legacy.py). */
import data from "../content/reperes.json";

type Entree = { cluster: string | null; worldVision: string | null; tchadConnexion2030: string | null };
const FR = data.fr as Record<string, Entree>;
const SANS = data.sans as Record<string, { fr: string; en: string }>;

export function reperesFr(numero: string): { parts: { nom: string; valeur: string }[]; phrase?: string } {
  const e = FR[numero];
  if (!e) return { parts: [], phrase: SANS[numero]?.fr ?? data.defaut.fr };
  const parts = ([["Cluster humanitaire", e.cluster], ["World Vision", e.worldVision], ["Tchad Connexion 2030", e.tchadConnexion2030]] as const)
    .filter(([, v]) => v)
    .map(([nom, valeur]) => ({ nom, valeur: valeur as string }));
  return { parts };
}
