"use client";

import { useEffect, useRef, useState } from "react";

/* Partager une page : WhatsApp d'abord (c'est là que vit la diaspora), puis le
   partage natif du téléphone quand il existe, la copie du lien, Facebook,
   l'e-mail, et un message prêt à coller dans un groupe. Deux usages :
   - <Partager route titre texte lang /> : bloc en bas des pages de contenu ;
   - <FeuillePartage /> : feuille ouverte depuis le bouton de l'en-tête
     (événement « lonodji:partager »), pour n'importe quelle page. */

const SITE = "https://lonodji.org";

const T = {
  fr: { titre: "Partager", whatsapp: "WhatsApp", natif: "Partager…", copier: "Copier le lien", copie: "Lien copié", facebook: "Facebook", email: "Par e-mail", message: "Message prêt à coller", copierMsg: "Copier le message", msgCopie: "Message copié", fermer: "Fermer", aide: "Pour un groupe WhatsApp, un e-mail ou un SMS : le titre, une ligne, le lien." },
  en: { titre: "Share", whatsapp: "WhatsApp", natif: "Share…", copier: "Copy the link", copie: "Link copied", facebook: "Facebook", email: "By e-mail", message: "Message ready to paste", copierMsg: "Copy the message", msgCopie: "Message copied", fermer: "Close", aide: "For a WhatsApp group, an e-mail or a text: the title, one line, the link." },
};

const ICO = {
  whatsapp: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M9.2 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a6.7 6.7 0 0 0 3.2 2.8c.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.4.4a2.2 2.2 0 0 1-1.5 2c-.5.2-1.1.2-2.2-.2a10 10 0 0 1-5.4-4.8c-.5-1-.5-1.9-.3-2.5z" /></svg>,
  natif: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4" /><path d="m8 8 4-4 4 4" /><path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" /></svg>,
  lien: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.4 1.4" /><path d="M14 10.5a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.4-1.4" /></svg>,
  facebook: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1.3 1.3-1.3H17V2.5h-2.6C11.9 2.5 10.5 4 10.5 6.5v2H8v3.3h2.5V21.5H14v-9.7h2.6l.4-3.3z" /></svg>,
  email: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>,
  fermer: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>,
};

async function copier(texte: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(texte); return true; }
  } catch { /* on passe au repli */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = texte; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove();
    return ok;
  } catch { return false; }
}

type Props = { route?: string; url?: string; titre: string; texte?: string; lang?: "fr" | "en"; compact?: boolean };

export function BoutonsPartage({ route, url: urlProp, titre, texte = "", lang = "fr", compact = false }: Props) {
  const t = T[lang];
  const url = urlProp || SITE + (route || "/");
  const message = `${titre}${texte ? " — " + texte : ""}\n${url}`;
  const [natif, setNatif] = useState(false);
  const [etat, setEtat] = useState<"" | "lien" | "message">("");
  const minuterie = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { setNatif(typeof navigator !== "undefined" && typeof navigator.share === "function"); return () => clearTimeout(minuterie.current); }, []);
  const signaler = (quoi: "lien" | "message") => { setEtat(quoi); clearTimeout(minuterie.current); minuterie.current = setTimeout(() => setEtat(""), 2200); };
  const partagerNatif = async () => {
    try { await navigator.share({ title: titre, text: texte || titre, url }); } catch { /* annulé : rien à faire */ }
  };
  return (
    <div className={compact ? "partage-boutons partage-boutons--compact" : "partage-boutons"}>
      <a className="partage-btn partage-btn--wa" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">{ICO.whatsapp}<span>{t.whatsapp}</span></a>
      {natif ? <button type="button" className="partage-btn" onClick={partagerNatif}>{ICO.natif}<span>{t.natif}</span></button> : null}
      <button type="button" className={etat === "lien" ? "partage-btn is-fait" : "partage-btn"} onClick={async () => { if (await copier(url)) signaler("lien"); }} aria-live="polite">{ICO.lien}<span>{etat === "lien" ? t.copie : t.copier}</span></button>
      <a className="partage-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">{ICO.facebook}<span>{t.facebook}</span></a>
      <a className="partage-btn" href={`mailto:?subject=${encodeURIComponent(titre)}&body=${encodeURIComponent(message)}`}>{ICO.email}<span>{t.email}</span></a>
      {!compact ? (
        <details className="partage-message">
          <summary>{t.message}</summary>
          <p className="partage-aide">{t.aide}</p>
          <textarea readOnly rows={3} value={message} aria-label={t.message} onFocus={(e) => e.currentTarget.select()} />
          <button type="button" className={etat === "message" ? "partage-btn is-fait" : "partage-btn"} onClick={async () => { if (await copier(message)) signaler("message"); }}>{ICO.lien}<span>{etat === "message" ? t.msgCopie : t.copierMsg}</span></button>
        </details>
      ) : null}
    </div>
  );
}

export default function Partager(props: Props) {
  const t = T[props.lang || "fr"];
  return (
    <aside className="partage" aria-label={t.titre}>
      <div className="partage-tete"><span className="eyebrow">{t.titre}</span><strong>{props.titre}</strong></div>
      <BoutonsPartage {...props} />
    </aside>
  );
}

/* Feuille de partage de la page courante, ouverte par le bouton de l'en-tête. */
export function FeuillePartage() {
  const [ouverte, setOuverte] = useState(false);
  const [page, setPage] = useState<{ titre: string; texte: string; url: string; lang: "fr" | "en" }>({ titre: "", texte: "", url: "", lang: "fr" });
  useEffect(() => {
    const ouvrir = () => {
      const main = document.querySelector("main");
      const lang = (main?.getAttribute("lang") || document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr";
      const h1 = (document.querySelector("main h1") as HTMLElement | null)?.innerText.replace(/\s+/g, " ").trim();
      const titre = h1 || document.title.replace(/\s+[—·|-]\s+ADEB LONODJI.*$/, "");
      const texte = (document.querySelector('meta[name="description"]') as HTMLMetaElement | null)?.content || "";
      setPage({ titre, texte: texte.length > 160 ? texte.slice(0, 157).trimEnd() + "…" : texte, url: location.origin + location.pathname, lang });
      setOuverte(true);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOuverte(false); };
    window.addEventListener("lonodji:partager", ouvrir);
    document.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("lonodji:partager", ouvrir); document.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { document.body.classList.toggle("feuille-open", ouverte); return () => document.body.classList.remove("feuille-open"); }, [ouverte]);
  if (!ouverte) return null;
  const t = T[page.lang];
  return (
    <div className="feuille" role="dialog" aria-modal="true" aria-label={t.titre}>
      <div className="feuille-fond" onClick={() => setOuverte(false)} />
      <div className="feuille-boite">
        <div className="feuille-tete">
          <div><span className="eyebrow">{t.titre}</span><strong>{page.titre}</strong><small>{page.url.replace(/^https?:\/\//, "")}</small></div>
          <button type="button" className="feuille-fermer" onClick={() => setOuverte(false)} aria-label={t.fermer}>{ICO.fermer}</button>
        </div>
        <BoutonsPartage url={page.url} titre={page.titre} texte={page.texte} lang={page.lang} />
      </div>
    </div>
  );
}
