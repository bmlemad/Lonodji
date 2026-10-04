"use client";

import RetourFormulaire from "@/components/retour-formulaire";

import Link from "@/components/lien";
import Appel from "@/components/appel";
import { useEffect, useRef, useState } from "react";

/* Formulaire « Racontez Bédjondo » : un récit, une photo, un son ou une courte
   vidéo (≤ 10 Mo), avec les accords nécessaires. Envoi en multipart vers
   Netlify Forms (le fichier voyage avec le récit), sans quitter la page. */

const TAILLE_MAX = 10 * 1024 * 1024;
const TYPES = ["Un ancien ou une ancienne raconte", "Une femme qui fait bouger les choses", "Un jeune talent", "Une histoire de Bédjondo : un lieu, un événement, une tradition", "Un retour au pays, une vie de diaspora", "Une photo ou une série de photos, avec leur histoire", "Autre"];

export default function TemoignageForm({ telephone, whatsapp }: { telephone: string; whatsapp: string }) {
  const [etat, setEtat] = useState<"pret" | "envoi" | "ok" | "erreur">("pret");
  const [erreur, setErreur] = useState("");
  const [fichier, setFichier] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const [lieu, setLieu] = useState("");

  // ?lieu=Nom (depuis la fiche d'un village) : préremplit le lieu et amène au formulaire
  useEffect(() => {
    const l = new URLSearchParams(window.location.search).get("lieu");
    if (!l) return;
    setLieu(l.slice(0, 120));
    const t = setTimeout(() => form.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    return () => clearTimeout(t);
  }, []);

  function surFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) { setFichier(""); setErreur(""); return; }
    if (f.size > TAILLE_MAX) {
      setErreur(`Ce fichier fait ${(f.size / 1048576).toFixed(1)} Mo : la limite est de 10 Mo. Réduisez-le, ou envoyez-le par WhatsApp.`);
      e.target.value = ""; setFichier(""); return;
    }
    setErreur(""); setFichier(`${f.name} · ${(f.size / 1048576).toFixed(1)} Mo`);
  }

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.current) return;
    setEtat("envoi"); setErreur("");
    try {
      const res = await fetch("/__forms.html", { method: "POST", body: new FormData(form.current) });
      if (!res.ok) throw new Error(String(res.status));
      setEtat("ok");
    } catch {
      setEtat("erreur");
      setErreur(`L’envoi n’a pas abouti. Réessayez dans un instant, ou envoyez votre récit par WhatsApp (lien ci-dessous).`);
    }
  }

  if (etat === "ok") {
    return (
      <RetourFormulaire className="form-note form-success" role="status">
        Merci : votre récit est bien arrivé. Nous vous répondons sous quarante-huit heures ouvrées, et rien n’est publié avant que vous ayez relu et approuvé la version finale.
      </RetourFormulaire>
    );
  }

  return (
    <form ref={form} action="/__forms.html" id="formulaire-temoignage" method="POST" encType="multipart/form-data" name="temoignage" onSubmit={envoyer}>
      <input name="form-name" type="hidden" value="temoignage" />
      <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />

      <fieldset>
        <legend>Le récit</legend>
        <div className="field">
          <label htmlFor="tm-type">De quoi s’agit-il ? *</label>
          <select id="tm-type" name="type" required>
            <option value="">Choisir</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="tm-titre">Un titre, si vous en avez un</label><input id="tm-titre" name="titre" placeholder="« Le jour où le forage a coulé », « Ma grand-mère et le marché de Bédjondo »…" type="text" /></div>
        <div className="field">
          <label htmlFor="tm-recit">Votre récit *</label>
          <textarea id="tm-recit" name="recit" required rows={9} placeholder="En français ou en nangnda, comme vous parlez. Qui, où, quand ; ce qui s’est passé ; ce que cela a changé. Quelques lignes suffisent, nous vous rappellerons pour le reste." />
          <span className="hint">Vous pouvez aussi enregistrer votre voix sur votre téléphone et joindre le fichier ci-dessous.</span>
        </div>
        <div className="field">
          <label htmlFor="tm-fichier">Une photo, un enregistrement ou une courte vidéo (10 Mo au plus)</label>
          <input accept="image/*,audio/*,video/*,.pdf" id="tm-fichier" name="fichier" onChange={surFichier} type="file" />
          <span className="hint">{fichier || "Format original de préférence, sans filtre ni recadrage. Pour une série de photos, envoyez-la par WhatsApp après ce premier envoi."}</span>
        </div>
        <div className="field"><label htmlFor="tm-lieu">Lieu et date du récit ou de la photo</label><input id="tm-lieu" name="lieu" placeholder="Bédjondo, quartier…, année ou date" type="text" value={lieu} onChange={(e) => setLieu(e.target.value)} /></div>
      </fieldset>

      <fieldset>
        <legend>Vous</legend>
        <div className="dp-deux">
          <div className="field"><label htmlFor="tm-nom">Nom complet *</label><input autoComplete="name" id="tm-nom" name="nom" required type="text" /></div>
          <div className="field"><label htmlFor="tm-qualite">Ce que vous êtes pour Bédjondo</label><input id="tm-qualite" name="qualite" placeholder="Habitante, ancien chef de quartier, fils du pays à Moundou…" type="text" /></div>
        </div>
        <div className="dp-deux">
          <div className="field"><label htmlFor="tm-contact">Téléphone, WhatsApp ou e-mail *</label><input id="tm-contact" name="contact" placeholder="+235 … ou votre@e-mail.com" required type="text" /></div>
          <div className="field"><label htmlFor="tm-localite">Où vous vivez</label><input id="tm-localite" name="localite" placeholder="Bédjondo, N’Djamena, Paris…" type="text" /></div>
        </div>
        <div className="field">
          <label htmlFor="tm-publication">Ce que nous pouvons en faire *</label>
          <select id="tm-publication" name="publication" required>
            <option value="">Choisir</option>
            <option>Publiable, avec mon nom</option>
            <option>Publiable, sans mon nom</option>
            <option>Pour les archives de l’association seulement, sans publication</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>Les accords</legend>
        <label className="check check--consentement"><input name="personnes" required type="checkbox" value="oui" /> <span>Les personnes que je cite ou qui apparaissent sur la photo sont d’accord pour figurer ici, et j’ai le droit de transmettre ce fichier. *</span></label>
        <label className="check check--consentement"><input name="mineurs" type="checkbox" value="oui" /> <span>Si un enfant apparaît ou est cité, j’ai l’accord d’un parent ou tuteur, et je n’indique ni son nom ni son école (voir <Link href="/transparence#ce-que-nous-protegeons-et-comment">ce que nous protégeons</Link>).</span></label>
        <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte qu’ADEB LONODJI conserve ce récit et ce fichier, me recontacte pour les vérifier, et les publie selon le choix ci-dessus après ma relecture (<Link href="/mentions-legales#donnees">mentions légales</Link>). Je peux les retirer à tout moment. *</span></label>
      </fieldset>

      {erreur ? <RetourFormulaire className="form-note form-error" role="alert">{erreur}</RetourFormulaire> : null}
      <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
        <button className="button primary" disabled={etat === "envoi"} type="submit">{etat === "envoi" ? "Envoi…" : "Envoyer mon récit"} <span aria-hidden="true">→</span></button>
      </div>
      <p className="form-note">Vous préférez raconter de vive voix ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Écrivez-nous sur WhatsApp</a> ou <Appel texte="appelez-nous" /> : nous prenons note, puis vous relisez.</p>
    </form>
  );
}
