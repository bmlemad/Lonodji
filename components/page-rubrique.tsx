import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideInstallation from "@/components/guide-installation";
import { LegacyDocument } from "@/components/legacy-content";
import { getIndex, getPage, metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";

/* Pages de fond reprises de l'ancien site, servies dans leur rubrique (restructuration du 29/09/2026) :
   /projets/…, /programmes/…, /territoire/…, /patrimoine/…, /association/…, /participer/…
   L'adresse de chaque page vient de content/routes-dossiers.json, via l'index (route). */
function pageDe(route: string) {
  return getIndex().pages.find((p) => p.kind === "dossier" && p.route === route);
}

export function rubrique(prefixe: string) {
  return {
    generateStaticParams() {
      return getIndex().pages.filter((p) => p.kind === "dossier" && p.route.startsWith(prefixe + "/")).map((p) => ({ slug: p.route.slice(prefixe.length + 1) }));
    },
    async generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
      const route = `${prefixe}/${(await params).slug}`;
      const p = pageDe(route);
      if (!p) return {};
      const page = getPage(p.slug);
      return {
        title: page.title,
        description: metaDescription(page.description || page.lede),
        alternates: { canonical: route, languages: alternatesLangues(route) },
        openGraph: { ...ogFor(route), type: "article", title: page.title, description: metaDescription(page.description || page.lede) },
      };
    },
    async Page({ params }: { params: Promise<{ slug: string }> }) {
      const p = pageDe(`${prefixe}/${(await params).slug}`);
      if (!p) notFound();
      return <LegacyDocument page={getPage(p.slug)}>{p.route === "/projets/application" ? <GuideInstallation /> : null}</LegacyDocument>;
    },
  };
}
