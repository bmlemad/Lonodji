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
      <section className="detail-note">
        <span className="module-tag">Repères retrouvés</span>
        <h2>Une chronologie à reconstruire à partir des sources.</h2>
        <p>
          Une trace indexée de lonodji.org indique une reconnaissance formelle de l’association en 1995.
          Ce repère est conservé comme piste documentaire et doit être confronté aux documents officiels avant publication comme fait institutionnel.
        </p>
        <div className="status-list"><span>1995 — À CONFIRMER</span><span>ARCHIVES ORIGINALES À RETROUVER</span></div>
      </section>
      <section className="detail-note">
        <span className="module-tag">Premières initiatives retrouvées</span>
        <h2>Une mémoire d’action déjà plus concrète.</h2>
        <p>
          Une publication secondaire datée de 2021 rapporte, pour les années 2000, des forums de développement à Bédjondo et Bebopen, un verger au Lycée de Bédjondo et plusieurs initiatives liées à l’éducation et à l’eau. Ces éléments sont intégrés comme sources secondaires, pas comme validation institutionnelle.
        </p>
        <div className="detail-grid">
          <article><h3>Éducation</h3><p>Matériel didactique rapporté à l’École officielle de Bédjondo Kah, soutien à l’ECA de Bédjondo et don rapporté de 100 tables-bancs au Lycée de Bédjondo.</p></article>
          <article><h3>Eau</h3><p>Contribution rapportée au projet d’adduction d’eau potable de la Commune de Bédjondo et forage manuel rapporté à Bédjondo Kah.</p></article>
        </div>
        <div className="status-list"><span>SOURCE SECONDAIRE · 2021</span><span>PIÈCES ORIGINALES À RETROUVER</span></div>
      </section>
      <section className="detail-note">
        <span className="module-tag">Sources de reconstruction</span>
        <h2>Les traces sont conservées avec leur provenance.</h2>
        <p>Les éléments historiques ci-dessus proviennent de traces publiques secondaires ou d’indexations de l’ancien site. Ils servent à reconstruire les archives, sans se substituer aux documents originaux.</p>
        <div className="detail-grid">
          <article><h3>Trace de l’ancien site</h3><p>Une fiche d’indexation du 25 septembre 2026 décrit l’ancien lonodji.org, son ancrage à Bédjondo, quatre pôles d’action, 19 thèmes et huit appels publics.</p><a className="text-link" href="https://domainarrivals.com/issues/2026-09-25/" target="_blank" rel="noreferrer">Voir la source ↗</a></article>
          <article><h3>Témoignage documentaire</h3><p>Une publication de 2021 rapporte des initiatives de développement associées à ADEB-Lonodji à Bédjondo, dont des forums, un verger scolaire et des actions liées à l’eau.</p><a className="text-link" href="https://talouchoufoumagazine.wordpress.com/2021/05/02/actu-alladoum-desire-nandogongar-le-premier-tchadien-a-occuper-le-poste-de-superintendant-des-operations-directeur-usine-dans-le-monde-petrolier-depuis-2020/" target="_blank" rel="noreferrer">Voir la source ↗</a></article>
        </div>
      </section>
      <Link className="button primary" href="/programmes">Découvrir les programmes ↗</Link>
      <Link className="back-link" href="/">← Accueil</Link>
    </main>
  );
}
