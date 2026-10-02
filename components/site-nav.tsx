"use client";

import Link from "@/components/lien";
import { useChemin } from "@/components/chemin";
import { useCallback, useEffect, useRef, useState } from "react";
import { entreeCourante, entreeCouranteEn, NAVIGATION, NAVIGATION_EN, type NavChiffres, type NavEntree } from "../lib/navigation";
import { IDENTITE } from "../lib/odeb";
import { equivalent } from "@/lib/langues";

/* En-tête du site : barre fixe, méga-menu par section sur ordinateur (bouton
   « disclosure » + panneau en colonnes et carte en vedette), menu plein écran
   sur tablette et mobile (recherche, groupes dépliables, actions). Une seule
   source de données : lib/navigation.ts. */

type Props = { lang?: "fr" | "en"; chiffres: NavChiffres; whatsapp: string; telephone: string; telephoneHref: string; devise: string };

/* Pages anglaises : pas de méga-menu (ses libellés sont en français), une liste simple. */

const Fleche = () => <svg className="nav-chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;

export default function SiteNav({ lang = "fr", chiffres, whatsapp, telephoneHref, devise }: Props) {
  const pathname = useChemin();
  const [ouvert, setOuvert] = useState<string | null>(null);   // panneau ouvert (ordinateur)
  const [menu, setMenu] = useState(false);                     // menu plein écran (tablette, mobile)
  const [large, setLarge] = useState(true);                    // ≥ 641 px : groupes du menu mobile dépliés
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const en = lang === "en";
  const chemin = (pathname || "/").replace(/\/$/, "") || "/";
  const courante = en ? entreeCouranteEn(chemin) : entreeCourante(pathname);
  const MENU = en ? NAVIGATION_EN : NAVIGATION;                // mêmes six rubriques dans les deux langues
  const autre = equivalent(chemin);                            // la même page dans l'autre langue
  const timer = useRef<number | undefined>(undefined);
  const fine = useRef(false);                                  // pointeur précis (souris) : ouverture au survol

  const annuler = () => { if (timer.current) { window.clearTimeout(timer.current); timer.current = undefined; } };
  const ouvrir = useCallback((id: string) => { annuler(); setOuvert(id); }, []);
  const fermer = useCallback(() => { annuler(); setOuvert(null); }, []);
  const fermerDoucement = useCallback(() => { annuler(); timer.current = window.setTimeout(() => setOuvert(null), 280); }, []);

  useEffect(() => {
    fine.current = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const mq = window.matchMedia("(min-width:641px)");
    const maj = () => setLarge(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);

  // changement de page : tout se referme
  useEffect(() => { setOuvert(null); setMenu(false); }, [pathname]);

  // la barre d'onglets de l'appli (components/app-shell.tsx) ouvre et ferme le menu mobile
  useEffect(() => {
    const surDemande = (e: Event) => setMenu(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener("lonodji:menu", surDemande);
    return () => window.removeEventListener("lonodji:menu", surDemande);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lonodji:menu-state", { detail: menu }));
    if (!menu) return;
    // menu ouvert : le reste de la page est inerte, Tab boucle entre le bouton « Menu »
    // et le dernier lien du menu, Échap ferme et rend le focus au bouton
    const inertes = Array.from(document.querySelectorAll<HTMLElement>("main, footer")).filter((el) => !el.inert && !menuRef.current?.contains(el));
    inertes.forEach((el) => { el.inert = true; });
    const focalisables = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), summary') || []).filter((el) => el.offsetParent !== null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenu(false); toggleRef.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const els = focalisables();
      const dernier = els[els.length - 1];
      const actif = document.activeElement;
      if (!event.shiftKey && dernier && actif === dernier) { event.preventDefault(); toggleRef.current?.focus(); }
      else if (event.shiftKey && actif === toggleRef.current && dernier) { event.preventDefault(); dernier.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
      inertes.forEach((el) => { el.inert = false; });
    };
  }, [menu]);

  // panneau ouvert : Échap, clic ailleurs, défilement long le referment
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const bouton = navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="mega-${ouvert}"]`);
      fermer();
      bouton?.focus();
    };
    const onPointer = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) fermer(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [ouvert, fermer]);

  const surSortieFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) fermerDoucement();
  };

  // rendu d'une entrée de la barre (fonction, pas composant : pas de remontage à chaque rendu)
  const rendreEntree = (e: NavEntree) => {
    const estCourante = courante === e.id;
    if (!e.colonnes) {
      return <Link className={estCourante ? "nav-lien is-current" : "nav-lien"} href={e.href} key={e.id} aria-current={estCourante ? "page" : undefined}>{e.court || e.label}</Link>;
    }
    const on = ouvert === e.id;
    return (
      <div
        key={e.id}
        className={on ? "nav-entree is-open" : "nav-entree"}
        onPointerEnter={(ev) => { if (ev.pointerType === "mouse" && fine.current) { annuler(); timer.current = window.setTimeout(() => setOuvert(e.id), 70); } }}
        onPointerLeave={(ev) => { if (ev.pointerType === "mouse" && fine.current) fermerDoucement(); }}
        onBlur={surSortieFocus}
      >
        <button
          type="button"
          className={estCourante ? "nav-lien nav-bouton is-current" : "nav-lien nav-bouton"}
          aria-expanded={on}
          aria-controls={`mega-${e.id}`}
          aria-current={estCourante ? "true" : undefined}
          onClick={() => (on ? fermer() : ouvrir(e.id))}
          onKeyDown={(ev) => {
            if (ev.key === "ArrowDown") { ev.preventDefault(); ouvrir(e.id); window.setTimeout(() => navRef.current?.querySelector<HTMLAnchorElement>(`#mega-${e.id} a`)?.focus(), 0); }
          }}
        >
          <span>{e.court || e.label}</span><Fleche />
        </button>
        <div className="mega" id={`mega-${e.id}`} hidden={!on} aria-label={e.label}>
          <div className="mega-inner">
            <div className="mega-tete">
              <Link className="mega-tout" href={e.href} onClick={fermer}>{e.label} <span aria-hidden="true">→</span></Link>
            </div>
            <div className="mega-cols" style={{ ["--mega-cols" as string]: e.colonnes.length }}>
              {e.colonnes.map((c) => (
                <div className="mega-col" key={c.titre}>
                  <p className="mega-titre">{c.titre}</p>
                  <ul>
                    {c.liens.map((l) => (
                      <li key={l.href + l.label}>
                        {l.externe
                          ? <a href={l.href} target="_blank" rel="noopener noreferrer"><b>{l.label}</b>{l.note ? <span>{l.note}</span> : null}</a>
                          : l.href === "/en/index"
                            ? <Link href={autre.href} lang="en" hrefLang="en" onClick={fermer}><b>English</b>{l.note ? <span>{autre.exact ? "This page in English" : l.note}</span> : null}</Link>
                            : <Link href={l.href} onClick={fermer} aria-current={pathname === l.href ? "page" : undefined} hrefLang={l.fr ? "fr" : undefined}><b>{l.label}{l.fr ? <i className="mega-fr" title="Page in French">FR<span className="sr-only"> (in French)</span></i> : null}</b>{l.note ? <span>{l.note}</span> : null}</Link>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {e.vedette ? (
                <Link className="mega-vedette" href={e.vedette.href} onClick={fermer}>
                  {e.vedette.image ? <img className="mega-vedette-img" src={e.vedette.image} alt="" width={64} height={64} loading="lazy" decoding="async" /> : null}
                  <small>{e.vedette.kicker}</small>
                  <strong>{e.vedette.titre(chiffres)}</strong>
                  <span>{e.vedette.texte(chiffres)}</span>
                  <b>{e.vedette.label} <i aria-hidden="true">→</i></b>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="nav" aria-label={en ? "Main navigation" : "Navigation principale"} ref={navRef}>
        <Link className="brand" href={en ? "/en/index" : "/"} aria-label={en ? "ADEB LONODJI — home" : "ADEB LONODJI — accueil"} onClick={() => { fermer(); setMenu(false); }}><span className="logo-verre" aria-hidden="true"><img src="/icones/logo-motif-verre.svg" alt="" width={30} height={34} decoding="async" /></span><span className="brand-name"><span className="brand-mot"><span>ADEB</span>{" "}<b>LONODJI</b></span><span className="brand-sous">{en ? "Bédjondo & its diaspora" : "Bédjondo & sa diaspora"}</span></span></Link>
        <div className="links">
          {MENU.map(rendreEntree)}
        </div>
        <Link className="nav-search" href="/recherche" aria-label={en ? "Search" : "Rechercher ou aller à une page (touche / ou Ctrl+K)"} title={en ? "Search · / or Ctrl+K" : "Rechercher · / ou Ctrl+K"} onClick={(e) => { e.preventDefault(); fermer(); setMenu(false); window.dispatchEvent(new CustomEvent("lonodji:palette")); }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></Link>
        <Link className="nav-langue" href={autre.href} lang={autre.lang} hrefLang={autre.lang} aria-label={en ? "Lire cette page en français" : "Read this page in English"} title={en ? "Lire cette page en français" : "Read this page in English"} onClick={fermer}>{en ? "FR" : "EN"}</Link>
        <button className="nav-share" type="button" aria-label={en ? "Share this page" : "Partager cette page"} title={en ? "Share this page" : "Partager cette page"} onClick={() => { fermer(); setMenu(false); window.dispatchEvent(new CustomEvent("lonodji:partager")); }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4" /><path d="m8 8 4-4 4 4" /><path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" /></svg></button>
        <Link className="nav-cta" href={en ? "/en/contact" : "/participer"} onClick={fermer}><span>{en ? "Join us" : "Nous rejoindre"}</span><b aria-hidden="true">→</b></Link>
        <button className="menu-toggle" type="button" ref={toggleRef} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? (en ? "Close navigation menu" : "Fermer le menu de navigation") : (en ? "Open navigation menu" : "Ouvrir le menu de navigation")} onClick={() => { fermer(); setMenu((v) => !v); }}><span>{menu ? (en ? "Close" : "Fermer") : "Menu"}</span><i aria-hidden="true">{menu
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}</i></button>
      </nav>

      <div className={menu ? "mobile-menu is-open" : "mobile-menu"} id="mobile-menu" aria-hidden={!menu} inert={!menu} ref={menuRef}>
        <div className="mobile-menu-inner">
          <form className="mm-search" action="/recherche" method="get" role="search" onSubmit={() => setMenu(false)}>
            <label className="sr-only" htmlFor="mm-q">{en ? "Search the site (in French)" : "Rechercher dans le site"}</label>
            <input id="mm-q" name="q" type="search" placeholder={en ? "Search a village, a page, a word…" : "Rechercher un village, un dossier, un mot…"} autoComplete="off" />
            <button type="submit" aria-label={en ? "Search" : "Lancer la recherche"}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></button>
          </form>
          <div className="mm-groups">
            {MENU.map((e) => {
              const estCourante = courante === e.id;
              if (!e.colonnes) {
                return <Link className={estCourante ? "mm-lien is-current" : "mm-lien"} href={e.href} key={e.id} aria-current={estCourante ? "page" : undefined} onClick={() => setMenu(false)}><span>{e.label}</span><b aria-hidden="true">→</b></Link>;
              }
              return (
                <details className="mm-group" key={e.id} open={large || estCourante || undefined}>
                  <summary><span className={estCourante ? "is-current" : undefined}>{e.label}</span><Fleche /></summary>
                  <div className="mm-group-body">
                    <Link className="mm-tout" href={e.href} onClick={() => setMenu(false)}>{en ? <>All of “{e.label}”</> : <>Tout sur « {e.label} »</>} <span aria-hidden="true">→</span></Link>
                    <ul>
                      {e.colonnes.flatMap((c) => c.liens).map((l) => (
                        <li key={l.href + l.label}>
                          {l.externe
                            ? <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                            : l.href === "/en/index"
                              ? <Link href={autre.href} lang="en" hrefLang="en" onClick={() => setMenu(false)}>English</Link>
                              : <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} hrefLang={l.fr ? "fr" : undefined} onClick={() => setMenu(false)}>{l.label}{l.fr ? <i className="mega-fr">FR<span className="sr-only"> (in French)</span></i> : null}</Link>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
          <div className="mm-actions">
            <Link className="button primary" href={en ? "/en/contact" : "/participer"} onClick={() => setMenu(false)}>{en ? "Join us" : "Nous rejoindre"} <span aria-hidden="true">→</span></Link>
            <a className="button secondary" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
            <button className="button secondary install-cta" type="button" onClick={() => { setMenu(false); window.dispatchEvent(new Event("lonodji:install")); }}>{en ? "Install the app" : "Installer l’application"} <span aria-hidden="true">↓</span></button>
          </div>
          <p className="mm-foot">
            <span>{devise}</span>
            <a href={telephoneHref} aria-label={en ? "Call the association" : "Appeler l’association"} title={en ? "Call the association" : "Appeler l’association"}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg></a>
            <Link href={autre.href} lang={autre.lang} hrefLang={autre.lang} onClick={() => setMenu(false)}>{en ? "Français" : "English"}</Link>
            <Link href="/plan-du-site" lang={en ? "fr" : undefined} hrefLang={en ? "fr" : undefined} onClick={() => setMenu(false)}>Plan du site</Link>
          </p>
        </div>
      </div>
    </>
  );
}
