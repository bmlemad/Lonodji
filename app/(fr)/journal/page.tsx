import { getLettres } from "@/lib/lettres";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import JournalList from "@/components/journal-list";
import { getIndex, ogFor } from "@/lib/content";
import Partager from "@/components/partager";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Le journal",
  description: "Articles, annonces, plaidoyers et lettre d’information : la vie de l’association, la mémoire bedjond et les dossiers de développement du Mandoul Occidental.",
  alternates: { canonical: "/journal" },
  openGraph: ogFor("/journal"),
};

export default function Journal() {
  const idx = getIndex();
  const latest = idx.articles[0];
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org",
        "@graph": [
          webPageSchema({ url: "/journal", name: "Le journal", description: "Articles, annonces, plaidoyers et lettre d’information : la vie de l’association, la mémoire bedjond et les dossiers de développement du Mandoul Occidental." }),
          breadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Le journal" },
          ], "/journal"),
        ],
      }) }} />
      <PageHeader
        eyebrow="Journal"
        title="Ce que nous écrivons,"
        em="et ce que nous rectifions."
        lead={`${idx.articles.length} articles depuis le 11 septembre 2026 : annonces de l’association, dossiers de plaidoyer, histoire de Bédjondo et du peuple bedjond, lettre d’information. Chaque article date ses faits et cite ses sources.`}
        pills={[`Dernier article : ${latest.dateLabel}`, `Lettre d’information n° ${getLettres().lettres.length} parue`]}
      />
      <JournalList articles={idx.articles} categories={idx.journalCategories} />
      <section className="hub-section">
        <SectionHead eyebrow="Recevoir et proposer" title="La lettre d’information," em="et vos articles." text="La lettre reprend l’essentiel du journal. Toute personne peut proposer un article : il est relu, sourcé et publié sous le nom de son auteur." />
        <div className="link-list">
          <Link href="/lettre"><small>Lettre d’information</small><strong>Tous les numéros, l’abonnement, les PDF</strong><span>Chaque mois, ce que l’association a publié, décidé ou ouvert ; le PDF se transmet tel quel sur WhatsApp.</span></Link>
          <Link href="/participer#proposer"><small>Contribuer</small><strong>Proposer un article</strong><span>Un formulaire dédié, une relecture, une publication signée.</span></Link>
          <Link href="/participer#newsletter"><small>S’abonner</small><strong>Recevoir les actualités</strong><span>Une adresse e-mail suffit ; désinscription à tout moment.</span></Link>
        </div>
      </section>
      <Partager route="/journal" titre="Le journal" texte="Articles, annonces, plaidoyers et lettre d’information : la vie de l’association, la mémoire bedjond et les dossiers de développement du Mandoul Occidental." />
    </main>
  );
}
