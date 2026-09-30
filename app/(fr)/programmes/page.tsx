import { alternatesLangues } from "@/lib/langues";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats, ThematiqueRow, VuesThematiques } from "@/components/blocks";
import { LegacySections } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { directionsCount, enLettres, filledCount, getIndex, getPage, ogFor, pickSections, thematiqueCount } from "@/lib/content";
import Partager from "@/components/partager";
import OuvrirAncre from "@/components/ouvrir-ancre";
import { programmesUtilesDe } from "@/lib/bailleurs";

const partenairesDe = (id: string) => programmesUtilesDe(id).map((p) => ({ id: p.id, nom: p.nom.split(" — ")[0], proche: ["bedjondo", "koumra", "mandoul"].includes(p.portee) }));

export const metadata: Metadata = {
  title: "Nos actions — quatre pôles, vingt thématiques",
  description: "Quatre pôles, vingt thématiques et deux cellules transversales : coordonnateurs, objectifs et Objectifs de développement durable associés.",
  alternates: { canonical: "/programmes", languages: alternatesLangues("/programmes") },
  openGraph: ogFor("/programmes"),
};

export default function Programmes() {
  const idx = getIndex();
  const page = getPage("poles");
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const { poles, cellules } = idx.structure;
  const dir = directionsCount(idx);
  const extra = pickSections(page, { only: ["nos-actions-page-par-page", "odd-cadrage", "odd-index", "devenir-coordonnateur-dune-thematique"] });
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: "/programmes", name: "Nos actions — quatre pôles, vingt thématiques", description: "Quatre pôles, vingt thématiques et deux cellules transversales : coordonnateurs, objectifs et Objectifs de développement durable associés." }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Nos actions", url: "/programmes" }, { name: "Nos actions" }], "/programmes")] }) }} />
      <PageHeader
        eyebrow="Nos actions · pôles & thématiques"
        title="Quatre pôles,"
        em="vingt thématiques."
        lead={`Les Chantiers ADEB LONODJI : chaque pôle sera dirigé par un directeur ou une directrice de pôle, au rang de chef de projet ; chaque thématique est animée par un coordonnateur ou une coordonnatrice, avance à son rythme et rend compte ici. ${enLettres(filled, true)} thématiques sont pourvues ; ${enLettres(total - filled)} cherchent encore la personne qui les portera, et les ${enLettres(dir.total - dir.pourvues)} directions de pôle sont à pourvoir.`}
      />
      <VuesThematiques active="poles" />
      <Stats items={[
        { value: String(poles.length), label: "pôles d’action", note: "Mémoire · Développement · Gouvernance · Numérique" },
        { value: String(total), label: "thématiques", note: "+ 2 cellules transversales" },
        { value: String(filled), label: "pourvues", note: `${Math.round((filled / total) * 100)} % des thématiques` },
        { value: String(total - filled), label: "à pourvoir", note: "candidatures ouvertes à tout membre" },
        { value: `${dir.pourvues}/${dir.total}`, label: "directions de pôle", note: "rang de chef de projet · à pourvoir" },
      ]} />
      <div className="section-actions" style={{ justifyContent: "flex-start", marginBottom: 40 }}>
        <Link className="button primary" href="/participer?coordo=1#contact">Proposer ma candidature <span aria-hidden="true">→</span></Link>
        <Link className="button secondary" href="/secteurs">Nos secteurs d’intervention <span aria-hidden="true">→</span></Link>
        <Link className="button secondary" href="/participer/trouver-ma-thematique">Trouver ma thématique <span aria-hidden="true">→</span></Link>
        <Link className="button secondary" href="/bailleurs#par-action">Programmes des bailleurs, action par action <span aria-hidden="true">→</span></Link>
        <Link className="text-link" href="/impact">Tableau de suivi <span aria-hidden="true">→</span></Link>
      </div>

      <div id="thematiques">
        {poles.map((pole) => (
          <section className="pole-block" id={pole.id} key={pole.id} aria-labelledby={`${pole.id}-titre`}>
            <header>
              <span className="pole-roman" aria-hidden="true">{pole.roman}</span>
              <div>
                <p className="eyebrow">{pole.eyebrow} · {pole.items.filter((t) => t.filled).length} pourvue{pole.items.filter((t) => t.filled).length > 1 ? "s" : ""} sur {pole.items.length}</p>
                <h2 id={`${pole.id}-titre`}>{pole.name}</h2>
                {pole.intro ? <p>{pole.intro}</p> : null}
                {pole.direction ? (
                  <p className="pole-direction">
                    <span className={pole.direction.filled ? "status" : "status status--vacant"}>{pole.direction.filled ? "Pourvue" : "À pourvoir"}</span>
                    <span><strong>Direction du pôle</strong> · {pole.direction.rang} · {pole.direction.filled ? pole.direction.name : <Link href={`/participer?direction=${pole.roman}&coordo=1#contact`}>candidater à la direction de ce pôle</Link>} · <a href={`/missions/fiche-mission-direction-${pole.id}.pdf`} download>fiche de mission (PDF) ↓</a></span>
                  </p>
                ) : null}
              </div>
            </header>
            {pole.items.map((t) => <ThematiqueRow key={t.id} t={t} partenaires={partenairesDe(t.id)} />)}
          </section>
        ))}
        {cellules ? (
          <section className="pole-block" id="cellules" aria-labelledby="cellules-titre">
            <header>
              <span className="pole-roman" aria-hidden="true">+</span>
              <div>
                <p className="eyebrow">{cellules.eyebrow}</p>
                <h2 id="cellules-titre">{cellules.name}</h2>
                {cellules.intro ? <p>{cellules.intro}</p> : null}
              </div>
            </header>
            {cellules.items.map((t) => <ThematiqueRow key={t.id} t={t} partenaires={t.id === "cellule-financement-ressources" ? undefined : partenairesDe(t.id)} />)}
          </section>
        ) : null}
      </div>

      <section className="hub-section" id="diriger-un-pole">
        <SectionHead eyebrow="Diriger un pôle" title="Quatre directions de pôle," em="au rang de chef de projet." text="Depuis le 28 septembre 2026, chaque pôle a une direction à pourvoir, distincte de la coordination des thématiques. Le directeur ou la directrice de pôle a rang de chef de projet : il anime les coordonnateurs de ses thématiques, tient le plan d’action et le calendrier du pôle, suit les plaidoyers et les projets qui en relèvent, et rend compte au bureau et à l’assemblée. Pour les partenaires internationaux, nous traduisons par « Pillar Lead » (niveau « Programme Manager ») : l’équivalent figure sur les fiches de mission et les pages anglaises. Les six « programmes » du projet ODEB sont autre chose : ils croisent les pôles. Les quatre postes sont ouverts à tout membre ; chaque poste a sa fiche de mission en PDF, comme chaque thématique." />
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/programmes/fiches-de-mission">Toutes les fiches de mission <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="hub-section">
        <SectionHead eyebrow="Pour aller plus loin" title="Comment ça fonctionne," em="et où chaque pôle agit." text="Les pages qui suivent viennent de la première version du site et restent la référence : devenir coordonnateur, la lecture par les Objectifs de développement durable, et les dossiers ouverts par chaque pôle." />
        <div className="legacy plier-liste">
          {extra.map((sec) => (
            <details className="plier" key={sec.id} id={sec.id}>
              <summary><strong>{(sec.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? sec.id).replace(/<[^>]+>/g, "").trim()}</strong><span>{Math.max(1, Math.round(sec.html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220))} min de lecture</span></summary>
              <LegacySections sections={[{ ...sec, id: `${sec.id}-texte` }]} sansPremierTitre />
            </details>
          ))}
        </div>
        <LegacyEnhance hasForms={page.forms.length > 0} />
      </section>
      <OuvrirAncre />
      <Partager route="/programmes" titre="Nos actions" texte="Quatre pôles, vingt thématiques et deux cellules transversales : coordonnateurs, objectifs et Objectifs de développement durable associés." />
    </main>
  );
}
