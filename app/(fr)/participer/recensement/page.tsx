import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import RecensementForm from "@/components/recensement-form";
import Partager from "@/components/partager";
import { getIndex, ogFor, ORG } from "@/lib/content";
import { BUREAU_18_SEPTEMBRE as B18 } from "@/lib/odeb";

export const metadata: Metadata = {
  title: "Recensement des membres et des sympathisants",
  description: "Décidé par le bureau exécutif le 18 septembre 2026 pour relancer l’association : anciens membres, nouveaux venus, au pays ou dans la diaspora, faites-vous recenser en deux minutes.",
  alternates: { canonical: "/participer/recensement" },
  openGraph: ogFor("/participer/recensement"),
};

export default function Recensement() {
  const idx = getIndex();
  const thematiques = [
    ...idx.structure.poles.flatMap((p) => p.items.map((t) => `${t.number} · ${t.name}`)),
    ...(idx.structure.cellules?.items ?? []).map((c) => `Cellule · ${c.name}`),
  ];
  const echeance = B18.suivi.find((s) => s.action.startsWith("Lancer le recensement"))?.echeance ?? "2026-10-18";
  const jour = new Date(echeance + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" });
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Participer · recensement"
        title="Recensement des membres"
        em="et des sympathisants."
        lead={`Pour relancer l’association, le bureau exécutif a demandé le ${B18.dateLabel} un recensement des membres et la mise à jour de la base de données. Anciens membres, nouveaux venus, au pays ou dans la diaspora : deux minutes suffisent, avant le ${jour}.`}
        crumbs={[{ label: "Participer", href: "/participer" }, { label: "Recensement" }]}
        pills={["Deux minutes", "Rien n’est publié", "Aucun paiement demandé", `Avant le ${jour}`]}
      />

      <section className="hub-section" id="pourquoi">
        <SectionHead eyebrow="Pourquoi" title="Savoir qui nous sommes," em="avant l’assemblée de relance." text={`Le recensement est la première action du Comité de réactivation, de modernisation et de transformation institutionnelle (compte rendu ${B18.reference}). Il sert à reconstituer la liste des membres, à joindre chacun pour l’assemblée générale de relance et à savoir quelles compétences l’association peut mobiliser.`} />
        <div className="detail-grid">
          <article><h3>Recensé n’est pas adhérent</h3><p>Le recensement ne vous engage à rien et ne coûte rien. L’adhésion, avec sa carte et sa cotisation, a ses propres règles : elles sont sur la page <Link href="/participer#adherer">Participer</Link>, et aucun paiement n’est demandé tant que le compte de l’association n’est pas ouvert.</p></article>
          <article><h3>Ce que deviennent vos réponses</h3><p>Elles entrent dans le registre des membres, consulté par le bureau et le Comité seulement. Elles ne sont jamais publiées. Vous pouvez demander à tout moment qu’elles soient corrigées ou effacées, par le <Link href="/participer#contact">formulaire de contact</Link> ou par WhatsApp.</p></article>
          <article><h3>La suite</h3><p>Le Comité prépare de nouveaux statuts et l’assemblée générale de relance, prévue d’ici le 17 décembre 2026. Les personnes recensées en seront informées en premier. Le calendrier est sur la <Link href="/odeb/feuille-de-route#calendrier-bureau">feuille de route</Link>.</p></article>
        </div>
      </section>

      <section className="hub-section" id="formulaire">
        <SectionHead eyebrow="Se faire recenser" title="Quelques questions," em="rien de plus." text="Tout ce qui est marqué d’un astérisque est nécessaire. Une personne par envoi." />
        <div className="legacy dp-formulaire">
          <RecensementForm thematiques={thematiques} telephone={ORG.phone} whatsapp={ORG.whatsapp} />
        </div>
      </section>

      <section className="hub-section" id="relayer">
        <SectionHead eyebrow="Relayer" title="Chacun connaît" em="quelqu’un à recenser." text="Partagez cette page dans vos groupes, et rejoignez le groupe WhatsApp de l’association pour suivre la relance." />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <a className="button secondary" href={ORG.whatsappGroupe} target="_blank" rel="noopener noreferrer">Rejoindre le groupe WhatsApp <span aria-hidden="true">↗</span></a>
          <a className="button secondary" href={B18.pdf}>Le compte rendu du {B18.dateLabel} <span aria-hidden="true">↓</span></a>
          <a className="button secondary" href="/partage/recensement-membres.png" download>L’image à partager <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <Partager route="/participer/recensement" titre="Recensement des membres d’ADEB LONODJI" texte="L’association se relance : anciens membres, nouveaux venus, au pays ou dans la diaspora, faites-vous recenser en deux minutes. Rien n’est publié, aucun paiement n’est demandé." />
    </main>
  );
}
