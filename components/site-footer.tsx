import Link from "@/components/lien";
import { IDENTITE } from "../lib/odeb";
import { ORG } from "../lib/content";
import { PIED } from "../lib/navigation";
import NewsletterForm from "./newsletter-form";

/* Pied de page : un bandeau (qui nous sommes, comment nous joindre, lettre
   d'information), cinq colonnes de liens (lib/navigation.ts, PIED) et la
   ligne de fin (devise, mentions, langue, retour en haut). */
export default function SiteFooter({ miseAJour }: { miseAJour?: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-block">
          <div className="footer-brand"><img className="footer-mark footer-mark--embleme" src={IDENTITE.embleme} alt="" width={30} height={30} loading="lazy" decoding="async" /><strong>ADEB <b>LONODJI</b></strong></div>
          <p className="footer-tagline">{ORG.tagline}</p>
          <p className="footer-place">{ORG.fullName}<br />{ORG.place}</p>
          <div className="footer-contact">
            <a href={ORG.phoneHref}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>{ORG.phone}</a>
            <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.6-4A8 8 0 1 1 20 11.5z" /></svg>WhatsApp</a>
            <Link href="/participer#contact"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>Nous écrire</Link>
          </div>
        </div>
        <div className="footer-join">
          <p className="footer-title">Rejoindre l’association</p>
          <p>Une thématique à coordonner, une compétence à inscrire, un récit à envoyer, un besoin à signaler : nous répondons sous quarante-huit heures ouvrées.</p>
          <div className="footer-join-actions">
            <Link className="button primary" href="/participer">Nous rejoindre <span aria-hidden="true">↗</span></Link>
            <Link className="button secondary" href="/diaspora">Inscrire mes compétences <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="footer-news">
          <p className="footer-title">Lettre d’information</p>
          <p>Les nouvelles de l’association, sans publicité, désinscription à tout moment.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-cols footer-cols--5">
        {PIED.map((col) => (
          <div key={col.titre}>
            <p className="footer-title">{col.titre}</p>
            {col.liens.map((l) => <Link href={l.href} key={l.href + l.label}>{l.label}</Link>)}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="footer-motto">{ORG.motto}</span>
        <span className="footer-legal">
          © 2026 {ORG.name} · Site officiel{miseAJour ? ` · mis à jour le ${miseAJour}` : ""} · <Link href="/mentions-legales">Mentions légales</Link> · <Link href="/accessibilite">Accessibilité</Link> · <Link href="/transparence#comment-nous-signaler-un-manquement">Signaler un manquement</Link> · <Link href="/plan-du-site">Plan du site</Link> · <Link href="/archives">Archives</Link> · <Link href="/en/index" lang="en">English</Link> · <Link href="/redaction" rel="nofollow">Rédaction</Link>
        </span>
        <a className="footer-top-link" href="#main-content">Retour en haut <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
