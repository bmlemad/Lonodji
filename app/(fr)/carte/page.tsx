import type { Metadata } from "next";
import Link from "@/components/lien";
import fs from "node:fs";
import path from "node:path";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import CarteTerritoire from "@/components/carte-territoire";
import { ogFor } from "@/lib/content";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Carte du territoire bedjond",
  description: "Carte interactive du pays bedjond : quatorze unités, leurs localités et les équipements connus des données ouvertes, et ce que le site en dit de chaque lieu.",
  alternates: { canonical: "/carte" },
  openGraph: ogFor("/carte"),
};

type Donnees = { genere: string; sources: Record<string, string>; unites: { id: string; nom: string; groupe: string }[]; comptes: Record<string, { villages: number; nommes: number; equipements: number }>; familles: Record<string, number>; villages: unknown[]; equipements: { unite: string; famille: string }[] };

function lireDonnees(): Donnees {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "carte", "donnees.json"), "utf8"));
}

export default function Carte() {
  const d = lireDonnees();
  const coeur = d.unites.filter((u) => u.groupe === "coeur").map((u) => u.id);
  const villagesCoeur = coeur.reduce((n, id) => n + d.comptes[id].villages, 0);
  const equipementsCoeur = coeur.reduce((n, id) => n + d.comptes[id].equipements, 0);
  const sansEquipement = d.unites.filter((u) => d.comptes[u.id].equipements === 0).map((u) => u.nom);
  const genere = new Date(d.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main id="main-content" className="hub-page carte-page">
      <PageHeader
        eyebrow="Territoire · carte"
        title="Le pays bedjond,"
        em="village par village."
        lead="Les quatorze unités du pays bedjond sur fond de carte ouverte, avec les localités et les équipements que les données publiques connaissent — et ceux qu’elles ignorent encore. Touchez un canton, un village ou un équipement : sa fiche dit ce que nous savons, ce que le site en a écrit, et comment signaler un besoin à cet endroit."
        crumbs={[{ label: "Territoire", href: "/territoire" }, { label: "Carte" }]}
        pills={[`${d.unites.length} unités`, `${d.villages.length.toLocaleString("fr-FR")} localités`, `${d.equipements.length} équipements`, `données du ${genere}`]}
      />

      <CarteTerritoire />

      <Stats items={[
        { value: String(villagesCoeur), label: "localités du Mandoul Occidental", note: "sur OpenStreetMap, dans les sept unités du cœur" },
        { value: String(equipementsCoeur), label: "équipements cartographiés au cœur", note: "écoles, santé, eau, marchés… présents dans les données ouvertes" },
        { value: String(sansEquipement.length), label: "unités sans aucun équipement connu", note: sansEquipement.slice(0, 5).join(", ") + (sansEquipement.length > 5 ? "…" : "") },
        { value: d.villages.length.toLocaleString("fr-FR"), label: "localités sur les quatorze unités", note: "villes, bourgs, villages et hameaux" },
      ]} />

      <section className="hub-section">
        <SectionHead eyebrow="Ce que la carte dit" title="Un territoire présent," em="des équipements absents." text={`Les données ouvertes connaissent les villages du pays bedjond, mais presque aucune de ses écoles, de ses centres de santé, de ses forages. À Bédjondo même, chef-lieu de ${d.comptes.bedjondo.villages} localités recensées, aucun équipement n’est cartographié. Ce silence ne décrit pas la réalité : il décrit ce qui reste à faire.`} />
        <div className="detail-grid">
          <article><span>01</span><h3>Signaler depuis la carte</h3><p>Chaque fiche porte un bouton « Signaler un besoin ici » : le formulaire de la carte des besoins s’ouvre avec la localité déjà remplie. Un forage en panne, une école sans maître, un centre de santé sans électricité — le signalement est daté, modéré, puis publié dans la synthèse mensuelle.</p><Link className="text-link" href="/territoire/besoins">La carte des besoins <span aria-hidden="true">→</span></Link></article>
          <article><span>02</span><h3>Compléter les données ouvertes</h3><p>OpenStreetMap se corrige comme une encyclopédie : un compte gratuit, l’éditeur en ligne, et chacun peut placer l’école ou le forage de son village — depuis Bédjondo ou depuis la diaspora, à partir des images satellites. Ce que vous y ajoutez apparaît ici à la mise à jour suivante des données.</p><a className="text-link" href="https://www.openstreetmap.org/#map=12/8.63/17.19" target="_blank" rel="noopener noreferrer">Ouvrir Bédjondo dans OpenStreetMap <span aria-hidden="true">↗</span></a></article>
          <article><span>03</span><h3>Une fiche par village</h3><p>Chaque localité nommée a sa page : position, unité, équipements connus à moins de dix kilomètres, pages du site qui la citent, et six questions à documenter — l’eau, l’école, la santé, le réseau, l’histoire, les habitants — chacune reliée au formulaire qui permet d’y répondre.</p><Link className="text-link" href="/villages">Retrouver son village <span aria-hidden="true">→</span></Link></article>
          <article><span>04</span><h3>Ce que le site en dit</h3><p>La fiche de chaque unité rassemble les plaidoyers, dossiers et articles qui la citent : les plaidoyers pour Bédjondo, le forum de Bébopen de 2003, la présence bedjond du Logone Oriental et du Moyen-Chari. La carte est une porte d’entrée dans tout le reste du site.</p><Link className="text-link" href="/territoire/bedjondo">Le dossier Bédjondo <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>

      <section className="hub-section">
        <SectionHead eyebrow="Sources et limites" title="D’où viennent" em="ces tracés." />
        <div className="detail-grid">
          <article><h3>Limites administratives</h3><p>{d.sources.limites}. Les sous-préfectures sont celles de la base GADM ; l’administration tchadienne a réorganisé certains départements depuis (voir les notices des unités). Les tracés sont simplifiés : ils situent, ils ne bornent pas.</p></article>
          <article><h3>Localités et équipements</h3><p>Localités : {d.sources.localites}. Équipements : {d.sources.equipements}. Les positions sont celles des contributeurs ; un village peut manquer, un nom peut différer de l’usage local. Signalez-nous toute erreur.</p></article>
          <article><h3>Les quatorze unités</h3><p>{d.sources.unites}. Sept unités au cœur (Mandoul Occidental), trois où la présence bedjond est attestée, une signalée, trois de diaspora agricole. Le détail et ses sources sont dans le dossier Bédjondo.</p></article>
        </div>
        <Partager route="/carte" titre="Carte du territoire bedjond" texte="Carte interactive du pays bedjond : quatorze unités, leurs localités et les équipements connus des données ouvertes, et ce que le site en dit de chaque lieu." />
        <p className="lg-footnote">Fond de carte : tuiles humanitaires d’OpenStreetMap France, chargées depuis leurs serveurs quand la page s’affiche ; le reste de la carte fonctionne hors ligne une fois ouvert. Données assemblées automatiquement, régénérables à tout moment. Une erreur de fait ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p>
      </section>
    </main>
  );
}
