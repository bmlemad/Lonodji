import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import ContactPrefill from "@/components/contact-prefill";
import OuvrirAncre from "@/components/ouvrir-ancre";
import { LegacySections, Resume } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { getIndicateurs } from "@/lib/indicateurs";
import { GENRES, getPostes } from "@/lib/postes";
import { enLettres, filledCount, getIndex, getPage, ogFor, ORG, thematiqueCount } from "@/lib/content";

export const metadata: Metadata = {
  title: "Participer : nous écrire, adhérer, soutenir",
  description: "Rejoindre ou coordonner une thématique, adhérer, proposer un article, recevoir la lettre d’information : par formulaire, WhatsApp ou téléphone.",
  alternates: { canonical: "/participer", languages: alternatesLangues("/participer") },
  openGraph: ogFor("/participer"),
};

export default function Participer() {
  const idx = getIndex();
  const vacantes = thematiqueCount(idx) - filledCount(idx);
  const { directionsPourvues, directionsTotal } = getIndicateurs().contenu.coordinations;
  const dirVacantes = directionsTotal - directionsPourvues;
  const contact = getPage("contact");
  const adherer = getPage("adherer");
  const soutenir = getPage("soutenir");
  const journal = getPage("actualites");
  const forms = [...contact.forms, ...adherer.forms, ...soutenir.forms, ...journal.forms];
  const [choisir, ecrire, proposer, avant] = contact.sections;
  const newsletter = journal.sections[0];
  const postes = getPostes();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Participer"
        title="Une place pour"
        em="chaque contribution."
        lead="Rejoindre une thématique, la coordonner, proposer un article, adhérer, transmettre un document ou une information : tout passe par cette page. Nous répondons sous quarante-huit heures ouvrées."
      />

      <div className="contact-cta">
        <a className="big" href={ORG.phoneHref}>{ORG.phone}</a>
        <small>Adoumbé Maoura, président — appel et WhatsApp, le contact officiel de l’association</small>
        <a className="button secondary" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp <span aria-hidden="true">↗</span></a>
      </div>

      {postes.length ? (
        <section className="hub-section" id="postes-ouverts">
          <SectionHead eyebrow="Postes ouverts" title={`${enLettres(postes.length, true)} postes`} em="cherchent quelqu’un." text="Depuis le 1er octobre 2026, chacune des sept thématiques prioritaires a un titulaire et un adjoint, et chaque pôle une vice-présidence élue. Ces postes sont encore libres. Tous sont bénévoles et s’exercent depuis Bédjondo, N’Djamena ou la diaspora. Le bouton prépare le formulaire ci-dessous ; le lien WhatsApp partage l’annonce à quelqu’un que vous connaissez." />
          <ul className="postes-grille">
            {postes.map((p) => (
              <li key={p.cle} className={`poste poste-${p.genre}`}>
                <span className="poste-genre">{GENRES[p.genre]}</span>
                <h3>{p.numero ? <span className="poste-num">{p.numero}</span> : null}{p.titre}</h3>
                <p className="poste-pole">{p.pole}</p>
                <p className="poste-actions">
                  <a className="button primary" href={p.href}>Je me propose</a>
                  <a className="text-link" href={p.fiche}>Fiche de mission <span className="sr-only">(PDF)</span></a>
                  <a className="text-link" href={p.visuel} download>Visuel <span className="sr-only">à partager (image carrée)</span></a>
                  <a className="text-link" href={`https://wa.me/?text=${encodeURIComponent(p.message)}`} target="_blank" rel="noopener noreferrer">Partager sur WhatsApp <span aria-hidden="true">↗</span></a>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="contact" aria-label="Nous écrire">
        <div className="legacy">
          <LegacySections sections={[ecrire]} />
        </div>
      </section>

      <section className="hub-section" id="thematiques">
        <SectionHead eyebrow="Avant de vous lancer" title="Choisissez un pôle," em="puis une thématique." text={`Vingt-deux thématiques, ${enLettres(vacantes)} sans coordonnateur ; et ${dirVacantes === 0 ? "chaque pôle a sa vice-présidence" : `${enLettres(dirVacantes)} des ${enLettres(idx.structure.poles.length)} pôles ${dirVacantes > 1 ? "attendent" : "attend"} encore leur vice-présidence, pourvue par élection`}. La page Nos actions les détaille ; ce raccourci vous oriente en quelques questions.`} />
        <div className="legacy"><LegacySections sections={[choisir, avant]} sansPremierTitre /></div>
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/participer/trouver-ma-thematique">Trouver ma thématique en trois questions <span aria-hidden="true">→</span></Link>
          <Link className="button secondary" href="/programmes#thematiques">Voir les vingt-deux thématiques <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/association/election-vice-presidences">Se présenter à une vice-présidence de pôle <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/programmes/fiches-de-mission">Les fiches de mission (PDF) <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/diaspora">Diaspora : inscrire mes compétences <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/temoignages">Raconter Bédjondo : témoignages &amp; photos <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="hub-section" id="adherer">
        <SectionHead eyebrow="Adhésion" title="Adhérer" em="à l’association." />
        <div className="notice"><strong>Collecte suspendue depuis le 23 septembre 2026.</strong> Aucune cotisation ni don n’est encaissé, en espèces comme par Mobile Money, tant que trois conditions ne sont pas réunies : l’autorisation de l’association, le vote de la grille de cotisation par l’assemblée générale et un compte bancaire à double signature au nom de l’association. Les intentions d’adhésion, elles, restent ouvertes : elles n’engagent aucun argent.</div>
        {(() => {
          // en vue : l'essentiel et le formulaire ; repliées : les règles détaillées (rien n'est retiré)
          const vue = ["une-carte-une-cotisation-et-une-regle-de-cai", "bulletin", "personne-nest-ecarte-faute-de-pouvoir-payer"];
          const essentiel = vue.map((id) => adherer.sections.find((x) => x.id === id)).filter((x) => x !== undefined);
          const details = adherer.sections.filter((x) => !vue.includes(x.id));
          return (
            <div className="legacy">
              <Resume items={adherer.resume} />
              <LegacySections sections={essentiel} />
              {details.length ? (
                <details className="plier">
                  <summary><strong>Les règles de l’adhésion en détail</strong><span>{details.length} sections, de la carte de membre à ce qui reste à décider</span></summary>
                  <LegacySections sections={details} />
                </details>
              ) : null}
            </div>
          );
        })()}
      </section>

      <section className="hub-section" id="soutenir">
        <SectionHead eyebrow="Nous soutenir" title="Cinq façons" em="d’agir avec nous." text={soutenir.lede} />
        <div className="legacy"><LegacySections sections={soutenir.sections} sansPremierTitre /></div>
      </section>

      <section className="hub-section" id="proposer">
        <SectionHead eyebrow="Le journal" title="Proposer" em="un article." text="Toute personne peut proposer un article : il est relu, sourcé et publié sous le nom de son auteur." />
        <div className="legacy"><LegacySections sections={[proposer]} sansPremierTitre /></div>
      </section>

      <section className="hub-section" id="newsletter">
        <SectionHead eyebrow="Lettre d’information" title="Recevoir" em="les actualités." />
        <div className="legacy"><LegacySections sections={[newsletter]} sansPremierTitre /></div>
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/lettre">Les numéros parus <span aria-hidden="true">→</span></Link></p>
      </section>

      <ContactPrefill />
      <OuvrirAncre />
      <LegacyEnhance hasForms={forms.length > 0} />
    </main>
  );
}
