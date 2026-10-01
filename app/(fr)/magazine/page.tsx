import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead } from "@/components/blocks";
import NewsletterForm from "@/components/newsletter-form";
import { ogFor } from "@/lib/content";
import { getMagazine } from "@/lib/magazine";

export const metadata: Metadata = {
  title: "Lonodji, le magazine trimestriel",
  description: "Lonodji, le magazine d’ADEB LONODJI : quatre numéros par an, en PDF à imprimer ou à transmettre sur WhatsApp. Décisions du trimestre, dossier, plaidoyers, mémoire, culture et postes ouverts.",
  alternates: { canonical: "/magazine" },
  openGraph: { ...ogFor("/magazine"), title: "Lonodji, le magazine trimestriel d’ADEB LONODJI", description: "Quatre numéros par an, à imprimer ou à transmettre : ce que l’association a décidé, publié et ouvert." },
};

export default function MagazinePage() {
  const { numeros, rythme } = getMagazine();
  const dernier = numeros[0];
  const precedents = numeros.slice(1);
  const message = dernier ? `Lonodji n° ${dernier.numero} (${dernier.periode}), le magazine d’ADEB LONODJI : ${dernier.titre}. À lire et à faire circuler : https://lonodji.org${dernier.pdf}` : "";
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Journal · magazine trimestriel"
        title="Lonodji,"
        em="le magazine qu’on garde."
        lead={`Le site publie au jour le jour, la lettre fait le point chaque mois ; Lonodji rassemble chaque trimestre ce qui compte, en un numéro à imprimer, à faire circuler à Bédjondo et à envoyer en PDF dans la diaspora. Quatre numéros par an : en ${rythme.join(", ").replace(/, ([^,]+)$/, " et $1")}.`}
        crumbs={[{ label: "Journal", href: "/journal" }, { label: "Magazine" }]}
        pills={[`${numeros.length} numéro${numeros.length > 1 ? "s" : ""} paru${numeros.length > 1 ? "s" : ""}`, dernier ? `prochain : ${dernier.prochain}` : "premier numéro à venir", "PDF à imprimer", "gratuit"]}
      />

      {dernier ? (
        <section className="hub-section" id="dernier-numero">
          <SectionHead eyebrow={`N° ${dernier.numero} · ${dernier.periode}`} title={dernier.titre.includes(", ") ? dernier.titre.split(", ")[0] + "," : dernier.titre} em={dernier.titre.includes(", ") ? dernier.titre.split(", ").slice(1).join(", ") + "." : undefined} text={dernier.chapo} />
          <div className="mag-numero">
            <a className="mag-couv" href={dernier.pdf} aria-label={`Ouvrir le PDF du n° ${dernier.numero}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dernier.couverture} alt={`Couverture de Lonodji n° ${dernier.numero}, ${dernier.periode} : ${dernier.titre}`} width={800} height={1131} loading="eager" />
            </a>
            <div>
              <h3 className="mag-sommaire-titre">Au sommaire</h3>
              <ol className="mag-sommaire">
                {dernier.sommaire.map((s) => (
                  <li key={s.titre}>{s.page ? <b>p. {s.page}</b> : <b aria-hidden="true">·</b>}<span><small>{s.rubrique}</small>{s.titre}</span></li>
                ))}
              </ol>
              <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 18 }}>
                <a className="button primary" href={dernier.pdf} download>Télécharger le PDF <span aria-hidden="true">↓</span></a>
                <a className="button secondary" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Envoyer sur WhatsApp <span aria-hidden="true">↗</span></a>
              </div>
              <p className="mag-meta">Paru le {dernier.parutionLabel}{dernier.edition ? ` (${dernier.edition})` : ""} · {dernier.pages} pages A4 · {dernier.taille} · à imprimer recto verso, à reproduire librement sans modification.</p>
            </div>
          </div>
        </section>
      ) : null}

      {precedents.length ? (
        <section className="hub-section" id="numeros">
          <SectionHead eyebrow="Les numéros parus" title="Tous les numéros," em="en PDF." />
          <div className="link-list">
            {precedents.map((n) => <a key={n.numero} href={n.pdf}><small>n° {n.numero} · {n.periode} · {n.pages} pages</small><strong>{n.titre}</strong><span>{n.chapo}</span></a>)}
          </div>
        </section>
      ) : null}

      <section className="hub-section" id="principes">
        <SectionHead eyebrow="Comment il se fait" title="Rien qui n’ait paru" em="sur le site." text="Chaque numéro reprend, tels qu’ils ont été publiés, les textes du trimestre : le registre des décisions, un dossier, l’état des plaidoyers, un grand format, la mémoire et la culture bedjond, les brèves et les postes ouverts. Seul l’édito est écrit pour le magazine. Après son jour de parution, un numéro n’est plus modifié ; une erreur se corrige dans le journal des corrections et le numéro suivant la signale." />
        <div className="detail-grid">
          <article><h3>Écrire dans Lonodji</h3><p>On écrit dans le magazine en écrivant sur le site : <Link href="/participer#proposer">proposez un article</Link>, <Link href="/temoignages">confiez un témoignage</Link> ou <Link href="/territoire/besoins">signalez un besoin</Link> ; le numéro suivant reprend ce qui a paru.</p></article>
          <article><h3>Le faire circuler</h3><p>Le PDF se transmet tel quel dans un groupe WhatsApp et s’imprime en A4 pour le chef de village, l’école ou le centre de santé. Il peut être reproduit librement, sans modification et avec sa source.</p></article>
          <article><h3>Être prévenu de la parution</h3><NewsletterForm id="magazine-nl-email" label="Recevoir la lettre et le magazine" /></article>
        </div>
      </section>

      <Partager route="/magazine" titre="Lonodji, le magazine trimestriel d’ADEB LONODJI" texte="quatre numéros par an, à imprimer ou à transmettre sur WhatsApp" />
      <p className="lg-footnote">Le magazine est produit à partir des pages du site (scripts/build-magazine.py) ; la <Link href="/lettre">lettre d’information</Link> continue de paraître chaque mois.</p>
    </main>
  );
}
