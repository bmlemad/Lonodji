import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import {
  changerMotDePasse, compteExiste, connexion, creerCompte, enregistrerBrouillon, Erreur, lireBrouillon,
  listerBrouillons, MOT_DE_PASSE_MIN, motDePasseValide, supprimerBrouillon, verifierJeton,
} from "@/lib/redaction";

/* API de l'espace de rédaction privé (voir lib/redaction.ts).
   GET  → { existe }                      : un mot de passe a-t-il été créé ?
   POST { action, … }                     : creer · connexion · changer (mot de passe en corps de requête)
                                            liste · lire · enregistrer · supprimer (jeton en en-tête Authorization) */

export const dynamic = "force-dynamic";

const ENTETES = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

function ok(data: unknown, statut = 200) {
  return NextResponse.json(data, { status: statut, headers: ENTETES });
}

function erreur(e: unknown) {
  if (e instanceof Erreur) return ok({ erreur: e.message }, e.statut);
  console.error("redaction:", e);
  return ok({ erreur: "Erreur interne : réessayez, ou signalez-le." }, 500);
}

export async function GET() {
  try {
    return ok({ existe: await compteExiste(), minimum: MOT_DE_PASSE_MIN });
  } catch (e) { return erreur(e); }
}

export async function POST(req: Request) {
  let corps: Record<string, unknown>;
  try { corps = await req.json(); } catch { return ok({ erreur: "Requête illisible." }, 400); }
  const action = typeof corps.action === "string" ? corps.action : "";
  try {
    switch (action) {
      case "creer": {
        /* Création fermée tant qu'on ne présente pas le code d'invitation (variable d'environnement Netlify
           REDACTION_INVITATION) : sans lui, le premier visiteur venu pourrait créer le mot de passe. */
        const cle = process.env.REDACTION_INVITATION || "";
        const code = typeof corps.invitation === "string" ? corps.invitation.trim() : "";
        if (!cle || !code || !invitationValide(code, cle)) throw new Erreur(403, "Code d'invitation manquant ou incorrect.");
        if (!motDePasseValide(corps.motDePasse)) throw new Erreur(400, `Le mot de passe doit faire au moins ${MOT_DE_PASSE_MIN} caractères.`);
        return ok({ jeton: await creerCompte(corps.motDePasse) }, 201);
      }
      case "connexion": {
        if (typeof corps.motDePasse !== "string") throw new Erreur(400, "Mot de passe manquant.");
        return ok({ jeton: await connexion(corps.motDePasse, ip(req)) });
      }
      case "changer": {
        await verifierJeton(jeton(req));
        if (typeof corps.ancien !== "string" || !motDePasseValide(corps.nouveau)) throw new Erreur(400, `Le nouveau mot de passe doit faire au moins ${MOT_DE_PASSE_MIN} caractères.`);
        return ok({ jeton: await changerMotDePasse(corps.ancien, corps.nouveau, ip(req)) });
      }
      case "liste": {
        await verifierJeton(jeton(req));
        return ok({ brouillons: await listerBrouillons() });
      }
      case "lire": {
        await verifierJeton(jeton(req));
        return ok({ brouillon: await lireBrouillon(String(corps.id ?? "")) });
      }
      case "enregistrer": {
        await verifierJeton(jeton(req));
        return ok({ brouillon: await enregistrerBrouillon(corps.brouillon) });
      }
      case "supprimer": {
        await verifierJeton(jeton(req));
        await supprimerBrouillon(String(corps.id ?? ""));
        return ok({ fait: true });
      }
      default:
        throw new Erreur(400, "Action inconnue.");
    }
  } catch (e) { return erreur(e); }
}

function invitationValide(code: string, cle: string): boolean {
  const a = createHash("sha256").update(code).digest(), b = createHash("sha256").update(cle).digest();
  return timingSafeEqual(a, b);
}

function ip(req: Request): string {
  const brut = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "?";
  return createHash("sha256").update(brut.trim()).digest("hex").slice(0, 16);
}

function jeton(req: Request): string {
  const h = req.headers.get("authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
}
