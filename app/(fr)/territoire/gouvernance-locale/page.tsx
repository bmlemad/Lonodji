import type { Metadata } from "next";
import { jsonLd, webPageSchema } from "@/lib/schema";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import PagesVoisines from "@/components/pages-voisines";
import { enLettres, metaDescription, ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { ARTICULATIONS, INDICATEURS, LIENS_GOUVERNANCE as L, NIVEAUX, problemesParDecideur, RESUME_PROPOSITIONS, type Lien } from "@/lib/gouvernance-locale";

const ROUTE = "/territoire/gouvernance-locale";

export const metadata: Metadata = {
  title: "Gouvernance locale",
  description: metaDescription("Qui décide quoi à Bédjondo, de l’État aux quartiers : ce que nos dossiers demandent à chaque niveau, comment ils s’articulent et les indicateurs de suivi."),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE), title: "Gouvernance locale à Bédjondo : qui décide quoi", description: "Chaque niveau de décision, nos demandes, leurs articulations et les indicateurs pour les suivre." },
};

function Sources({ sources }: { sources: Lien[] }) {
  return <span className="pc-sources">{sources.map((s, i) => <span key={s.label}>{i ? " · " : ""}<Link href={s.href}>{s.label}</Link></span>)}</span>;
}


export default function GouvernanceLocale() {
  const probs = problemesParDecideur();
  const publies = INDICATEURS.filter((i) => i.statut === "publié").length;
  return (
    <main id="main-content" className="hub-page gl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: "Gouvernance locale à Bédjondo : qui décide quoi", description: "Chaque niveau de décision, nos demandes, leurs articulations et les indicateurs pour les suivre.", lang: "fr" }) }) }} />
      <PageHeader
        eyebrow="Territoire · gouvernance locale"
        title="Gouvernance locale :"
        em="qui décide quoi, et comment nous y prenons part."
        lead="Depuis les élections du 29 décembre 2024, l’essentiel de ce que Bédjondo attend ne se décide plus seulement à N’Djamena. Cette page rassemble, niveau par niveau, ce que nos dossiers disent de chaque décideur — de l’État aux quartiers, en passant par les chefferies —, ce que nous demandons à chacun, là où plusieurs doivent agir ensemble, et les indicateurs pour le suivre. Elle ne remplace pas les dossiers : elle les relie."
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Gouvernance locale" }]}
        pills={[`${NIVEAUX.length} niveaux de décision`, `${ARTICULATIONS.length} articulations`, `${INDICATEURS.length} indicateurs, dont ${publies} publiés`]}
      />
      <Stats items={[
        { value: "18", label: "conseillers communaux", note: "élus pour six ans, renouvelables une fois" },
        { value: "2", label: "sessions ordinaires par an", note: "plus la session budgétaire" },
        { value: "13", label: "domaines partagés", note: "entre l’État et les collectivités" },
        { value: "2,1 %", label: "des recettes publiques", note: "dépensées par les collectivités (2020)" },
      ]} />

      <nav className="pc-sommaire" aria-label="Sur cette page">
        <a href="#niveaux"><b>1</b>Qui décide quoi <span>{NIVEAUX.length}</span></a>
        <a href="#articulations"><b>2</b>Agir ensemble <span>{ARTICULATIONS.length}</span></a>
        <a href="#indicateurs"><b>3</b>Indicateurs <span>{INDICATEURS.length}</span></a>
        <a href="#methode"><b>4</b>Notre méthode</a>
        <a href="#lire"><b>+</b>Les dossiers reliés</a>
      </nav>

      <section className="hub-section" id="niveaux">
        <SectionHead eyebrow="Qui décide quoi" title="Six niveaux," em="du plus national au plus proche." text="Pour chaque niveau : qui il est, ce qui relève de lui d’après nos dossiers, les problématiques du diagnostic qui en dépendent, et ce que nous lui demandons. La règle qui guide nos plaidoyers est la subsidiarité : ce qui peut être décidé à Bédjondo doit l’être à Bédjondo." />
        <ol className="gl-niveaux">
          {NIVEAUX.map((n, i) => {
            const liste = n.decideurs.flatMap((d) => probs[d] ?? []);
            return (
              <li className="gl-niveau" id={`niveau-${n.id}`} key={n.id}>
                <div className="gl-tete">
                  <span className="pp-num">{i + 1}</span>
                  <div><h3>{n.nom}</h3><p className="gl-qui">{n.qui}</p></div>
                </div>
                <p className="gl-role">{n.role}</p>
                {liste.length ? (
                  <details className="gl-probs">
                    <summary>{liste.length} problématique{liste.length > 1 ? "s" : ""} du diagnostic en dépend{liste.length > 1 ? "ent" : ""}</summary>
                    <ul>{liste.map((p) => <li key={p.id}><Link href={`/territoire/diagnostic#${p.id}`}>{p.texte}</Link></li>)}</ul>
                  </details>
                ) : null}
                <p className="gl-label">Nos demandes</p>
                <ul className="gl-demandes">{n.demandes.map((d) => <li key={d.texte}>{d.texte} <Sources sources={d.sources} /></li>)}</ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="hub-section" id="articulations">
        <SectionHead eyebrow="Agir ensemble" title="Là où deux niveaux" em="doivent se parler." text="Commune, chefferies, préfecture, quartiers : sur ces cinq sujets, aucun ne peut réussir seul. Chaque point est déjà écrit dans un de nos dossiers." />
        <div className="gl-artic">
          {ARTICULATIONS.map((a) => (
            <article key={a.titre}>
              <p className="gl-qui-tag">{a.qui}</p>
              <h3>{a.titre}</h3>
              <p>{a.texte}</p>
              <Sources sources={a.sources} />
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="indicateurs">
        <SectionHead eyebrow="Suivre" title="Des indicateurs," em="publiés et proposés." text={`Les ${enLettres(publies)} premiers figurent déjà dans le cadre de résultats de nos plaidoyers. Les suivants sont proposés le 30 septembre 2026 et restent à valider par le bureau ; leurs cibles et échéances seront fixées avec la commune, pas avant.`} />
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Indicateurs de gouvernance locale">
          <table className="sec-table gl-table">
            <thead><tr><th scope="col">Indicateur</th><th scope="col">Départ</th><th scope="col">Cible</th><th scope="col">Échéance</th><th scope="col">Vérification</th><th scope="col">Statut</th></tr></thead>
            <tbody>
              {INDICATEURS.map((i) => (
                <tr key={i.indicateur}><td>{i.indicateur}</td><td>{i.depart}</td><td>{i.cible}</td><td>{i.echeance}</td><td>{i.verification}</td><td><span className={i.statut === "publié" ? "gl-statut est-publie" : "gl-statut"}>{i.statut}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Source des indicateurs publiés : <Link href="/actions#resultats">cadre de résultats des plaidoyers</Link>. Leur suivi paraît sur le <Link href="/impact">tableau de suivi</Link>.</p>
      </section>

      <section className="hub-section" id="methode">
        <SectionHead eyebrow="Notre méthode" title="Six règles," em="que nous nous appliquons d’abord." />
        <ol className="gl-regles">
          <li><strong>Rien sans données.</strong> Aucun chiffre sans sa source ; les inventaires qui manquent, nous les produisons.</li>
          <li><strong>La subsidiarité.</strong> Ce qui peut être décidé à Bédjondo doit l’être à Bédjondo.</li>
          <li><strong>La contrepartie.</strong> Nous ne demandons jamais sans nous engager.</li>
          <li><strong>La trace publique.</strong> Dates d’envoi, réponses, engagements : tout est inscrit, y compris les silences.</li>
          <li><strong>L’entretien avant l’inauguration.</strong> Qui entretient, avec quel argent, formé par qui.</li>
          <li><strong>Ni parti, ni substitut.</strong> Nous ne présentons pas de candidats et nous ne remplaçons ni la commune ni les chefferies.</li>
        </ol>
        <p className="lg-footnote">Ces six règles sont exposées en détail sur la page <Link href={L.decentralisation.href}>Décentralisation & développement local</Link>, avec le cadre légal et ses sources.</p>
      </section>

      <section className="hub-section" id="lire">
        <SectionHead eyebrow="Aller plus loin" title="Les dossiers" em="que cette page relie." />
        <div className="link-list">
          <Link href={L.decentralisation.href}><small>Dossier</small><strong>Décentralisation & développement local</strong><span>Le cadre légal, l’écart entre les textes et les moyens, les quatre règles demandées au conseil.</span></Link>
          <Link href={L.propositions.href}><small>Propositions</small><strong>Nos propositions à la commune</strong><span>{RESUME_PROPOSITIONS}, notre démarche avec la commune et les autorités locales.</span></Link>
          <Link href={L.paix.href}><small>Dossier</small><strong>Paix entre agriculteurs et éleveurs</strong><span>Six mesures à l’échelle des cantons, dont le comité mixte et le cahier de médiation.</span></Link>
          <Link href={L.lieux.href}><small>Dossier</small><strong>Lieux sacrés et sépultures</strong><span>Le registre tenu par la chefferie, et l’inscription au plan communal.</span></Link>
          <Link href="/programmes#gouvernance-plaidoyer"><small>Thématique</small><strong>Gouvernance & plaidoyer</strong><span>La thématique qui porte ces dossiers, au pôle Gouvernance, paix & plaidoyer.</span></Link>
          <Link href={L.enquetes.href}><small>Enquêtes</small><strong>Enquêtes de terrain</strong><span>Ce que nous demandons aux chefs de quartier et de village, et comment.</span></Link>
        </div>
      </section>

      <PagesVoisines route={ROUTE} />
      <Partager route={ROUTE} titre="Gouvernance locale à Bédjondo : qui décide quoi" texte="Chaque niveau de décision, nos demandes, leurs articulations et les indicateurs pour les suivre." />
      <p className="lg-footnote">Page créée le 30 septembre 2026 à partir des dossiers publiés ; chaque demande renvoie au texte d’origine. Une erreur de fait ? <Link href="/participer/mise-a-jour?page=%2Fterritoire%2Fgouvernance-locale">Signalez-la</Link> : elle sera corrigée et datée.</p>
    </main>
  );
}
