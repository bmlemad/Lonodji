import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Pas de connexion",
  description: "Sans réseau, les pages déjà ouvertes restent lisibles : ce qui reste consultable hors ligne et comment préparer les prochaines coupures.",
  alternates: { canonical: "/hors-ligne" },
  robots: { index: false, follow: true },
};

/* Page servie par le service worker (public/sw.js) quand le réseau tombe
   et que la page demandée n'est pas gardée en mémoire sur l'appareil. */
export default function HorsLigne() {
  return (
    <main id="main-content" className="hub-page hors-ligne">
      <PageHeader
        eyebrow="Lecture sans réseau"
        title="Pas de connexion,"
        em="et cette page n’a pas encore été ouverte ici."
        lead="Voici ce qui reste consultable sans réseau, et comment préparer les prochaines coupures. Rien n’est perdu : il suffit de revenir quand le réseau revient."
      />

      <section className="hub-section">
        <SectionHead eyebrow="Sans réseau" title="Ce qui reste" em="lisible." text="Une page que vous avez déjà ouverte sur cet appareil se rouvre sans connexion, dans l’état où vous l’avez lue. C’est tout : le site ne se télécharge pas en entier, parce qu’il pèse plusieurs mégaoctets et que personne ne doit payer ce transfert sans l’avoir demandé." />
        <div className="detail-grid">
          <article><span>01</span><h3>Déjà lu = encore lisible</h3><p>Les pages ouvertes quand le réseau passait restent affichables. Ouvrez celles qui vous intéressent quand la connexion est bonne — au marché, à Koumra, là où la 3G passe.</p></article>
          <article><span>02</span><h3>Le cahier généalogique</h3><p>Ses fiches sont enregistrées dans le téléphone, jamais sur un serveur : il fonctionne entièrement hors ligne dès qu’il a été ouvert une fois.</p><Link className="text-link" href="/dossiers/genealogie-outil">Ouvrir le cahier <span aria-hidden="true">→</span></Link></article>
          <article><span>03</span><h3>Les documents PDF</h3><p>Un document téléchargé reste sur l’appareil. Les documents à faire remplir sur le terrain existent en PDF pour cette raison : on les imprime une fois et on n’a plus besoin de réseau.</p><Link className="text-link" href="/documents">Voir les documents <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>

      <section className="hub-section">
        <SectionHead eyebrow="À portée de main" title="Garder le site" em="sur l’écran d’accueil." text="Depuis le navigateur du téléphone, le menu propose « Ajouter à l’écran d’accueil » (ou « Installer l’application »). Le site s’ouvre alors comme une application, en plein écran, avec son icône — le même site, simplement posé sur l’écran d’accueil. L’application Android et iPhone de l’association, préparée en septembre 2026, ouvrira ce même site." />
        <p className="lg-footnote">Cette page ne s’affiche que hors ligne. Si vous la voyez alors que votre connexion fonctionne, c’est le site qui a un problème : signalez-le par la <Link href="/participer#contact">page contact</Link>.</p>
        <p className="button-row">
          <a className="button primary" href="/">Réessayer l’accueil</a>
          <a className="button secondary" href="/journal">Le journal</a>
        </p>
      </section>
    </main>
  );
}
