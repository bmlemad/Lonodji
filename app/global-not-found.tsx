import type { Metadata } from "next";
import RootShell from "@/components/root-shell";
import NotFound from "@/app/(fr)/not-found";

/* 404 des adresses qui ne correspondent à aucune route (plusieurs mises en page racines : fr et en). */
export const metadata: Metadata = {
  title: "Page introuvable — ADEB LONODJI",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return <RootShell lang="fr"><NotFound /></RootShell>;
}
