import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Archives",
  description: "Reconstruction documentaire de l’ancienne version de lonodji.org et des traces historiques d’ADEB Lonodji.",
  alternates: { canonical: "/archives" },
};

const facts = [
  ["1995", "Reconnaissance annoncée", "Une fiche d’indexation de l’ancien lonodji.org décrit une reconnaissance formelle de l’association en 1995. Repère à confirmer par un document primaire."],
  ["4", "Pôles d’action", "La même trace décrit quatre pôles d’action. Les intitulés originaux des pôles n’ont pas encore été retrouvés."],
  ["19", "Thèmes", "La trace indique 19 thèmes répartis dans ces pôles. Les 19 intitulés originaux restent à récupérer."],
  ["8", "Appels publics", "La trace mentionne huit appels publics, notamment autour de l’eau, de l’électricité, des routes et de la santé, avec une logique annoncée de sources, quantification, destinataires et suivi."],
];

const initiatives = [
  ["Forums de développement", "Une publication de 2021 rapporte des forums organisés à Bédjondo et Bebopen dans les années 2000."],
  ["Verger scolaire", "La même publication rapporte un verger au Lycée de Bédjondo."],
  ["Éducation", "Sont rapportés un soutien en matériel didactique à l’École officielle de Bédjondo Kah et un don de ballons ainsi qu’une assistance financière à l’ECA de Bédjondo."],
  ["100 tables-bancs", "La publication rapporte qu’Esso Tchad avait accepté de donner 100 tables-bancs au Lycée de Bédjondo sur proposition d’un membre fondateur."],
  ["Eau potable", "La publication rapporte une contribution au projet d’adduction d’eau potable porté par la Commune de Bédjondo et un forage manuel à Bédjondo Kah dans un cadre individuel."],
];

export default function Archives() {
  return (
    <main id="main-content" className="detail-page">
      <p className="eyebrow">Archives — reconstruction documentaire</p>
      <h1>Retrouver l’ancien site,<br /><em>sans réécrire l’histoire.</em></h1>
      <p className="detail-lead">Cette page rassemble les éléments historiques actuellement retrouvés. Elle ne prétend pas être une copie de l’ancien lonodji.org : elle constitue une reconstruction documentée, avec le niveau de preuve associé à chaque élément.</p>

      <section className="detail-note">
        <span className="module-tag">Trace de l’ancien site</span>
        <h2>Une empreinte publique datée du 25 septembre 2026.</h2>
        <p>Une fiche d’indexation de Domain Arrivals décrit l’ancien lonodji.org comme le site d’une association tchadienne réunissant des habitants de Bédjondo et la diaspora autour du patrimoine bedjond, du développement communautaire et du plaidoyer public.</p>
        <div className="status-list"><span>TRACE EXTERNE</span><span>OBSERVÉE LE 25.09.2026</span><span>ARCHIVE ORIGINALE À RETROUVER</span></div>
      </section>

      <div className="detail-grid">
        {facts.map(([value,title,description]) => (
          <article key={title}><span>{value}</span><h2>{title}</h2><p>{description}</p></article>
        ))}
      </div>

      <section className="detail-note">
        <span className="module-tag">Initiatives historiques rapportées</span>
        <h2>Les premières pièces du récit d’action.</h2>
        <p>Une publication secondaire de 2021, consacrée à Alladoum Désiré Nandogongar, indique qu’il était membre fondateur d’ADEB-Lonodji et rapporte plusieurs initiatives de développement associées à l’association dans les années 2000.</p>
        <div className="detail-grid">
          {initiatives.map(([title,description]) => (
            <article key={title}><h3>{title}</h3><p>{description}</p><span className="status">SOURCE SECONDAIRE · 2021</span></article>
          ))}
        </div>
      </section>

      <section className="detail-note">
        <span className="module-tag">Ce qui reste à retrouver</span>
        <h2>Les pages originales et les pièces de preuve.</h2>
        <div className="detail-grid">
          <article><h3>Les 19 thèmes</h3><p>Retrouver les intitulés exacts et leur classement dans les quatre pôles.</p></article>
          <article><h3>Les 8 appels</h3><p>Retrouver les textes, dates, destinataires, données et suivis individuels.</p></article>
          <article><h3>Les documents primaires</h3><p>Retrouver statuts, récépissés, rapports, correspondances, photographies et pièces de projet lorsque disponibles.</p></article>
          <article><h3>La version visuelle</h3><p>Retrouver captures, pages et médias de l’ancien site pour distinguer la mémoire éditoriale de sa reconstruction actuelle.</p></article>
        </div>
      </section>

      <section className="detail-note">
        <span className="module-tag">Sources</span>
        <h2>Consulter les traces utilisées.</h2>
        <div className="detail-grid">
          <article><h3>Domain Arrivals · 25 septembre 2026</h3><p>Fiche d’indexation contenant le résumé de l’ancien lonodji.org et les repères 1995 / 4 pôles / 19 thèmes / 8 appels.</p><a className="text-link" href="https://domainarrivals.com/issues/2026-09-25/" target="_blank" rel="noreferrer">Consulter la source ↗</a></article>
          <article><h3>Talou-Choufou Magazine · 2 mai 2021</h3><p>Publication secondaire rapportant plusieurs initiatives de développement associées à ADEB-Lonodji à Bédjondo.</p><a className="text-link" href="https://talouchoufoumagazine.wordpress.com/2021/05/02/actu-alladoum-desire-nandogongar-le-premier-tchadien-a-occuper-le-poste-de-superintendant-des-operations-directeur-usine-dans-le-monde-petrolier-depuis-2020/" target="_blank" rel="noreferrer">Consulter la source ↗</a></article>
        </div>
      </section>

      <Link className="button primary" href="/histoire">Retour à l’histoire ↗</Link>
      <Link className="back-link" href="/">← Accueil</Link>
    </main>
  );
}
