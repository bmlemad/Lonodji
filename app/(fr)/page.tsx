import type { Metadata } from "next";
import { alternatesLangues } from "@/lib/langues";
import Link from "@/components/lien";
import { ArticleCard } from "@/components/blocks";
import TableauDeBord from "@/components/tableau-de-bord";
import CarteAccueil from "@/components/carte-accueil";
import EnCeMoment from "@/components/en-ce-moment";
import { enLettres, filledCount, getIndex, ORG, thematiqueCount } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { ODEB, PROGRAMMES, routeProgramme } from "@/lib/odeb";
import { PRIORITAIRES } from "@/lib/organisation";
import { dateFr, etape, getElection } from "@/lib/election";
import { getMagazine } from "@/lib/magazine";
import { getPostes } from "@/lib/postes";
import { getTransmissions } from "@/lib/transmissions";
import { apercu } from "@/lib/apercu";

/* Accueil, refait le 1er octobre 2026 : la carte cliquable du pays bedjond en tête (chaque unité mène à ses
   villages), puis ce qui se passe en ce moment (élection, magazine, postes), les six pôles, les plaidoyers, le
   projet ODEB, le journal, le territoire et la mémoire, le tableau de suivi, et comment participer.
   Tous les chiffres sont lus dans content/ à la construction. */
const idx0 = getIndex();
export const metadata: Metadata = {
  description: `L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond : ${enLettres(idx0.structure.poles.length)} pôles, ${enLettres(thematiqueCount(idx0))} thématiques, ${enLettres(getIndicateurs().contenu.plaidoyers.publies)} dossiers de plaidoyer.`,
  alternates: { canonical: "/", languages: alternatesLangues("/") },
};

const MOIS_COURTS = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const jourMois = (iso: string) => { const [, m, j] = iso.split("-").map(Number); return { jour: j === 1 ? "1er" : String(j), mois: MOIS_COURTS[m - 1] }; };
const fr = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ");

const VALEURS: [string, string][] = [
  ["Courage", "Affronter les défis de la communauté sans attendre qu’une solution vienne d’ailleurs."],
  ["Discipline", "Tenir les engagements pris, respecter l’organisation et rendre compte de ce qui est fait."],
  ["Héritage", "Préserver ce que la communauté bedjond a construit, pour le transmettre renforcé."],
];

export default function Home() {
  const idx = getIndex();
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const indicateurs = getIndicateurs();
  const c = indicateurs.contenu;
  const poles = idx.structure.poles;
  const prio = new Set(PRIORITAIRES.map((p) => p.id));
  const el = getElection();
  const vote = etape("vote");
  const mag = getMagazine().numeros[0];
  const postes = getPostes();
  const tr = getTransmissions();
  const lettres = Object.values(tr).reduce((n, t) => n + t.destinataires.length, 0);
  const envoyees = Object.values(tr).reduce((n, t) => n + t.destinataires.filter((d) => d.statut !== "a-signer").length, 0);
  const latest = idx.articles.slice(0, 4);
  const etapes = [
    ...["appel", "cloture", "liste", "vote", "resultats"].map((cle) => {
      const e = etape(cle);
      const quoi: Record<string, string> = {
        appel: "Appel à candidatures pour les vice-présidences de pôle",
        cloture: "Clôture des candidatures",
        liste: "Liste des candidats",
        vote: `Vote du collège : ${enLettres(el.poles.length)} vice-présidences`,
        resultats: "Résultats, au registre des décisions",
      };
      return { date: e.date, ...jourMois(e.date), quoi: quoi[cle], href: "/association/election-vice-presidences#calendrier" };
    }),
    ...(mag ? [{ date: "2027-01-01", jour: "Janv.", mois: "2027", quoi: `Magazine Lonodji n° ${mag.numero + 1}`, href: "/magazine" }] : []),
  ];

  return (
    <main id="main-content" className="accueil">
      {/* 1. La carte du pays bedjond, cliquable */}
      <section className="acc-hero" aria-labelledby="hero-title">
        <div className="acc-hero-texte">
          <h1 id="hero-title">L’association de Bédjondo et de sa diaspora.</h1>
          <p className="acc-hero-lead">
            Nous agissons pour l’eau, la santé, l’école, les routes et l’énergie de Bédjondo et de ses cantons, et nous gardons la langue, l’histoire et le patrimoine du peuple bedjond. Reconnue en 1995, l’association s’est remise en mouvement en 2026.
          </p>
          <div className="acc-hero-actions">
            <Link className="acc-bouton acc-bouton--plein" href="/participer">Nous rejoindre</Link>
            <Link className="acc-bouton" href="/programmes">Ce que nous faisons</Link>
          </div>
          <p className="acc-hero-carte-aide">
            <b>{fr(c.carte.localitesNommees)} localités, une fiche chacune.</b> Choisissez une unité sur la carte pour retrouver votre village, ou <Link href="/villages">cherchez-le par son nom</Link>.
          </p>
        </div>
        <CarteAccueil />
      </section>

      {/* 2. En ce moment */}
      <section className="acc-section acc-moment" aria-labelledby="moment-title">
        <div className="acc-tete">
          <h2 id="moment-title">En ce moment</h2>
          <p>{enLettres(el.poles.length, true)} vice-présidences de pôle à élire le {dateFr(vote.date, false)}, {enLettres(postes.length)} postes ouverts, et un magazine qui paraît chaque trimestre.</p>
        </div>
        <EnCeMoment etapes={etapes} />
        <div className="acc-duo">
          {mag ? (
            <a className="acc-mag" href={mag.pdf}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={apercu(mag.couverture)} alt="" width={800} height={1131} loading="lazy" decoding="async" />
              <span>
                <small>Magazine trimestriel · n° {mag.numero}, {mag.periode}</small>
                <strong>Lonodji : {mag.titre.toLowerCase().replace(/^./, (x) => x.toUpperCase())}</strong>
                <span>{mag.pages} pages à imprimer ou à faire circuler sur WhatsApp. Télécharger le PDF ({mag.taille}).</span>
              </span>
            </a>
          ) : null}
          <Link className="acc-postes" href="/participer#postes-ouverts">
            <strong>{enLettres(postes.length, true)} postes cherchent quelqu’un</strong>
            <span>Coordonner une thématique, en devenir l’adjoint, ou se présenter à une vice-présidence de pôle. Bénévole, au Tchad comme dans la diaspora.</span>
            <ul className="acc-postes-genres">
              {([["titulaire", "coordination", "coordinations"], ["adjoint", "adjoint ou adjointe", "adjoints ou adjointes"], ["vice-presidence", "vice-présidence de pôle", "vice-présidences de pôle"]] as const).map(([g, un, plus]) => {
                const n = postes.filter((x) => x.genre === g).length;
                return n ? <li key={g}><b>{n}</b> {n > 1 ? plus : un}</li> : null;
              })}
            </ul>
          </Link>
        </div>
      </section>

      {/* 3. Les pôles */}
      <section className="acc-section acc-poles" aria-labelledby="poles-title">
        <div className="acc-tete">
          <h2 id="poles-title">{enLettres(poles.length, true)} pôles, {enLettres(total)} thématiques</h2>
          <p>Chaque pôle a une vice-présidence élue, chaque thématique un coordonnateur ou une coordonnatrice. {filled} thématiques sur {total} sont pourvues ; les {enLettres(prio.size)} prioritaires portent nos dossiers de plaidoyer.</p>
        </div>
        <div className="acc-poles-grille">
          {poles.map((p) => (
            <article key={p.id} className="acc-pole">
              <span className="acc-pole-num" aria-hidden="true">{p.roman}</span>
              <h3><Link href={`/programmes#${p.id}`}><span className="sr-only">Pôle {p.roman} : </span>{p.name}</Link></h3>
              <p className="acc-pole-vp">{p.direction?.filled ? <>Vice-présidence : {p.direction.name}</> : <Link href="/association/election-vice-presidences">Vice-présidence à élire le {dateFr(vote.date, false)}</Link>}</p>
              <ul>
                {p.items.map((t) => (
                  <li key={t.id} className={t.filled ? "" : "vacant"}>
                    <span className="acc-them-num">{t.number}</span>
                    <span>{t.name}{prio.has(t.id) ? <em className="acc-prio"> prioritaire</em> : null}{t.filled ? null : <small> à pourvoir</small>}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="acc-liens"><Link href="/programmes">Toutes les thématiques et leurs coordonnateurs</Link><Link href="/association/propositions-organisation">Les décisions du 1er octobre 2026</Link><Link href="/programmes/fiches-de-mission">Les fiches de mission</Link></p>
      </section>

      {/* 4. Les plaidoyers */}
      <section className="acc-section acc-plaidoyers" aria-labelledby="plaidoyers-title">
        <div className="acc-tete">
          <h2 id="plaidoyers-title">{enLettres(idx.plaidoyers.length, true)} dossiers de plaidoyer pour Bédjondo</h2>
          <p>Sourcés, chiffrés, chacun avec ses destinataires nommés. {envoyees ? `${enLettres(envoyees, true)} lettres d’envoi sur ${lettres} sont parties.` : `Les ${lettres} lettres d’envoi sont prêtes et attendent la signature du bureau.`} Chaque envoi et chaque réponse seront datés.</p>
        </div>
        <ol className="acc-plaidoyers-liste">
          {idx.plaidoyers.map((p) => (
            <li key={p.id}>
              <Link href={p.href}><small>{p.theme}</small><strong>{p.title}</strong></Link>
            </li>
          ))}
        </ol>
        <p className="acc-liens"><Link href="/actions">Les plaidoyers et leur transmission</Link><Link href="/territoire/propositions-commune">Nos propositions à la commune</Link></p>
      </section>

      {/* 5. Le projet ODEB */}
      <section className="acc-section acc-odeb" aria-labelledby="odeb-title">
        <div className="acc-tete">
          <h2 id="odeb-title">Le projet ODEB LONODJI, vision 2030</h2>
          <p>{ODEB.formulation}</p>
        </div>
        <ul className="acc-odeb-programmes">
          {PROGRAMMES.map((p) => <li key={p.slug}><Link href={routeProgramme(p)}><span>{p.numero}</span>{p.nom}</Link></li>)}
        </ul>
        <p className="acc-liens acc-liens--clair"><Link href="/odeb">La vision 2030</Link><Link href="/odeb/livre-blanc">Le livre blanc</Link><Link href="/odeb/feuille-de-route">La feuille de route 2026-2030</Link></p>
      </section>

      {/* 6. Le journal */}
      <section className="acc-section acc-journal" aria-labelledby="journal-title">
        <div className="acc-tete">
          <h2 id="journal-title">Le journal</h2>
          <p>{idx.articles.length} articles depuis le 11 septembre 2026. Chaque fait est daté et sourcé ; chaque correction est publiée.</p>
        </div>
        <div className="acc-journal-grille">{latest.map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
        <p className="acc-liens"><Link href="/journal">Tous les articles</Link><Link href="/lettre">La lettre mensuelle</Link><Link href="/magazine">Le magazine Lonodji</Link></p>
      </section>

      {/* 7. Le territoire et la mémoire */}
      <section className="acc-section acc-pays" aria-labelledby="pays-title">
        <div className="acc-tete">
          <h2 id="pays-title">Le pays bedjond</h2>
          <p>Bédjondo, chef-lieu du Mandoul Occidental, ses cantons et sa diaspora ; une langue, le nangnda, et une histoire qui s’écrit avec ceux qui la connaissent.</p>
        </div>
        <div className="acc-pays-cols">
          <div>
            <h3>Le territoire</h3>
            <ul>
              <li><Link href="/villages"><strong>Les villages</strong><span>{fr(c.carte.localitesNommees)} fiches, ce que l’on sait et ce qui manque</span></Link></li>
              <li><Link href="/carte"><strong>La carte</strong><span>Quatorze unités, leurs localités et leurs équipements</span></Link></li>
              <li><Link href="/territoire/besoins"><strong>Signaler un besoin</strong><span>Un forage en panne, une école sans maître, un pont coupé</span></Link></li>
              <li><Link href="/territoire/gouvernance-locale"><strong>Qui décide quoi</strong><span>De la commune à l’État, et ce que nous demandons à chacun</span></Link></li>
            </ul>
          </div>
          <div>
            <h3>La mémoire</h3>
            <ul>
              <li><Link href="/histoire"><strong>L’histoire et les grandes figures</strong><span>Des chefs de canton aux fondateurs de l’association</span></Link></li>
              <li><Link href="/langue"><strong>La langue nangnda</strong><span>Un lexique à écouter et un dictionnaire qui commence par vos mots</span></Link></li>
              <li><Link href="/patrimoine/lieux-sacres"><strong>Lieux sacrés et généalogies</strong><span>Deux cahiers de terrain, rien de publié sans accord</span></Link></li>
              <li><Link href="/bibliotheque"><strong>La bibliothèque</strong><span>Quarante références sur les Bedjond et les Sara</span></Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Rendre des comptes */}
      <section className="acc-section acc-comptes impact" aria-labelledby="comptes-title">
        <div className="impact-intro">
          <h2 id="comptes-title">Ce qui est fait, et ce qui ne l’est pas encore</h2>
          <p>Six indicateurs datés et sourcés, {c.corrections} corrections publiées à découvert, une réponse sous quarante-huit heures ouvrées et un mécanisme de plainte, même anonyme.</p>
          <p className="acc-liens acc-liens--clair"><Link href="/impact">Le tableau de suivi</Link><Link href="/transparence">Notre charte de redevabilité</Link><Link href="/transparence/decisions">Le registre des décisions</Link></p>
        </div>
        <TableauDeBord donnees={indicateurs} mode="compact" />
      </section>

      {/* 9. Participer */}
      <section className="acc-section acc-participer" aria-labelledby="participer-title">
        <div className="acc-tete">
          <h2 id="participer-title">Une place pour chaque contribution</h2>
          <p>Nous répondons sous quarante-huit heures ouvrées, par le <Link className="lien-souligne" href="/participer#contact">formulaire</Link> ou au numéro de l’association, celui de son président, Adoumbé Maoura : <a className="lien-souligne" href={ORG.phoneHref}>{ORG.phone}</a>, appel et <a className="lien-souligne" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
        </div>
        <ul className="acc-participer-grille">
          <li><Link href="/participer#postes-ouverts"><strong>Prendre un poste</strong><span>{enLettres(postes.length, true)} postes ouverts : coordonner, seconder, présider un pôle.</span></Link></li>
          <li><Link href="/participer#adherer"><strong>Adhérer</strong><span>Déclarer son intention n’engage aucun argent : la collecte est suspendue.</span></Link></li>
          <li><Link href="/diaspora"><strong>Inscrire ses compétences</strong><span>Cinq minutes pour dire ce que vous savez faire, et n’être sollicité que pour cela.</span></Link></li>
          <li><Link href="/temoignages"><strong>Raconter Bédjondo</strong><span>Un récit, une photo, une voix : rien n’est publié sans votre relecture.</span></Link></li>
        </ul>
        <dl className="acc-valeurs">
          {VALEURS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
        </dl>
      </section>
    </main>
  );
}
