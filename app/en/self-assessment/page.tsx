import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { alternatesLangues, FR_VERS_EN } from "@/lib/langues";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";
import { AUTO_EVALUATION, comptes, type Etat } from "@/lib/auto-evaluation";
import en from "@/content/auto-evaluation-en.json";

/* English version of /transparence/auto-evaluation (24/10/2026). Statuses, links and counts come from
   content/auto-evaluation.json; only the wording comes from content/auto-evaluation-en.json, matched by block id
   and position (the build fails if a block is missing). */

const ROUTE = "/en/self-assessment";
const DESCRIPTION = "Dated grid against the Core Humanitarian Standard, the Global Standard for CSO Accountability and the Chadian framework: each criterion with the page that evidences it.";
const ETATS_EN: Record<Etat, string> = { present: "Present", partiel: "Partial", absent: "Absent" };
type BlocEn = { titre: string; criteres: string[][] };
const BLOCS = en.blocs as Record<string, BlocEn>;
const SUITES = en.suites as Record<string, string[]>;
const dateEn = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const lien = (href: string) => { const [chemin] = href.split("#"); const e = FR_VERS_EN[chemin]; return e ? { href: e, fr: false } : { href, fr: true }; };

export const metadata: Metadata = {
  title: en.titre,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: en.titre, description: DESCRIPTION },
};

export default function SelfAssessment() {
  const d = AUTO_EVALUATION;
  const c = comptes();
  const total = c.present + c.partiel + c.absent;
  return (
    <main id="main-content" className="hub-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: en.titre, description: DESCRIPTION }), breadcrumbSchema([{ name: "Home", url: "/en/index" }, { name: "Self-assessment" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow={`Association · accountability · ${dateEn(d.date)} · in English`}
        title="What the site shows,"
        em="and what it does not show yet."
        lead={en.methode}
        crumbs={[{ label: "Self-assessment" }]}
        lang="en"
        pills={[`${total} criteria`, `${c.present} present`, `${c.partiel} partial`, `${c.absent} absent`, `assessment of ${dateEn(d.date)}`]}
      />
      <Stats items={[
        { value: String(c.present), label: "present", note: en.echelle.present },
        { value: String(c.partiel), label: "partial", note: en.echelle.partiel },
        { value: String(c.absent), label: "absent", note: en.echelle.absent },
        { value: String(d.suites.length), label: "follow-ups decided", note: "in the development plan, each with an owner" },
      ]} />

      <section className="hub-section" id="overview">
        <SectionHead eyebrow="Overview" title="Up to standard on accountability," em="behind on documents." text="A complaints mechanism with appeal, a corrections log, a register of decisions, promises kept apart from delivery, personal data described form by form: on what the standards call accountability to the public, the site is at the expected level. What is missing is concentrated: founding documents (authorisation, statutes, minutes), money (an account, then accounts) and integrity policies. These are not gaps in the site but documents and decisions the executive board must produce; the site already has room to publish them." />
      </section>

      {d.blocs.map((b) => {
        const t = BLOCS[b.id];
        if (!t || t.criteres.length !== b.criteres.length) throw new Error(`auto-evaluation-en.json : bloc ${b.id} absent ou incomplet`);
        return (
          <section className="hub-section" id={b.id} key={b.id}>
            <SectionHead eyebrow={`${b.criteres.length} criteria`} title={t.titre} />
            <ol className="registre">
              {b.criteres.map((k, i) => {
                const l = lien(k.href);
                return (
                  <li className={`registre-ligne registre-ligne--eval-${k.etat}`} key={k.critere}>
                    <div className="registre-tete"><span className={`status registre-statut eval-statut--${k.etat}`}>{ETATS_EN[k.etat as Etat]}</span></div>
                    <h3>{t.criteres[i][0]}</h3>
                    <p>{t.criteres[i][1]}</p>
                    <p className="registre-sources"><Link href={l.href} hrefLang={l.fr ? "fr" : undefined}>{l.fr ? "See the page (in French)" : "See the page"}</Link></p>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <section className="hub-section" id="follow-ups">
        <SectionHead eyebrow="What comes next" title="Five follow-ups," em="each with an owner and a horizon." text="They are in the site’s development plan; the self-assessment will be repeated every quarter, and every line that changes will be dated." />
        <ol className="registre">
          {d.suites.map((s) => {
            const t = SUITES[s.id];
            if (!t) throw new Error(`auto-evaluation-en.json : suite ${s.id} absente`);
            return (
              <li className="registre-ligne" key={s.id}>
                <h3>{t[0]}</h3>
                <p className="registre-suite"><b>Who:</b> {t[1]}</p>
                <p className="registre-suite"><b>When:</b> {t[2]}</p>
              </li>
            );
          })}
        </ol>
        <p className="form-note">Standards: Core Humanitarian Standard on Quality and Accountability, 2024 edition (CHS Alliance, Groupe URD, Sphere); Global Standard for CSO Accountability (Accountable Now); ordinance No. 023/PR/2018 and decree No. 1917/PR/MEPD/2018 (Republic of Chad). Method and full grid: <Link href="/transparence/decisions" hrefLang="fr">register of decisions</Link> (in French), entry of {dateEn(d.date)}.</p>
      </section>
      <Partager route={ROUTE} titre={en.titre} texte={DESCRIPTION} />
    </main>
  );
}
