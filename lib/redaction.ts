/* Espace de rédaction privé du journal — côté serveur.

   Authentification auto-hébergée : un seul mot de passe, choisi à la première
   visite, dérivé par scrypt avec un sel ; jeton de session signé (HMAC-SHA256)
   avec le hash du mot de passe courant, si bien que changer le mot de passe
   invalide tous les jetons sans registre de sessions. Le mot de passe ne
   circule qu'en POST ; le jeton ne circule qu'en en-tête HTTP.

   Stockage : magasin Netlify Blobs « adeb-redaction » en production ; en
   développement (aucun contexte Blobs), un fichier JSON sous .netlify/. */

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const MOT_DE_PASSE_MIN = 10;
export const DUREE_JETON_MS = 12 * 60 * 60 * 1000; // 12 h
export const ESSAIS_MAX = 5;
export const BLOCAGE_MS = 15 * 60 * 1000; // 15 min après cinq échecs
const SCRYPT = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export type Statut = "brouillon" | "a-relire" | "pret";
export type Brouillon = {
  id: string;
  titre: string;
  chapo: string;
  rubrique: string;
  statut: Statut;
  corps: string;
  auteur: string;
  cree: string;
  maj: string;
};
export type Resume = Pick<Brouillon, "id" | "titre" | "rubrique" | "statut" | "maj">;

type Auth = { sel: string; hash: string; maj: string };
type Tentatives = { n: number; jusqua: number };

/* ---------- magasin ---------- */

export interface Magasin {
  get(cle: string): Promise<string | null>;
  set(cle: string, valeur: string): Promise<void>;
  delete(cle: string): Promise<void>;
}

class MagasinFichier implements Magasin {
  private fichier: string;
  constructor(fichier: string) { this.fichier = fichier; }
  private lire(): Record<string, string> {
    try { return JSON.parse(fs.readFileSync(this.fichier, "utf8")); } catch { return {}; }
  }
  private ecrire(d: Record<string, string>) {
    fs.mkdirSync(path.dirname(this.fichier), { recursive: true });
    fs.writeFileSync(this.fichier, JSON.stringify(d));
  }
  async get(cle: string) { return this.lire()[cle] ?? null; }
  async set(cle: string, valeur: string) { const d = this.lire(); d[cle] = valeur; this.ecrire(d); }
  async delete(cle: string) { const d = this.lire(); delete d[cle]; this.ecrire(d); }
}

let magasinCache: Magasin | null = null;

export async function magasin(): Promise<Magasin> {
  if (magasinCache) return magasinCache;
  if (process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT) {
    const { getStore } = await import("@netlify/blobs");
    let store: ReturnType<typeof getStore>;
    try {
      store = getStore({ name: "adeb-redaction", consistency: "strong" });
    } catch (e) {
      throw new Erreur(500, "Stockage indisponible : " + (e instanceof Error ? e.message : String(e)));
    }
    magasinCache = {
      async get(cle) { return (await store.get(cle, { type: "text" })) ?? null; },
      async set(cle, valeur) { await store.set(cle, valeur); },
      async delete(cle) { await store.delete(cle); },
    };
  } else {
    magasinCache = new MagasinFichier(path.join(process.cwd(), ".netlify", "redaction-dev.json"));
  }
  return magasinCache;
}

/* ---------- mot de passe et jeton ---------- */

function deriver(motDePasse: string, sel: string): string {
  return scryptSync(motDePasse.normalize("NFC"), Buffer.from(sel, "hex"), 32, SCRYPT).toString("hex");
}

function egal(a: string, b: string): boolean {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function motDePasseValide(m: unknown): m is string {
  return typeof m === "string" && m.length >= MOT_DE_PASSE_MIN && m.length <= 200;
}

export async function compteExiste(): Promise<boolean> {
  return (await (await magasin()).get("auth")) !== null;
}

export async function creerCompte(motDePasse: string): Promise<string> {
  const m = await magasin();
  if ((await m.get("auth")) !== null) throw new Erreur(409, "Un mot de passe existe déjà.");
  const sel = randomBytes(16).toString("hex");
  const auth: Auth = { sel, hash: deriver(motDePasse, sel), maj: new Date().toISOString() };
  await m.set("auth", JSON.stringify(auth));
  return signer(auth.hash);
}

export async function verifierMotDePasse(motDePasse: string, ip = "?"): Promise<Auth> {
  const m = await magasin();
  const brut = await m.get("auth");
  if (!brut) throw new Erreur(404, "Aucun mot de passe n’a encore été créé.");
  /* Compteur d'échecs par adresse (hachée) : un inconnu ne peut plus bloquer l'animation en se trompant exprès. */
  const cle = `tentatives/${ip}`;
  const tentatives: Tentatives = JSON.parse((await m.get(cle)) || '{"n":0,"jusqua":0}');
  if (tentatives.jusqua > Date.now()) {
    throw new Erreur(429, `Trop d’essais : réessayez dans ${Math.ceil((tentatives.jusqua - Date.now()) / 60000)} min.`);
  }
  const auth: Auth = JSON.parse(brut);
  if (!egal(deriver(motDePasse, auth.sel), auth.hash)) {
    const n = (tentatives.jusqua ? 0 : tentatives.n) + 1;
    await m.set(cle, JSON.stringify({ n, jusqua: n >= ESSAIS_MAX ? Date.now() + BLOCAGE_MS : 0 }));
    throw new Erreur(401, "Mot de passe incorrect.");
  }
  if (tentatives.n) await m.delete(cle);
  return auth;
}

export async function connexion(motDePasse: string, ip = "?"): Promise<string> {
  return signer((await verifierMotDePasse(motDePasse, ip)).hash);
}

export async function changerMotDePasse(ancien: string, nouveau: string, ip = "?"): Promise<string> {
  await verifierMotDePasse(ancien, ip);
  const sel = randomBytes(16).toString("hex");
  const auth: Auth = { sel, hash: deriver(nouveau, sel), maj: new Date().toISOString() };
  await (await magasin()).set("auth", JSON.stringify(auth));
  return signer(auth.hash);
}

function signer(hash: string, exp = Date.now() + DUREE_JETON_MS): string {
  const charge = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", hash).update(charge).digest("base64url");
  return `${charge}.${sig}`;
}

export async function verifierJeton(jeton: unknown): Promise<void> {
  if (typeof jeton !== "string" || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(jeton)) throw new Erreur(401, "Session absente.");
  const brut = await (await magasin()).get("auth");
  if (!brut) throw new Erreur(401, "Session invalide.");
  const auth: Auth = JSON.parse(brut);
  const [charge, sig] = jeton.split(".");
  const attendu = createHmac("sha256", auth.hash).update(charge).digest("base64url");
  if (!egal(sig, attendu)) throw new Erreur(401, "Session invalide : reconnectez-vous.");
  let exp = 0;
  try { exp = JSON.parse(Buffer.from(charge, "base64url").toString("utf8")).exp; } catch { /* charge illisible */ }
  if (typeof exp !== "number" || exp < Date.now()) throw new Erreur(401, "Session expirée : reconnectez-vous.");
}

/* ---------- brouillons ---------- */

const STATUTS: Statut[] = ["brouillon", "a-relire", "pret"];

function texte(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

export function normaliser(b: unknown, id: string, cree: string): Brouillon {
  const o = (b && typeof b === "object" ? b : {}) as Record<string, unknown>;
  const statut = STATUTS.includes(o.statut as Statut) ? (o.statut as Statut) : "brouillon";
  return {
    id,
    titre: texte(o.titre, 200).trim(),
    chapo: texte(o.chapo, 600).trim(),
    rubrique: texte(o.rubrique, 40).replace(/[^a-z0-9-]/g, "") || "vie-association",
    statut,
    corps: texte(o.corps, 60000),
    auteur: texte(o.auteur, 120).trim() || "Rédaction ADEB LONODJI",
    cree,
    maj: new Date().toISOString(),
  };
}

export async function listerBrouillons(): Promise<Resume[]> {
  const brut = await (await magasin()).get("index");
  const liste: Resume[] = brut ? JSON.parse(brut) : [];
  return liste.sort((a, b) => (a.maj < b.maj ? 1 : -1));
}

async function ecrireIndex(liste: Resume[]) {
  await (await magasin()).set("index", JSON.stringify(liste));
}

export async function lireBrouillon(id: string): Promise<Brouillon> {
  if (!/^[a-z0-9-]{8,40}$/.test(id)) throw new Erreur(400, "Identifiant invalide.");
  const brut = await (await magasin()).get(`brouillons/${id}`);
  if (!brut) throw new Erreur(404, "Brouillon introuvable.");
  return JSON.parse(brut);
}

export async function enregistrerBrouillon(entree: unknown): Promise<Brouillon> {
  const o = (entree && typeof entree === "object" ? entree : {}) as Record<string, unknown>;
  const m = await magasin();
  let id = typeof o.id === "string" && /^[a-z0-9-]{8,40}$/.test(o.id) ? o.id : "";
  let cree = new Date().toISOString();
  if (id) {
    const existant = await m.get(`brouillons/${id}`);
    if (existant) cree = JSON.parse(existant).cree || cree;
  } else {
    id = `${cree.slice(0, 10)}-${randomBytes(4).toString("hex")}`;
  }
  const b = normaliser(o, id, cree);
  await m.set(`brouillons/${id}`, JSON.stringify(b));
  const liste = (await listerBrouillons()).filter((x) => x.id !== id);
  liste.push({ id, titre: b.titre, rubrique: b.rubrique, statut: b.statut, maj: b.maj });
  await ecrireIndex(liste);
  return b;
}

export async function supprimerBrouillon(id: string): Promise<void> {
  if (!/^[a-z0-9-]{8,40}$/.test(id)) throw new Erreur(400, "Identifiant invalide.");
  const m = await magasin();
  await m.delete(`brouillons/${id}`);
  await ecrireIndex((await listerBrouillons()).filter((x) => x.id !== id));
}

export class Erreur extends Error {
  statut: number;
  constructor(statut: number, message: string) { super(message); this.statut = statut; }
}
