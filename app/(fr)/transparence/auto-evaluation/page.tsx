import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";
import { AUTO_EVALUATION, comptes, dateLongue, ETATS, type Etat } from "@/lib/auto-evaluation";

/* Auto-évaluation du site au regard des référentiels des ONG (content/auto-evaluation.json) : une grille
   datée, critère par critère, avec la page qui en fait preuve. Elle dit ce qui manque autant que ce qui existe. */

const ROUTE = "/transparence/auto-evaluation";
const TITRE = "Ce que le site montre, et ce qu’il ne montre pas encore";
const DESCRIPTION = "Grille datée au regard du Core Humanitarian Standard, de la Global Standard for CSO Accountability et du cadre tchadien : chaque critère avec la page qui en fait preuve.";

export const metadata: Metadata = {
  title: "Auto-évaluation au regard des référentiels des ONG",
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { ...ogFor(ROUTE), title: "Auto-évaluation au regard des référentiels des ONG", description: DESCRIPTION },
};

export default function AutoEvaluation() {
  const d = AUTO_EVALUATION;
  const c = comptes();
  const total = c.present + c.partiel + c.absent;
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: d.titre, description: DESCRIPTION }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Redevabilité & transparence", url: "/transparence" }, { name: "Auto-évaluation" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow={`Association · redevabilité · ${dateLongue(d.date)}`}
        title={TITRE.split(", et")[0] + ","}
        em="et ce qu’il ne montre pas encore."
        lead={d.methode}
        crumbs={[{ label: "Redevabilité & transparence", href: "/transparence" }, { label: "Auto-évaluation" }]}
        pills={[`${total} critères`, `${c.present} présents`, `${c.partiel} partiels`, `${c.absent} absents`, `évaluation du ${dateLongue(d.date)}`]}
      />
      <Stats items={[
        { value: String(c.present), label: "présents", note: d.echelle.present },
        { value: String(c.partiel), label: "partiels", note: d.echelle.partiel },
        { value: String(c.absent), label: "absents", note: d.echelle.absent },
        { value: String(d.suites.length), label: "suites décidées", note: "inscrites au plan de développement, avec leur responsable" },
      ]} />

      <section className="hub-section" id="lecture">
        <SectionHead eyebrow="Lecture d’ensemble" title="Au niveau attendu sur la redevabilité," em="en retard sur les pièces." text="Mécanisme de plainte avec recours, journal des corrections, registre des décisions, promesses distinguées des réalisations, données personnelles décrites formulaire par formulaire : sur ce que les référentiels appellent la redevabilité envers le public, le site est au niveau attendu. Ce qui manque est concentré : les pièces constitutives (autorisation, statuts, procès-verbaux), l’argent (un compte, puis des comptes) et les politiques d’intégrité. Ce ne sont pas des manques du site, ce sont des pièces et des décisions que le bureau exécutif doit produire ; le site a déjà la place pour les publier." />
      </section>

      {d.blocs.map((b) => (
        <section className="hub-section" id={b.id} key={b.id}>
          <SectionHead eyebrow={`${b.criteres.length} critères`} title={b.titre} />
          <ol className="registre">
            {b.criteres.map((k) => (
              <li className={`registre-ligne registre-ligne--eval-${k.etat}`} key={k.critere}>
                <div className="registre-tete">
                  <span className={`status registre-statut eval-statut--${k.etat}`}>{ETATS[k.etat as Etat]}</span>
                </div>
                <h3>{k.critere}</h3>
                <p>{k.preuve}</p>
                <p className="registre-sources"><Link href={k.href}>Voir la page</Link></p>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="hub-section" id="suites">
        <SectionHead eyebrow="Ce qui suit" title="Cinq suites," em="chacune avec son responsable et son horizon." text="Elles sont inscrites au plan de développement du site et reprises ici telles quelles ; l’auto-évaluation sera refaite chaque trimestre, et chaque ligne qui change sera datée." />
        <ol className="registre">
          {d.suites.map((s) => (
            <li className="registre-ligne" key={s.id} id={`suite-${s.id}`}>
              <h3>{s.quoi}</h3>
              <p className="registre-suite"><b>Qui :</b> {s.qui}</p>
              <p className="registre-suite"><b>Quand :</b> {s.quand}</p>
            </li>
          ))}
        </ol>
        <p className="form-note">Référentiels : Core Humanitarian Standard on Quality and Accountability, édition 2024 (CHS Alliance, Groupe URD, Sphere) ; Global Standard for CSO Accountability (Accountable Now) ; ordonnance n° 023/PR/2018 et décret n° 1917/PR/MEPD/2018 (République du Tchad). Méthode et grille complète : <Link href="/transparence/decisions">registre des décisions</Link>, entrée du {dateLongue(d.date)}.</p>
      </section>
      <Partager route={ROUTE} titre="Auto-évaluation au regard des référentiels des ONG" texte={DESCRIPTION} />
    </main>
  );
}
