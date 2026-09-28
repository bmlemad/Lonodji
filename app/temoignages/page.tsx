import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import TemoignageForm from "../../components/temoignage-form";
import { ogFor, ORG } from "../../lib/content";
import { getIndicateurs } from "../../lib/indicateurs";

export const metadata: Metadata = {
  title: "Racontez Bédjondo : témoignages et banque d’images",
  description: "Un ancien qui raconte, une femme leader, un jeune talent, un paysage : envoyez votre récit, votre photo ou votre voix. Rien n’est publié sans votre relecture.",
  alternates: { canonical: "/temoignages" },
  openGraph: ogFor("/temoignages"),
};

const SERIES = [
  ["01", "Portraits des anciens", "Celles et ceux qui ont vu Bédjondo changer : leur visage, leur voix, ce qu’ils veulent transmettre. Un portrait, quelques minutes d’enregistrement, une date et un lieu.", "Le forum de 2000, la création de l’association en 1986-1995, la vie des cantons avant la route."],
  ["02", "Femmes qui font bouger les choses", "Au marché, au centre de santé, à l’école, dans les champs, dans les groupements : celles qui tiennent Bédjondo debout, montrées au travail et nommées si elles le souhaitent.", "Une journée de marché, une sage-femme, une présidente de groupement, une enseignante."],
  ["03", "Jeunes talents", "Élèves, apprentis, étudiants, jeunes entrepreneurs, sportifs, artistes : ce qu’ils font déjà, ce qu’ils visent, ce qui leur manque.", "Un atelier, un terrain, une salle de classe, un premier commerce, un diplôme."],
  ["04", "Paysages de Bédjondo", "La ville et les cantons tels qu’ils sont : le petit matin, la saison des pluies, la route de Koumra, les rives, les grands arbres, les quartiers.", "Une photo par saison du même endroit vaut plus que dix photos différentes."],
  ["05", "Activités de terrain", "Ce que fait l’association et ce que font les gens : réunions, enquêtes, chantiers, cérémonies, distributions, réparations. Daté, situé, avec l’accord des personnes.", "Une réunion de thématique, une enquête de terrain, la réfection d’un forage."],
  ["06", "Archives : les forums de 2000 et 2003", "Photographies, programmes, listes de participants, comptes rendus, cassettes : tout ce qui documente les deux forums fondateurs et la reconnaissance de 1995.", "Un tirage papier photographié à plat, en pleine lumière, suffit pour commencer."],
];

export default function Temoignages() {
  const ind = getIndicateurs();
  const recus = ind.formulaires.comptes["temoignage"]?.envois ?? 0;
  const releve = new Date(ind.formulaires.date + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main id="main-content" className="hub-page tm-page">
      <PageHeader
        eyebrow="Témoignages · banque d’images"
        title="Racontez Bédjondo"
        em="à celles et ceux qui viennent."
        lead="Ce site sait compter, documenter, plaider. Il ne sait pas encore faire entendre les voix de Bédjondo ni la montrer. Un ancien qui raconte le forum de 2003, une femme qui tient le marché, un jeune qui a réussi, un paysage au petit matin : c’est ce qui manque, et c’est vous qui l’avez."
        crumbs={[{ label: "Participer", href: "/participer" }, { label: "Témoignages" }]}
        pills={["En français ou en bedjond", "Photo, son ou vidéo, 10 Mo au plus", "Rien de publié sans votre relecture"]}
      />

      <Stats items={[
        { value: String(recus), label: recus === 1 ? "récit reçu" : "récits reçus", note: `relevé du ${releve}` },
        { value: "0", label: "photo publiée à ce jour", note: "la première le sera avec son auteur, son lieu, sa date" },
        { value: "6", label: "séries recherchées", note: "portraits, femmes, jeunes, paysages, terrain, archives" },
        { value: "100", label: "photos visées par le plan 2026-2028", note: "action 1.2, banque d’images institutionnelles" },
      ]} />

      <section className="hub-section" id="series">
        <SectionHead eyebrow="Ce que nous cherchons" title="Six séries," em="une seule règle : le vrai." text="Pas de banque d’images achetée, pas de photo d’ailleurs : Bédjondo, ses cantons et sa diaspora, photographiés et racontés par ceux qui y vivent. Chaque récit est vérifié et relu par son auteur avant publication ; chaque photo est créditée, datée, située." />
        <div className="detail-grid tm-series">
          {SERIES.map(([n, titre, texte, exemple]) => (
            <article key={n}><span>{n}</span><h3>{titre}</h3><p>{texte}</p><small className="tm-exemple">Par exemple : {exemple}</small></article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="regles">
        <SectionHead eyebrow="Comment nous travaillons" title="Votre récit," em="vos droits." />
        <div className="detail-grid">
          <article><h3>Vérifié, puis relu par vous</h3><p>Nous vous rappelons pour préciser les noms, les dates, les lieux. La version prête à publier vous est envoyée ; rien ne paraît sans votre accord sur ce texte-là. Une erreur découverte après coup est corrigée et datée dans le <Link href="/transparence#corrections">journal des corrections</Link>.</p></article>
          <article><h3>Les personnes d’abord</h3><p>Une personne citée ou photographiée doit être d’accord. Un enfant identifiable n’est jamais publié sans l’accord d’un parent ou tuteur, et jamais avec son nom ni son école : c’est notre <Link href="/transparence#ce-que-nous-protegeons-et-comment">règle de protection</Link>, sans exception.</p></article>
          <article><h3>Vos droits sur vos images</h3><p>Vous restez l’auteur de votre photo ou de votre enregistrement. Vous autorisez ADEB LONODJI à les publier sur ses supports, avec votre nom si vous le souhaitez, et vous pouvez retirer cette autorisation à tout moment par <Link href="/participer#contact">le formulaire de contact</Link>. Rien n’est vendu ni cédé à un tiers.</p></article>
        </div>
        <div className="notice tm-conseils">
          <strong>Pour une photo utile :</strong> lumière du jour, sujet net, format original sans filtre ni recadrage, envoyée depuis le téléphone qui l’a prise. Notez le lieu, la date et, avec leur accord, le nom des personnes. Pour un enregistrement : un endroit calme, le téléphone à une main du visage, deux à dix minutes.
        </div>
      </section>

      <section className="hub-section" id="envoyer">
        <SectionHead eyebrow="Envoyer" title="Un récit, une photo," em="et Bédjondo se voit." text="Tout ce qui est marqué d’un astérisque est nécessaire. Pour une série de photos ou un long enregistrement, faites un premier envoi ici, puis la suite par WhatsApp : nous vous répondrons sous quarante-huit heures ouvrées." />
        <div className="legacy dp-formulaire">
          <TemoignageForm telephone={ORG.phone} whatsapp={ORG.whatsapp} />
        </div>
      </section>

      <p className="lg-footnote">Page ouverte le 28 septembre 2026 au titre des actions 1.2 (banque d’images) et 5.2 (patrimoine vivant) du plan d’action 2026-2028, qui prévoit aussi une campagne de photographies professionnelles ; en attendant, ce sont vos photos qui font exister la banque d’images. Les récits validés paraissent dans <Link href="/journal">le journal</Link>, signés et datés ; les photos, sur les pages qu’elles illustrent, avec leur crédit. Les envois sont enregistrés par le service de formulaires de notre hébergeur (<Link href="/mentions-legales#donnees">où vont vos réponses</Link>) ; les compteurs paraissent sur le <Link href="/impact">tableau de bord</Link>.</p>
    </main>
  );
}
