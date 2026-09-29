import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import { getIndex, ogFor } from "../../lib/content";

export const metadata: Metadata = {
  title: "Archives du site",
  description: "La première version du site (septembre 2026, 87 pages) est intégralement reprise ici : ce qu’elle contenait, comment, et ce que des sources extérieures en disent.",
  alternates: { canonical: "/archives" },
  openGraph: ogFor("/archives"),
};

export default function Archives() {
  const idx = getIndex();
  const dates = idx.articles.map((a) => a.date).filter(Boolean).sort();
  const fmt = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const premier = fmt(dates[0]);
  const dernier = fmt(dates[dates.length - 1]);
  const dossiers = idx.pages.filter((p) => p.kind === "dossier").length;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Archives du site"
        title="Rien n’a été perdu :"
        em="la première version est ici."
        lead="Le site publié du 11 au 24 septembre 2026 comptait 87 pages, 36 articles et 14 documents. Le 28 septembre 2026, son contenu a été intégralement repris dans cette nouvelle version, page par page, liens réécrits, formulaires conservés. Cette page en tient le registre."
      />
      <Stats items={[
        { value: "87", label: "pages reprises", note: "dont 6 pages en anglais" },
        { value: String(idx.articles.length), label: "articles du journal", note: `du ${premier} au ${dernier}` },
        { value: String(dossiers), label: "dossiers de fond", note: "diagnostic, projets, patrimoine" },
        { value: String(idx.documents.filter((d) => d.pdf).length), label: "documents PDF", note: "kit, cahiers, plaidoyers" },
      ]} />

      <section className="hub-section">
        <SectionHead eyebrow="Ce qui a été repris" title="Page par page," em="sans réécrire l’histoire." text="Les dates, les faits et les corrections publiées dans la première version sont conservés tels quels. Les articles gardent les intitulés en vigueur à leur date ; le journal des corrections garde chaque entrée." />
        <div className="link-list">
          <Link href="/programmes"><small>Nos actions</small><strong>4 pôles, 19 thématiques, 2 cellules</strong><span>Avec leurs coordonnateurs, leurs objectifs et les ODD associés.</span></Link>
          <Link href="/actions"><small>Plaidoyers</small><strong>7 plaidoyers et la note à la commune</strong><span>Destinataires, état d’envoi, cadre de résultats à 22 indicateurs.</span></Link>
          <Link href="/journal"><small>Journal</small><strong>{idx.articles.length} articles</strong><span>Vie de l’association, histoire, plaidoyers, lettre d’information.</span></Link>
          <Link href="/dossiers"><small>Dossiers</small><strong>{dossiers} dossiers de fond</strong><span>Du diagnostic territorial aux projets à l’étude.</span></Link>
          <Link href="/transparence#corrections"><small>Redevabilité</small><strong>Le journal des corrections</strong><span>Chaque correction de fait, datée, du 17 au 24 septembre 2026.</span></Link>
          <Link href="/documents"><small>Documents</small><strong>Les PDF à télécharger</strong><span>Kit d’adhésion, cahiers de terrain, dossier de présentation, plaidoyers.</span></Link>
        </div>
      </section>

      <section className="hub-section">
        <SectionHead eyebrow="Ce qui a changé" title="Une nouvelle base technique," em="le même contenu." text="Le 27 septembre 2026, le site a été refondu sur une base moderne (Next.js) et mis en ligne sur lonodji.org. Le 28 septembre, le contenu de la première version y a été réintégré." />
        <div className="detail-grid">
          <article><span>01</span><h3>Adresse</h3><p>Le site vit désormais sur lonodji.org. Les anciennes adresses de page ont été réécrites vers les nouvelles.</p></article>
          <article><span>02</span><h3>Les outils en ligne</h3><p>La recherche interne, l’orientation « Trouver ma thématique », le cahier généalogique en ligne et l’espace de rédaction privé du journal fonctionnent de nouveau ; la lecture hors ligne et l’appli mobile retrouvent le site depuis le 28 septembre.</p></article>
          <article><span>03</span><h3>Ce qui reste à faire</h3><p>Les photographies de Bédjondo et de ses membres, le sens du nom « Lonodji », les documents constitutifs et les adresses e-mail @lonodji.org.</p></article>
        </div>
      </section>

      <section className="hub-section">
        <SectionHead eyebrow="Sources extérieures" title="Ce que d’autres" em="disent de nous." text="Deux traces publiques, conservées avec leur statut : elles ne remplacent pas les archives de l’association." />
        <div className="detail-grid">
          <article><h3>Domain Arrivals · 25 septembre 2026</h3><p>Une fiche d’indexation décrit lonodji.org comme le site d’une association tchadienne réunissant des habitants de Bédjondo et la diaspora autour du patrimoine bedjond, du développement communautaire et du plaidoyer public — avec la reconnaissance de 1995, quatre pôles, dix-neuf thématiques et huit appels publics. Exact.</p><span className="status">Trace externe</span></article>
          <article><h3>Talou-Choufou Magazine · 2 mai 2021</h3><p>Publication consacrée à Alladoum Désiré Nandogongar, présenté comme membre fondateur, qui rapporte des initiatives de l’association dans les années 2000 : forums, verger scolaire, matériel didactique, tables-bancs, adduction d’eau. Pistes à confirmer par des pièces originales.</p><a className="text-link" href="https://talouchoufoumagazine.wordpress.com/2021/05/02/actu-alladoum-desire-nandogongar-le-premier-tchadien-a-occuper-le-poste-de-superintendant-des-operations-directeur-usine-dans-le-monde-petrolier-depuis-2020/" target="_blank" rel="noopener noreferrer">Consulter la source ↗</a></article>
        </div>
      </section>
    </main>
  );
}
