import Link from "@/components/lien";
import type { ArticleSummary, DocumentItem, Plaidoyer, Thematique } from "../lib/content";
import { estPrioritaire } from "@/lib/organisation";
import { secteursDeThematique } from "../lib/secteurs";

/* Adresse du site pour les données structurées (pas d'import de lib/content : ce module sert aussi côté client). */
const SITE = "https://lonodji.org";

export function PageHeader({ eyebrow, title, em, lead, crumbs, pills, lang }: {
  eyebrow: string; title: string; em?: string; lead?: string; crumbs?: { label: string; href?: string }[]; pills?: string[]; lang?: "fr" | "en";
}) {
  // pages anglaises : premier maillon « Home » → /en/index (lang explicite, ou fil qui pointe vers /en/…)
  const en = lang ? lang === "en" : Boolean(crumbs?.some((c) => c.href?.startsWith("/en/")));
  const accueil = en ? { name: "Home", href: "/en/index" } : { name: "Accueil", href: "/" };
  const fil = crumbs?.length
    ? { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: accueil.name, item: SITE + accueil.href }, ...crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c.label, ...(c.href ? { item: SITE + c.href } : {}) }))] }
    : null;
  return (
    <>
      {fil ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fil) }} /> : null}
      {crumbs?.length ? (
        <nav className="lg-crumbs" aria-label={en ? "Breadcrumb" : "Fil d’Ariane"}>
          <ol>
            <li><Link href={accueil.href}>{accueil.name}</Link></li>
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

/* Coupe une description HTML après sa première phrase (au moins 90 signes), hors balise ouverte : le reste se replie. */
function couperDescription(html: string): [string, string] {
  const re = /[.!?»]\s+(?=[A-ZÀ-Ý<«])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const avant = html.slice(0, m.index + 1);
    if (avant.replace(/<[^>]+>/g, "").length < 90) continue;
    const ouvertes = (avant.match(/<(a|strong|em|b|i|span)\b/g) || []).length;
    const fermees = (avant.match(/<\/(a|strong|em|b|i|span)>/g) || []).length;
    if (ouvertes !== fermees || /<[^>]*$/.test(avant)) continue;
    const reste = html.slice(m.index + m[0].length);
    return reste.replace(/<[^>]+>/g, "").trim().length > 60 ? [avant, reste] : [html, ""];
  }
  return [html, ""];
}

export function ThematiqueRow({ t, pole, partenaires }: { t: Thematique; pole?: string; partenaires?: { id: string; nom: string; proche: boolean }[] }) {
  // candidature : numéro de la thématique, ou code court de la cellule (même logique que /odeb/programmes/[programme])
  const cle = t.kind === "cellule" ? t.id.replace("cellule-", "").split("-")[0] : t.number;
  return (
    <article className="them-row" id={t.id}>
      <span className="them-num">{t.kind === "cellule" ? "Cellule" : t.number}</span>
      <div className="them-body">
        <h3>{t.name}</h3>
        {estPrioritaire(t.id) ? <p className="them-prio"><Link href="/association/propositions-organisation#prioritaires">Thématique prioritaire</Link> · titulaire et adjoint{t.filled ? <> · <Link href={`/participer?theme=${cle}&adjoint=1#contact`}>devenir adjoint</Link></> : null} · <a href="/organisation/plans-annuels-priorites.pdf">plan annuel à compléter</a></p> : null}
        <p className="them-coord">
          {t.filled ? <><b>{t.coordinatorLabel || "Coordination"} :</b> {t.coordinator}</> : <>Coordination à pourvoir — <Link href={`/participer?theme=${cle}&coordo=1#contact`}>{t.kind === "cellule" ? <>Rejoindre cette cellule <span aria-hidden="true">→</span></> : "proposer sa candidature"}</Link></>}
        </p>
        {secteursDeThematique(t.id).length ? <p className="them-secteurs" aria-label="Secteurs d’intervention">{secteursDeThematique(t.id).map((s) => <Link key={s.id} href={`/secteurs#${s.id}`}>{s.sigle}</Link>)}</p> : null}
        {(() => {
          const [debut, suite] = couperDescription(t.description);
          return suite ? (
            <>
              <p className="them-desc them-desc-debut" dangerouslySetInnerHTML={{ __html: debut }} />
              <details className="them-plus">
                <summary><span className="them-plus-lien">Lire la suite<span className="sr-only"> : {t.name}</span></span><span className="them-plus-moins">Réduire</span></summary>
                <p className="them-desc them-desc-suite" dangerouslySetInnerHTML={{ __html: suite }} />
              </details>
            </>
          ) : <p className="them-desc" dangerouslySetInnerHTML={{ __html: t.description }} />;
        })()}
        {t.odd.length ? (
          <p className="them-odd"><span className="odd-legend">ODD</span>{t.odd.map((o) => (
            <a key={o.num + o.cible} className="odd-chip" href={`/programmes/odd#odd-${o.num}`} title={o.title} style={{ ["--odd-accent" as string]: o.accent, ["--odd-ink" as string]: o.ink }}>
              <span className="odd-num">{o.num}</span><span className="odd-name">{o.name}</span><span className="odd-cible">{o.cible}</span>
            </a>
          ))}</p>
        ) : null}
        {partenaires ? (
          <p className="them-partenaires">
            <span className="them-partenaires-titre">Programmes partenaires</span>
            {partenaires.length ? <>{partenaires.slice(0, 4).map((p) => <Link key={p.id} href={`/bailleurs#${p.id}`} className={p.proche ? "est-proche" : undefined}>{p.nom}</Link>)}{partenaires.length > 4 ? <Link href={`/bailleurs#action-${t.id}`}>+ {partenaires.length - 4}</Link> : null}</> : <Link href={`/bailleurs#action-${t.id}`}>aucun programme relevé</Link>}
          </p>
        ) : null}
        {t.links.length ? <p className="them-links">{t.links.map((l) => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>)}<a href={`/missions/fiche-mission-${t.kind === "cellule" ? "" : "coordination-"}${t.id}.pdf`} download>Fiche de mission (PDF) ↓</a></p> : null}
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
      <div className="art-foot"><span>{a.readTime}</span><Link className="text-link" href={a.route}>Lire l’article<span className="sr-only"> « {a.title} »</span> <span aria-hidden="true">→</span></Link></div>
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
        <div><dt>Destinataires</dt><dd>{p.recipients.replace(/\s+\)/g, ")")}</dd></div>
        <div><dt>Publié</dt><dd>{p.published}</dd></div>
        <div><dt>Envoyé</dt><dd>{p.sent}</dd></div>
        <div><dt>Réponse</dt><dd>{p.answer}</dd></div>
      </dl>
      <div className="plea-links">
        <Link className="button primary" href={p.href}>Lire le plaidoyer<span className="sr-only"> « {p.title} »</span> <span aria-hidden="true">→</span></Link>
        {p.pdf ? <a className="button secondary" href={p.pdf} download>PDF<span className="sr-only"> du plaidoyer « {p.title} »</span></a> : null}
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
        {available ? <a className="button primary" href={d.pdf} download>Télécharger le PDF<span className="sr-only"> « {d.title} »</span> <span aria-hidden="true">↓</span></a> : null}
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

/* Deux vues d'une même grille : les vingt et une thématiques par pôle (/programmes) ou par secteur, en langue ONG (/secteurs). */
export function VuesThematiques({ active }: { active: "poles" | "secteurs" }) {
  const vues = [
    { id: "poles", href: "/programmes", label: "Par pôle", note: "l’organisation de l’association" },
    { id: "secteurs", href: "/secteurs", label: "Par secteur", note: "la langue des ONG et des bailleurs" },
  ] as const;
  return (
    <nav className="vues-them" aria-label="Deux vues des vingt et une thématiques">
      <span className="vues-them-titre">Les vingt et une thématiques</span>
      {vues.map((v) => v.id === active
        ? <span key={v.id} className="vues-them-vue est-active" aria-current="page"><strong>{v.label}</strong><small>{v.note}</small></span>
        : <Link key={v.id} className="vues-them-vue" href={v.href}><strong>{v.label}</strong><small>{v.note}</small></Link>)}
    </nav>
  );
}
