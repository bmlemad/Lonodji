import type { Metadata } from "next";
import Link from "@/components/lien";
import { notFound } from "next/navigation";
import { PageHeader, SectionHead, Stats } from "../../../components/blocks";
import { ogFor } from "../../../lib/content";
import { getVillages, GROUPES, km, nf, routeVillage, TYPES, villagesDe } from "../../../lib/villages";
import Partager from "@/components/partager";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(getVillages().unites).map((unite) => ({ unite }));
}

export async function generateMetadata({ params }: { params: Promise<{ unite: string }> }): Promise<Metadata> {
  const { unite } = await params;
  const u = getVillages().unites[unite];
  if (!u) return {};
  const desc = `${u.nom} (${u.dep}) : ${nf.format(u.comptes.nommes)} localités nommées, ${nf.format(u.comptes.equipements)} équipement${u.comptes.equipements > 1 ? "s" : ""} connu${u.comptes.equipements > 1 ? "s" : ""} des données ouvertes, et ce que le site en dit. Une fiche par village.`;
  return { title: `Les villages de ${u.nom}`, description: desc, alternates: { canonical: `/villages/${unite}` }, openGraph: { ...ogFor("/villages"), url: `/villages/${unite}`, title: `Les villages de ${u.nom}`, description: desc } };
}

export default async function Unite({ params }: { params: Promise<{ unite: string }> }) {
  const { unite } = await params;
  const d = getVillages();
  const u = d.unites[unite];
  if (!u) notFound();
  const villages = villagesDe(unite);
  const parLettre = new Map<string, typeof villages>();
  for (const v of villages) {
    const l = v.nom.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
    parLettre.set(l, [...(parLettre.get(l) || []), v]);
  }
  const avecEq = villages.filter((v) => v.equipements.length).length;
  const cites = villages.filter((v) => v.mentions.length).length;
  return (
    <main id="main-content" className="hub-page vl-page">
      <PageHeader
        eyebrow={`Unité · ${GROUPES[u.groupe]}`}
        title={u.nom}
        em={u.kmBedjondo < 1 ? "chef-lieu du pays bedjond." : `à ${km(u.kmBedjondo)} de Bédjondo.`}
        lead={`${u.notice} ${u.dep}${u.prov && u.prov !== u.dep ? `, ${u.prov}` : ""}. ${nf.format(u.comptes.nommes)} localités nommées sur OpenStreetMap${u.comptes.villages > u.comptes.nommes ? `, ${nf.format(u.comptes.villages - u.comptes.nommes)} sans nom` : ""} ; chacune a sa fiche.`}
        crumbs={[{ label: "Territoire", href: "/carte" }, { label: "Villages", href: "/villages" }, { label: u.nom }]}
        pills={[`${nf.format(u.comptes.nommes)} localités nommées`, `${nf.format(u.comptes.equipements)} ${u.comptes.equipements > 1 ? "équipements connus" : "équipement connu"}`, `${nf.format(u.liens.length)} ${u.liens.length > 1 ? "pages du site" : "page du site"}`]}
      />

      <Stats items={[
        { value: nf.format(villages.length), label: "fiches de localités", note: "villes, bourgs, villages, hameaux nommés" },
        { value: nf.format(avecEq), label: "avec un équipement connu à moins de 10 km", note: avecEq === 0 ? "aucun : les données ouvertes sont muettes ici" : "dans les données ouvertes" },
        { value: nf.format(cites), label: "citées sur le site", note: cites === 0 ? "aucune encore : à vous d’écrire la première ligne" : "dossiers, plaidoyers, articles" },
        { value: nf.format(u.liens.length), label: "pages du site sur l’unité", note: u.liens.length ? u.liens.slice(0, 2).map((l) => l.titre).join(" · ") : "aucune encore" },
      ]} />

      <div className="section-actions" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
        <Link className="button primary" href={`/carte?unite=${u.id}`}>Voir {u.nom} sur la carte <span aria-hidden="true">↗</span></Link>
        <Link className="button secondary" href={`/dossiers/besoins?localite=${encodeURIComponent(u.nom)}`}>Signaler un besoin ici <span aria-hidden="true">→</span></Link>
      </div>

      <section className="hub-section" id="villages">
        <SectionHead eyebrow="Les localités" title={`Les villages de ${u.nom},`} em="de A à Z." text="Touchez un nom : sa fiche dit sa position, ses équipements connus, les pages qui le citent et ce qui reste à documenter." />
        <div className="vl-alpha">
          {[...parLettre.entries()].map(([lettre, liste]) => (
            <div className="vl-lettre" key={lettre}>
              <h3>{lettre}</h3>
              <ul>
                {liste.map((v) => <li key={v.slug}><Link href={routeVillage(v)}>{v.nom}{v.type !== "village" ? <small> {TYPES[v.type]?.toLowerCase()}</small> : null}{v.equipements.length ? <i title="équipement connu à proximité" aria-label="équipement connu à proximité">●</i> : null}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="vl-legende"><i>●</i> un équipement connu à moins de 10 km dans les données ouvertes.</p>
      </section>

      {u.liens.length ? (
        <section className="hub-section" id="site">
          <SectionHead eyebrow="Sur le site" title={`Ce que nous avons écrit`} em={`sur ${u.nom}.`} />
          <div className="link-list">
            {u.liens.map((l) => <Link key={l.route} href={l.route}><small>{l.type}</small><strong>{l.titre}</strong></Link>)}
          </div>
        </section>
      ) : null}

      <aside className="vl-imprimer" aria-label="Affiche à imprimer">
        <img className="vl-affiche-mini" src="/carte/affiches/affiche-villages.jpg" alt="" width="120" height="170" loading="lazy" />
        <div className="vl-imprimer-texte">
          <span className="eyebrow">Sur papier</span>
          <strong>L’affiche de {u.nom}, à accrocher au village.</strong>
          <p>Un A4 avec le code QR vers les villages de {u.nom}, l’adresse en toutes lettres et les trois façons d’écrire à l’association — pour les chefs, les relais, les écoles, les centres de santé.</p>
          <div className="vl-imprimer-actions">
            <a className="button secondary" href={`/carte/affiches/affiche-${unite}.pdf`}>Affiche de {u.nom} <span aria-hidden="true">PDF A4</span></a>
            <Link className="text-link" href="/villages#affiches">Les quinze affiches <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </aside>

      <Partager route={`/villages/${unite}`} titre={u.nom} texte={`les villages de ${u.nom} sur le site de l’association ADEB LONODJI : chaque localité a sa fiche`} />

      <p className="lg-footnote">Contour : GADM 4.1 ({u.dep}). {u.approx ? "Position du chef-lieu approchée. " : ""}{u.origine ? `Repère : ${u.origine}. ` : ""}Localités et équipements : OpenStreetMap (exports humanitaires HOT), données du {new Date(d.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}. Un village manque ou est mal nommé ? Corrigez-le sur OpenStreetMap ou <Link href="/participer#contact">écrivez-nous</Link>.</p>
    </main>
  );
}
