"use client";

import { useEffect, useState } from "react";
import type { ArticleSummary } from "../lib/content";
import { ArticleCard } from "./blocks";
import { mettreAJourFiltres } from "@/lib/url-recherche";

export default function JournalList({ articles, categories }: { articles: ArticleSummary[]; categories: { slug: string; label: string }[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [tout, setTout] = useState(false);
  // ?rubrique=<slug> (depuis la bibliothèque) : ouvre le journal sur une rubrique
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("rubrique");
    setQ(params.get("q") || "");
    setTout(params.get("tout") === "1");
    if (r && categories.some((c) => c.slug === r)) setCat(r);
  }, [categories]);
  const used = new Set(articles.map((a) => a.category));
  const cats = categories.filter((c) => c.slug === "all" || used.has(c.slug));
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const list = articles.filter((a) => (cat === "all" || a.category === cat) && (!q || norm(a.title + " " + a.summary + " " + a.tag).includes(norm(q))));
  // les douze plus récents d'abord ; le reste reste dans la page (moteurs de recherche) mais masqué jusqu'au clic
  const LIMITE = 12;
  const replie = !tout && cat === "all" && !q && list.length > LIMITE + 3;
  const afficherTout = () => {
    setTout(true);
    mettreAJourFiltres({ tout: "1" });
    requestAnimationFrame(() => (document.querySelectorAll<HTMLAnchorElement>("#articles > .art-card h3 a")[LIMITE])?.focus());
  };
  return (
    <>
      <div className="journal-tools">
        <label className="journal-search">
          <span className="sr-only">Rechercher un article</span>
          <input type="search" placeholder="Rechercher un article ou un mot-clé…" value={q} autoComplete="off" aria-controls="articles" onChange={(e) => { setQ(e.target.value); mettreAJourFiltres({ q: e.target.value }); }} />
        </label>
        <p className="journal-count" aria-live="polite">{list.length} article{list.length > 1 ? "s" : ""}</p>
      </div>
      <div className="cat-list">
        {cats.map((c) => (
          <a key={c.slug} href="#articles" aria-current={cat === c.slug ? "true" : undefined} onClick={(e) => { e.preventDefault(); setCat(c.slug); mettreAJourFiltres({ rubrique: c.slug === "all" ? "" : c.slug }); }}>{c.label}</a>
        ))}
      </div>
      <h2 className="sr-only">Tous les articles</h2>
      <div className="art-grid" id="articles">
        {list.map((a, i) => (replie && i >= LIMITE ? <div key={a.slug} hidden><ArticleCard a={a} /></div> : <ArticleCard key={a.slug} a={a} />))}
      </div>
      {replie ? (
        <p className="section-actions journal-plus">
          <button type="button" className="button secondary" onClick={afficherTout}>Afficher les {list.length - LIMITE} articles plus anciens <span aria-hidden="true">↓</span></button>
        </p>
      ) : null}
      {list.length === 0 ? <p className="lg-footnote">Aucun article ne correspond à cette recherche.</p> : null}
    </>
  );
}
