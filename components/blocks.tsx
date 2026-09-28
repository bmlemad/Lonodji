import Link from "next/link";
import type { ArticleSummary, DocumentItem, Plaidoyer, Thematique } from "../lib/content";

/* Adresse du site pour les données structurées (pas d'import de lib/content : ce module sert aussi côté client). */
const SITE = "https://lonodji.org";

export function PageHeader({ eyebrow, title, em, lead, crumbs, pills }: {
  eyebrow: string; title: string; em?: string; lead?: string; crumbs?: { label: string; href?: string }[]; pills?: string[];
}) {
  const fil = crumbs?.length
    ? { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: SITE + "/" }, ...crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c.label, ...(c.href ? { item: SITE + c.href } : {}) }))] }
    : null;
  return (
    <>
      {fil ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fil) }} /> : null}
      {crumbs?.length ? (
        <nav className="lg-crumbs" aria-label="Fil d’Ariane">
          <ol>
            <li><Link href="/">Accueil</Link></li>
            {crumbs.map((c) => (c.href ? <li key={c.label}><Link href={c.href}>{c.label}</Link></li> : <li key={c.label} aria-current="page">{c.label}</li>))}
          </ol>
        </nav>
      ) : null}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}{em ? <><br /><em>{em}</em></> : null}</h1>
      {lead ? <p className="detail-lead">{lead}</p> : null}
      {pills?.length ? <div className="status-list lg-pills">{pills.map((p) => <span key={p}>{p}</span>)}</div> : null}
    </>
  );
}

export function Stats({ items }: { items: { value: string; label: string; note?: string }[] }) {
  return (
    <div className="stat-row">
      {items.map((s) => (
        <div className="stat-tile" key={s.label}>
          <strong>{s.value}</strong>
          <span>{s.label}</span>
          {s.note ? <small>{s.note}</small> : null}
        </div>
      ))}
    </div>
  );
}

export function SectionHead({ eyebrow, title, em, text, id }: { eyebrow: string; title: string; em?: string; text?: string; id?: string }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}{em ? <><br /><em>{em}</em></> : null}</h2>
      </div>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function ThematiqueRow({ t, pole }: { t: Thematique; pole?: string }) {
  return (
    <article className="them-row" id={t.id}>
      <span className="them-num">{t.kind === "cellule" ? "Cellule" : t.number}</span>
      <div className="them-body">
        <h3>{t.name}</h3>
        <p className="them-coord">
          {t.filled ? <><b>{t.coordinatorLabel || "Coordination"} :</b> {t.coordinator}</> : <>Coordination à pourvoir — <Link href={`/participer?theme=${t.number}&coordo=1#contact`}>proposer sa candidature</Link></>}
        </p>
        <p className="them-desc" dangerouslySetInnerHTML={{ __html: t.description }} />
        {t.odd.length ? (
          <p className="them-odd"><span className="odd-legend">ODD</span>{t.odd.map((o) => (
            <a key={o.num + o.cible} className="odd-chip" href={`/dossiers/odd#odd-${o.num}`} title={o.title} style={{ ["--odd-accent" as string]: o.accent, ["--odd-ink" as string]: o.ink }}>
              <span className="odd-num">{o.num}</span><span className="odd-name">{o.name}</span><span className="odd-cible">{o.cible}</span>
            </a>
          ))}</p>
        ) : null}
        {t.links.length ? <p className="them-links">{t.links.map((l) => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>)}</p> : null}
      </div>
      <span className={t.filled ? "status filled" : "status"}>{t.filled ? "Pourvu" : "À pourvoir"}{pole ? ` · Pôle ${pole}` : ""}</span>
    </article>
  );
}

export function ArticleCard({ a }: { a: ArticleSummary }) {
  return (
    <article className="art-card">
      <div className="art-meta"><time dateTime={a.date}>{a.dateLabel}</time>{a.tag ? <span className="tag">{a.tag}</span> : null}</div>
      <h3><Link href={a.route}>{a.title}</Link></h3>
      <p>{a.summary}</p>
      <div className="art-foot"><span>{a.readTime}</span><Link className="text-link" href={a.route}>Lire l’article <span aria-hidden="true">→</span></Link></div>
    </article>
  );
}

export function PlaidoyerCard({ p }: { p: Plaidoyer }) {
  return (
    <article className="plea" id={p.id}>
      <div className="plea-top"><Link className="tag" href={p.themeHref}>{p.theme}</Link><span className="status">{p.status}</span></div>
      <h3><Link href={p.href}>{p.title}</Link></h3>
      <p>{p.demand}</p>
      <dl className="plea-facts">
        <div><dt>Destinataires</dt><dd>{p.recipients}</dd></div>
        <div><dt>Publié</dt><dd>{p.published}</dd></div>
        <div><dt>Envoyé</dt><dd>{p.sent}</dd></div>
        <div><dt>Réponse</dt><dd>{p.answer}</dd></div>
      </dl>
      <div className="plea-links">
        <Link className="button primary" href={p.href}>Lire le plaidoyer <span aria-hidden="true">↗</span></Link>
        {p.pdf ? <a className="button secondary" href={p.pdf} download>PDF</a> : null}
      </div>
    </article>
  );
}

export function DocumentCard({ d }: { d: DocumentItem }) {
  const available = Boolean(d.pdf);
  return (
    <article className={available ? "doc-card" : "doc-card doc-card--pending"}>
      <span className={available ? "status filled" : "status"}>{d.status}</span>
      <h3>{d.title}</h3>
      {d.meta ? <p className="doc-meta">{d.meta}</p> : null}
      <p>{d.description}</p>
      <div className="doc-links">
        {available ? <a className="button primary" href={d.pdf} download>Télécharger le PDF <span aria-hidden="true">↓</span></a> : null}
        {d.links.map((l) => <Link key={l.href + l.label} className="text-link" href={l.href}>{l.label.replace(/\s*→$/, "")} <span aria-hidden="true">→</span></Link>)}
      </div>
    </article>
  );
}

export function Timeline({ items }: { items: { year: string; title: string; text: string }[] }) {
  return (
    <ol className="timeline">
      {items.map((h) => (
        <li key={h.year + h.title}>
          <span className="tl-year">{h.year}</span>
          <div><h3>{h.title}</h3><p>{h.text}</p></div>
        </li>
      ))}
    </ol>
  );
}
