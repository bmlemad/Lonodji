import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Timeline } from "@/components/blocks";
import { LegacySections, Toc } from "@/components/legacy-content";
import { getIndex, getPage, ogFor, ORG } from "@/lib/content";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Notre mission",
  description: "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond : mission, valeurs, repères depuis 1986, bureau exécutif et organisation.",
  alternates: { canonical: "/mission", languages: alternatesLangues("/mission") },
  openGraph: ogFor("/mission"),
};

const values = [
  ["Courage", "Oser agir, prendre des responsabilités et avancer avec détermination, y compris quand il faut dire ce qui manque."],
  ["Discipline", "Transformer les intentions en actions concrètes, régulières et durables : une thématique, un coordonnateur, un compte rendu."],
  ["Héritage", "Transmettre la langue, l’histoire et les valeurs du peuple bedjond, et laisser à Bédjondo plus que ce que nous avons trouvé."],
];

export default function Mission() {
  const idx = getIndex();
  const page = getPage("mission");
  /* Les repères historiques de l'ancien site sont déjà dans la frise ci-dessus : on ne les répète pas plus bas. */
  const DOUBLON = "dune-association-a-un-cadre-federateur";
  const sections = page.sections.filter((s) => s.id !== DOUBLON);
  const toc = (page.toc ?? []).filter((t) => t.href !== `#${DOUBLON}`);
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="01 — Qui nous sommes"
        title="L’association de Bédjondo et de sa diaspora,"
        em="gardienne du patrimoine bedjond."
        lead={page.lede || "Reconnue en 1995 après dix ans de réflexion, remise en mouvement en 2026, ADEB LONODJI agit pour tous les habitants de Bédjondo — eau, santé, école, routes — et garde au cœur de son objet la sauvegarde de la langue, de l’histoire et du patrimoine bedjond."}
        pills={["Reconnue en 1995 · autorisation actuelle en vérification", "Réactivée en 2026", "4 pôles · 20 thématiques"]}
      />
      <div className="detail-grid">
        {values.map(([title, text], i) => (
          <article key={title}><span>0{i + 1}</span><h2>{title}</h2><p>{text}</p></article>
        ))}
      </div>

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
          <article className="bureau-card"><small>Contact officiel</small><strong><a href={ORG.phoneHref}>{ORG.phone}</a></strong><p>Appel et WhatsApp — numéro du président. <Link href="/participer#contact">Formulaire de contact</Link>.</p></article>
        </div>
      </section>

      <section className="hub-section" id="en-detail">
        <SectionHead eyebrow="En détail" title="Origines, territoire," em="organisation et objectifs." text="Le texte de référence de l’association, repris de la première version du site et mis à jour ici." />
        <div className="legacy">
          <Toc items={toc} />
          <LegacySections sections={sections} />
        </div>
      </section>
      <Partager route="/mission" titre="Notre mission" texte="L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond : mission, valeurs, repères depuis 1986, bureau exécutif et organisation." />
    </main>
  );
}
