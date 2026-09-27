import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Actions",
  description: "Actions, enjeux territoriaux et plaidoyer documenté d’ADEB Lonodji.",
  alternates: { canonical: "/actions" },
};

const domaines = [
  ["01", "Eau", "Besoins, initiatives et résultats à documenter avec sources et dates."],
  ["02", "Électricité", "Suivi des enjeux, démarches et avancées lorsqu’elles sont vérifiables."],
  ["03", "Santé", "Informations territoriales, projets et actions documentés."],
  ["04", "Routes & infrastructures", "Problématiques, projets et état d’avancement présentés avec contexte."],
];

const archives = [
  ["Quatre pôles / 19 thèmes", "Une trace indexée de lonodji.org décrit une organisation des actions en quatre pôles couvrant 19 thèmes. Le détail des quatre pôles et des 19 thèmes reste à récupérer et à valider à partir des archives originales.", "À CONFIRMER"],
  ["Huit appels publics", "La même trace mentionne huit appels publics portant notamment sur l’eau, l’électricité, les routes et la santé, présentés comme sourcés, quantifiés, adressés à des destinataires identifiés et suivis publiquement.", "SOURCE EXTERNE"],
  ["Forums de développement", "Une publication de 2021 rapporte que des membres fondateurs d’ADEB-Lonodji avaient organisé des forums sur le développement à Bédjondo et Bebopen dans les années 2000.", "SOURCE SECONDAIRE"],
  ["Verger du Lycée de Bédjondo", "La même publication de 2021 rapporte l’existence d’un verger au Lycée de Bédjondo parmi les initiatives de développement associées à cette période.", "SOURCE SECONDAIRE"],
  ["Éducation", "La publication de 2021 rapporte un soutien individuel à l’École officielle de Bédjondo Kah avec du matériel didactique, ainsi qu’un don de ballons et une assistance financière à l’ECA de Bédjondo.", "SOURCE SECONDAIRE"],
  ["100 tables-bancs", "La publication de 2021 rapporte que, sur proposition d’un membre fondateur, Esso Tchad avait accepté de donner 100 tables-bancs au Lycée de Bédjondo.", "SOURCE SECONDAIRE"],
  ["Adduction d’eau", "La source de 2021 rapporte une contribution au projet d’adduction d’eau potable porté par la Commune de Bédjondo, ainsi qu’un forage manuel à Bédjondo Kah dans un cadre individuel.", "SOURCE SECONDAIRE"],
];

export default function Actions() {
  return (
    <main id="main-content" className="detail-page">
      <p className="eyebrow">05 — Actions</p>
      <h1>Du constat à<br /><em>la preuve de l’action.</em></h1>
      <p className="detail-lead">Cet espace reconnecte l’engagement à des sujets concrets. Chaque action pourra être suivie par son objet, son territoire, ses parties prenantes, ses sources et son état d’avancement.</p>
      <div className="detail-grid">
        {domaines.map(([n, title, description]) => (
          <article key={n}><span>{n}</span><h2>{title}</h2><p>{description}</p><span className="status">À vérifier</span></article>
        ))}
      </div>
      <section className="detail-note">
        <span className="module-tag">Archives retrouvées</span>
        <h2>Des traces existent. Nous les transformons en dossiers vérifiables.</h2>
        <p>Les éléments ci-dessous sont des pistes documentaires. La fiche d’indexation de l’ancien site constitue une source externe ; les initiatives rapportées en 2021 proviennent d’une publication secondaire. Aucune de ces sources ne remplace les archives originales de l’association.</p>
        <div className="detail-grid">
          {archives.map(([title, description, status]) => (
            <article key={title}><h3>{title}</h3><p>{description}</p><span className="status">{status}</span></article>
          ))}
        </div>
      </section>
      <section className="detail-note">
        <span className="module-tag">Matrice de reconstruction</span>
        <h2>Les 19 thèmes seront reconstitués un par un.</h2>
        <p>La source retrouvée donne le nombre total de thèmes, mais pas leur inventaire. Pour éviter toute reconstruction spéculative, chaque thème sera ajouté uniquement lorsqu’un intitulé, un document ou une trace attribuable pourra être retrouvé.</p>
        <div className="detail-grid">
          <article><span>01</span><h3>Inventaire</h3><p>Retrouver l’intitulé exact dans les anciennes pages ou documents.</p></article>
          <article><span>02</span><h3>Contexte</h3><p>Identifier le territoire, la période et le problème traité.</p></article>
          <article><span>03</span><h3>Appel</h3><p>Retrouver le texte, le destinataire, les données et la date lorsque disponibles.</p></article>
          <article><span>04</span><h3>Suivi</h3><p>Rechercher réponses, démarches, résultats et pièces justificatives.</p></article>
        </div>
        <div className="status-list"><span>0 / 19 INTITULÉS RECOPIÉS</span><span>8 / 8 APPELS IDENTIFIÉS PAR LEUR EXISTENCE</span><span>TEXTES ORIGINAUX À RETROUVER</span></div>
      </section>
      <section className="detail-note">
        <span className="module-tag">Chaîne de preuve</span>
        <h2>Un fait, une source, un statut.</h2>
        <p>Chaque action distinguera le fait établi, la demande formulée, la démarche engagée, la réponse reçue et le résultat constaté. Une information externe ne deviendra pas un fait institutionnel sans vérification.</p>
        <div className="status-list"><span>À VÉRIFIER</span><span>DOCUMENTÉ</span><span>TRANSMIS</span><span>EN COURS</span><span>RÉSULTAT CONFIRMÉ</span></div>
      </section>
      <Link className="button primary" href="/archives">Consulter les archives ↗</Link>
      <Link className="button secondary" href="/transparence">Voir la méthode de transparence ↗</Link>
      <Link className="back-link" href="/">← Accueil</Link>
    </main>
  );
}
