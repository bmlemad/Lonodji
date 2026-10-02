import type { Metadata } from "next";
import { jsonLd, webPageSchema } from "@/lib/schema";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import PagesVoisines from "@/components/pages-voisines";
import { metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { ENGAGEMENTS, INCONNUES, LECONS, PROPOSITIONS, SAVOIRS, SOURCES, type Constat, type Lien } from "@/lib/sous-sol";

const ROUTE = "/territoire/sous-sol";
const TITRE = "Le sous-sol du Mandoul Occidental : ce que l’on sait, et ce qu’il faut préparer";
const RESUME = "Pétrole du bassin voisin de Doba, fer des anciens fondeurs, or du Nord, sous-sol peu étudié : ce qui est établi, ce qui ne l’est pas, les leçons de Doba et nos propositions.";

export const metadata: Metadata = {
  title: "Sous-sol & ressources naturelles",
  description: metaDescription("Pétrole du bassin voisin de Doba, fer des anciens fondeurs, or du Nord : ce qui est établi, ce qui reste inconnu, les leçons de Doba et nos propositions."),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE), title: TITRE, description: RESUME },
};

/* Renvois numérotés vers la liste des sources, en bas de page. */
const ORDRE = Object.keys(SOURCES);
function Renvois({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return (
    <span className="pc-sources">
      Sources :{" "}
      {ids.map((id, i) => <span key={id}>{i ? ", " : ""}<a href={`#source-${id}`}>{ORDRE.indexOf(id) + 1}</a></span>)}
    </span>
  );
}
function Liens({ liens }: { liens?: Lien[] }) {
  if (!liens?.length) return null;
  return <span className="pc-sources">{liens.map((l, i) => <span key={l.href}>{i ? " · " : ""}<Link href={l.href}>{l.label}</Link></span>)}</span>;
}
function Cartes({ items }: { items: Constat[] }) {
  return (
    <div className="gl-artic">
      {items.map((c) => (
        <article key={c.titre}>
          <h3>{c.titre}</h3>
          <p>{c.texte}</p>
          <Renvois ids={c.sources} />
          <Liens liens={c.liens} />
        </article>
      ))}
    </div>
  );
}

export default function SousSol() {
  return (
    <main id="main-content" className="hub-page gl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: TITRE, description: RESUME, lang: "fr" }) }) }} />
      <PageHeader
        eyebrow="Territoire · sous-sol & ressources naturelles"
        title="Le sous-sol du Mandoul Occidental :"
        em="ce que l’on sait, et ce qu’il faut préparer."
        lead="On dit souvent que notre sous-sol est prometteur : le pétrole est exploité depuis 2003 dans le bassin voisin de Doba, nos ancêtres fondaient un minerai de fer local, et l’or attire déjà des jeunes du département vers le Nord. Cette page fait le point, source par source : ce qui est établi, ce qui ne l’est pas encore, ce que Doba nous apprend, et ce que nous proposons pour que, si des ressources sont un jour exploitées ici, elles profitent d’abord à ceux qui vivent dessus."
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Sous-sol & ressources naturelles" }]}
        pills={[`${SAVOIRS.length} constats sourcés`, `${INCONNUES.length} inconnues`, `${PROPOSITIONS.length} propositions`]}
      />
      <Stats items={[
        { value: "2003", label: "début de l’exploitation du bassin de Doba", note: "inaugurée le 10 octobre 2003" },
        { value: "5 %", label: "du territoire tchadien couvert par des levés géophysiques aéroportés", note: "Banque mondiale, août 2023" },
        { value: "4,5 %", label: "des revenus pétroliers directs réservés en 1999 à la région productrice", note: "loi n° 001/PR/1999" },
        { value: "?", label: "gisement connu dans le Mandoul Occidental", note: "aucune source publique trouvée au 30 septembre 2026" },
      ]} />

      <nav className="pc-sommaire" aria-label="Sur cette page">
        <a href="#savoirs"><b>1</b>Ce que l’on sait <span>{SAVOIRS.length}</span></a>
        <a href="#inconnues"><b>2</b>Ce que l’on ne sait pas <span>{INCONNUES.length}</span></a>
        <a href="#doba"><b>3</b>Les leçons de Doba</a>
        <a href="#propositions"><b>4</b>Nos propositions <span>{PROPOSITIONS.length}</span></a>
        <a href="#sources"><b>+</b>Sources <span>{ORDRE.length}</span></a>
      </nav>

      <section className="hub-section" id="savoirs">
        <SectionHead eyebrow="Ce que l’on sait" title="Un voisin producteur," em="un sous-sol encore peu connu." text="Chaque constat renvoie à une source publique, lue le 30 septembre 2026. Aucune ne situe à ce jour un gisement dans le département lui-même." />
        <Cartes items={SAVOIRS} />
      </section>

      <section className="hub-section" id="inconnues">
        <SectionHead eyebrow="Ce que l’on ne sait pas" title="Des questions" em="avant les promesses." text="Nous ne les avons trouvées dans aucune source publique. Quiconque détient une réponse documentée peut nous l’écrire : elle sera publiée avec sa source." />
        <ol className="gl-regles">{INCONNUES.map((q) => <li key={q}>{q}</li>)}</ol>
      </section>

      <section className="hub-section" id="doba">
        <SectionHead eyebrow="Les leçons de Doba" title="Plus de vingt ans de pétrole," em="juste à côté de chez nous." text="Le Logone Oriental a vécu ce que le Mandoul Occidental pourrait vivre. Ce qui s’y est passé dit ce qu’il faut fixer avant, pas après." />
        <Cartes items={LECONS} />
      </section>

      <section className="hub-section" id="propositions">
        <SectionHead eyebrow="Nos propositions" title="Fixer les règles" em="avant le premier forage." text="Propositions du 30 septembre 2026, à valider par le bureau de l’association. Elles ne supposent aucun gisement : elles valent pour une carrière de latérite comme pour un puits de pétrole." />
        <ul className="gl-demandes">
          {PROPOSITIONS.map((p) => <li key={p.texte}><strong>{p.qui}.</strong> {p.texte} <Liens liens={p.liens} /></li>)}
        </ul>
        <div style={{ marginTop: 56 }}><SectionHead eyebrow="La contrepartie" title="Ce que nous ferons" em="nous-mêmes." /></div>
        <ul className="gl-demandes">
          {ENGAGEMENTS.map((p) => <li key={p.texte}><strong>{p.qui}.</strong> {p.texte} <Liens liens={p.liens} /></li>)}
        </ul>
        <p className="lg-footnote">Ce sujet relève de la thématique <Link href="/programmes#environnement-ressources">Environnement, climat & ressources naturelles</Link>, qui cherche encore son coordonnateur ou sa coordonnatrice. <Link href="/participer?theme=06#contact">Proposer sa compétence</Link> : géologues, ingénieurs du pétrole et des mines, juristes, environnementalistes.</p>
      </section>

      <section className="hub-section" id="sources">
        <SectionHead eyebrow="Sources" title="D’où vient" em="chaque constat." />
        <ol className="gl-regles">
          {ORDRE.map((id) => {
            const s = SOURCES[id];
            return <li key={id} id={`source-${id}`}><a href={s.href} rel="noopener">{s.titre}</a> — {s.editeur}, {s.date}{s.date.endsWith(".") ? "" : "."}</li>;
          })}
        </ol>
      </section>

      <section className="hub-section" id="lire">
        <SectionHead eyebrow="Aller plus loin" title="Les pages" em="que celle-ci relie." />
        <div className="link-list">
          <Link href="/territoire/gouvernance-locale"><small>Territoire</small><strong>Gouvernance locale</strong><span>Qui décide quoi, du canton à l’État : à qui s’adressent nos propositions.</span></Link>
          <Link href="/patrimoine/lieux-sacres"><small>Patrimoine</small><strong>Lieux sacrés et sépultures</strong><span>Le registre tenu par la chefferie, jamais publié, et l’inscription des périmètres au plan communal.</span></Link>
          <Link href="/territoire/diagnostic"><small>Territoire</small><strong>Diagnostic territorial</strong><span>Dont le départ d’enfants vers les sites aurifères du Nord.</span></Link>
          <Link href="/programmes#environnement-ressources"><small>Thématique</small><strong>Environnement, climat & ressources naturelles</strong><span>La thématique qui portera ce dossier.</span></Link>
        </div>
      </section>

      <PagesVoisines route={ROUTE} />
      <Partager route={ROUTE} titre={TITRE} texte={RESUME} />
      <p className="lg-footnote">Page créée le 30 septembre 2026 à partir de sources publiques ; les liens externes s’ouvrent sur les sites de leurs éditeurs. Une erreur de fait, une source plus récente ? <Link href="/participer/mise-a-jour?page=%2Fterritoire%2Fsous-sol">Signalez-la</Link> : elle sera corrigée et datée.</p>
    </main>
  );
}
