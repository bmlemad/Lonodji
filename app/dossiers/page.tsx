import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "../../components/blocks";
import { getIndex, ogFor } from "../../lib/content";

export const metadata: Metadata = {
  title: "Tous les dossiers",
  description: "Les dossiers de fond d’ADEB LONODJI : diagnostic territorial, projets à l’étude, plans pour les personnes vulnérables, patrimoine, outils de terrain et cadre légal.",
  alternates: { canonical: "/dossiers" },
  openGraph: ogFor("/dossiers"),
};

const groups: [string, string[]][] = [
  ["Diagnostic et démarches", ["problematiques", "besoins", "enquetes", "demarches", "decentralisation", "ong-partenaires", "odd", "engagements"]],
  ["Projets à l’étude", ["air-bedjondo", "complexe-sportif", "espace-numerique", "drones-innovation", "application", "agriculture-securite-alimentaire", "environnement"]],
  ["Personnes vulnérables et paix", ["solidarite-inclusion", "veuves", "handicap", "agriculteurs-eleveurs"]],
  ["Bédjondo et patrimoine", ["bedjondo", "lieux-sacres", "genealogies", "recherche", "identite-visuelle", "evenements", "kit-mobilisation"]],
  ["Outils en ligne", ["trouver-ma-thematique", "genealogie-outil"]],
];

export default function Dossiers() {
  const pages = getIndex().pages.filter((p) => p.kind === "dossier");
  const bySlug = new Map(pages.map((p) => [p.slug, p]));
  return (
    <main id="main-content" className="hub-page">
      <PageHeader eyebrow="Les dossiers" title="Tout ce que nous" em="avons documenté." lead={`${pages.length} dossiers de fond, chacun daté et sourcé, du diagnostic territorial aux projets à l’étude. Ils nourrissent les plaidoyers et les dix-neuf thématiques.`} />
      {groups.map(([title, slugs]) => (
        <section className="hub-section" key={title}>
          <p className="eyebrow">{title}</p>
          <div className="link-list">
            {slugs.map((s) => bySlug.get(s)).filter(Boolean).map((p) => (
              <Link key={p!.slug} href={p!.route}><small>{p!.eyebrow}</small><strong>{p!.title}</strong><span>{p!.lede.length > 180 ? p!.lede.slice(0, 177).trimEnd() + "…" : p!.lede}</span></Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
