import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { notFound } from "next/navigation";
import { SectionHead } from "@/components/blocks";
import { OdebHero } from "@/components/odeb-marque";
import OdebNav, { OdebEtat } from "@/components/odeb-nav";
import { metaDescription, ogFor } from "@/lib/content";
import { enLettresMaj, MISSIONS, ODEB, programme, PROGRAMMES, routeProgramme } from "@/lib/odeb";
import { thematiquesParId } from "@/lib/odeb-chiffres";
import { PORTEES, programmesUtilesDes, STATUTS } from "@/lib/bailleurs";

export const dynamicParams = true; // adresse inconnue : notFound() dans la page (404 hydratée sans écart)

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ programme: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ programme: string }> }): Promise<Metadata> {
  const p = programme((await params).programme);
  if (!p) return {};
  const route = routeProgramme(p);
  return {
    title: `Programme ${p.nom} — ODEB`,
    description: metaDescription(`Programme ${p.numero} du projet ${ODEB.sigle}. ${p.accroche}`),
    alternates: { canonical: route },
    openGraph: ogFor(route),
  };
}

export default async function ProgrammePage({ params }: { params: Promise<{ programme: string }> }) {
  const p = programme((await params).programme);
  if (!p) notFound();
  const th = thematiquesParId();
  const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
  const themes = ths.filter((t) => t.kind !== "cellule");
  const cellules = ths.filter((t) => t.kind === "cellule");
  const partenaires = programmesUtilesDes(p.thematiques);
  const i = PROGRAMMES.indexOf(p);
  const prec = PROGRAMMES[(i + PROGRAMMES.length - 1) % PROGRAMMES.length];
  const suiv = PROGRAMMES[(i + 1) % PROGRAMMES.length];
  return (
    <main id="main-content" className="hub-page od-page">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · programme ${p.numero}`}
        title={p.nom}
        sousTitre={p.axes.map((a) => a.titre).join(" · ")}
        lead={p.objet}
        crumbs={[{ label: "Vision 2030 — projet ODEB", href: "/odeb" }, { label: "Programmes", href: "/odeb/programmes" }, { label: p.nom }]}
        pills={[`Missions : ${p.missions.map((id) => MISSIONS.find((m) => m.id === id)?.nom).filter(Boolean).join(", ")}`, `${themes.length} ${themes.length > 1 ? "thématiques" : "thématique"}${cellules.length ? ` et ${cellules.length > 1 ? `${cellules.length} cellules` : "une cellule"}` : ""}, ${ths.filter((t) => t.filled).length} ${ths.filter((t) => t.filled).length > 1 ? "pourvues" : "pourvue"}`]}
      />
      <OdebNav actif="programmes" />

      <section className="hub-section" id="axes">
        <SectionHead eyebrow={`${enLettresMaj(p.axes.length)} axes`} title="Ce qui existe," em="ce que le programme construira." text="Pour chaque axe : ce que le site fait déjà (des liens vers les pages, pas des intentions), puis ce que le programme construirait d’ici 2030 — au conditionnel, parce que rien n’est décidé ni financé." />
        <ol className="od-axes-detail">
          {p.axes.map((a, k) => (
            <li key={a.titre} id={`axe-${k + 1}`}>
              <div className="od-axe-tete"><span className="od-num">{p.numero}.{k + 1}</span><h3>{a.titre}</h3></div>
              <p className="od-axe-texte">{a.texte}</p>
              <div className="od-axe-cols">
                <div>
                  <p className="od-axe-label">Déjà en place</p>
                  <ul>{a.existant.map((l) => <li key={l.href + l.label}><Link href={l.href}>{l.label} <span aria-hidden="true">→</span></Link></li>)}</ul>
                </div>
                <div>
                  <p className="od-axe-label">D’ici 2030</p>
                  <p>{a.suite}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {p.principes ? (
        <section className="hub-section" id="principes">
          <SectionHead eyebrow="Les règles du jeu" title="Des entreprises," em="pas une caisse noire." text="Cinq règles proposées avec le programme, à voter par l’assemblée avant toute création. Elles disent comment des activités lucratives peuvent servir une association sans la dénaturer." />
          <ol className="od-principes">
            {p.principes.map((r, k) => <li key={r.titre}><span className="od-num">0{k + 1}</span><div><h3>{r.titre}</h3><p>{r.texte}</p></div></li>)}
          </ol>
        </section>
      ) : null}

      {p.portefeuille ? (
        <section className="hub-section" id="portefeuille">
          <SectionHead eyebrow="D’autres activités proposées" title={`${enLettresMaj(p.portefeuille.length)} activités de plus,`} em="à étudier, aucune décidée." text="En plus des quatre entreprises phares, des activités qui manquent au pays bedjond et qui pourraient rapporter. Pour chacune : ce que c’est, pourquoi ici, d’où viendraient les revenus, ce qu’ils financeraient, ce qu’il faut avant, et le risque principal. Rien n’est chiffré : ce sont des pistes, pas des promesses." />
          <ul className="od-activites">
            {p.portefeuille.map((a, k) => {
              const ths = a.thematiques.map((id) => th[id]).filter(Boolean);
              return (
                <li key={a.nom} id={`activite-${k + 1}`}>
                  <span className="od-num">{p.numero}.{k + p.axes.length + 1}</span>
                  <h3>{a.nom}</h3>
                  <p className="od-activite-quoi">{a.quoi}</p>
                  <dl>
                    <div><dt>Pourquoi ici</dt><dd>{a.pourquoi}</dd></div>
                    <div><dt>Revenus</dt><dd>{a.revenus}</dd></div>
                    <div><dt>Ce que ça finance</dt><dd>{a.finance}</dd></div>
                    <div><dt>Avant de commencer</dt><dd>{a.prealables}</dd></div>
                    <div><dt>Risque principal</dt><dd>{a.risque}</dd></div>
                  </dl>
                  <p className="od-activite-them">{ths.map((t) => <Link href={`/programmes#${t.id}`} key={t.id}>{t.name}</Link>)}{a.projet ? <Link href={a.projet}>Le projet lié <span aria-hidden="true">→</span></Link> : null}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {p.etapes ? (
        <section className="hub-section" id="etapes">
          <SectionHead eyebrow="Dans quel ordre" title="Une entreprise à la fois," em="et des comptes chaque année." />
          <ol className="od-etapes">
            {p.etapes.map((e) => <li key={e.periode}><small>{e.periode}</small><strong>{e.titre}</strong><p>{e.texte}</p></li>)}
          </ol>
        </section>
      ) : null}

      <section className="hub-section" id="porte">
        <SectionHead eyebrow="Qui porte le programme" title="Des thématiques nommées," em="des coordonnateurs nommés." text="Le programme ne crée pas d’équipe nouvelle : il s’appuie sur les thématiques de l’association et sur celles et ceux qui les coordonnent. Une thématique à pourvoir est une place à prendre." />
        <ul className="od-thematiques">
          {ths.map((t) => (
            <li key={t.id} className={t.filled ? "est-pourvue" : "est-vacante"}>
              <span className="od-them-num">{t.kind === "cellule" ? "Cellule" : t.number}</span>
              <div>
                <strong><Link href={`/programmes#${t.id}`}>{t.name}</Link></strong>
                <span>{t.poleRoman ? `Pôle ${t.poleRoman} · ${t.pole}` : t.pole}</span>
                <span>{t.filled ? `${t.coordinatorLabel || "Coordination"} : ${t.coordinator}` : "Coordination à pourvoir"}</span>
              </div>
              {t.filled ? <span className="status filled">Pourvue</span> : <Link className="status" href={`/participer?theme=${t.kind === "cellule" ? t.id.replace("cellule-", "").split("-")[0] : t.number}&coordo=1#contact`}>Proposer sa candidature</Link>}
            </li>
          ))}
        </ul>
      </section>

      <section className="hub-section" id="partenaires">
        <SectionHead eyebrow="Programmes des bailleurs" title="Qui finance déjà" em="ce que ce programme vise." text={partenaires.length ? `${partenaires.length} programme${partenaires.length > 1 ? "s" : ""} en cours ou en préparation au Tchad touche${partenaires.length > 1 ? "nt" : ""} les thématiques de ce programme${partenaires.length > 1 ? ", du plus proche de Bédjondo au plus lointain" : ""}. Aucun ne finance l’association : ce sont des portes à pousser, avec une demande écrite ou une liste de localités à rejoindre.` : "Aucun programme de bailleur relevé ne finance aujourd’hui les thématiques de ce programme : il repose sur les membres, la diaspora et, plus tard, les guichets ouverts aux associations."} />
        {partenaires.length ? (
          <ul className="od-partenaires">
            {partenaires.map((b) => (
              <li key={b.id}>
                <span className={`bl-portee bl-portee--${b.portee}`}>{PORTEES[b.portee]}</span>
                <Link href={`/bailleurs#${b.id}`}><strong>{b.nom.split(" — ")[0]}</strong></Link>
                <small>{b.bailleur.split(" — ")[0]}{b.statut !== "actif" ? ` · ${STATUTS[b.statut].toLowerCase()}` : ""}</small>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/bailleurs#guichets">Les guichets ouverts à l’association <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="hub-section" id="contribuer">
        <SectionHead eyebrow="Contribuer" title="Ce que vous pouvez faire" em="dès aujourd’hui." />
        <div className="link-list">
          {p.contribuer.map((l) => <Link href={l.href} key={l.href + l.label}><small>Programme {p.numero}</small><strong>{l.label}</strong></Link>)}
        </div>
      </section>

      <Partager route={routeProgramme(p)} titre={`Programme ${p.numero} · ${p.nom}`} texte={p.accroche} />

      <nav className="article-nav" aria-label="Autres programmes">
        <Link href={routeProgramme(prec)}><small>Programme précédent</small>{prec.numero} · {prec.nom}</Link>
        <Link href={routeProgramme(suiv)}><small>Programme suivant</small>{suiv.numero} · {suiv.nom}</Link>
      </nav>

      <OdebEtat />
    </main>
  );
}
