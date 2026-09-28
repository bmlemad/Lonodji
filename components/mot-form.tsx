"use client";

import Link from "next/link";
import { useEnvoiMultipart } from "./envoi-multipart";

/* « Un mot, une expression » : première brique du dictionnaire nangnda. Un mot,
   son sens, un exemple, la prononciation enregistrée au téléphone (≤ 10 Mo).
   Chaque mot est vérifié avec les linguistes avant publication. */

const CATEGORIES = ["Un mot (nom, verbe, adjectif…)", "Une expression", "Un proverbe", "Une salutation, une formule de politesse", "Un nombre, une mesure, un temps", "Un nom de lieu, de plante, d’animal, d’objet", "Autre"];

export default function MotForm({ telephone, whatsapp }: { telephone: string; whatsapp: string }) {
  const { etat, erreur, fichier, form, surFichier, envoyer } = useEnvoiMultipart(telephone);
  if (etat === "ok") {
    return <p className="form-note form-success" role="status">Merci : votre mot est bien arrivé. Il est vérifié avec les linguistes de la thématique Culture &amp; patrimoine vivant, puis publié avec ou sans votre nom selon votre choix.</p>;
  }
  return (
    <form ref={form} action="/__forms.html" id="formulaire-mot" method="POST" encType="multipart/form-data" name="mot-nangnda" onSubmit={envoyer}>
      <input name="form-name" type="hidden" value="mot-nangnda" />
      <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />
      <fieldset>
        <legend>Le mot</legend>
        <div className="dp-deux">
          <div className="field"><label htmlFor="mn-mot">Le mot ou l’expression, en nangnda *</label><input id="mn-mot" name="mot" required type="text" lang="bjv" /></div>
          <div className="field"><label htmlFor="mn-categorie">C’est…</label><select id="mn-categorie" name="categorie"><option value="">Choisir</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="field"><label htmlFor="mn-sens">Ce que cela veut dire, en français *</label><input id="mn-sens" name="sens" required type="text" /></div>
        <div className="dp-deux">
          <div className="field"><label htmlFor="mn-exemple">Une phrase d’exemple, en nangnda</label><input id="mn-exemple" name="exemple" type="text" lang="bjv" /></div>
          <div className="field"><label htmlFor="mn-traduction">Sa traduction</label><input id="mn-traduction" name="traduction" type="text" /></div>
        </div>
        <div className="field">
          <label htmlFor="mn-audio">La prononciation, enregistrée au téléphone (10 Mo au plus)</label>
          <input accept="audio/*,video/*" id="mn-audio" name="audio" onChange={surFichier} type="file" />
          <span className="hint">{fichier || "Facultatif mais précieux : dites le mot deux fois, puis la phrase d’exemple, dans un endroit calme."}</span>
        </div>
        <div className="dp-deux">
          <div className="field"><label htmlFor="mn-variante">Où on le dit ainsi</label><input id="mn-variante" name="variante" type="text" placeholder="Bédjondo, Bébopen, Péni… ou « partout »" /></div>
          <div className="field"><label htmlFor="mn-source">Qui vous l’a appris</label><input id="mn-source" name="source" type="text" placeholder="ma grand-mère, un ancien, le lexique Nangnda…" /></div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Vous</legend>
        <div className="dp-deux">
          <div className="field"><label htmlFor="mn-nom">Nom complet *</label><input autoComplete="name" id="mn-nom" name="nom" required type="text" /></div>
          <div className="field"><label htmlFor="mn-contact">Téléphone, WhatsApp ou e-mail</label><input id="mn-contact" name="contact" type="text" placeholder="pour vous poser une question, jamais publié" /></div>
        </div>
        <div className="field">
          <label htmlFor="mn-publication">Dans le dictionnaire *</label>
          <select id="mn-publication" name="publication" required>
            <option value="">Choisir</option>
            <option>Publiable, avec mon nom comme contributeur</option>
            <option>Publiable, sans mon nom</option>
          </select>
        </div>
        <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte qu’ADEB LONODJI conserve cette contribution et l’enregistrement, les vérifie et les publie dans le dictionnaire selon le choix ci-dessus (<Link href="/mentions-legales#donnees">mentions légales</Link>). *</span></label>
      </fieldset>
      {erreur ? <p className="form-note form-error" role="alert">{erreur}</p> : null}
      <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
        <button className="button primary" disabled={etat === "envoi"} type="submit">{etat === "envoi" ? "Envoi…" : "Envoyer ce mot"} <span aria-hidden="true">↗</span></button>
      </div>
      <p className="form-note">Vous préférez dicter ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Un message vocal sur WhatsApp</a> ou un appel au {telephone} : nous transcrivons, puis vous relisez.</p>
    </form>
  );
}
