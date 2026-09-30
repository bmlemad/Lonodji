import Link from "@/components/lien";
import { IDENTITE } from "../lib/odeb";
import { ORG } from "../lib/content";
import { PIED } from "../lib/navigation";
import { LienLangue } from "./app-shell";
import NewsletterForm from "./newsletter-form";

type Colonne = { titre: string; liens: { label: string; href: string; fr?: boolean }[] };

/* Colonnes françaises : lib/navigation.ts (PIED), ajustées ici — lien « ONG &
   bailleurs » dans « L'association », adhésion présentée comme déclaration
   d'intention (aucune cotisation n'est perçue pour l'instant). */
const PIED_FR: Colonne[] = PIED.map((col) => {
  let liens = col.liens.map((l) => (l.label === "Adhérer & cotiser" ? { ...l, label: "Adhérer (déclaration d’intention)" } : l));
  if (col.titre === "L’association" && !liens.some((l) => l.href === "/association/ong-partenaires")) {
    const i = liens.findIndex((l) => l.href === "/presse");
    const lien = { label: "ONG & bailleurs", href: "/association/ong-partenaires" };
    liens = i >= 0 ? [...liens.slice(0, i), lien, ...liens.slice(i)] : [...liens, lien];
  }
  return { titre: col.titre, liens };
});

/* Colonnes anglaises : les pages qui existent en anglais d'abord ; les autres,
   en français, sont signalées comme telles (fr: true → hreflang="fr"). */
const PIED_EN: Colonne[] = [
  { titre: "The association", liens: [
    { label: "About us", href: "/en/about" }, { label: "Vision 2030 — the ODEB project", href: "/en/odeb" }, { label: "White paper", href: "/odeb/livre-blanc", fr: true },
    { label: "Accountability & transparency", href: "/transparence", fr: true }, { label: "NGOs & funders", href: "/association/ong-partenaires", fr: true }, { label: "Press", href: "/presse", fr: true },
  ] },
  { titre: "Our work", liens: [
    { label: "Four pillars · structured themes", href: "/en/themes" }, { label: "Sectors", href: "/en/sectors" }, { label: "Advocacy", href: "/en/advocacy" },
    { label: "Projects", href: "/en/projects" }, { label: "Donor programmes in Chad", href: "/en/donors" }, { label: "Impact dashboard", href: "/en/impact" },
  ] },
  { titre: "Territory", liens: [
    { label: "Villages", href: "/en/villages" }, { label: "Bédjondo, our town", href: "/en/bedjondo" }, { label: "Local governance", href: "/en/governance" }, { label: "Proposals to the commune", href: "/en/commune" }, { label: "Map of the territory", href: "/carte", fr: true }, { label: "Observatory", href: "/observatoire", fr: true },
  ] },
  { titre: "Heritage", liens: [
    { label: "History", href: "/histoire", fr: true }, { label: "The Nangnda language", href: "/langue", fr: true }, { label: "Digital library", href: "/bibliotheque", fr: true },
  ] },
  { titre: "Get involved", liens: [
    { label: "Write to us", href: "/en/contact" }, { label: "Join (declaration of intent)", href: "/participer#adherer", fr: true }, { label: "Register your skills", href: "/diaspora", fr: true }, { label: "Documents", href: "/documents", fr: true },
  ] },
];

/* Pied de page : un bandeau (qui nous sommes, comment nous joindre, lettre
   d'information), cinq colonnes de liens et la ligne de fin (devise, mentions,
   langue, retour en haut). En anglais (lang="en") : tout le pied en anglais. */
export default function SiteFooter({ miseAJour, lang = "fr" }: { miseAJour?: string; lang?: "fr" | "en" }) {
  const en = lang === "en";
  const colonnes = en ? PIED_EN : PIED_FR;
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-block">
          <div className="footer-brand"><span className="logo-verre logo-verre--pied" aria-hidden="true"><img src="/icones/logo-motif-verre.svg" alt="" width={26} height={30} loading="lazy" decoding="async" /></span><strong className="brand-mot">ADEB <b>LONODJI</b></strong></div>
          <p className="footer-tagline">{en ? "The association of Bédjondo and its diaspora, guardian of the Bedjond heritage." : ORG.tagline}</p>
          <p className="footer-place">{en ? <span lang="fr">{ORG.fullName}</span> : ORG.fullName}<br />{en ? "Bédjondo · Mandoul Occidental · Mandoul, Chad" : ORG.place}</p>
          <div className="footer-contact">
            <a href={ORG.phoneHref}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>{ORG.phone}</a>
            <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.6-4A8 8 0 1 1 20 11.5z" /></svg>WhatsApp</a>
            <Link href={en ? "/en/contact" : "/participer#contact"}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>{en ? "Write to us" : "Nous écrire"}</Link>
          </div>
        </div>
        {en ? (
          <div className="footer-join">
            <p className="footer-title">Join the association</p>
            <p>A theme to coordinate, a skill to register, a story to share, a need to report: we answer within two working days.</p>
            <div className="footer-join-actions">
              <Link className="button primary" href="/en/contact">Get in touch <span aria-hidden="true">→</span></Link>
              <Link className="button secondary" href="/diaspora" hrefLang="fr">Register my skills (in French) <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        ) : (
          <div className="footer-join">
            <p className="footer-title">Rejoindre l’association</p>
            <p>Une thématique à coordonner, une compétence à inscrire, un récit à envoyer, un besoin à signaler : nous répondons sous quarante-huit heures ouvrées.</p>
            <div className="footer-join-actions">
              <Link className="button primary" href="/participer">Nous rejoindre <span aria-hidden="true">→</span></Link>
              <Link className="button secondary" href="/diaspora">Inscrire mes compétences <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        )}
        <div className="footer-news">
          <p className="footer-title">{en ? "Newsletter — Subscribe" : "Lettre d’information"}</p>
          <p>{en ? "News from the association (in French), no advertising, unsubscribe at any time." : "Les nouvelles de l’association, sans publicité, désinscription à tout moment."}</p>
          <NewsletterForm lang={en ? "en" : "fr"} />
        </div>
      </div>
      <div className="footer-cols footer-cols--5">
        {colonnes.map((col) => (
          <div key={col.titre}>
            <p className="footer-title">{col.titre}</p>
            {col.liens.map((l) => (
              <Link href={l.href} key={l.href + l.label} hrefLang={l.fr ? "fr" : undefined}>{l.label}{l.fr ? <span className="sr-only"> (in French)</span> : null}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="footer-motto">{en ? "Courage · Discipline · Heritage" : ORG.motto}</span>
        {en ? (
          <span className="footer-legal">
            © 2026 {ORG.name} · Official website{miseAJour ? ` · updated ${miseAJour}` : ""} · <Link href="/mentions-legales" hrefLang="fr">Legal notice (in French)</Link> · <Link href="/accessibilite" hrefLang="fr">Accessibility (in French)</Link> · <Link href="/transparence#comment-nous-signaler-un-manquement" hrefLang="fr">Report a breach (in French)</Link> · <Link href="/plan-du-site" hrefLang="fr">Site map (in French)</Link> · <LienLangue />
          </span>
        ) : (
          <span className="footer-legal">
            © 2026 {ORG.name} · Site officiel{miseAJour ? ` · mis à jour le ${miseAJour}` : ""} · <Link href="/mentions-legales">Mentions légales</Link> · <Link href="/accessibilite">Accessibilité</Link> · <Link href="/transparence#comment-nous-signaler-un-manquement">Signaler un manquement</Link> · <Link href="/plan-du-site">Plan du site</Link> · <Link href="/archives">Archives</Link> · <LienLangue />
          </span>
        )}
        <a className="footer-top-link" href="#main-content">{en ? "Back to top" : "Retour en haut"} <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
