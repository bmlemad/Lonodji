import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead } from "../../components/blocks";
import ContactPrefill from "../../components/contact-prefill";
import { LegacySections, Resume } from "../../components/legacy-content";
import LegacyEnhance from "../../components/legacy-enhance";
import { getPage, ogFor, ORG } from "../../lib/content";

export const metadata: Metadata = {
  title: "Participer : nous écrire, adhérer, soutenir",
  description: "Rejoindre ou coordonner une thématique, adhérer, proposer un article, recevoir la lettre d’information : par formulaire, WhatsApp ou téléphone.",
  alternates: { canonical: "/participer" },
  openGraph: ogFor("/participer"),
};

export default function Participer() {
  const contact = getPage("contact");
  const adherer = getPage("adherer");
  const soutenir = getPage("soutenir");
  const journal = getPage("actualites");
  const forms = [...contact.forms, ...adherer.forms, ...soutenir.forms, ...journal.forms];
  const [choisir, ecrire, proposer, avant] = contact.sections;
  const newsletter = journal.sections[0];
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="08 — Participer"
        title="Une place pour"
        em="chaque contribution."
        lead="Rejoindre une thématique, la coordonner, proposer un article, adhérer, transmettre un document ou une information : tout passe par cette page. Nous répondons sous quarante-huit heures ouvrées."
      />

      <div className="contact-cta">
        <a className="big" href={ORG.phoneHref}>{ORG.phone}</a>
        <small>Adoumbé Maoura, président — appel et WhatsApp, le contact officiel de l’association</small>
        <a className="button secondary" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp <span aria-hidden="true">↗</span></a>
      </div>

      <section id="contact" aria-labelledby="contact-titre">
        <div className="legacy">
          <h2 id="contact-titre" className="sr-only">Nous écrire</h2>
          <LegacySections sections={[ecrire]} />
        </div>
      </section>

      <section className="hub-section" id="thematiques">
        <SectionHead eyebrow="Avant de vous lancer" title="Choisissez un pôle," em="puis une thématique." text="Dix-neuf thématiques, treize sans coordonnateur. La page Nos actions les détaille ; ce raccourci vous oriente en quelques questions." />
        <div className="legacy"><LegacySections sections={[choisir, avant]} /></div>
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/dossiers/trouver-ma-thematique">Trouver ma thématique en trois questions <span aria-hidden="true">↗</span></Link>
          <Link className="button secondary" href="/programmes#thematiques">Voir les dix-neuf thématiques <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/diaspora">Diaspora : inscrire mes compétences <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/temoignages">Raconter Bédjondo : témoignages &amp; photos <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="hub-section" id="adherer">
        <SectionHead eyebrow="Adhésion" title="Adhérer" em="et cotiser." text={adherer.lede} />
        <div className="notice"><strong>Collecte suspendue depuis le 23 septembre 2026.</strong> Aucune cotisation ni don n’est encaissé, en espèces comme par Mobile Money, tant que trois conditions ne sont pas réunies : l’autorisation de l’association, le vote de la grille de cotisation par l’assemblée générale et un compte bancaire à double signature au nom de l’association. Les intentions d’adhésion, elles, restent ouvertes : elles n’engagent aucun argent.</div>
        <div className="legacy">
          <Resume items={adherer.resume} />
          <LegacySections sections={adherer.sections} />
        </div>
      </section>

      <section className="hub-section" id="soutenir">
        <SectionHead eyebrow="Nous soutenir" title="Cinq façons" em="d’agir avec nous." text={soutenir.lede} />
        <div className="legacy"><LegacySections sections={soutenir.sections} /></div>
      </section>

      <section className="hub-section" id="proposer">
        <SectionHead eyebrow="Le journal" title="Proposer" em="un article." text="Toute personne peut proposer un article : il est relu, sourcé et publié sous le nom de son auteur." />
        <div className="legacy"><LegacySections sections={[proposer]} /></div>
      </section>

      <section className="hub-section" id="newsletter">
        <SectionHead eyebrow="Lettre d’information" title="Recevoir" em="les actualités." />
        <div className="legacy"><LegacySections sections={[newsletter]} /></div>
      </section>

      <ContactPrefill />
      <LegacyEnhance hasForms={forms.length > 0} />
    </main>
  );
}
