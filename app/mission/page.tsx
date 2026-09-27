import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mission",
  description: "La mission d’ADEB Lonodji : contribuer, apprendre et transmettre à travers une culture de l’engagement.",
  alternates: { canonical: "/mission" },
};

export default function Mission() {
  return <main id="main-content" className="detail-page"><p className="eyebrow">01 — Mission</p><h1>Donner du sens à<br/><em>l’action collective.</em></h1><p className="detail-lead">ADEB Lonodji veut créer un cadre où chacun peut contribuer, apprendre et transmettre à travers des initiatives utiles et une culture de l’engagement.</p><div className="detail-grid"><article><span>01</span><h2>Contribuer</h2><p>Créer des occasions concrètes de participation et d’initiative.</p></article><article><span>02</span><h2>Apprendre</h2><p>Favoriser la circulation des savoirs, des expériences et des compétences.</p></article><article><span>03</span><h2>Transmettre</h2><p>Faire vivre les valeurs et les apprentissages dans le temps.</p></article></div><Link className="button primary" href="/#programmes">Voir les programmes ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}