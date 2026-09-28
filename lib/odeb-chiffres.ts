import fs from "node:fs";
import path from "node:path";
import { filledCount, getIndex, thematiqueCount, type Thematique } from "./content";
import { getIndicateurs } from "./indicateurs";
import type { Chiffres } from "./odeb";

/* Chiffres du site pour les pages du projet ODEB (comptés à la construction,
   depuis les mêmes fichiers que le tableau de bord). Côté serveur seulement. */
export function chiffresOdeb(): Chiffres {
  const idx = getIndex();
  const ind = getIndicateurs();
  const biblio = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "bibliotheque.json"), "utf8")) as { references: unknown[]; chercheurs: unknown[]; documents: unknown[] };
  const forms = fs.readFileSync(path.join(process.cwd(), "public", "__forms.html"), "utf8");
  const cellules = idx.structure.cellules?.items ?? [];
  return {
    pages: ind.contenu.pages,
    articles: ind.contenu.articles,
    formulaires: (forms.match(/<form /g) || []).length,
    problematiques: ind.contenu.problematiques.total,
    chantiersPrioritaires: ind.contenu.problematiques.chantiersPrioritaires,
    inconnues: ind.contenu.problematiques.inconnues,
    unites: ind.contenu.carte.unites,
    localites: ind.contenu.carte.localites,
    fiches: ind.contenu.carte.localitesNommees,
    references: biblio.references.length,
    pdf: biblio.documents.length,
    chercheurs: biblio.chercheurs.length,
    vacantes: thematiqueCount(idx) - filledCount(idx),
    cellulesVacantes: cellules.filter((c) => !c.filled).length,
    pourvues: filledCount(idx),
    total: thematiqueCount(idx),
    projets: ind.contenu.projets.liste.length,
    projetsActifs: ind.contenu.projets.actifs,
    plaidoyers: ind.contenu.plaidoyers.publies,
    plaidoyersEnvoyes: ind.contenu.plaidoyers.envoyes,
    corrections: ind.contenu.corrections,
  };
}

/* Les thématiques (et cellules) par identifiant, pour nommer les coordonnateurs. */
export function thematiquesParId(): Record<string, Thematique & { pole: string; poleRoman: string }> {
  const idx = getIndex();
  const out: Record<string, Thematique & { pole: string; poleRoman: string }> = {};
  for (const p of idx.structure.poles) for (const t of p.items) out[t.id] = { ...t, pole: p.name, poleRoman: p.roman };
  for (const c of idx.structure.cellules?.items ?? []) out[c.id] = { ...c, pole: "Cellule transversale", poleRoman: "" };
  return out;
}
