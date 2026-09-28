import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead } from "../../components/blocks";
import JournalList from "../../components/journal-list";
import { getIndex } from "../../lib/content";

export const metadata: Metadata = {
  title: "Le journal",
  description: "Articles, annonces, plaidoyers et lettre d’information d’ADEB LONODJI : la vie de l’association, la mémoire de Bédjondo et du peuple bedjond, les dossiers de développement du Mandoul Occidental.",
  alternates: { canonical: "/journal" },
};

export default function Journal() {
  const idx = getIndex();
  const latest = idx.articles[0];
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Le journal"
        title="Ce que nous écrivons,"
        em="et ce que nous rectifions."
        lead={`${idx.articles.length} articles depuis le 11 septembre 2026 : annonces de l’association, dossiers de plaidoyer, histoire de Bédjondo et du peuple bedjond, lettre d’information. Chaque article date ses faits et cite ses sources.`}
        pills={[`Dernier article : ${latest.dateLabel}`, "Lettre d’information n° 1 parue"]}
      />
      <JournalList articles={idx.articles} categories={idx.journalCategories} />
      <section className="hub-section">
        <SectionHead eyebrow="Recevoir et proposer" title="La lettre d’information," em="et vos articles." text="La lettre reprend l’essentiel du journal. Toute personne peut proposer un article : il est relu, sourcé et publié sous le nom de son auteur." />
        <div className="link-list">
          <Link href="/journal/2026-09-21-lettre-information-01"><small>Lettre d’information</small><strong>Lire le numéro 1</strong><span>Le premier numéro, paru le 21 septembre 2026.</span></Link>
          <Link href="/participer#proposer-article"><small>Contribuer</small><strong>Proposer un article</strong><span>Un formulaire dédié, une relecture, une publication signée.</span></Link>
          <Link href="/participer#newsletter"><small>S’abonner</small><strong>Recevoir les actualités</strong><span>Une adresse e-mail suffit ; désinscription à tout moment.</span></Link>
        </div>
      </section>
    </main>
  );
}
