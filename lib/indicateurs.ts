import fs from "node:fs";
import path from "node:path";

/* Les chiffres du tableau de bord d'impact. La partie « contenu » est comptée
   dans content/ par scripts/build-indicateurs.py au moment de la mise en ligne ;
   la partie « formulaires » est un relevé daté des formulaires Netlify, remis
   à jour en direct par /api/indicateurs quand un jeton d'accès est configuré.
   Ne transitent ici que des nombres : jamais un nom, un courriel, un message. */

export type Compte = { envois: number; personnes?: number; domaines?: Record<string, number>; pays?: number };
export type Comptes = Record<string, Compte>;

export type Releve = { date: string; methode: string; comptes: Comptes; live?: boolean };

export type Projet = { slug: string; nom: string; stade: string; libelle: string; route: string };

export type Indicateurs = {
  genere: string;
  contenu: {
    plaidoyers: { publies: number; envoyes: number; reponses: number };
    coordinations: { pourvues: number; total: number; cellulesPourvues: number; cellulesTotal: number; directionsPourvues: number; directionsTotal: number };
    articles: number;
    premierArticle: string | null;
    documentsPdf: number;
    documentsAnnonces: number;
    corrections: number;
    engagements: { total: number; realises: number };
    problematiques: { total: number; documentees: number; partielles: number; inconnues: number; chantiersPrioritaires: number };
    carte: { unites: number; localites: number; localitesNommees: number; equipements: number; genere: string };
    pages: number;
    projets: { actifs: number; annonces: number; finances: number; liste: Projet[] };
  };
  formulaires: Releve;
  bureau: { adherents: number | null; besoinsResolus: number; note: string };
};

export function getIndicateurs(): Indicateurs {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "indicateurs.json"), "utf8"));
}

const SITE_ID = process.env.SITE_ID || "17ccf3c4-041d-471c-93c5-87730d0b8106";
const FUSIONS: Record<string, string> = { "lettre-info-pied": "lettre-info" };
/* Jamais comptés, comme les mentions légales le promettent : contact, message en
   anglais, personnes handicapées, veuves, plaintes. */
const JAMAIS_COMPTES = new Set(["contact", "message-en", "handicap", "veuves", "plainte"]);
/* Comptés par personne : un même courriel envoyé plusieurs fois compte une fois. */
const PAR_PERSONNE = new Set(["intention-adhesion", "diaspora-competences"]);

type FormNetlify = { id: string; name: string; submission_count?: number };
type SoumissionNetlify = { id: string; data?: Record<string, unknown> };

/* Relit les compteurs sur l'API Netlify Forms. Les envois sont lus en mémoire
   uniquement pour compter les personnes distinctes ; rien d'eux n'est renvoyé. */
export async function releverFormulaires(jeton: string): Promise<Releve | null> {
  const entetes = { Authorization: `Bearer ${jeton}`, "User-Agent": "lonodji-indicateurs" };
  const r = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`, { headers: entetes, cache: "no-store" });
  if (!r.ok) return null;
  const forms = (await r.json()) as FormNetlify[];
  const comptes: Comptes = {};
  for (const f of forms) {
    const nom = FUSIONS[f.name] ?? f.name;
    if (JAMAIS_COMPTES.has(nom)) continue;
    const c = (comptes[nom] ??= { envois: 0 });
    c.envois += Number(f.submission_count || 0);
    if (PAR_PERSONNE.has(nom) && c.envois > 0) {
      // toutes les pages d'envois (100 par page) : au-delà de cent, le décompte par personne resterait juste
      const envois: SoumissionNetlify[] = [];
      let lu = true;
      for (let page = 1; page <= 50; page++) {
        const s = await fetch(`https://api.netlify.com/api/v1/forms/${f.id}/submissions?per_page=100&page=${page}`, { headers: entetes, cache: "no-store" });
        if (!s.ok) { lu = page > 1; break; }
        const lot = (await s.json()) as SoumissionNetlify[];
        envois.push(...lot);
        if (lot.length < 100) break;
      }
      if (lu) {
        const cles = new Set<string>();
        const pays = new Set<string>();
        const domaines: Record<string, number> = {};
        for (const e of envois) {
          const d = e.data ?? {};
          const courriel = String(d.email ?? "").trim().toLowerCase();
          const tel = String(d.telephone ?? "").replace(/\D/g, "");
          const cle = courriel || tel || e.id;
          if (cles.has(cle)) continue;
          cles.add(cle);
          if (nom === "diaspora-competences") {
            const p = String(d.pays ?? "").trim().toLowerCase();
            if (p) pays.add(p);
            for (const [k, v] of Object.entries(d)) if (k.startsWith("domaine-") && v) domaines[k.slice(8)] = (domaines[k.slice(8)] ?? 0) + 1;
          }
        }
        c.personnes = cles.size;
        if (nom === "diaspora-competences") { c.pays = pays.size; c.domaines = domaines; }
      }
    }
  }
  return {
    date: new Date().toISOString().slice(0, 10),
    methode: "API Netlify Forms, relevé automatique. Les intentions d’adhésion et les inscriptions au répertoire des compétences sont comptées par personne (un même courriel envoyé plusieurs fois compte une fois).",
    comptes,
    live: true,
  };
}
