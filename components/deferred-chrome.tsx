"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NavTools = dynamic(() => import("@/components/nav-tools"), { ssr: false });
const Palette = dynamic(() => import("@/components/palette"), { ssr: false });
const SectionRail = dynamic(() => import("@/components/section-rail"), { ssr: false });
const FeuillePartage = dynamic(() => import("@/components/partager").then((m) => m.FeuillePartage), { ssr: false });

/* Demandes faites avant le chargement de la palette ou de la feuille de partage (clic sur la loupe ou sur
   « Partager », touche / ou Ctrl+K) : on les garde ici, on charge tout de suite, et chaque composant rejoue la
   sienne à son montage (voir palette.tsx et partager.tsx). */
type FenetreAttente = Window & { __lonodjiEnAttente?: Set<string>; __lonodjiPret?: Set<string> };
const estChamp = (el: Element | null) => !!el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement || (el as HTMLElement).isContentEditable);

export default function DeferredChrome() {
  const [ready, setReady] = useState(false);

  // Actif jusqu'à ce que chaque composant se déclare prêt (__lonodjiPret) : entre « ready » et le montage
  // effectif (téléchargement du morceau de code), une demande serait sinon perdue.
  useEffect(() => {
    const w = window as FenetreAttente;
    const demander = (nom: string) => {
      if (w.__lonodjiPret?.has(nom)) return;
      (w.__lonodjiEnAttente ??= new Set()).add(nom);
      setReady(true);
    };
    const onPalette = () => demander("palette");
    const onPartager = () => demander("partager");
    const onKey = (e: KeyboardEvent) => {
      const ctrlK = (e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey);
      const barre = e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !estChamp(document.activeElement);
      if ((ctrlK || barre) && !w.__lonodjiPret?.has("palette")) { e.preventDefault(); demander("palette"); }
    };
    window.addEventListener("lonodji:palette", onPalette);
    window.addEventListener("lonodji:partager", onPartager);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("lonodji:palette", onPalette);
      window.removeEventListener("lonodji:partager", onPartager);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const run = () => setReady(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(run, { timeout: 700 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 350);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <>
      <NavTools />
      <Palette />
      <FeuillePartage />
      <SectionRail />
    </>
  );
}
