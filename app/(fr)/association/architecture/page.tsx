import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import Partager from "@/components/partager";
import architecture from "@/content/architecture.json";
import { enLettres, getIndex, ogFor } from "@/lib/content";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

const ROUTE = "/association/architecture";
export const metadata: Metadata = {
  title: "Architecture institutionnelle — les piliers stratégiques",
  description: architecture.signature,
  alternates: { canonical: ROUTE },
  openGraph: { ...ogFor(ROUTE), title: architecture.titre, description: architecture.signature },
};

export default function Architecture() {
  const piliers = getIndex().structure.poles;
  return <main id="main-content" className="hub-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: architecture.titre, description: architecture.signature }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "L’association", url: "/mission" }, { name: "Architecture institutionnelle" }], ROUTE)] }) }} />
    <PageHeader eyebrow="ADEB LONODJI · architecture institutionnelle définitive" title={`${enLettres(architecture.piliers.length, true)} piliers stratégiques,`} em="un avenir commun." lead={architecture.signature} />
    <nav className="section-actions" aria-label="Les piliers stratégiques">
      {architecture.piliers.map((pilier) => <Link key={pilier.roman} href={`#pilier-${pilier.roman.toLowerCase()}`}>{pilier.roman} · {pilier.mot}</Link>)}
    </nav>
    {architecture.piliers.map((pilier) => <section className="pole-block" key={pilier.roman} id={`pilier-${pilier.roman.toLowerCase()}`} aria-labelledby={`titre-pilier-${pilier.roman}`}>
      <header><span className="pole-roman" aria-hidden="true">{pilier.roman}</span><div>
        <p className="eyebrow">Pilier stratégique {pilier.roman}</p>
        <h2 id={`titre-pilier-${pilier.roman}`}>{pilier.nom}</h2>
        <p>{pilier.mission}</p>
        <ul>{piliers.find((p) => p.roman === pilier.roman)?.items.map((t) => <li key={t.id}><Link href={`/programmes#${t.id}`}>{t.number} · {t.name}</Link></li>)}</ul>
      </div></header>
    </section>)}
    <section className="hub-section" id="referentiel-international">
      <SectionHead eyebrow="Référentiel international" title="La culture et" em="le développement durable." />
      <p>Le pilier I s’appuie sur les cadres de l’UNESCO relatifs à la culture, au patrimoine, à la diversité culturelle, à la transmission des savoirs, aux langues et à la mémoire. Les piliers II à VI s’inscrivent dans un alignement sur les 17 Objectifs de développement durable des Nations Unies.</p>
      <p>Ces références orientent les missions d’ADEB LONODJI et leur suivi. Elles expriment un alignement choisi par l’association, sans constituer une certification ni un partenariat avec ces institutions.</p>
      <ul>{architecture.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.titre} ↗</a></li>)}</ul>
    </section>
    <section className="hub-section" id="signature-institutionnelle">
      <SectionHead eyebrow="Signature institutionnelle" title="ADEB LONODJI" em="au service du peuple bedjond." />
      <p><strong>{architecture.signature}</strong></p>
      <p>{architecture.piliers.map((pilier) => pilier.mot).join(" • ")}</p>
      <p>Cette architecture est le référentiel commun destiné aux statuts, au site web, aux organigrammes et à la Vision 2030 d’ADEB LONODJI.</p>
      <p>Les piliers définissent les finalités stratégiques. Les thématiques, programmes, missions et responsabilités en constituent la mise en œuvre. Les thématiques sont rattachées ci-dessus à leur pilier de référence. Le numérique et l’innovation appuient plusieurs piliers : compétences au II, connectivité au III, données et intelligence artificielle au VI. Les nominations et décisions datées restent traçables dans le registre.</p>
      <p><a className="text-link" href="/organisation/architecture-institutionnelle-adeb-lonodji.pdf" download>Référentiel institutionnel (PDF) ↓</a></p>
      <p className="button-row"><Link className="button primary" href="/programmes">Les thématiques et leurs responsables</Link><Link className="button secondary" href="/odeb">Vision 2030</Link></p>
    </section>
    <p className="lg-footnote">Formulation institutionnelle communiquée le 6 octobre 2026. <Link href="/transparence/decisions">Consulter le registre public</Link>.</p>
    <Partager titre={architecture.titre} texte={architecture.signature} />
  </main>;
}
