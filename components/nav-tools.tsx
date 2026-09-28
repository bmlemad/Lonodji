"use client";

import { useEffect, useState } from "react";

/* Outils de navigation communs : bouton « retour en haut » qui apparaît après
   un défilement long (au-dessus de la barre d'onglets quand le site tourne en
   appli), et raccourci clavier « / » vers la recherche hors des champs. */
export default function NavTools() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let tick = false;
    const maj = () => { tick = false; setVisible(window.scrollY > 900); };
    const onScroll = () => { if (!tick) { tick = true; window.requestAnimationFrame(maj); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    maj();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable)) return;
      e.preventDefault();
      window.location.assign("/recherche");
    };
    document.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("keydown", onKey); };
  }, []);
  return (
    <button
      type="button"
      className={visible ? "haut is-visible" : "haut"}
      aria-label="Retour en haut de la page"
      title="Retour en haut"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>
    </button>
  );
}
