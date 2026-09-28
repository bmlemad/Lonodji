import type { Metadata } from "next";
import Link from "next/link";
import { DocumentCard, PageHeader, SectionHead } from "../../components/blocks";
import { getIndex, ogFor, type DocumentItem } from "../../lib/content";
import { ODEB } from "../../lib/odeb";

export const metadata: Metadata = {
  title: "Documents à télécharger",
  description: "Kit d’adhésion, cahiers de terrain, dossier de présentation, note à la commune et plaidoyers en PDF ; statuts et procès-verbaux dès leur validation.",
  alternates: { canonical: "/documents" },
  openGraph: ogFor("/documents"),
};

export default function Documents() {
  const docs = getIndex().documents;
  /* Documents produits hors de l'ancien site : le livre blanc du projet ODEB (version de travail). */
  const livreBlanc: DocumentItem = { title: "Livre blanc du projet ODEB LONODJI", status: "Version de travail", meta: `${ODEB.presenteLabel} · A4 · produit à partir de la page en ligne`, description: "Le document fondateur de l’Organisation pour le Développement et l’Émergence Bedjonde : d’où nous partons, pourquoi une organisation, la vision 2030, six missions, cinq programmes, principes, ressources et feuille de route. Non adopté à ce jour.", pdf: ODEB.livreBlancPdf, links: [{ label: "Lire en ligne", href: "/odeb/livre-blanc" }, { label: "Le projet ODEB", href: "/odeb" }] };
  const available = [...docs.filter((d) => d.pdf), livreBlanc];
  const pending = docs.filter((d) => !d.pdf);
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Transparence & gouvernance"
        title="Nos documents,"
        em="à lire et à imprimer."
        lead="Tout ce que l’association publie tient ici, au format PDF : outils de terrain, dossier de présentation, note à la commune et les sept plaidoyers. Les pièces constitutives suivront à mesure qu’elles seront adoptées."
        pills={[`${available.length} PDF disponibles`, `${pending.length} à venir`]}
      />
      <section id="disponibles">
        <SectionHead eyebrow="Disponibles" title="Notes, propositions" em="et outils de terrain." />
        <div className="doc-grid">{available.map((d) => <DocumentCard key={d.title} d={d} />)}</div>
      </section>
      <section className="hub-section" id="a-venir">
        <SectionHead eyebrow="Documents constitutifs" title="Ce qui sera publié" em="dès validation." text="Les statuts, le règlement intérieur, les procès-verbaux d’assemblée générale et les rapports d’activité seront publiés ici sitôt adoptés ; nous préférons l’annoncer plutôt que d’afficher des documents provisoires." />
        <div className="doc-grid">{pending.map((d) => <DocumentCard key={d.title} d={d} />)}</div>
      </section>
      <section className="hub-section">
        <SectionHead eyebrow="Aidez-nous" title="Vous détenez une pièce" em="de notre histoire ?" text="Récépissé de 1995, statuts d’origine, photographies des forums de 2000 et 2003, comptes rendus : chaque document retrouvé sera versé aux archives avec sa provenance." />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/participer#contact">Nous transmettre un document <span aria-hidden="true">↗</span></Link>
          <Link className="button secondary" href="/transparence">Notre charte de redevabilité <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
