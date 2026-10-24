import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { getIndex, metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { getTransmissions, type StatutEnvoi } from "@/lib/transmissions";
import { nombrePropositions, nombreSansDepense } from "@/lib/propositions-commune";
import { PROJETS_EN } from "@/lib/propositions-commune-en";
import { PLAIDOYERS_EN } from "@/lib/bailleurs-en";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

/* English version of /territoire/mairie (24/10/2026). Same data: content/transmissions.json, content/index.json,
   lib/propositions-commune.ts. Advocacy files themselves are in French; links say so. */

const ROUTE = "/en/town-hall";
const TITRE = "Our initiatives with the town hall of Bédjondo";
const DESCRIPTION = metaDescription("Every initiative ADEB LONODJI addresses to the town hall of Bédjondo: advocacy files, proposals and priority projects, with the status of each letter and each reply.");
const STATUTS_EN: Record<StatutEnvoi, string> = { "a-signer": "letter ready, awaiting signature", envoye: "sent", accuse: "received (acknowledged)", reponse: "reply received" };
const jour = (iso?: string) => (iso ? new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "");

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: TITRE, description: DESCRIPTION },
};

export default function TownHall() {
  const idx = getIndex();
  const t = getTransmissions();
  const plaidoyers = idx.plaidoyers.filter((p) => t[p.id]);
  const nom = (p: { id: string; title: string }) => PLAIDOYERS_EN[p.id] ?? p.title;
  const directs = plaidoyers.flatMap((p) => t[p.id].destinataires.filter((d) => d.type === "maire").map((d) => ({ p, d })));
  const enCopie = plaidoyers.filter((p) => !t[p.id].destinataires.some((d) => d.type === "maire") && /maire/i.test(t[p.id].copie));
  const envoyes = directs.filter(({ d }) => d.statut !== "a-signer").length;
  const reponses = directs.filter(({ d }) => d.statut === "reponse").length;
  return (
    <main id="main-content" className="hub-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: TITRE, description: DESCRIPTION }), breadcrumbSchema([{ name: "Home", url: "/en/index" }, { name: "Town hall initiatives" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow="Territory · commune of Bédjondo · in English"
        title="Everything we address"
        em="to the town hall of Bédjondo."
        lead="Advocacy files, proposals, priority projects: every initiative of the association that concerns the commune is gathered here, with the status of its letter. A letter is called “sent” only from the real date it was delivered, and a reply is mentioned only once it has been received."
        crumbs={[{ label: "Town hall initiatives" }]}
        lang="en"
        pills={[`${directs.length} letters to the town hall`, `${enCopie.length} in copy`, `${nombrePropositions()} proposals`, `${PROJETS_EN.length} priority projects`]}
      />
      <Stats items={[
        { value: String(directs.length), label: "advocacy files addressed to the town hall", note: "the commune is a recipient" },
        { value: String(envoyes), label: "letters sent", note: envoyes ? "real delivery date in the register" : "the letters are ready and await the board’s signature" },
        { value: String(reponses), label: "replies received", note: "dated and summarised on receipt" },
        { value: String(nombrePropositions()), label: "proposals to the commune", note: `${nombreSansDepense()} of them cost the town hall nothing` },
      ]} />

      <section className="hub-section" id="advocacy">
        <SectionHead eyebrow="Recipient: the town hall" title="Advocacy files" em="addressed to the commune." text="For each, the status of the letter addressed to the mayor and the municipal council. The files themselves are in French." />
        <ol className="registre">
          {directs.map(({ p, d }) => (
            <li className="registre-ligne" key={p.id} id={p.id}>
              <div className="registre-tete"><span className={`status registre-statut ${d.statut === "a-signer" ? "eval-statut--partiel" : "eval-statut--present"}`}>{STATUTS_EN[d.statut]}</span>{d.envoye ? <time dateTime={d.envoye}>sent on {jour(d.envoye)}</time> : null}</div>
              <h3><Link href={p.href} hrefLang="fr">{nom(p)}</Link> <small>(in French)</small></h3>
              {d.reponse ? <p className="registre-suite"><b>Reply of {jour(d.reponse)}</b></p> : null}
            </li>
          ))}
        </ol>
      </section>

      {enCopie.length ? (
        <section className="hub-section" id="copy">
          <SectionHead eyebrow="The town hall in copy" title="Advocacy files" em="the commune is informed of." text="Addressed first to the State or to operators, they are copied to the mayor and the municipal council." />
          <div className="link-list">{enCopie.map((p) => <Link key={p.id} href={p.href} hrefLang="fr"><small>In French</small><strong>{nom(p)}</strong></Link>)}</div>
        </section>
      ) : null}

      <section className="hub-section" id="proposals">
        <SectionHead eyebrow="The association’s proposals" title={`${nombrePropositions()} proposals`} em={`and ${PROJETS_EN.length} priority projects.`} text="What the association proposes to the commune, what it brings itself, and the projects it offers to carry with it." />
        <div className="link-list">
          <Link href="/en/commune"><small>Proposals</small><strong>Our proposals to the commune</strong><span>Each with its source, and what the association brings in return.</span></Link>
          <Link href="/en/governance"><small>Landmarks</small><strong>Who decides what</strong><span>Powers of the commune, the State and the chiefdoms.</span></Link>
          <Link href="/en/advocacy"><small>Advocacy</small><strong>All advocacy files</strong><span>Texts, figures, sources and recipients.</span></Link>
        </div>
        <ul className="acc-priorites">{PROJETS_EN.map((p) => <li key={p.id}><Link href={`/en/commune#projet-${p.id}`}>{p.titre}</Link></li>)}</ul>
      </section>
      <Partager route={ROUTE} titre={TITRE} texte={DESCRIPTION} />
    </main>
  );
}
