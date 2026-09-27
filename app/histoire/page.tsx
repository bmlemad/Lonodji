import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Histoire",
  description: "Repères historiques, mémoire collective et transmission autour d’ADEB Lonodji.",
  alternates: { canonical: "/histoire" },
};

const repères = [
  ["01", "Bédjondo", "Un ancrage territorial et culturel à préserver, relier et transmettre."],
  ["02", "Diaspora", "Des liens qui prolongent la communauté au-delà du territoire et facilitent la circulation des expériences."],
  ["03", "Mémoire", "Archives, récits et documents doivent permettre de comprendre ce qui a été fait avant de construire la suite."],
];

export default function Histoire() {
  return (
    <main id="main-content" className="detail-page">
      <p className="eyebrow">02 — Histoire</p>
      <h1>Une histoire à<br /><em>documenter et transmettre.</em></h1>
      <p className="detail-lead">
        L’identité d’ADEB Lonodji ne se limite pas à ses projets futurs. Elle s’inscrit dans une mémoire
        collective liée à Bédjondo, au patrimoine bedjond et aux liens entre territoire et diaspora.
      </p>
      <div className="detail-grid">
        {repères.map(([n, title, description]) => (
          <article key={n}><span>{n}</span><h2>{title}</h2><p>{description}</p></article>
        ))}
      </div>
      <section className="detail-note">
        <span className="module-tag">Archives & preuves</span>
        <h2>Faire de la mémoire une source, pas un décor.</h2>
        <p>
          Les dates, documents institutionnels, témoignages et repères historiques seront publiés
          progressivement avec leur source, leur contexte et leur statut de vérification.
        </p>
        <div className="status-list"><span>ARCHIVES À SOURCER</span><span>DATES À VÉRIFIER</span><span>TÉMOIGNAGES À CONTEXTUALISER</span></div>
      </section>
      <Link className="button primary" href="/programmes">Découvrir les programmes ↗</Link>
      <Link className="back-link" href="/">← Accueil</Link>
    </main>
  );
}
