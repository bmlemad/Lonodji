import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { SectionHead } from "@/components/blocks";
import { OdebHero } from "@/components/odeb-marque";
import OdebNav, { OdebEtat } from "@/components/odeb-nav";
import { ogFor } from "@/lib/content";
import { enLettresMaj, MISSIONS, ODEB, PROGRAMMES, routeProgramme } from "@/lib/odeb";
import { thematiquesParId } from "@/lib/odeb-chiffres";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Les six programmes du projet ODEB LONODJI",
  description: metaDescription("Mémoire et Patrimoine, Recherche, Développement territorial, Jeunesse et Innovation, Diaspora, Économie sociale et revenus : six programmes et qui les porte."),
  alternates: { canonical: "/odeb/programmes" },
  openGraph: ogFor("/odeb/programmes"),
};

export default function Programmes() {
  const th = thematiquesParId();
  const mobilisees = [...new Set(PROGRAMMES.flatMap((p) => p.thematiques))];
  return (
    <main id="main-content" className="hub-page od-page">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · programmes`}
        title="Six programmes"
        em="pour six missions."
        lead="Chaque programme a trois axes (quatre pour le sixième), s’appuie sur des thématiques nommées de l’association et dit ce qui existe déjà et ce qu’il construira. Les programmes ne créent pas de nouvelles équipes : ils donnent un cadre commun à ce que les thématiques font, et un horizon à ce qu’elles feront. Le pilotage, lui, se fait par pôles et thématiques : les programmes en sont une table de correspondance (décision du bureau du 1er octobre 2026)."
        crumbs={[{ label: "Vision 2030 — projet ODEB", href: "/odeb" }, { label: "Programmes" }]}
        pills={["Six programmes", `${enLettresMaj(PROGRAMMES.reduce((n, p) => n + p.axes.length, 0))} axes`, `${mobilisees.filter((id) => th[id]?.kind !== "cellule").length} thématiques${mobilisees.some((id) => th[id]?.kind === "cellule") ? " et une cellule" : ""} mobilisées`]}
      />
      <OdebNav actif="programmes" />

      <div className="od-programmes od-programmes--large">
        {PROGRAMMES.map((p) => {
          const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
          return (
            <article className="od-programme-fiche" id={p.slug} key={p.slug}>
              <div className="od-programme-tete">
                <span className="od-num">{p.numero}</span>
                <div>
                  <h2><Link href={routeProgramme(p)}>{p.nom}</Link></h2>
                  <p className="od-accroche">{p.accroche}</p>
                </div>
              </div>
              <ol className="od-axes-liste">{p.axes.map((a) => <li key={a.titre}><strong>{a.titre}</strong><span>{a.texte}</span></li>)}</ol>
              <p className="od-porte"><span>Porté par :</span>{ths.map((t) => <Link href={`/programmes#${t.id}`} key={t.id} className={t.filled ? "est-pourvue" : "est-vacante"}>{t.kind === "cellule" ? "Cellule " : `${t.number} · `}{t.name}{t.filled ? ` — ${t.coordinator}` : " — à pourvoir"}</Link>)}</p>
              <p className="od-missions-servies"><span>Missions :</span>{p.missions.map((id) => MISSIONS.find((m) => m.id === id)?.nom).filter(Boolean).join(" · ")}</p>
              <Link className="button secondary" href={routeProgramme(p)}>Le programme<span className="sr-only"> {p.nom}</span> en détail <span aria-hidden="true">→</span></Link>
            </article>
          );
        })}
      </div>

      <section className="hub-section" id="articulation">
        <SectionHead eyebrow="Programmes et thématiques" title="Deux grilles," em="une seule association." text="Les six pôles et vingt-deux thématiques restent la seule organisation de travail de l’ADEB LONODJI ; les six programmes sont la grille de l’ODEB, tournée vers 2030. Une thématique peut servir plusieurs programmes ; un programme s’appuie sur plusieurs thématiques. Le tableau ci-dessous dit qui porte quoi." />
        <div className="od-table-wrap">
          <table className="od-table">
            <thead><tr><th scope="col">Programme</th><th scope="col">Thématiques mobilisées</th><th scope="col">Coordination</th></tr></thead>
            <tbody>
              {PROGRAMMES.map((p) => {
                const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
                const pourvues = ths.filter((t) => t.filled).length;
                return (
                  <tr key={p.slug}>
                    <th scope="row"><Link href={routeProgramme(p)}>{p.numero} · {p.nom}</Link></th>
                    <td>{ths.map((t) => <span key={t.id}>{t.kind === "cellule" ? "Cellule" : t.number} {t.name}</span>)}</td>
                    <td>{pourvues}/{ths.length} {pourvues > 1 ? "pourvues" : "pourvue"}{ths.some((t) => !t.filled) ? <> — <Link href="/participer?coordo=1#contact">proposer sa candidature</Link></> : null}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <OdebEtat />
      <Partager route="/odeb/programmes" titre="Les six programmes du projet ODEB LONODJI" texte="Mémoire et Patrimoine, Recherche, Développement territorial, Jeunesse et Innovation, Diaspora, Économie sociale et revenus : six programmes, leurs axes, les thématiques et coordonnateurs qui les portent." />
    </main>
  );
}
