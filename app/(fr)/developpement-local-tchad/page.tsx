import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { enLettres, filledCount, getIndex, metaDescription, ogFor, thematiqueCount } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

/* Page de fond pour la recherche nationale et internationale (18/10/2026) : développement local et communautaire au
   Tchad, diaspora tchadienne, patrimoine du Mandoul. Tous les chiffres viennent des données du site ; chaque section
   renvoie aux pages qui en font preuve. */

const ROUTE = "/developpement-local-tchad";
const TITRE = "Développement local et communautaire au Tchad : l’exemple du pays bedjond";
const DESCRIPTION = metaDescription("Comment une association communautaire du Mandoul, au sud du Tchad, et sa diaspora documentent les besoins d’un territoire, préservent son patrimoine et portent des plaidoyers sourcés : méthode, données et pages de référence.");

export const metadata: Metadata = {
  title: "Développement local au Tchad : Mandoul, diaspora, patrimoine",
  description: DESCRIPTION,
  keywords: ["développement local Tchad", "développement communautaire Tchad", "Mandoul", "Mandoul Occidental", "diaspora tchadienne", "patrimoine du Mandoul", "association Tchad", "sud du Tchad", "Bédjondo"],
  alternates: { canonical: ROUTE },
  openGraph: { ...ogFor(ROUTE), title: TITRE, description: DESCRIPTION },
};

export default function DeveloppementLocal() {
  const idx = getIndex();
  const c = getIndicateurs().contenu;
  const fr = new Intl.NumberFormat("fr-FR");
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: TITRE, description: DESCRIPTION }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Territoire", url: "/territoire" }, { name: "Développement local au Tchad" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow="Tchad · Mandoul · diaspora"
        title="Développement local et communautaire au Tchad,"
        em="l’exemple du pays bedjond."
        lead="ADEB LONODJI est une association communautaire née à Bédjondo, dans le département du Mandoul Occidental, au sud du Tchad, et ouverte à la diaspora tchadienne qui en est issue. Cette page présente sa méthode à qui s’intéresse au développement local au Tchad : partir des besoins documentés d’un territoire, publier ses sources, distinguer ce qui est promis de ce qui est fait, et associer la diaspora."
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Développement local au Tchad" }]}
        pills={["Sud du Tchad", "Mandoul Occidental", "Diaspora tchadienne", "Patrimoine"]}
      />
      <Stats items={[
        { value: fr.format(c.carte.localitesNommees), label: "localités nommées", note: `sur ${fr.format(c.carte.localites)} cartographiées, dans ${c.carte.unites} unités` },
        { value: String(c.problematiques.total), label: "problématiques recensées", note: `${c.problematiques.documentees} documentées, sources citées` },
        { value: String(c.plaidoyers.publies), label: "plaidoyers publiés", note: "chacun avec ses destinataires et ses sources" },
        { value: `${filledCount(idx)}/${thematiqueCount(idx)}`, label: "thématiques coordonnées", note: "chacune avec un coordonnateur bénévole" },
      ]} />

      <section className="hub-section" id="territoire">
        <SectionHead eyebrow="Un territoire du sud du Tchad" title="Partir des besoins," em="localité par localité." text={`Le pays bedjond s’étend autour de Bédjondo, chef-lieu du Mandoul Occidental, et jusque dans le Logone Oriental. L’association en a dressé la carte à partir des données ouvertes : ${fr.format(c.carte.localitesNommees)} localités nommées, chacune avec sa fiche, et ${c.carte.equipements} équipements relevés. Le diagnostic croise ces données avec les besoins signalés par les habitants.`} />
        <div className="link-list">
          <Link href="/villages"><small>Données</small><strong>Les fiches des villages</strong><span>Chaque localité, ses voisines et les équipements connus.</span></Link>
          <Link href="/territoire/diagnostic"><small>Diagnostic</small><strong>Ce que l’on sait, ce que l’on ignore</strong><span>Eau, santé, école, routes, énergie : état des lieux sourcé.</span></Link>
          <Link href="/observatoire"><small>Observatoire</small><strong>Observatoire du Mandoul Occidental</strong><span>Indicateurs publics et leurs sources.</span></Link>
          <Link href="/territoire/besoins"><small>Participation</small><strong>Signaler un besoin</strong><span>Les habitants signalent ; l’association documente.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="methode">
        <SectionHead eyebrow="Développement communautaire" title="Une méthode vérifiable," em="du plaidoyer à la réalisation." text={`L’association s’organise en six piliers et ${enLettres(thematiqueCount(idx))} thématiques alignées sur les Objectifs de développement durable et la nomenclature des bailleurs. Chaque plaidoyer cite ses sources et nomme ses destinataires ; chaque engagement est suivi publiquement, et rien n’est présenté comme réalisé avant d’être confirmé.`} />
        <div className="link-list">
          <Link href="/programmes"><small>Programmes</small><strong>Piliers et thématiques</strong><span>Eau, santé, éducation, agriculture, gouvernance, patrimoine…</span></Link>
          <Link href="/actions"><small>Plaidoyers</small><strong>Les dossiers de plaidoyer</strong><span>Textes, chiffres, sources et destinataires.</span></Link>
          <Link href="/impact"><small>Suivi</small><strong>Tableau de suivi</strong><span>Ce qui est publié, transmis, réalisé.</span></Link>
          <Link href="/bailleurs"><small>Bailleurs</small><strong>Les programmes des bailleurs au Tchad</strong><span>Où une association locale peut se raccrocher.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="diaspora">
        <SectionHead eyebrow="Diaspora tchadienne" title="La diaspora," em="un pont vers le terroir." text="Une part du peuple bedjond vit à N’Djamena, dans d’autres régions du Tchad et à l’étranger. L’association recense les compétences de cette diaspora tchadienne et les met au service de projets décidés avec les habitants : santé, ingénierie, droit, numérique, agriculture, financement." />
        <div className="link-list">
          <Link href="/diaspora"><small>Répertoire</small><strong>Répertoire des compétences</strong><span>Proposer son savoir-faire, de loin ou sur place.</span></Link>
          <Link href="/participer"><small>Agir</small><strong>Participer</strong><span>Adhérer, coordonner, proposer un article ou un projet.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="patrimoine">
        <SectionHead eyebrow="Patrimoine du Mandoul" title="Une mémoire," em="une langue, des lieux." text="Le patrimoine bedjond fait partie du patrimoine du Mandoul et du sud du Tchad : histoire des chefferies et des fondateurs, langue nangnda, rites, généalogies. L’association le documente avec ses sources et ne publie jamais l’emplacement des lieux sacrés ni des sépultures." />
        <div className="link-list">
          <Link href="/histoire"><small>Histoire</small><strong>Histoire et grandes figures</strong><span>De 1986 à la réactivation de 2026.</span></Link>
          <Link href="/langue"><small>Langue</small><strong>La langue nangnda</strong><span>Lexique à écouter, dictionnaire à enrichir.</span></Link>
          <Link href="/patrimoine"><small>Patrimoine</small><strong>Patrimoine bedjond</strong><span>Lieux, rites, généalogies, base de recherche.</span></Link>
          <Link href="/bibliotheque"><small>Sources</small><strong>Bibliothèque numérique</strong><span>Les documents et leurs références.</span></Link>
        </div>
      </section>
      <Partager route={ROUTE} titre={TITRE} texte={DESCRIPTION} />
    </main>
  );
}
