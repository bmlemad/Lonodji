import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { SectionHead, Stats } from "@/components/blocks";
import { OdebHero } from "@/components/odeb-marque";
import OdebNav, { OdebEtat } from "@/components/odeb-nav";
import { ogFor } from "@/lib/content";
import { ETATS, feuilleDeRoute, ODEB, type Etat } from "@/lib/odeb";
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
