import type { Metadata } from "next";
import { ArticleCard } from "@/components/blocks";
import AccueilIndicateurs from "@/components/accueil-indicateurs";
import Appel from "@/components/appel";
import Link from "@/components/lien";
import CarteAccueil from "@/components/carte-accueil";
import EnCeMoment from "@/components/en-ce-moment";
import { filledCount, getIndex, ogFor, ORG, thematiqueCount } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { getIndicateurs } from "@/lib/indicateurs";
import { PRIORITAIRES } from "@/lib/organisation";
import { aujourdhuiNdjamena, etape, getElection, RECENSEMENT_ECHEANCE } from "@/lib/election";
import { getMagazine } from "@/lib/magazine";
import { getPostes } from "@/lib/postes";
import { getTransmissions } from "@/lib/transmissions";
import { dateEn, inWordsEn, nomsEn } from "@/lib/structure-en";
import { apercu } from "@/lib/apercu";

/* English home mirrors the shortened French home. */
const ROUTE = "/en/index";
export const metadata: Metadata = {
  title: { absolute: "ADEB LONODJI — serving all Bedjond people" },
  description: "ADEB LONODJI serves all Bedjond people, in Bédjondo, elsewhere in Chad and across the diaspora: local development, advocacy and Bedjond heritage.",
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: "ADEB LONODJI — serving all Bedjond people" },
};

const BRIEFS_EN: Record<string, string> = {
  "plaidoyer-internet": "Broadband internet", "plaidoyer-electricite": "Electricity", "plaidoyer-commune": "Note to the commune",
  "plaidoyer-eau": "Drinking water", "plaidoyer-sante": "Health", "plaidoyer-routes": "Roads and bridges",
  "plaidoyer-education": "Education", "plaidoyer-formation-pro": "Vocational training",
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export default function HomeEn() {
  const idx = getIndex();
  const { themes } = nomsEn();
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const indicateurs = getIndicateurs();
  const c = indicateurs.contenu;
  const genereLe = new Date(indicateurs.genere).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const dernier = idx.articles[0];
  const poles = idx.structure.poles;
  const prio = new Set(PRIORITAIRES.map((p) => p.id));
  const el = getElection();
  const recensementOuvert = aujourdhuiNdjamena() <= RECENSEMENT_ECHEANCE;
  const vote = etape("vote");
  const mag = getMagazine().numeros[0];
  const postes = getPostes();
  const tr = getTransmissions();
  const lettres = Object.values(tr).reduce((n, t) => n + t.destinataires.length, 0);
  const steps: Record<string, string> = {
    appel: "Call for candidates for the pillar vice-presidencies", cloture: "Candidacies close", liste: "List of candidates",
    vote: `College vote: ${inWordsEn(el.poles.length)} vice-presidencies`, resultats: "Results, in the register of decisions",
  };
  const etapes = [
    ...Object.keys(steps).map((cle) => { const e = etape(cle); const [, m, j] = e.date.split("-").map(Number); return { date: e.date, jour: String(j), mois: MONTHS[m - 1], quoi: steps[cle], href: "/en/election#calendar" }; }),
    // relaunch of the association (executive board, 18 September 2026, indicative timetable)
    { date: "2026-10-18", jour: "18", mois: MONTHS[9], quoi: "Member census closes (form in French)", href: "/participer/recensement" },
    { date: "2026-11-17", jour: "17", mois: MONTHS[10], quoi: "Draft statutes; date of the relaunch general assembly", href: "/en/organisation#decisions" },
    { date: "2026-12-17", jour: "17", mois: MONTHS[11], quoi: "Relaunch general assembly, at the latest", href: "/en/organisation#decisions" },
    ...(mag ? [{ date: "2027-01-01", jour: "Jan", mois: "2027", quoi: `Lonodji magazine no. ${mag.numero + 1} (in French)`, href: "/magazine" }] : []),
  ].sort((a, b) => a.date.localeCompare(b.date));


  return (
    <main id="main-content" className="accueil accueil-court" lang="en">
      <section className="acc-hero" aria-labelledby="hero-title">
        <div className="acc-hero-texte">
          <h1 id="hero-title">All Bedjond people.<span>Acting together.</span></h1>
          <p className="acc-hero-lead">ADEB LONODJI serves all Bedjond people, in Chad and across the diaspora. We document their needs and preserve their heritage.</p>
          <div className="acc-hero-actions"><Link className="acc-bouton acc-bouton--plein" href="/en/contact">Get involved</Link><Link className="acc-bouton" href="/territoire/besoins" hrefLang="fr">Report a need (French)</Link><Link className="acc-bouton acc-bouton--texte" href="/en/impact">See progress</Link></div>
          <p className="acc-hero-reperes">Since 1995 · {poles.length} pillars · {total} themes <Link href="/en/about">Our mission</Link></p>
        </div>
      </section>

      <section className="acc-section acc-moment" aria-labelledby="moment-title">
        <div className="acc-tete"><h2 id="moment-title">Right now</h2><p>{inWordsEn(el.poles.length, true)} pillar vice-presidents to elect on {dateEn(vote.date, false)}. {recensementOuvert ? <><Link href="/participer/recensement" hrefLang="fr">Member census (French)</Link> until {dateEn(RECENSEMENT_ECHEANCE, false)}.</> : <><Link href="/participer/recensement" hrefLang="fr">Member census (French)</Link>: still open.</>}</p></div>
        <EnCeMoment etapes={etapes} prochaine="Next step" calendrier="View the full calendar" />
        <div className="acc-actualites">
          {dernier ? <div className="acc-derniere" lang="fr"><small lang="en">Latest news · in French</small><ArticleCard a={dernier} /><Link className="acc-lien-direct" href="/journal" hrefLang="fr" lang="en">All news (French)</Link></div> : null}
          <Link className="acc-postes" href="/en/organisation#priorities"><small>Get involved</small><strong>{inWordsEn(postes.length, true)} open posts</strong><span>Lead a theme, support its coordinator or chair a pillar.</span><span className="acc-lien-direct">Explore the roles</span></Link>
          {mag ? <a className="acc-mag" href={mag.pdf} hrefLang="fr"><img src={apercu(mag.couverture)} alt="" width={800} height={1131} loading="lazy" decoding="async" /><span><small>Magazine · no. {mag.numero} · in French</small><strong lang="fr">Lonodji : {mag.titre}</strong><span>Download the PDF · {mag.pages} pages · {mag.taille.replace(",", ".").replace("Mo", "MB")}</span></span></a> : null}
        </div>
      </section>

      <section className="acc-section acc-comptes impact" aria-labelledby="comptes-title">
        <div className="acc-tete"><h2 id="comptes-title">Facts and evidence.</h2><p>What is documented, published and confirmed resolved. Snapshot dated {genereLe}.</p></div>
        <AccueilIndicateurs donnees={indicateurs} lang="en" />
        <p className="acc-liens acc-liens--clair"><Link href="/en/impact">Full progress report and sources</Link><Link href="/en/about">About the association</Link><Link href="/en/organisation">Board decisions</Link></p>
      </section>

      <section className="acc-section acc-poles" aria-labelledby="poles-title">
        <div className="acc-tete"><h2 id="poles-title">Our priorities</h2><p>{inWordsEn(prio.size, true)} active priorities across {inWordsEn(total)} themes. {filled} themes have a coordinator.</p></div>
        <ul className="acc-priorites">{poles.flatMap((p) => p.items.filter((t) => prio.has(t.id)).map((t) => <li key={t.id}><Link href="/en/themes">{themes[t.number] ?? t.name}</Link></li>))}</ul>
        <details className="acc-dossiers"><summary>All advocacy briefs ({idx.plaidoyers.length})</summary><p>The {lettres} cover letters are ready and await the board’s signature. Each dispatch and each reply will be dated.</p><ol className="acc-plaidoyers-liste">{idx.plaidoyers.map((p) => <li key={p.id}><Link href="/en/advocacy"><small>Advocacy brief</small><strong>{BRIEFS_EN[p.id] ?? p.title}</strong></Link></li>)}</ol></details>
        <p className="acc-liens"><Link href="/en/themes">All themes and coordinators</Link><Link href="/en/sectors">Our fields of work</Link><Link href="/en/projects">Projects and their status</Link><Link href="/en/commune">Proposals to the commune</Link></p>
      </section>

      <section className="acc-section acc-pays" aria-labelledby="pays-title">
        <div className="acc-tete"><h2 id="pays-title">Our country, our memory.</h2><p>The Bedjond people, their Nangnda language and a history to pass on, at home and across the diaspora.</p></div>
        <div className="acc-territoire"><div className="acc-carte-cadre"><h3>Find your village</h3><p>{fmt(c.carte.localitesNommees)} named localities, in {c.carte.unites} units.</p><CarteAccueil lang="en" /><Link className="acc-bouton acc-bouton--plein" href="/en/villages">Explore the villages</Link></div><div className="acc-memoire"><Link href="/en/about"><strong>History and heritage</strong><span>The association’s origins and the Bedjond people.</span></Link><Link href="/langue" hrefLang="fr"><strong>The Nangnda language</strong><span>Listen to the lexicon and contribute words (French).</span></Link><Link href="/bibliotheque" hrefLang="fr"><strong>The library</strong><span>Read the documents and their sources (French).</span></Link><Link href="/temoignages" hrefLang="fr"><strong>Share a story, a photograph or a voice</strong><span>Your consent and review come before publication (form in French).</span></Link><p className="acc-liens"><Link href="/carte" hrefLang="fr">Detailed map (French)</Link><Link href="/en/governance">Who decides what</Link><Link href="/patrimoine/lieux-sacres" hrefLang="fr">Sacred sites and genealogies (French)</Link></p></div></div>
      </section>

      <section className="acc-section acc-odeb" aria-labelledby="odeb-title">
        <div className="acc-fin"><div><h2 id="odeb-title">Preparing tomorrow.</h2><p>The ODEB LONODJI project proposes a 2030 vision for Bedjond country. The proposals and next steps remain open for discussion.</p><p className="acc-liens acc-liens--clair"><Link href="/en/odeb">Vision 2030</Link><Link href="/odeb/livre-blanc" hrefLang="fr">White paper (French)</Link><Link href="/odeb/feuille-de-route" hrefLang="fr">Roadmap (French)</Link></p></div><div><h3>Everyone can contribute.</h3><ul className="acc-contribuer"><li><Link href="/en/contact">Join · declare your interest without payment</Link></li><li><Link href="/diaspora" hrefLang="fr">Offer your skills (French)</Link></li><li><Link href="/en/contact">Discuss a partnership</Link></li><li><Link href="/observatoire" hrefLang="fr">Explore data and sources (French)</Link></li></ul><p>A reply within 48 working hours: <Link href="/en/contact">write to us</Link>, <Appel texte="call" en /> or <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p></div></div>
        <p className="acc-devise">Courage · Discipline · Heritage</p>
      </section>
    </main>
  );
}
