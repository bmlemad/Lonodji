import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { problemesParDecideur, type Lien } from "@/lib/gouvernance-locale";
import { ARTICULATIONS_EN, INDICATEURS_EN, inWords, NIVEAUX_EN, REGLES_EN, RESUME_PROPOSITIONS_EN } from "@/lib/gouvernance-locale-en";

/* English version of /territoire/gouvernance-locale (30/09/2026). The French page is the reference; the data
   come from the same file (lib/gouvernance-locale.ts), only the wording is translated (lib/gouvernance-locale-en.ts). */
const ROUTE = "/en/governance";
const FR = "/territoire/gouvernance-locale";

export const metadata: Metadata = {
  title: "Local governance in Bédjondo: who decides what",
  description: metaDescription("Who decides what for Bédjondo — State, province, department, commune, chieftaincies, neighbourhoods —, what our files ask of each level, how they fit together, and the indicators to follow it."),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: "Local governance in Bédjondo: who decides what", description: "Each level of decision, our requests, how they fit together and the indicators to follow them." },
};

/* The linked texts are in French. */
function Sources({ sources }: { sources: Lien[] }) {
  return (
    <span className="pc-sources">
      {sources.map((s, i) => <span key={s.label}>{i ? " · " : ""}<Link href={s.href} hrefLang="fr">{s.label}</Link></span>)}
      <span className="sr-only"> (in French)</span>
    </span>
  );
}

export default function GovernanceEn() {
  const probs = problemesParDecideur();
  const publies = INDICATEURS_EN.filter((i) => i.statut === "publié").length;
  return (
    <main id="main-content" className="hub-page gl-page" lang="en">
      <PageHeader
        eyebrow="Territory · local governance · in English"
        title="Local governance:"
        em="who decides what, and how we take part."
        lead="Since the elections of 29 December 2024, much of what Bédjondo is waiting for is no longer decided in N’Djamena alone. This page gathers, level by level, what our files say about each decision-maker — from the State to the neighbourhoods, by way of the chieftaincies —, what we ask of each, where several must act together, and the indicators to follow it. It does not replace the files: it connects them. The source documents are in French."
        crumbs={[{ label: "Our work", href: "/en/themes" }, { label: "Local governance" }]}
        lang="en"
        pills={[`${NIVEAUX_EN.length} levels of decision`, `${ARTICULATIONS_EN.length} points of joint action`, `${INDICATEURS_EN.length} indicators, ${publies} published`]}
      />
      <Stats items={[
        { value: "18", label: "municipal councillors", note: "elected for six years, renewable once" },
        { value: "2", label: "ordinary sessions a year", note: "plus the budget session" },
        { value: "13", label: "shared areas", note: "between the State and local authorities" },
        { value: "2.1 %", label: "of public revenue", note: "spent by local authorities (2020)" },
      ]} />

      <nav className="pc-sommaire" aria-label="On this page">
        <a href="#levels"><b>1</b>Who decides what <span>{NIVEAUX_EN.length}</span></a>
        <a href="#together"><b>2</b>Acting together <span>{ARTICULATIONS_EN.length}</span></a>
        <a href="#indicators"><b>3</b>Indicators <span>{INDICATEURS_EN.length}</span></a>
        <a href="#method"><b>4</b>Our method</a>
        <a href="#read"><b>+</b>Related files</a>
      </nav>

      <section className="hub-section" id="levels">
        <SectionHead eyebrow="Who decides what" title="Six levels," em="from the most national to the closest." text="For each level: who it is, what falls to it according to our files, the problems in our territorial diagnosis that depend on it, and what we ask of it. The rule behind our advocacy is subsidiarity: what can be decided in Bédjondo should be decided in Bédjondo." />
        <ol className="gl-niveaux">
          {NIVEAUX_EN.map((n, i) => {
            const nb = n.decideurs.flatMap((d) => probs[d] ?? []).length;
            return (
              <li className="gl-niveau" id={`level-${n.id}`} key={n.id}>
                <div className="gl-tete">
                  <span className="pp-num">{i + 1}</span>
                  <div><h3>{n.nom}</h3><p className="gl-qui">{n.qui}</p></div>
                </div>
                <p className="gl-role">{n.role}</p>
                {nb ? <p className="gl-qui"><Link href="/territoire/diagnostic" hrefLang="fr">{inWords(nb, true)} problem{nb > 1 ? "s" : ""} in our territorial diagnosis</Link> depend{nb > 1 ? "" : "s"} on it (in French).</p> : null}
                <p className="gl-label">Our requests</p>
                <ul className="gl-demandes">{n.demandes.map((d) => <li key={d.texte}>{d.texte} <Sources sources={d.sources} /></li>)}</ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="hub-section" id="together">
        <SectionHead eyebrow="Acting together" title="Where two levels" em="must talk to each other." text="Commune, chieftaincies, prefecture, neighbourhoods: on these five subjects, none can succeed alone. Each point is already written in one of our files." />
        <div className="gl-artic">
          {ARTICULATIONS_EN.map((a) => (
            <article key={a.titre}>
              <p className="gl-qui-tag">{a.qui}</p>
              <h3>{a.titre}</h3>
              <p>{a.texte}</p>
              <Sources sources={a.sources} />
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="indicators">
        <SectionHead eyebrow="Following up" title="Indicators," em="published and proposed." text={`The first ${inWords(publies)} already appear in the results framework of our advocacy files. The others were proposed on 30 September 2026 and are still to be approved by the association’s board; their targets and deadlines will be set with the commune, not before.`} />
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Local governance indicators">
          <table className="sec-table gl-table">
            <thead><tr><th scope="col">Indicator</th><th scope="col">Baseline</th><th scope="col">Target</th><th scope="col">Deadline</th><th scope="col">Evidence</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {INDICATEURS_EN.map((i) => (
                <tr key={i.indicateur}><td>{i.indicateur}</td><td>{i.depart}</td><td>{i.cible}</td><td>{i.echeance}</td><td>{i.verification}</td><td><span className={i.statut === "publié" ? "gl-statut est-publie" : "gl-statut"}>{i.statutEn}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Source of the published indicators: <Link href="/actions#resultats" hrefLang="fr">results framework of the advocacy files</Link> (in French). Their follow-up appears on the <Link href="/en/impact">impact dashboard</Link>.</p>
      </section>

      <section className="hub-section" id="method">
        <SectionHead eyebrow="Our method" title="Six rules," em="that we apply to ourselves first." />
        <ol className="gl-regles">
          {REGLES_EN.map((r) => <li key={r.titre}><strong>{r.titre}</strong> {r.texte}</li>)}
        </ol>
      </section>

      <section className="hub-section" id="read">
        <SectionHead eyebrow="Further reading" title="The files" em="this page connects." />
        <div className="link-list">
          <Link href="/en/commune"><small>Proposals</small><strong>Our proposals to the commune</strong><span>{RESUME_PROPOSITIONS_EN}, and our approach with the commune and local authorities.</span></Link>
          <Link href="/territoire/decentralisation" hrefLang="fr"><small>File · in French</small><strong>Decentralisation & local development</strong><span>The legal framework, the gap between the texts and the means, the four rules we ask of the council.</span></Link>
          <Link href="/programmes/agriculteurs-eleveurs" hrefLang="fr"><small>File · in French</small><strong>Peace between farmers and herders</strong><span>Six measures at canton level, including the joint committee and the mediation logbook.</span></Link>
          <Link href="/en/advocacy"><small>Advocacy</small><strong>Our advocacy files</strong><span>What we ask of the State and the commune, file by file.</span></Link>
        </div>
      </section>

      <Partager route={ROUTE} titre="Local governance in Bédjondo: who decides what" texte="Each level of decision, our requests, how they fit together and the indicators to follow them." lang="en" />
      <p className="lg-footnote">This page translates the French page <Link href={FR} hrefLang="fr">Gouvernance locale</Link>, which is the reference and lists, level by level, the problems in our territorial diagnosis. Spotted a factual error? <Link href="/transparence#corrections" hrefLang="fr">Report it (in French)</Link>: it will be corrected and dated.</p>
    </main>
  );
}
