import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyDocument } from "@/components/legacy-content";
import { getPage, hasPage, listEnSlugs, metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";

export const dynamicParams = false;

/* <title> propres aux pages anglaises, quand le titre importé ne suffit pas à les distinguer des pages françaises. */
const TITRES: Record<string, string> = { bedjondo: "Bédjondo, Chad" };

export function generateStaticParams() {
  return listEnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!hasPage("en/" + slug)) return {};
  const page = getPage("en/" + slug);
  const route = `/en/${slug}`;
  const titre = TITRES[slug] ?? page.title;
  return { title: titre, description: metaDescription(page.description || page.lede), alternates: { canonical: route, languages: alternatesLangues(route) }, openGraph: { ...ogFor(route, "en"), title: titre, description: metaDescription(page.description || page.lede) } };
}

export default async function EnglishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasPage("en/" + slug)) notFound();
  const page = getPage("en/" + slug);
  // accueil anglais : surtitre « Home · in English » (l'ancien site disait « English »)
  const eyebrow = slug === "index" && page.eyebrow === "English" ? "Home" : page.eyebrow;
  return <LegacyDocument page={{ ...page, eyebrow }} eyebrowPrefix="In English" />;
}
