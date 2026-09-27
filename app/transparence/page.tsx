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
  return <main id="main-content" className="detail-page"><p className="eyebrow">09 — Transparence</p><h1>Documenter nos<br/><em>engagements.</em></h1><p className="detail-lead">La transparence ne consiste pas seulement à publier : elle consiste à montrer l’origine, le contexte, la date et le statut des informations.</p><div className="detail-grid">{rules.map(([n,title,description])=><article key={n}><span>{n}</span><h2>{title}</h2><p>{description}</p></article>)}</div><section className="detail-note"><span className="module-tag">Méthode éditoriale</span><h2>Ce qui est connu, ce qui est sourcé, ce qui reste à vérifier.</h2><p>Les informations historiques, territoriales, financières et relatives aux actions seront distinguées selon leur niveau de preuve. Une source externe ne sera jamais présentée comme une validation officielle.</p><div className="status-list"><span>SOURCE PRIMAIRE</span><span>SOURCE SECONDAIRE</span><span>TÉMOIGNAGE</span><span>À VÉRIFIER</span></div></section><section className="detail-note"><span className="module-tag">Reconstruction 2026</span><h2>Ce que les archives permettent — et ne permettent pas encore — d’établir.</h2><p>Une trace publique de l’ancien lonodji.org, observée le 25 septembre 2026, décrit ADEB Lonodji comme une association tchadienne liée à Bédjondo et mentionne une reconnaissance annoncée en 1995, quatre pôles d’action, 19 thèmes et huit appels publics. Le détail des 19 thèmes et les textes individuels des huit appels ne sont pas encore accessibles dans les résultats indexés.</p><div className="status-list"><span>RÉSUMÉ RETROUVÉ</span><span>19 THÈMES — À RETROUVER</span><span>8 APPELS — À RETROUVER</span><span>ARCHIVES ORIGINALES RECHERCHÉES</span></div></section><section className="detail-note"><span className="module-tag">Filtre documentaire</span><h2>Ne pas confondre les homonymes.</h2><p>Les recherches font apparaître plusieurs organisations et initiatives portant le nom Lonodji, notamment au Cameroun. Elles sont exclues de la reconstruction ADEB Lonodji lorsqu’aucun lien avec Bédjondo et l’association tchadienne n’est établi.</p></section><Link className="button primary" href="/#contact">Entrer en contact ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}
