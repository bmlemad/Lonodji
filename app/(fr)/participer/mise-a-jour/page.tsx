import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import MiseAJourForm from "@/components/mise-a-jour-form";
import Partager from "@/components/partager";
import { ogFor, ORG } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";

export const metadata: Metadata = {
  title: "Demander une mise à jour du site",
  description: "Une erreur à corriger, une information à publier, une thématique ou une fiche à actualiser : envoyez votre demande, avec sa source. Réponse sous 48 heures ouvrées.",
  alternates: { canonical: "/participer/mise-a-jour" },
  openGraph: ogFor("/participer/mise-a-jour"),
};

export default function MiseAJour() {
  const corrections = getIndicateurs().contenu.corrections;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Participer · mise à jour du site"
        title="Une erreur, une nouvelle,"
        em="une page à actualiser ?"
        lead="Le site dit ce que l’association a décidé, publié ou constaté, et rien d’autre. Si une page se trompe, oublie quelque chose ou n’est plus à jour, dites-le-nous ici : coordonnateurs, membres ou visiteurs, chaque demande est lue et reçoit une réponse sous quarante-huit heures ouvrées."
        crumbs={[{ label: "Participer", href: "/participer" }, { label: "Demander une mise à jour" }]}
        pills={["Réponse sous 48 h ouvrées", "Avec une source", `${corrections} corrections déjà publiées`]}
      />

      <section className="hub-section" id="comment">
        <SectionHead eyebrow="Comment nous traitons votre demande" title="Vérifier," em="corriger, dater." />
        <div className="detail-grid">
          <article><h3>Une source d’abord</h3><p>Une information entre sur le site quand elle vient d’une décision datée, d’un document ou de la personne concernée. Sans source, nous vous recontactons avant de toucher à la page.</p></article>
          <article><h3>Les erreurs se corrigent en clair</h3><p>Une erreur de fait corrigée est inscrite, avec sa date, au <Link href="/transparence#corrections">journal des corrections</Link> : ce que nous avions écrit, ce qui est juste, et comment nous l’avons su. Vous y êtes cité seulement si vous le souhaitez.</p></article>
          <article><h3>Les textes datés ne sont pas réécrits</h3><p>Un article, un compte rendu ou un numéro du magazine reste tel qu’il a paru ; une note « Mise à jour du … » y est ajoutée. Les pages de référence, elles, sont corrigées directement.</p></article>
        </div>
      </section>

      <section className="hub-section" id="formulaire">
        <SectionHead eyebrow="Votre demande" title="Une page," em="une demande." text="Tout ce qui est marqué d’un astérisque est nécessaire. Pour plusieurs pages, faites plusieurs envois, ou décrivez-les toutes dans un seul message." />
        <div className="legacy dp-formulaire">
          <MiseAJourForm telephone={ORG.phone} whatsapp={ORG.whatsapp} />
        </div>
      </section>

      <Partager route="/participer/mise-a-jour" titre="Demander une mise à jour du site d’ADEB LONODJI" texte="Une erreur à corriger, une information à publier, une page à actualiser : envoyez votre demande, avec sa source. Réponse sous 48 heures ouvrées." />
    </main>
  );
}
