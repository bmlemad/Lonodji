import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "../../../components/blocks";
import { ogFor } from "../../../lib/content";
import { getIndicateurs } from "../../../lib/indicateurs";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Impact dashboard — six dated, sourced indicators (in English)",
  description: "Members, coordinators, advocacy briefs, needs recorded and solved, active projects: six indicators, dated and sourced, plus what the site produces and receives. Zeros are published as zeros.",
  alternates: { canonical: "/en/impact", languages: { fr: "/impact", en: "/en/impact" } },
  openGraph: { ...ogFor("/en/impact", "en"), title: "Impact dashboard — six dated, sourced indicators", description: "Members, coordinators, advocacy, needs, projects: dated and sourced. Zeros are published as zeros." },
};

const nf = new Intl.NumberFormat("en-GB");

export default function ImpactEn() {
  const i = getIndicateurs();
  const c = i.contenu;
  const f = i.formulaires;
  const adhesions = f.comptes["intention-adhesion"] as { envois: number; personnes?: number } | undefined;
  const vacantes = c.coordinations.total - c.coordinations.pourvues;
  return (
    <main id="main-content" className="hub-page" lang="en">
      <PageHeader
        eyebrow="Follow-up · dashboard · in English"
        title="Six indicators,"
        em="none of them made up."
        lead="What the association counts, how, and since when. Content figures are counted in the pages themselves at each release; form figures are read on the platform that receives them, after test entries are removed. What only the board holds — paid-up members, needs actually solved — is not estimated: it appears here, dated, when the board transmits it. Until then the figure is zero, and it says so."
        crumbs={[{ label: "In English", href: "/en/index" }, { label: "Dashboard" }]}
        pills={[`Content as of ${c.carte.genere}`, `Forms read on ${f.date}`, "Zeros published as zeros"]}
      />
      <Stats items={[
        { value: adhesions?.personnes != null ? String(adhesions.personnes) : "0", label: "people declared an intention to join", note: `${adhesions?.envois ?? 0} membership forms received; paid-up members are counted by the board and will appear here, dated` },
        { value: `${c.coordinations.pourvues}/${c.coordinations.total}`, label: "themes with a coordinator", note: `${vacantes} themes and ${c.coordinations.cellulesTotal - c.coordinations.cellulesPourvues} cross-cutting unit still look for their person; the four pole directions (project-manager rank) are open` },
        { value: String(c.plaidoyers.publies), label: "advocacy briefs published", note: `${c.plaidoyers.envoyes} officially sent, ${c.plaidoyers.reponses} answers received; recipients named in each brief` },
        { value: String(c.problematiques.total), label: "issues and needs recorded", note: `${c.problematiques.documentees} documented, ${c.problematiques.partielles} partly, ${c.problematiques.inconnues} unknown; ${c.problematiques.chantiersPrioritaires} priority works` },
        { value: String(i.bureau.besoinsResolus ?? 0), label: "needs confirmed solved", note: "nothing is counted here without dated evidence" },
        { value: String(c.projets.actifs), label: "active projects", note: `${c.projets.annonces} more announced, under study or proposed; ${c.projets.finances} funded` },
      ]} />

      <section className="hub-section" id="produces">
        <SectionHead eyebrow="What the site produces" title="Counted in the pages," em="at each release." />
        <div className="link-list">
          <Link href="/journal" hrefLang="fr"><small>Journal</small><strong>{c.articles} articles</strong><span>dated and sourced, since {c.premierArticle}; two newsletters</span></Link>
          <Link href="/documents" hrefLang="fr"><small>Documents</small><strong>{c.documentsPdf} PDF</strong><span>{c.documentsAnnonces} announced, to come: statutes, receipt, minutes, accounts</span></Link>
          <Link href="/transparence#corrections" hrefLang="fr"><small>Accountability</small><strong>{c.corrections} corrections</strong><span>each one published and dated in the corrections log</span></Link>
          <Link href="/dossiers/engagements" hrefLang="fr"><small>Commitments</small><strong>{c.engagements.total} public commitments</strong><span>{c.engagements.realises} confirmed fulfilled</span></Link>
          <Link href="/en/villages"><small>Territory</small><strong>{nf.format(c.carte.localites)} localities mapped</strong><span>{c.carte.unites} units, {nf.format(c.carte.localitesNommees)} named, {c.carte.equipements} known facilities</span></Link>
          <Link href="/en/projects"><small>Projects</small><strong>{c.projets.actifs + c.projets.annonces} projects described</strong><span>each with its stage, what is missing and how to contribute</span></Link>
        </div>
      </section>

      <section className="hub-section" id="method">
        <SectionHead eyebrow="How these figures are made" title="Counted, not estimated." />
        <div className="detail-grid">
          <article><h3>Content</h3><p>Briefs, articles, documents, corrections, coordinations and localities are counted in the pages themselves when the site is built: a figure changes when a page changes, never by hand.</p></article>
          <article><h3>Forms</h3><p>Submissions are counted on the platform that receives them, after removing test entries; one person sending twice counts once. No personal data leaves the inbox. Method of the last reading: {f.methode}</p></article>
          <article><h3>What the board holds</h3><p>{i.bureau.note}</p></article>
        </div>
        <Partager route="/en/impact" titre="Impact dashboard" texte="Members, coordinators, advocacy briefs, needs recorded and solved, active projects: six indicators, dated and sourced, plus what the site produces and receives. Zeros are published as zeros." lang="en" />
        <p className="lg-footnote">Same figures as the French dashboard (<Link href="/impact" hrefLang="fr">Tableau de bord d’impact</Link>), read from the same file at the same release. The four pole directions and the sixth ODEB programme are described in French on <Link href="/programmes" hrefLang="fr">Nos actions</Link> and <Link href="/en/odeb">the ODEB project in English</Link>.</p>
      </section>
    </main>
  );
}
