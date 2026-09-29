import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "../../components/blocks";
import { LegacySections, Resume, Toc } from "../../components/legacy-content";
import LegacyEnhance from "../../components/legacy-enhance";
import { getPage, ogFor } from "../../lib/content";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Redevabilité, transparence et journal des corrections",
  description: "Réponse sous 48 heures, mécanisme de plainte, protection des enfants et des personnes vulnérables, charte d’écriture et journal daté des corrections.",
  alternates: { canonical: "/transparence" },
  openGraph: ogFor("/transparence"),
};

export default function Transparence() {
  const page = getPage("redevabilite");
  const corrections = page.sections.find((s) => s.id === "corrections");
  const nb = corrections ? (corrections.html.match(/class="info-card"/g) || []).length : 0;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="09 — Redevabilité & transparence"
        title="Une association qui demande des comptes"
        em="doit en rendre."
        lead={page.lede}
        pills={["Réponse sous 48 h ouvrées", "Plainte possible, même anonyme", `${nb} corrections datées`]}
      />
      <div className="legacy">
        <Resume items={page.resume} />
        <Toc items={page.toc} />
        <LegacySections sections={page.sections} />
      </div>
      <LegacyEnhance hasForms={page.forms.length > 0} />
      <section className="hub-section">
        <SectionHead eyebrow="Pour aller plus loin" title="Documents, mentions légales" em="et données personnelles." />
        <div className="link-list">
          <Link href="/transparence/decisions"><small>Registre</small><strong>Registre public des décisions</strong><span>Décidé, nommé, annoncé, proposé : chaque ligne datée, sourcée, avec ce qui reste attendu.</span></Link>
          <Link href="/documents"><small>Documents</small><strong>Ce que nous publions</strong><span>Kit d’adhésion, cahiers de terrain, plaidoyers ; statuts et PV dès validation.</span></Link>
          <Link href="/mentions-legales"><small>Mentions légales</small><strong>Éditeur, hébergeur, formulaires</strong><span>Notice de confidentialité réécrite formulaire par formulaire.</span></Link>
          <Link href="/dossiers/engagements"><small>Engagements</small><strong>Les douze promesses publiques</strong><span>Aucune n’est encore confirmée réalisée ; chacune est suivie.</span></Link>
        </div>
      </section>
      <Partager route="/transparence" titre="Redevabilité, transparence et journal des corrections" texte="Réponse sous 48 heures, mécanisme de plainte, protection des enfants et des personnes vulnérables, charte d’écriture et journal daté des corrections." />
    </main>
  );
}
