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
  ["Forums de développement", "Une publication de 2021 rapporte que des membres fondateurs d’ADEB-Lonodji avaient organisé des forums sur le développement à Bédjondo et Bebopen dans les années 2000.", "SOURCE EXTERNE"],
  ["Verger du Lycée de Bédjondo", "La même publication rapporte l’existence d’un projet de verger au Lycée de Bédjondo parmi les initiatives de développement associées à cette période.", "SOURCE EXTERNE"],
  ["Adduction d’eau", "La source de 2021 rapporte également une contribution au projet d’adduction d’eau potable porté par la Commune de Bédjondo, ainsi qu’un forage manuel à Bédjondo Kah dans un cadre individuel.", "SOURCE EXTERNE"],
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
        <p>Plusieurs sources publiques permettent désormais de reconstruire une partie de l’historique d’ADEB-Lonodji. Elles sont conservées ici comme pistes documentaires : elles ne remplacent pas les archives originales ni une validation institutionnelle.</p>
        <div className="detail-grid">
          {archives.map(([title, description, status]) => (
            <article key={title}><h3>{title}</h3><p>{description}</p><span className="status">{status}</span></article>
          ))}
        </div>
      </section>
      <section className="detail-note">
        <span className="module-tag">Chaîne de preuve</span>
        <h2>Un fait, une source, un statut.</h2>
        <p>Chaque fiche distinguera le fait établi, la demande formulée, la démarche engagée, la réponse reçue et le résultat constaté. Une information externe ne deviendra pas un fait institutionnel sans vérification.</p>
        <div className="status-list"><span>À VÉRIFIER</span><span>DOCUMENTÉ</span><span>TRANSMIS</span><span>EN COURS</span><span>RÉSULTAT CONFIRMÉ</span></div>
      </section>
      <Link className="button primary" href="/transparence">Voir la méthode de transparence ↗</Link>
      <Link className="back-link" href="/">← Accueil</Link>
    </main>
  );
}
