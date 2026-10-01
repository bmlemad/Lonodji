import type { Metadata } from "next";
import { jsonLd, webPageSchema } from "@/lib/schema";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import PagesVoisines from "@/components/pages-voisines";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { enLettres, getIndex, getPage, metaDescription, ogFor } from "@/lib/content";
import { APPORTS, DEMARCHE, REGLES_DEMARCHE, EN_RETOUR, GROUPES, nombrePropositions, nombreSansDepense, PORTEURS, PROJET_INTEGRE, PROJETS_PRIORITAIRES, type Source } from "@/lib/propositions-commune";
import { programmeParId } from "@/lib/bailleurs";
import { alternatesLangues } from "@/lib/langues";

const ROUTE = "/territoire/propositions-commune";

export const metadata: Metadata = {
  title: "Nos propositions à la commune de Bédjondo",
  description: metaDescription("Dix projets prioritaires, un projet intégré et 29 mesures sourcées : toutes les propositions d’ADEB LONODJI à la mairie de Bédjondo, réunies sur une page."),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE), title: "Nos propositions à la commune de Bédjondo", description: "Toutes nos propositions à la mairie, réunies sur une page, chacune avec sa source." },
};

function Sources({ sources }: { sources: Source[] }) {
  return (
    <span className="pc-sources">
      {sources.map((s, i) => <span key={s.label}>{i ? " · " : ""}<Link href={s.href}>{s.label}</Link></span>)}
    </span>
  );
}

/* Les problématiques du diagnostic dont l'échelon de décision est la commune (lues dans le tableau publié). */
function problematiquesCommune() {
  const html = getPage("problematiques").sections.map((s) => s.html).join("");
  const lignes: { id: string; domaine: string; texte: string; etat: string }[] = [];
  let domaine = "";
  for (const m of html.matchAll(/<tr[^>]*id="(prob-\d+)"[^>]*>([\s\S]*?)<\/tr>/g)) {
    const cellules = [...m[2].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => c[1].replace(/<a[\s\S]*?<\/a>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim());
    if (cellules.length === 4) domaine = cellules.shift()!;
    if (cellules.length === 3 && cellules[2] === "Commune") lignes.push({ id: m[1], domaine, texte: cellules[0].replace(/\s*\(\s*\)/g, "").replace(/\s*\(\s*/g, " (").replace(/\s*\)/g, ")").trim(), etat: cellules[1] });
  }
  return lignes;
}

export default function PropositionsCommune() {
  const note = getIndex().plaidoyers.find((p) => p.id === "plaidoyer-commune");
  const total = nombrePropositions();
  const probs = problematiquesCommune();
  const textes = new Set(GROUPES.flatMap((g) => g.items.flatMap((i) => i.sources.map((x) => x.href)))).size;
  return (
    <main id="main-content" className="hub-page pc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: "Nos propositions à la commune de Bédjondo", description: "Dix projets prioritaires et un projet intégré de développement économique local ; planifier la ville, financer et rendre des comptes, ouvrir le conseil, les services de base, les partenariats et un premier chantier : toutes les propositions d’ADEB LONODJI à la mairie de Bédjondo, réunies et sourcées.", lang: "fr" }) }) }} />
      <PageHeader
        eyebrow="Territoire · propositions à la commune"
        title="Nos propositions"
        em="à la commune de Bédjondo."
        lead={`Tout ce que nous proposons à la mairie, sur une page. D’abord ${enLettres(PROJETS_PRIORITAIRES.length)} projets prioritaires, qui répondent aux besoins des habitants et rejoignent les priorités des partenaires du développement local — gouvernance locale, résilience, inclusion économique —, et le projet intégré que nous recommandons. Ensuite les mesures déjà publiées dans nos dossiers, réunies en six chantiers, chacune avec sa source. Plusieurs ne demandent qu’une décision.`}
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Propositions à la commune" }]}
        pills={[`${PROJETS_PRIORITAIRES.length} projets prioritaires`, `${total} mesures en ${GROUPES.length} chantiers`, `note publiée le ${note?.published ?? "16 septembre 2026"}`, `envoi : ${(note?.sent ?? "à envoyer").toLowerCase()}`]}
      />
      <Stats items={[
        { value: String(PROJETS_PRIORITAIRES.length), label: "projets prioritaires", note: `dont ${PROJETS_PRIORITAIRES.filter((p) => p.porteur).length} parmi les plus porteurs` },
        { value: `${PROJETS_PRIORITAIRES.filter((p) => p.apport.length).length}/${PROJETS_PRIORITAIRES.length}`, label: "projets avec un appui de LONODJI", note: "engagements déjà publiés dans nos dossiers" },
        { value: String(total), label: "mesures déjà publiées", note: `tirées de ${textes} textes déjà publiés` },
        { value: String(nombreSansDepense()), label: "ne demandent qu’une décision", note: "sans dépense, selon nos textes" },
        { value: String(probs.length), label: "problématiques relèvent de la commune", note: "sur les 34 du diagnostic" },
      ]} />

      <section className="hub-section" id="projets-prioritaires">
        <SectionHead eyebrow={`Proposition de l’association · 30 septembre 2026`} title={`${enLettres(PROJETS_PRIORITAIRES.length, true)} projets prioritaires`} em="pour la commune." text="Des projets qui répondent aux besoins réels des habitants et qui rejoignent les axes que les partenaires du développement local soutiennent : gouvernance locale, résilience communautaire, inclusion économique. Ce sont des propositions à débattre avec la commune : aucun n’a encore d’étude, de budget ni de financement. Pour chacun : ce que nos dossiers en disaient déjà, ce que LONODJI pourrait apporter — uniquement des engagements déjà publiés, dans le cadre d’une convention avec la commune —, et les programmes de notre relevé des bailleurs dont le champ le recoupe : des portes à frapper, pas des financements acquis." />
        <ol className="pp-grille">
          {PROJETS_PRIORITAIRES.map((p, i) => {
            const progs = p.programmes.map(programmeParId).filter((x) => x !== undefined);
            return (
              <li className={p.porteur ? "pp-carte est-porteur" : "pp-carte"} id={`projet-${p.id}`} key={p.id}>
                <p className="pp-tete"><span className="pp-num">{i + 1}</span>{p.porteur ? <span className="pp-badge">parmi les plus porteurs</span> : null}</p>
                <h3>{p.titre}</h3>
                <ul className="pp-volets">{p.volets.map((v) => <li key={v}>{v}</li>)}</ul>
                {p.deja.length ? <p className="pp-ligne"><b>Déjà dans nos dossiers</b><Sources sources={p.deja} /></p> : <p className="pp-ligne"><b>Déjà dans nos dossiers</b><span className="pc-sources">rien encore : proposition nouvelle</span></p>}
                <div className={p.apport.length ? "pp-apport" : "pp-apport est-vide"}>
                  <p className="pp-apport-titre">Ce que LONODJI pourrait apporter</p>
                  {p.apport.length ? (
                    <ul>{p.apport.map((a) => <li key={a.texte}>{a.texte.charAt(0).toUpperCase() + a.texte.slice(1)}. <Sources sources={a.sources} /></li>)}</ul>
                  ) : <p className="pp-apport-vide">Aucun engagement publié à ce jour : il reste à le définir avec la thématique concernée.</p>}
                </div>
                {progs.length ? <p className="pp-ligne"><b>Programmes à rapprocher</b><span className="pp-progs">{progs.map((g) => <Link key={g.id} href={`/bailleurs#${g.id}`}>{g.nom.split(" — ")[0]}</Link>)}</span></p> : null}
              </li>
            );
          })}
        </ol>
        <div className="pp-deux">
          <div className="pp-porteurs">
            <p className="eyebrow">Les plus porteurs pour un financement</p>
            <ol>{PORTEURS.map((x) => <li key={x.titre}>{x.titre}</li>)}</ol>
          </div>
          <div className="pp-integre">
            <p className="eyebrow">Notre recommandation</p>
            <h3>{PROJET_INTEGRE.titre}</h3>
            <p>Réunir {PROJET_INTEGRE.composantes.slice(0, -1).join(", ")} et {PROJET_INTEGRE.composantes[PROJET_INTEGRE.composantes.length - 1]} dans un seul projet, porté par la commune.</p>
            <p className="pp-pourquoi">{PROJET_INTEGRE.pourquoi}</p>
            <p className="pp-pourquoi">Aucun programme de notre relevé ne finance encore de tels projets à Bédjondo : le projet doit d’abord être inscrit au plan de développement communal, puis présenté par la commune. <Link href="/bailleurs">Le relevé des programmes des bailleurs</Link>.</p>
          </div>
        </div>
      </section>

      <section className="hub-section pc-intro-chantiers" id="mesures">
        <SectionHead eyebrow="Les mesures déjà publiées" title="Six chantiers," em={`${total} mesures, chacune sourcée.`} text="Nos propositions à la mairie étaient dispersées : une note au conseil communal, un article, une section « À la commune » dans chacun des sept plaidoyers, des pages de fond. Les voici réunies, sans rien y ajouter ; chacune renvoie au texte où elle a été publiée." />
      </section>

      <nav className="pc-sommaire" aria-label="Les six chantiers">
        {GROUPES.map((g, i) => <a key={g.id} href={`#${g.id}`}><b>{i + 1}</b>{g.titre.replace(/[,:]$/, "")} <span>{g.items.length}</span></a>)}
        <a href="#demarche"><b>+</b>Notre démarche</a>
        <a href="#apports"><b>+</b>Ce que nous apportons</a>
      </nav>

      {GROUPES.map((g, i) => (
        <section className="hub-section" id={g.id} key={g.id}>
          <SectionHead eyebrow={`Chantier ${i + 1} · ${g.items.length} mesure${g.items.length > 1 ? "s" : ""}`} title={g.titre} em={g.em} text={g.intro} />
          <ol className="pc-liste">
            {g.items.map((p) => (
              <li key={p.texte}>
                <p>{g.id === "services" && p.texte.includes(" — ") ? <><strong>{p.texte.split(" — ")[0]}</strong> — {p.texte.split(" — ").slice(1).join(" — ")}</> : p.texte}{p.sansDepense ? <span className="pc-badge">une décision, sans dépense</span> : null}</p>
                <Sources sources={p.sources} />
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="hub-section" id="demarche">
        <SectionHead eyebrow="Notre démarche" title="Travailler avec la commune" em="et les autorités locales." text="Cinq étapes, dans cet ordre. Chaque étape franchie sera datée ici et au journal des décisions." />
        <ol className="pc-etapes">
          {DEMARCHE.map((d) => (
            <li key={d.etape}>
              <p className="pc-etape-tete"><strong>{d.etape}</strong><span className={d.etat === "en cours" ? "pc-etat est-en-cours" : "pc-etat"}>{d.etat}</span></p>
              <p>{d.texte}</p>
            </li>
          ))}
        </ol>
        <p className="pc-regles"><strong>Quatre règles tout du long :</strong> {REGLES_DEMARCHE.join(" ")}</p>
      </section>

      <section className="hub-section" id="apports">
        <SectionHead eyebrow="Notre part" title="Ce que l’association apporte," em="et ce qu’elle demande en retour." text="L’association ne se substitue pas à la commune ; elle la sert. Ces engagements prennent place dans une convention écrite, et leur avancement est publié." />
        <div className="pc-deux">
          <ol className="pc-liste">
            {APPORTS.map((p) => <li key={p.texte}><p>{p.texte}</p><Sources sources={p.sources} /></li>)}
          </ol>
          <aside className="pc-retour">
            <p className="eyebrow">En retour, nous demandons</p>
            <ul>{EN_RETOUR.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="pc-retour-note">Source : <Link href="/journal/2026-09-16-note-commune-bedjondo">note à la commune, § 6</Link>.</p>
          </aside>
        </div>
      </section>

      {probs.length ? (
        <section className="hub-section" id="diagnostic">
          <SectionHead eyebrow="Du diagnostic" title="Ce qui relève de la commune," em="d’après notre diagnostic." text="Parmi les trente-quatre problématiques recensées, celles dont l’échelon de décision est la commune, avec l’état de ce que nous en savons." />
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Problématiques relevant de la commune">
            <table className="sec-table">
              <thead><tr><th scope="col">Domaine</th><th scope="col">Problématique</th><th scope="col">Ce que nous en savons</th></tr></thead>
              <tbody>
                {probs.map((p) => <tr key={p.id}><td>{p.domaine}</td><td><Link href={`/territoire/diagnostic#${p.id}`}>{p.texte}</Link></td><td>{p.etat}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="hub-section" id="lire">
        <SectionHead eyebrow="Les textes complets" title="La note, l’article," em="et le cadre légal." />
        <div className="link-list">
          <Link href="/journal/2026-09-16-note-commune-bedjondo"><small>Note · {note?.published}</small><strong>Note à la commune de Bédjondo : six propositions</strong><span>Adressée au maire et au conseil communal, copie au préfet et aux autorités traditionnelles. {note?.sent ? `Envoi : ${note.sent.toLowerCase()}.` : ""}</span></Link>
          <a href="/notes/propositions-commune-bedjondo.pdf" target="_blank" rel="noopener noreferrer"><small>PDF · 3 pages</small><strong>Ce dossier à imprimer</strong><span>Les dix projets, la démarche, les mesures et nos apports, à remettre au maire, au préfet et aux chefs de canton.</span></a>
          {note?.pdf ? <a href={note.pdf} target="_blank" rel="noopener noreferrer"><small>PDF</small><strong>La note à imprimer</strong><span>La version à déposer à la mairie ou à remettre aux conseillers.</span></a> : null}
          <Link href="/journal/2026-09-16-bedjondo-village-devenu-ville"><small>Article</small><strong>Bédjondo, un village devenu ville : nos propositions</strong><span>Les douze propositions d’aménagement et leurs sources.</span></Link>
          <Link href="/territoire/gouvernance-locale"><small>Gouvernance</small><strong>Gouvernance locale</strong><span>Qui décide quoi, du quartier à l’État, et comment commune et chefferies s’articulent.</span></Link>
          <Link href="/territoire/decentralisation"><small>Dossier</small><strong>Décentralisation & développement local</strong><span>Ce que la loi confie à la commune, avec quels moyens, et les quatre règles de gouvernance que nous demandons.</span></Link>
        </div>
        <p className="lg-footnote">Une proposition oubliée, une erreur ? Toute proposition est d’abord publiée dans son dossier, puis reprise ici avec son lien. Vous êtes conseiller communal ? <Link href="/participer?objet=partenariat#contact">Écrivez-nous</Link> : nos travaux sont à votre disposition.</p>
      </section>

      <PagesVoisines route={ROUTE} />
      <Partager route={ROUTE} titre="Nos propositions à la commune de Bédjondo" texte="Toutes les propositions d’ADEB LONODJI à la mairie de Bédjondo, réunies et sourcées." />
    </main>
  );
}
