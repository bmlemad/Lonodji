import ArchitectureReference from "@/components/architecture-reference";
import { alternatesLangues } from "@/lib/langues";
import Appel from "@/components/appel";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Timeline } from "@/components/blocks";
import { LegacySections, Toc } from "@/components/legacy-content";
import { getIndex, getPage, ogFor, ORG } from "@/lib/content";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Notre mission",
  description: "Au service de tout le peuple bedjond, au Tchad et dans la diaspora : mission, valeurs, repères depuis 1986, bureau exécutif et organisation.",
  alternates: { canonical: "/mission", languages: alternatesLangues("/mission") },
  openGraph: ogFor("/mission"),
};


export default function Mission() {
  const idx = getIndex();
  const page = getPage("mission");
  /* Les repères historiques de l'ancien site sont déjà dans la frise ci-dessus : on ne les répète pas plus bas. */
  const DOUBLON = "dune-association-a-un-cadre-federateur";
  /* Origines, terre, histoire et langue : depuis la restructuration du 29/09/2026, dans Patrimoine (/histoire#origines). */
  const PATRIMOINE = ["le-peuple-sara-et-les-bedjond", "une-terre-dagriculture-et-delevage", "une-histoire-aussi-faite-depreuves", "la-langue-et-la-culture-bedjond"];
  const sections = page.sections.filter((s) => s.id !== DOUBLON && !PATRIMOINE.includes(s.id));
  const toc = (page.toc ?? []).filter((t) => t.href !== `#${DOUBLON}` && !PATRIMOINE.includes(t.href.slice(1)));
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: "/mission", name: "Notre mission", description: "Au service de tout le peuple bedjond, au Tchad et dans la diaspora : mission, valeurs, repères depuis 1986, bureau exécutif et organisation." }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Notre mission" }], "/mission")] }) }} />
      <PageHeader
        eyebrow="Association · notre mission"
        title="Au service de tout le peuple bedjond,"
        em="au Tchad et dans la diaspora."
        lead="Ancrée à Bédjondo, ADEB LONODJI s’adresse à tout le peuple bedjond, où qu’il vive. Elle rassemble les contributions au développement du pays bedjond — eau, santé, école, routes — et à la sauvegarde de sa langue, de son histoire et de son patrimoine."
        pills={["Reconnue en 1995 · autorisation actuelle en vérification", "Réactivée en 2026", "6 piliers · 22 thématiques"]}
      />

      <ArchitectureReference />
      <section className="hub-section" id="reperes">
        <SectionHead eyebrow="Repères historiques" title="Quarante ans," em="de 1986 à 2026." text="Les dates ci-dessous sont celles que l’association confirme. Quand une date reste incertaine, nous le disons dans le journal des corrections plutôt que de l’affirmer." />
        <Timeline items={idx.history} />
      </section>

      <section className="hub-section" id="bureau">
        <SectionHead eyebrow="Bureau exécutif" title="Celles et ceux" em="qui répondent de l’association." text="Le bureau exécutif répond de l’association ; son président la représente. L’animation générale — coordination, communication, numérique — est assurée par Bignéro Moïalbéi LE MADANG, en appui du bureau. Chaque thématique fonctionne ensuite de manière autonome, avec son coordonnateur." />
        <div className="bureau-grid">
          {ORG.bureau.map((m) => (
            <article className="bureau-card" key={m.role}><small>{m.role}</small><strong>{m.name}</strong>{m.note ? <p>{m.note}</p> : null}</article>
          ))}
          <article className="bureau-card"><small>Contact officiel</small><strong><Appel /></strong><p>Appel et WhatsApp — numéro du président. <Link href="/participer#contact">Formulaire de contact</Link>.</p></article>
        </div>
      </section>

      <section className="hub-section" id="en-detail">
        <SectionHead eyebrow="En détail" title="Ce qu’est l’association," em="comment elle s’organise, ce qu’elle vise." text="Le texte de référence de l’association, repris de la première version du site et mis à jour ici. Les origines du peuple bedjond, sa terre, son histoire et sa langue sont dans la rubrique Patrimoine." />
        <div className="legacy">
          <Toc items={toc} />
          <LegacySections sections={sections} />
        </div>
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="button secondary" href="/histoire#origines">Origines, terre, histoire et langue du peuple bedjond <span aria-hidden="true">→</span></Link></p>
      </section>
      <Partager route="/mission" titre="Notre mission" texte="Au service de tout le peuple bedjond, au Tchad et dans la diaspora : mission, valeurs, repères depuis 1986, bureau exécutif et organisation." />
    </main>
  );
}
