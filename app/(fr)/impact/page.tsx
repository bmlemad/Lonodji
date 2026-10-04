import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { LegacySections } from "@/components/legacy-content";
import TableauDeBord from "@/components/tableau-de-bord";
import { getPage, ogFor } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import OuvrirAncre from "@/components/ouvrir-ancre";
import Partager from "@/components/partager";
import { getObservatoire } from "@/lib/observatoire";
import { decisionsTriees, TYPES } from "@/lib/decisions";

export const metadata: Metadata = {
  title: "Tableau de suivi : indicateurs, plaidoyers, engagements",
  description: "Six indicateurs datés et sourcés, la transmission de chaque plaidoyer, les engagements publics, les dernières décisions et le suivi thématique par thématique.",
  alternates: { canonical: "/impact", languages: alternatesLangues("/impact") },
  openGraph: ogFor("/impact"),
};

export default function Impact() {
  const page = getPage("suivi");
  const indicateurs = getIndicateurs();
  const o = getObservatoire();
  const dernieres = decisionsTriees().filter((d) => d.type !== "regle").slice(0, 5);
  const jour = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const transmis = o.plaidoyers.filter((p) => /\d{4}/.test(p.sent ?? "")).length;
  const repondus = o.plaidoyers.filter((p) => p.answer && !/aucun|non|—|pas/i.test(p.answer)).length;
  const statut = (sent?: string, answer?: string) => {
    if (answer && !/aucun|non|—|pas/i.test(answer)) return "Réponse reçue";
    if (sent && /\d{4}/.test(sent)) return "Transmis";
    return "Publié · transmission à faire";
  };
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Nos actions · tableau de suivi"
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Tableau de suivi" }]}
        title="Mesurer ce qui"
        em="devient réel."
        lead="Les réalisations de l’association, avec leur date et leur source : six indicateurs, le statut des plaidoyers et les engagements publics. Les changements pour les habitants restent à mesurer ; ils ne sont pas déduits de ces compteurs."
      />
      <nav className="section-actions bl-sommaire" aria-label="Sur cette page" style={{ justifyContent: "flex-start" }}>
        <a className="text-link" href="#tb-titre">Indicateurs</a>
        <a className="text-link" href="#plaidoyers">Plaidoyers</a>
        <a className="text-link" href="#engagements-decisions">Engagements et décisions</a>
        <a className="text-link" href="#suivi-thematique">Thématique par thématique</a>
      </nav>
      <Stats items={[
        { value: String(o.plaidoyers.length), label: "dossiers publiés", note: "texte, chiffres, sources et destinataires accessibles publiquement" },
        { value: String(transmis), label: "dossiers transmis", note: "une transmission n’est comptée que lorsqu’une date réelle est enregistrée" },
        { value: String(repondus), label: "dossiers avec réponse", note: "une réponse n’est comptée qu’après réception et enregistrement" },
      ]} />
      <p className="section-actions" style={{ justifyContent: "flex-start" }}>
        <a className="button primary" href="#plaidoyers">Voir le statut dossier par dossier <span aria-hidden="true">↓</span></a>
        <Link className="button secondary" href="/observatoire#plaidoyers">Voir dans l’Observatoire <span aria-hidden="true">→</span></Link>
      </p>
      <TableauDeBord donnees={indicateurs} />
      <div className="notice">
        <strong>Règle de publication.</strong> Aucun résultat n’est annoncé sans preuve : un chiffre paraît avec sa période, son périmètre, sa source et sa méthode. Ce qui n’est pas encore réalisé est écrit comme tel.
      </div>


      <section className="hub-section" id="plaidoyers">
        <SectionHead eyebrow="Plaidoyers" title="Publiés, transmis," em="répondus." text="Chaque dossier de plaidoyer nomme ses destinataires ; ce tableau suit sa transmission et la réponse reçue. Le texte, les chiffres et les sources sont dans chaque dossier." />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Tableau de suivi des plaidoyers">
          <table className="ob-table ob-table--plaidoyers">
            <thead><tr><th scope="col">Plaidoyer</th><th scope="col">État</th><th scope="col">Thème</th><th scope="col">Destinataires</th><th scope="col">Publié</th><th scope="col">Transmis</th><th scope="col">Réponse</th></tr></thead>
            <tbody>
              {o.plaidoyers.map((pl) => (
                <tr key={pl.id}>
                  <th scope="row"><Link href={pl.href}>{pl.title}</Link></th>
                  <td><strong>{statut(pl.sent, pl.answer)}</strong></td>
                  <td>{pl.theme}</td>
                  <td><small>{pl.recipients.replace(/\s+\)/g, ")")}</small></td>
                  <td>{pl.published}</td>
                  <td className={!/\d{4}/.test(pl.sent ?? "") ? "ob-manque" : "ob-ok"}>{pl.sent || "—"}</td>
                  <td className={/aucun|non|—|pas/i.test(pl.answer) || !pl.answer ? "est-vide" : "ob-ok"}>{pl.answer || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Règle de suivi : une date de transmission, un accusé de réception ou une réponse n’apparaît ici qu’après l’événement réel et son enregistrement par le bureau. L’absence de date signifie donc « non transmis à ce jour », pas « information inconnue ». <Link href="/actions#transmission">Voir le détail par destinataire</Link>.</p>
      </section>

      <section className="hub-section" id="engagements-decisions">
        <SectionHead eyebrow="Engagements et décisions" title="Ce que nous promettons," em="ce que nous décidons." text={`${o.engagements.total} engagements publics sont suivis, ${o.engagements.realises} confirmé${o.engagements.realises > 1 ? "s" : ""} réalisé${o.engagements.realises > 1 ? "s" : ""}. Le registre des décisions distingue ce qui est décidé de ce qui n’est qu’annoncé ou proposé.`} />
        <ul className="bl-bref">
          {dernieres.map((d) => (
            <li key={d.id}><strong>{d.dateLabel ?? jour(d.date)} · {TYPES[d.type].court}.</strong> {d.titre}</li>
          ))}
        </ul>
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button secondary" href="/transparence/decisions">Tout le registre des décisions <span aria-hidden="true">→</span></Link>
          <Link className="button secondary" href="/association/engagements">Nos engagements publics <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/odeb/feuille-de-route">La feuille de route 2026-2030 <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <details className="plier" id="suivi-thematique">
        <summary><strong>Consulter le suivi thématique détaillé</strong><span>Ce qui est documenté, publié et reste à réaliser, thème par thème</span></summary>
        <div className="legacy suivi-detail-contenu"><LegacySections sections={page.sections} /></div>
      </details>
      <OuvrirAncre />
      <section className="hub-section">
        <p className="lg-footnote">Résultats vérifiés, projets documentés et témoignages authentifiés seront publiés ici, dossier par dossier, avec leur source. Ce que nous rectifions est dans le <Link href="/transparence#corrections">journal des corrections</Link>.</p>
      </section>
      <Partager route="/impact" titre="Tableau de suivi d’ADEB LONODJI" texte="Adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets : six indicateurs datés et sourcés, puis le suivi thématique par thématique." />
    </main>
  );
}
