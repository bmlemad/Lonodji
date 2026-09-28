import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead } from "../../../../components/blocks";
import { OdebHero } from "../../../../components/odeb-marque";
import OdebNav, { OdebEtat } from "../../../../components/odeb-nav";
import { metaDescription, ogFor } from "../../../../lib/content";
import { MISSIONS, ODEB, programme, PROGRAMMES, routeProgramme } from "../../../../lib/odeb";
import { thematiquesParId } from "../../../../lib/odeb-chiffres";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ programme: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ programme: string }> }): Promise<Metadata> {
  const p = programme((await params).programme);
  if (!p) return {};
  const route = routeProgramme(p);
  return {
    title: `Programme ${p.nom} — projet ODEB LONODJI`,
    description: metaDescription(`${p.axes.map((a) => a.titre).join(", ")} : ${p.accroche}`),
    alternates: { canonical: route },
    openGraph: ogFor(route),
  };
}

export default async function ProgrammePage({ params }: { params: Promise<{ programme: string }> }) {
  const p = programme((await params).programme);
  if (!p) notFound();
  const th = thematiquesParId();
  const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
  const i = PROGRAMMES.indexOf(p);
  const prec = PROGRAMMES[(i + PROGRAMMES.length - 1) % PROGRAMMES.length];
  const suiv = PROGRAMMES[(i + 1) % PROGRAMMES.length];
  return (
    <main id="main-content" className="hub-page od-page">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · programme ${p.numero}`}
        title={p.nom}
        em={p.axes.map((a) => a.titre).join(" · ") + "."}
        lead={p.objet}
        crumbs={[{ label: "Projet ODEB", href: "/odeb" }, { label: "Programmes", href: "/odeb/programmes" }, { label: p.nom }]}
        pills={[`Missions : ${p.missions.map((id) => MISSIONS.find((m) => m.id === id)?.nom).filter(Boolean).join(", ")}`, `${ths.length} ${ths.length > 1 ? "thématiques" : "thématique"}, ${ths.filter((t) => t.filled).length} ${ths.filter((t) => t.filled).length > 1 ? "pourvues" : "pourvue"}`]}
      />
      <OdebNav actif="programmes" />

      <section className="hub-section" id="axes">
        <SectionHead eyebrow="Trois axes" title="Ce qui existe," em="ce que le programme construira." text="Pour chaque axe : ce que le site fait déjà (des liens vers les pages, pas des intentions), puis ce que le programme construirait d’ici 2030 — au conditionnel, parce que rien n’est décidé ni financé." />
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

      <section className="hub-section" id="contribuer">
        <SectionHead eyebrow="Contribuer" title="Ce que vous pouvez faire" em="dès aujourd’hui." />
        <div className="link-list">
          {p.contribuer.map((l) => <Link href={l.href} key={l.href + l.label}><small>Programme {p.numero}</small><strong>{l.label}</strong></Link>)}
        </div>
      </section>

      <nav className="article-nav" aria-label="Autres programmes">
        <Link href={routeProgramme(prec)}><small>Programme précédent</small>{prec.numero} · {prec.nom}</Link>
        <Link href={routeProgramme(suiv)}><small>Programme suivant</small>{suiv.numero} · {suiv.nom}</Link>
      </nav>

      <OdebEtat />
    </main>
  );
}
