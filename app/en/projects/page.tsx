import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { getProjets, STADES_ACTIFS, stadeIndex } from "@/lib/projets";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Projects: stage, gaps and how to help",
  description: metaDescription("The association’s projects, from idea to service: community digital space, mobile app, sports complex, transport company, hotel, boarding school, university hospital. Stage, what exists, what is missing, how to contribute."),
  alternates: { canonical: "/en/projects", languages: alternatesLangues("/en/projects") },
  openGraph: { ...ogFor("/en/projects", "en"), title: "Projects — each one with its stage, what is missing and how to help", description: "From idea to service: what exists, what is missing, how to contribute. No money is collected before the association has a bank account." },
};

/* English wording of the stages and of each project, in the same order as content/projets.json. */
const STADES_EN: Record<string, [string, string]> = {
  idee: ["Idea", "Proposed, not yet examined by a theme."],
  etude: ["Under study", "Need, options and cost benchmarks documented; no quote yet."],
  annonce: ["Announced", "Decided in principle; no budget, no timeline."],
  souscription: ["Pledges open", "Pledges of contribution are collected, without payment."],
  finance: ["Funded", "Money secured and published."],
  realisation: ["In progress", "Works or development under way."],
  essai: ["Trial", "A first version is in use and being tested."],
  service: ["In service", "Running, with its follow-up published."],
};
const PROJETS_EN: Record<string, { nom: string; resume: string }> = {
  "espace-numerique": { nom: "Community digital space of Bédjondo", resume: "A room connected by satellite, powered by solar, six to ten workstations, open to pupils, teachers, health workers, the commune and project holders; funded by the association and its diaspora, run by a local committee. Pledges open: promises only, no payment." },
  application: { nom: "Mobile app", resume: "The site as an installable app, offline reading, a first Android trial version online (1.0.1, 28 September 2026); shops and mobile-money membership fees after the receipt and the bank account." },
  "complexe-sportif": { nom: "Sports complex", resume: "A football pitch and courts for the youth of Bédjondo; need documented, options and cost benchmarks gathered, no quote yet." },
  "bedjondo-transport-logistique": { nom: "Bedjondo Transport and Logistics (formerly Air Bedjondo)", resume: "A land transport and logistics service to open up Bédjondo and link its cantons. Announced on 19 September 2026 as Air Bedjondo, renamed on 29 September 2026; six proposals published (services, vehicles, set-up, stages, rules), everything still to be studied. The transport company of the ODEB Social economy programme." },
  "complexe-hotelier": { nom: "Hotel complex of Bédjondo", resume: "Rooms, restaurant, meeting and event hall for missions, traders, visitors and the diaspora passing through; a company distinct from the association whose profits would fund development and welfare projects. First phase envisaged: a ten-room guesthouse. Idea proposed on 28 September 2026." },
  "complexe-scolaire-internat": { nom: "School complex with boarding, from year 7", resume: "A demanding lower then upper secondary school with boarding, to train the future elites of the Bedjond country; scholarships for deserving pupils without means; fees that cover costs and leave a surplus for projects. Idea proposed on 28 September 2026." },
  "chu-bedjondo": { nom: "Modern university hospital of Bédjondo and its health system", resume: "A modern university hospital set up with financial partners, and everything that makes a full health system around it: emergency, maternity, surgery, imaging, laboratory, central pharmacy, dialysis, telemedicine with diaspora specialists, ambulances, a nursing and midwifery school, canton health centres linked to the hospital, digital medical records, solar power, staff housing, a community health insurance scheme. Paid care funds free care for the poorest. In stages: medical centre, hospital, university hospital. Idea proposed on 28 September 2026." },
};

/* Budgets et calendriers : tenus en français dans content/projets.json, traduits à l'affichage. */
const BUDGETS_EN: Record<string, string> = {
  "aucun": "none",
  "à publier sur devis": "to be published once a quote is obtained",
  "25 $ une fois (Google Play), 99 $ par an (App Store)": "$25 once (Google Play), $99 a year (App Store)",
  "repères seulement, pas de devis": "cost benchmarks only, no quote",
};
const CALENDRIERS_EN: Record<string, string> = {
  "aucun": "none",
  "non fixé": "not set",
  "après le récépissé": "after the registration receipt",
};
const df = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const date = (iso: string) => { const d = new Date(iso.slice(0, 10) + "T12:00:00Z"); return Number.isNaN(d.getTime()) ? iso : df.format(d); };

export default function ProjectsEn() {
  const p = getProjets();
  const actifs = p.projets.filter((x) => STADES_ACTIFS.has(x.stade)).length;
  const tries = [...p.projets].sort((a, b) => stadeIndex(p, b.stade) - stadeIndex(p, a.stade));
  return (
    <main id="main-content" className="hub-page" lang="en">
      <PageHeader
        eyebrow="Our actions · projects · in English"
        title="Every project,"
        em="its stage, what is missing, how to help."
        lead="The association says where each project really stands — from idea to service — and what it lacks: a study, a project lead, a quote, money. Nothing is announced as done before it is; no money is collected before the association has a bank account in its name. Pledges of contribution are welcome; they commit no one until then."
        crumbs={[{ label: "Projects" }]}
        lang="en"
        pills={[`${p.projets.length} projects`, `${actifs} active`, "8 stages", `as of ${date(p.genere)}`]}
      />
      <Stats items={[
        { value: String(p.projets.length), label: "projects described", note: "each with its stage, what exists, what is missing, how to contribute" },
        { value: String(actifs), label: "active", note: "in progress, in trial or in service" },
        { value: String(p.projets.filter((x) => x.stade === "idee").length), label: "ideas", note: "proposed on 28 September 2026 by the Social economy programme; nothing studied or costed" },
        { value: "0", label: "funded", note: "no money collected before the bank account and the receipt" },
      ]} />

      <section className="hub-section" id="stages">
        <SectionHead eyebrow="The path of a project" title="Eight stages," em="and we say which one." text="No stage is skipped: no “funded” without a published budget, no “done” without dated follow-up. The stage changes when the evidence exists, not when the wish does." />
        <ol className="pj-stades">
          {p.stades.map((s, i) => { const [nom, texte] = STADES_EN[s.id] ?? [s.nom, s.texte]; const n = p.projets.filter((x) => x.stade === s.id).length; return <li key={s.id} className={n ? "est-occupe" : undefined}><span className="pj-stade-num">{i + 1}</span><strong>{nom}</strong><span>{texte}</span>{n ? <b>{n} {n > 1 ? "projects" : "project"}</b> : null}</li>; })}
        </ol>
      </section>

      <section className="hub-section" id="projects">
        <SectionHead eyebrow="The projects" title="From the most advanced" em="to the newest idea." />
        <div className="link-list">
          {tries.map((x) => {
            const en = PROJETS_EN[x.slug] ?? { nom: x.nom, resume: x.resume };
            const [stade] = STADES_EN[x.stade] ?? [x.stade];
            return (
              <Link href={`/projets#${x.slug}`} key={x.slug} hrefLang="fr" id={x.slug}>
                <small>{stade}</small>
                <strong>{en.nom}</strong>
                <span>{en.resume}</span>
                <span>Budget: {BUDGETS_EN[x.budget] ?? <span lang="fr">{x.budget}</span>} · timeline: {CALENDRIERS_EN[x.calendrier] ?? <span lang="fr">{x.calendrier}</span>} · full record in French</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="hub-section" id="help">
        <SectionHead eyebrow="From the diaspora" title="How to help" em="without sending money yet." />
        <div className="link-list">
          <Link href="/diaspora" hrefLang="fr"><small>Skills</small><strong>Register a skill</strong><span>Hotel management, teaching, transport, medicine, finance, construction: five minutes, contacted only for what you offered.</span></Link>
          <Link href="/projets#proposer" hrefLang="fr"><small>Propose</small><strong>Propose a project or an income-generating activity</strong><span>Name, locality, need, proposal, order of cost; the association answers within 48 working hours.</span></Link>
          <Link href="/en/odeb"><small>ODEB project</small><strong>The Social economy and revenue programme</strong><span>Businesses distinct from the association whose profits would fund the projects: five rules, four flagship ventures, ten more activities to study.</span></Link>
        </div>
        <Partager route="/en/projects" titre="Projects" texte="The association’s projects, from idea to service: community digital space, mobile app, sports complex, transport company, hotel, boarding school, university hospital. Stage, what exists, what is missing, how to contribute." lang="en" />
        <p className="lg-footnote">Stages and counts as of {date(p.genere)}, read from the same file as the French page (<Link href="/projets" hrefLang="fr">Plateforme de projets</Link>) and the <Link href="/en/impact">dashboard</Link>. Proposals are recorded by our host’s form service; see <Link href="/mentions-legales#donnees" hrefLang="fr">where your answers go</Link>.</p>
      </section>
    </main>
  );
}
