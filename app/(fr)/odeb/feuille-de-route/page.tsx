import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { SectionHead, Stats } from "@/components/blocks";
import { OdebHero } from "@/components/odeb-marque";
import OdebNav, { OdebEtat } from "@/components/odeb-nav";
import { ogFor } from "@/lib/content";
import { BUREAU_18_SEPTEMBRE as B18, ETATS, feuilleDeRoute, ODEB, type Etat } from "@/lib/odeb";
import { chiffresOdeb } from "@/lib/odeb-chiffres";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Feuille de route 2026-2030 du projet ODEB LONODJI",
  description: metaDescription("Trois phases, de la relance de 2026 à l’organisation de référence de 2030 : chaque chantier réalisé, en cours, à venir ou à décider, avec l’état réel du site."),
  alternates: { canonical: "/odeb/feuille-de-route" },
  openGraph: ogFor("/odeb/feuille-de-route"),
};

export default function FeuilleDeRoute() {
  const c = chiffresOdeb();
  const phases = feuilleDeRoute(c);
  const tous = phases.flatMap((p) => p.chantiers);
  const compte = (e: Etat) => tous.filter((x) => x.etat === e).length;
  const jour = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" }).replace(/^1 /, "1er ");
  return (
    <main id="main-content" className="hub-page od-page">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · feuille de route`}
        title="De 2026 à 2030,"
        em="phase par phase."
        lead="La feuille de route énoncée par l’association le 28 septembre 2026 : trois phases de six, douze et dix-huit mois, puis le bilan du plan d’action 2026-2028 et la constitution de l’organisation. Chaque chantier porte son état réel — réalisé, en cours, à venir, à décider — tel que le site le constate à sa mise en ligne."
        crumbs={[{ label: "Vision 2030 — projet ODEB", href: "/odeb" }, { label: "Feuille de route" }]}
        pills={["Trois phases", "Horizon 2030", `État au ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" }).replace(/^1 /, "1er ")}`]}
      />
      <OdebNav actif="feuille-de-route" />

      <Stats items={[
        { value: String(compte("fait")), label: "chantiers réalisés", note: "vérifiables sur le site, page par page" },
        { value: String(compte("en-cours")), label: "en cours", note: "commencés, pas terminés" },
        { value: String(compte("a-venir")), label: "à venir", note: "prévus, pas commencés" },
        { value: String(compte("a-decider")), label: "à décider", note: "une décision de l’association manque" },
      ]} />

      <section className="hub-section" id="calendrier-bureau">
        <SectionHead eyebrow={`Bureau exécutif · ${B18.dateLabel}`} title="Le calendrier" em="de la transformation." text={`Le chronogramme indicatif adopté par le bureau exécutif élargi (compte rendu ${B18.reference}) : quatre phases jusqu’au lancement de l’ODEB LONODJI en mars 2027, puis le dossier du statut d’ONG. Il fixe le calendrier institutionnel ; les trois phases détaillées plus bas, énoncées le ${ODEB.presenteLabel}, disent ce que le site construit pendant ce temps.`} />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Chronogramme de la transformation">
          <table className="ob-table ob-table--empile">
            <thead><tr><th scope="col">Phase</th><th scope="col">Échéance</th><th scope="col">Actions</th></tr></thead>
            <tbody>{B18.chronogramme.map((r) => <tr key={r.phase}><th scope="row" data-label="Phase">{r.phase}</th><td data-label="Échéance">{r.echeance}</td><td data-label="Actions">{r.actions}</td></tr>)}</tbody>
          </table>
        </div>
        <h3 className="od-suivi-titre">Le suivi des décisions</h3>
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Suivi des décisions du 18 septembre 2026">
          <table className="ob-table ob-table--empile">
            <thead><tr><th scope="col">Action</th><th scope="col">Responsable</th><th scope="col">Échéance</th><th scope="col">État</th></tr></thead>
            <tbody>{B18.suivi.map((r) => <tr key={r.action}><th scope="row" data-label="Action">{r.href ? <Link href={r.href}>{r.action}</Link> : r.action}</th><td data-label="Responsable">{r.qui}</td><td data-label="Échéance">{jour(r.echeance)}</td><td data-label="État">{r.fait ? <><span className="od-pill od-pill--fait">{ETATS.fait}</span> <small>{r.fait}</small></> : r.enCours ? <><span className="od-pill od-pill--en-cours">{ETATS["en-cours"]}</span> <small>{r.enCours}</small></> : <span className="od-pill od-pill--a-venir">{ETATS["a-venir"]}</span>}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="lg-footnote">Source : <a href={B18.pdf}>compte rendu du {B18.dateLabel}</a>, version non signée approuvée par tous les participants ; la version signée suivra. Le Comité de réactivation, de modernisation et de transformation institutionnelle, chargé de la plupart de ces actions, est {B18.comite.composition}.</p>
      </section>

      <ol className="od-phases">
        {phases.map((p, i) => (
          <li className="od-phase" id={p.id} key={p.id}>
            <div className="od-phase-tete">
              <span className="od-phase-num">{i + 1}</span>
              <div>
                <p className="eyebrow">{p.periode}</p>
                <h2>{p.titre}</h2>
                <p className="od-phase-texte">{p.texte}</p>
              </div>
            </div>
            <ul className="od-chantiers">
              {p.chantiers.map((x) => (
                <li className={`od-chantier est-${x.etat}`} key={x.titre}>
                  <span className={`od-pill od-pill--${x.etat}`}>{ETATS[x.etat]}</span>
                  <div>
                    <strong>{x.href ? <Link href={x.href}>{x.titre}</Link> : x.titre}</strong>
                    <span>{x.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section className="hub-section" id="methode">
        <SectionHead eyebrow="Comment lire cette page" title="Un chantier n’est « réalisé »" em="que si on peut le voir." />
        <div className="detail-grid">
          <article><h3>Réalisé</h3><p>La chose existe et se vérifie sur le site : une page, une carte, un formulaire en service, un document publié. Le lien mène à la preuve.</p></article>
          <article><h3>En cours</h3><p>Le chantier est commencé et une partie se voit déjà ; le reste dépend d’une étape nommée — une signature, une nomination, un compte à ouvrir.</p></article>
          <article><h3>À venir, à décider</h3><p>« À venir » : prévu par la feuille de route, pas commencé. « À décider » : le chantier attend une décision de l’association que le site ne peut ni prendre ni anticiper.</p></article>
        </div>
        <Partager route="/odeb/feuille-de-route" titre="Feuille de route 2026-2030 du projet ODEB LONODJI" texte="Trois phases, de la relance de 2026 à l’organisation de référence de 2030 : ce qui est réalisé, en cours, à venir ou à décider, chantier par chantier, avec l’état réel du site." />
        <p className="lg-footnote">Phases et contenu : feuille de route énoncée par l’association le {ODEB.presenteLabel} (phase 1 : tableau de bord dynamique, cartographie communautaire, espace membre ; phase 2 : registre des compétences de la diaspora, plateforme de projets, bibliothèque numérique bedjond ; phase 3 : observatoire du Mandoul Occidental, patrimoine vivant multimédia, académie numérique, application mobile) ; plan d’action 2026-2028 ; recommandations 2027-2030. Les dates sont comptées depuis cette présentation. L’état des chantiers est celui du site à sa mise en ligne ; le <Link href="/impact">tableau de bord</Link> en donne les chiffres.</p>
      </section>

      <OdebEtat />
    </main>
  );
}
