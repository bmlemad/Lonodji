import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import { LegacySections, Resume, Toc } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { getPage, ogFor } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import Partager from "@/components/partager";
import OuvrirAncre from "@/components/ouvrir-ancre";

export const metadata: Metadata = {
  title: "Redevabilité, transparence et journal des corrections",
  description: "Réponse sous 48 heures, mécanisme de plainte, protection des enfants et des personnes vulnérables, charte d’écriture et journal daté des corrections.",
  alternates: { canonical: "/transparence" },
  openGraph: ogFor("/transparence"),
};

export default function Transparence() {
  const page = getPage("redevabilite");
  const indicateurs = getIndicateurs();
  const genereLe = new Date(indicateurs.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const corrections = page.sections.find((s) => s.id === "corrections");
  const nb = corrections ? (corrections.html.match(/class="info-card"/g) || []).length : 0;
  /* Journal des corrections : les quatre plus récentes en vue, les précédentes dans un bloc repliable (rien n'est retiré).
     Deux sections longues (protections, charte d'écriture) sont repliables elles aussi ; une ancre vers elles les ouvre. */
  const EN_VUE = 4;
  const sections = page.sections.map((sec) => {
    if (sec.id !== "corrections") return sec;
    const cartes = [...sec.html.matchAll(/<article class="info-card">[\s\S]*?<\/article>/g)];
    if (cartes.length <= EN_VUE) return sec;
    const debut = cartes[EN_VUE].index!;
    const fin = cartes[cartes.length - 1].index! + cartes[cartes.length - 1][0].length;
    const plusAncienne = (cartes[cartes.length - 1][0].match(/<p class="form-note">([^·<]*)/)?.[1] ?? "").trim();
    const plie = `<details class="plier plier--corrections"><summary><strong>Les ${cartes.length - EN_VUE} corrections précédentes</strong><span>de la plus récente à la plus ancienne${plusAncienne ? `, jusqu’au ${plusAncienne}` : ""}</span></summary><div class="plier-cartes">${sec.html.slice(debut, fin)}</div></details>`;
    return { ...sec, html: sec.html.slice(0, debut) + plie + sec.html.slice(fin) };
  });
  const REPLIEES = ["ce-que-nous-protegeons-et-comment", "charte-ecriture"];
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Association · redevabilité & transparence"
        crumbs={[{ label: "L’association", href: "/mission" }, { label: "Redevabilité" }]}
        title="Une association qui demande des comptes"
        em="doit en rendre."
        lead={page.lede}
        pills={["Réponse sous 48 h ouvrées", "Plainte possible, même anonyme", `${nb} corrections datées`, `Indicateurs générés le ${genereLe}`]}
      />
      <div className="notice">
        <strong>Comment vérifier nos chiffres.</strong> Les compteurs publics sont générés depuis les contenus et relevés du site ; leur dernière génération date du {genereLe}. Les plaidoyers, décisions et corrections restent consultables dans leurs pages sources, avec leurs dates et documents lorsqu’ils existent.
      </div>
      <div className="legacy">
        <Resume items={page.resume} />
        <Toc items={page.toc} />
        {/* la première section répète le titre de la page : son h2 est retiré, le texte reste */}
        {sections.map((sec, i) => REPLIEES.includes(sec.id) ? (
          <details className="plier plier--section" key={sec.id}>
            <summary><strong>{(sec.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? "").replace(/<[^>]+>/g, "").trim()}</strong><span>{sec.id === "charte-ecriture" ? "Qui relit, les noms, la typographie, le ton" : "Enfants et personnes vulnérables, exploitation et abus, témoins, données, argent et conflits d’intérêts"}</span></summary>
            <LegacySections sections={[sec]} sansPremierTitre />
          </details>
        ) : <LegacySections key={sec.id || i} sections={[sec]} sansPremierTitre={i === 0} />)}
      </div>
      <LegacyEnhance hasForms={page.forms.length > 0} />
      <section className="hub-section">
        <SectionHead eyebrow="Pour aller plus loin" title="Documents, mentions légales" em="et données personnelles." />
        <div className="link-list">
          <Link href="/transparence/decisions"><small>Registre</small><strong>Registre public des décisions</strong><span>Décidé, nommé, annoncé, proposé : chaque ligne datée, sourcée, avec ce qui reste attendu.</span></Link>
          <Link href="/documents"><small>Documents</small><strong>Ce que nous publions</strong><span>Kit d’adhésion, cahiers de terrain, plaidoyers ; statuts et PV dès validation.</span></Link>
          <Link href="/mentions-legales"><small>Mentions légales</small><strong>Éditeur, hébergeur, formulaires</strong><span>Notice de confidentialité réécrite formulaire par formulaire.</span></Link>
          <Link href="/association/engagements"><small>Engagements</small><strong>Les douze promesses publiques</strong><span>Aucune n’est encore confirmée réalisée ; chacune est suivie.</span></Link>
        </div>
      </section>
      <OuvrirAncre />
      <Partager route="/transparence" titre="Redevabilité, transparence et journal des corrections" texte="Réponse sous 48 heures, mécanisme de plainte, protection des enfants et des personnes vulnérables, charte d’écriture et journal daté des corrections." />
    </main>
  );
}
