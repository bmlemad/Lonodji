/* Postes ouverts (campagne du 1er octobre 2026) : calculés à partir de la structure et des sept thématiques
   prioritaires — un adjoint pour chaque priorité, un titulaire pour chaque priorité sans coordonnateur, une
   vice-présidence pour chaque pilier qui n'en a pas. Visuels et messages WhatsApp : scripts/build-postes.py (même calcul). Un poste pourvu disparaît de la liste au prochain import. */
import { getIndex, ORG } from "@/lib/content";
import { PRIORITAIRES } from "@/lib/organisation";
import { dateFr, etape } from "@/lib/election";

export type Poste = { cle: string; genre: "titulaire" | "adjoint" | "vice-presidence"; titre: string; numero?: string; pole: string; href: string; fiche: string; visuel: string; message: string };

const SITE = "https://lonodji.org";

export function getPostes(): Poste[] {
  const idx = getIndex();
  const postes: Poste[] = [];
  const themes = idx.structure.poles.flatMap((p) => p.items.map((t) => ({ t, p })));
  for (const genre of ["titulaire", "adjoint"] as const) {
    for (const pr of PRIORITAIRES) {
      const trouve = themes.find(({ t }) => t.id === pr.id);
      if (!trouve) continue;
      const { t, p } = trouve;
      if (genre === "titulaire" && t.filled) continue;
      const href = `/participer?theme=${t.number}&${genre === "titulaire" ? "coordo" : "adjoint"}=1#contact`;
      const role = genre === "titulaire" ? "un coordonnateur ou une coordonnatrice" : "un adjoint ou une adjointe";
      postes.push({
        cle: `${genre}-${t.number}`, genre, numero: t.number, titre: t.name, pole: `Pilier ${p.roman} · ${p.name}`, href,
        fiche: `/missions/fiche-mission-coordination-${t.id}.pdf`, visuel: `/partage/postes/poste-${genre}-${t.number}.png`,
        message: `ADEB LONODJI cherche ${role} pour la thématique prioritaire « ${t.number}. ${t.name} » (pilier ${p.roman}). Bénévole, au Tchad ou dans la diaspora. La fiche de mission et le formulaire : ${SITE}${href.replace("#contact", "")}#contact — ou par WhatsApp au ${ORG.phone}.`,
      });
    }
  }
  const cloture = dateFr(etape("cloture").date), vote = dateFr(etape("vote").date);
  for (const p of idx.structure.poles) {
    if (!p.direction || p.direction.filled) continue;
    const href = `/participer?direction=${p.roman}&coordo=1#contact`;
    postes.push({
      cle: `vice-presidence-${p.roman}`, genre: "vice-presidence", titre: p.name, pole: `Pilier ${p.roman} · candidatures jusqu’au ${cloture}, vote le ${vote}`, href,
      fiche: `/missions/fiche-mission-direction-${p.id}.pdf`, visuel: `/partage/postes/poste-vice-presidence-${p.roman}.png`,
      message: `ADEB LONODJI élira la vice-présidente ou le vice-président délégué du pilier ${p.roman}, « ${p.name} ». Candidatures jusqu’au ${cloture}, vote le ${vote} ; au Tchad comme dans la diaspora. Le formulaire : ${SITE}${href.replace("#contact", "")}#contact — la procédure : ${SITE}/association/election-vice-presidences — ou par WhatsApp au ${ORG.phone}.`,
    });
  }
  return postes;
}

export const GENRES: Record<Poste["genre"], string> = { titulaire: "Coordination à pourvoir", adjoint: "Adjoint ou adjointe", "vice-presidence": "Vice-présidence · élection" };
