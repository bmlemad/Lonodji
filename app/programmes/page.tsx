import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Les trois axes d’action d’ADEB Lonodji : transmission, engagement et communauté.",
  alternates: { canonical: "/programmes" },
};

const items = [
  ["01", "Transmission", "Créer des espaces où les savoirs, les expériences et les valeurs circulent."],
  ["02", "Engagement", "Rassembler les énergies autour d’initiatives utiles et structurées."],
  ["03", "Communauté", "Faire grandir un réseau solidaire, ouvert et tourné vers l’avenir."],
];

export default function Programmes() {
  return <main id="main-content" className="detail-page"><p className="eyebrow">03 — Programmes</p><h1>Trois axes.<br /><em>Une même direction.</em></h1><p className="detail-lead">Les programmes structurent l’action. Les projets, partenaires et résultats seront publiés ici à mesure qu’ils seront validés et documentés.</p><div className="detail-grid">{items.map(([n, title, description]) => (<article key={n}><span>{n}</span><h2>{title}</h2><p>{description}</p><small>Contenu détaillé à venir</small></article>))}</div><Link className="button primary" href="/#territoire">Explorer le territoire ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}