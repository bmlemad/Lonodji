import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead } from "../../../components/blocks";
import { ogFor } from "../../../lib/content";
import { thematiquesParId } from "../../../lib/odeb-chiffres";
import { ETATS_SECTEUR, GROUPES_SECTEURS, NON_COUVERTS, SECTEURS } from "../../../lib/secteurs";

export const metadata: Metadata = {
  title: "Sectors of intervention — WASH, health, nutrition, relief, DRR… (in English)",
  description: "ADEB LONODJI’s twenty themes mapped to the sectors development and humanitarian partners use: IASC clusters, OECD-DAC purpose codes and SDGs, what is done and what is only an idea.",
  alternates: { canonical: "/en/sectors", languages: { fr: "/secteurs", en: "/en/sectors" } },
  openGraph: { ...ogFor("/en/sectors", "en"), title: "Sectors of intervention — WASH, health, nutrition, relief, DRR…", description: "Twenty themes mapped to NGO sectors, clusters, DAC codes and SDGs." },
};

export default function SectorsEn() {
  const th = thematiquesParId();
  return (
    <main id="main-content" className="hub-page" lang="en">
      <PageHeader
        eyebrow="Our actions · sectors · in English"
        title="WASH, health, relief…"
        em="our themes in the language of NGOs."
        lead="Seventeen sectors, as IASC clusters, OECD-DAC purpose codes and the SDGs name them, each with the association’s themes that carry it and a line on what it means in Bédjondo. Links lead to the French pages, where each activity says whether it is done or only an idea. Nothing is funded yet, and no money is collected before the association has a bank account in its name."
        crumbs={[{ label: "In English", href: "/en/index" }, { label: "Sectors" }]}
        pills={[`${SECTEURS.length} sectors`, "20 themes", "Relief and DRR added on 29 September 2026"]}
      />
      <section className="hub-section" id="mapping">
        <SectionHead eyebrow="At a glance" title="Sector, themes," em="reference frame." />
        <div className="ob-table-wrap">
          <table className="sec-table">
            <thead><tr><th scope="col">Sector</th><th scope="col">Themes (no.)</th><th scope="col">Cluster</th><th scope="col">DAC</th><th scope="col">SDG</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {SECTEURS.map((s) => (
                <tr key={s.id}>
                  <th scope="row"><Link href={`/secteurs#${s.id}`} hrefLang="fr">{s.en}</Link><small>{s.enTexte}</small></th>
                  <td>{s.thematiques.map((id) => th[id] ? <span key={id} className="sec-num">{th[id].number}</span> : null)}</td>
                  <td>{s.cadre.cluster ? s.cadre.cluster.replace("Cluster ", "").replace("Relèvement précoce", "Early recovery").replace("Sécurité alimentaire", "Food security").replace("Santé", "Health").replace("Éducation", "Education").replace("(enfance, VBG)", "(child protection, GBV)") + " cluster" : "—"}</td>
                  <td>{s.cadre.cad.replace("CAD", "DAC").replace("marqueur genre du DAC", "DAC gender marker").replace("hors nomenclature DAC", "outside DAC codes")}</td>
                  <td>{s.cadre.odd.replace("ODD", "SDG")}</td>
                  <td><span className={`sec-etat sec-etat--${s.etat}`}>{ETATS_SECTEUR[s.etat].en}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Groups: {GROUPES_SECTEURS.map((g) => g.en).join(" · ")}. Theme numbers refer to the <Link href="/en/themes">list of themes</Link>.</p>
      </section>
      <section className="hub-section" id="not-covered">
        <SectionHead eyebrow="What we do not do" title="Three sectors" em="beyond our reach." text="An association without a budget or stocks does not distribute shelter or run camps. It informs, guides and relays needs to those whose mandate it is." />
        <div className="detail-grid">
          {NON_COUVERTS.map((n) => <article key={n.sigle}><span>{n.sigle}</span><h3>{n.en}</h3></article>)}
        </div>
      </section>
      <section className="hub-section" id="partner">
        <SectionHead eyebrow="Work with us" title="An NGO, a donor," em="a cluster?" />
        <div className="link-list">
          <Link href="/en/contact"><small>Write</small><strong>Propose a sector partnership</strong><span>We answer every message; please name the sector and the area.</span></Link>
          <Link href="/en/projects"><small>Projects</small><strong>Projects and their stage</strong><span>From idea to service, what exists and what is missing.</span></Link>
        </div>
      </section>
      <Partager route="/en/sectors" titre="ADEB LONODJI — sectors of intervention" texte="WASH, health, nutrition, education, food security, relief, DRR, protection: twenty themes mapped to NGO sectors" lang="en" />
    </main>
  );
}
