import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, PlaidoyerCard, SectionHead } from "@/components/blocks";
import { LegacySections } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { getIndex, getPage, ogFor, pickSections } from "@/lib/content";
import Partager from "@/components/partager";
import OuvrirAncre from "@/components/ouvrir-ancre";

export const metadata: Metadata = {
  title: "Plaidoyers, engagements et dossiers",
  description: "Sept plaidoyers et une note à la commune de Bédjondo — eau, électricité, internet, routes, santé, école, formation — avec destinataires, suivi et engagements.",
  alternates: { canonical: "/actions", languages: alternatesLangues("/actions") },
  openGraph: ogFor("/actions"),
};

const dossiers = [
  { href: "/association/engagements", label: "Nos engagements publics", note: "Les douze engagements pris sur nos dossiers, aucun encore confirmé réalisé." },
  { href: "/territoire/diagnostic", label: "Diagnostic territorial", note: "Les problématiques documentées, classées par domaine et reliées à leur thématique." },
  { href: "/territoire/besoins", label: "Carte des besoins", note: "Signaler un forage en panne, une école sans maître, un pont coupé : localité par localité." },
  { href: "/territoire/enquetes", label: "Enquêtes de terrain", note: "Huit inconnues de notre recensement, huit enquêtes à conduire, en combien de jours." },
  { href: "/association/demarches", label: "Les démarches, pas à pas", note: "À qui écrire, avec quelles pièces, et trois lettres modèles." },
  { href: "/territoire/propositions-commune", label: "Nos propositions à la commune", note: "Toutes les demandes adressées à la mairie de Bédjondo, réunies par chantier, chacune avec sa source." },
  { href: "/territoire/decentralisation", label: "Décentralisation", note: "Ce que la commune peut décider, et ce qui reste à l’État." },
  { href: "/programmes/agriculteurs-eleveurs", label: "Paix agriculteurs-éleveurs", note: "Un protocole de prévention en six mesures et un cahier de médiation par canton." },
  { href: "/association/ong-partenaires", label: "ONG et partenaires au Mandoul", note: "Qui intervient vraiment dans la province, avec quel bailleur, sur quel secteur." },
];

export default function Actions() {
  const idx = getIndex();
  const page = getPage("plaidoyers");
  const rest = pickSections(page, { only: ["ou-en-est-chaque-dossier", "resultats", "soutenir", "mesure-debit"] });
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Nos actions · plaidoyers & engagements"
        title="Sept plaidoyers,"
        em="une note à la commune."
        lead={page.lede}
        pills={["8 dossiers publiés", "22 indicateurs de résultats", "12 engagements publics"]}
      />
      <p className="section-actions" style={{ justifyContent: "flex-start", marginTop: 0 }}>
        <a className="button secondary" href="/notes/note-synthese-bedjondo.pdf" download>Les huit dossiers en deux pages (PDF) <span aria-hidden="true">↓</span></a>
        <Link className="text-link" href="/bailleurs">Les programmes des bailleurs à rejoindre <span aria-hidden="true">→</span></Link>
      </p>
      {page.resume?.length ? (
        <aside className="lg-resume" aria-label="En trois phrases">
          <p className="eyebrow">En trois phrases</p>
          <ol>{page.resume.map((t, i) => <li key={i}>{t}</li>)}</ol>
        </aside>
      ) : null}

      <section className="hub-section" id="plaidoyers">
        <SectionHead eyebrow="Les dossiers" title="Ce que nous demandons," em="et à qui." text="Chaque plaidoyer est sourcé, chiffré, adressé à des destinataires nommés et suivi publiquement : date de publication, date d’envoi, réponse reçue." />
        <div className="plea-grid">
          {idx.plaidoyers.map((p) => <PlaidoyerCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="hub-section">
        <SectionHead eyebrow="Suivi et soutien" title="Où en est chaque dossier," em="et comment le soutenir." />
        <div className="legacy">
          <LegacySections sections={rest} />
        </div>
        <LegacyEnhance hasForms={page.forms.length > 0} />
        <OuvrirAncre />
      </section>

      <section className="hub-section" id="dossiers">
        <SectionHead eyebrow="Pour comprendre et agir" title="Les dossiers" em="qui nourrissent ces plaidoyers." />
        <div className="link-list">
          {dossiers.map((d) => <Link key={d.href} href={d.href}><strong>{d.label}</strong><span>{d.note}</span></Link>)}
        </div>
      </section>
      <Partager route="/actions" titre="Plaidoyers, engagements et dossiers" texte="Sept plaidoyers et une note à la commune de Bédjondo — eau, électricité, internet, routes, santé, école, formation — avec destinataires, suivi et engagements." />
    </main>
  );
}
