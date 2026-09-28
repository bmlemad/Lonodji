"use client";

import { useState } from "react";
import type { ArticleSummary } from "../lib/content";
import { ArticleCard } from "./blocks";

export default function JournalList({ articles, categories }: { articles: ArticleSummary[]; categories: { slug: string; label: string }[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const used = new Set(articles.map((a) => a.category));
  const cats = categories.filter((c) => c.slug === "all" || used.has(c.slug));
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const list = articles.filter((a) => (cat === "all" || a.category === cat) && (!q || norm(a.title + " " + a.summary + " " + a.tag).includes(norm(q))));
  return (
    <>
      <div className="journal-tools">
        <label className="journal-search">
          <span className="sr-only">Rechercher un article</span>
          <input type="search" placeholder="Rechercher un article, un mot-clé (plaidoyer, langue, forum…)" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <p className="journal-count" aria-live="polite">{list.length} article{list.length > 1 ? "s" : ""}</p>
      </div>
      <div className="cat-list" role="list">
        {cats.map((c) => (
          <a key={c.slug} role="listitem" href="#articles" aria-current={cat === c.slug ? "true" : undefined} onClick={(e) => { e.preventDefault(); setCat(c.slug); }}>{c.label}</a>
        ))}
      </div>
      <div className="art-grid" id="articles">
        {list.map((a) => <ArticleCard key={a.slug} a={a} />)}
      </div>
      {list.length === 0 ? <p className="lg-footnote">Aucun article ne correspond à cette recherche.</p> : null}
    </>
  );
}
