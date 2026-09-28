import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead, Stats, ThematiqueRow } from "../../components/blocks";
import { LegacySections } from "../../components/legacy-content";
import LegacyEnhance from "../../components/legacy-enhance";
import { directionsCount, enLettres, filledCount, getIndex, getPage, ogFor, pickSections, thematiqueCount } from "../../lib/content";

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
  const dir = directionsCount(idx);
  const extra = pickSections(page, { only: ["nos-actions-page-par-page", "odd-cadrage", "odd-index", "devenir-coordonnateur-dune-thematique"] });
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="03 — Nos actions"
        title="Quatre pôles,"
        em="dix-neuf thématiques."
        lead={`Les Chantiers ADEB LONODJI : chaque pôle est dirigé par un directeur ou une directrice de pôle, au rang de chef de projet ; chaque thématique est animée par un coordonnateur ou une coordonnatrice, avance à son rythme et rend compte ici. ${enLettres(filled, true)} thématiques sont pourvues ; ${enLettres(total - filled)} cherchent encore la personne qui les portera, et les ${enLettres(dir.total - dir.pourvues)} directions de pôle sont à pourvoir.`}
      />
      <Stats items={[
        { value: String(poles.length), label: "pôles d’action", note: "Mémoire · Développement · Gouvernance · Numérique" },
        { value: String(total), label: "thématiques", note: "+ 2 cellules transversales" },
        { value: String(filled), label: "pourvues", note: `${Math.round((filled / total) * 100)} % des thématiques` },
        { value: String(total - filled), label: "à pourvoir", note: "candidatures ouvertes à tout membre" },
        { value: `${dir.pourvues}/${dir.total}`, label: "directions de pôle", note: "rang de chef de projet · à pourvoir" },
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
                {pole.direction ? (
                  <p className="pole-direction">
                    <span className={pole.direction.filled ? "status" : "status status--vacant"}>{pole.direction.filled ? "Pourvue" : "À pourvoir"}</span>
                    <span><strong>Direction du pôle</strong> · {pole.direction.rang} · {pole.direction.filled ? pole.direction.name : <Link href={`/participer?direction=${pole.roman}&coordo=1#contact`}>candidater à la direction de ce pôle</Link>}</span>
                  </p>
                ) : null}
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

      <section className="hub-section" id="diriger-un-pole">
        <SectionHead eyebrow="Diriger un pôle" title="Quatre directions de pôle," em="au rang de chef de projet." text="Depuis le 28 septembre 2026, chaque pôle a une direction, distincte de la coordination des thématiques. Le directeur ou la directrice de pôle a rang de chef de projet : il anime les coordonnateurs de ses thématiques, tient le plan d’action et le calendrier du pôle, suit les plaidoyers et les projets qui en relèvent, et rend compte au bureau et à l’assemblée. Les quatre postes sont ouverts à tout membre." />
        <div className="detail-grid">
          {poles.map((pole) => (
            <article key={pole.id}>
              <span>{pole.eyebrow} · {pole.items.length} thématiques</span>
              <h3>{pole.name}</h3>
              <p>{pole.direction?.filled ? `Direction : ${pole.direction.name}.` : "Direction à pourvoir. Le pôle avance déjà par ses thématiques ; il manque la personne qui les tient ensemble."}</p>
              {!pole.direction?.filled ? <Link className="text-link" href={`/participer?direction=${pole.roman}&coordo=1#contact`}>Candidater <span aria-hidden="true">→</span></Link> : null}
            </article>
          ))}
        </div>
      </section>

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
