/* Suivi de transmission des plaidoyers (content/transmissions.json) : une lettre d'envoi par destinataire,
   signée par le président et le secrétaire général (lettres faites par scripts/build-lettres-envoi.py, hors
   dépôt). Un envoi, un accusé ou une réponse n'entre dans le fichier que le jour où il a eu lieu. */
import fs from "node:fs";
import path from "node:path";

export type StatutEnvoi = "a-signer" | "envoye" | "accuse" | "reponse";
export type Destinataire = { nom: string; attention?: string; type: "ministre" | "maire" | "autre"; statut: StatutEnvoi; envoye?: string; accuse?: string; reponse?: string; resume?: string };
export type Transmission = { copie: string; destinataires: Destinataire[]; a_identifier?: string[] };

export const getTransmissions = (): Record<string, Transmission> => {
  const brut = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "transmissions.json"), "utf8")) as Record<string, unknown>;
  return Object.fromEntries(Object.entries(brut).filter(([k]) => !k.startsWith("_"))) as Record<string, Transmission>;
};

export const STATUTS: Record<StatutEnvoi, string> = { "a-signer": "lettre prête, à signer", envoye: "envoyée", accuse: "reçue (accusé)", reponse: "réponse reçue" };
