import type { Metadata } from "next";
import { jsonLd, webPageSchema } from "@/lib/schema";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { SOURCES, type Lien } from "@/lib/sous-sol";
import { ENGAGEMENTS_EN, INCONNUES_EN_LISTE, LECONS_EN, PROPOSITIONS_EN, SAVOIRS_EN, sourceEn } from "@/lib/sous-sol-en";

/* English version of /territoire/sous-sol (30/09/2026). The French page is the reference; the data and sources
   come from lib/sous-sol.ts, only the wording is translated (lib/sous-sol-en.ts). */
const ROUTE = "/en/subsoil";
const FR = "/territoire/sous-sol";
const TITRE = "The subsoil of Mandoul Occidental: what we know, and what must be prepared";
const RESUME = "Oil from the neighbouring Doba basin, iron of the old smelters, gold in the north, a barely studied subsoil: what is established, what is not, the lessons of Doba and our proposals.";

export const metadata: Metadata = {
  title: "Subsoil and natural resources of Mandoul Occidental",
  description: metaDescription("The subsoil of Mandoul Occidental, Chad: what public sources establish — Doba oil, old iron smelting, gold in the north — what is unknown, and our proposals."),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: TITRE, description: RESUME },
};

type Carte = { titre: string; texte: string; sources: string[]; liens?: Lien[] };
const ORDRE = Object.keys(SOURCES);
function Refs({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return <span className="pc-sources">Sources:{" "}{ids.map((id, i) => <span key={id}>{i ? ", " : ""}<a href={`#source-${id}`}>{ORDRE.indexOf(id) + 1}</a></span>)}</span>;
}
function Links({ liens }: { liens?: Lien[] }) {
  if (!liens?.length) return null;
  return <span className="pc-sources">{liens.map((l, i) => <span key={l.href}>{i ? " · " : ""}<Link href={l.href} hrefLang={l.href.startsWith("/en") ? undefined : "fr"}>{l.label}</Link></span>)}</span>;
}
function Cards({ items }: { items: Carte[] }) {
  return (
    <div className="gl-artic">
      {items.map((c) => (
        <article key={c.titre}>
          <h3>{c.titre}</h3>
          <p>{c.texte}</p>
          <Refs ids={c.sources} />
          <Links liens={c.liens} />
        </article>
      ))}
    </div>
  );
}

export default function SubsoilEn() {
  return (
    <main id="main-content" className="hub-page gl-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: TITRE, description: RESUME, lang: "en" }) }) }} />
      <PageHeader
        eyebrow="Territory · subsoil & natural resources · in English"
        title="The subsoil of Mandoul Occidental:"
        em="what we know, and what must be prepared."
        lead="It is often said that our subsoil is promising: oil has been produced since 2003 in the neighbouring Doba basin, our ancestors smelted local iron ore, and gold already draws young people from the department to the north. This page takes stock, source by source: what is established, what is not yet, what Doba teaches us, and what we propose so that, if resources are one day extracted here, they benefit first those who live on them."
        crumbs={[{ label: "Territory", href: "/en/villages" }, { label: "Subsoil & natural resources" }]}
        lang="en"
        pills={[`${SAVOIRS_EN.length} sourced findings`, `${INCONNUES_EN_LISTE.length} unknowns`, `${PROPOSITIONS_EN.length} proposals`]}
      />
      <Stats items={[
        { value: "2003", label: "start of production in the Doba basin", note: "inaugurated on 10 October 2003" },
        { value: "5%", label: "of Chad covered by airborne geophysical surveys", note: "World Bank, August 2023" },
        { value: "4.5%", label: "of direct oil revenue reserved in 1999 for the producing region", note: "Law 001/PR/1999" },
        { value: "?", label: "known deposit in Mandoul Occidental", note: "no public source found as of 30 September 2026" },
      ]} />

      <nav className="pc-sommaire" aria-label="On this page">
        <a href="#known"><b>1</b>What we know <span>{SAVOIRS_EN.length}</span></a>
        <a href="#unknown"><b>2</b>What we do not know <span>{INCONNUES_EN_LISTE.length}</span></a>
        <a href="#doba"><b>3</b>Lessons of Doba</a>
        <a href="#proposals"><b>4</b>Our proposals <span>{PROPOSITIONS_EN.length}</span></a>
        <a href="#sources"><b>+</b>Sources <span>{ORDRE.length}</span></a>
      </nav>

      <section className="hub-section" id="known">
        <SectionHead eyebrow="What we know" title="A producing neighbour," em="a subsoil still little known." text="Each finding refers to a public source, read on 30 September 2026. None of them, so far, locates a deposit in the department itself." />
        <Cards items={SAVOIRS_EN} />
      </section>

      <section className="hub-section" id="unknown">
        <SectionHead eyebrow="What we do not know" title="Questions" em="before promises." text="We have found them in no public source. Anyone holding a documented answer can write to us: it will be published with its source." />
        <ol className="gl-regles">{INCONNUES_EN_LISTE.map((q) => <li key={q}>{q}</li>)}</ol>
      </section>

      <section className="hub-section" id="doba">
        <SectionHead eyebrow="Lessons of Doba" title="More than twenty years of oil," em="right next door." text="Logone Oriental has been through what Mandoul Occidental may one day face. What happened there shows what must be settled before, not after." />
        <Cards items={LECONS_EN} />
      </section>

      <section className="hub-section" id="proposals">
        <SectionHead eyebrow="Our proposals" title="Set the rules" em="before the first well." text="Proposals of 30 September 2026, to be approved by the association’s executive committee. They assume no deposit: they apply to a laterite quarry as much as to an oil well." />
        <ul className="gl-demandes">
          {PROPOSITIONS_EN.map((p) => <li key={p.texte}><strong>{p.qui}.</strong> {p.texte} <Links liens={p.liens} /></li>)}
        </ul>
        <div style={{ marginTop: 56 }}><SectionHead eyebrow="Something in return" title="What we will do" em="ourselves." /></div>
        <ul className="gl-demandes">
          {ENGAGEMENTS_EN.map((p) => <li key={p.texte}><strong>{p.qui}.</strong> {p.texte} <Links liens={p.liens} /></li>)}
        </ul>
        <p className="lg-footnote">This subject falls under the theme Environment, Climate & Natural Resources, which is still looking for its coordinator (see <Link href="/en/themes#theme-06">theme 06</Link>). Geologists, petroleum and mining engineers, lawyers and environmental specialists: <Link href="/en/contact">offer your skills</Link>.</p>
      </section>

      <section className="hub-section" id="sources">
        <SectionHead eyebrow="Sources" title="Where each finding" em="comes from." />
        <ol className="gl-regles">
          {ORDRE.map((id) => {
            const s = sourceEn(id);
            return <li key={id} id={`source-${id}`}><a href={s.href} rel="noopener">{s.titre}</a> — {s.editeur}, {s.date}{s.date.endsWith(".") ? "" : "."}</li>;
          })}
        </ol>
        <p className="lg-footnote">Titles of sources are given in their original language.</p>
      </section>

      <section className="hub-section" id="read">
        <SectionHead eyebrow="Further reading" title="The pages" em="this one connects." />
        <div className="link-list">
          <Link href="/en/governance"><small>Territory</small><strong>Local governance</strong><span>Who decides what, from the canton to the State: to whom our proposals are addressed.</span></Link>
          <Link href="/en/commune"><small>Proposals</small><strong>Our proposals to the commune</strong><span>Priority projects and measures for the town of Bédjondo.</span></Link>
          <Link href="/en/themes#theme-06"><small>Our work</small><strong>Five pillars, twenty-one themes</strong><span>Including Environment, Climate & Natural Resources, which will carry this file.</span></Link>
        </div>
      </section>

      <Partager route={ROUTE} titre={TITRE} texte={RESUME} lang="en" />
      <p className="lg-footnote">This page translates the French page <Link href={FR} hrefLang="fr">Sous-sol & ressources naturelles</Link>, which is the reference. Spotted a factual error or a more recent source? <Link href="/transparence#corrections" hrefLang="fr">Report it (in French)</Link>: it will be corrected and dated.</p>
    </main>
  );
}
