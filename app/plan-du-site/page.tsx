import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "../../components/blocks";
import { getIndex, ogFor } from "../../lib/content";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Toutes les pages du site ADEB LONODJI : association, histoire, actions, dossiers, journal, documents, participation et transparence.",
  alternates: { canonical: "/plan-du-site" },
  openGraph: ogFor("/plan-du-site"),
};

const main: [string, { href: string; label: string }[]][] = [
  ["L’association", [
    { href: "/mission", label: "Notre mission" }, { href: "/histoire", label: "Histoire & patrimoine" }, { href: "/transparence", label: "Redevabilité & transparence" },
    { href: "/documents", label: "Documents" }, { href: "/mentions-legales", label: "Mentions légales" }, { href: "/archives", label: "Archives du site" },
  ]],
  ["Nos actions", [
    { href: "/programmes", label: "Quatre pôles, dix-neuf thématiques" }, { href: "/actions", label: "Plaidoyers & engagements" }, { href: "/impact", label: "Suivi & tableau de bord" }, { href: "/dossiers", label: "Tous les dossiers" }, { href: "/carte", label: "Carte du territoire" }, { href: "/villages", label: "Les villages, une fiche par localité" },
  ]],
  ["Participer", [
    { href: "/participer#contact", label: "Nous écrire" }, { href: "/participer#adherer", label: "Adhérer et cotiser" }, { href: "/participer#soutenir", label: "Nous soutenir" }, { href: "/diaspora", label: "Répertoire des compétences de la diaspora" }, { href: "/temoignages", label: "Racontez Bédjondo : témoignages et banque d’images" }, { href: "/participer#newsletter", label: "Lettre d’information" }, { href: "/journal", label: "Le journal" }, { href: "/recherche", label: "Rechercher dans le site" },
  ]],
];

export default function PlanDuSite() {
  const idx = getIndex();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader eyebrow="Plan du site" title="Toutes les pages," em="au même endroit." />
      <div className="footer-cols" style={{ marginBottom: 40 }}>
        {main.map(([title, links]) => (
          <div key={title}><h2>{title}</h2>{links.map((l) => <Link key={l.href} href={l.href} style={{ fontSize: 15 }}>{l.label}</Link>)}</div>
        ))}
        <div><h2>In English</h2>{idx.pages.filter((p) => p.kind === "en").map((p) => <Link key={p.route} href={p.route} style={{ fontSize: 15 }}>{p.title}</Link>)}</div>
      </div>
      <section className="hub-section"><p className="eyebrow">Dossiers</p><div className="footer-cols" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>{idx.pages.filter((p) => p.kind === "dossier").map((p) => <Link key={p.route} href={p.route} style={{ fontSize: 15 }}>{p.title}</Link>)}</div></section>
      <section className="hub-section"><p className="eyebrow">Journal — {idx.articles.length} articles</p><div className="footer-cols" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>{idx.articles.map((a) => <Link key={a.route} href={a.route} style={{ fontSize: 15 }}>{a.dateLabel} — {a.title}</Link>)}</div></section>
    </main>
  );
}
