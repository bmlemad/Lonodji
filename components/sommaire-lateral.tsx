"use client";

import { useEffect, useState } from "react";

/* Sommaire latéral des pages de fond (30/09/2026) : sur grand écran, colonne de droite qui reste
   visible au défilement et surligne la section en cours de lecture. Sur téléphone, il s'affiche
   en tête du contenu, comme l'ancien sommaire. */
export default function SommaireLateral({ items, titre = "Sur cette page" }: { items: { href: string; label: string }[]; titre?: string }) {
  const [actif, setActif] = useState("");
  const [ouvert, setOuvert] = useState(false);
  // grand écran : toujours ouvert ; téléphone : replié derrière « Sur cette page (n) »
  useEffect(() => {
    const mq = window.matchMedia("(min-width:1180px)");
    const maj = () => setOuvert(mq.matches);
    maj(); mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);
  useEffect(() => {
    const ids = items.map((i) => decodeURIComponent(i.href.replace(/^#/, ""))).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActif((vis[0].target as HTMLElement).id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.1] });
    for (const id of ids) { const el = document.getElementById(id); if (el) obs.observe(el); }
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav className="lg-sommaire" aria-label={titre}>
      <details open={ouvert} onToggle={(e) => setOuvert((e.target as HTMLDetailsElement).open)}>
      <summary className="eyebrow">{titre} <span>({items.length})</span></summary>
      <ol>
        {items.map((t) => {
          const on = t.href === `#${actif}`;
          return <li key={t.href}><a href={t.href} className={on ? "is-active" : undefined} aria-current={on ? "location" : undefined}>{t.label}</a></li>;
        })}
      </ol>
      </details>
    </nav>
  );
}
