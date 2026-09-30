import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { getIndex, metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { programmeParId } from "@/lib/bailleurs";
import { PROGRAMMES_EN } from "@/lib/bailleurs-en";
import type { Source } from "@/lib/propositions-commune";
import { APPORTS_EN, DEMARCHE_EN, EN_RETOUR_EN, GROUPES_EN, PORTEURS_EN, PROJET_INTEGRE_EN, PROJETS_EN, REGLES_EN } from "@/lib/propositions-commune-en";

const ROUTE = "/en/commune";

export const metadata: Metadata = {
  title: "Our proposals to the commune of Bédjondo",
  description: metaDescription("Ten priority projects and an integrated local economic development project; planning the town, finance and accountability, an open council, basic services, partnerships and a first project: every proposal ADEB LONODJI makes to the town hall of Bédjondo, gathered and sourced."),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: "Our proposals to the commune of Bédjondo", description: "Every proposal we make to the town hall, on one page, each with its source." },
};

/* The source documents are in French: each link says so. */
function Sources({ sources }: { sources: Source[] }) {
  return (
    <span className="pc-sources">
      {sources.map((s, i) => <span key={s.label}>{i ? " · " : ""}<Link href={s.href} hrefLang="fr">{s.label}</Link></span>)}
      <span className="sr-only"> (in French)</span>
    </span>
  );
}

export default function CommuneEn() {
  const note = getIndex().plaidoyers.find((p) => p.id === "plaidoyer-commune");
  const total = GROUPES_EN.reduce((n, g) => n + g.items.length, 0);
  const sansDepense = GROUPES_EN.reduce((n, g) => n + g.items.filter((i) => i.sansDepense).length, 0);
  const textes = new Set(GROUPES_EN.flatMap((g) => g.items.flatMap((i) => i.sources.map((x) => x.href)))).size;
  const avecAppui = PROJETS_EN.filter((p) => p.apport.length).length;
  return (
    <main id="main-content" className="hub-page pc-page" lang="en">
      <PageHeader
        eyebrow="Territory · the commune · in English"
        title="Our proposals"
        em="to the commune of Bédjondo."
        lead="Everything we propose to the town hall, on one page. First, ten priority projects that answer residents’ needs and match the priorities of local development partners — local governance, resilience, economic inclusion — and the integrated project we recommend. Then the measures already published in our files, grouped into six areas of work, each with its source. Several require nothing more than a decision. The source documents are in French."
        crumbs={[{ label: "Our work", href: "/en/themes" }, { label: "Proposals to the commune" }]}
        lang="en"
        pills={[`${PROJETS_EN.length} priority projects`, `${total} measures in ${GROUPES_EN.length} areas`, "note published 16 September 2026", note?.sent === "À envoyer" ? "not yet sent" : "sent"]}
      />
      <Stats items={[
        { value: String(PROJETS_EN.length), label: "priority projects", note: `${PROJETS_EN.filter((p) => p.porteur).length} of them among the most fundable` },
        { value: `${avecAppui}/${PROJETS_EN.length}`, label: "projects with LONODJI support", note: "commitments already published in our files" },
        { value: String(total), label: "measures already published", note: `drawn from ${textes} published texts` },
        { value: String(sansDepense), label: "need only a decision", note: "no spending, according to our texts" },
      ]} />

      <section className="hub-section" id="projets-prioritaires">
        <SectionHead eyebrow="The association’s proposal · 30 September 2026" title="Ten priority projects" em="for the commune." text="Projects that answer residents’ real needs and match what local development partners support: local governance, community resilience, economic inclusion. They are proposals to discuss with the commune: none has a study, a budget or funding yet. For each: what our files already said, what LONODJI could contribute — only commitments already published, under an agreement with the commune — and the donor programmes from our survey whose scope overlaps: doors to knock on, not funding secured." />
        <ol className="pp-grille">
          {PROJETS_EN.map((p, i) => {
            const progs = p.programmes.map(programmeParId).filter((x) => x !== undefined);
            return (
              <li className={p.porteur ? "pp-carte est-porteur" : "pp-carte"} id={`projet-${p.id}`} key={p.id}>
                <p className="pp-tete"><span className="pp-num">{i + 1}</span>{p.porteur ? <span className="pp-badge">among the most fundable</span> : null}</p>
                <h3>{p.titre}</h3>
                <ul className="pp-volets">{p.volets.map((v) => <li key={v}>{v}</li>)}</ul>
                <p className="pp-ligne"><b>Already in our files</b>{p.deja.length ? <Sources sources={p.deja} /> : <span className="pc-sources">new proposal</span>}</p>
                <div className={p.apport.length ? "pp-apport" : "pp-apport est-vide"}>
                  <p className="pp-apport-titre">What LONODJI could contribute</p>
                  {p.apport.length ? (
                    <ul>{p.apport.map((a) => <li key={a.texte}>{a.texte.charAt(0).toUpperCase() + a.texte.slice(1)}. <Sources sources={a.sources} /></li>)}</ul>
                  ) : <p className="pp-apport-vide">No commitment published yet: it remains to be defined with the theme concerned.</p>}
                </div>
                {progs.length ? <p className="pp-ligne"><b>Programmes to approach</b><span className="pp-progs">{progs.map((g) => <Link key={g.id} href={`/en/donors#${g.id}`}>{(PROGRAMMES_EN[g.id]?.nom ?? g.nom).split(" — ")[0]}</Link>)}</span></p> : null}
              </li>
            );
          })}
        </ol>
        <div className="pp-deux">
          <div className="pp-porteurs">
            <p className="eyebrow">Most fundable</p>
            <ol>{PORTEURS_EN.map((x) => <li key={x}>{x}</li>)}</ol>
          </div>
          <div className="pp-integre">
            <p className="eyebrow">Our recommendation</p>
            <h3>{PROJET_INTEGRE_EN.titre}</h3>
            <p>{PROJET_INTEGRE_EN.texte}</p>
            <p className="pp-pourquoi">{PROJET_INTEGRE_EN.pourquoi}</p>
            <p className="pp-pourquoi">No programme in our survey funds such projects in Bédjondo yet: the project must first be included in the communal development plan, then presented by the commune. <Link href="/en/donors">Our survey of donor programmes</Link>.</p>
          </div>
        </div>
      </section>

      <section className="hub-section" id="demarche">
        <SectionHead eyebrow="Our approach" title="Working with the commune" em="and the local authorities." text="Five steps, in this order. Each step completed will be dated here and in the decision register." />
        <ol className="pc-etapes">
          {DEMARCHE_EN.map((d) => (
            <li key={d.etape}>
              <p className="pc-etape-tete"><strong>{d.etape}</strong><span className={d.enCours ? "pc-etat est-en-cours" : "pc-etat"}>{d.etat}</span></p>
              <p>{d.texte}</p>
            </li>
          ))}
        </ol>
        <p className="pc-regles"><strong>Four rules throughout:</strong> {REGLES_EN.join(" ")}</p>
      </section>

      <section className="hub-section pc-intro-chantiers" id="mesures">
        <SectionHead eyebrow="Measures already published" title="Six areas of work," em={`${total} measures, each sourced.`} text="Our proposals to the town hall were scattered: a note to the council, an article, a “to the commune” section in each of the seven advocacy files, background pages. Here they are together, with nothing added; each links to the text where it was published (in French)." />
      </section>

      <nav className="pc-sommaire" aria-label="The six areas of work">
        {GROUPES_EN.map((g, i) => <a key={g.id} href={`#${g.id}`}><b>{i + 1}</b>{g.titre.replace(/[,:]$/, "")} <span>{g.items.length}</span></a>)}
        <a href="#apports"><b>+</b>What we contribute</a>
      </nav>

      {GROUPES_EN.map((g, i) => (
        <section className="hub-section" id={g.id} key={g.id}>
          <SectionHead eyebrow={`Area ${i + 1} · ${g.items.length} measure${g.items.length > 1 ? "s" : ""}`} title={g.titre} em={g.em} text={g.intro} />
          <ol className="pc-liste">
            {g.items.map((p) => (
              <li key={p.texte}>
                <p>{g.id === "services" && p.texte.includes(" — ") ? <><strong>{p.texte.split(" — ")[0]}</strong> — {p.texte.split(" — ").slice(1).join(" — ")}</> : p.texte}{p.sansDepense ? <span className="pc-badge">a decision, no spending</span> : null}</p>
                <Sources sources={p.sources} />
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="hub-section" id="apports">
        <SectionHead eyebrow="Our part" title="What the association contributes," em="and what it asks in return." text="The association does not substitute for the commune; it serves it. These commitments sit within a written agreement, and their progress is published." />
        <div className="pc-deux">
          <ol className="pc-liste">
            {APPORTS_EN.map((p) => <li key={p.texte}><p>{p.texte}</p><Sources sources={p.sources} /></li>)}
          </ol>
          <aside className="pc-retour">
            <p className="eyebrow">In return, we ask for</p>
            <ul>{EN_RETOUR_EN.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="pc-retour-note">Source: <Link href="/journal/2026-09-16-note-commune-bedjondo" hrefLang="fr">note to the commune, § 6</Link> (in French).</p>
          </aside>
        </div>
      </section>

      <section className="hub-section" id="lire">
        <p className="lg-footnote">This page translates the French page <Link href="/territoire/propositions-commune" hrefLang="fr">Nos propositions à la commune de Bédjondo</Link>, which is the reference and also lists the problems in our territorial diagnosis that fall to the commune. The full note, the article and the legal framework are in French. A development partner interested in one of these projects? <Link href="/en/contact">Write to us</Link>.</p>
        <Partager route={ROUTE} titre="Our proposals to the commune of Bédjondo" texte="Every proposal ADEB LONODJI makes to the town hall of Bédjondo, gathered and sourced." lang="en" />
      </section>
    </main>
  );
}
