import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { enLettres, filledCount, getIndex, ogFor, ORG, thematiqueCount } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { IDENTITE, ODEB } from "@/lib/odeb";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Espace presse : l’association en bref",
  description: metaDescription("Pour les journalistes et les partenaires : ADEB LONODJI en cinq lignes, les chiffres datés, les dates, le bureau, les communiqués, les logos et visuels, le dossier de présentation, et à qui écrire."),
  alternates: { canonical: "/presse" },
  openGraph: ogFor("/presse"),
};

const nf = new Intl.NumberFormat("fr-FR");
const DATES: [string, string][] = [
  ["1986", "Premières réflexions de cadres bedjond pour un cadre associatif au service du peuple bedjond de Bédjondo."],
  ["1995", "Reconnaissance officielle de l’Association de Développement et d’Entraide de Bédjondo."],
  ["2000", "Premier forum communautaire, à Bédjondo."],
  ["2003", "Second forum, à Bébopen ; puis une longue mise en veille."],
  ["2026", "Réactivation : quatre pôles, vingt thématiques (la vingtième, Urgences & risques, le 29 septembre), deux cellules ; site lonodji.org ; sept plaidoyers et une note à la commune ; carte du territoire."],
  ["28 sept. 2026", "Quarante ans des fondations : lancement de la réflexion ODEB LONODJI (vision 2030, six programmes, livre blanc en version de travail)."],
];
const VISUELS: [string, string][] = [
  ["/partage/40-ans-reflexion-odeb.png", "Quarante ans des fondations : la réflexion ODEB LONODJI"],
  ["/partage/livre-blanc-odeb.png", "Le livre blanc, à lire et à discuter"],
  ["/partage/thematiques-a-pourvoir.png", "Les thématiques qui cherchent leur coordonnateur"],
  ["/partage/retrouver-son-village.png", "Retrouver son village : une fiche par localité"],
  ["/partage/racontez-bedjondo.png", "Racontez Bédjondo : témoignages et photos"],
];
const LOGOS_ODEB: [string, string, string][] = [
  [IDENTITE.embleme, "Emblème en verre (SVG)", "écrans, réseaux, vidéos"],
  [IDENTITE.superposable, "Emblème superposable (SVG)", "sur photo ou fond sombre"],
  [IDENTITE.clair, "Verre clair (SVG)", "papeterie, fonds blancs"],
  [IDENTITE.plat, "À plat, couleur (SVG)", "impression, petites tailles"],
  [IDENTITE.mono, "Monochrome (SVG)", "tampon, gravure, photocopie"],
  [IDENTITE.png.embleme1024, "Emblème PNG 1024 px", "réseaux, documents"],
];
const LOGOS_MARQUES: [string, string, string][] = [
  [IDENTITE.adeb.png.horizontal, "ADEB LONODJI, logo horizontal (PNG)", "association · fond sombre"],
  [IDENTITE.adeb.png.horizontalClair, "ADEB LONODJI, logo horizontal clair (PNG)", "association · papier"],
  [IDENTITE.png.horizontal, "ODEB LONODJI, logo horizontal (PNG)", "projet · fond sombre"],
  [IDENTITE.png.horizontalClair, "ODEB LONODJI, logo horizontal clair (PNG)", "projet · papier"],
];
/* l'ancien logo, jusqu'au 28 septembre 2026 */
const LOGOS: [string, string, string][] = [
  ["/identite/logo-adeb-lonodji.svg", "Logo couleur (SVG)", "fond clair"],
  ["/identite/logo-adeb-lonodji-sombre.svg", "Logo sur fond sombre (SVG)", "réserve"],
  ["/identite/logo-adeb-lonodji-mono.svg", "Logo monochrome (SVG)", "noir et blanc"],
  ["/identite/logo-adeb-lonodji-blanc.svg", "Logo blanc (SVG)", "sur photo ou couleur"],
  ["/identite/logo-adeb-lonodji-pictogramme.svg", "Pictogramme (SVG)", "petites tailles"],
  ["/identite/logo-adeb-lonodji-1024.png", "Logo PNG 1024 px", "réseaux, documents"],
];

export default function Presse() {
  const idx = getIndex();
  const ind = getIndicateurs();
  const c = ind.contenu;
  const total = thematiqueCount(idx);
  const pourvues = filledCount(idx);
  const communiques = idx.articles.filter((a) => a.category === "vie-association" || a.category === "lettre").slice(0, 6);
  const releve = new Date(ind.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" });
  return (
    <main id="main-content" className="hub-page pr-page">
      <PageHeader
        eyebrow="Association · presse & partenaires"
        title="L’association"
        em="en bref, et à jour."
        lead="Ce qu’un journaliste, un élu, un bailleur ou un partenaire doit savoir d’ADEB LONODJI, sans avoir à le chercher : qui nous sommes, les chiffres tels qu’ils sont, les dates, les personnes, les documents, les visuels, et à qui écrire. Tout ce qui est ici est vérifiable sur le site."
        crumbs={[{ label: "L’association", href: "/mission" }, { label: "Presse" }]}
        pills={["Association reconnue en 1995", "Bédjondo · Mandoul · Tchad", `Chiffres au ${releve}`]}
      />
      <p className="detail-lead">Contact presse : {ORG.bureau[0].name}, président — <a href={ORG.phoneHref}>{ORG.phone}</a> (appel, WhatsApp) · <Link href="/participer?objet=presse#contact">Formulaire, objet presse</Link></p>

      <section className="hub-section" id="en-bref">
        <SectionHead eyebrow="En cinq lignes" title="Qui nous sommes," em="en une citation prête à l’emploi." />
        <blockquote className="pr-citation">
          <p>« ADEB LONODJI, l’Association de Développement et d’Entraide de Bédjondo, est l’association de Bédjondo (Mandoul Occidental, Tchad) et de sa diaspora, gardienne du patrimoine bedjond. Née de réflexions engagées en 1986 et reconnue en 1995, remise en mouvement en 2026, elle agit par {enLettres(total)} thématiques bénévoles pour l’eau, la santé, l’école, les routes et le réseau, et garde la mémoire, la langue et le patrimoine bedjond. Sa devise : Courage, Discipline, Héritage. Depuis le {ODEB.presenteLabel}, elle porte la réflexion ODEB LONODJI, projet d’organisation permanente à l’horizon 2030. »</p>
          <footer>Texte libre de reprise, à citer « ADEB LONODJI, lonodji.org ». Le nom s’écrit en capitales : ADEB LONODJI ; le peuple s’écrit « bedjond », sa langue « nangnda ».</footer>
        </blockquote>
      </section>

      <section className="hub-section" id="chiffres">
        <SectionHead eyebrow="Les chiffres" title="Datés, sourcés," em="tels qu’ils sont." text="Chaque nombre vient du tableau de suivi du site, où il porte sa source et sa méthode. Ce qui n’est pas fait est écrit comme tel : aucun plaidoyer n’a encore été transmis, aucun projet n’est financé, la collecte est suspendue." />
        <Stats items={[
          { value: `${pourvues}/${total}`, label: "thématiques pourvues", note: `${total - pourvues} cherchent leur coordonnateur ; ${c.coordinations.cellulesPourvues}/${c.coordinations.cellulesTotal} cellules` },
          { value: String(c.plaidoyers.publies), label: "dossiers de plaidoyer publiés", note: `${c.plaidoyers.envoyes} transmis, ${c.plaidoyers.reponses} réponses` },
          { value: nf.format(c.carte.localitesNommees), label: "fiches de villages", note: `${c.carte.unites} unités, ${nf.format(c.carte.localites)} localités cartographiées` },
          { value: String(c.problematiques.total), label: "problématiques diagnostiquées", note: `${c.problematiques.inconnues} inconnues, ${c.problematiques.chantiersPrioritaires} chantiers prioritaires` },
          { value: String(c.articles), label: "articles au journal", note: `depuis le ${new Date((c.premierArticle ?? "2026-09-11") + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` },
          { value: String(c.corrections), label: "corrections publiées", note: "journal des corrections, à découvert" },
        ]} />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="button secondary" href="/impact">Le tableau de suivi complet <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="hub-section" id="dates">
        <SectionHead eyebrow="Repères" title="Six dates" em="à retenir." />
        <ol className="timeline">
          {DATES.map(([an, texte]) => <li key={an}><span className="tl-year">{an}</span><div><p>{texte}</p></div></li>)}
        </ol>
      </section>

      <section className="hub-section" id="personnes">
        <SectionHead eyebrow="Qui parle au nom de l’association" title="Le bureau exécutif" em="et l’animation." text="Le contact officiel est celui du président. Les coordonnateurs des thématiques parlent de leur thématique ; leur liste est sur la page Nos actions." />
        <div className="bureau-grid">
          {ORG.bureau.map((b) => <article className="bureau-card" key={b.name}><small>{b.role}</small><strong>{b.name}</strong>{b.note ? <p>{b.note}</p> : null}</article>)}
        </div>
      </section>

      <section className="hub-section" id="communiques">
        <SectionHead eyebrow="Communiqués et actualités" title="Ce que nous avons" em="annoncé." text="Le journal tient lieu de fil de communiqués : chaque article est daté, signé et sourcé, et ses corrections sont publiées." />
        <div className="link-list">
          {communiques.map((a) => <Link href={a.route} key={a.slug}><small>{a.dateLabel} · {a.tag}</small><strong>{a.title}</strong><span>{a.summary}</span></Link>)}
        </div>
        <div className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/journal?rubrique=vie-association">Toute la vie de l’association <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="hub-section" id="documents">
        <SectionHead eyebrow="Documents" title="À lire" em="et à joindre." />
        <div className="link-list">
          <a href="/notes/note-synthese-bedjondo.pdf" download><small>PDF · 2 pages</small><strong>Note de synthèse des huit dossiers de plaidoyer</strong><span>Bédjondo en chiffres sourcés, les huit demandes, les programmes à rejoindre, ce que nous ne savons pas encore. À joindre aux courriers.</span></a>
          <a href="/documents/dossier-presentation-adeb-lonodji-2026.pdf" download><small>PDF · 4 pages</small><strong>Dossier de présentation d’ADEB LONODJI</strong><span>L’association, ses pôles, ses thématiques, ses plaidoyers.</span></a>
          <a href={ODEB.livreBlancPdf} download><small>PDF · version de travail</small><strong>Livre blanc du projet ODEB LONODJI</strong><span>Vision 2030, six missions, six programmes, feuille de route. Non adopté à ce jour.</span></a>
          <a href={IDENTITE.charte} download><small>PDF · charte</small><strong>Identité visuelle du projet ODEB LONODJI</strong><span>Le logo « Les Pas vers l’Avenir », ses versions, ses couleurs, ses règles ; le kit et le papier à en-tête sont sur la page en ligne.</span></a>
          <Link href="/documents"><small>Tous les PDF</small><strong>Plaidoyers, cahiers de terrain, note à la commune</strong><span>{c.documentsPdf} documents disponibles, {c.documentsAnnonces} annoncés.</span></Link>
          <Link href="/transparence"><small>Redevabilité</small><strong>Charte : réponse sous 48 h, plainte, protection, corrections</strong><span>Les règles que l’association s’impose, et les documents constitutifs à venir.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="visuels">
        <SectionHead eyebrow="Logos et visuels" title="« Les Pas vers l’Avenir »," em="le logo adopté le 28 septembre 2026." text="Trois empreintes — les ancêtres, la génération actuelle, les générations futures — qui avancent vers un soleil levant, dans un disque de verre vert profond. Un emblème, deux noms : « ADEB LONODJI » pour l’association, « ODEB LONODJI » pour son projet. En dessous de 40 px, la version à plat ; pour le tampon et la photocopie, la monochrome. Aucune photographie de Bédjondo n’est encore disponible : la banque d’images se constitue." />
        <ul className="pr-logos">
          {LOGOS_ODEB.map(([href, label, note]) => (
            <li key={href}>
              <a href={href} download className="pr-logo">
                <span className={href.includes("superposable") ? "pr-logo-apercu est-sombre" : "pr-logo-apercu"}><img src={href} alt="" width={120} height={120} loading="lazy" /></span>
                <strong>{label}</strong><small>{note}</small>
              </a>
            </li>
          ))}
        </ul>
        <ul className="pr-logos pr-logos--larges">
          {LOGOS_MARQUES.map(([href, label, note]) => (
            <li key={href}>
              <a href={href} download className="pr-logo">
                <span className={href.includes("clair") ? "pr-logo-apercu pr-logo-apercu--large" : "pr-logo-apercu pr-logo-apercu--large est-sombre"}><img src={href} alt="" width={240} height={77} loading="lazy" /></span>
                <strong>{label}</strong><small>{note}</small>
              </a>
            </li>
          ))}
        </ul>
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button secondary" href="/odeb/identite">Le logo, ses règles, ses couleurs <span aria-hidden="true">→</span></Link>
          <a className="text-link" href={IDENTITE.kit} download>Kit complet (ZIP) <span aria-hidden="true">↓</span></a>
          <a className="text-link" href={IDENTITE.planche} download>Planche pour l’imprimeur (PDF) <span aria-hidden="true">↓</span></a>
          <Link className="text-link" href="/odeb/identite#reseaux">Bannières, image de profil, signature e-mail, cartes de visite <span aria-hidden="true">→</span></Link>
          <a className="text-link" href="/carte/affiches/affiche-villages.pdf" download>Affiche « Retrouvez votre village » (PDF A4) <span aria-hidden="true">↓</span></a>
          <Link className="text-link" href="/participer/kit-mobilisation">Visuels de mobilisation <span aria-hidden="true">→</span></Link>
        </div>
        <details className="pr-ancien" id="ancien-logo">
          <summary>Ancienne identité (avant le 28 septembre 2026)</summary>
          <p>Un disque bleu, une paire d’empreintes de pas, une poignée de main qui traverse le disque : il reste sur les documents publiés avant cette date et ne se mélange pas au nouveau. Ses règles sont dans l’<Link href="/association/ancienne-identite-visuelle">identité visuelle précédente</Link>.</p>
          <ul className="pr-logos">
            {LOGOS.map(([href, label, note]) => (
              <li key={href}>
                <a href={href} download className="pr-logo">
                  <span className={href.includes("sombre") || href.includes("blanc") ? "pr-logo-apercu est-sombre" : "pr-logo-apercu"}><img src={href} alt="" width={120} height={120} loading="lazy" /></span>
                  <strong>{label}</strong><small>{note}</small>
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="hub-section" id="partage">
        <SectionHead eyebrow="Visuels à partager" title="Cinq cartes" em="pour WhatsApp et les réseaux." text="Format carré 1080 × 1080, aux couleurs du site, avec l’adresse de la page. Téléchargez, partagez tel quel ; le texte des cartes est repris ci-dessous pour l’accompagner." />
        <ul className="pr-visuels">
          {VISUELS.map(([href, label]) => (
            <li key={href}><a href={href} download className="pr-visuel"><img src={href} alt="" width={1080} height={1080} loading="lazy" /><span>{label} <b aria-hidden="true">↓</b></span></a></li>
          ))}
        </ul>
      </section>

      <section className="hub-section" id="regles">
        <SectionHead eyebrow="Ce que nous demandons" title="Quatre règles," em="les mêmes pour nous." />
        <div className="detail-grid">
          <article><h3>L’exactitude d’abord</h3><p>Nos chiffres sont datés et sourcés ; nous demandons qu’ils soient cités avec leur date. Une erreur de notre fait est corrigée et publiée dans le journal des corrections ; une erreur de citation, nous la signalons.</p></article>
          <article><h3>Les personnes protégées</h3><p>Pas d’image identifiable d’un enfant sans l’accord d’un parent, jamais avec son nom ni son école ; pas de localisation des lieux sacrés ; rien de nominatif issu de nos formulaires.</p></article>
          <article><h3>Ce qui n’est pas fait est dit</h3><p>Aucun plaidoyer n’est encore transmis, aucun projet n’est financé, l’ODEB n’est pas constituée. Présenter ces chantiers comme acquis serait inexact, et nous le dirions.</p></article>
          <article><h3>Le droit de réponse</h3><p>Une question, une demande d’entretien, un fait à vérifier : nous répondons sous quarante-huit heures ouvrées, par le formulaire, par WhatsApp ou par téléphone.</p></article>
        </div>
      </section>

      <section className="hub-section" id="contact">
        <SectionHead eyebrow="Contact presse" title="À qui écrire," em="et comment." />
        <div className="contact-card pr-contact">
          <p>Le contact officiel de l’association est celui de son président, {ORG.bureau[0].name} : <a href={ORG.phoneHref}><strong>{ORG.phone}</strong></a>, appel et WhatsApp. Pour une demande écrite, le formulaire est le plus sûr, objet « Partenariat, presse ou recherche » ; aucune adresse électronique n’est encore rattachée au domaine lonodji.org.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/participer?objet=presse#contact">Nous écrire <span aria-hidden="true">→</span></Link>
            <a className="text-link" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Partager route="/presse" titre="Espace presse" texte="Pour les journalistes et les partenaires : ADEB LONODJI en cinq lignes, les chiffres datés, les dates, le bureau, les communiqués, les logos et visuels, le dossier de présentation, et à qui écrire." />
        <p className="lg-footnote">Espace ouvert le 28 septembre 2026 pour accompagner le lancement de la réflexion ODEB LONODJI. Les chiffres sont ceux du site à sa mise en ligne (<Link href="/impact">tableau de suivi</Link>) ; le logo et ses règles sont dans l’<Link href="/odeb/identite">identité visuelle</Link>, l’ancien logo dans l’<Link href="/association/ancienne-identite-visuelle">identité précédente</Link>.</p>
      </section>
    </main>
  );
}
