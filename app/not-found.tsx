import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <p className="eyebrow">404 — Page introuvable</p>
      <h1>Cette page n’existe pas.</h1>
      <p>Le contenu recherché a peut-être été déplacé. Revenez à l’accueil pour continuer votre découverte d’ADEB LONODJI.</p>
      <Link className="button primary" href="/">Retour à l’accueil <span aria-hidden="true">↗</span></Link>
    </main>
  );
}
