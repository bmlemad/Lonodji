import type { Metadata } from "next";
import { LegacyDocument } from "@/components/legacy-content";
import { getPage, ogFor } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description: "Éditeur du site, hébergeur, statut de l’association, formulaires et données personnelles : ce que nous conservons, où, combien de temps, et vos droits.",
  alternates: { canonical: "/mentions-legales" },
  openGraph: ogFor("/mentions-legales"),
};

export default function MentionsLegales() {
  return <LegacyDocument page={getPage("mentions-legales")} />;
}
