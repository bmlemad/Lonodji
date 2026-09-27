import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Participer",
  description: "Découvrir les parcours de participation, d’initiative et de partenariat proposés par ADEB Lonodji.",
  alternates: { canonical: "/participer" },
};

export default function Participer() {
  return <main className="detail-page"><p className="eyebrow">04 — Participer</p><h1>Une place pour<br/><em>chaque contribution.</em></h1><p className="detail-lead">Les parcours sont prêts à accueillir les modalités officielles de participation dès qu’elles seront validées.</p><div className="detail-grid"><article><span>01</span><h2>Nous rejoindre</h2><p>Participer à la dynamique collective et contribuer selon ses possibilités.</p><small>Parcours à préciser</small></article><article><span>02</span><h2>Proposer une initiative</h2><p>Partager une idée, un projet ou un besoin à étudier.</p><small>Parcours à préciser</small></article><article><span>03</span><h2>Devenir partenaire</h2><p>Explorer une collaboration autour d’actions et de ressources utiles.</p><small>Parcours à préciser</small></article></div><Link className="button primary" href="/transparence">Voir la transparence ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}