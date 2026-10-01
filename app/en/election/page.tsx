import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { getIndex, metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { college, etape, getElection } from "@/lib/election";
import { dateEn, inWordsEn, nomsEn } from "@/lib/structure-en";
import { jsonLd, webPageSchema } from "@/lib/schema";

/* English version of /association/election-vice-presidences (1 October 2026). Rules and calendar: content/election.json
   (English fields *_en); the French page is the reference. */
const ROUTE = "/en/election";
const TITLE = "Electing the pillar vice-presidents";
const SUMMARY = "Four pillar vice-presidents to be elected in October 2026: who may stand, who votes, how and when. Procedure adopted by the executive board on 1 October 2026.";

export const metadata: Metadata = {
  title: "Election of the pillar vice-presidents",
  description: metaDescription(SUMMARY),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: TITLE, description: SUMMARY },
};

export default function ElectionEn() {
  const e = getElection();
  const { piliers, themes } = nomsEn();
  const poles = getIndex().structure.poles.filter((p) => e.poles.includes(p.roman));
  const n = college();
  const call = etape("appel"), close = etape("cloture"), vote = etape("vote");
  return (
    <main id="main-content" className="hub-page gl-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: TITLE, description: SUMMARY, lang: "en" }) }) }} />
      <PageHeader
        eyebrow="The association · election · in English"
        title={`${inWordsEn(poles.length, true)} vice-presidents`}
        em="to be elected in October 2026."
        lead={`Since 1 October 2026, each pillar is led by an elected vice-president. Pillars ${poles.map((p) => p.roman).join(", ").replace(/, ([^,]+)$/, " and $1")} do not have one yet. The executive board adopted the procedure below the same day: candidacies from ${dateEn(call.date, false)} to ${dateEn(close.date)}, vote on ${dateEn(vote.date)}. The application form is in French; you can also write to us in English.`}
        crumbs={[{ label: "How we are organised", href: "/en/organisation" }, { label: "Election" }]}
        pills={[`Adopted on ${dateEn(e.adoptee)}`, `Vote on ${dateEn(vote.date)}`, `College of ${n} people`]}
      />
      <Stats items={[
        { value: String(poles.length), label: "vice-presidencies open", note: poles.map((p) => `pillar ${p.roman}`).join(", ") },
        { value: dateEn(close.date, false), label: "candidacies close", note: `opened on ${dateEn(call.date)}` },
        { value: dateEn(vote.date, false), label: "voting day", note: "in person and remotely" },
        { value: String(n), label: "members of the electoral college", note: "board, vice-presidents in office, coordinators" },
      ]} />

      <section className="hub-section" id="posts">
        <SectionHead eyebrow="The posts" title={`${inWordsEn(poles.length, true)} pillars,`} em={`${inWordsEn(poles.length)} people to elect.`} text="The vice-president brings the pillar’s theme coordinators together every quarter, keeps its action plan and calendar, follows its advocacy and projects, and reports to the board and the assembly. A voluntary role, open in Chad and in the diaspora; applications from women are particularly welcome." />
        <ul className="postes-grille">
          {poles.map((p) => (
            <li key={p.id} className="poste poste-vice-presidence">
              <span className="poste-genre">Pillar {p.roman}</span>
              <h3>{piliers[p.roman] ?? p.name}</h3>
              <p className="poste-pole">{p.items.map((t) => `${t.number}. ${themes[t.number] ?? t.name}`).join(" · ")}</p>
              <p className="poste-actions">
                <a className="button primary" href={`/participer?direction=${p.roman}&coordo=1#contact`} hrefLang="fr">Apply <span className="sr-only">(form in French)</span></a>
                <a className="text-link" href={`/missions/fiche-mission-direction-${p.id}.pdf`} hrefLang="fr">Mission sheet <span className="sr-only">(PDF, in French)</span></a>
              </p>
            </li>
          ))}
        </ul>
        <p className="lg-footnote">The online form and the mission sheets are in French. To apply in English, <Link href="/en/contact">write to us</Link> with the pillar you are standing for and a short statement.</p>
      </section>

      <section className="hub-section" id="calendar">
        <SectionHead eyebrow="Calendar" title="From the call" em="to the results." />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Election calendar">
          <table className="ob-table">
            <thead><tr><th scope="col">Date</th><th scope="col">Step</th></tr></thead>
            <tbody>{e.calendrier.map((s) => <tr key={s.cle}><th scope="row" className="nowrap">{dateEn(s.date)}</th><td>{s.quoi_en ?? s.quoi}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="hub-section" id="rules">
        <SectionHead eyebrow="Rules" title="How the" em="vote works." text={`The ${inWordsEn(e.regles.length)} rules adopted by the executive board on ${dateEn(e.adoptee)}.`} />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Election rules">
          <table className="ob-table">
            <thead><tr><th scope="col">Point</th><th scope="col">Rule</th><th scope="col">Good to know</th></tr></thead>
            <tbody>{e.regles.map((r) => <tr key={r.point}><th scope="row">{r.point_en ?? r.point}</th><td>{(r.texte_en ?? r.texte).replace("{college}", inWordsEn(n))}</td><td>{r.note_en ?? r.note}</td></tr>)}</tbody>
          </table>
        </div>
        <h3 className="el-sous-titre">Who runs it</h3>
        <ul className="el-liste">{(e.organisation_en ?? e.organisation).map((o) => <li key={o}>{o}</li>)}</ul>
      </section>

      <section className="hub-section" id="documents">
        <SectionHead eyebrow="Documents" title="In French," em="to print and share." />
        <div className="link-list">
          <Link href="/association/election-vice-presidences" hrefLang="fr"><small>Reference page · in French</small><strong>L’élection des vice-présidences</strong><span>The French page, which will carry the list of candidates on {dateEn(etape("liste").date)} and the results on {dateEn(etape("resultats").date)}.</span></Link>
          <a href="/organisation/election-vice-presidences-2026.pdf" hrefLang="fr"><small>PDF · in French</small><strong>Procedure and call for candidates</strong><span>Rules, calendar, call and paper application form.</span></a>
          <Link href="/en/organisation"><small>In English</small><strong>How we are organised</strong><span>Six pillars, twenty-two themes, seven priorities.</span></Link>
        </div>
      </section>

      <Partager route={ROUTE} titre={TITLE} texte={`four pillar vice-presidents to elect: candidacies until ${dateEn(close.date)}, vote on ${dateEn(vote.date)}`} lang="en" />
    </main>
  );
}
