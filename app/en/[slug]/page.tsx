import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyDocument } from "../../../components/legacy-content";
import { getPage, hasPage, listEnSlugs, metaDescription, ogFor } from "../../../lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return listEnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!hasPage("en/" + slug)) return {};
  const page = getPage("en/" + slug);
  return { title: page.title, description: metaDescription(page.description || page.lede), alternates: { canonical: `/en/${slug}` }, openGraph: { ...ogFor(`/en/${slug}`, "en"), title: page.title, description: metaDescription(page.description || page.lede) } };
}

export default async function EnglishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasPage("en/" + slug)) notFound();
  return <LegacyDocument page={getPage("en/" + slug)} eyebrowPrefix="In English" />;
}
