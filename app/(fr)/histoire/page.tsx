import type { Metadata } from "next";
import Link from "@/components/lien";
import { ArticleCard, PageHeader, SectionHead } from "@/components/blocks";
import { LegacySections } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { getIndex, getPage, ogFor } from "@/lib/content";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Histoire, Bédjondo et patrimoine bedjond",
  description: "Bédjondo, berceau du peuple bedjond : lignée des chefs de canton, grandes figures, lieux sacrés, généalogies, base de recherche et articles d’histoire.",
  alternates: { canonical: "/histoire" },
  openGraph: ogFor("/histoire"),
};

const dossiers = [
  { href: "/territoire/bedjondo", label: "Bédjondo", note: "Le village devenu ville : repères, langue, statut de commune, carte interactive du pays bedjond." },
  { href: "/patrimoine/lieux-sacres", label: "Lieux sacrés", note: "Sites sacrés et sépultures à protéger, avec le cahier de recensement." },
  { href: "/patrimoine/genealogies", label: "Généalogies", note: "Écrire l’histoire de sa famille avec le cahier généalogique." },
  { href: "/patrimoine/genealogie-outil", label: "Cahier généalogique en ligne", note: "Saisie, vue par maison, liste de descendance, export : tout reste dans votre navigateur." },
  { href: "/patrimoine/base-de-recherche", label: "Base de recherche", note: "Quarante références sur le peuple sara, les Bedjond et leur langue, dont les travaux de Djarangar Djita Issa." },
  { href: "/association/ancienne-identite-visuelle", label: "Identité visuelle", note: "Logo, couleurs et signes : la carte des sept unités du cœur, la frise des onze chefs." },
  { href: "/association/evenements", label: "Événements", note: "Assemblées, lancements et rencontres : les dates annoncées et celles à fixer." },
];

const secondary = [
  ["Forums de développement", "Une publication de 2021 rapporte des forums organisés à Bédjondo et à Bébopen dans les années 2000 — cohérent avec les forums de 2000 et 2003 que l’association confirme."],
  ["Verger scolaire", "La même publication rapporte un verger au lycée de Bédjondo."],
  ["Éducation", "Sont rapportés un soutien en matériel didactique à l’école officielle de Bédjondo Kah, un don de ballons et une assistance financière à l’ECA de Bédjondo, ainsi qu’un don de cent tables-bancs au lycée de Bédjondo par Esso Tchad, sur proposition d’un membre fondateur."],
  ["Eau potable", "La publication rapporte une contribution au projet d’adduction d’eau potable porté par la commune de Bédjondo, et un forage manuel à Bédjondo Kah dans un cadre individuel."],
];

export default function Histoire() {
  const idx = getIndex();
  const figures = getPage("figures");
  const articles = idx.articles.filter((a) => ["memoire", "culture"].includes(a.category));
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Patrimoine · histoire & grandes figures"
        title="Bédjondo, berceau"
        em="du peuple bedjond."
        lead="Les Bedjond — « nangnda » de leur nom d’origine — ont pour berceau Bédjondo, dans le Mandoul Occidental, selon les travaux de Djarangar Djita Issa. Cette page rassemble ce que nous savons de leur histoire, ce qui reste à établir, et les personnes qui portent cette mémoire."
        pills={["Onze chefs de canton depuis Narmbang", `${articles.length} articles d’histoire et de culture`, "40 références en base de recherche"]}
      />

      <section id="dossiers">
        <SectionHead eyebrow="Les dossiers" title="Territoire, lieux," em="familles et sources." />
        <div className="link-list">
          {dossiers.map((d) => <Link key={d.href} href={d.href}><strong>{d.label}</strong><span>{d.note}</span></Link>)}
        </div>
      </section>

      <section className="hub-section" id="figures">
        <SectionHead eyebrow="Grandes figures" title="Celles et ceux" em="qui ont marqué notre histoire." text={figures.lede} />
        <div className="legacy">
          <LegacySections sections={figures.sections} />
        </div>
        <LegacyEnhance hasForms={figures.forms.length > 0} />
      </section>

      <section className="hub-section" id="pistes">
        <SectionHead eyebrow="Pistes à confirmer" title="Ce qu’une source secondaire" em="rapporte des années 2000." text="Une publication du 2 mai 2021, consacrée à Alladoum Désiré Nandogongar et le présentant comme membre fondateur d’ADEB LONODJI, rapporte plusieurs initiatives de l’association. Nous les conservons comme pistes, attribuées à leur source, jusqu’à ce qu’une pièce originale les confirme." />
        <div className="detail-grid">
          {secondary.map(([title, text]) => (
            <article key={title}><h3>{title}</h3><p>{text}</p><span className="status">Source secondaire · 2021</span></article>
          ))}
        </div>
        <div className="section-actions">
          <a className="text-link" href="https://talouchoufoumagazine.wordpress.com/2021/05/02/actu-alladoum-desire-nandogongar-le-premier-tchadien-a-occuper-le-poste-de-superintendant-des-operations-directeur-usine-dans-le-monde-petrolier-depuis-2020/" target="_blank" rel="noopener noreferrer">Consulter la publication de 2021 ↗</a>
        </div>
      </section>

      <section className="hub-section" id="articles">
        <SectionHead eyebrow="Le journal" title="Les articles" em="d’histoire et de culture." />
        <div className="art-grid">{articles.map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
      </section>
      <Partager route="/histoire" titre="Histoire, Bédjondo et patrimoine bedjond" texte="Bédjondo, berceau du peuple bedjond : lignée des chefs de canton, grandes figures, lieux sacrés, généalogies, base de recherche et articles d’histoire." />
    </main>
  );
}
