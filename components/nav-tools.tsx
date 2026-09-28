"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Outils de navigation communs :
   - l'en-tête se resserre après quelques dizaines de pixels de défilement, et,
     sur téléphone, s'efface quand on descend et revient quand on remonte
     (classes nav-compact / nav-hidden sur <html>) ;
   - un fil de lecture en haut de l'écran sur les pages longues (articles,
     livre blanc, identité, dossiers, programmes) ;
   - le bouton « retour en haut », avec l'avancement de la lecture en anneau,
     qui apparaît après un défilement long (au-dessus de la barre d'onglets). */
const LONGUES = /^\/(journal\/|odeb\/(livre-blanc|identite|feuille-de-route|programmes\/)|dossiers\/|villages\/|presse|transparence|mentions-legales|accessibilite)/;

export default function NavTools() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [avancement, setAvancement] = useState(0);
  const longue = LONGUES.test(pathname);

  useEffect(() => {
    let tick = false;
    let dernier = window.scrollY;
    const html = document.documentElement;
    const maj = () => {
      tick = false;
      const y = window.scrollY;
      const max = Math.max(1, html.scrollHeight - window.innerHeight);
      setVisible(y > 900);
      setAvancement(Math.min(1, y / max));
      html.classList.toggle("nav-compact", y > 60);
      // sur téléphone : l'en-tête s'efface en descendant, revient en remontant ou près du haut
      const mobile = window.matchMedia("(max-width: 800px)").matches;
      if (mobile) {
        if (y < 120 || y < dernier - 6) html.classList.remove("nav-hidden");
        else if (y > dernier + 8 && y > 200) html.classList.add("nav-hidden");
      } else html.classList.remove("nav-hidden");
      dernier = y;
    };
    const onScroll = () => { if (!tick) { tick = true; window.requestAnimationFrame(maj); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    maj();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); html.classList.remove("nav-compact", "nav-hidden"); };
  }, [pathname]);

  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <>
      {longue ? <div className="lecture" aria-hidden="true" style={{ transform: `scaleX(${avancement})` }} /> : null}
      <button
        type="button"
        className={visible ? "haut is-visible" : "haut"}
        aria-label="Retour en haut de la page"
        title="Retour en haut"
        tabIndex={visible ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      >
        <svg className="haut-anneau" width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
          <circle cx="23" cy="23" r={r} fill="none" stroke="rgba(23,59,45,.12)" strokeWidth="2.5" />
          <circle cx="23" cy="23" r={r} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - avancement)} transform="rotate(-90 23 23)" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>
      </button>
    </>
  );
}
