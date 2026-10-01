import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import OuvrirAncre from "@/components/ouvrir-ancre";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { PROGRAMMES_BAILLEURS, type Famille, type ProgrammeBailleur } from "@/lib/bailleurs";
import { FAMILLES_EN, FENETRES_EN, GUICHETS_EN, PLAIDOYERS_EN, PORTEES_EN, PROGRAMMES_EN, RELEVE_EN, sourceEn, STATUTS_EN } from "@/lib/bailleurs-en";

export const metadata: Metadata = {
  title: "Donor programmes in Chad",
  description: metaDescription("World Bank, EU, UN, AfDB, Swiss cooperation, AFD: donor programmes under way in Chad, those reaching Mandoul, and how the association can connect to each."),
  alternates: { canonical: "/en/donors", languages: alternatesLangues("/en/donors") },
  openGraph: { ...ogFor("/en/donors", "en"), title: "Donor programmes in Chad, and where we connect", description: "Programmes under way, those reaching Mandoul, and our entry points." },
};

const ORDRE: ProgrammeBailleur["portee"][] = ["bedjondo", "koumra", "mandoul", "sud", "national", "hors-zone"];
const PROCHE = ["bedjondo", "koumra", "mandoul"];

function Card({ p }: { p: ProgrammeBailleur }) {
  const e = PROGRAMMES_EN[p.id];
  return (
    <article className={`bl-carte bl-carte--${p.portee}`} id={p.id}>
      <p className="bl-tete">
        <span className={`bl-portee bl-portee--${p.portee}`}>{PORTEES_EN[p.portee]}</span>
        <span className={`bl-statut bl-statut--${p.statut}`}>{STATUTS_EN[p.statut]}</span>
      </p>
      <h3>{e?.nom ?? p.nom}</h3>
      <p className="bl-qui">{e?.bailleur ?? p.bailleur}{p.ref ? <> · <span className="bl-ref">{p.ref}</span></> : null}</p>
      <dl className="bl-faits">
        <div><dt>Amount</dt><dd>{e?.montant ?? p.montant}</dd></div>
        <div><dt>Period</dt><dd>{e?.periode ?? p.periode}</dd></div>
        <div><dt>Areas</dt><dd>{e?.zones ?? p.zones}</dd></div>
      </dl>
      <p className="bl-accroche"><strong>How we connect.</strong> {e?.accroche ?? p.accroche}</p>
      {p.plaidoyers?.length ? (
        <p className="bl-liens">{p.plaidoyers.map((pl) => <span key={pl} className="bl-chip">Advocacy: {PLAIDOYERS_EN[pl]}</span>)}</p>
      ) : null}
      <p className="bl-source">Source: <a href={p.source} target="_blank" rel="noopener noreferrer">{sourceEn(p.sourceLabel)} <span aria-hidden="true">↗</span></a></p>
    </article>
  );
}

export default function DonorsEn() {
  const actifs = PROGRAMMES_BAILLEURS.filter((p) => p.statut !== "clos");
  const mandoul = PROGRAMMES_BAILLEURS.filter((p) => PROCHE.includes(p.portee) && p.statut !== "clos");
  const aConnaitre = PROGRAMMES_BAILLEURS.filter((p) => p.statut === "clos" || p.portee === "hors-zone");
  const principaux = PROGRAMMES_BAILLEURS.filter((p) => !aConnaitre.includes(p));
  const familles = (Object.keys(FAMILLES_EN) as Famille[]).map((f) => ({
    f, items: principaux.filter((p) => p.famille === f).sort((a, b) => ORDRE.indexOf(a.portee) - ORDRE.indexOf(b.portee)),
  })).filter((g) => g.items.length);

  return (
    <main id="main-content" className="hub-page bl-page" lang="en">
      <PageHeader
        eyebrow="Our actions · technical and financial partners · in English"
        title="Donor programmes in Chad,"
        em="and where we connect."
        lead={`World Bank, European Union and European cooperation, United Nations, African Development Bank, global funds: we surveyed the programmes under way or in preparation in Chad, looking first for those that reach Mandoul province. For each: what it funds, where, until when, and how the association can connect to it — a written request, a list of localities to join, a consultation to follow. None of these programmes funds the association: they are doors to knock on. Survey of ${RELEVE_EN}, each source opened one by one.`}
        crumbs={[{ label: "Donor programmes" }]}
        lang="en"
        pills={[`${PROGRAMMES_BAILLEURS.length} programmes surveyed`, `${mandoul.length} reach Mandoul`, "1 already active in Bédjondo", `survey of ${RELEVE_EN}`]}
      />
      <Stats items={[
        { value: String(actifs.length), label: "programmes under way or in preparation", note: "checked one by one on the donors’ official portals" },
        { value: String(mandoul.length), label: "name Mandoul or Koumra", note: "in their official documents or activities" },
        { value: "1", label: "already present in Bédjondo", note: "women’s health forums on 27 September 2026 (CARE, BASE, AFD)" },
        { value: String(FENETRES_EN.length), label: "windows being decided now", note: "locality lists, consultations, project design" },
      ]} />

      <section className="hub-section" id="summary">
        <SectionHead eyebrow="In brief" title="What this survey changes" em="for our advocacy." />
        <ul className="bl-bref">
          <li><strong>Bédjondo is named in no programme document.</strong> Mandoul often is (health, water, women, agriculture), Koumra sometimes. Our task: get Bédjondo and its cantons onto the locality lists being drawn up now.</li>
          <li><strong>Two recipients of our advocacy have changed.</strong> The World Bank rural roads project (PMCR) closed on 30 April 2026; the World Bank water project PASER does not cover Mandoul. For water, the right doors are the AfDB (PAEPA II), UNICEF and Swiss cooperation.</li>
          <li><strong>The south is treated as a development area, not a humanitarian one</strong> — except for water: the 2026 Humanitarian Response Plan lists Mandoul Occidental among the priority departments for water, sanitation and hygiene.</li>
          <li><strong>Donors do not fund associations directly</strong>: they work through ministries and their project units. The few windows open to an organisation like ours are listed below.</li>
        </ul>
      </section>

      <section className="hub-section" id="now">
        <SectionHead eyebrow="Calendar" title="What is being decided" em="now." text="Lists and programmes close in the coming months. Each line links to the programme or window concerned." />
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Windows to act on">
          <table className="sec-table bl-table">
            <thead><tr><th scope="col">When</th><th scope="col">What</th><th scope="col">With whom</th></tr></thead>
            <tbody>
              {FENETRES_EN.map((f) => (
                <tr key={f.quoi}><td>{f.quand}</td><td><a href={`#${f.lien === "guichets" ? "windows" : f.lien}`}>{f.quoi}</a></td><td>{f.ou}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hub-section" id="programmes">
        <SectionHead eyebrow="The programmes" title="Each programme," em="donor by donor." text="Amount, period, areas, how we connect and the source: one card per programme, from closest to Bédjondo to furthest. Open a donor family to read its cards." />
        <div className="plier-liste">
          {familles.map((g) => {
            const near = g.items.filter((p) => PROCHE.includes(p.portee)).length;
            return (
              <details className="plier" id={`family-${g.f}`} key={g.f}>
                <summary><strong>{FAMILLES_EN[g.f]}</strong><span>{g.items.length} programme{g.items.length > 1 ? "s" : ""}{near ? `, ${near} naming Mandoul, Koumra or Bédjondo` : ""}</span></summary>
                <div className="bl-grille plier-cartes">
                  {g.items.map((p) => <Card key={p.id} p={p} />)}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="hub-section" id="windows">
        <SectionHead eyebrow="Funding windows" title="Where the association can apply" em="itself." text="All require an association in good standing — statutes, registration receipt, a bank account in its name — or a sister diaspora association registered abroad. Hence the importance of the formalities under way." />
        <div className="bl-grille">
          {GUICHETS_EN.map((g) => (
            <article className="bl-carte" key={g.nom}>
              <h3>{g.nom}</h3>
              <dl className="bl-faits">
                <div><dt>For</dt><dd>{g.qui}</dd></div>
                <div><dt>Amount</dt><dd>{g.montant}</dd></div>
                <div><dt>Deadline</dt><dd>{g.echeance}</dd></div>
              </dl>
              <p className="bl-accroche">{g.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="closed">
        <SectionHead eyebrow="Good to know" title="Closed, or outside" em="our area." text="So as not to knock on the wrong door." />
        <details className="plier">
          <summary><strong>{aConnaitre.length} programmes closed or outside our area</strong><span>{aConnaitre.map((p) => (PROGRAMMES_EN[p.id]?.nom ?? p.nom).split(" — ")[0]).join(" · ")}</span></summary>
          <div className="bl-grille plier-cartes">
            {aConnaitre.map((p) => <Card key={p.id} p={p} />)}
          </div>
        </details>
      </section>

      <OuvrirAncre />
      <section className="hub-section">
        <p className="lg-footnote">
          Survey of {RELEVE_EN}, from official portals (World Bank, AfDB, the EU’s IATI register, Swiss cooperation, AFD, UNDP, UNICEF, UNFPA, IFAD, OCHA, Global Fund) and, failing that, the Chadian press, cited as such. Where an amount, a date or an area was not found, we say so. Programmes change quickly: this survey will be redone every six months. The French page adds, for each of our themes and projects, the programmes that match it: <Link href="/bailleurs#par-action" hrefLang="fr">programmes by theme and by project (French)</Link>. A mistake, a programme missed? <Link href="/participer?objet=partenariat#contact" hrefLang="fr">Write to us</Link>. See also <Link href="/en/sectors">our sectors of work</Link>.
        </p>
        <Partager route="/en/donors" titre="Donor programmes in Chad, and where ADEB LONODJI connects" texte="World Bank, EU, United Nations, AfDB: programmes reaching Mandoul province, and our entry points." lang="en" />
      </section>
    </main>
  );
}
