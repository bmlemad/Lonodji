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
