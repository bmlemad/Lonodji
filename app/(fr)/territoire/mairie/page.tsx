import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { enLettres, getIndex, metaDescription, ogFor } from "@/lib/content";
import { getTransmissions, STATUTS } from "@/lib/transmissions";
import { nombrePropositions, nombreSansDepense, PROJETS_PRIORITAIRES } from "@/lib/propositions-commune";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

/* Tout ce que l'association adresse à la mairie de Bédjondo, en un seul endroit (18/10/2026) : plaidoyers dont la
   commune est destinataire, ceux où elle est en copie, propositions et projets prioritaires, et l'état de chaque
   envoi. Tout est calculé depuis content/transmissions.json, content/index.json et lib/propositions-commune.ts. */

const ROUTE = "/territoire/mairie";
const DESCRIPTION = metaDescription("Toutes les initiatives d’ADEB LONODJI adressées à la mairie de Bédjondo : plaidoyers, propositions, projets prioritaires, avec l’état de chaque envoi et de chaque réponse.");

export const metadata: Metadata = {
  title: "Nos initiatives auprès de la mairie de Bédjondo",
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { ...ogFor(ROUTE), title: "Nos initiatives auprès de la mairie de Bédjondo", description: DESCRIPTION },
};

const jour = (iso?: string) => (iso ? new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function Mairie() {
  const idx = getIndex();
  const t = getTransmissions();
  const plaidoyers = idx.plaidoyers.filter((p) => t[p.id]);
  const directs = plaidoyers.flatMap((p) => t[p.id].destinataires.filter((d) => d.type === "maire").map((d) => ({ p, d })));
  const enCopie = plaidoyers.filter((p) => !t[p.id].destinataires.some((d) => d.type === "maire") && /maire/i.test(t[p.id].copie));
  const envoyes = directs.filter(({ d }) => d.statut !== "a-signer").length;
  const reponses = directs.filter(({ d }) => d.statut === "reponse").length;
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: "Nos initiatives auprès de la mairie de Bédjondo", description: DESCRIPTION }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Territoire", url: "/territoire" }, { name: "Initiatives auprès de la mairie" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow="Territoire · commune de Bédjondo"
        title="Tout ce que nous adressons"
        em="à la mairie de Bédjondo."
        lead="Plaidoyers, propositions, projets prioritaires : chaque initiative de l’association qui concerne la commune est réunie ici, avec l’état de son envoi. Une lettre n’est dite « envoyée » qu’à la date réelle de son dépôt, et une réponse n’est mentionnée que lorsqu’elle a été reçue."
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Initiatives auprès de la mairie" }]}
        pills={[`${directs.length} lettres à la mairie`, `${enCopie.length} en copie`, `${nombrePropositions()} propositions`, `${PROJETS_PRIORITAIRES.length} projets prioritaires`]}
      />
      <Stats items={[
        { value: String(directs.length), label: "plaidoyers adressés à la mairie", note: "la commune y est destinataire" },
        { value: String(envoyes), label: "lettres envoyées", note: envoyes ? "date réelle de dépôt au registre" : "les lettres sont prêtes et attendent la signature du bureau" },
        { value: String(reponses), label: "réponses reçues", note: "datées et résumées dès réception" },
        { value: String(nombrePropositions()), label: "propositions à la commune", note: `dont ${nombreSansDepense()} sans dépense pour la mairie` },
      ]} />

      <section className="hub-section" id="plaidoyers">
        <SectionHead eyebrow="Destinataire : la mairie" title="Les plaidoyers" em="adressés à la commune." text="Pour chacun, la demande principale et l’état de la lettre adressée au maire et au conseil communal." />
        <ol className="registre">
          {directs.map(({ p, d }) => (
            <li className="registre-ligne" key={p.id} id={p.id}>
              <div className="registre-tete"><span className={`status registre-statut ${d.statut === "a-signer" ? "eval-statut--partiel" : "eval-statut--present"}`}>{STATUTS[d.statut]}</span>{d.envoye ? <time dateTime={d.envoye}>envoyée le {jour(d.envoye)}</time> : null}<small>{p.theme}</small></div>
              <h3><Link href={p.href}>{p.title}</Link></h3>
              {p.demand ? <p>{p.demand}</p> : null}
              {d.reponse ? <p className="registre-suite"><b>Réponse du {jour(d.reponse)} :</b> {d.resume}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      {enCopie.length ? (
        <section className="hub-section" id="copie">
          <SectionHead eyebrow="La mairie en copie" title="Les plaidoyers" em="dont la commune est informée." text="Adressés d’abord à l’État ou à des opérateurs, ils sont transmis en copie au maire et au conseil communal." />
          <div className="link-list">{enCopie.map((p) => <Link key={p.id} href={p.href}><small>{p.theme}</small><strong>{p.title}</strong><span>{p.demand}</span></Link>)}</div>
        </section>
      ) : null}

      <section className="hub-section" id="propositions">
        <SectionHead eyebrow="Propositions de l’association" title={`${enLettres(nombrePropositions(), true)} propositions`} em={`et ${enLettres(PROJETS_PRIORITAIRES.length)} projets prioritaires.`} text="Ce que l’association propose à la commune, ce qu’elle apporte elle-même, et les projets qu’elle propose de porter avec elle." />
        <div className="link-list">
          <Link href="/territoire/propositions-commune"><small>Propositions</small><strong>Nos propositions à la commune</strong><span>Chacune avec sa source, et ce que l’association apporte en retour.</span></Link>
          <Link href="/territoire/propositions-commune/dossier"><small>Dossier imprimable</small><strong>Le dossier à remettre en main propre</strong><span>Version papier des propositions.</span></Link>
          <Link href="/journal/2026-09-16-note-commune-bedjondo"><small>Note du 16 septembre 2026</small><strong>Note à la commune : six propositions</strong><span>Le premier texte adressé à la mairie.</span></Link>
          <Link href="/territoire/gouvernance-locale"><small>Repères</small><strong>Qui décide quoi</strong><span>Compétences de la commune, de l’État et des chefferies.</span></Link>
        </div>
        <ul className="acc-priorites">{PROJETS_PRIORITAIRES.map((p) => <li key={p.titre}><Link href={`/territoire/propositions-commune#projet-${p.id}`}>{p.titre}</Link></li>)}</ul>
      </section>

      <section className="hub-section" id="suivi">
        <SectionHead eyebrow="Suivi" title="Ce que nous promettons" em="en retour." text="Chaque plaidoyer se termine par un engagement de l’association ; ils sont suivis publiquement, comme les décisions du bureau." />
        <div className="link-list">
          <Link href="/association/engagements"><small>Engagements</small><strong>Nos engagements publics</strong><span>Ce qui est promis, ce qui est confirmé réalisé.</span></Link>
          <Link href="/actions#transmission"><small>Transmission</small><strong>Tous les envois, tous destinataires</strong><span>Ministères, opérateurs, commune.</span></Link>
          <Link href="/transparence/decisions"><small>Registre</small><strong>Les décisions du bureau</strong><span>Datées et sourcées.</span></Link>
        </div>
      </section>
      <Partager route={ROUTE} titre="Nos initiatives auprès de la mairie de Bédjondo" texte={DESCRIPTION} />
    </main>
  );
}
