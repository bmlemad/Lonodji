import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, PlaidoyerCard, SectionHead } from "@/components/blocks";
import { LegacySections } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { enLettres, getIndex, getPage, ogFor, pickSections } from "@/lib/content";
import Partager from "@/components/partager";
import OuvrirAncre from "@/components/ouvrir-ancre";
import { getTransmissions, STATUTS } from "@/lib/transmissions";

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
  { href: "/territoire/enquetes", label: "Enquêtes de terrain", note: "Huit des onze inconnues de notre recensement, huit enquêtes à conduire, en combien de jours." },
  { href: "/association/demarches", label: "Les démarches, pas à pas", note: "À qui écrire, avec quelles pièces, et trois lettres modèles." },
  { href: "/territoire/propositions-commune", label: "Nos propositions à la commune", note: "Dix projets prioritaires et toutes les demandes adressées à la mairie de Bédjondo, chacune avec sa source." },
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
        <Link className="button primary" href="/impact#plaidoyers">Voir le suivi public des dossiers <span aria-hidden="true">→</span></Link>
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

      <section className="hub-section" id="transmission">
        {(() => {
          const tr = getTransmissions();
          const tous = Object.values(tr).flatMap((t) => t.destinataires);
          const envoyes = tous.filter((d) => d.statut !== "a-signer").length;
          const reponses = tous.filter((d) => d.statut === "reponse").length;
          return (
            <>
              <SectionHead eyebrow="Transmission" title="Qui a reçu quoi," em="et quand." text={`Chaque plaidoyer part avec une lettre d’envoi par destinataire, signée par le président et le secrétaire général. Les ${enLettres(tous.length)} lettres sont prêtes depuis le 1er octobre 2026 ; ${envoyes ? `${enLettres(envoyes)} sont parties` : "aucune n’est encore partie : elles attendent la signature du bureau"}${reponses ? `, ${enLettres(reponses)} réponse${reponses > 1 ? "s" : ""} reçue${reponses > 1 ? "s" : ""}` : ""}. Chaque envoi, accusé de réception et réponse sera daté ici le jour où il a lieu.`} />
              <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Transmission des plaidoyers">
                <table className="ob-table">
                  <thead><tr><th scope="col">Dossier</th><th scope="col">Destinataires</th><th scope="col">Envoyées</th><th scope="col">Réponses</th></tr></thead>
                  <tbody>
                    {idx.plaidoyers.filter((p) => tr[p.id]).map((p) => {
                      const t = tr[p.id];
                      return (
                        <tr key={p.id}>
                          <th scope="row"><a href={`#${p.id}`}>{p.title}</a></th>
                          <td><details><summary>{t.destinataires.length} destinataire{t.destinataires.length > 1 ? "s" : ""}</summary><ul className="tr-liste">{t.destinataires.map((d) => <li key={d.nom}>{d.nom} — <em>{STATUTS[d.statut]}{d.envoye ? ` le ${d.envoye}` : ""}</em>{d.resume ? ` : ${d.resume}` : ""}</li>)}{(t.a_identifier ?? []).map((x) => <li key={x}>{x} — <em>à identifier avant envoi</em></li>)}</ul></details></td>
                          <td>{t.destinataires.filter((d) => d.statut !== "a-signer").length} / {t.destinataires.length}</td>
                          <td>{t.destinataires.filter((d) => d.statut === "reponse").length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}
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
