"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Espace de rédaction privé du journal (client). Le mot de passe part en POST,
   le jeton de session voyage en en-tête Authorization et vit dans
   sessionStorage (l'onglet fermé, il faut se reconnecter). */

type Statut = "brouillon" | "a-relire" | "pret";
type Brouillon = { id: string; titre: string; chapo: string; rubrique: string; statut: Statut; corps: string; auteur: string; cree: string; maj: string };
type Resume = Pick<Brouillon, "id" | "titre" | "rubrique" | "statut" | "maj">;
type Rubrique = { slug: string; label: string };
type Etat = "chargement" | "creer" | "connexion" | "editeur";

const STATUTS: { valeur: Statut; label: string }[] = [
  { valeur: "brouillon", label: "Brouillon" },
  { valeur: "a-relire", label: "À relire" },
  { valeur: "pret", label: "Prêt à publier" },
];
const CLE = "lonodji-redaction-jeton";
const VIDE = (): Brouillon => ({ id: "", titre: "", chapo: "", rubrique: "vie-association", statut: "brouillon", corps: "", auteur: "Rédaction ADEB LONODJI", cree: "", maj: "" });

/* ---------- rendu du corps : Markdown allégé, texte échappé d'abord ---------- */

function echapper(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function enLigne(s: string) {
  return echapper(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\*)([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*|#[^)\s]*)\)/g, '<a href="$2" rel="noopener">$1</a>');
}

export function rendre(corps: string): string {
  const lignes = corps.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let liste: { type: "ul" | "ol"; items: string[] } | null = null;
  let citation: string[] = [];
  const fermerPara = () => { if (para.length) { out.push(`<p>${enLigne(para.join(" "))}</p>`); para = []; } };
  const fermerListe = () => { if (liste) { out.push(`<${liste.type}>${liste.items.map((i) => `<li>${enLigne(i)}</li>`).join("")}</${liste.type}>`); liste = null; } };
  const fermerCitation = () => { if (citation.length) { out.push(`<blockquote><p>${enLigne(citation.join(" "))}</p></blockquote>`); citation = []; } };
  const tout = () => { fermerPara(); fermerListe(); fermerCitation(); };
  for (const brute of lignes) {
    const l = brute.trimEnd();
    let m: RegExpMatchArray | null;
    if (!l.trim()) { tout(); continue; }
    if ((m = l.match(/^(#{2,4})\s+(.+)$/))) { tout(); const n = m[1].length; out.push(`<h${n}>${enLigne(m[2])}</h${n}>`); continue; }
    if ((m = l.match(/^[-*]\s+(.+)$/))) { fermerPara(); fermerCitation(); if (!liste || liste.type !== "ul") { fermerListe(); liste = { type: "ul", items: [] }; } liste.items.push(m[1]); continue; }
    if ((m = l.match(/^\d+[.)]\s+(.+)$/))) { fermerPara(); fermerCitation(); if (!liste || liste.type !== "ol") { fermerListe(); liste = { type: "ol", items: [] }; } liste.items.push(m[1]); continue; }
    if ((m = l.match(/^>\s?(.*)$/))) { fermerPara(); fermerListe(); citation.push(m[1]); continue; }
    if (/^(---|\*\*\*)$/.test(l.trim())) { tout(); out.push("<hr>"); continue; }
    fermerListe(); fermerCitation(); para.push(l.trim());
  }
  tout();
  return out.join("\n");
}

function motsDe(corps: string) { return corps.split(/\s+/).filter(Boolean).length; }
function dateFr(iso: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); } catch { return iso.slice(0, 10); }
}
function heure(iso: string) {
  try { return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
}
function couperTitre(t: string): [string, string] {
  const mots = t.split(" ");
  if (mots.length < 5) return [t, ""];
  const c = Math.ceil(mots.length * 0.55);
  return [mots.slice(0, c).join(" "), mots.slice(c).join(" ")];
}

/* ---------- appels API ---------- */

async function api(corps: Record<string, unknown>, jeton?: string) {
  const r = await fetch("/api/redaction", { method: "POST", headers: { "Content-Type": "application/json", ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) }, body: JSON.stringify(corps) });
  const d = await r.json().catch(() => ({ erreur: "Réponse illisible." }));
  if (!r.ok) throw Object.assign(new Error(d.erreur || `Erreur ${r.status}`), { statut: r.status });
  return d;
}

export default function RedactionApp({ rubriques }: { rubriques: Rubrique[] }) {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [jeton, setJeton] = useState("");
  const [message, setMessage] = useState("");
  const [liste, setListe] = useState<Resume[]>([]);
  const [courant, setCourant] = useState<Brouillon>(VIDE());
  const [sauve, setSauve] = useState("");
  const [modifie, setModifie] = useState(false);
  const [vue, setVue] = useState<"ecrire" | "apercu">("ecrire");
  const [mdp, setMdp] = useState(false);
  const minuterie = useRef<ReturnType<typeof setTimeout> | null>(null);
  const courantRef = useRef(courant);
  courantRef.current = courant;

  const deconnecter = useCallback(() => {
    try { sessionStorage.removeItem(CLE); } catch { /* rien */ }
    setJeton(""); setListe([]); setCourant(VIDE()); setEtat("connexion"); setMessage("");
  }, []);

  const charger = useCallback(async (j: string) => {
    const d = await api({ action: "liste" }, j);
    setListe(d.brouillons);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/redaction", { cache: "no-store" });
        const d = await r.json();
        if (!d.existe) { setEtat("creer"); return; }
        let j = "";
        try { j = sessionStorage.getItem(CLE) || ""; } catch { /* rien */ }
        if (j) {
          try { await charger(j); setJeton(j); setEtat("editeur"); return; } catch { try { sessionStorage.removeItem(CLE); } catch { /* rien */ } }
        }
        setEtat("connexion");
      } catch {
        setEtat("connexion"); setMessage("Le serveur ne répond pas : vérifiez la connexion.");
      }
    })();
  }, [charger]);

  const entrer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const motDePasse = String(f.get("motDePasse") || "");
    setMessage("");
    try {
      if (etat === "creer") {
        if (motDePasse !== String(f.get("confirmation") || "")) { setMessage("Les deux saisies ne correspondent pas."); return; }
      }
      const d = await api(etat === "creer" ? { action: "creer", motDePasse, invitation: String(f.get("invitation") || "") } : { action: "connexion", motDePasse });
      try { sessionStorage.setItem(CLE, d.jeton); } catch { /* stockage indisponible : la session vit en mémoire */ }
      setJeton(d.jeton);
      await charger(d.jeton);
      setEtat("editeur");
    } catch (err) { setMessage((err as Error).message); }
  };

  const enregistrer = useCallback(async (b: Brouillon, silencieux = false) => {
    if (!b.titre.trim() && !b.corps.trim()) return;
    if (!silencieux) setSauve("Enregistrement…");
    try {
      const d = await api({ action: "enregistrer", brouillon: b }, jeton);
      const nb: Brouillon = d.brouillon;
      setCourant((c) => (c.id === b.id || !c.id ? { ...c, id: nb.id, cree: nb.cree, maj: nb.maj } : c));
      setModifie(false);
      setSauve(`Enregistré à ${heure(nb.maj)}`);
      await charger(jeton);
    } catch (err) {
      const e = err as Error & { statut?: number };
      if (e.statut === 401) { setSauve("Session expirée : reconnectez-vous (le texte reste dans cet onglet)."); }
      else setSauve("Non enregistré : " + e.message);
    }
  }, [jeton, charger]);

  // enregistrement automatique 1,5 s après la dernière frappe
  const modifier = (patch: Partial<Brouillon>) => {
    const b = { ...courantRef.current, ...patch };
    setCourant(b); setModifie(true); setSauve("Modifié…");
    if (minuterie.current) clearTimeout(minuterie.current);
    minuterie.current = setTimeout(() => enregistrer(b, true), 1500);
  };

  const ouvrir = async (id: string) => {
    if (modifie) await enregistrer(courantRef.current, true);
    try { const d = await api({ action: "lire", id }, jeton); setCourant(d.brouillon); setModifie(false); setSauve(`Enregistré à ${heure(d.brouillon.maj)}`); setVue("ecrire"); }
    catch (err) { setSauve((err as Error).message); }
  };

  const nouveau = async () => { if (modifie) await enregistrer(courantRef.current, true); setCourant(VIDE()); setModifie(false); setSauve(""); setVue("ecrire"); };

  const supprimer = async () => {
    if (!courant.id) { setCourant(VIDE()); return; }
    if (!window.confirm("Supprimer ce brouillon ? Cette action est définitive.")) return;
    try { await api({ action: "supprimer", id: courant.id }, jeton); setCourant(VIDE()); setModifie(false); setSauve(""); await charger(jeton); }
    catch (err) { setSauve((err as Error).message); }
  };

  const exporter = () => {
    const b = courantRef.current;
    const rub = rubriques.find((r) => r.slug === b.rubrique)?.label || b.rubrique;
    const md = `---\ntitre: ${b.titre}\nchapo: ${b.chapo}\nrubrique: ${b.rubrique} (${rub})\nstatut: ${b.statut}\nauteur: ${b.auteur}\ndate: ${(b.maj || new Date().toISOString()).slice(0, 10)}\n---\n\n${b.corps}\n`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown;charset=utf-8" }));
    a.download = `${(b.maj || new Date().toISOString()).slice(0, 10)}-${(b.titre || "brouillon").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60)}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const changerMdp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nouveau = String(f.get("nouveau") || "");
    if (nouveau !== String(f.get("confirmation") || "")) { setMessage("Les deux saisies ne correspondent pas."); return; }
    try {
      const d = await api({ action: "changer", ancien: String(f.get("ancien") || ""), nouveau }, jeton);
      try { sessionStorage.setItem(CLE, d.jeton); } catch { /* rien */ }
      setJeton(d.jeton); setMdp(false); setMessage("Mot de passe changé : les autres sessions sont déconnectées.");
    } catch (err) { setMessage((err as Error).message); }
  };

  const apercu = useMemo(() => rendre(courant.corps), [courant.corps]);
  const rubriqueLabel = rubriques.find((r) => r.slug === courant.rubrique)?.label || "Le journal";
  const [titre1, titre2] = couperTitre(courant.titre || "Titre de l’article");
  const mots = motsDe(courant.corps);

  if (etat === "chargement") return <p className="rd-note" aria-live="polite">Chargement de l’espace de rédaction…</p>;

  if (etat === "creer" || etat === "connexion") {
    return (
      <form className="rd-porte" onSubmit={entrer}>
        <h2>{etat === "creer" ? "Choisir le mot de passe de l’espace" : "Entrer dans l’espace de rédaction"}</h2>
        <p>{etat === "creer" ? "Aucun mot de passe n’existe encore. Saisissez le code d’invitation remis à l’animation, puis choisissez le mot de passe qui protégera l’espace. Dix caractères au moins ; gardez-le dans un gestionnaire de mots de passe, il n’est stocké qu’en empreinte." : "Le mot de passe est celui choisi à la première visite. Cinq erreurs bloquent l’entrée un quart d’heure."}</p>
        {etat === "creer" ? <label>Code d’invitation<input type="text" name="invitation" autoComplete="off" spellCheck={false} required /></label> : null}
        <label>Mot de passe<input type="password" name="motDePasse" autoComplete={etat === "creer" ? "new-password" : "current-password"} minLength={etat === "creer" ? 10 : 1} required autoFocus /></label>
        {etat === "creer" ? <label>Confirmer le mot de passe<input type="password" name="confirmation" autoComplete="new-password" minLength={10} required /></label> : null}
        {message ? <p className="rd-erreur" role="alert">{message}</p> : null}
        <button className="button primary" type="submit">{etat === "creer" ? "Créer et entrer" : "Entrer"} <span aria-hidden="true">→</span></button>
      </form>
    );
  }

  return (
    <div className="rd-app">
      <aside className="rd-liste" aria-label="Brouillons">
        <div className="rd-liste-tete">
          <h2>Brouillons <small>{liste.length}</small></h2>
          <button className="button secondary" type="button" onClick={nouveau}>+ Nouveau</button>
        </div>
        {liste.length === 0 ? <p className="rd-note">Aucun brouillon pour l’instant. Écrivez : tout s’enregistre de lui-même.</p> : null}
        <ul>
          {liste.map((b) => (
            <li key={b.id}>
              <button type="button" className={b.id === courant.id ? "is-current" : undefined} onClick={() => ouvrir(b.id)} aria-current={b.id === courant.id ? "true" : undefined}>
                <strong>{b.titre || "Sans titre"}</strong>
                <span><i className={`rd-statut st-${b.statut}`}>{STATUTS.find((s) => s.valeur === b.statut)?.label}</i> · {rubriques.find((r) => r.slug === b.rubrique)?.label || b.rubrique} · {dateFr(b.maj)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="rd-liste-pied">
          <button type="button" className="text-link" onClick={() => { setMdp((v) => !v); setMessage(""); }}>{mdp ? "Annuler" : "Changer le mot de passe"}</button>
          <button type="button" className="text-link" onClick={deconnecter}>Se déconnecter</button>
        </div>
        {mdp ? (
          <form className="rd-mdp" onSubmit={changerMdp}>
            <label>Mot de passe actuel<input type="password" name="ancien" autoComplete="current-password" required /></label>
            <label>Nouveau mot de passe<input type="password" name="nouveau" autoComplete="new-password" minLength={10} required /></label>
            <label>Confirmer<input type="password" name="confirmation" autoComplete="new-password" minLength={10} required /></label>
            <button className="button secondary" type="submit">Changer</button>
          </form>
        ) : null}
        {message ? <p className="rd-note" role="status">{message}</p> : null}
      </aside>

      <section className="rd-editeur" aria-label="Rédaction">
        <div className="rd-barre">
          <div className="rd-onglets" role="tablist" aria-label="Vue">
            <button type="button" role="tab" aria-selected={vue === "ecrire"} onClick={() => setVue("ecrire")}>Écriture</button>
            <button type="button" role="tab" aria-selected={vue === "apercu"} onClick={() => setVue("apercu")}>Aperçu</button>
          </div>
          <p className="rd-sauve" aria-live="polite">{sauve}</p>
          <div className="rd-actions">
            <button type="button" className="button secondary" onClick={() => enregistrer(courantRef.current)}>Enregistrer</button>
            <button type="button" className="button secondary" onClick={exporter} disabled={!courant.titre && !courant.corps}>Exporter (.md)</button>
            <button type="button" className="button secondary rd-danger" onClick={supprimer} disabled={!courant.id}>Supprimer</button>
          </div>
        </div>

        <div className={vue === "apercu" ? "rd-colonnes is-apercu" : "rd-colonnes"}>
          <form className="rd-form" onSubmit={(e) => { e.preventDefault(); enregistrer(courantRef.current); }}>
            <label>Titre<input type="text" value={courant.titre} onChange={(e) => modifier({ titre: e.target.value })} placeholder="Un titre court, qui dit le fait" maxLength={200} /></label>
            <label>Chapô<textarea rows={2} value={courant.chapo} onChange={(e) => modifier({ chapo: e.target.value })} placeholder="Deux phrases : ce qui s’est passé, et pourquoi c’est important" maxLength={600} /></label>
            <div className="rd-champs">
              <label>Rubrique<select value={courant.rubrique} onChange={(e) => modifier({ rubrique: e.target.value })}>{rubriques.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}</select></label>
              <label>Statut<select value={courant.statut} onChange={(e) => modifier({ statut: e.target.value as Statut })}>{STATUTS.map((s) => <option key={s.valeur} value={s.valeur}>{s.label}</option>)}</select></label>
              <label>Signature<input type="text" value={courant.auteur} onChange={(e) => modifier({ auteur: e.target.value })} maxLength={120} /></label>
            </div>
            <label>Texte<textarea className="rd-corps" rows={18} value={courant.corps} onChange={(e) => modifier({ corps: e.target.value })} placeholder={"Un paragraphe par bloc, séparés par une ligne vide.\n## Intertitre\n- liste\n**gras**, *italique*, [lien](https://…), > citation"} spellCheck /></label>
            <p className="rd-note">{mots} mots · {Math.max(1, Math.round(mots / 200))} min de lecture · le texte s’enregistre 1,5 s après la dernière frappe.</p>
          </form>

          <div className="rd-apercu" aria-label="Aperçu de l’article">
            <div className="hub-page article-page rd-apercu-page">
              <div className="article-head">
                <p className="eyebrow">{rubriqueLabel}</p>
                <h1>{titre1}{titre2 ? <><br /><em>{titre2}</em></> : null}</h1>
                {courant.chapo ? <p className="detail-lead">{courant.chapo}</p> : null}
                <p className="article-facts"><time>{dateFr(courant.maj || new Date().toISOString())}</time><span>· {Math.max(1, Math.round(mots / 200))} min de lecture</span><span>· {courant.auteur}</span></p>
              </div>
              <div className="legacy">
                <section className="lg-section"><div className="article-body" dangerouslySetInnerHTML={{ __html: apercu || "<p><em>Le texte apparaîtra ici.</em></p>" }} /></section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
