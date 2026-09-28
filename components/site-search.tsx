"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Entry = { t: string; r: string; k: string; d: string; x: string; date?: string; tag?: string };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ");

function snippet(text: string, terms: string[]): { before: string; hit: string; after: string } | null {
  const n = norm(text);
  for (const t of terms) {
    const i = n.indexOf(t);
    if (i >= 0) {
      const start = Math.max(0, i - 90);
      const end = Math.min(text.length, i + t.length + 130);
      return { before: (start > 0 ? "… " : "") + text.slice(start, i), hit: text.slice(i, i + t.length), after: text.slice(i + t.length, end) + (end < text.length ? " …" : "") };
    }
  }
  return null;
}

export default function SiteSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [q, setQ] = useState(initialQuery);
  const [kind, setKind] = useState("Tous");
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("q");
    if (fromUrl) setQ(fromUrl);
    fetch("/search-index.json").then((r) => r.json()).then(setIndex).catch(() => setError(true));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, [q]);

  const terms = useMemo(() => norm(q).split(/\s+/).filter((t) => t.length >= 2), [q]);
  const results = useMemo(() => {
    if (!index || !terms.length) return [];
    const scored = index.map((e) => {
      const nt = norm(e.t), nd = norm(e.d), nx = norm(e.x);
      let score = 0;
      for (const t of terms) {
        let s = 0;
        if (nt.includes(t)) s += 8;
        if (nd.includes(t)) s += 4;
        const count = nx.split(t).length - 1;
        if (count) s += Math.min(count, 5);
        if (s === 0) return { e, score: 0 };
        score += s;
      }
      if (e.k === "Article" || e.k === "Thématique" || e.k === "Plaidoyer") score += 1;
      return { e, score };
    }).filter((r) => r.score > 0);
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [index, terms]);

  const kinds = useMemo(() => ["Tous", ...Array.from(new Set(results.map((r) => r.e.k)))], [results]);
  const shown = results.filter((r) => kind === "Tous" || r.e.k === kind).slice(0, 40);

  return (
    <div className="search-box">
      <label className="journal-search" htmlFor="site-search">
        <span className="sr-only">Rechercher dans le site</span>
        <input id="site-search" type="search" autoFocus placeholder="Un mot, un lieu, un nom : Bédjondo, forage, Tarouss Doumanbé, cotisation…" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <p className="journal-count" aria-live="polite">
        {error ? "L’index de recherche n’a pas pu être chargé." : !index ? "Chargement de l’index…" : terms.length ? `${results.length} résultat${results.length > 1 ? "s" : ""}` : `${index.length} pages, articles, thématiques et documents indexés.`}
      </p>
      {results.length ? (
        <div className="cat-list" role="list">
          {kinds.map((k) => <a key={k} role="listitem" href="#resultats" aria-current={kind === k ? "true" : undefined} onClick={(e) => { e.preventDefault(); setKind(k); }}>{k}</a>)}
        </div>
      ) : null}
      <ol className="search-results" id="resultats">
        {shown.map(({ e }) => {
          const snip = snippet(e.x, terms);
          return (
            <li key={e.r + e.t}>
              <small>{e.k}{e.date ? ` · ${e.date}` : ""}{e.tag ? ` · ${e.tag}` : ""}</small>
              <Link href={e.r}>{e.t}</Link>
              <p>{snip ? <>{snip.before}<mark>{snip.hit}</mark>{snip.after}</> : e.d}</p>
            </li>
          );
        })}
      </ol>
      {index && terms.length && !results.length ? <p className="lg-footnote">Aucun résultat. Essayez un autre mot, ou parcourez <Link href="/plan-du-site">le plan du site</Link>.</p> : null}
    </div>
  );
}
