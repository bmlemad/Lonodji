import Link from "next/link";
import type { LegacyPage, Section } from "../lib/content";
import LegacyEnhance from "./legacy-enhance";

/** Rendu des sections importées de l'ancien site, dans le style du site moderne. */
export function LegacySections({ sections, className = "" }: { sections: Section[]; className?: string }) {
  return (
    <>
      {sections.map((s, i) => {
        const classes = ["lg-section", s.alt ? "alt" : "", s.cls].filter(Boolean).join(" ");
        return (
          <section
            key={s.id || i}
            id={s.id || undefined}
            className={classes}
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        );
      })}
      {className ? null : null}
    </>
  );
}

export function Resume({ items }: { items?: string[] }) {
  if (!items || !items.length) return null;
  return (
    <aside className="lg-resume" aria-labelledby="lg-resume-titre">
      <p className="eyebrow" id="lg-resume-titre">En trois phrases</p>
      <ol>{items.map((t, i) => <li key={i}>{t}</li>)}</ol>
    </aside>
  );
}

export function Toc({ items }: { items?: { href: string; label: string }[] }) {
  if (!items || !items.length) return null;
  return (
    <nav className="lg-toc" aria-label="Sommaire de la page">
      <p className="eyebrow">Sur cette page</p>
      <ol>{items.map((t) => <li key={t.href}><a href={t.href}>{t.label}</a></li>)}</ol>
    </nav>
  );
}

export function Crumbs({ items, parentHref }: { items: string[]; parentHref?: string }) {
  if (!items || items.length < 2) return null;
  const parent = items[items.length - 2];
  return (
    <nav className="lg-crumbs" aria-label="Fil d’Ariane">
      <ol>
        <li><Link href="/">Accueil</Link></li>
        {parentHref && parent !== "Accueil" ? <li><Link href={parentHref}>{parent}</Link></li> : null}
        <li aria-current="page">{items[items.length - 1]}</li>
      </ol>
    </nav>
  );
}

export const PARENT_ROUTES: Record<string, string> = {
  "Nos actions": "/programmes",
  "L’association": "/mission",
  "L'association": "/mission",
  "Bédjondo & héritage": "/histoire",
  "Actualités": "/journal",
  "Le journal": "/journal",
  "Agir avec nous": "/participer",
  "Association": "/mission",
};

/** Page de fond complète (dossier) : en-tête conçu + contenu importé. */
export function LegacyDocument({ page, children, eyebrowPrefix }: { page: LegacyPage; children?: React.ReactNode; eyebrowPrefix?: string }) {
  const [main, ...rest] = splitTitle(page.title);
  return (
    <main id="main-content" className="detail-page lg-page" lang={page.lang !== "fr" ? page.lang : undefined}>
      <Crumbs items={page.crumbs} parentHref={PARENT_ROUTES[page.parent]} />
      <p className="eyebrow">{[eyebrowPrefix, page.eyebrow].filter(Boolean).join(" — ")}</p>
      <h1>{main}{rest.length ? <><br /><em>{rest.join(" ")}</em></> : null}</h1>
      {page.lede ? <p className="detail-lead">{page.lede}</p> : null}
      {page.pills?.length ? <div className="status-list lg-pills">{page.pills.map((p) => <span key={p}>{p}</span>)}</div> : null}
      {children}
      <div className="legacy" {...(page.rootAttrs ?? {})}>
        <Resume items={page.resume} />
        <Toc items={page.toc} />
        <LegacySections sections={page.sections} />
      </div>
      <LegacyEnhance hasMap={page.hasMap} hasForms={page.forms.length > 0} scripts={page.scripts} />
      <p className="lg-footnote">Page reprise de la première version du site (septembre 2026) et maintenue à jour ici. Une erreur de fait ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p>
    </main>
  );
}

/** Coupe un titre en deux parties pour l'emphase de la seconde (style de la maquette). */
export function splitTitle(title: string): string[] {
  const words = title.split(" ");
  if (words.length < 5) return [title];
  const cut = Math.ceil(words.length * 0.55);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}
