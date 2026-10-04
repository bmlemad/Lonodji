"use client";

import { useEffect, useState } from "react";

type Etape = { date: string; jour: string; mois: string; quoi: string; href: string };

/* Trois échéances à venir ; le calendrier complet reste accessible sans JavaScript. */
export default function EnCeMoment({ etapes, prochaine = "Prochaine étape", calendrier = "Voir le calendrier complet" }: { etapes: Etape[]; prochaine?: string; calendrier?: string }) {
  const [aujourdhui, setAujourdhui] = useState("");
  useEffect(() => { setAujourdhui(new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Ndjamena" })); }, []);
  const aVenir = etapes.filter((e) => e.date >= aujourdhui);
  const apercu = aVenir.length ? aVenir.slice(0, 3) : etapes.slice(-3);
  const prochaineDate = aVenir[0]?.date;
  const liste = (items: Etape[]) => (
    <ol className="acc-frise">
      {items.map((e) => (
        <li key={e.date + e.quoi} className={e.date < aujourdhui ? "fait" : e.date === prochaineDate ? "prochaine" : undefined} aria-current={e.date === prochaineDate ? "date" : undefined}>
          <a href={e.href}>
            <time dateTime={e.date}><b>{e.jour}</b> {e.mois}</time>
            <span data-prochaine={prochaine}>{e.quoi}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <div className="acc-calendrier">
      {liste(apercu)}
      {etapes.length > apercu.length ? (
        <details className="acc-calendrier-complet">
          <summary>{calendrier} ({etapes.length})</summary>
          {liste(etapes)}
        </details>
      ) : null}
    </div>
  );
}
