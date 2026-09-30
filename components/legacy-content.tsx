import Link from "@/components/lien";
import Partager from "@/components/partager";
import type { LegacyPage, Section } from "../lib/content";
import LegacyEnhance from "./legacy-enhance";
import OuvrirAncre from "./ouvrir-ancre";
import SommaireLateral from "./sommaire-lateral";
import { breadcrumbSchema, jsonLd, webPageSchema } from "../lib/schema";
import PagesVoisines from "./pages-voisines";

/** Rendu des sections importées de l'ancien site, dans le style du site moderne. */
/* sansPremierTitre : quand la page pose déjà son propre titre de section (SectionHead) juste au-dessus,
   le premier titre h2 de la section importée, qui le répète, est retiré (un seul titre par bloc). */
export function LegacySections({ sections, className = "", sansPremierTitre = false }: { sections: Section[]; className?: string; sansPremierTitre?: boolean }) {
  return (
    <>
      {sections.map((s, i) => {
        const classes = ["lg-section", s.alt ? "alt" : "", s.cls].filter(Boolean).join(" ");
        return (
          <section
            key={s.id || i}
            id={s.id || undefined}
            className={classes}
            dangerouslySetInnerHTML={{ __html: sansPremierTitre && i === 0 ? s.html.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/, "") : s.html }}
          />
        );
      })}
      {className ? null : null}
    </>
  );
}

export function Resume({ items, lang = "fr" }: { items?: string[]; lang?: "fr" | "en" }) {
  if (!items || !items.length) return null;
  return (
    <aside className="lg-resume" aria-labelledby="lg-resume-titre">
      <p className="eyebrow" id="lg-resume-titre">{lang === "en" ? "In three sentences" : "En trois phrases"}</p>
      <ol>{items.map((t, i) => <li key={i}>{t}</li>)}</ol>
    </aside>
  );
}

export function Toc({ items, lang = "fr" }: { items?: { href: string; label: string }[]; lang?: "fr" | "en" }) {
  if (!items || !items.length) return null;
  return (
    <nav className="lg-toc" aria-label={lang === "en" ? "Page contents" : "Sommaire de la page"}>
      <p className="eyebrow">{lang === "en" ? "On this page" : "Sur cette page"}</p>
      <ol>{items.map((t) => <li key={t.href}><a href={t.href}>{t.label}</a></li>)}</ol>
    </nav>
  );
}

export function Crumbs({ items, parentHref, lang = "fr" }: { items: string[]; parentHref?: string; lang?: "fr" | "en" }) {
  if (!items || items.length < 2) return null;
  const en = lang === "en";
  const accueil = en ? "Home" : "Accueil";
  const brut = items[items.length - 2];
  const parent = PARENT_LABELS[brut] ?? brut;
  return (
    <nav className="lg-crumbs" aria-label={en ? "Breadcrumb" : "Fil d’Ariane"}>
      <ol>
        <li><Link href={en ? "/en/index" : "/"}>{accueil}</Link></li>
        {parentHref && brut !== "Accueil" && brut !== "Home" ? <li><Link href={parentHref}>{parent}</Link></li> : null}
        <li aria-current="page">{items[items.length - 1]}</li>
      </ol>
    </nav>
  );
}

/* Surtitres des pages de fond (30/09/2026) : même forme que le reste du site, « Rubrique · page ».
   L'ancien surtitre de chaque page (« Agir », « Relayer », « Notre ville »…) est remplacé ici. */
const SURTITRES: Record<string, string> = {
  "/programmes/agriculteurs-eleveurs": "Nos actions · paix entre agriculteurs et éleveurs",
  "/programmes/agriculture-securite-alimentaire": "Nos actions · agriculture & sécurité alimentaire",
  "/programmes/environnement": "Nos actions · environnement & durabilité",
  "/programmes/handicap": "Nos actions · plan handicap",
  "/programmes/veuves": "Nos actions · plan veuves",
  "/programmes/solidarite-inclusion": "Nos actions · protection sociale & inclusion",
  "/programmes/odd": "Nos actions · objectifs de développement durable",
  "/projets/application": "Nos actions · projets",
  "/projets/complexe-sportif": "Nos actions · projets",
  "/projets/drones-innovation": "Nos actions · projets",
  "/projets/espace-numerique": "Nos actions · projets",
  "/territoire/bedjondo": "Territoire · Bédjondo",
  "/territoire/besoins": "Territoire · carte des besoins",
  "/territoire/decentralisation": "Territoire · décentralisation",
  "/territoire/diagnostic": "Territoire · diagnostic territorial",
  "/territoire/enquetes": "Territoire · enquêtes de terrain",
  "/patrimoine/base-de-recherche": "Patrimoine · base de recherche",
  "/patrimoine/genealogies": "Patrimoine · généalogies",
  "/patrimoine/genealogie-outil": "Patrimoine · cahier généalogique",
  "/patrimoine/lieux-sacres": "Patrimoine · lieux sacrés",
  "/association/demarches": "Association · démarches",
  "/association/engagements": "Association · engagements publics",
  "/association/evenements": "Association · événements",
  "/association/ancienne-identite-visuelle": "Association · ancienne identité visuelle",
  "/association/ong-partenaires": "Association · ONG et partenaires",
  "/participer/kit-mobilisation": "Participer · kit de mobilisation",
  "/participer/trouver-ma-thematique": "Participer · trouver ma thématique",
};

/* Rubriques du site (29/09/2026) : préfixe d'adresse → libellé et page d'entrée du fil d'Ariane. */
const RUBRIQUES: [string, string, string][] = [
  ["/projets/", "Projets", "/projets"],
  ["/programmes/", "Nos actions", "/programmes"],
  ["/territoire/", "Territoire", "/territoire"],
  ["/patrimoine/", "Patrimoine", "/patrimoine"],
  ["/association/", "L’association", "/mission"],
  ["/participer/", "Participer", "/participer"],
];

export const PARENT_ROUTES: Record<string, string> = {
  "Nos actions": "/programmes",
  "L’association": "/mission",
  "L'association": "/mission",
  "Bédjondo & héritage": "/carte",
  "Territoire & patrimoine": "/carte",
  "Actualités": "/journal",
  "Le journal": "/journal",
  "Agir avec nous": "/participer",
  "Participer": "/participer",
  "Association": "/mission",
  "Home": "/en/index",
};

/* Libellés actuels des rubriques parentes (les pages importées gardent l'ancien nom). */
const PARENT_LABELS: Record<string, string> = {
  "Agir avec nous": "Participer",
  "Bédjondo & héritage": "Territoire & patrimoine",
};

/* Barre de liens des pages anglaises héritées. */
const LIENS_EN: { label: string; href: string }[] = [
  { label: "About", href: "/en/about" }, { label: "Themes", href: "/en/themes" }, { label: "Sectors", href: "/en/sectors" }, { label: "Donors", href: "/en/donors" },
  { label: "Advocacy", href: "/en/advocacy" }, { label: "Bédjondo", href: "/en/bedjondo" }, { label: "Villages", href: "/en/villages" },
  { label: "Projects", href: "/en/projects" }, { label: "Governance", href: "/en/governance" }, { label: "Proposals to the commune", href: "/en/commune" },
  { label: "ODEB", href: "/en/odeb" }, { label: "Contact", href: "/en/contact" },
];


/* Sommaire d'une page de fond : celui de l'ancien site, sinon construit depuis les titres de ses sections (trois au moins). */
const titreH2 = (html: string) => (html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
/* Ancre d'une section sans id : tirée de son titre (« Le cadre » → le-cadre), pour que le sommaire puisse y mener. */
function avecAncres(sections: Section[]): Section[] {
  const vus = new Set(sections.map((x) => x.id).filter(Boolean));
  return sections.map((x) => {
    if (x.id) return x;
    const t = titreH2(x.html);
    if (!t) return x;
    let id = t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
    while (vus.has(id)) id += "-2";
    vus.add(id);
    return { ...x, id };
  });
}

function sommaireDe(page: LegacyPage): { href: string; label: string }[] {
  if (page.toc?.length) return page.toc;
  const items = page.sections
    .filter((s) => s.id && !/rubrique-nav/.test(s.cls || ""))
    .map((s) => ({ href: `#${s.id}`, label: titreH2(s.html) }))
    .filter((t) => t.label);
  return items.length >= 3 ? items : [];
}


/** Page de fond complète (dossier) : en-tête conçu + contenu importé. */
export function LegacyDocument({ page, children, eyebrowPrefix }: { page: LegacyPage; children?: React.ReactNode; eyebrowPrefix?: string }) {
  const [main, ...rest] = splitTitle(page.title);
  const en = page.lang === "en";
  return (
    <main id="main-content" className="detail-page lg-page" lang={page.lang !== "fr" ? page.lang : undefined}>
      <script id="legacy-webpage-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: page.route, name: page.title, description: page.description, lang: en ? "en" : "fr" })] }) }} />
      {en && page.route === "/en/index" ? null : (() => {
        // rubrique d'après l'adresse (restructuration du 29/09/2026), sinon le parent de l'ancien site
        const r = RUBRIQUES.find(([pre]) => page.route.startsWith(pre));
        return r ? <Crumbs items={["Accueil", r[1], page.crumbs?.[page.crumbs.length - 1] ?? page.title]} parentHref={r[2]} /> : <Crumbs items={page.crumbs} parentHref={PARENT_ROUTES[page.parent]} lang={en ? "en" : "fr"} />;
      })()}
      <p className="eyebrow">{SURTITRES[page.route] ?? (en && eyebrowPrefix ? [page.eyebrow, "in English"].filter(Boolean).join(" · ") : [eyebrowPrefix, page.eyebrow].filter(Boolean).join(" · "))}</p>
      <h1>{main}{rest.length ? <><br /><em>{rest.join(" ")}</em></> : null}</h1>
      {page.lede ? <p className="detail-lead">{page.lede}</p> : null}
      {page.pills?.length ? <div className="status-list lg-pills">{page.pills.map((p) => <span key={p}>{p}</span>)}</div> : null}
      {children}
      {(() => {
        // grand écran : le texte à gauche, le sommaire à droite (collant) ; pages à carte : pleine largeur
        const sections = avecAncres(page.sections);
        const sommaire = page.hasMap ? [] : sommaireDe({ ...page, sections });
        const legacy = (
          <div className="legacy" {...(page.rootAttrs ?? {})}>
            {sommaire.length ? null : <Resume items={page.resume} lang={en ? "en" : "fr"} />}
            {sommaire.length ? null : <Toc items={page.toc} lang={en ? "en" : "fr"} />}
            <LegacySections sections={sections} />
          </div>
        );
        // avec sommaire latéral, le résumé « en trois phrases » passe au-dessus des deux colonnes
        if (sommaire.length && page.resume?.length) return (
          <>
            <div className="legacy lg-resume-haut"><Resume items={page.resume} lang={en ? "en" : "fr"} /></div>
            <div className="lg-corps">
              <aside className="lg-aside"><SommaireLateral items={sommaire} titre={en ? "On this page" : "Sur cette page"} /></aside>
              {legacy}
            </div>
          </>
        );
        return sommaire.length ? (
          <div className="lg-corps">
            <aside className="lg-aside"><SommaireLateral items={sommaire} titre={en ? "On this page" : "Sur cette page"} /></aside>
            {legacy}
          </div>
        ) : legacy;
      })()}
      {!en ? <PagesVoisines route={page.route} /> : null}
      <LegacyEnhance hasMap={page.hasMap} hasForms={page.forms.length > 0} scripts={page.scripts} />
      <OuvrirAncre />
      <Partager route={page.route} titre={page.title.replace(/\s+/g, " ")} texte={page.description} lang={page.lang === "en" ? "en" : "fr"} />
      {en ? (
        <>
          <nav className="lg-footnote lg-liens-en" aria-label="English pages">
            {LIENS_EN.map((l, i) => (
              <span key={l.href}>{i ? " · " : ""}{l.href === page.route ? <span aria-current="page">{l.label}</span> : <Link href={l.href}>{l.label}</Link>}</span>
            ))}
          </nav>
          <p className="lg-footnote">Page carried over from the first version of the site (September 2026) and kept up to date here. Spotted a factual error? <Link href="/transparence#corrections" hrefLang="fr">Report it (in French)</Link>: it will be corrected and dated.</p>
        </>
      ) : (
        <p className="lg-footnote">Page reprise de la première version du site (septembre 2026) et maintenue à jour ici. Une erreur de fait ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p>
      )}
    </main>
  );
}

/** Coupe un titre en deux parties pour l'emphase de la seconde (style de la maquette). */
export function splitTitle(title: string): string[] {
  // coupure naturelle d'abord (« : », « & », virgule), comme les titres des pages d'accueil de rubrique
  const m = title.match(/^(.{6,}?(?: :| &|,))\s+(.{6,})$/);
  if (m) return [m[1], m[2]];
  const words = title.split(" ");
  if (words.length < 5) return [title];
  const cut = Math.ceil(words.length * 0.55);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}
