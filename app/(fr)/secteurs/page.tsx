import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { thematiquesParId } from "@/lib/odeb-chiffres";
import { ETATS_SECTEUR, GROUPES_SECTEURS, NON_COUVERTS, SECTEURS } from "@/lib/secteurs";

export const metadata: Metadata = {
  title: "Secteurs d’intervention : WASH, santé, nutrition, urgences… et nos vingt thématiques",
  description: "Les vingt thématiques de l’association lues dans la langue des ONG de développement et d’aide : dix-sept secteurs (WASH, santé, nutrition, éducation, sécurité alimentaire, relief, réduction des risques, protection…), leurs clusters, codes CAD et ODD, ce qui est fait et ce qui n’est qu’une piste.",
  alternates: { canonical: "/secteurs", languages: { fr: "/secteurs", en: "/en/sectors" } },
  openGraph: { ...ogFor("/secteurs"), title: "Secteurs d’intervention : WASH, santé, nutrition, urgences…", description: "Dix-sept secteurs des ONG, nos vingt thématiques, ce qui est fait et ce qui n’est qu’une piste." },
};

export default function Secteurs() {
  const th = thematiquesParId();
  const faites = SECTEURS.flatMap((s) => s.activites).filter((a) => a.etat === "fait").length;
  const pistes = SECTEURS.flatMap((s) => s.activites).filter((a) => a.etat === "piste").length;
  const nouveaux = SECTEURS.filter((s) => s.etat !== "couvert").length;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Nos actions · secteurs d’intervention"
        title="WASH, santé, relief…"
        em="nos thématiques dans la langue des ONG."
        lead="Les partenaires du développement et de l’aide classent le travail par secteurs — les clusters humanitaires, les codes du Comité d’aide au développement de l’OCDE, les Objectifs de développement durable. Voici les vingt thématiques de l’association rangées dans ces secteurs, avec pour chacun ce qui est déjà fait (un lien vers la page ou le document) et ce qui n’est encore qu’une piste. Rien n’est chiffré ni financé à ce jour."
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Secteurs d’intervention" }]}
        pills={[`${SECTEURS.length} secteurs`, "20 thématiques", `${nouveaux} élargis ou nouveaux le 29 septembre 2026`, `${NON_COUVERTS.length} secteurs non couverts, dits`]}
      />
      <Stats items={[
        { value: String(SECTEURS.length), label: "secteurs couverts", note: "des services essentiels aux urgences, avec leurs thématiques" },
        { value: String(faites), label: "activités faites", note: "une page ou un document existe : plaidoyer, plan, formulaire, fiche" },
        { value: String(pistes), label: "pistes", note: "envisagées, ni engagées ni chiffrées" },
        { value: String(NON_COUVERTS.length), label: "secteurs non couverts", note: "abris, camps, logistique : l’association oriente" },
      ]} />

      <section className="hub-section" id="correspondance">
        <SectionHead eyebrow="En un tableau" title="Secteur, thématiques," em="cadre de référence." text="Pour un bailleur ou une ONG partenaire : le secteur, son étiquette usuelle, les thématiques qui le portent, le cluster, le code CAD et l’ODD de référence." />
        <div className="ob-table-wrap">
          <table className="sec-table">
            <thead><tr><th scope="col">Secteur</th><th scope="col">Thématiques</th><th scope="col">Cluster</th><th scope="col">CAD</th><th scope="col">ODD</th><th scope="col">État</th></tr></thead>
            <tbody>
              {SECTEURS.map((s) => (
                <tr key={s.id}>
                  <th scope="row"><a href={`#${s.id}`}>{s.nom}</a><small>{s.sigle}</small></th>
                  <td>{s.thematiques.map((id) => th[id] ? <span key={id} className="sec-num" title={th[id].name}>{th[id].number}</span> : null)}</td>
                  <td>{s.cadre.cluster ?? "—"}</td>
                  <td>{s.cadre.cad}</td>
                  <td>{s.cadre.odd}</td>
                  <td><span className={`sec-etat sec-etat--${s.etat}`}>{s.etat === "couvert" ? "Couvert" : s.etat === "elargi" ? "Élargi" : "Nouveau"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {GROUPES_SECTEURS.map((g) => (
        <section className="hub-section" id={`groupe-${g.id}`} key={g.id}>
          <SectionHead eyebrow="Groupe de secteurs" title={g.nom} text={g.texte} />
          <div className="sec-grille">
            {SECTEURS.filter((s) => s.groupe === g.id).map((s) => (
              <article className="sec-carte" id={s.id} key={s.id}>
                <div className="sec-tete">
                  <span className="sec-sigle">{s.sigle}</span>
                  <span className={`sec-etat sec-etat--${s.etat}`}>{ETATS_SECTEUR[s.etat].label}</span>
                </div>
                <h3>{s.nom}</h3>
                <p className="sec-cadre">{[s.cadre.cluster, s.cadre.cad, s.cadre.odd].filter(Boolean).join(" · ")}</p>
                <ul className="sec-activites">
                  {s.activites.map((a) => (
                    <li key={a.texte} className={a.etat === "fait" ? "est-fait" : "est-piste"}>
                      <b>{a.etat === "fait" ? "Fait" : "Piste"}</b>
                      {a.href ? <Link href={a.href}>{a.texte}</Link> : <span>{a.texte}</span>}
                    </li>
                  ))}
                </ul>
                <p className="sec-them">
                  {s.thematiques.map((id) => th[id] ? <Link key={id} href={`/programmes#${id}`}><span>{th[id].number}</span>{th[id].name}{th[id].filled ? "" : " · à pourvoir"}</Link> : null)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="hub-section" id="non-couverts">
        <SectionHead eyebrow="Ce que nous ne faisons pas" title="Trois secteurs" em="hors de notre portée, et nous le disons." text="Une association sans budget ni stocks ne distribue pas d’abris et ne gère pas de camps. Elle informe, oriente et relaie les besoins vers ceux dont c’est le mandat." />
        <div className="detail-grid">
          {NON_COUVERTS.map((n) => <article key={n.sigle}><span>{n.sigle}</span><h3>{n.nom}</h3><p>{n.pourquoi}</p></article>)}
        </div>
      </section>

      <section className="hub-section" id="partenaires">
        <SectionHead eyebrow="Travailler avec nous" title="Une ONG, un bailleur," em="un cluster ?" />
        <div className="link-list">
          <Link href="/participer?objet=partenariat#contact"><small>Écrire</small><strong>Proposer un partenariat sectoriel</strong><span>Réponse sous 48 heures ouvrées ; indiquez le secteur et la zone.</span></Link>
          <Link href="/dossiers/ong-partenaires"><small>Partenaires</small><strong>Les ONG et partenaires présents au Mandoul</strong><span>Qui fait quoi, où, d’après les sources publiques.</span></Link>
          <Link href="/programmes/fiches-de-mission"><small>Coordinations</small><strong>Les fiches de mission</strong><span>Cinq thématiques, dont Urgences & risques, cherchent leur coordination.</span></Link>
          <Link href="/en/sectors"><small>In English</small><strong>Our sectors, for international partners</strong><span>The same mapping, in English.</span></Link>
        </div>
      </section>

      <Partager route="/secteurs" titre="Secteurs d’intervention d’ADEB LONODJI" texte="WASH, santé, nutrition, éducation, sécurité alimentaire, urgences, protection… nos vingt thématiques dans la langue des ONG" />
      <p className="lg-footnote">Nomenclatures : clusters du Comité permanent interorganisations (IASC), codes-objet du Comité d’aide au développement de l’OCDE (CAD), Objectifs de développement durable. Correspondance établie par l’association le 29 septembre 2026 ; données dans <code>lib/secteurs.ts</code>. Une erreur de classement ? <Link href="/transparence#corrections">Signalez-la</Link>.</p>
    </main>
  );
}
