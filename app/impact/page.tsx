import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impact",
  description: "Un espace destiné aux résultats vérifiés, projets documentés et témoignages authentifiés d’ADEB Lonodji.",
  alternates: { canonical: "/impact" },
};

export default function Impact() {
  return <main id="main-content" className="detail-page"><p className="eyebrow">06 — Impact</p><h1>Mesurer ce qui<br/><em>devient réel.</em></h1><p className="detail-lead">Cette rubrique accueillera des résultats vérifiés, des projets documentés et des témoignages authentifiés, sans chiffres fabriqués.</p><div className="detail-grid"><article><span>A</span><h2>Résultats</h2><p>Indicateurs et résultats vérifiables.</p><small>Résultat confirmé uniquement avec preuve</small></article><article><span>B</span><h2>Projets</h2><p>Objectifs, avancement, résultats et enseignements.</p><small>Statut et source requis</small></article><article><span>C</span><h2>Témoignages</h2><p>Paroles publiées avec accord et contexte.</p><small>Consentement et contexte requis</small></article></div><section className="detail-note"><span className="module-tag">Règle de publication</span><h2>La mesure vient après la preuve.</h2><p>Les chiffres, résultats et témoignages seront publiés avec leur période, leur périmètre, leur source et, lorsque nécessaire, une note méthodologique.</p><div className="status-list"><span>DONNÉE SOURCÉE</span><span>PÉRIMÈTRE INDIQUÉ</span><span>DATE INDIQUÉE</span><span>MÉTHODE DISPONIBLE</span></div></section><section className="detail-note"><span className="module-tag">Archives d’impact</span><h2>Avant de compter, retrouver ce qui a été fait.</h2><p>La reconstruction historique fait apparaître plusieurs pistes d’impact à documenter : développement local, éducation, eau et mobilisation communautaire. Elles ne sont pas présentées comme des résultats mesurés tant que les pièces originales, dates et périmètres ne sont pas réunis.</p><div className="status-list"><span>PIÈCE À RETROUVER</span><span>DATE À CONFIRMER</span><span>PÉRIMÈTRE À CONFIRMER</span><span>RÉSULTAT À MESURER</span></div></section><Link className="button primary" href="/transparence">Voir les règles de publication ↗</Link><Link className="back-link" href="/">← Accueil</Link></main>;
}
