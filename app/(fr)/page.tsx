import type { Metadata } from "next";
import Appel from "@/components/appel";
import { alternatesLangues } from "@/lib/langues";
import Link from "@/components/lien";
import { ArticleCard } from "@/components/blocks";
import AccueilIndicateurs from "@/components/accueil-indicateurs";
import CarteAccueil from "@/components/carte-accueil";
import EnCeMoment from "@/components/en-ce-moment";
import { enLettres, filledCount, getIndex, ORG, thematiqueCount } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { PRIORITAIRES } from "@/lib/organisation";
import { aujourdhuiNdjamena, dateFr, etape, getElection, RECENSEMENT_ECHEANCE } from "@/lib/election";
import { getMagazine } from "@/lib/magazine";
import { getPostes } from "@/lib/postes";
import { getTransmissions } from "@/lib/transmissions";
import { apercu } from "@/lib/apercu";

/* Accueil : agir, suivre les actualités, consulter les preuves et retrouver le pays bedjond. */
const idx0 = getIndex();
export const metadata: Metadata = {
  description: `Depuis 1995, ADEB LONODJI est au service de tout le peuple bedjond, au Tchad et dans la diaspora : ${enLettres(idx0.structure.poles.length)} pôles, ${enLettres(thematiqueCount(idx0))} thématiques et ${enLettres(getIndicateurs().contenu.plaidoyers.publies)} dossiers de plaidoyer suivis publiquement.`,
  alternates: { canonical: "/", languages: alternatesLangues("/") },
};

const MOIS_COURTS = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const jourMois = (iso: string) => { const [, m, j] = iso.split("-").map(Number); return { jour: j === 1 ? "1er" : String(j), mois: MOIS_COURTS[m - 1] }; };
const fr = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ");

export default function Home() {
  const idx = getIndex();
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const indicateurs = getIndicateurs();
  const c = indicateurs.contenu;
  const genereLe = new Date(indicateurs.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const poles = idx.structure.poles;
  const prio = new Set(PRIORITAIRES.map((p) => p.id));
  const el = getElection();
  const recensementOuvert = aujourdhuiNdjamena() <= RECENSEMENT_ECHEANCE;
  const vote = etape("vote");
  const mag = getMagazine().numeros[0];
  const postes = getPostes();
  const tr = getTransmissions();
  const lettres = Object.values(tr).reduce((n, t) => n + t.destinataires.length, 0);
  const envoyees = Object.values(tr).reduce((n, t) => n + t.destinataires.filter((d) => d.statut !== "a-signer").length, 0);
  const dernier = idx.articles[0];
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
    // relance de l'association (compte rendu du bureau du 18 septembre 2026, chronogramme indicatif)
    { date: "2026-10-18", ...jourMois("2026-10-18"), quoi: "Fin du recensement des membres", href: "/participer/recensement" },
    { date: "2026-11-17", ...jourMois("2026-11-17"), quoi: "Projets de statuts, date de l’assemblée de relance", href: "/odeb/feuille-de-route#calendrier-bureau" },
    { date: "2026-12-17", ...jourMois("2026-12-17"), quoi: "Assemblée générale de relance, au plus tard", href: "/odeb/feuille-de-route#calendrier-bureau" },
    ...(mag ? [{ date: "2027-01-01", jour: "Janv.", mois: "2027", quoi: `Magazine Lonodji n° ${mag.numero + 1}`, href: "/magazine" }] : []),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main id="main-content" className="accueil accueil-court">
      <section className="acc-hero" aria-labelledby="hero-title">
        <div className="acc-hero-texte">
          <h1 id="hero-title">Tout le peuple bedjond.<span>Ensemble pour agir.</span></h1>
          <p className="acc-hero-lead">ADEB LONODJI est au service de tout le peuple bedjond, au Tchad et dans la diaspora. Nous documentons ses besoins et préservons son patrimoine.</p>
          <div className="acc-hero-actions">
            <Link className="acc-bouton acc-bouton--plein" href="/participer">Participer</Link>
            <Link className="acc-bouton" href="/territoire/besoins">Signaler un besoin</Link>
            <Link className="acc-bouton acc-bouton--texte" href="/impact">Voir les avancées</Link>
          </div>
          <p className="acc-hero-reperes">Depuis 1995 · {poles.length} pôles · {total} thématiques <Link href="/mission">Notre mission</Link></p>
        </div>
      </section>

      <section className="acc-section acc-moment" aria-labelledby="moment-title">
        <div className="acc-tete">
          <h2 id="moment-title">En ce moment</h2>
          <p>{enLettres(el.poles.length, true)} vice-présidences à élire le {dateFr(vote.date, false)}. {recensementOuvert ? <><Link href="/participer/recensement">Recensement des membres</Link> jusqu’au {dateFr(RECENSEMENT_ECHEANCE, false)}.</> : <><Link href="/participer/recensement">Recensement des membres</Link> : il reste ouvert.</>}</p>
        </div>
        <EnCeMoment etapes={etapes} />
        <div className="acc-actualites">
          {dernier ? <div className="acc-derniere"><small>Dernière actualité</small><ArticleCard a={dernier} /><Link className="acc-lien-direct" href="/journal">Tout le journal</Link></div> : null}
          <Link className="acc-postes" href="/participer#postes-ouverts"><small>Contribuer</small><strong>{enLettres(postes.length, true)} postes ouverts</strong><span>Coordonner une thématique, seconder son responsable ou présider un pôle.</span><span className="acc-lien-direct">Voir les missions et candidater</span></Link>
          {mag ? <a className="acc-mag" href={mag.pdf}><img src={apercu(mag.couverture)} alt="" width={800} height={1131} loading="lazy" decoding="async" /><span><small>Magazine · n° {mag.numero}, {mag.periode}</small><strong>Lonodji : {mag.titre}</strong><span>Télécharger le PDF · {mag.pages} pages · {mag.taille}</span></span></a> : null}
        </div>
      </section>

      <section className="acc-section acc-comptes impact" aria-labelledby="comptes-title">
        <div className="acc-tete"><h2 id="comptes-title">Des faits, des preuves.</h2><p>Ce qui est documenté, ce qui est publié et ce qui est confirmé résolu. Relevé du {genereLe}.</p></div>
        <AccueilIndicateurs donnees={indicateurs} />
        <p className="acc-liens acc-liens--clair"><Link href="/impact">Consulter le suivi complet et ses sources</Link><Link href="/transparence">Notre redevabilité</Link><Link href="/transparence/decisions">Les décisions du bureau</Link></p>
      </section>

      <section className="acc-section acc-poles" aria-labelledby="poles-title">
        <div className="acc-tete"><h2 id="poles-title">Nos priorités</h2><p>{enLettres(prio.size, true)} priorités actives dans {enLettres(total)} thématiques. {filled} thématiques ont un coordonnateur.</p></div>
        <ul className="acc-priorites">{poles.flatMap((p) => p.items.filter((t) => prio.has(t.id)).map((t) => <li key={t.id}><Link href={`/programmes#${t.id}`}>{t.name}</Link></li>))}</ul>
        <details className="acc-dossiers"><summary>Tous les dossiers de plaidoyer ({idx.plaidoyers.length})</summary><p>{envoyees ? `${envoyees} lettres d’envoi sur ${lettres} sont parties.` : `Les ${lettres} lettres d’envoi sont prêtes et attendent la signature du bureau.`} Chaque envoi et chaque réponse seront datés.</p><ol className="acc-plaidoyers-liste">{idx.plaidoyers.map((p) => <li key={p.id}><Link href={p.href}><small>{p.theme}</small><strong>{p.title}</strong></Link></li>)}</ol></details>
        <p className="acc-liens"><Link href="/programmes">Les {total} thématiques et leurs responsables</Link><Link href="/programmes/fiches-de-mission">Les fiches de mission</Link><Link href="/projets">Les projets et leur statut</Link><Link href="/territoire/propositions-commune">Nos propositions à la commune</Link></p>
      </section>

      <section className="acc-section acc-pays" aria-labelledby="pays-title">
        <div className="acc-tete"><h2 id="pays-title">Notre pays, notre mémoire.</h2><p>Le peuple bedjond, sa langue nangnda et une histoire à transmettre, au pays comme dans la diaspora.</p></div>
        <div className="acc-territoire">
          <div className="acc-carte-cadre"><h3>Retrouver son village</h3><p>{fr(c.carte.localitesNommees)} localités nommées, dans {c.carte.unites} unités.</p><CarteAccueil /><Link className="acc-bouton acc-bouton--plein" href="/villages">Chercher un village</Link></div>
          <div className="acc-memoire"><Link href="/histoire"><strong>L’histoire et les grandes figures</strong><span>Des chefs de canton aux fondateurs de l’association.</span></Link><Link href="/langue"><strong>La langue nangnda</strong><span>Un lexique à écouter et un dictionnaire à enrichir.</span></Link><Link href="/bibliotheque"><strong>La bibliothèque</strong><span>Lire les documents et leurs sources.</span></Link><Link href="/temoignages"><strong>Transmettre un récit, une photo, une voix</strong><span>Votre accord et votre relecture précèdent toute publication.</span></Link><p className="acc-liens"><Link href="/carte">La carte détaillée</Link><Link href="/territoire/gouvernance-locale">Qui décide quoi</Link><Link href="/patrimoine/lieux-sacres">Lieux sacrés et généalogies</Link></p></div>
        </div>
      </section>

      <section className="acc-section acc-odeb" aria-labelledby="odeb-title">
        <div className="acc-fin">
          <div><h2 id="odeb-title">Préparer demain.</h2><p>Le projet ODEB LONODJI propose une vision 2030 pour le pays bedjond. Les propositions et les étapes restent ouvertes à la discussion.</p><p className="acc-liens acc-liens--clair"><Link href="/odeb">Vision 2030</Link><Link href="/odeb/livre-blanc">Le livre blanc</Link><Link href="/odeb/feuille-de-route">La feuille de route</Link></p></div>
          <div><h3>Chacun peut contribuer.</h3><ul className="acc-contribuer"><li><Link href="/participer#adherer">Adhérer · déclarer son intention sans paiement</Link></li><li><Link href="/diaspora">Proposer ses compétences</Link></li><li><Link href="/association/ong-partenaires">Préparer un partenariat</Link></li><li><Link href="/observatoire">Consulter les données et les sources</Link></li></ul><p>Une réponse sous quarante-huit heures ouvrées : <Link href="/participer#contact">nous écrire</Link>, <Appel texte="appel" /> ou <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p></div>
        </div>
        <p className="acc-devise">Courage · Discipline · Héritage</p>
      </section>
    </main>
  );
}
