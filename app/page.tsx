import Link from "@/components/lien";
import { ArticleCard } from "../components/blocks";
import TableauDeBord from "../components/tableau-de-bord";
import { enLettres, filledCount, getIndex, getPage, ORG, thematiqueCount } from "../lib/content";
import { getIndicateurs } from "../lib/indicateurs";
import { IDENTITE, ODEB, PROGRAMMES, routeProgramme } from "../lib/odeb";

const values = [
  ["01", "Courage", "Oser agir, prendre des responsabilités et avancer avec détermination, y compris quand il faut dire ce qui manque."],
  ["02", "Discipline", "Transformer les intentions en actions concrètes, régulières et durables : une thématique, un coordonnateur, un compte rendu."],
  ["03", "Héritage", "Transmettre la langue, l’histoire et les valeurs du peuple bedjond aux générations qui viennent."],
];

const participer = (vacantes: number) => [
  ["01", "Rejoindre ou coordonner une thématique", `${enLettres(vacantes, true)} thématiques cherchent leur coordonnateur. Une compétence ponctuelle suffit souvent à faire avancer un dossier déjà prêt.`, "/participer?coordo=1#contact"],
  ["02", "Adhérer à l’association", "Déclarer son intention d’adhérer n’engage aucun argent : la collecte est suspendue jusqu’à l’ouverture d’un compte au nom de l’association.", "/participer#adherer"],
  ["03", "Inscrire ses compétences au répertoire de la diaspora", "Médecin, enseignante, ingénieur, juriste, informaticienne : cinq minutes pour dire ce que vous savez faire, et n’être sollicité que pour cela.", "/diaspora"],
  ["04", "Raconter Bédjondo : un récit, une photo, une voix", "Un ancien qui raconte, une femme qui fait bouger les choses, un jeune talent, un paysage, une photo des forums de 2000 et 2003 : rien n’est publié sans votre relecture.", "/temoignages"],
];

export default function Home() {
  const idx = getIndex();
  const total = thematiqueCount(idx);
  const filled = filledCount(idx);
  const latest = idx.articles.slice(0, 3);
  const indicateurs = getIndicateurs();
  const corrections = (getPage("redevabilite").sections.find((s) => s.id === "corrections")?.html.match(/class="info-card"/g) || []).length;
  return (
    <>
      <main id="main-content">
        {/* Héros : la silhouette réelle du pays bedjond tient lieu de bannière tant que la
            banque d'images est vide (voir /temoignages). Quand une photographie existera,
            elle prendra la place de .hero-visual, le reste ne bouge pas. */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Association • Bédjondo • Diaspora</p>
            <h1 id="hero-title">Construire aujourd’hui.<br /><em>Transmettre demain.</em></h1>
            <p className="hero-text">
              ADEB LONODJI est l’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond.
              Reconnue en 1995, remise en mouvement en 2026 : quatre pôles, vingt thématiques, huit dossiers de plaidoyer publiés pour l’eau, l’électricité, l’école, les routes et la santé — et un territoire cartographié village par village.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/programmes">Découvrir nos actions <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/participer">Rejoindre une thématique <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img className="hero-territoire" src="/carte/territoire.svg" alt="" width={1000} height={727} decoding="async" fetchPriority="high" />
            <div className="hero-card">
              <div className="glass-card">
                <span className="card-kicker">Où nous en sommes</span>
                <strong>{filled} thématiques pourvues sur {total}. {total - filled} cherchent leur coordonnateur.</strong>
                <ul className="card-faits">
                  <li><b>{indicateurs.contenu.plaidoyers.publies}</b> dossiers de plaidoyer publiés</li>
                  <li><b>{new Intl.NumberFormat("fr-FR").format(indicateurs.contenu.carte.localites)}</b> localités cartographiées</li>
                  <li><b>{indicateurs.contenu.corrections}</b> corrections publiées à découvert</li>
                </ul>
                <div className="mini-line" />
                <span className="card-note">{ORG.motto}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="mission" className="intro section" aria-labelledby="mission-title">
          <div>
            <p className="eyebrow">01 — Notre mission</p>
            <h2 id="mission-title">Agir pour Bédjondo, garder la mémoire bedjond.</h2>
          </div>
          <div>
            <p className="lead">
              Nos actions de développement — l’eau, la santé, l’école, les routes — servent tous les habitants de Bédjondo, sans distinction d’origine.
              La sauvegarde de la langue, de l’histoire et du patrimoine du peuple bedjond reste au cœur de notre objet.
            </p>
            <div className="home-facts">
              <article><strong>1995</strong><span>Reconnaissance officielle, après dix ans de réflexion engagée en 1986.</span></article>
              <article><strong>2026</strong><span>Réactivation et structuration en pôles et thématiques, quarante ans après.</span></article>
              <article><strong>{idx.articles.length}</strong><span>articles publiés au journal depuis le 11 septembre 2026.</span></article>
            </div>
            <div className="section-actions"><Link className="text-link" href="/mission">Lire notre mission ↗</Link></div>
          </div>
        </section>

        <section id="actualites" className="section home-news" aria-labelledby="news-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">02 — Dernières actualités</p>
              <h2 id="news-title">Ce que nous<br /><em>venons de publier.</em></h2>
            </div>
            <p>Le journal date ses faits et cite ses sources. Chaque correction de fait est publiée, datée, dans le journal des corrections.</p>
          </div>
          <div className="art-grid">{latest.map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
          <div className="section-actions"><Link className="text-link" href="/journal">Tous les articles ↗</Link></div>
        </section>

        <section id="odeb" className="section od-band" aria-labelledby="odeb-title">
          <div>
            <img className="od-band-embleme" src={IDENTITE.superposable} alt="" width={140} height={140} loading="lazy" decoding="async" />
            <p className="eyebrow">03 — Vision 2030</p>
            <h2 id="odeb-title">Projet ODEB LONODJI.<br /><em>D’une association à un outil permanent.</em></h2>
            <p className="od-band-note"><b>1986 → 2026.</b> Pour les quarante ans de ses fondations, l’association a lancé le {ODEB.presenteLabel} la réflexion ODEB LONODJI : six missions, six programmes, un livre blanc en version de travail. <Link href={ODEB.article}>L’article du jour →</Link></p>
          </div>
          <div>
            <p className="lead od-band-lead">{ODEB.formulation}</p>
            <ul className="od-band-programmes">
              {PROGRAMMES.map((p) => <li key={p.slug}><Link href={routeProgramme(p)}><span>{p.numero}</span>{p.nom}</Link></li>)}
            </ul>
            <div className="section-actions od-band-actions">
              <Link className="button primary" href="/odeb">La vision 2030 <span aria-hidden="true">↗</span></Link>
              <Link className="button secondary" href="/odeb/livre-blanc">Le livre blanc <span aria-hidden="true">→</span></Link>
              <Link className="text-link" href="/odeb/feuille-de-route">Feuille de route 2026-2030 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section id="programmes" className="programmes section" aria-labelledby="programmes-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">04 — Nos actions</p>
              <h2 id="programmes-title">Quatre pôles.<br /><em>Vingt thématiques.</em></h2>
            </div>
            <p>
              Chaque pôle est dirigé par un directeur ou une directrice de pôle, au rang de chef de projet ; chaque thématique est animée par un coordonnateur, avance à son rythme et rend compte publiquement. Deux cellules transversales — financement et communication — appuient l’ensemble.
            </p>
          </div>
          <div className="program-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            {idx.structure.poles.map((pole) => (
              <Link className="program-card" href={`/programmes#${pole.id}`} key={pole.id}>
                <div className="card-top"><span>Pôle {pole.roman}</span><small>{pole.items.filter((t) => t.filled).length}/{pole.items.length} pourvues{pole.direction && !pole.direction.filled ? " · direction à pourvoir" : ""}</small></div>
                <div className="program-body">
                  <h3 style={{ fontSize: 28 }}>{pole.name}</h3>
                  <p>{pole.items.slice(0, 3).map((t) => t.name).join(" · ")}{pole.items.length > 4 ? ` · et ${pole.items.length - 3} autres thématiques` : pole.items.length === 4 ? " · et 1 autre thématique" : ""}</p>
                </div>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="plaidoyers" className="territory section" aria-labelledby="plaidoyers-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">05 — Plaidoyers</p>
              <h2 id="plaidoyers-title">Sept plaidoyers,<br /><em>une note à la commune.</em></h2>
            </div>
            <p>Sourcés, chiffrés, adressés à des destinataires nommés et suivis publiquement : ce que nous demandons pour Bédjondo et ses cantons.</p>
          </div>
          <div className="link-list">
            {idx.plaidoyers.map((p) => (
              <Link key={p.id} href={`/actions#${p.id}`}><small>{p.theme} · {p.status}</small><strong>{p.title}</strong><span>{p.demand}</span></Link>
            ))}
          </div>
          <div className="section-actions"><Link className="text-link" href="/actions">Tous les plaidoyers et leur suivi ↗</Link></div>
        </section>

        <section id="territoire" className="section heritage" aria-labelledby="territory-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">06 — Territoire</p>
              <h2 id="territory-title">Comprendre le terrain.<br /><em>Agir avec précision.</em></h2>
            </div>
            <p>Bédjondo, chef-lieu du Mandoul Occidental, village devenu ville. Le pays bedjond compte sept sous-préfectures au cœur, des présences dans le Logone Oriental et une diaspora agricole au Moyen-Chari.</p>
          </div>
          <div className="link-list">
            <Link href="/villages"><small>Retrouver son village</small><strong>966 localités, une fiche chacune</strong><span>Ce que les données ouvertes en savent, ce que le site en dit, ce qui reste à documenter — et le formulaire pour le faire.</span></Link>
            <Link href="/carte"><small>Carte du territoire</small><strong>Le pays bedjond, village par village</strong><span>Quatorze unités, leurs localités et équipements connus des données ouvertes ; une fiche par lieu, un bouton pour signaler.</span></Link>
            <Link href="/dossiers/bedjondo"><small>Bédjondo</small><strong>Repères, langue, statut de commune</strong><span>Avec la carte interactive du pays bedjond, sur contours administratifs vérifiés.</span></Link>
            <Link href="/dossiers/problematiques"><small>Diagnostic territorial</small><strong>Les problématiques documentées</strong><span>Eau, électricité, santé, école, routes, réseau : classées par domaine et reliées à leur thématique.</span></Link>
            <Link href="/dossiers/besoins"><small>Carte des besoins</small><strong>Signaler un besoin, localité par localité</strong><span>Un forage en panne, une école sans maître, un pont coupé.</span></Link>
            <Link href="/dossiers/enquetes"><small>Enquêtes de terrain</small><strong>Huit inconnues, huit enquêtes</strong><span>Qui détient la réponse, comment s’y prendre, en combien de jours.</span></Link>
          </div>
        </section>

        <section id="patrimoine" className="heritage section" aria-labelledby="heritage-title" style={{ background: "#f7f8f4" }}>
          <div className="section-head">
            <div>
              <p className="eyebrow">07 — Histoire & patrimoine</p>
              <h2 id="heritage-title">Préserver ce qui<br /><em>doit se transmettre.</em></h2>
            </div>
            <p>De Narmbang à Donath Gari, onze chefs de canton ; des forums de 2000 et 2003 à la réactivation de 2026 ; une langue, le nangnda, et une <Link href="/bibliotheque">bibliothèque de quarante références</Link>.</p>
          </div>
          <div className="heritage-grid">
            <article><span>01</span><h3>Grandes figures</h3><p>Tarouss Doumanbé, pilier de la création de l’association ; la lignée des chefs de canton ; les chercheurs qui ont écrit la mémoire bedjond.</p><Link className="text-link" href="/histoire#figures">Découvrir ↗</Link></article>
            <article><span>02</span><h3>Lieux sacrés et généalogies</h3><p>Deux cahiers de terrain pour recenser les sites sacrés et écrire l’histoire de chaque famille.</p><Link className="text-link" href="/dossiers/lieux-sacres">Les lieux sacrés ↗</Link></article>
            <article><span>03</span><h3>Nangnda, la langue</h3><p>Ce que nous en savons, le lexique de 2 650 mots que l’on peut écouter en ligne, et le dictionnaire numérique qui commence par vos mots.</p><Link className="text-link" href="/langue">La langue nangnda ↗</Link></article>
          </div>
          <div className="section-actions"><Link className="text-link" href="/histoire">Toute l’histoire ↗</Link></div>
        </section>

        <section id="impact" className="impact section" aria-labelledby="impact-title">
          <div className="impact-intro">
            <p className="eyebrow">08 — Tableau de bord</p>
            <h2 id="impact-title">Mesurer ce qui<br /><em>devient réel.</em></h2>
            <p>
              La crédibilité se construit par la preuve. Six indicateurs datés et sourcés — adhérents, coordonnateurs, plaidoyers, besoins recensés et résolus, projets — et {corrections} corrections publiées à découvert. Ce qui n’est pas encore fait est écrit comme tel.
            </p>
            <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 26 }}>
              <Link className="button secondary" href="/impact">Le tableau de bord complet <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <TableauDeBord donnees={indicateurs} mode="compact" />
        </section>

        <section id="valeurs" className="values section" aria-labelledby="values-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Fondations</p>
              <h2 id="values-title">Des principes<br /><em>en mouvement.</em></h2>
            </div>
            <p>Trois mots pour guider les décisions, les projets et la manière de travailler ensemble.</p>
          </div>
          <div className="value-grid">
            {values.map(([n, title, description]) => (
              <article className="value-card" key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto" aria-labelledby="manifesto-title">
          <div className="manifesto-inner">
            <p className="eyebrow">Signature</p>
            <h2 id="manifesto-title">Courage.<br />Discipline.<br /><em>Héritage.</em></h2>
            <p>Parce que ce que nous construisons aujourd’hui doit pouvoir servir demain.</p>
          </div>
        </section>

        <section id="participer" className="participate section" aria-labelledby="participate-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">09 — Participer</p>
              <h2 id="participate-title">Une place pour<br /><em>chaque contribution.</em></h2>
            </div>
            <p>Nous répondons sous quarante-huit heures ouvrées, par le formulaire, par WhatsApp ou par téléphone.</p>
          </div>
          <div className="engagement-list">
            {participer(total - filled).map(([n, title, description, href]) => (
              <Link href={href} key={n} style={{ display: "contents" }}>
                <article>
                  <span>{n}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                  <b aria-hidden="true">↗</b>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section id="transparence" className="trust section" aria-labelledby="trust-title">
          <div>
            <p className="eyebrow">10 — Transparence</p>
            <h2 id="trust-title">Une association qui<br /><em>rend des comptes.</em></h2>
          </div>
          <div className="trust-card">
            <span className="trust-mark" aria-hidden="true">◎</span>
            <h3>Réponse sous 48 heures, plainte possible, corrections publiées</h3>
            <p>
              Mécanisme de plainte — même anonyme — avec recours jusqu’à l’assemblée générale, protection des enfants et des personnes vulnérables, charte d’écriture, et documents publiés au fur et à mesure de leur validation.
            </p>
            <Link className="button primary" href="/transparence">Notre charte de redevabilité <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section id="contact" className="contact section" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">11 — Contact</p>
            <h2 id="contact-title">Construire la suite<br /><em>ensemble.</em></h2>
          </div>
          <div className="contact-card">
            <p>
              Le contact officiel de l’association est celui de son président, Adoumbé Maoura : <a href={ORG.phoneHref}><strong>{ORG.phone}</strong></a>, appel et WhatsApp.
              Pour rejoindre une thématique, poser une question ou proposer un partenariat, le formulaire est le plus sûr.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/participer#contact">Nous écrire <span aria-hidden="true">→</span></Link>
              <a className="text-link" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
