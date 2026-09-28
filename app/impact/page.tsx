import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import { LegacySections } from "../../components/legacy-content";
import { filledCount, getIndex, getPage, thematiqueCount } from "../../lib/content";

export const metadata: Metadata = {
  title: "Suivi des actions et tableau de bord",
  description: "Le tableau de bord : ce qui est documenté, publié, envoyé et ce qui attend une compétence, thématique par thématique, sans chiffre fabriqué.",
  alternates: { canonical: "/impact" },
};

export default function Impact() {
  const idx = getIndex();
  const page = getPage("suivi");
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const sent = idx.plaidoyers.filter((p) => !/à envoyer/i.test(p.sent)).length;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="06 — Suivi & tableau de bord"
        title="Mesurer ce qui"
        em="devient réel."
        lead={page.lede || "Ce tableau relie chaque problématique documentée à sa thématique et, quand il existe, à son dossier de plaidoyer. Il dit ce qui est fait, ce qui est publié, ce qui est envoyé, et où une compétence changerait la donne."}
      />
      <Stats items={[
        { value: String(idx.plaidoyers.length), label: "dossiers publiés", note: "7 plaidoyers + 1 note à la commune" },
        { value: String(sent), label: "envoyés", note: sent === 0 ? "tous restent à envoyer officiellement" : "envoi officiel confirmé" },
        { value: `${filled}/${total}`, label: "thématiques pourvues", note: "coordonnateur nommé" },
        { value: String(idx.articles.length), label: "articles du journal", note: "depuis le 11 septembre 2026" },
      ]} />
      <div className="notice">
        <strong>Règle de publication.</strong> Aucun résultat n’est annoncé sans preuve : un chiffre paraît avec sa période, son périmètre, sa source et sa méthode. Ce qui n’est pas encore réalisé est écrit comme tel.
      </div>
      <div className="legacy">
        <LegacySections sections={page.sections} />
      </div>
      <section className="hub-section">
        <SectionHead eyebrow="Et ensuite" title="Les preuves viendront" em="des dossiers eux-mêmes." text="Résultats vérifiés, projets documentés et témoignages authentifiés seront publiés ici, dossier par dossier, avec leur source. En attendant, les engagements publics et le journal des corrections disent ce que nous promettons et ce que nous rectifions." />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/dossiers/engagements">Nos engagements publics <span aria-hidden="true">↗</span></Link>
          <Link className="button secondary" href="/transparence#corrections">Journal des corrections <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
