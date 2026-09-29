import type { Metadata } from "next";
import Link from "@/components/lien";
import { DocumentCard, PageHeader, SectionHead } from "../../components/blocks";
import { getIndex, ogFor, type DocumentItem } from "../../lib/content";
import { IDENTITE, ODEB } from "../../lib/odeb";

export const metadata: Metadata = {
  title: "Documents à télécharger",
  description: "Kit d’adhésion, cahiers de terrain, dossier de présentation, note à la commune et plaidoyers en PDF ; statuts et procès-verbaux dès leur validation.",
  alternates: { canonical: "/documents" },
  openGraph: ogFor("/documents"),
};

export default function Documents() {
  const docs = getIndex().documents;
  /* Documents produits hors de l'ancien site : le livre blanc du projet ODEB (version de travail). */
  const livreBlanc: DocumentItem = { title: "Livre blanc du projet ODEB LONODJI", status: "Version de travail", meta: `${ODEB.presenteLabel} · A4 · produit à partir de la page en ligne`, description: "Le document fondateur de l’Organisation pour le Développement et l’Émergence Bedjonde : d’où nous partons, pourquoi une organisation, la vision 2030, six missions, six programmes, principes, ressources et feuille de route. Non adopté à ce jour.", pdf: ODEB.livreBlancPdf, links: [{ label: "Lire en ligne", href: "/odeb/livre-blanc" }, { label: "Le projet ODEB", href: "/odeb" }] };
  const charte: DocumentItem = { title: "Identité visuelle du projet ODEB LONODJI", status: "Charte", meta: `${IDENTITE.retenueLabel} · A4 · produite à partir de la page en ligne`, description: "Le logo « Les Pas vers l’Avenir » — trois empreintes vers un soleil levant —, ses versions, sa zone de protection, ses tailles minimales, ses couleurs, ses polices et ses règles d’usage ; le kit de fichiers et le papier à en-tête.", pdf: IDENTITE.charte, links: [{ label: "La page en ligne et le kit", href: IDENTITE.page }, { label: "Le projet ODEB", href: "/odeb" }] };
  const presentation: DocumentItem = { title: "Présentation du projet ODEB LONODJI à l’assemblée", status: "Diaporama", meta: `29 septembre 2026 · ${IDENTITE.presentation.diapositives} diapositives · PDF et PowerPoint`, description: "Le projet en diapositives, faites depuis les pages du site : pourquoi, les cinq repères 2030, les six missions, les six programmes et leurs axes, les cinq règles du programme 06 à voter, qui porte le projet, la feuille de route et les décisions attendues.", pdf: IDENTITE.presentation.pdf, links: [{ label: "Version PowerPoint", href: IDENTITE.presentation.pptx }, { label: "Le projet ODEB", href: "/odeb#presentation" }] };
  const fiches: DocumentItem = { title: "Fiches de mission : directions de pôle, coordinations, cellules", status: "Recueil", meta: "29 septembre 2026 · A4 · 26 fiches · produites à partir de la structure publiée", description: "Une fiche par poste — quatre directions de pôle au rang de chef de projet, vingt coordinations de thématique, deux cellules transversales — avec le rôle, le périmètre, les quatre étapes et le lien pour candidater ; l’état pourvu ou à pourvoir est celui du site à la date de la fiche.", pdf: "/missions/fiches-de-mission-adeb-lonodji.pdf", links: [{ label: "Les fiches une par une", href: "/programmes/fiches-de-mission" }, { label: "Nos actions", href: "/programmes" }] };
  const affiches: DocumentItem = { title: "Affiches « Retrouvez votre village »", status: "À imprimer", meta: "29 septembre 2026 · A4 · quinze affiches", description: "Une affiche par unité et une affiche générale, avec un code QR vers les villages et l’adresse en toutes lettres, pour les chefs, les relais, les écoles et les centres de santé ; chaque fiche de village s’imprime aussi telle quelle.", pdf: "/carte/affiches/affiche-villages.pdf", links: [{ label: "Les quinze affiches", href: "/villages#affiches" }, { label: "Les villages", href: "/villages" }] };
  const available = [...docs.filter((d) => d.pdf), livreBlanc, charte, presentation, fiches, affiches];
  const pending = docs.filter((d) => !d.pdf);
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Transparence & gouvernance"
        title="Nos documents,"
        em="à lire et à imprimer."
        lead="Tout ce que l’association publie tient ici, au format PDF : outils de terrain, dossier de présentation, note à la commune et les huit plaidoyers. Les pièces constitutives suivront à mesure qu’elles seront adoptées."
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
