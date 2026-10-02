"use client";

import Link from "@/components/lien";
import { useEffect, useRef, useState } from "react";

/* Demande de mise à jour du site (Netlify « demande-mise-a-jour », 2 octobre 2026) : une erreur à corriger,
   une information à publier, une fiche à actualiser. La page concernée est préremplie depuis ?page=… ou
   depuis la page d'où l'on vient (même site). Champs déclarés dans scripts/import-legacy.py (FORMULAIRES_SITE). */

const TYPES = [
  "Une erreur à corriger : un fait, un nom, une date, un chiffre",
  "Une information nouvelle à publier",
  "La mise à jour d’une thématique, d’une fiche ou d’une page que je suis",
  "Un lien ou une page qui ne fonctionne pas",
  "Autre",
];

export default function MiseAJourForm({ telephone, whatsapp }: { telephone: string; whatsapp: string }) {
  const [etat, setEtat] = useState<"pret" | "envoi" | "ok" | "erreur">("pret");
  const [page, setPage] = useState("");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("page");
    if (p) { setPage(("https://lonodji.org" + (p.startsWith("/") ? p : "/" + p)).slice(0, 300)); return; }
    try {
      const r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.host === window.location.host && !r.pathname.startsWith("/participer/mise-a-jour")) setPage(("https://lonodji.org" + r.pathname + r.hash).slice(0, 300));
    } catch { /* référent illisible : champ laissé vide */ }
  }, []);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.current) return;
    setEtat("envoi");
    try {
      const body = new URLSearchParams(new FormData(form.current) as unknown as Record<string, string>);
      const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (!res.ok) throw new Error(String(res.status));
      setEtat("ok");
    } catch {
      setEtat("erreur");
    }
  }

  if (etat === "ok") {
    return (
      <p className="form-note form-success" role="status">
        Merci : votre demande est arrivée. Nous la vérifions et vous répondons sous quarante-huit heures ouvrées. Une erreur de fait corrigée est inscrite, datée, au <Link href="/transparence#corrections">journal des corrections</Link>.
      </p>
    );
  }

  return (
    <form ref={form} action="/__forms.html" id="formulaire-mise-a-jour" method="POST" name="demande-mise-a-jour" onSubmit={envoyer}>
      <input name="form-name" type="hidden" value="demande-mise-a-jour" />
      <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />

      <fieldset>
        <legend>La demande</legend>
        <div className="field">
          <label htmlFor="mj-page">La page concernée *</label>
          <input id="mj-page" name="page" placeholder="https://lonodji.org/… ou le titre de la page" required type="text" value={page} onChange={(e) => setPage(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mj-type">De quoi s’agit-il ? *</label>
          <select id="mj-type" name="type" required>
            <option value="">Choisir</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mj-actuel">Ce que dit la page aujourd’hui</label>
          <textarea id="mj-actuel" name="texte_actuel" rows={3} placeholder="Recopiez la phrase, le nom ou le chiffre en cause, s’il y en a un." />
        </div>
        <div className="field">
          <label htmlFor="mj-demande">Ce qu’il faudrait écrire, et pourquoi *</label>
          <textarea id="mj-demande" name="demande" required rows={6} placeholder="Le texte juste, l’information à ajouter, ou ce qui ne fonctionne pas." />
        </div>
        <div className="field">
          <label htmlFor="mj-source">Votre source</label>
          <input id="mj-source" name="source" placeholder="Une décision du bureau, un document, un lien, un témoin…" type="text" />
          <span className="hint">Nous ne publions rien sans source : une décision datée, un document, ou la personne concernée.</span>
        </div>
      </fieldset>

      <fieldset>
        <legend>Vous</legend>
        <div className="dp-deux">
          <div className="field"><label htmlFor="mj-nom">Nom *</label><input autoComplete="name" id="mj-nom" name="nom" required type="text" /></div>
          <div className="field"><label htmlFor="mj-qualite">Votre lien avec la page</label><input id="mj-qualite" name="qualite" placeholder="Coordonnateur de la thématique 07, membre, personne citée…" type="text" /></div>
        </div>
        <div className="field"><label htmlFor="mj-contact">Téléphone, WhatsApp ou e-mail *</label><input id="mj-contact" name="contact" placeholder="Pour vous recontacter si une précision manque" required type="text" /></div>
      </fieldset>

      <fieldset>
        <legend>Les accords</legend>
        <label className="check check--consentement"><input name="citer" type="checkbox" value="oui" /> <span>Si la correction entre au journal des corrections, vous pouvez y écrire qu’elle a été signalée par moi, avec mon nom.</span></label>
        <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte qu’ADEB LONODJI conserve cette demande, chez notre hébergeur aux États-Unis, et me recontacte pour la vérifier ; je peux demander à tout moment qu’elle soit effacée (<Link href="/mentions-legales#donnees">données et droits</Link>). *</span></label>
      </fieldset>

      {etat === "erreur" ? <p className="form-note form-error" role="alert">L’envoi n’a pas abouti. Réessayez dans un instant, ou envoyez votre demande par WhatsApp au {telephone}.</p> : null}
      <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
        <button className="button primary" disabled={etat === "envoi"} type="submit">{etat === "envoi" ? "Envoi…" : "Envoyer la demande"} <span aria-hidden="true">→</span></button>
      </div>
      <p className="form-note">Plus simple pour vous ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Écrivez-nous sur WhatsApp</a>, avec le lien de la page et une capture d’écran.</p>
    </form>
  );
}
