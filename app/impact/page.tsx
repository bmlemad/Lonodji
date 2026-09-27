import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impact",
  description: "Un espace destiné aux résultats vérifiés, projets documentés et témoignages authentifiés d’ADEB Lonodji.",
  alternates: { canonical: "/impact" },
};

const historicalLeads = [
  ["Éducation", "Soutien rapporté à l’École officielle de Bédjondo Kah, à l’ECA de Bédjondo et don rapporté de 100 tables-bancs au Lycée de Bédjondo.", "Source secondaire · 2021"],
  ["Eau", "Contribution rapportée au projet d’adduction d’eau potable de la Commune de Bédjondo et forage manuel rapporté à Bédjondo Kah.", "Source secondaire · 2021"],
  ["Développement local", "Forums de développement rapportés à Bédjondo et Bebopen, ainsi qu’un verger rapporté au Lycée de Bédjondo.", "Source secondaire · 2021"],
  ["Mobilisation", "L’ancien site est décrit dans une trace indexée comme publiant huit appels sur des sujets tels que l’eau, l’électricité, les routes et la santé.", "Trace externe · 2026"],
];

export default function Impact() {
  return (
    <main id="main-content" className="detail-page">
      <p className="eyebrow">06 — Impact</p>
      <h1>Mesurer ce qui<br/><em>devient réel.</em></h1>
      <p className="detail-lead">Cette rubrique accueillera des résultats vérifiés, des projets documentés et des témoignages authentifiés, sans chiffres fabriqués.</p>
      <div className="detail-grid">
        <article><span>A</span><h2>Résultats</h2><p>Indicateurs et résultats vérifiables.</p><small>Résultat confirmé uniquement avec preuve</small></article>
        <article><span>B</span><h2>Projets</h2><p>Objectifs, avancement, résultats et enseignements.</p><small>Statut et source requis</small></article>
        <article><span>C</span><h2>Témoignages</h2><p>Paroles publiées avec accord et contexte.</p><small>Consentement et contexte requis</small></article>
      </div>
      <section className="detail-note">
        <span className="module-tag">Pistes historiques</span>
        <h2>Des initiatives sont documentées, leurs résultats restent à mesurer.</h2>
        <p>Une publication de 2021 rapporte plusieurs initiatives associées à ADEB-Lonodji dans les années 2000. Elles sont conservées comme pistes historiques et ne sont pas transformées en indicateurs d’impact sans pièces originales, dates, périmètres et méthode de mesure.</p>
        <div className="detail-grid">
          {historicalLeads.map(([title, description, source]) => (
            <article key={title}><h3>{title}</h3><p>{description}</p><span className="status">{source}</span></article>
          ))}
        </div>
      </section>
      <section className="detail-note">
        <span className="module-tag">Règle de publication</span>
        <h2>La mesure vient après la preuve.</h2>
        <p>Les chiffres, résultats et témoignages seront publiés avec leur période, leur périmètre, leur source et, lorsque nécessaire, une note méthodologique.</p>
        <div className="status-list"><span>DONNÉE SOURCÉE</span><span>PÉRIMÈTRE INDIQUÉ</span><span>DATE INDIQUÉE</span><span>MÉTHODE DISPONIBLE</span></div>
      </section>
      <Link className="button primary" href="/archives">Voir la reconstruction historique ↗</Link>
      <Link className="back-link" href="/">← Accueil</Link>
    </main>
  );
}
