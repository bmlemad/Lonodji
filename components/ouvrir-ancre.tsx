"use client";

import { useEffect } from "react";

/* Ouvre le bloc repliable (details.plier) qui contient la cible de l'ancre de l'adresse, à l'arrivée et à chaque changement d'ancre. */
export default function OuvrirAncre() {
  useEffect(() => {
    const ouvrir = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const cible = document.getElementById(id);
      if (!cible) return;
      let bloc = cible.closest("details");
      let ouvert = false;
      while (bloc) {
        if (!bloc.open) { bloc.open = true; ouvert = true; }
        bloc = bloc.parentElement?.closest("details") ?? null;
      }
      if (ouvert) cible.scrollIntoView();
    };
    ouvrir();
    window.addEventListener("hashchange", ouvrir);
    return () => window.removeEventListener("hashchange", ouvrir);
  }, []);
  return null;
}
