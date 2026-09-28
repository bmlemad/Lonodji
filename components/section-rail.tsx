"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* « Sur cette page » : sur grand écran, un rail à droite qui liste les sections
   de la page (les <section id> de <main> qui ont un titre), suit le défilement
   et permet d'y aller d'un clic. Construit après le rendu, depuis la page
   elle-même : rien à déclarer page par page. Absent quand la page a déjà un
   sommaire (livre blanc) ou moins de trois sections. */
type Item = { id: string; label: string };

export default function SectionRail() {
  const pathname = usePathname();
  const [items, setItems] = useState<Item[]>([]);
  const [actif, setActif] = useState("");

  useEffect(() => {
    setItems([]);
    setActif("");
    const main = document.querySelector("main");
    if (!main || main.querySelector(".od-sommaire")) return;
    const trouves: Item[] = [];
    for (const sec of Array.from(main.querySelectorAll<HTMLElement>("section[id], div[id].hub-section"))) {
      if (sec.closest("section[id] section[id]")) continue;
      const h = sec.querySelector<HTMLElement>("h2, h3");
      if (!h) continue;
      const eyebrow = sec.querySelector<HTMLElement>(".eyebrow");
      const brut = (eyebrow?.textContent || h.textContent || "").replace(/\s+/g, " ").trim().replace(/^\d{2}\s+—\s+/, "");
      if (!brut) continue;
      trouves.push({ id: sec.id, label: brut.length > 34 ? brut.slice(0, 33).trimEnd() + "…" : brut });
    }
    if (trouves.length < 3) return;
    setItems(trouves);
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActif((vis[0].target as HTMLElement).id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2] });
    for (const it of trouves) { const el = document.getElementById(it.id); if (el) obs.observe(el); }
    return () => obs.disconnect();
  }, [pathname]);

  if (!items.length) return null;
  return (
    <nav className="rail" aria-label="Sur cette page">
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={it.id === actif ? "is-active" : undefined} aria-current={it.id === actif ? "location" : undefined}>
              <i aria-hidden="true" /><span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
