import type { Metadata } from "next";
import { ogFor } from "@/lib/content";
import { PageHeader } from "@/components/blocks";
import SiteSearch from "@/components/site-search";

export const metadata: Metadata = {
  title: "Rechercher dans le site",
  description: "Recherche dans toutes les pages, articles, thématiques, plaidoyers et documents d’ADEB LONODJI.",
  alternates: { canonical: "/recherche" },
  openGraph: ogFor("/recherche"),
  robots: { index: false, follow: true },
};

export default function Recherche() {
  return (
    <main id="main-content" className="hub-page">
      <PageHeader eyebrow="Recherche" title="Chercher" em="dans tout le site." lead="Pages, articles du journal, vingt thématiques, plaidoyers et documents. Tout se calcule dans votre navigateur ; rien n’est envoyé." />
      <SiteSearch />
    </main>
  );
}
