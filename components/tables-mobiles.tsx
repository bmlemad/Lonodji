"use client";

import { useEffect } from "react";
import { useChemin } from "@/components/chemin";

/* Ajustements mobiles faits au chargement de chaque page. Sur téléphone, les tableaux à en-tête s'empilent : une carte par ligne, chaque cellule précédée de l'intitulé
   de sa colonne (data-label recopié de l'en-tête). Le rendu est fait en CSS (.t-empile, ≤ 640 px) ; ce composant
   pose seulement les intitulés et la classe, à chaque page. Exclus : les tableaux déjà empilés (.ob-table--empile),
   le dossier imprimable, et ceux marqués .no-empile. (2 octobre 2026) */
export default function TablesMobiles() {
  const chemin = useChemin();
  useEffect(() => {
    const poser = () => {
      for (const t of Array.from(document.querySelectorAll<HTMLTableElement>("main table"))) {
        if (t.dataset.empile || t.classList.contains("ob-table--empile") || t.classList.contains("no-empile") || t.closest(".dossier-print")) continue;
        const ligneTete = t.tHead?.rows[t.tHead.rows.length - 1];
        if (!ligneTete || !t.tBodies.length || (t.tHead?.rows.length ?? 0) > 1) continue;  // en-tête sur deux lignes : tableau de données, laissé tel quel
        const intitules: string[] = [];
        for (const c of Array.from(ligneTete.cells)) for (let k = 0; k < (c.colSpan || 1); k++) intitules.push((c.textContent || "").replace(/\s+/g, " ").trim());
        if (intitules.length < 2) continue;
        for (const tb of Array.from(t.tBodies)) for (const r of Array.from(tb.rows)) {
          let i = 0;
          for (const c of Array.from(r.cells)) {
            const lib = intitules[i];
            if (lib && i > 0 && !c.hasAttribute("data-label")) c.setAttribute("data-label", lib);
            i += c.colSpan || 1;
          }
        }
        t.classList.add("t-empile");
        t.dataset.empile = "1";
      }
    };
    poser();
    // pied de page : sur téléphone, les colonnes de liens se replient (titre seul, on ouvre au toucher)
    if (window.matchMedia("(max-width: 640px)").matches) for (const d of Array.from(document.querySelectorAll<HTMLDetailsElement>("details.footer-col"))) d.open = false;
    // héros : un chapô de plus de neuf lignes est replié à sept, avec « Lire la suite » (revue du 3 octobre 2026)
    if (window.matchMedia("(max-width: 640px)").matches) {
      const chapo = document.querySelector<HTMLElement>("main h1 ~ .detail-lead, main .h1-sous ~ .detail-lead");
      if (chapo && !chapo.dataset.replie) {
        const lh = parseFloat(getComputedStyle(chapo).lineHeight) || 26;
        if (chapo.getBoundingClientRect().height > lh * 9.5) {
          const en = (chapo.closest("[lang]")?.getAttribute("lang") || document.documentElement.lang || "fr").startsWith("en");
          chapo.dataset.replie = "1";
          chapo.classList.add("chapo-replie");
          chapo.id ||= "chapo-heros";
          const bouton = document.createElement("button");
          bouton.type = "button";
          bouton.className = "chapo-suite";
          bouton.setAttribute("aria-expanded", "false");
          bouton.setAttribute("aria-controls", chapo.id);
          bouton.textContent = en ? "Read more" : "Lire la suite";
          bouton.addEventListener("click", () => { chapo.classList.remove("chapo-replie"); bouton.remove(); });
          chapo.after(bouton);
        }
      }
    }
    const id = window.setTimeout(poser, 600);
    return () => window.clearTimeout(id);
  }, [chemin]);
  return null;
}
