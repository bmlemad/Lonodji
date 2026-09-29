import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "../../components/blocks";
import { LegacySections } from "../../components/legacy-content";
import TableauDeBord from "../../components/tableau-de-bord";
import { getPage, ogFor } from "../../lib/content";
import { getIndicateurs } from "../../lib/indicateurs";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Tableau de bord d’impact et suivi des actions",
  description: "Adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets : six indicateurs datés et sourcés, puis le suivi thématique par thématique.",
  alternates: { canonical: "/impact", languages: { fr: "/impact", en: "/en/impact" } },
  openGraph: ogFor("/impact"),
};

export default function Impact() {
  const page = getPage("suivi");
  const indicateurs = getIndicateurs();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="06 — Suivi & tableau de bord"
        title="Mesurer ce qui"
        em="devient réel."
        lead="Six indicateurs d’impact, datés et sourcés, que le plan d’action 2026-2028 nous engage à publier. Puis, thématique par thématique, ce qui est documenté, publié, envoyé — et où une compétence changerait la donne. Ce qui n’est pas encore réalisé est écrit comme tel."
      />
      <TableauDeBord donnees={indicateurs} />
      <div className="notice">
        <strong>Règle de publication.</strong> Aucun résultat n’est annoncé sans preuve : un chiffre paraît avec sa période, son périmètre, sa source et sa méthode. Ce qui n’est pas encore réalisé est écrit comme tel.
      </div>
      <div className="legacy" id="suivi-thematique">
        <LegacySections sections={page.sections} />
      </div>
      <section className="hub-section">
        <SectionHead eyebrow="Et ensuite" title="Les preuves viendront" em="des dossiers eux-mêmes." text="Résultats vérifiés, projets documentés et témoignages authentifiés seront publiés ici, dossier par dossier, avec leur source. En attendant, les engagements publics et le journal des corrections disent ce que nous promettons et ce que nous rectifions." />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/dossiers/engagements">Nos engagements publics <span aria-hidden="true">↗</span></Link>
          <Link className="button secondary" href="/transparence#corrections">Journal des corrections <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <Partager route="/impact" titre="Tableau de bord d’impact et suivi des actions" texte="Adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets : six indicateurs datés et sourcés, puis le suivi thématique par thématique." />
    </main>
  );
}
