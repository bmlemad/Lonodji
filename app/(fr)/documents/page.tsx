import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { DocumentCard, PageHeader, SectionHead } from "@/components/blocks";
import { getIndex, ogFor, type DocumentItem } from "@/lib/content";
import { IDENTITE, ODEB } from "@/lib/odeb";
import { getMagazine } from "@/lib/magazine";
import { polesAElire } from "@/lib/election";

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
  const fiches: DocumentItem = { title: "Fiches de mission : vice-présidences de pilier, coordinations, cellules", status: "Recueil", meta: "1er octobre 2026 · A4 · 30 fiches · produites à partir de la structure publiée", description: "Une fiche par poste — six vice-présidences de pilier, pourvues par élection, vingt-deux coordinations de thématique, deux cellules transversales — avec le rôle, le périmètre, les quatre étapes et le lien pour candidater ; l’état pourvu ou à pourvoir est celui du site à la date de la fiche.", pdf: "/missions/fiches-de-mission-adeb-lonodji.pdf", links: [{ label: "Les fiches une par une", href: "/programmes/fiches-de-mission" }, { label: "Nos actions", href: "/programmes" }] };
  const affiches: DocumentItem = { title: "Affiches « Retrouvez votre village »", status: "À imprimer", meta: "29 septembre 2026 · A4 · quinze affiches", description: "Une affiche par unité et une affiche générale, avec un code QR vers les villages et l’adresse en toutes lettres, pour les chefs, les relais, les écoles et les centres de santé ; chaque fiche de village s’imprime aussi telle quelle.", pdf: "/carte/affiches/affiche-villages.pdf", links: [{ label: "Les quinze affiches", href: "/villages#affiches" }, { label: "Les villages", href: "/villages" }] };
  const mag = getMagazine().numeros[0];
  const magazine: DocumentItem[] = mag ? [{ title: `Lonodji n° ${mag.numero}, le magazine trimestriel`, status: "Magazine", meta: `${mag.parutionLabel} · A4 · ${mag.pages} pages`, description: `${mag.titre} : ${mag.chapo} Avec les décisions du trimestre, l’état des plaidoyers, un grand format, la mémoire et la culture bedjond, et les postes ouverts.`, pdf: mag.pdf, links: [{ label: "Tous les numéros", href: "/magazine" }, { label: "La lettre mensuelle", href: "/lettre" }] }] : [];
  const organisation: DocumentItem[] = [
    { title: "Compte rendu du bureau exécutif du 18 septembre 2026", status: "Version non signée", meta: "CR-BE-2026-01 · A4 · 6 pages", description: "Réunion du bureau exécutif élargi à N’Djamena : état de l’association, réactivation et modernisation, principe de la transformation progressive en ODEB LONODJI sous réserve de l’assemblée générale, six résolutions, mandat du Comité de réactivation et chronogramme jusqu’à l’assemblée générale de relance. Tous les participants ont approuvé ce texte, qui ne changera pas ; la version signée sera publiée ici dès que possible.", pdf: "/organisation/compte-rendu-bureau-2026-09-18.pdf", links: [{ label: "Registre des décisions", href: "/transparence/decisions" }] },
    { title: "Élection des vice-présidences de pilier : procédure et appel", status: "Adoptée", meta: "1er octobre 2026 · A4 · procédure, calendrier, fiche de candidature", description: `Les règles adoptées par le bureau exécutif pour élire les vice-présidences des piliers ${polesAElire()} — qui se présente, qui vote, comment —, le calendrier (candidatures du 2 au 15 octobre 2026, vote le 22) et la fiche de candidature à imprimer.`, pdf: "/organisation/election-vice-presidences-2026.pdf", links: [{ label: "La page de l’élection", href: "/association/election-vice-presidences" }, { label: "La fiche de candidature seule", href: "/organisation/fiche-candidature-vice-presidence.pdf" }] },
    { title: "Plans annuels des sept thématiques prioritaires", status: "À compléter", meta: "1er octobre 2026 · A4 · un plan par priorité", description: "Le modèle adopté par le bureau exécutif, prérempli avec les plaidoyers, leurs destinataires, les engagements écrits de l’association et les chantiers de la commune ; les titulaires y fixent échéances, responsables, moyens et indicateurs.", pdf: "/organisation/plans-annuels-priorites.pdf", links: [{ label: "Décisions d’organisation", href: "/association/propositions-organisation#mise-en-oeuvre" }] },
  ];
  const available = [...magazine, ...organisation, ...docs.filter((d) => d.pdf), livreBlanc, charte, presentation, fiches, affiches];
  const pending = docs.filter((d) => !d.pdf);
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Association · documents"
        crumbs={[{ label: "L’association", href: "/mission" }, { label: "Documents" }]}
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
          <Link className="button primary" href="/participer#contact">Nous transmettre un document <span aria-hidden="true">→</span></Link>
          <Link className="button secondary" href="/transparence">Notre charte de redevabilité <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <Partager route="/documents" titre="Documents d’ADEB LONODJI" texte="Kit d’adhésion, cahiers de terrain, dossier de présentation, note à la commune et plaidoyers en PDF ; statuts et procès-verbaux dès leur validation." />
    </main>
  );
}
