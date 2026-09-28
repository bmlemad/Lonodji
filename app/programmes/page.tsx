import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead, Stats, ThematiqueRow } from "../../components/blocks";
import { LegacySections } from "../../components/legacy-content";
import LegacyEnhance from "../../components/legacy-enhance";
import { enLettres, filledCount, getIndex, getPage, ogFor, pickSections, thematiqueCount } from "../../lib/content";

export const metadata: Metadata = {
  title: "Nos actions — quatre pôles, dix-neuf thématiques",
  description: "Quatre pôles, dix-neuf thématiques et deux cellules transversales : coordonnateurs, objectifs et Objectifs de développement durable associés.",
  alternates: { canonical: "/programmes" },
  openGraph: ogFor("/programmes"),
};

export default function Programmes() {
  const idx = getIndex();
  const page = getPage("poles");
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const { poles, cellules } = idx.structure;
  const extra = pickSections(page, { only: ["nos-actions-page-par-page", "odd-cadrage", "odd-index", "devenir-coordonnateur-dune-thematique"] });
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="03 — Nos actions"
        title="Quatre pôles,"
        em="dix-neuf thématiques."
        lead={`Les Chantiers ADEB LONODJI : chaque thématique est animée par un coordonnateur, avance à son rythme et rend compte ici. ${enLettres(filled, true)} thématiques sont pourvues ; ${enLettres(total - filled)} cherchent encore la personne qui les portera.`}
      />
      <Stats items={[
        { value: String(poles.length), label: "pôles d’action", note: "Mémoire · Développement · Gouvernance · Numérique" },
        { value: String(total), label: "thématiques", note: "+ 2 cellules transversales" },
        { value: String(filled), label: "pourvues", note: `${Math.round((filled / total) * 100)} % des thématiques` },
        { value: String(total - filled), label: "à pourvoir", note: "candidatures ouvertes à tout membre" },
      ]} />
      <div className="section-actions" style={{ justifyContent: "flex-start", marginBottom: 40 }}>
        <Link className="button primary" href="/participer?coordo=1#contact">Proposer ma candidature <span aria-hidden="true">↗</span></Link>
        <Link className="button secondary" href="/dossiers/trouver-ma-thematique">Trouver ma thématique <span aria-hidden="true">→</span></Link>
        <Link className="text-link" href="/impact">Tableau de suivi <span aria-hidden="true">→</span></Link>
      </div>

      <div id="thematiques">
        {poles.map((pole) => (
          <section className="pole-block" id={pole.id} key={pole.id} aria-labelledby={`${pole.id}-titre`}>
            <header>
              <span className="pole-roman" aria-hidden="true">{pole.roman}</span>
              <div>
                <p className="eyebrow">{pole.eyebrow} · {pole.items.filter((t) => t.filled).length} pourvue{pole.items.filter((t) => t.filled).length > 1 ? "s" : ""} sur {pole.items.length}</p>
                <h2 id={`${pole.id}-titre`}>{pole.name}</h2>
                {pole.intro ? <p>{pole.intro}</p> : null}
              </div>
            </header>
            {pole.items.map((t) => <ThematiqueRow key={t.id} t={t} />)}
          </section>
        ))}
        {cellules ? (
          <section className="pole-block" id="cellules" aria-labelledby="cellules-titre">
            <header>
              <span className="pole-roman" aria-hidden="true">+</span>
              <div>
                <p className="eyebrow">{cellules.eyebrow}</p>
                <h2 id="cellules-titre">{cellules.name}</h2>
                {cellules.intro ? <p>{cellules.intro}</p> : null}
              </div>
            </header>
            {cellules.items.map((t) => <ThematiqueRow key={t.id} t={t} />)}
          </section>
        ) : null}
      </div>

      <section className="hub-section">
        <SectionHead eyebrow="Pour aller plus loin" title="Comment ça fonctionne," em="et où chaque pôle agit." text="Les pages qui suivent viennent de la première version du site et restent la référence : devenir coordonnateur, la lecture par les Objectifs de développement durable, et les dossiers ouverts par chaque pôle." />
        <div className="legacy">
          <LegacySections sections={extra} />
        </div>
        <LegacyEnhance hasForms={page.forms.length > 0} />
      </section>
    </main>
  );
}
