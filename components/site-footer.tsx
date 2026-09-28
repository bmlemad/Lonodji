import Link from "next/link";
import { ORG } from "../lib/content";
import NewsletterForm from "./newsletter-form";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div className="footer-brand-block">
          <div className="footer-brand"><span className="footer-mark">A</span><strong>ADEB <b>LONODJI</b></strong></div>
          <p>{ORG.tagline}</p>
          <p>{ORG.place}</p>
          <a href={ORG.phoneHref}>{ORG.phone}</a>
          <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <div>
          <p className="footer-title">L’association</p>
          <Link href="/mission">Notre mission</Link>
          <Link href="/histoire">Histoire & patrimoine</Link>
          <Link href="/transparence">Redevabilité</Link>
          <Link href="/documents">Documents</Link>
          <Link href="/archives">Archives du site</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </div>
        <div>
          <p className="footer-title">Agir</p>
          <Link href="/programmes">Les quatre pôles</Link>
          <Link href="/actions">Plaidoyers & engagements</Link>
          <Link href="/impact">Suivi & tableau de bord</Link>
          <Link href="/dossiers">Tous les dossiers</Link>
          <Link href="/journal">Le journal</Link>
        </div>
        <div>
          <p className="footer-title">Participer</p>
          <Link href="/participer#contact">Nous écrire</Link>
          <Link href="/participer#adherer">Adhérer & cotiser</Link>
          <Link href="/participer#soutenir">Nous soutenir</Link>
          <p className="footer-title" style={{ marginTop: 18 }}>Lettre d’information</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-bottom">
        <span>{ORG.motto}</span>
        <span>© 2026 {ORG.name} · <Link href="/plan-du-site">Plan du site</Link> · <Link href="/en/index">English</Link></span>
        <a href="#main-content">Retour en haut ↑</a>
      </div>
    </footer>
  );
}
