import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparence",
  description: "Rapports, gouvernance et ressources publiques : l’espace de transparence d’ADEB Lonodji.",
  alternates: { canonical: "/transparence" },
};

const rules = [
  ["01", "Source primaire", "Document officiel, donnée institutionnelle ou archive directement attribuable."],
  ["02", "Source secondaire", "Publication externe utilisée avec attribution et vérification du contexte."],
  ["03", "Témoignage", "Parole publiée avec accord, identité ou statut précisé lorsque pertinent."],
  ["04", "À vérifier", "Information repérée mais non encore suffisamment établie pour être présentée comme un fait."],
];

export default function Transparence() {
  return <main id="main-content" className="detail-page"><p className="eyebrow">09 — Transparence</p><h1>Documenter nos<br/><em>engagements.</em></h1><p className="detail-lead">La transparence ne consiste pas seulement à publier : elle consiste à montrer l’origine, le contexte, la date et le statut des informations.</p><div className="detail-grid">{rules.map(([n,title,description])=><article key={n}><span>{n}</span><h2>{title}</h2><p>{description}</p></article>)}</div><section className="detail-note"><span className="module-tag">Méthode éditoriale</span><h2>Ce qui est connu, ce qui est sourcé, ce qui reste à vérifier.</h2><p>Les informations historiques, territoriales, financières et relatives aux actions seront distinguées selon leur niveau de preuve. Une source externe ne sera jamais présentée comme une validation officielle.</p><div className="status-list"><span>SOURCE PRIMAIRE</span><span>SOURCE SECONDAIRE</span><span>TÉMOIGNAGE</span><span>À VÉRIFIER</span></div></section><Link className="button primary" href="/#contact">Entrer en contact ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}
