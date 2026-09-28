import { NextResponse } from "next/server";
import { getIndicateurs, releverFormulaires, type Releve } from "../../../lib/indicateurs";

/* Compteurs du tableau de bord d'impact.
   GET → { genere, contenu, formulaires, bureau }
   « contenu » et « bureau » sont ceux de la mise en ligne (content/indicateurs.json).
   « formulaires » est relevé en direct sur Netlify Forms quand la variable
   d'environnement NETLIFY_FORMS_TOKEN (jeton d'accès personnel Netlify, lecture
   seule suffit) est définie sur le site ; sinon c'est le dernier relevé daté.
   Seuls des nombres sortent d'ici. La réponse est mise en cache dix minutes
   pour ne pas solliciter l'API Netlify à chaque visite. */

export const dynamic = "force-dynamic";

const ENTETES = {
  "Cache-Control": "public, max-age=300",
  "Netlify-CDN-Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
  "X-Robots-Tag": "noindex",
};

export async function GET() {
  const base = getIndicateurs();
  let formulaires: Releve = { ...base.formulaires, live: false };
  const jeton = process.env.NETLIFY_FORMS_TOKEN;
  if (jeton) {
    try {
      const releve = await releverFormulaires(jeton);
      if (releve) formulaires = releve;
    } catch (e) {
      console.error("indicateurs : relevé en direct impossible", e);
    }
  }
  return NextResponse.json({ ...base, formulaires }, { headers: ENTETES });
}
