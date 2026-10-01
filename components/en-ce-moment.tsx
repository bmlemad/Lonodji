"use client";

import { useEffect, useRef } from "react";

/* Frise « En ce moment » de l'accueil : marque, au jour du lecteur, les étapes passées et la prochaine
   (la page est statique ; sans JavaScript, la frise reste lisible, sans marque). */
export default function EnCeMoment({ etapes, prochaine = "Prochaine étape" }: { etapes: { date: string; jour: string; mois: string; quoi: string; href: string }[]; prochaine?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const auj = new Date().toISOString().slice(0, 10);
    const items = Array.from(ref.current?.querySelectorAll<HTMLLIElement>("li") ?? []);
    let prochaine = false;
    for (const li of items) {
      const d = li.dataset.date ?? "";
      if (d < auj) li.classList.add("fait");
      else if (!prochaine) { li.classList.add("prochaine"); li.setAttribute("aria-current", "date"); prochaine = true; }
    }
  }, []);
  return (
    <ol className="acc-frise" ref={ref}>
      {etapes.map((e) => (
        <li key={e.date + e.quoi} data-date={e.date}>
          <a href={e.href}>
            <time dateTime={e.date}><b>{e.jour}</b> {e.mois}</time>
            <span data-prochaine={prochaine}>{e.quoi}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
