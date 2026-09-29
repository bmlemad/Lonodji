import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import NewsletterForm from "../../components/newsletter-form";
import { ogFor } from "../../lib/content";
import { getLettres } from "../../lib/lettres";

export const metadata: Metadata = {
  title: "La lettre d’information : chaque mois, ce qui a été publié, décidé, ouvert",
  description: "Les numéros de la lettre d’ADEB LONODJI, à lire en ligne ou à transmettre en PDF par WhatsApp ; l’abonnement par e-mail ; la règle : rien que ce qui a été publié, décidé ou ouvert, et quand il n’y a rien à dire, on le dit.",
  alternates: { canonical: "/lettre" },
  openGraph: { ...ogFor("/lettre"), title: "La lettre d’information d’ADEB LONODJI", description: "Chaque mois : publié, décidé, ouvert. En ligne, ou en PDF à transmettre." },
};

export default function LettrePage() {
  const { lettres } = getLettres();
  const derniere = lettres[lettres.length - 1];
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Le journal · la lettre d’information"
        title="Chaque mois,"
        em="ce que l’association a publié, décidé ou ouvert."
        lead="Pas de communiqué, pas d’annonce sans suite : la lettre ne dit que ce qui a été publié sur le site, décidé par l’association ou ouvert aux membres depuis le numéro précédent. Quand il n’y a rien à dire, elle le dit. Chaque numéro se lit en ligne et se transmet en PDF, tel quel, dans un groupe WhatsApp ou par e-mail."
        crumbs={[{ label: "Le journal", href: "/journal" }, { label: "Lettre d’information" }]}
        pills={[`${lettres.length} numéro${lettres.length > 1 ? "s" : ""}`, derniere ? `dernier : ${derniere.dateLabel}` : "aucun numéro", "mensuelle", "PDF à transmettre"]}
      />
      <Stats items={[
        { value: String(lettres.length), label: "numéros parus", note: derniere ? `le dernier, n° ${derniere.numero}, le ${derniere.dateLabel}` : "le premier est à venir" },
        { value: "1", label: "par mois", note: "et un numéro spécial quand une journée le justifie, comme le 28 septembre 2026" },
        { value: "3", label: "rubriques fixes", note: "ce qui a été décidé, ce qui a été publié, ce qui est ouvert" },
        { value: "0", label: "annonce sans suite", note: "chaque numéro commence par ce que le précédent avait promis" },
      ]} />

      <section className="hub-section" id="numeros">
        <SectionHead eyebrow="Les numéros" title="À lire en ligne," em="ou à transmettre en PDF." />
        <div className="link-list">
          {[...lettres].reverse().map((l) => (
            <Link key={l.slug} href={l.route}>
              <small>n° {l.numero} · {l.dateLabel} · {l.lecture}</small>
              <strong>{l.titre}</strong>
              <span>{l.resume}</span>
            </Link>
          ))}
        </div>
        <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 18 }}>
          {[...lettres].reverse().map((l) => <a key={l.pdf} className="button secondary" href={l.pdf} download>PDF du n° {l.numero} <span aria-hidden="true">↓</span></a>)}
        </div>
      </section>

      <section className="hub-section" id="abonnement">
        <SectionHead eyebrow="S’abonner" title="Une adresse e-mail," em="désinscription à tout moment." text="La lettre part le jour de sa parution, en texte, avec le lien vers le numéro et son PDF. L’adresse sert à cela et à rien d’autre ; elle est gardée par le service de formulaires de notre hébergeur, comme l’explique la page des mentions légales." />
        <div className="detail-grid">
          <article>
            <h3>Recevoir la lettre</h3>
            <NewsletterForm />
          </article>
          <article><h3>La recevoir sur WhatsApp</h3><p>Le PDF de chaque numéro est fait pour être transmis tel quel : téléchargez-le ci-dessus et envoyez-le dans le groupe de votre village, de votre famille, de votre association. Le bouton « Partager » de chaque page fait la même chose avec le lien.</p></article>
          <article><h3>Comment elle s’écrit</h3><p>Le numéro se prépare à partir de ce que le site a enregistré dans le mois — articles, nominations, corrections, chiffres du tableau de bord — puis l’association y ajoute ce qu’elle a décidé, daté et sourcé. Rien d’autre. Une erreur ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p></article>
        </div>
      </section>

      <Partager route="/lettre" titre="La lettre d’information d’ADEB LONODJI" texte="chaque mois, ce que l’association a publié, décidé ou ouvert — en ligne ou en PDF à transmettre" />
      <p className="lg-footnote">Les numéros sont des articles du journal (rubrique « Lettre d’information ») ; leurs PDF sont produits par <code>scripts/build-lettre.py</code>, qui prépare aussi le brouillon du numéro suivant à partir des articles du mois.</p>
    </main>
  );
}
