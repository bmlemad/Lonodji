import Link from "@/components/lien";

/* Page 404 : jamais une impasse — recherche, et les quatre portes les plus demandées. */
export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <p className="eyebrow">404 — Page introuvable</p>
      <h1>Cette page n’existe pas.</h1>
      <p>Le contenu recherché a peut-être été déplacé ou renommé. Cherchez-le, ou reprenez par l’une de ces portes.</p>
      <form className="not-found-recherche" action="/recherche" method="get" role="search">
        <label htmlFor="nf-q">Rechercher sur le site</label>
        <input id="nf-q" name="q" type="search" placeholder="Un village, une thématique, un mot…" />
        <button className="button primary" type="submit">Rechercher</button>
      </form>
      <ul className="not-found-liens">
        <li><Link href="/villages">Retrouver son village</Link></li>
        <li><Link href="/participer?objet=autre#contact">Nous écrire</Link></li>
        <li><Link href="/plan-du-site">Plan du site</Link></li>
        <li><Link href="/en/index" hrefLang="en" lang="en">English</Link></li>
      </ul>
      <Link className="text-link" href="/">Retour à l’accueil <span aria-hidden="true">→</span></Link>
    </main>
  );
}
