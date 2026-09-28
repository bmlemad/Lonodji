import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyDocument } from "../../../components/legacy-content";
import { getPage, hasPage, listDossierSlugs, metaDescription, ogFor } from "../../../lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return listDossierSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!hasPage(slug)) return {};
  const page = getPage(slug);
  return {
    title: page.title,
    description: metaDescription(page.description || page.lede),
    alternates: { canonical: `/dossiers/${slug}` },
    openGraph: { ...ogFor(`/dossiers/${slug}`), type: "article", title: page.title, description: metaDescription(page.description || page.lede) },
  };
}

export default async function Dossier({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasPage(slug)) notFound();
  const page = getPage(slug);
  return <LegacyDocument page={page} />;
}
