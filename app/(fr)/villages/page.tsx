import { alternatesLangues } from "@/lib/langues";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import VillagesRecherche, { type EntreeVillage } from "@/components/villages-recherche";
import { ogFor } from "@/lib/content";
import { getVillages, GROUPES, km, nf, ORDRE_GROUPES, TYPES } from "@/lib/villages";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Les villages du pays bedjond : une fiche par localité",
  description: "Retrouvez votre village : 966 localités du pays bedjond, chacune avec ce que les données ouvertes en savent, ce que le site en dit et ce qui reste à documenter.",
  alternates: { canonical: "/villages", languages: alternatesLangues("/villages") },
  openGraph: ogFor("/villages"),
};

export default function Villages() {
  const d = getVillages();
  const genere = new Date(d.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const entrees: EntreeVillage[] = d.villages.map((v) => ({ n: v.nom, u: v.unite, s: v.slug, t: TYPES[v.type] || v.type, un: d.unites[v.unite]?.nom || v.unite }));
  const unites = Object.values(d.unites).sort((a, b) => ORDRE_GROUPES.indexOf(a.groupe) - ORDRE_GROUPES.indexOf(b.groupe) || a.kmBedjondo - b.kmBedjondo);
  const avecEquipement = d.villages.filter((v) => v.equipements.length).length;
  const cites = d.villages.filter((v) => v.mentions.length).length;
  return (
    <main id="main-content" className="hub-page vl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: "/villages", name: "Les villages du pays bedjond : une fiche par localité", description: "Retrouvez votre village : 966 localités du pays bedjond, chacune avec ce que les données ouvertes en savent, ce que le site en dit et ce qui reste à documenter." }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Territoire", url: "/territoire" }, { name: "Villages" }], "/villages")] }) }} />
      <PageHeader
        eyebrow="Territoire · fiches des villages"
        title="Retrouver son village,"
        em="et ce qu’on en sait."
        lead="Chaque localité nommée du pays bedjond a désormais sa page : sa position, son unité, les équipements que les données ouvertes connaissent autour d’elle, les pages du site qui la citent — et, surtout, ce qui reste à documenter, avec le formulaire qui permet de le faire. Une fiche vide est un appel, pas un constat."
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Villages" }]}
        pills={[`${nf.format(d.villages.length)} localités nommées`, `${Object.keys(d.unites).length} unités`, `données du ${genere}`]}
      />

      <VillagesRecherche villages={entrees} />

      <Stats items={[
        { value: nf.format(d.villages.length), label: "fiches de localités", note: "villes, bourgs, villages, hameaux nommés sur OpenStreetMap" },
        { value: nf.format(avecEquipement), label: "avec un équipement connu à moins de 10 km", note: "école, santé, eau, marché… dans les données ouvertes" },
        { value: nf.format(cites), label: "déjà citées sur le site", note: "dossiers, plaidoyers, articles" },
        { value: nf.format(d.villages.length - cites), label: "attendent leur première ligne", note: "un récit, un besoin, un lieu sacré : à vous" },
      ]} />

      <section className="hub-section" id="unites">
        <SectionHead eyebrow="Par unité" title="Quatorze unités," em="du cœur à la diaspora." text="Sept sous-préfectures au cœur du Mandoul Occidental, trois où la présence bedjond est attestée, une signalée, trois de diaspora agricole. Chaque unité a sa page, avec la liste de ses villages et ce que le site en a écrit." />
        <div className="vl-unites">
          {unites.map((u) => (
            <Link className="vl-unite" href={`/villages/${u.id}`} key={u.id}>
              <small>{GROUPES[u.groupe]}</small>
              <strong>{u.nom}</strong>
              <span>{u.dep}{u.prov && u.prov !== u.dep ? `, ${u.prov}` : ""} · {u.kmBedjondo < 1 ? "chef-lieu" : `à ${km(u.kmBedjondo)} de Bédjondo`}</span>
              <b>{nf.format(u.comptes.nommes)} {u.comptes.nommes > 1 ? "localités" : "localité"} · {nf.format(u.comptes.equipements)} {u.comptes.equipements > 1 ? "équipements" : "équipement"}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="hub-section" id="affiches">
        <SectionHead eyebrow="Sur papier" title="Quinze affiches" em="à imprimer et à accrocher." text="Pour les chefs de canton et de village, les relais, les écoles, les centres de santé, les lieux de culte : une affiche A4 par unité, avec un code QR vers ses villages et l’adresse en toutes lettres, et une affiche générale. Chaque fiche de village s’imprime aussi telle quelle, avec ses six questions à remplir à la main." />
        <div className="vl-affiches">
          <a className="vl-affiche vl-affiche--generale" href="/carte/affiches/affiche-villages.pdf">
            <img src="/carte/affiches/affiche-villages.jpg" alt="Aperçu de l’affiche générale « Retrouvez votre village »" width="397" height="562" loading="lazy" />
            <span><small>Affiche générale · A4 · PDF</small><strong>Retrouvez votre village</strong><em>{nf.format(d.villages.length)} localités, {Object.keys(d.unites).length} unités, une fiche par village</em></span>
          </a>
          <ul className="vl-affiches-liste">
            {unites.map((u) => <li key={u.id}><a href={`/carte/affiches/affiche-${u.id}.pdf`}><small>{GROUPES[u.groupe]}</small><strong>{u.nom}</strong><span>{nf.format(u.comptes.nommes)} localités nommées · PDF A4</span></a></li>)}
          </ul>
        </div>
      </section>

      <section className="hub-section" id="methode">
        <SectionHead eyebrow="D’où viennent ces fiches" title="Des données ouvertes," em="et de vous." />
        <div className="detail-grid">
          <article><h3>Ce que la fiche sait déjà</h3><p>Le nom et la position viennent d’OpenStreetMap, le rattachement à l’unité des contours GADM 4.1 : c’est la même base que la <Link href="/carte">carte du territoire</Link>. Les équipements proches sont ceux que des contributeurs ont placés — presque aucun au cœur du pays bedjond, pour l’instant.</p></article>
          <article><h3>Ce que la fiche attend</h3><p>L’eau, l’école, la santé, le réseau, l’histoire du nom, les lieux sacrés, le nombre d’habitants : chaque manque renvoie au formulaire qui permet de le combler, et ce qui est reçu et vérifié paraît sur la fiche, daté et sourcé.</p></article>
          <article><h3>Votre village manque ?</h3><p>Il n’est pas dans les données ouvertes, ou son nom y est écrit autrement. Ajoutez-le ou corrigez-le sur OpenStreetMap — un compte gratuit suffit — ou <Link href="/participer#contact">écrivez-nous</Link> : il apparaîtra à la mise à jour suivante.</p></article>
        </div>
        <Partager route="/villages" titre="Les villages du pays bedjond" texte="Retrouvez votre village : 966 localités du pays bedjond, chacune avec ce que les données ouvertes en savent, ce que le site en dit et ce qui reste à documenter." />
        <p className="lg-footnote">Fiches établies automatiquement à partir des données de la carte ({d.sources.localites}). Une erreur de nom ou de position ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p>
      </section>
    </main>
  );
}
