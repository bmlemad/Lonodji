import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { metaDescription, ogFor } from "@/lib/content";
import { chiffresOdeb } from "@/lib/odeb-chiffres";

export const metadata: Metadata = {
  title: "Patrimoine",
  description: metaDescription("La mémoire et les savoirs du pays bedjond : histoire, lieux sacrés, généalogies, témoignages, langue nangnda, bibliothèque et base de recherche."),
  alternates: { canonical: "/patrimoine" },
  openGraph: ogFor("/patrimoine"),
};

export default function Patrimoine() {
  const c = chiffresOdeb();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Patrimoine"
        title="La mémoire du pays bedjond,"
        em="et ce qui s’en écrit."
        lead="L’histoire, les lieux, les familles, la langue et les savoirs : ce que l’association recueille pour que les générations qui viennent en héritent. Tout est sourcé ; ce qui relève de la tradition orale est dit comme tel, et les lieux sacrés ne sont jamais localisés publiquement."
        pills={["Onze chefs de canton depuis Narmbang", `${c.references} références`, `${c.chercheurs} chercheurs`, "Dictionnaire nangnda en collecte"]}
      />
      <Stats items={[
        { value: "11", label: "chefs de canton", note: "de Narmbang à Donath Gari" },
        { value: String(c.references), label: "références", note: "thèses, articles, ouvrages, archives" },
        { value: String(c.chercheurs), label: "chercheurs", note: "qui ont écrit le pays bedjond" },
        { value: String(c.pdf), label: "documents PDF", note: "à lire et à imprimer" },
      ]} />

      <section className="hub-section" id="memoire">
        <SectionHead eyebrow="Mémoire" title="D’où nous venons," em="et qui s’en souvient." />
        <div className="link-list">
          <Link href="/histoire"><small>Histoire</small><strong>Histoire & grandes figures</strong><span>Bédjondo, berceau du peuple bedjond ; la lignée des chefs de canton, les fondateurs, les chercheurs.</span></Link>
          <Link href="/patrimoine/lieux-sacres"><small>Lieux</small><strong>Lieux sacrés et sépultures</strong><span>Les recenser pour les protéger, sans jamais les publier sur une carte.</span></Link>
          <Link href="/patrimoine/genealogies"><small>Familles</small><strong>Généalogies</strong><span>Le cahier de terrain pour écrire la généalogie de sa famille.</span></Link>
          <Link href="/patrimoine/genealogie-outil"><small>Outil</small><strong>Cahier généalogique en ligne</strong><span>Remplir sa généalogie dans le navigateur, sans envoi de données.</span></Link>
          <Link href="/temoignages"><small>Témoignages</small><strong>Racontez Bédjondo</strong><span>Un récit, une photo, une voix : rien n’est publié sans votre relecture.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="savoirs">
        <SectionHead eyebrow="Savoirs" title="La langue," em="et tout ce qui s’est écrit." />
        <div className="link-list">
          <Link href="/langue"><small>Langue</small><strong>La langue nangnda</strong><span>Ce que nous savons de la langue, le lexique sonore, et le dictionnaire numérique qui commence par vos mots.</span></Link>
          <Link href="/bibliotheque"><small>Bibliothèque</small><strong>Bibliothèque numérique bedjond</strong><span>{c.references} références, les publications de l’association, les chercheurs, et le dépôt de documents.</span></Link>
          <Link href="/patrimoine/base-de-recherche"><small>Base</small><strong>Base de recherche</strong><span>Chaque référence commentée : ce qu’elle apporte, où la trouver.</span></Link>
        </div>
      </section>

      <section className="hub-section">
        <p className="lg-footnote">Le patrimoine est porté par le Pôle I, <Link href="/programmes#pole-1">Mémoire, culture & patrimoine</Link>, et par le programme <Link href="/odeb/programmes/memoire-patrimoine">Mémoire et Patrimoine</Link> du projet ODEB.</p>
        <Partager route="/patrimoine" titre="Patrimoine — la mémoire du pays bedjond" texte="Histoire, lieux sacrés, généalogies, témoignages, la langue nangnda et la bibliothèque numérique." />
      </section>
    </main>
  );
}
