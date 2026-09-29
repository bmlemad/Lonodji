"use client";

import { useEffect } from "react";

/* Ouvre le bloc repliable (details.plier) qui contient la cible de l'ancre de l'adresse, à l'arrivée et à chaque changement d'ancre. */
export default function OuvrirAncre() {
  useEffect(() => {
    const ouvrir = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const cible = document.getElementById(id);
      const bloc = cible?.closest("details");
      if (bloc && !bloc.open) { bloc.open = true; cible!.scrollIntoView(); }
    };
    ouvrir();
    window.addEventListener("hashchange", ouvrir);
    return () => window.removeEventListener("hashchange", ouvrir);
  }, []);
  return null;
}
