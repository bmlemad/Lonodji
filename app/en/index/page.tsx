import type { Metadata } from "next";
import Link from "@/components/lien";
import CarteAccueil from "@/components/carte-accueil";
import EnCeMoment from "@/components/en-ce-moment";
import { filledCount, getIndex, getPage, metaDescription, ogFor, ORG, thematiqueCount } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { getIndicateurs } from "@/lib/indicateurs";
import { PRIORITAIRES } from "@/lib/organisation";
import { etape, getElection } from "@/lib/election";
import { getMagazine } from "@/lib/magazine";
import { getPostes } from "@/lib/postes";
import { getTransmissions } from "@/lib/transmissions";
import { dateEn, inWordsEn, nomsEn } from "@/lib/structure-en";
import { apercu } from "@/lib/apercu";

/* English home (1 October 2026), same layout as the French home (app/(fr)/page.tsx): clickable map of the Bedjond
   country, what is happening now, the six pillars, the advocacy briefs, the dashboard and how to help. Pillar and
   theme names come from the English themes page; figures from content/. */
const ROUTE = "/en/index";
const legacy = getPage("en/index");
export const metadata: Metadata = {
  title: { absolute: "ADEB LONODJI — the association of Bédjondo and its diaspora" },
  description: metaDescription(legacy.description || legacy.lede),
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE, "en"), title: "ADEB LONODJI — the association of Bédjondo and its diaspora" },
};

const BRIEFS_EN: Record<string, string> = {
  "plaidoyer-internet": "Broadband internet", "plaidoyer-electricite": "Electricity", "plaidoyer-commune": "Note to the commune",
  "plaidoyer-eau": "Drinking water", "plaidoyer-sante": "Health", "plaidoyer-routes": "Roads and bridges",
  "plaidoyer-education": "Education", "plaidoyer-formation-pro": "Vocational training",
};
const VALUES: [string, string][] = [
  ["Courage", "Facing the community’s challenges without waiting for a solution to come from elsewhere."],
  ["Discipline", "Keeping our commitments, respecting our organisation and reporting on what is done."],
  ["Heritage", "Preserving what the Bedjond community has built, and passing it on stronger."],
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export default function HomeEn() {
  const idx = getIndex();
  const { piliers, themes } = nomsEn();
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
  const steps: Record<string, string> = {
    appel: "Call for candidates for the pillar vice-presidencies", cloture: "Candidacies close", liste: "List of candidates",
    vote: `College vote: ${inWordsEn(el.poles.length)} vice-presidencies`, resultats: "Results, in the register of decisions",
  };
  const etapes = [
    ...Object.keys(steps).map((cle) => { const e = etape(cle); const [, m, j] = e.date.split("-").map(Number); return { date: e.date, jour: String(j), mois: MONTHS[m - 1], quoi: steps[cle], href: "/en/election#calendar" }; }),
    ...(mag ? [{ date: "2027-01-01", jour: "Jan", mois: "2027", quoi: `Lonodji magazine no. ${mag.numero + 1} (in French)`, href: "/magazine" }] : []),
  ];
  const genres = [["titulaire", "lead", "leads"], ["adjoint", "deputy", "deputies"], ["vice-presidence", "pillar vice-presidency", "pillar vice-presidencies"]] as const;

  return (
    <main id="main-content" className="accueil" lang="en">
      <section className="acc-hero" aria-labelledby="hero-title">
        <div className="acc-hero-texte">
          <h1 id="hero-title">The association of Bédjondo and its diaspora.</h1>
          <p className="acc-hero-lead">
            We work for water, health, schools, roads and energy in Bédjondo, in southern Chad, and its cantons, and we safeguard the language, history and heritage of the Bedjond people. Officially recognised in 1995, the association was relaunched in 2026.
          </p>
          <div className="acc-hero-actions">
            <Link className="acc-bouton acc-bouton--plein" href="/en/contact">Join us</Link>
            <Link className="acc-bouton" href="/en/organisation">How we are organised</Link>
          </div>
          <p className="acc-hero-carte-aide">
            <b>{fmt(c.carte.localitesNommees)} localities, one record each.</b> Choose a unit on the map to find your village (records in French), or <Link href="/en/villages">read about the villages in English</Link>.
          </p>
        </div>
        <CarteAccueil lang="en" />
      </section>

      <section className="acc-section acc-moment" aria-labelledby="moment-title">
        <div className="acc-tete">
          <h2 id="moment-title">Right now</h2>
          <p>{inWordsEn(el.poles.length, true)} pillar vice-presidents to elect on {dateEn(vote.date, false)}, {inWordsEn(postes.length)} open posts, and a magazine published every quarter.</p>
        </div>
        <EnCeMoment etapes={etapes} prochaine="Next step" />
        <div className="acc-duo">
          {mag ? (
            <a className="acc-mag" href={mag.pdf} hrefLang="fr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={apercu(mag.couverture)} alt="" width={800} height={1131} loading="lazy" decoding="async" />
              <span>
                <small>Quarterly magazine · no. {mag.numero}, October 2026 · in French</small>
                <strong>Lonodji: six pillars, seven priorities</strong>
                <span>{mag.pages} pages to print or share on WhatsApp. Download the PDF ({mag.taille.replace(",", ".").replace("Mo", "MB")}).</span>
              </span>
            </a>
          ) : null}
          <Link className="acc-postes" href="/en/organisation#priorities">
            <strong>{inWordsEn(postes.length, true)} posts are looking for someone</strong>
            <span>Lead a theme, be its deputy, or stand for a pillar vice-presidency. Voluntary, in Chad or in the diaspora.</span>
            <ul className="acc-postes-genres">
              {genres.map(([g, one, many]) => { const n = postes.filter((x) => x.genre === g).length; return n ? <li key={g}><b>{n}</b> {n > 1 ? many : one}</li> : null; })}
            </ul>
          </Link>
        </div>
      </section>

      <section className="acc-section acc-poles" aria-labelledby="poles-title">
        <div className="acc-tete">
          <h2 id="poles-title">{inWordsEn(poles.length, true)} pillars, {inWordsEn(total)} themes</h2>
          <p>Each pillar has an elected vice-president, each theme a coordinator. {filled} of {total} themes have one; the {inWordsEn(prio.size)} priority themes carry our advocacy briefs.</p>
        </div>
        <div className="acc-poles-grille">
          {poles.map((p) => (
            <article key={p.id} className="acc-pole">
              <span className="acc-pole-num" aria-hidden="true">{p.roman}</span>
              <h3><Link href="/en/themes"><span className="sr-only">Pillar {p.roman}: </span>{piliers[p.roman] ?? p.name}</Link></h3>
              <p className="acc-pole-vp">{p.direction?.filled ? <>Vice-president: {p.direction.name}</> : <Link href="/en/election">Vice-president to be elected on {dateEn(vote.date, false)}</Link>}</p>
              <ul>
                {p.items.map((t) => (
                  <li key={t.id} className={t.filled ? "" : "vacant"}>
                    <span className="acc-them-num">{t.number}</span>
                    <span>{themes[t.number] ?? t.name}{prio.has(t.id) ? <em className="acc-prio"> priority</em> : null}{t.filled ? null : <small> open</small>}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="acc-liens"><Link href="/en/themes">All themes and their coordinators</Link><Link href="/en/organisation">The decisions of 1 October 2026</Link><Link href="/en/sectors">Our work in donors’ sectors</Link></p>
      </section>

      <section className="acc-section acc-plaidoyers" aria-labelledby="plaidoyers-title">
        <div className="acc-tete">
          <h2 id="plaidoyers-title">{inWordsEn(idx.plaidoyers.length, true)} advocacy briefs for Bédjondo</h2>
          <p>Sourced and costed, each with named recipients. The {lettres} cover letters are ready and await the board’s signature; each dispatch and each reply will be dated.</p>
        </div>
        <ol className="acc-plaidoyers-liste">
          {idx.plaidoyers.map((p) => (
            <li key={p.id}><Link href="/en/advocacy"><small>Advocacy brief</small><strong>{BRIEFS_EN[p.id] ?? p.title}</strong></Link></li>
          ))}
        </ol>
        <p className="acc-liens"><Link href="/en/advocacy">Our advocacy, in English</Link><Link href="/en/commune">Proposals to the commune</Link><Link href="/en/donors">Donor programmes in Chad</Link></p>
      </section>

      <section className="acc-section acc-comptes impact" aria-labelledby="comptes-title">
        <div className="impact-intro">
          <h2 id="comptes-title">What is done, and what is not yet</h2>
          <p>Dated, sourced indicators, {c.corrections} corrections published openly, a reply within 48 working hours and a complaints mechanism, even anonymous.</p>
          <p className="acc-liens acc-liens--clair"><Link href="/en/impact">The impact dashboard</Link><Link href="/en/about">About the association</Link><Link href="/en/odeb">The ODEB LONODJI vision</Link></p>
        </div>
        <dl className="acc-chiffres">
          <div><dt>Theme coordinators</dt><dd><b>{c.coordinations.pourvues}</b> of {c.coordinations.total}</dd></div>
          <div><dt>Pillar vice-presidents</dt><dd><b>{c.coordinations.directionsPourvues}</b> of {c.coordinations.directionsTotal}</dd></div>
          <div><dt>Advocacy briefs</dt><dd><b>{c.plaidoyers.publies}</b> published, {c.plaidoyers.envoyes} sent, {c.plaidoyers.reponses} replies</dd></div>
          <div><dt>Local problems documented</dt><dd><b>{c.problematiques.documentees}</b> of {c.problematiques.total}; {c.problematiques.inconnues} still unknown</dd></div>
          <div><dt>Localities on the map</dt><dd><b>{fmt(c.carte.localitesNommees)}</b> named, in {c.carte.unites} units</dd></div>
          <div><dt>Corrections published</dt><dd><b>{c.corrections}</b>, each dated</dd></div>
        </dl>
      </section>

      <section className="acc-section acc-participer" aria-labelledby="participer-title">
        <div className="acc-tete">
          <h2 id="participer-title">A place for every contribution</h2>
          <p>We reply within 48 working hours, by the <Link className="lien-souligne" href="/en/contact">contact form</Link> or on the association’s number, that of its president, Adoumbé Maoura: <a className="lien-souligne" href={ORG.phoneHref}>{ORG.phone}</a>, calls and <a className="lien-souligne" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
        </div>
        <ul className="acc-participer-grille">
          <li><Link href="/en/organisation#priorities"><strong>Take on a post</strong><span>{inWordsEn(postes.length, true)} open posts: lead, deputise, chair a pillar.</span></Link></li>
          <li><Link href="/en/contact"><strong>Join the association</strong><span>Declaring your intention commits no money: fundraising is suspended.</span></Link></li>
          <li><Link href="/diaspora" hrefLang="fr"><strong>List your skills</strong><span>Five minutes to say what you can do, and be asked only for that (form in French).</span></Link></li>
          <li><Link href="/en/villages"><strong>Find your village</strong><span>{fmt(c.carte.localitesNommees)} localities, what is known and what is missing.</span></Link></li>
        </ul>
        <dl className="acc-valeurs">
          {VALUES.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
        </dl>
      </section>
    </main>
  );
}
