"use client";

import Link from "@/components/lien";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { boucleFocus } from "@/components/partager";

/* Palette « Aller à… » : une fenêtre de recherche instantanée sur toutes les
   pages, thématiques, articles et documents du site (index allégé
   public/search-palette.json, chargé à la première ouverture). S'ouvre par le
   bouton loupe de l'en-tête, la touche « / », Ctrl+K ou ⌘K, et se pilote au
   clavier : flèches, Entrée, Échap. Sans texte, des raccourcis ; avec un texte
   sans résultat, la recherche complète et la recherche de village. */

type Entry = { t: string; r: string; k: string; d: string };

const RACCOURCIS: Entry[] = [
  { t: "Retrouver mon village", r: "/villages", k: "Raccourci", d: "966 fiches de localités, une par village, quartier ou canton" },
  { t: "Le projet ODEB LONODJI", r: "/odeb", k: "Raccourci", d: "Vision 2030, six missions, six programmes, livre blanc" },
  { t: "Signaler un besoin", r: "/dossiers/besoins", k: "Raccourci", d: "Eau, école, santé, route : localité par localité" },
  { t: "Nos actions : pôles et thématiques", r: "/programmes", k: "Raccourci", d: "Quatre pôles, vingt thématiques, directions et coordonnateurs" },
  { t: "Secteurs d’intervention", r: "/secteurs", k: "Raccourci", d: "WASH, santé, nutrition, urgences… nos thématiques en langue ONG" },
  { t: "Le journal", r: "/journal", k: "Raccourci", d: "Articles datés et sourcés, lettre d’information" },
  { t: "Adhérer, écrire, nous soutenir", r: "/participer", k: "Raccourci", d: "Formulaire, WhatsApp, téléphone ; réponse sous 48 h" },
  { t: "Carte du territoire", r: "/carte", k: "Raccourci", d: "Quatorze unités, localités, équipements" },
  { t: "Tableau de bord d’impact", r: "/impact", k: "Raccourci", d: "Six indicateurs datés et sourcés" },
];

const ORDRE = ["Raccourci", "Page", "Direction de pôle", "Thématique", "Article", "Plaidoyer", "Document PDF", "Document à venir", "In English", "Dossier"];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ");
const estChamp = (el: Element | null) => !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || (el as HTMLElement).isContentEditable);

export default function Palette() {
  const [ouverte, setOuverte] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [sel, setSel] = useState(0);
  const champ = useRef<HTMLInputElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const boite = useRef<HTMLDivElement>(null);
  const declencheur = useRef<HTMLElement | null>(null);   // élément à qui rendre le focus à la fermeture
  const navigue = useRef(false);                          // fermeture par navigation : le focus suit la nouvelle page
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const ouvrir = () => setOuverte(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setOuverte((v) => !v); return; }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !estChamp(document.activeElement)) { e.preventDefault(); setOuverte(true); }
    };
    window.addEventListener("lonodji:palette", ouvrir);
    document.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("lonodji:palette", ouvrir); document.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => { setOuverte(false); }, [pathname]);

  useEffect(() => {
    if (!ouverte) { document.body.classList.remove("palette-open"); setQ(""); setSel(0); return; }
    document.body.classList.add("palette-open");
    const t = setTimeout(() => champ.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [ouverte]);
  useEffect(() => {
    if (ouverte && !index) fetch("/search-palette.json").then((r) => r.json()).then(setIndex).catch(() => setIndex([]));
  }, [ouverte, index]);

  // piège de focus : on mémorise le déclencheur, Tab boucle dans la boîte, Échap ferme,
  // et le focus revient au déclencheur à la fermeture (sauf navigation vers une autre page)
  useEffect(() => {
    if (!ouverte) return;
    const actif = document.activeElement;
    declencheur.current = actif instanceof HTMLElement && actif !== document.body ? actif : null;
    navigue.current = false;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setOuverte(false); return; }
      boucleFocus(e, boite.current);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const d = declencheur.current;
      declencheur.current = null;
      if (d && d.isConnected && !navigue.current) window.setTimeout(() => d.focus({ preventScroll: true }), 0);
    };
  }, [ouverte]);

  const texte = q.trim();
  const resultats = useMemo<Entry[]>(() => {
    const n = norm(texte);
    if (!n) return RACCOURCIS;
    if (!index) return [];
    const termes = n.split(/\s+/).filter(Boolean);
    const notes: { e: Entry; s: number }[] = [];
    for (const e of index) {
      const t = norm(e.t), d = norm(e.d || "");
      let s = 0;
      for (const terme of termes) {
        if (t === terme) s += 10;
        else if (t.startsWith(terme)) s += 6;
        else if (t.includes(terme)) s += 4;
        else if (d.includes(terme)) s += 1;
        else { s = -1; break; }
      }
      if (s < 0) continue;
      if (e.k === "Page") s += 1;
      if (e.k === "Raccourci") s += 2;
      notes.push({ e, s });
    }
    notes.sort((a, b) => b.s - a.s || ORDRE.indexOf(a.e.k) - ORDRE.indexOf(b.e.k));
    return notes.slice(0, 14).map((x) => x.e);
  }, [texte, index]);

  const actionSite: Entry = { t: `Chercher « ${texte} » dans tout le site`, r: `/recherche?q=${encodeURIComponent(texte)}`, k: "Action", d: "Tous les contenus, avec des extraits" };
  const actionVillage: Entry = { t: `Chercher le village « ${texte} »`, r: `/villages?q=${encodeURIComponent(texte)}`, k: "Action", d: "Parmi 966 localités nommées" };
  // aucune page ne correspond : c'est sans doute un nom de lieu, la recherche de village passe d'abord
  const actions: Entry[] = !texte ? [] : index && !resultats.length ? [actionVillage, actionSite] : [actionSite, actionVillage];
  const tout = [...resultats, ...actions];

  useEffect(() => { setSel(0); }, [texte]);
  useEffect(() => {
    const el = liste.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const aller = (e: Entry) => { navigue.current = true; setOuverte(false); router.push(e.r); };
  const onKeyChamp = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(tout.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (tout[sel]) aller(tout[sel]); }
  };

  if (!ouverte) return null;
  let i = -1;
  const groupes = ORDRE.concat(["Action"]).map((k) => ({ k, items: tout.filter((e) => e.k === k) })).filter((g) => g.items.length);
  return (
    <div className="palette" role="dialog" aria-modal="true" aria-label="Aller à une page du site">
      <div className="palette-fond" onClick={() => setOuverte(false)} />
      <div className="palette-boite" ref={boite}>
        <div className="palette-champ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={champ}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyChamp}
            placeholder="Une page, un village, une thématique, un article…"
            aria-label="Aller à…"
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-controls="palette-liste"
            aria-activedescendant={tout[sel] ? `palette-${sel}` : undefined}
            autoComplete="off"
            enterKeyHint="go"
          />
          <button type="button" className="palette-fermer" onClick={() => setOuverte(false)} aria-label="Fermer (Échap)">Échap</button>
        </div>
        {texte && !index ? <p className="palette-vide" role="status">Chargement de l’index…</p> : null}
        {texte && index && !resultats.length ? <p className="palette-vide" role="status">Aucune page avec ce titre ; cherchez-le parmi les villages ou dans tout le site ci-dessous.</p> : null}
        <ul className="palette-liste" id="palette-liste" role="listbox" aria-label="Résultats" ref={liste}>
          {groupes.map((g) => (
            <li key={g.k} className="palette-groupe" role="group" aria-labelledby={`palette-g-${g.k.replace(/\W+/g, "-")}`}>
              <span className="palette-titre" id={`palette-g-${g.k.replace(/\W+/g, "-")}`}>{g.k === "Raccourci" ? "Où aller ?" : g.k === "Action" ? "Sinon" : g.k}</span>
              <ul role="presentation">
                {g.items.map((e) => {
                  i += 1;
                  const k = i;
                  // l'option est le lien lui-même (pas de lien dans une option) ; hors de l'ordre de tabulation :
                  // on la choisit aux flèches depuis le champ (aria-activedescendant)
                  return (
                    <li key={e.r + e.t} role="presentation" data-i={k} className={k === sel ? "palette-option is-selected" : "palette-option"} onMouseEnter={() => setSel(k)}>
                      <Link href={e.r} role="option" id={`palette-${k}`} aria-selected={k === sel} tabIndex={-1} onClick={() => { navigue.current = true; setOuverte(false); }}>
                        <strong>{e.t}</strong>
                        {e.d ? <span>{e.d}</span> : null}
                        <b aria-hidden="true">↵</b>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <div className="palette-pied">
          <span><kbd>↑</kbd><kbd>↓</kbd> choisir · <kbd>↵</kbd> ouvrir · <kbd>Échap</kbd> fermer</span>
          <Link href="/recherche" onClick={() => { navigue.current = true; setOuverte(false); }}>Recherche complète <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  );
}
