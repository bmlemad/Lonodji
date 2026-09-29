import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { getIndex, metaDescription, ogFor } from "@/lib/content";
import { getProjets } from "@/lib/projets";
import { thematiquesParId } from "@/lib/odeb-chiffres";
import {
  ALIGNEMENT_PROJETS, FAMILLES, FENETRES, GUICHETS, PLAIDOYERS_NOMS, PORTEES, programmeParId, PROGRAMMES_BAILLEURS, programmesUtilesDe, RELEVE, STATUTS,
  type Famille, type ProgrammeBailleur,
} from "@/lib/bailleurs";

export const metadata: Metadata = {
  title: "Programmes des bailleurs au Tchad",
  description: metaDescription("Banque mondiale, Union européenne, Nations unies, BAD, coopération suisse, AFD : les programmes en cours au Tchad, ceux qui touchent le Mandoul, et pour chacun comment ADEB LONODJI peut s’y raccrocher, thématique par thématique et plaidoyer par plaidoyer."),
  alternates: { canonical: "/bailleurs" },
  openGraph: { ...ogFor("/bailleurs"), title: "Programmes des bailleurs au Tchad, et où nous nous raccrochons", description: "Les programmes en cours, ceux qui touchent le Mandoul, et nos points d’entrée." },
};

const ORDRE_PORTEE = ["bedjondo", "koumra", "mandoul", "sud", "national", "hors-zone"];

function Carte({ p, th }: { p: ProgrammeBailleur; th: ReturnType<typeof thematiquesParId> }) {
  return (
    <article className={`bl-carte bl-carte--${p.portee}`} id={p.id}>
      <p className="bl-tete">
        <span className={`bl-portee bl-portee--${p.portee}`}>{PORTEES[p.portee]}</span>
        <span className={`bl-statut bl-statut--${p.statut}`}>{STATUTS[p.statut]}</span>
      </p>
      <h3>{p.nom}</h3>
      <p className="bl-qui">{p.bailleur}{p.ref ? <> · <span className="bl-ref">{p.ref}</span></> : null}</p>
      <dl className="bl-faits">
        <div><dt>Montant</dt><dd>{p.montant}</dd></div>
        <div><dt>Période</dt><dd>{p.periode}</dd></div>
        <div><dt>Zones</dt><dd>{p.zones}</dd></div>
      </dl>
      <p className="bl-accroche"><strong>Comment nous y raccrocher.</strong> {p.accroche}</p>
      {p.thematiques.length || p.plaidoyers?.length ? (
        <p className="bl-liens">
          {p.thematiques.map((t) => th[t] ? <Link key={t} href={`/programmes#${t}`}>{th[t].name}</Link> : null)}
          {(p.plaidoyers ?? []).map((pl) => <Link key={pl} className="bl-lien-plaidoyer" href={PLAIDOYERS_NOMS[pl].href}>Plaidoyer : {PLAIDOYERS_NOMS[pl].titre}</Link>)}
        </p>
      ) : null}
      <p className="bl-source">Source : <a href={p.source} target="_blank" rel="noopener noreferrer">{p.sourceLabel} <span aria-hidden="true">↗</span></a></p>
    </article>
  );
}

export default function Bailleurs() {
  const th = thematiquesParId();
  const actifs = PROGRAMMES_BAILLEURS.filter((p) => p.statut !== "clos");
  const mandoul = PROGRAMMES_BAILLEURS.filter((p) => ["bedjondo", "koumra", "mandoul"].includes(p.portee) && p.statut !== "clos");
  const aConnaitre = PROGRAMMES_BAILLEURS.filter((p) => p.statut === "clos" || p.portee === "hors-zone");
  const principaux = PROGRAMMES_BAILLEURS.filter((p) => !aConnaitre.includes(p));
  const familles = (Object.keys(FAMILLES) as Famille[]).map((f) => ({
    f, items: principaux.filter((p) => p.famille === f).sort((a, b) => ORDRE_PORTEE.indexOf(a.portee) - ORDRE_PORTEE.indexOf(b.portee)),
  })).filter((g) => g.items.length);
  const { poles, cellules } = getIndex().structure;
  const groupesActions = [...poles.map((pl) => ({ id: pl.id, titre: `Pôle ${pl.roman} · ${pl.name}`, items: pl.items })), ...(cellules ? [{ id: "cellules", titre: cellules.name, items: cellules.items.filter((c) => c.id !== "cellule-financement-ressources") }] : [])];
  const toutesActions = groupesActions.flatMap((g) => g.items);
  const sansProgramme = toutesActions.filter((t) => !programmesUtilesDe(t.id).length);
  const projets = getProjets().projets.filter((pj) => ALIGNEMENT_PROJETS[pj.slug]);
  const plaidoyers = Object.entries(PLAIDOYERS_NOMS).map(([id, v]) => ({ id, ...v, items: PROGRAMMES_BAILLEURS.filter((p) => p.plaidoyers?.includes(id)) }));

  return (
    <main id="main-content" className="hub-page bl-page">
      <PageHeader
        eyebrow="Nos actions · programmes des bailleurs"
        title="Les programmes des bailleurs au Tchad,"
        em="et où nous nous raccrochons."
        lead={`Banque mondiale, Union européenne et coopérations européennes, Nations unies, Banque africaine de développement, fonds mondiaux : nous avons relevé les programmes en cours ou en préparation au Tchad, en cherchant d’abord ceux qui touchent le Mandoul. Pour chacun, ce qu’il finance, où, jusqu’à quand, et comment l’association peut s’y raccrocher — une demande écrite, une liste de localités à rejoindre, une consultation à suivre. Aucun de ces programmes n’est un financement de l’association : ce sont des portes à pousser. Relevé du ${RELEVE}, sources ouvertes une à une.`}
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Programmes des bailleurs" }]}
        pills={[`${PROGRAMMES_BAILLEURS.length} programmes relevés`, `${mandoul.length} touchent le Mandoul`, "1 déjà actif à Bédjondo", `relevé du ${RELEVE}`]}
      />
      <p className="section-actions" style={{ justifyContent: "flex-start", marginTop: 0 }}>
        <a className="button secondary" href="/notes/note-synthese-bedjondo.pdf" download>Note de synthèse à joindre aux courriers (PDF, 2 pages) <span aria-hidden="true">↓</span></a>
      </p>
      <Stats items={[
        { value: String(actifs.length), label: "programmes en cours ou en préparation", note: "relevés un à un dans les portails officiels des bailleurs" },
        { value: String(mandoul.length), label: "citent le Mandoul ou Koumra", note: "dans leurs documents officiels ou leurs activités" },
        { value: "1", label: "déjà présent à Bédjondo", note: "forums sur la santé des femmes du 27 septembre 2026 (CARE, BASE, AFD)" },
        { value: String(FENETRES.length), label: "fenêtres qui se décident maintenant", note: "listes de localités, consultations, conception de projets" },
      ]} />

      <section className="hub-section" id="en-bref">
        <SectionHead eyebrow="En bref" title="Ce que ce relevé change" em="pour nos plaidoyers." />
        <ul className="bl-bref">
          <li><strong>Bédjondo n’est cité dans aucun document de programme.</strong> Le Mandoul l’est souvent (santé, eau, femmes, agriculture), Koumra parfois. Notre travail : faire inscrire Bédjondo et ses cantons sur les listes de localités qui s’établissent en ce moment.</li>
          <li><strong>Deux destinataires de nos plaidoyers ont changé.</strong> Le PMCR (pistes rurales, Banque mondiale) est clos depuis le 30 avril 2026 ; le PASER (eau, Banque mondiale) ne couvre pas le Mandoul. Pour l’eau, les bonnes portes sont la BAD (PAEPA II), l’UNICEF et la coopération suisse.</li>
          <li><strong>Le sud est rangé du côté du développement, pas de l’humanitaire</strong> — sauf pour l’eau : le plan humanitaire 2026 classe le Mandoul Occidental parmi les départements prioritaires pour l’eau, l’hygiène et l’assainissement.</li>
          <li><strong>Les bailleurs ne financent pas les associations directement</strong> : ils passent par les ministères et leurs unités de projet. Les guichets ouverts à une organisation comme la nôtre sont rares ; ils sont listés plus bas.</li>
        </ul>
      </section>

      <section className="hub-section" id="maintenant">
        <SectionHead eyebrow="Calendrier" title="Ce qui se décide" em="maintenant." text="Des listes et des programmes se ferment dans les mois qui viennent. Chaque ligne renvoie au programme ou au guichet concerné." />
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Fenêtres à saisir">
          <table className="sec-table bl-table">
            <thead><tr><th scope="col">Quand</th><th scope="col">Quoi</th><th scope="col">Auprès de qui</th></tr></thead>
            <tbody>
              {FENETRES.map((f) => (
                <tr key={f.quoi}><td>{f.quand}</td><td><a href={`#${f.lien}`}>{f.quoi}</a></td><td>{f.ou}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hub-section" id="par-plaidoyer">
        <SectionHead eyebrow="Nos plaidoyers" title="Pour chaque plaidoyer," em="les programmes à saisir." text="Les destinataires publiés dans nos plaidoyers en septembre restent valables ; voici les programmes qui financent aujourd’hui ce que chacun demande." />
        <div className="bl-plaidoyers">
          {plaidoyers.map((pl) => (
            <article key={pl.id} className="bl-plaidoyer">
              <h3><Link href={pl.href}>{pl.titre}</Link></h3>
              {pl.items.length ? (
                <ul>
                  {pl.items.map((p) => (
                    <li key={p.id}><a href={`#${p.id}`}>{p.nom.split(" — ")[0]}</a> <span className="bl-mini">{p.bailleur.split(" — ")[0]} · {PORTEES[p.portee]}{p.statut !== "actif" ? ` · ${STATUTS[p.statut].toLowerCase()}` : ""}</span></li>
                  ))}
                </ul>
              ) : <p className="bl-mini">Aucun programme relevé.</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="par-action">
        <SectionHead eyebrow="Nos actions" title="Pour chaque thématique," em="les programmes qui la financent." text={`Nos ${toutesActions.length} thématiques et cellules, pôle par pôle, avec les programmes en cours ou en préparation qui financent le même domaine — du plus proche de Bédjondo au plus lointain. ${sansProgramme.length ? `${sansProgramme.length} n’en ont aucun : ${sansProgramme.map((t) => t.name).join(", ")}. Ce sont des angles morts des bailleurs, que l’association devra financer autrement.` : ""}`} />
        <div className="bl-actions">
          {groupesActions.map((g) => (
            <div className="bl-actions-pole" key={g.id}>
              <h3>{g.titre}</h3>
              <ul>
                {g.items.map((t) => {
                  const ps = programmesUtilesDe(t.id);
                  return (
                    <li key={t.id} id={`action-${t.id}`}>
                      <Link className="bl-action-nom" href={`/programmes#${t.id}`}>{t.name}</Link>
                      <span className="bl-action-progs">
                        {ps.length ? ps.map((b) => <a key={b.id} href={`#${b.id}`} className={["bedjondo", "koumra", "mandoul"].includes(b.portee) ? "est-proche" : undefined} title={`${b.bailleur} · ${PORTEES[b.portee]}`}>{b.nom.split(" — ")[0]}</a>) : <em>aucun programme relevé</em>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="bl-legende"><span className="est-proche">Surligné</span> : le programme cite le Mandoul, Koumra ou Bédjondo.</p>
      </section>

      <section className="hub-section" id="par-projet">
        <SectionHead eyebrow="Nos projets" title="Pour chaque projet," em="ce qui correspond, et ce qui ne correspond pas." text="Un programme n’est cité que s’il finance ce que le projet contient. Plusieurs de nos projets n’ont aucun bailleur public possible : nous l’écrivons plutôt que de forcer un rapprochement." />
        <div className="bl-grille">
          {projets.map((pj) => {
            const al = ALIGNEMENT_PROJETS[pj.slug];
            const progs = al.programmes.map(programmeParId).filter((x) => x !== undefined);
            return (
              <article className="bl-carte" key={pj.slug} id={`projet-${pj.slug}`}>
                <h3><Link href={`/projets#${pj.slug}`}>{pj.nom}</Link></h3>
                <p className="bl-qui">{pj.libelle}</p>
                <p className="bl-accroche">{al.lecture}</p>
                {progs.length || al.guichets.length ? (
                  <p className="bl-liens">
                    {progs.map((b) => <a key={b.id} href={`#${b.id}`}>{b.nom.split(" — ")[0]}</a>)}
                    {al.guichets.map((i) => <a key={i} className="bl-lien-plaidoyer" href="#guichets">Guichet : {GUICHETS[i].nom}</a>)}
                  </p>
                ) : <p className="bl-mini">Aucun programme ni guichet correspondant.</p>}
              </article>
            );
          })}
        </div>
      </section>

      {familles.map((g) => (
        <section className="hub-section" id={`famille-${g.f}`} key={g.f}>
          <SectionHead eyebrow="Programmes" title={FAMILLES[g.f]} text={`${g.items.length} programme${g.items.length > 1 ? "s" : ""}, du plus proche de Bédjondo au plus lointain.`} />
          <div className="bl-grille">
            {g.items.map((p) => <Carte key={p.id} p={p} th={th} />)}
          </div>
        </section>
      ))}

      <section className="hub-section" id="guichets">
        <SectionHead eyebrow="Guichets" title="Où l’association peut déposer" em="elle-même." text="Tous demandent une association en règle — statuts, récépissé, compte à son nom — ou une association sœur de la diaspora déclarée à l’étranger. D’où l’importance des démarches en cours." />
        <div className="bl-grille">
          {GUICHETS.map((g) => (
            <article className="bl-carte" key={g.nom}>
              <h3>{g.nom}</h3>
              <dl className="bl-faits">
                <div><dt>Pour qui</dt><dd>{g.qui}</dd></div>
                <div><dt>Montant</dt><dd>{g.montant}</dd></div>
                <div><dt>Échéance</dt><dd>{g.echeance}</dd></div>
              </dl>
              <p className="bl-accroche">{g.note}</p>
              <p className="bl-source">Source : <a href={g.source} target="_blank" rel="noopener noreferrer">page officielle <span aria-hidden="true">↗</span></a></p>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="a-connaitre">
        <SectionHead eyebrow="À connaître" title="Clos, ou hors" em="de notre zone." text="Pour ne pas écrire à la mauvaise porte." />
        <div className="bl-grille">
          {aConnaitre.map((p) => <Carte key={p.id} p={p} th={th} />)}
        </div>
      </section>

      <section className="hub-section">
        <p className="lg-footnote">
          Relevé établi le {RELEVE} à partir des portails officiels (Banque mondiale, BAD, registre IATI de l’Union européenne, coopération suisse, AFD, PNUD, UNICEF, UNFPA, FIDA, OCHA, Fonds mondial) et, à défaut, de la presse tchadienne, citée comme telle. Quand un montant, une date ou une zone n’a pas été trouvé, nous l’écrivons. Les programmes changent vite : ce relevé sera refait tous les six mois. Une erreur, un programme oublié ? <Link href="/participer?objet=partenariat#contact">Écrivez-nous</Link>. Voir aussi <Link href="/secteurs">nos secteurs d’intervention</Link> et <Link href="/dossiers/ong-partenaires">les ONG et partenaires présents</Link>.
        </p>
        <Partager route="/bailleurs" titre="Programmes des bailleurs au Tchad, et où ADEB LONODJI se raccroche" texte="Banque mondiale, UE, Nations unies, BAD : les programmes qui touchent le Mandoul, et nos points d’entrée." />
      </section>
    </main>
  );
}
