import type { Metadata } from "next";
import { alternatesLangues } from "@/lib/langues";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { enLettres, getIndex, ogFor } from "@/lib/content";
import { COMPARES, PRIORITAIRES, RECOMMANDATIONS, SOURCES } from "@/lib/organisation";
import { jsonLd, webPageSchema } from "@/lib/schema";
import { dateFr, etatElection, etape } from "@/lib/election";

/* 1er octobre 2026 : huit propositions d'organisation tirées d'un benchmark, soumises au bureau exécutif et adoptées
   par lui le même jour (registre 2026-31). L'adresse garde « propositions » : c'est d'elles que viennent les décisions.
   Données : lib/organisation.ts ; structure : scripts/import-legacy.py (structure_01_10). */
const ROUTE = "/association/propositions-organisation";
const TITRE = "Huit décisions pour organiser l’association";
const RESUME = "Notre structure comparée à dix organisations, et ce que le bureau en a décidé le 1er octobre 2026 : six pôles, sept thématiques prioritaires, des vice-présidences élues, une seule grille.";

export const metadata: Metadata = {
  title: "Décisions d’organisation",
  description: RESUME,
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE), title: TITRE, description: RESUME },
};

export default function PropositionsOrganisation() {
  const idx = getIndex();
  const poles = idx.structure.poles;
  const themes = poles.flatMap((p) => p.items.map((t) => ({ ...t, pole: p.roman })));
  const total = themes.length;
  const pourvues = themes.filter((t) => t.filled).length;
  const benevoles = COMPARES.filter((c) => c.genre === "benevole");
  const maxBenevole = Math.max(...benevoles.map((c) => c.domaines));
  const minBenevole = Math.min(...benevoles.map((c) => c.domaines));
  const prio = PRIORITAIRES.map((p) => ({ ...p, t: themes.find((t) => t.id === p.id) })).filter((p) => p.t);
  const ordre = Object.keys(SOURCES);
  return (
    <main id="main-content" className="hub-page gl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: TITRE, description: RESUME, lang: "fr" }) }) }} />
      <PageHeader
        eyebrow="L’association · décisions d’organisation"
        title="Huit décisions"
        em="pour organiser l’association."
        lead={`Nous avons comparé notre structure d’alors — quatre pôles, ${enLettres(total)} thématiques, deux cellules — à dix organisations et cadres comparables. Il en est sorti huit propositions, soumises au bureau exécutif le 1er octobre 2026 et adoptées par lui le même jour. Elles sont appliquées sur la page Nos actions : ${enLettres(poles.length)} pôles, ${enLettres(prio.length)} thématiques prioritaires, des vice-présidences de pôle.`}
        crumbs={[{ label: "L’association", href: "/mission" }, { label: "Décisions d’organisation" }]}
        pills={["Adoptées par le bureau le 1er octobre 2026", `${RECOMMANDATIONS.length} décisions`, `${prio.length} thématiques prioritaires`]}
      />
      <Stats items={[
        { value: String(total), label: "thématiques chez ADEB LONODJI", note: `${pourvues} pourvues` },
        { value: `${minBenevole} à ${maxBenevole}`, label: "domaines chez les structures bénévoles comparées", note: `${benevoles.length} cas, sources en bas de page` },
        { value: String(poles.length), label: "pôles depuis le 1er octobre 2026", note: "le pôle II, qui portait onze thématiques, partagé en trois (décisions 2026-31 et 2026-35)" },
      ]} />

      <nav className="pc-sommaire" aria-label="Sur cette page">
        <a href="#constat"><b>1</b>Le constat</a>
        <a href="#propositions"><b>2</b>Les décisions <span>{RECOMMANDATIONS.length}</span></a>
        <a href="#prioritaires"><b>3</b>Thématiques prioritaires <span>{prio.length}</span></a>
        <a href="#mise-en-oeuvre"><b>4</b>Mise en œuvre</a>
        <a href="#sources"><b>+</b>Sources <span>{ordre.length}</span></a>
      </nav>

      <section className="hub-section" id="constat">
        <SectionHead eyebrow="Le constat" title="Beaucoup de sujets," em="une personne par sujet." text={`Les structures bénévoles comparées ont de ${minBenevole} à ${maxBenevole} grands domaines ; nous en avons ${total}. Le nombre de personnes, lui, est dans la norme : ce qui sortait du lot, c’est que chaque sujet reposait sur une seule personne, sans adjoint.`} />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Comparaison du nombre de domaines">
          <table className="ob-table">
            <thead><tr><th scope="col">Organisation ou cadre</th><th scope="col">Grands domaines</th></tr></thead>
            <tbody>
              <tr><th scope="row"><strong>ADEB LONODJI</strong></th><td><strong>{total} thématiques</strong> en {poles.length} pôles (quatre avant le 1er octobre 2026)</td></tr>
              {COMPARES.map((c) => (
                <tr key={c.nom}><th scope="row"><a href={`#source-${c.source}`}>{c.nom}</a></th><td>{c.domaines} {c.unite}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Les cadres mondiaux comme les clusters de l’IASC coordonnent des agences salariées, pas des bénévoles. Comparaison faite le 1er octobre 2026 ; aucun plan de développement local du Mandoul n’a été trouvé en ligne.</p>
      </section>

      <section className="hub-section" id="propositions">
        <SectionHead eyebrow="Les décisions" title="Huit décisions," em="adoptées par le bureau." text="Soumises comme propositions au bureau exécutif le 1er octobre 2026, adoptées le même jour. Chacune dit ce qu’elle change, sur quels exemples elle s’appuie et où le site l’applique." />
        <div className="gl-artic">
          {RECOMMANDATIONS.map((r, i) => (
            <article key={r.id} id={r.id}>
              <h3>{i + 1}. {r.titre}</h3>
              <p>{r.texte}</p>
              <p><strong>Ce que cela change :</strong> {r.change}</p>
              {r.applique ? <p><strong>Sur le site :</strong> {r.applique}</p> : null}
              <span className="pc-sources">Exemples :{" "}{r.sources.map((s, k) => <span key={s}>{k ? ", " : ""}<a href={`#source-${s}`}>{SOURCES[s].editeur}</a></span>)}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="prioritaires">
        <SectionHead eyebrow="Thématiques prioritaires" title="Les sujets de nos huit dossiers," em="d’abord." text="Décisions 1, 6 et 8 : les sept thématiques qui portent nos huit dossiers de plaidoyer sont les premières prioritaires, chacune avec un titulaire et un adjoint, et rattachée à un chantier de nos propositions à la commune. Les autres restent ouvertes, en veille." />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Thématiques prioritaires">
          <table className="ob-table">
            <thead><tr><th scope="col">Thématique</th><th scope="col">Titulaire</th><th scope="col">Adjoint</th><th scope="col">Dossier de plaidoyer</th><th scope="col">Chantier de la commune</th></tr></thead>
            <tbody>
              {prio.map((p) => (
                <tr key={p.id}>
                  <th scope="row"><Link href={`/programmes#${p.id}`}>{p.t!.number} {p.t!.name}</Link></th>
                  <td>{p.t!.filled ? p.t!.coordinator.split(",")[0] : <Link href={`/participer?theme=${p.t!.number}&coordo=1#contact`}>à pourvoir</Link>}</td>
                  <td className="nowrap"><Link href={`/participer?theme=${p.t!.number}&adjoint=1#contact`}>à trouver</Link></td>
                  <td>{p.plaidoyers.map((l, k) => <span key={l.href}>{k ? " · " : ""}<Link href={l.href}>{l.label}</Link></span>)}</td>
                  <td>{p.commune.map((l, k) => <span key={l.href}>{k ? " · " : ""}<Link href={l.href}>{l.label}</Link></span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">{`${enLettres(prio.filter((p) => !p.t!.filled).length, true)} de ces thématiques n’ont pas encore de titulaire : les pourvoir passe en premier ; aucune n’a encore d’adjoint.`} <Link href="/participer#contact">Proposer sa candidature</Link>.</p>
      </section>

      <section className="hub-section" id="mise-en-oeuvre">
        <SectionHead eyebrow="Mise en œuvre" title="Une élection," em="sept plans annuels." text="Le même 1er octobre 2026, le bureau exécutif a adopté de quoi appliquer les décisions 1 et 5 : la procédure d’élection des vice-présidences sans titulaire (registre 2026-33) et le modèle de plan annuel des thématiques prioritaires (registre 2026-34). L’après-midi, il a retenu des nombres pairs (registre 2026-35) : le pôle V est partagé à son tour — V, Économie & ressources naturelles ; VI, Infrastructures, territoire & risques — et une thématique 22, Sport, arts & loisirs, rejoint le pôle II." />
        <div className="link-list" id="plans-annuels">
          <Link href="/association/election-vice-presidences"><small>Décision 5 · élection</small><strong>Les vice-présidences des pôles III, IV et V</strong><span>{etatElection()}. Qui peut se présenter, qui vote, comment.</span></Link>
          <a href="/organisation/plans-annuels-priorites.pdf"><small>Décision 1 · plans annuels (PDF)</small><strong>Un plan par thématique prioritaire</strong><span>Prérempli avec ce que nous avons publié — plaidoyers, destinataires, engagements écrits, chantier de la commune — ; le titulaire et son adjoint fixent échéances, responsables, moyens et indicateurs, la vice-présidence du pôle le valide et le suit chaque trimestre.</span></a>
        </div>
        <p className="lg-footnote">{`Chaque plan sera publié, daté, une fois validé ; ceux des pôles sans vice-présidence sont validés par le bureau exécutif jusqu’à l’élection du ${dateFr(etape("vote").date)}.`}</p>
      </section>

      <section className="hub-section" id="sources">
        <SectionHead eyebrow="Sources" title="Les organisations" em="comparées." />
        <ol className="gl-regles">
          {ordre.map((id) => { const s = SOURCES[id]; return <li key={id} id={`source-${id}`}><a href={s.href} rel="noopener">{s.titre}</a> — {s.editeur}.</li>; })}
        </ol>
        <p className="lg-footnote">Sources lues le 1er octobre 2026. Décision du bureau exécutif du 1er octobre 2026, inscrite au <Link href="/transparence/decisions">registre des décisions</Link> ; la structure qui en résulte est sur la page <Link href="/programmes">Nos actions</Link>.</p>
      </section>

      <Partager route={ROUTE} titre={TITRE} texte={RESUME} />
    </main>
  );
}
