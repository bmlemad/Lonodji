import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparence",
  description: "Rapports, gouvernance et ressources publiques : l’espace de transparence d’ADEB Lonodji.",
  alternates: { canonical: "/transparence" },
};

export default function Transparence() {
  return <main id="main-content" className="detail-page"><p className="eyebrow">09 — Transparence</p><h1>Documenter nos<br/><em>engagements.</em></h1><p className="detail-lead">Un espace dédié aux rapports, documents institutionnels, gouvernance et ressources, publiés lorsqu’ils sont disponibles et validés.</p><div className="detail-grid"><article><span>01</span><h2>Rapports</h2><p>Rapports d’activité et documents de résultats.</p><small>Espace en préparation</small></article><article><span>02</span><h2>Gouvernance</h2><p>Informations institutionnelles et organisationnelles.</p><small>Espace en préparation</small></article><article><span>03</span><h2>Ressources</h2><p>Documents utiles et références publiques.</p><small>Espace en préparation</small></article></div><Link className="button primary" href="/#contact">Entrer en contact ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}