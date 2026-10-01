import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { filledCount, getIndex, metaDescription, ogFor, thematiqueCount } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { PRIORITAIRES } from "@/lib/organisation";
import { etape } from "@/lib/election";
import { getPostes } from "@/lib/postes";
import { getMagazine } from "@/lib/magazine";
import { dateEn, inWordsEn, nomsEn } from "@/lib/structure-en";
import { jsonLd, webPageSchema } from "@/lib/schema";

/* English version of /association/propositions-organisation and its follow-up (1 October 2026): structure, priorities,
   election, annual plans, magazine. Names come from the English themes page; the French pages are the reference. */
const ROUTE = "/en/organisation";
const TITLE = "How we are organised";
const SUMMARY = "Six pillars, twenty-two themes and seven priority themes, elected pillar vice-presidents and an annual plan per priority: what ADEB LONODJI’s executive board decided on 1 October 2026.";

export const metadata: Metadata = {
  title: "How we are organised: six pillars, twenty-two themes",
  description: metaDescription(SUMMARY),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: TITLE, description: SUMMARY },
};

const DECISIONS_EN: [string, string][] = [
  ["Few priorities at a time", "The themes remain the map of our subjects, but only five to seven are priorities at once, each with an annual plan, at least two people and a report: first the seven themes behind our eight advocacy files."],
  ["Pillar II split", "The largest pillar, which held eleven themes, was split: Essential Services keeps water, education, gender, health and social protection; the rest went to new pillars."],
  ["Money with the elected board", "The Financing & Resources unit is held ad interim by the elected treasurer; fundraising stays suspended until an account in the association’s name and the other published conditions are in place."],
  ["Projects, follow-up & accountability", "Preparing files, keeping the tracking table and the annual report become a task of the secretary-general."],
  ["Elected pillar vice-presidents", "Pillar leads become elected vice-presidents, who bring their coordinators together every quarter."],
  ["One person, one theme, one deputy", "A person coordinates one theme only, and each priority theme has a lead and a deputy, so that nothing depends on a single person."],
  ["One steering grid", "We steer by pillars and themes only; the ODEB programmes and the NGO sectors become correspondence tables."],
  ["Aligned with the commune’s plan", "Each priority theme is tied to a project in our proposals to the commune of Bédjondo, and a State technical officer is invited to follow it."],
];

export default function OrganisationEn() {
  const idx = getIndex();
  const { piliers, themes } = nomsEn();
  const poles = idx.structure.poles;
  const all = poles.flatMap((p) => p.items);
  const prio = PRIORITAIRES.map((p) => all.find((t) => t.id === p.id)).filter(Boolean) as typeof all;
  const postes = getPostes();
  const mag = getMagazine().numeros[0];
  const vote = etape("vote");
  return (
    <main id="main-content" className="hub-page gl-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: TITLE, description: SUMMARY, lang: "en" }) }) }} />
      <PageHeader
        eyebrow="The association · organisation · in English"
        title={`${inWordsEn(poles.length, true)} pillars,`}
        em={`${inWordsEn(thematiqueCount(idx))} themes.`}
        lead="We compared our structure with ten comparable organisations and frameworks. The executive board adopted eight decisions on 1 October 2026; the same afternoon it chose even numbers — six pillars and twenty-two themes — then adopted the election procedure for the pillar vice-presidents and an annual plan for each priority theme. Nothing was deleted or renumbered."
        crumbs={[{ label: "About", href: "/en/about" }, { label: "How we are organised" }]}
        pills={[`${poles.length} pillars`, `${thematiqueCount(idx)} themes`, `${prio.length} priorities`, `Election on ${dateEn(vote.date)}`]}
      />
      <Stats items={[
        { value: String(poles.length), label: "pillars", note: "pillars V and VI created on 1 October 2026" },
        { value: `${filledCount(idx)} / ${thematiqueCount(idx)}`, label: "themes with a coordinator", note: "theme 22, Sport, Arts & Leisure, created on 1 October 2026" },
        { value: String(prio.length), label: "priority themes", note: "the themes of our eight advocacy files" },
        { value: String(postes.length), label: "open posts", note: "leads, deputies and pillar vice-presidents" },
      ]} />

      <section className="hub-section" id="pillars">
        <SectionHead eyebrow="Structure" title="Six pillars," em="who leads what." text="Names as published on our French page Nos actions; a pillar vice-president is elected, a theme coordinator is appointed." />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Pillars and themes">
          <table className="ob-table">
            <thead><tr><th scope="col">Pillar</th><th scope="col">Vice-president</th><th scope="col">Themes and coordinators</th></tr></thead>
            <tbody>
              {poles.map((p) => (
                <tr key={p.id}>
                  <th scope="row">{p.roman} · {piliers[p.roman] ?? p.name}</th>
                  <td>{p.direction?.filled ? p.direction.name : <Link href="/en/election">to be elected on {dateEn(vote.date)}</Link>}</td>
                  <td>{p.items.map((t) => `${t.number}. ${themes[t.number] ?? t.name} — ${t.filled ? t.coordinator.split(",")[0] : "open"}`).join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 18 }}>
          <Link className="button secondary" href="/en/themes">All themes in detail <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/en/election">The election of the vice-presidents <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="hub-section" id="priorities">
        <SectionHead eyebrow="Priorities" title="Seven priority themes," em="each with a lead and a deputy." text="The themes behind our eight advocacy files. Each has an annual plan, pre-filled with the commitments we published in its advocacy file; the lead and the deputy set deadlines, owners, means and indicators, and the pillar vice-president follows it every quarter." />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Priority themes">
          <table className="ob-table">
            <thead><tr><th scope="col">Theme</th><th scope="col">Lead</th><th scope="col">Deputy</th></tr></thead>
            <tbody>
              {prio.map((t) => (
                <tr key={t.id}>
                  <th scope="row">{t.number}. {themes[t.number] ?? t.name}</th>
                  <td>{t.filled ? t.coordinator.split(",")[0] : <a href={`/participer?theme=${t.number}&coordo=1#contact`} hrefLang="fr">open — apply</a>}</td>
                  <td><a href={`/participer?theme=${t.number}&adjoint=1#contact`} hrefLang="fr">to be found — apply</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Application forms, mission sheets and the annual plans (<a href="/organisation/plans-annuels-priorites.pdf" hrefLang="fr">PDF</a>) are in French; to apply in English, <Link href="/en/contact">write to us</Link>. Our advocacy files are summarised on the <Link href="/en/advocacy">advocacy page</Link>.</p>
      </section>

      <section className="hub-section" id="decisions">
        <SectionHead eyebrow="Decisions of 1 October 2026" title="Eight decisions," em="and what followed the same day." />
        <ol className="gl-regles">
          {DECISIONS_EN.map(([t, x]) => <li key={t}><strong>{t}.</strong> {x}</li>)}
        </ol>
        <p className="lg-footnote">The same day, the board adopted the election procedure for the pillar vice-presidents and the annual plan template (register 2026-33 and 2026-34), then six pillars and twenty-two themes (register 2026-35). The French texts, with their sources: <Link href="/association/propositions-organisation" hrefLang="fr">Décisions d’organisation</Link> and the <Link href="/transparence/decisions" hrefLang="fr">register of decisions</Link>.</p>
      </section>

      {mag ? (
        <section className="hub-section" id="magazine">
          <SectionHead eyebrow="Quarterly magazine · in French" title="Lonodji," em="four issues a year." text={`Our quarterly magazine gathers what the association decided and published, in a PDF to print or share on WhatsApp. Issue ${mag.numero} (${mag.pages} pages) came out on ${dateEn(mag.parution)}; the next one is due in January 2027.`} />
          <div className="link-list">
            <a href={mag.pdf} hrefLang="fr"><small>PDF · in French</small><strong>Lonodji no. {mag.numero}</strong><span>{mag.chapo}</span></a>
            <Link href="/magazine" hrefLang="fr"><small>In French</small><strong>All issues</strong><span>Cover, contents and download.</span></Link>
          </div>
        </section>
      ) : null}

      <Partager route={ROUTE} titre={TITLE} texte="six pillars, twenty-two themes, seven priorities and elected pillar vice-presidents" lang="en" />
    </main>
  );
}
