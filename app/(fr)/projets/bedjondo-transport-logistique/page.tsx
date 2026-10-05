import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead } from "@/components/blocks";
import { metaDescription, ogFor } from "@/lib/content";

/* Bedjondo Transport et Logistique : le projet annoncé le 19 septembre 2026 sous le nom d'Air Bedjondo,
   renommé le 29 septembre 2026. Les propositions de cette page sont des pistes soumises à l'association :
   rien n'est décidé, chiffré ni financé. */

export const metadata: Metadata = {
  title: "Bedjondo Transport et Logistique",
  description: metaDescription("Le projet de transport et de logistique terrestres de Bédjondo, annoncé sous le nom d’Air Bedjondo : pourquoi, ce que nous savons et nos six propositions."),
  alternates: { canonical: "/projets/bedjondo-transport-logistique" },
  openGraph: { ...ogFor("/projets/bedjondo-transport-logistique"), title: "Bedjondo Transport et Logistique — désenclaver par la route", description: "Le projet annoncé sous le nom d’Air Bedjondo, et nos propositions pour le mener." },
};

const PROPOSITIONS: { titre: string; texte: string; points: string[] }[] = [
  {
    titre: "Quatre services possibles",
    texte: "Partir des déplacements qui existent déjà, plutôt que d’en inventer.",
    points: [
      "Une navette les jours de marché entre Bédjondo, Koumra et les chefs-lieux de canton.",
      "Le ramassage des récoltes dans les villages vers les marchés et les magasins de stockage : sésame, arachide, karité.",
      "Le fret des commerçants et les colis de la diaspora entre N’Djamena et Bédjondo.",
      "L’évacuation sanitaire vers Koumra, en lien avec le centre de santé et notre plaidoyer santé.",
    ],
  },
  {
    titre: "Des véhicules faits pour la saison des pluies",
    texte: "Commencer petit, avec ce qui passe sur les pistes d’août à octobre.",
    points: [
      "Des tricycles motorisés à benne pour les pistes des cantons.",
      "Un pick-up tout-terrain pour l’axe de Koumra et les évacuations.",
      "Pas de camion au départ : il viendra si les volumes le justifient.",
    ],
  },
  {
    titre: "Trois montages à comparer",
    texte: "Le choix revient au bureau et à l’assemblée ; l’étude comparera les trois.",
    points: [
      "Une coopérative des transporteurs locaux déjà en activité (motos-taxis, tricycles).",
      "Une société à capitaux de la diaspora, dans le programme Économie sociale et revenus du projet ODEB.",
      "Un partenariat avec un transporteur existant, l’association apportant clientèle, lignes et suivi.",
    ],
  },
  {
    titre: "Trois étapes, chacune rendue publique",
    texte: "On ne passe à l’étape suivante que sur preuve.",
    points: [
      "Étudier : compter les flux aux jours de marché, relever par saison les pistes praticables, les prix pratiqués et les transporteurs existants, lister les autorisations nécessaires.",
      "Essayer : une saison sèche avec un véhicule sur un axe, comptes publiés.",
      "Étendre : un deuxième axe ou un deuxième véhicule seulement si l’essai couvre ses frais.",
    ],
  },
  {
    titre: "Des règles avant le premier trajet",
    texte: "Celles que l’association s’impose déjà ailleurs.",
    points: [
      "Autorisations et assurance obtenues avant tout transport de personnes.",
      "Tarifs affichés, les mêmes pour tous ; priorité donnée aux évacuations.",
      "Charges et vitesses respectées, entretien tenu dans un carnet.",
      "Comptes publiés chaque trimestre ; les revenus servent les projets de l’association.",
    ],
  },
  {
    titre: "Des liens avec les autres chantiers",
    texte: "Le transport ne remplace pas la route : il la rend utile.",
    points: [
      "Le plaidoyer routes et ponts : pont de l’axe Bédjondo–Békamba, pont de Hoblo, entretien des pistes.",
      "Les filières agricoles et le stockage, que soutiennent déjà des programmes présents au Mandoul.",
      "L’évacuation des urgences, demandée dans le plaidoyer santé.",
    ],
  },
];

export default function BedjondoTransportLogistique() {
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Nos actions · projets"
        title="Bedjondo Transport et Logistique,"
        em="désenclaver par la route."
        lead="Le projet annoncé le 19 septembre 2026 sous le nom d’Air Bedjondo s’appelle, depuis le 29 septembre 2026, Bedjondo Transport et Logistique : un nom qui dit enfin ce qu’il est, un projet terrestre. Il vise à désenclaver Bédjondo et à relier ses cantons et ses villages entre eux. C’est une intention annoncée par l’animateur de l’association : aucune étude, aucun financement et aucun calendrier ne sont publics à ce jour."
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Projets", href: "/projets" }, { label: "Bedjondo Transport et Logistique" }]}
        pills={["Annoncé le 19 septembre 2026", "Renommé le 29 septembre 2026", "Ni étude, ni financement, ni calendrier", "Programme ODEB 06"]}
      />

      <section className="hub-section" id="pourquoi">
        <SectionHead eyebrow="Pourquoi ce projet" title="Un chef-lieu coupé" em="à chaque saison des pluies." />
        <div className="detail-grid">
          <article><h3>Des pistes impraticables</h3><p>Les pistes vers les cantons ne sont pas entretenues et deviennent impraticables à la saison des pluies ; au pont de Hoblo, la traversée se fait en pirogue d’août à octobre (<Link href="/journal/2026-09-17-plaidoyer-routes-ponts-bedjondo">plaidoyer routes et ponts</Link>).</p></article>
          <article><h3>Des récoltes qui se perdent</h3><p>Faute de stockage et d’accès aux marchés, une partie des récoltes est perdue : le <Link href="/territoire/diagnostic">diagnostic territorial</Link> le relève.</p></article>
          <article><h3>Des urgences loin des soins</h3><p>Se soigner veut souvent dire partir à Koumra ; le <Link href="/journal/2026-09-17-plaidoyer-sante-bedjondo">plaidoyer santé</Link> demande un moyen d’évacuation.</p></article>
        </div>
      </section>

      <section className="hub-section" id="propositions">
        <SectionHead eyebrow="Nos propositions" title="Six pistes pour le mener," em="soumises à l’association." text="Ces propositions sont celles de l’animation du site, pour ouvrir la discussion au bureau et à l’assemblée générale. Rien n’est décidé, chiffré ni financé ; elles seront corrigées ou abandonnées selon ce que l’étude montrera." />
        <div className="bl-grille">
          {PROPOSITIONS.map((p, i) => (
            <article className="bl-carte" key={p.titre} id={`proposition-${i + 1}`}>
              <p className="bl-tete"><span className="bl-statut bl-statut--preparation">Proposition {i + 1}</span></p>
              <h3>{p.titre}</h3>
              <p className="bl-qui">{p.texte}</p>
              <ul className="btl-points">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="inconnu">
        <SectionHead eyebrow="Ce que nous ne savons pas" title="Tout ce qui reste" em="à établir." />
        <ul className="bl-bref">
          <li>Le mode d’exploitation retenu, les axes prioritaires, le nombre et le type de véhicules.</li>
          <li>Le coût, le montage financier, les autorisations nécessaires et le calendrier.</li>
          <li>Qui porte le projet au quotidien : la thématique Transport et développement urbain est encore à pourvoir.</li>
        </ul>
      </section>

      <section className="hub-section" id="historique">
        <SectionHead eyebrow="Historique" title="Un nom," em="trois dates." />
        <ol className="od-etapes">
          <li><small>19 septembre 2026</small><strong>Annonce, sous le nom d’Air Bedjondo</strong><p>L’animateur annonce un dispositif de transport et de logistique terrestres ; l’association le relaie. <Link href="/journal/2026-09-19-annonce-air-bedjondo">L’article du 19 septembre</Link>.</p></li>
          <li><small>28 septembre 2026</small><strong>Rattachement au programme Économie sociale et revenus</strong><p>Le transport et la logistique terrestres deviennent l’une des entreprises phares proposées du <Link href="/odeb/programmes/economie-sociale">programme 06 du projet ODEB</Link>.</p></li>
          <li><small>29 septembre 2026</small><strong>Nouveau nom : Bedjondo Transport et Logistique</strong><p>Le nom d’Air Bedjondo laissait croire à un projet aérien ; il est remplacé. <Link href="/transparence/decisions">Registre des décisions</Link>.</p></li>
        </ol>
      </section>

      <section className="hub-section" id="participer">
        <SectionHead eyebrow="Participer" title="Vous savez faire" em="une partie de ce travail ?" text="Logistique, transport routier, mécanique, entretien de pistes, assurance, gestion d’une coopérative, financement de projet : une compétence suffit pour faire avancer l’étude." />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/diaspora#inscription">Inscrire ma compétence <span aria-hidden="true">→</span></Link>
          <Link className="button secondary" href="/participer?theme=08&coordo=1#contact">Coordonner Transport et développement urbain <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/projets#bedjondo-transport-logistique">Le projet sur la plateforme <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <Partager route="/projets/bedjondo-transport-logistique" titre="Bedjondo Transport et Logistique" texte="Le projet de transport et de logistique terrestres de Bédjondo, annoncé sous le nom d’Air Bedjondo, et nos propositions pour le mener." />
    </main>
  );
}
