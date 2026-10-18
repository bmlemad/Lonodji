import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { filledCount, getIndex, metaDescription, ogFor, thematiqueCount } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { alternatesLangues } from "@/lib/langues";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

/* English version of /developpement-local-tchad (18/10/2026), for international search: local and community
   development in Chad, the Chadian diaspora, Mandoul heritage. Every figure comes from the site's data. */

const ROUTE = "/en/local-development-chad";
const TITRE = "Local and community development in Chad: the Bedjond country example";
const DESCRIPTION = metaDescription("How a community association from Mandoul, in southern Chad, and its diaspora document a territory’s needs, safeguard its heritage and carry sourced advocacy: method, data and reference pages.");

export const metadata: Metadata = {
  title: "Local development in Chad: Mandoul, diaspora, heritage",
  description: DESCRIPTION,
  keywords: ["local development Chad", "community development Chad", "Mandoul", "Mandoul Occidental", "Chadian diaspora", "Mandoul heritage", "NGO Chad", "southern Chad", "Bédjondo"],
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: TITRE, description: DESCRIPTION },
};

export default function LocalDevelopment() {
  const idx = getIndex();
  const c = getIndicateurs().contenu;
  const en = new Intl.NumberFormat("en-GB");
  return (
    <main id="main-content" className="hub-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: TITRE, description: DESCRIPTION }), breadcrumbSchema([{ name: "Home", url: "/en/index" }, { name: "Local development in Chad" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow="Chad · Mandoul · diaspora · in English"
        title="Local and community development in Chad,"
        em="the Bedjond country example."
        lead="ADEB LONODJI is a community association born in Bédjondo, in the Mandoul Occidental department of southern Chad, and open to the Chadian diaspora that comes from it. This page sets out its method for anyone interested in local development in Chad: start from a territory’s documented needs, publish sources, keep what is promised apart from what is done, and involve the diaspora."
        crumbs={[{ label: "Local development in Chad" }]}
        lang="en"
        pills={["Southern Chad", "Mandoul Occidental", "Chadian diaspora", "Heritage"]}
      />
      <Stats items={[
        { value: en.format(c.carte.localitesNommees), label: "named localities", note: `out of ${en.format(c.carte.localites)} mapped, in ${c.carte.unites} units` },
        { value: String(c.problematiques.total), label: "issues identified", note: `${c.problematiques.documentees} documented, sources cited` },
        { value: String(c.plaidoyers.publies), label: "advocacy files published", note: "each with its recipients and sources" },
        { value: `${filledCount(idx)}/${thematiqueCount(idx)}`, label: "themes with a coordinator", note: "each led by a volunteer coordinator" },
      ]} />

      <section className="hub-section" id="territory">
        <SectionHead eyebrow="A territory in southern Chad" title="Starting from needs," em="locality by locality." text={`The Bedjond country stretches around Bédjondo, chief town of Mandoul Occidental, and into Logone Oriental. The association has mapped it from open data: ${en.format(c.carte.localitesNommees)} named localities, each with its own page, and ${c.carte.equipements} facilities recorded. The diagnosis cross-checks these data with the needs reported by residents.`} />
        <div className="link-list">
          <Link href="/en/villages"><small>Data</small><strong>Village pages</strong><span>Each locality, its neighbours and known facilities.</span></Link>
          <Link href="/en/bedjondo"><small>Territory</small><strong>Bédjondo</strong><span>The chief town and its surroundings.</span></Link>
          <Link href="/en/governance"><small>Governance</small><strong>Who decides what</strong><span>Commune, department, province, chiefdoms.</span></Link>
          <Link href="/en/subsoil"><small>Resources</small><strong>The subsoil</strong><span>Oil, iron, gold: what is known and what is at stake.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="method">
        <SectionHead eyebrow="Community development" title="A verifiable method," em="from advocacy to delivery." text={`The association is organised into six pillars and ${thematiqueCount(idx)} themes aligned with the Sustainable Development Goals and donor categories. Each advocacy file cites its sources and names its recipients; each commitment is tracked publicly, and nothing is presented as done before it is confirmed.`} />
        <div className="link-list">
          <Link href="/en/themes"><small>Programmes</small><strong>Pillars and themes</strong><span>Water, health, education, farming, governance, heritage…</span></Link>
          <Link href="/en/advocacy"><small>Advocacy</small><strong>Advocacy files</strong><span>Texts, figures, sources and recipients.</span></Link>
          <Link href="/en/impact"><small>Tracking</small><strong>Impact dashboard</strong><span>What is published, sent, delivered.</span></Link>
          <Link href="/en/donors"><small>Donors</small><strong>Donor programmes in Chad</strong><span>Where a local association can connect.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="diaspora">
        <SectionHead eyebrow="Chadian diaspora" title="The diaspora," em="a bridge to the homeland." text="Part of the Bedjond people lives in N’Djamena, in other regions of Chad and abroad. The association lists the skills of this Chadian diaspora and puts them at the service of projects decided with residents: health, engineering, law, digital, farming, funding." />
        <div className="link-list">
          <Link href="/diaspora"><small>Directory · in French</small><strong>Skills directory</strong><span>Offer your know-how, from afar or on the ground.</span></Link>
          <Link href="/en/contact"><small>Get involved</small><strong>Contact and join</strong><span>Join, coordinate, propose an article or a project.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="heritage">
        <SectionHead eyebrow="Mandoul heritage" title="A memory," em="a language, places." text="Bedjond heritage is part of the heritage of Mandoul and southern Chad: history of chiefdoms and founders, the Nangnda language, rites, genealogies. The association documents it with its sources and never publishes the location of sacred sites or burial places." />
        <div className="link-list">
          <Link href="/histoire"><small>History · in French</small><strong>History and key figures</strong><span>From 1986 to the 2026 reactivation.</span></Link>
          <Link href="/langue"><small>Language · in French</small><strong>The Nangnda language</strong><span>A lexicon to listen to, a dictionary to enrich.</span></Link>
          <Link href="/patrimoine"><small>Heritage · in French</small><strong>Bedjond heritage</strong><span>Places, rites, genealogies, research base.</span></Link>
        </div>
      </section>
      <Partager route={ROUTE} titre={TITRE} texte={DESCRIPTION} />
    </main>
  );
}
