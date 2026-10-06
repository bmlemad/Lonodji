import ArchitectureReference from "@/components/architecture-reference";
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
import { PRIORITAIRES } from "@/lib/organisation";

const partenairesDe = (id: string) => programmesUtilesDe(id).map((p) => ({ id: p.id, nom: p.nom.split(" — ")[0], proche: ["bedjondo", "koumra", "mandoul"].includes(p.portee) }));

/* nombre de thématiques et de cellules, comptés dans content/index.json */
const NB = (() => { const i = getIndex(); return { poles: enLettres(i.structure.poles.length), Poles: enLettres(i.structure.poles.length, true), them: enLettres(thematiqueCount(i)), cell: enLettres(i.structure.cellules?.items.length ?? 0) }; })();
const TITRE = `Nos actions — ${NB.poles} piliers, ${NB.them} thématiques`;
const DESCRIPTION = `${NB.Poles} piliers, ${NB.them} thématiques et ${NB.cell} cellules transversales : coordonnateurs, thématiques prioritaires, objectifs et Objectifs de développement durable associés.`;

/* Plans d’action thématiques (hérités de la première version du site) : liés ici depuis que le menu
   « Nos actions » renvoie à cette page pour les trouver (menu resserré le 4 octobre 2026). */
const PLANS = [
  { label: "Agriculture, élevage et sécurité alimentaire", href: "/programmes/agriculture-securite-alimentaire" },
  { label: "Environnement & durabilité", href: "/programmes/environnement" },
  { label: "Jeunes mères, orphelins, personnes isolées", href: "/programmes/solidarite-inclusion" },
  { label: "Plan pour les veuves", href: "/programmes/veuves" },
  { label: "Plan handicap", href: "/programmes/handicap" },
  { label: "Agriculteurs et éleveurs : prévenir les conflits", href: "/programmes/agriculteurs-eleveurs" },
  { label: "Nos thématiques et les ODD", href: "/programmes/odd" },
];

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: "/programmes", name: TITRE, description: DESCRIPTION }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Nos actions" }], "/programmes")] }) }} />
      <PageHeader
        eyebrow="Nos actions · piliers & thématiques"
        title={`${NB.Poles} piliers,`}
        em={`${NB.them} thématiques.`}
        lead={`Les Chantiers ADEB LONODJI : chaque pilier a une vice-présidence, pourvue par élection ; chaque thématique est animée par un coordonnateur ou une coordonnatrice, avance à son rythme et rend compte ici. Depuis le 1er octobre 2026, sept thématiques sont prioritaires. ${enLettres(filled, true)} thématiques sont pourvues ; ${enLettres(total - filled)} cherchent encore la personne qui les portera, ${dir.pourvues === dir.total ? "et chaque pilier a sa vice-présidence." : dir.pourvues ? (dir.total - dir.pourvues > 1 ? `et ${enLettres(dir.total - dir.pourvues)} vice-présidences de pilier sur ${enLettres(dir.total)} sont à pourvoir.` : `et une vice-présidence de pilier sur ${enLettres(dir.total)} est à pourvoir.`) : `et les ${enLettres(dir.total)} vice-présidences de pilier sont à pourvoir.`}`}
      />
      <ArchitectureReference />
      <VuesThematiques active="poles" />
      <Stats items={[
        { value: String(poles.length), label: "piliers d’action", note: poles.map((p) => p.name.split(/[ ,]/)[0]).join(" · ") },
        { value: String(total), label: "thématiques", note: `dont ${PRIORITAIRES.length} prioritaires · + ${cellules?.items.length ?? 0} cellules` },
        { value: String(filled), label: "pourvues", note: `${Math.round((filled / total) * 100)} % des thématiques` },
        { value: String(total - filled), label: "à pourvoir", note: "candidatures ouvertes à tout membre" },
        { value: `${dir.pourvues}/${dir.total}`, label: "vice-présidences de pilier", note: `fonction élue · ${dir.total - dir.pourvues} à pourvoir` },
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
                    <span><strong>Vice-présidence du pilier</strong> · {pole.direction.filled ? pole.direction.name : <Link href={`/participer?direction=${pole.roman}&coordo=1#contact`}>à pourvoir par élection : se porter candidat</Link>} · <a href={`/missions/fiche-mission-direction-${pole.id}.pdf`} download>fiche de mission (PDF) ↓</a></span>
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

      <section className="hub-section" id="propositions-organisation">
        <SectionHead eyebrow="Décidé le 1er octobre 2026" title="Sept thématiques prioritaires," em="et une organisation resserrée." text="Comparée à dix organisations, notre structure comptait bien plus de sujets que d’habitude, chacun porté par une seule personne. Le bureau exécutif a adopté huit décisions : le pôle II partagé (d’où les pôles V et VI, le second décidé l’après-midi avec une thématique 22, Sport, arts & loisirs), sept thématiques prioritaires — celles de nos huit dossiers de plaidoyer —, chacune avec un titulaire et un adjoint, une personne par thématique, des vice-présidences de pôle élues, la cellule Financement confiée à la trésorière par intérim, le suivi et la redevabilité confiés au secrétariat général, et une seule grille de pilotage." />
        <ul className="prio-liste">
          {PRIORITAIRES.map((p) => { const t = poles.flatMap((x) => x.items).find((x) => x.id === p.id); return t ? <li key={p.id}><a href={`#${t.id}`}><b>{t.number}</b> {t.name}</a></li> : null; })}
        </ul>
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/association/propositions-organisation">Les huit décisions et leurs sources <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="hub-section" id="diriger-un-pole">
        <SectionHead eyebrow="Vice-présider un pilier" title={`${NB.Poles} vice-présidences de pilier,`} em="pourvues par élection." text={`Depuis le 1er octobre 2026, chaque pilier a une vice-présidence déléguée, distincte de la coordination des thématiques : une personne élue qui réunit les coordonnateurs du pilier chaque trimestre, tient son plan d’action et son calendrier, suit les plaidoyers et les projets qui en relèvent, et rend compte au bureau et à l’assemblée. Ces fonctions s’appelaient « directions de pilier, au rang de chef de projet » depuis le 28 septembre 2026 ; ce rang est réservé à la future ONG, quand elle aura des moyens, et les deux titulaires gardent leur fonction sous le nouvel intitulé. Pour les partenaires internationaux, nous traduisons par « Pillar Vice-President ». Une même personne ne coordonne qu’une thématique. ${dir.total - dir.pourvues > 0 ? `${enLettres(dir.total - dir.pourvues, true)} des ${enLettres(dir.total)} vice-présidences restent à pourvoir` : `Les ${enLettres(dir.total)} vice-présidences sont pourvues`} ; chaque fonction a sa fiche de mission en PDF, comme chaque thématique.`} />
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/programmes/fiches-de-mission">Toutes les fiches de mission <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="hub-section" id="plans-d-action">
        <SectionHead eyebrow="Plans d’action" title="Sept plans thématiques," em="hérités de la première version du site." text="Chacun détaille un sujet transversal : ce que l’association propose, pour qui, et avec quelles thématiques. Ils restent la référence jusqu’à leur révision par les coordonnateurs." />
        <ul className="liens-plans">
          {PLANS.map((l) => <li key={l.href}><Link href={l.href}>{l.label} <span aria-hidden="true">→</span></Link></li>)}
        </ul>
      </section>
      <section className="hub-section">
        <SectionHead eyebrow="Pour aller plus loin" title="Comment ça fonctionne," em="et où chaque pilier agit." text="Les pages qui suivent viennent de la première version du site et restent la référence : devenir coordonnateur, la lecture par les Objectifs de développement durable, et les dossiers ouverts par chaque pilier." />
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
      <Partager route="/programmes" titre="Nos actions" texte={DESCRIPTION} />
    </main>
  );
}
