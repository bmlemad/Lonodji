"use client";

import { useEffect, useState } from "react";

/* État d'une action du suivi qui n'est ni réalisée ni en cours. Le site est statique : rendu « À venir » à la
   construction, puis, dans le navigateur, « Échéance passée » si la date (heure de N'Djamena) est dépassée sans
   qu'une avancée ait été annoncée. Le site ne présume rien : il constate seulement l'absence d'annonce. (3 octobre 2026) */
export default function EtatEcheance({ echeance, aVenir }: { echeance: string; aVenir: string }) {
  const [passee, setPassee] = useState(false);
  useEffect(() => {
    const aujourdhui = new Date().toLocaleDateString("sv-SE", { timeZone: "Africa/Ndjamena" });
    setPassee(aujourdhui > echeance);
  }, [echeance]);
  if (!passee) return <span className="od-pill od-pill--a-venir">{aVenir}</span>;
  return <><span className="od-pill od-pill--a-decider">Échéance passée</span> <small>Pas encore d’avancée annoncée sur le site</small></>;
}
