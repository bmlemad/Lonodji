import type { Metadata } from "next";
import Link from "@/components/lien";
import fs from "node:fs";
import path from "node:path";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import DepotForm from "../../components/depot-form";
import { ogFor, ORG } from "../../lib/content";
import { getIndicateurs } from "../../lib/indicateurs";

export const metadata: Metadata = {
  title: "Bibliothèque numérique bedjond",
  description: "Thèses, articles, ouvrages, rapports, archives et publications d’ADEB LONODJI sur le pays bedjond, les Sara et le nangnda ; les chercheurs ; dépôt de document.",
  alternates: { canonical: "/bibliotheque" },
  openGraph: ogFor("/bibliotheque"),
};

type Ref = { id: string; cat: string; type: string; rubrique: string; titre: string; auteurs: string; meta: string; resume: string; liens: string[]; route: string };
type Biblio = {
  genere: string; rubriques: { id: string; titre: string; references: string[] }[]; references: Ref[];
  chercheurs: { id: string; nom: string; role: string; references: string[] }[]; auteurs: { nom: string; references: string[] }[];
  documents: { titre: string; pdf: string; description: string; meta: string }[]; journal: { slug: string; label: string; articles: number }[]; totalArticles: number;
};

const CATS: Record<string, string> = { histoire: "Histoire", linguistique: "Linguistique", anthropologie: "Anthropologie", societe: "Société" };

export default function Bibliotheque() {
  const b = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "bibliotheque.json"), "utf8")) as Biblio;
  const parId = new Map(b.references.map((r) => [r.id, r]));
  const ind = getIndicateurs();
  const depots = ind.formulaires.comptes["depot-document"]?.envois ?? 0;
  const avecOeuvres = b.chercheurs.filter((c) => c.references.length);
  return (
    <main id="main-content" className="hub-page bb-page">
      <PageHeader
        eyebrow="Bibliothèque numérique bedjond"
        title="Tout ce qui s’est écrit"
        em="sur le pays bedjond."
        lead="Thèses, articles, ouvrages, rapports d’enquête, archives, publications de l’association : la bibliothèque rassemble ce que nous avons lu et vérifié sur le peuple bedjond, les Sara et le nangnda, et dit d’où vient chaque référence. Elle grandit par dépôt : un mémoire oublié dans un tiroir, un article introuvable en ligne, une archive familiale — c’est ici qu’ils deviennent consultables."
        crumbs={[{ label: "Histoire & patrimoine", href: "/histoire" }, { label: "Bibliothèque" }]}
        pills={[`${b.references.length} références`, `${b.documents.length} documents d’ADEB LONODJI`, `${b.totalArticles} articles du journal`, "dépôt ouvert"]}
      />

      <Stats items={[
        { value: String(b.references.length), label: "références vérifiées", note: "dans quatre domaines : histoire, linguistique, anthropologie, société" },
        { value: String(b.auteurs.length), label: "auteurs et autrices", note: `dont ${avecOeuvres.length} chercheurs du pays bedjond` },
        { value: String(b.documents.length), label: "documents publiés par l’association", note: "plaidoyers, cahiers de terrain, kits, dossier" },
        { value: String(depots), label: depots === 1 ? "dépôt reçu" : "dépôts reçus", note: `relevé du ${new Date(ind.formulaires.date + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` },
      ]} />

      <nav className="bb-sommaire" aria-label="Rubriques de la bibliothèque">
        {b.rubriques.map((r) => <a key={r.id} href={`#${r.id}`}>{r.titre} <b>{r.references.length}</b></a>)}
        <a href="#adeb">Publications d’ADEB LONODJI <b>{b.documents.length + b.totalArticles}</b></a>
        <a href="#chercheurs">Chercheurs <b>{b.chercheurs.length}</b></a>
        <a href="#deposer">Déposer un document</a>
      </nav>

      {b.rubriques.map((r) => (
        <section className="hub-section" id={r.id} key={r.id}>
          <SectionHead eyebrow={`${r.references.length} ${r.references.length > 1 ? "références" : "référence"}`} title={r.titre} />
          <ol className="bb-liste">
            {r.references.map((id) => parId.get(id)).filter(Boolean).map((x) => (
              <li key={x!.id}>
                <div className="bb-ref">
                  <small>{CATS[x!.cat] || x!.cat} · {x!.type}</small>
                  <h3><Link href={x!.route}>{x!.titre}</Link></h3>
                  <p className="bb-auteurs">{x!.meta}</p>
                  {x!.resume ? <p className="bb-resume">{x!.resume}</p> : null}
                  <div className="bb-liens">
                    <Link className="text-link" href={x!.route}>La fiche dans la base <span aria-hidden="true">→</span></Link>
                    {x!.liens.map((u) => <a className="text-link" key={u} href={u} target="_blank" rel="noopener noreferrer">{u.includes("wikipedia") ? "Wikipédia" : u.includes("sil.org") ? "SIL International" : "Consulter en ligne"} <span aria-hidden="true">↗</span></a>)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="hub-section" id="adeb">
        <SectionHead eyebrow="Publications d’ADEB LONODJI" title="Ce que l’association" em="a écrit et publié." text="Nos plaidoyers, nos cahiers de terrain, notre dossier de présentation, et les articles du journal : des textes sourcés, datés, corrigés à découvert quand il le faut." />
        <div className="link-list">
          {b.documents.map((d) => <a key={d.pdf} href={d.pdf} target="_blank" rel="noopener noreferrer"><small>PDF{d.meta ? ` · ${d.meta}` : ""}</small><strong>{d.titre}</strong>{d.description ? <span>{d.description}</span> : null}</a>)}
        </div>
        <div className="bb-journal">
          <h3>Le journal, par rubrique</h3>
          <ul>
            {b.journal.map((j) => <li key={j.slug}><Link href={`/journal?rubrique=${j.slug}`}>{j.label} <b>{j.articles}</b></Link></li>)}
          </ul>
          <Link className="text-link" href="/journal">Tous les articles <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="hub-section" id="chercheurs">
        <SectionHead eyebrow="Les chercheurs du pays bedjond" title="Celles et ceux" em="qui ont écrit le pays bedjond." text="Neuf noms que l’association tient à rassembler dans sa bibliothèque. Pour certains, la base référence déjà leurs travaux ; pour d’autres, nous attendons la première référence — si vous connaissez leurs écrits, déposez-les." />
        <div className="bb-chercheurs">
          {b.chercheurs.map((c) => (
            <article key={c.id} id={c.id}>
              <h3>{c.nom}</h3>
              <p className="bb-role">{c.role}</p>
              {c.references.length ? (
                <ul>{c.references.map((id) => parId.get(id)).filter(Boolean).map((x) => <li key={x!.id}><Link href={x!.route}>{x!.titre}</Link></li>)}</ul>
              ) : (
                <p className="bb-attendu">Aucune référence encore versée. <a href="#deposer">Déposer un de ses travaux →</a></p>
              )}
            </article>
          ))}
        </div>
        <details className="bb-auteurs-tous">
          <summary>Tous les auteurs et autrices de la base ({b.auteurs.length})</summary>
          <ul>
            {b.auteurs.map((a) => <li key={a.nom}><strong>{a.nom}</strong> — {a.references.map((id) => parId.get(id)).filter(Boolean).map((x, i) => <span key={x!.id}>{i ? " · " : ""}<Link href={x!.route}>{x!.titre}</Link></span>)}</li>)}
          </ul>
        </details>
      </section>

      <section className="hub-section" id="deposer">
        <SectionHead eyebrow="Déposer un document" title="Un mémoire, un article," em="une archive : versez-les." text="Tout ce qui est marqué d’un astérisque est nécessaire. La référence est vérifiée (titre, auteur, année), les droits aussi ; rien n’est mis en ligne sans l’accord de l’auteur ou de l’ayant droit. Une référence sans fichier est déjà précieuse : elle dit qu’un document existe et où le trouver." />
        <div className="legacy dp-formulaire">
          <DepotForm telephone={ORG.phone} whatsapp={ORG.whatsapp} />
        </div>
      </section>

      <p className="lg-footnote">La base de recherche est coordonnée par Sylvain Nomaye (thématique Recherche &amp; savoirs, programme Bedjond Digital Heritage) ; chaque référence y a sa fiche avec sa citation. Cette bibliothèque en est le classement par rubrique, régénéré par <code>scripts/build-bibliotheque.py</code> à chaque mise en ligne. Une référence fausse, une attribution douteuse ? <Link href="/transparence#corrections">Signalez-la</Link>. Voir aussi <Link href="/langue">la langue nangnda</Link> et <Link href="/temoignages">la collecte des témoignages</Link>.</p>
    </main>
  );
}
