import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader } from "../../components/blocks";
import { EN_PAGES_APP, getIndex, ogFor } from "../../lib/content";
import { NAVIGATION } from "../../lib/navigation";
import { PROGRAMMES, routeProgramme } from "../../lib/odeb";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Toutes les pages du site ADEB LONODJI : association, histoire, actions, dossiers, journal, documents, participation et transparence.",
  alternates: { canonical: "/plan-du-site" },
  openGraph: ogFor("/plan-du-site"),
};

/* Les groupes du plan reprennent le menu (lib/navigation.ts), plus le projet ODEB en détail. */
const main: [string, { href: string; label: string }[]][] = NAVIGATION.filter((e) => e.colonnes).map((e) => [e.label, [{ href: e.href, label: `${e.label} — vue d’ensemble` }, ...e.colonnes!.flatMap((c) => c.liens.map((l) => ({ href: l.href, label: l.label })))]]);
main.push(["Projet ODEB LONODJI — programmes", PROGRAMMES.map((p) => ({ href: routeProgramme(p), label: `${p.numero} · ${p.nom}` }))]);
main.push(["Outils", [{ href: "/journal", label: "Le journal" }, { href: "/recherche", label: "Rechercher dans le site" }, { href: "/plan-du-site", label: "Plan du site" }, { href: "/mentions-legales", label: "Mentions légales" }, { href: "/archives", label: "Archives du site" }, { href: "/hors-ligne", label: "Page hors ligne de l’application" }]]);

export default function PlanDuSite() {
  const idx = getIndex();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader eyebrow="Plan du site" title="Toutes les pages," em="au même endroit." />
      <div className="footer-cols" style={{ marginBottom: 40, gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
        {main.map(([title, links]) => (
          <div key={title}><h2>{title}</h2>{links.map((l) => <Link key={l.href} href={l.href} style={{ fontSize: 15 }}>{l.label}</Link>)}</div>
        ))}
        <div><h2>In English</h2>{idx.pages.filter((p) => p.kind === "en").map((p) => <Link key={p.route} href={p.route} style={{ fontSize: 15 }}>{p.title}</Link>)}{EN_PAGES_APP.map((p) => <Link key={p.route} href={p.route} style={{ fontSize: 15 }}>{p.title}</Link>)}</div>
      </div>
      <section className="hub-section"><p className="eyebrow">Dossiers</p><div className="footer-cols" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>{idx.pages.filter((p) => p.kind === "dossier").map((p) => <Link key={p.route} href={p.route} style={{ fontSize: 15 }}>{p.title}</Link>)}</div></section>
      <section className="hub-section"><p className="eyebrow">Journal — {idx.articles.length} articles</p><div className="footer-cols" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>{idx.articles.map((a) => <Link key={a.route} href={a.route} style={{ fontSize: 15 }}>{a.dateLabel} — {a.title}</Link>)}</div></section>
    </main>
  );
}
