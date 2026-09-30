import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { metaDescription, ogFor } from "@/lib/content";
import { chiffresOdeb } from "@/lib/odeb-chiffres";

export const metadata: Metadata = {
  title: "Territoire",
  description: metaDescription("Le pays bedjond, unité par unité : la carte, les fiches des villages, Bédjondo, la décentralisation, l’observatoire du Mandoul Occidental, le diagnostic territorial, les besoins signalés et les enquêtes de terrain."),
  alternates: { canonical: "/territoire" },
  openGraph: ogFor("/territoire"),
};

const nf = new Intl.NumberFormat("fr-FR");

export default function Territoire() {
  const c = chiffresOdeb();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Territoire"
        title="Le pays bedjond,"
        em="ce qu’on en sait et ce qui manque."
        lead="Tout ce que le site dit du territoire, rangé au même endroit : où sont les villages, ce qu’ils ont et n’ont pas, ce que nous avons diagnostiqué et ce qu’il reste à enquêter. Les données viennent de sources ouvertes et de vos signalements ; les lieux sacrés ne figurent jamais sur la carte publique."
        pills={[`${c.unites} unités`, `${nf.format(c.localites)} localités cartographiées`, `${nf.format(c.fiches)} fiches de villages`, `${c.problematiques} problématiques documentées`]}
      />
      <Stats items={[
        { value: String(c.unites), label: "unités du pays bedjond", note: "du cœur de Bédjondo à la diaspora" },
        { value: nf.format(c.localites), label: "localités cartographiées", note: `dont ${nf.format(c.fiches)} avec une fiche` },
        { value: String(c.problematiques), label: "problématiques documentées", note: `${c.chantiersPrioritaires} chantiers prioritaires` },
        { value: String(c.inconnues), label: "inconnues à enquêter", note: "une enquête de terrain pour chacune" },
      ]} />

      <section className="hub-section" id="pays">
        <SectionHead eyebrow="Le pays bedjond" title="Où, et" em="village par village." />
        <div className="link-list">
          <Link href="/carte"><small>Carte</small><strong>Carte du territoire</strong><span>Quatorze unités, les localités et les équipements connus, sur une carte que l’on peut parcourir.</span></Link>
          <Link href="/villages"><small>Fiches</small><strong>Les villages</strong><span>Une fiche par localité : ce que les données ouvertes en savent, ce que le site en dit, ce qui reste à documenter.</span></Link>
          <Link href="/territoire/bedjondo"><small>Dossier</small><strong>Bédjondo, village devenu ville</strong><span>Le chef-lieu, sa croissance, ce qui manque à une ville qui a grandi plus vite que ses équipements.</span></Link>
          <Link href="/territoire/decentralisation"><small>Dossier</small><strong>Décentralisation & développement local</strong><span>Commune, canton, sous-préfecture : qui décide de quoi, et où se pose chaque demande.</span></Link>
          <Link href="/territoire/propositions-commune"><small>Propositions</small><strong>Nos propositions à la commune de Bédjondo</strong><span>Planifier, financer, ouvrir le conseil, les services de base, les partenariats, un premier chantier : tout ce que nous proposons à la mairie, sur une page.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="comprendre">
        <SectionHead eyebrow="Comprendre et mesurer" title="Ce qui manque," em="et comment on le sait." />
        <div className="link-list">
          <Link href="/observatoire"><small>Observatoire</small><strong>Observatoire du Mandoul Occidental</strong><span>Le territoire en chiffres, unité par unité, et l’état de ce qu’on en sait.</span></Link>
          <Link href="/territoire/diagnostic"><small>Diagnostic</small><strong>Diagnostic territorial</strong><span>{c.problematiques} problématiques classées par domaine — eau, santé, école, routes, réseau — et {c.chantiersPrioritaires} chantiers prioritaires.</span></Link>
          <Link href="/territoire/besoins"><small>Signalements</small><strong>Carte des besoins</strong><span>Signaler ce qui manque chez vous ; seules la localité et la nature du besoin sont publiées.</span></Link>
          <Link href="/territoire/enquetes"><small>Enquêtes</small><strong>Enquêtes de terrain</strong><span>{c.inconnues} inconnues, une enquête pour chacune, et le carnet pour les mener.</span></Link>
        </div>
      </section>

      <section className="hub-section">
        <p className="lg-footnote">Le territoire nourrit nos <Link href="/actions">plaidoyers</Link> et nos <Link href="/projets">projets</Link> ; sa mémoire est dans la rubrique <Link href="/patrimoine">Patrimoine</Link>.</p>
        <Partager route="/territoire" titre="Territoire — le pays bedjond" texte="La carte, les villages, Bédjondo, l’observatoire du Mandoul Occidental et le diagnostic territorial." />
      </section>
    </main>
  );
}
