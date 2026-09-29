import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader } from "../../components/blocks";
import RedactionApp from "../../components/redaction-app";
import { getIndex } from "../../lib/content";

export const metadata: Metadata = {
  title: "Espace de rédaction",
  description: "Espace privé de rédaction des articles du journal d’ADEB LONODJI.",
  alternates: { canonical: "/redaction" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/* Espace privé (noindex) : écriture des articles en brouillon, aperçu dans le
   style réel du site, rubrique et statut. La publication reste une décision
   éditoriale prise à part : un brouillon « prêt » est exporté puis intégré au
   journal. Rien ici n'est visible des lecteurs. */
export default function Redaction() {
  const rubriques = getIndex().journalCategories.filter((c) => c.slug !== "all");
  return (
    <main id="main-content" className="hub-page rd-page">
      <PageHeader
        eyebrow="Espace privé · rédaction"
        title="Écrire pour le journal,"
        em="relire, puis publier."
        lead="Réservé à la rédaction. Les brouillons s’enregistrent d’eux-mêmes et restent privés jusqu’à leur intégration au journal. Une erreur de fait se corrige toujours à découvert : voir la charte d’écriture."
      />
      <RedactionApp rubriques={rubriques} />
      <p className="lg-footnote">Publier : exporter le brouillon « prêt » (.md) et le transmettre à la rédaction — il est intégré au journal par <code>scripts/publier-article.py</code>, puis mis en ligne. Cette page n’est pas indexée par les moteurs de recherche. <Link href="/transparence#charte-ecriture">Charte d’écriture</Link> · <Link href="/journal">Le journal</Link></p>
    </main>
  );
}
