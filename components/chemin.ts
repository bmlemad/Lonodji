"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const rien = () => () => {};

/* Chemin courant, sûr pour l'hydratation : vide pendant l'hydratation (le serveur ne connaît pas
   toujours l'adresse réelle — pages 404 prérendues sous « /_not-found »), puis le vrai chemin.
   Les liens qui en dépendent (langue, onglet actif) se mettent à jour juste après l'affichage. */
export function useChemin(): string {
  const chemin = usePathname() || "";
  const monte = useSyncExternalStore(rien, () => true, () => false);
  return monte ? chemin : "";
}
