import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import { ogFor, ORG } from "@/lib/content";

export const metadata: Metadata = {
  title: "Déclaration d’accessibilité",
  description: metaDescription("Ce que lonodji.org fait pour être lisible et utilisable par tous — lecteurs d’écran, clavier, petits écrans, connexions lentes —, ce qui est testé, les limites connues, et à qui signaler un obstacle."),
  alternates: { canonical: "/accessibilite" },
  openGraph: ogFor("/accessibilite"),
};

export default function Accessibilite() {
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Le site · accessibilité"
        title="Un site lisible"
        em="par tous, partout."
        lead="Beaucoup de ceux à qui ce site s’adresse le lisent sur un téléphone, avec une connexion lente ou coupée, parfois avec un lecteur d’écran ou au clavier seulement. Voici ce que nous faisons pour eux, ce que nous vérifions, ce qui reste imparfait, et comment nous le dire."
        crumbs={[{ label: "Plan du site", href: "/plan-du-site" }, { label: "Accessibilité" }]}
        pills={["Niveau visé : WCAG 2.1 AA", "Testé le 28 septembre 2026", "Aucun traceur, aucune bannière"]}
      />

      <section className="hub-section" id="engagement">
        <SectionHead eyebrow="Ce que nous visons" title="Le niveau AA," em="et quelques règles à nous." />
        <div className="detail-grid">
          <article><h3>Le niveau visé</h3><p>Les pages du site visent le niveau AA des règles internationales WCAG 2.1 : contrastes suffisants, navigation au clavier, structure de titres, textes de remplacement, formulaires étiquetés, pas de contenu qui bouge sans commande.</p></article>
          <article><h3>Léger et hors ligne</h3><p>Aucune image lourde, aucun script de suivi, aucune bannière de consentement : le site n’en a pas besoin. Une fois ouvertes, les pages restent lisibles sans réseau, et le site s’installe sur l’écran d’accueil du téléphone.</p></article>
          <article><h3>En français simple, et en anglais</h3><p>Nous écrivons court, nous datons nos faits, nous nommons ce que nous ne savons pas. Onze pages existent en anglais — accueil, l’association, les thématiques, les plaidoyers, Bédjondo, contact, les villages, les projets, le tableau de suivi, les secteurs, le projet ODEB — ; l’arabe et le nangnda restent à venir, et nous le disons plutôt que de le promettre.</p></article>
        </div>
      </section>

      <section className="hub-section" id="tests">
        <SectionHead eyebrow="Ce que nous vérifions" title="Avant chaque mise en ligne," em="les mêmes contrôles." text="Chaque mise en ligne passe par une vérification automatique de toutes les pages (règles WCAG 2.1 A et AA avec l’outil axe-core), un parcours au clavier des menus et des formulaires, et des captures à trois largeurs d’écran — téléphone, tablette, ordinateur — pour qu’aucun contenu ne déborde ni ne se cache." />
        <div className="detail-grid">
          <article><h3>Ce qui a été vérifié le 28 septembre 2026</h3><p>131 pages parcourues en ligne le matin, puis les pages ouvertes dans la journée, 418 liens et ancres suivis, aucune violation relevée par axe-core, aucune erreur de console, aucun débordement horizontal sur mobile ; menus, méga-menu et formulaires utilisables au clavier (Tab, Entrée, flèches, Échap).</p></article>
          <article><h3>Ce que nous n’avons pas encore testé</h3><p>Une lecture complète avec un lecteur d’écran par une personne qui en dépend au quotidien ; l’usage avec une loupe d’écran ; les pages anglaises avec une voix de synthèse anglaise. Si vous pouvez nous aider à le faire, écrivez-nous.</p></article>
        </div>
      </section>

      <section className="hub-section" id="limites">
        <SectionHead eyebrow="Limites connues" title="Ce qui reste imparfait," em="dit comme tel." />
        <div className="detail-grid">
          <article><h3>La carte interactive</h3><p>La <Link href="/carte">carte du territoire</Link> se manipule à la souris ou au doigt ; ses fiches sont lisibles au clavier, mais le déplacement et le zoom de la carte elle-même ne le sont pas entièrement. Les mêmes informations existent en texte sur les <Link href="/villages">fiches des villages</Link> et l’<Link href="/observatoire">observatoire</Link>.</p></article>
          <article><h3>Les documents PDF</h3><p>Les plaidoyers, cahiers et le livre blanc sont produits avec une structure de titres, mais tous n’ont pas été vérifiés avec un lecteur d’écran. Chaque document a une page équivalente en ligne, qui reste la version de référence.</p></article>
          <article><h3>Les contenus importés</h3><p>Une partie des pages vient de la première version du site (septembre 2026) et garde des tableaux denses ; nous les reprenons au fil des mises à jour. Les photographies, quand elles arriveront, porteront toutes une description.</p></article>
        </div>
      </section>

      <section className="hub-section" id="signaler">
        <SectionHead eyebrow="Un obstacle ?" title="Dites-le nous," em="nous répondons sous 48 heures." />
        <div className="contact-card" style={{ maxWidth: 760 }}>
          <p>Une page illisible, un formulaire impossible à remplir, un contraste trop faible, un document inaccessible : écrivez-nous en indiquant la page et ce qui bloque. Nous répondons sous quarante-huit heures ouvrées et nous corrigeons ; les corrections sont datées dans le <Link href="/transparence#corrections">journal des corrections</Link>. Par téléphone ou WhatsApp : {ORG.phone}.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/participer?objet=question#contact">Signaler un obstacle <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/transparence">Notre charte de redevabilité <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <p className="lg-footnote">Déclaration publiée le 28 septembre 2026, revue à chaque changement important du site. Référentiel : Web Content Accessibility Guidelines (WCAG) 2.1, niveau AA. Outils : axe-core 4, Playwright, captures multi-écrans. Les vérifications sont décrites dans la documentation technique du site.</p>
      </section>
    </main>
  );
}
