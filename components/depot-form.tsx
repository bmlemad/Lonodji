"use client";

import Link from "@/components/lien";
import { useEnvoiMultipart } from "./envoi-multipart";

/* Dépôt d'un document pour la bibliothèque numérique : référence (titre,
   auteurs, année, type), résumé, lien ou fichier (≤ 10 Mo), droits déclarés.
   Rien n'est publié avant vérification de la référence et des droits. */

const TYPES = ["Thèse ou mémoire", "Article ou étude scientifique", "Ouvrage, lexique ou recueil", "Rapport d’enquête, données, source institutionnelle", "Archive, document historique, coupure de presse", "Publication d’ADEB LONODJI ou d’une association bedjond", "Autre"];

export default function DepotForm({ telephone, whatsapp }: { telephone: string; whatsapp: string }) {
  const { etat, erreur, fichier, form, surFichier, envoyer } = useEnvoiMultipart(telephone);
  if (etat === "ok") {
    return <p className="form-note form-success" role="status">Merci : votre dépôt est bien arrivé. La référence est vérifiée, les droits aussi, puis elle rejoint la bibliothèque — nous vous écrivons sous quarante-huit heures ouvrées.</p>;
  }
  return (
    <form ref={form} action="/__forms.html" id="formulaire-depot" method="POST" encType="multipart/form-data" name="depot-document" onSubmit={envoyer}>
      <input name="form-name" type="hidden" value="depot-document" />
      <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />
      <fieldset>
        <legend>Le document</legend>
        <div className="field"><label htmlFor="dd-titre">Titre *</label><input id="dd-titre" name="titre" required type="text" /></div>
        <div className="dp-deux">
          <div className="field"><label htmlFor="dd-auteurs">Auteur·e·s *</label><input id="dd-auteurs" name="auteurs" required type="text" placeholder="Nom Prénom, Nom Prénom" /></div>
          <div className="field"><label htmlFor="dd-annee">Année</label><input id="dd-annee" name="annee" type="text" inputMode="numeric" placeholder="2014" /></div>
        </div>
        <div className="dp-deux">
          <div className="field"><label htmlFor="dd-type">Type *</label><select id="dd-type" name="type" required><option value="">Choisir</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div className="field"><label htmlFor="dd-langue">Langue du document</label><input id="dd-langue" name="langue" type="text" placeholder="français, nangnda, anglais…" /></div>
        </div>
        <div className="field"><label htmlFor="dd-resume">De quoi il traite (quelques lignes)</label><textarea id="dd-resume" name="resume" rows={5} placeholder="Le sujet, la période, les lieux, ce qui le rend utile pour le pays bedjond." /></div>
        <div className="field"><label htmlFor="dd-lien">Lien, si le document est en ligne</label><input id="dd-lien" name="lien" type="url" placeholder="https://…" /></div>
        <div className="field">
          <label htmlFor="dd-fichier">Le fichier (PDF, image, son ; 10 Mo au plus)</label>
          <input accept=".pdf,image/*,audio/*,.doc,.docx,.odt,.txt" id="dd-fichier" name="fichier" onChange={surFichier} type="file" />
          <span className="hint">{fichier || "Facultatif : une référence sans fichier est déjà précieuse. Pour un document plus lourd, envoyez-le par WhatsApp après ce premier dépôt."}</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Les droits</legend>
        <div className="field">
          <label htmlFor="dd-droits">Ce que vous savez des droits *</label>
          <select id="dd-droits" name="droits" required>
            <option value="">Choisir</option>
            <option>Je suis l’auteur·e</option>
            <option>J’ai l’accord de l’auteur·e ou de l’éditeur</option>
            <option>Document public ou libre de droits</option>
            <option>Je ne sais pas : à vérifier avec vous</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="dd-publication">Ce que nous pouvons en faire *</label>
          <select id="dd-publication" name="publication" required>
            <option value="">Choisir</option>
            <option>Publier le fichier en ligne dans la bibliothèque</option>
            <option>Référencer seulement (titre, auteur, résumé), sans le fichier</option>
            <option>Le garder dans les archives de l’association, sans publication</option>
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend>Vous</legend>
        <div className="dp-deux">
          <div className="field"><label htmlFor="dd-nom">Nom complet *</label><input autoComplete="name" id="dd-nom" name="nom" required type="text" /></div>
          <div className="field"><label htmlFor="dd-contact">Téléphone, WhatsApp ou e-mail *</label><input id="dd-contact" name="contact" required type="text" placeholder="+235 … ou votre@e-mail.com" /></div>
        </div>
        <div className="field"><label htmlFor="dd-message">Un mot, si vous voulez</label><textarea id="dd-message" name="message" rows={3} placeholder="Comment vous avez trouvé ce document, où il se trouve, qui le détient…" /></div>
        <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte qu’ADEB LONODJI conserve ce dépôt, me recontacte pour vérifier la référence et les droits, et publie selon le choix ci-dessus (<Link href="/mentions-legales#donnees">mentions légales</Link>). *</span></label>
      </fieldset>
      {erreur ? <p className="form-note form-error" role="alert">{erreur}</p> : null}
      <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
        <button className="button primary" disabled={etat === "envoi"} type="submit">{etat === "envoi" ? "Envoi…" : "Déposer ce document"} <span aria-hidden="true">→</span></button>
      </div>
      <p className="form-note">Un document volumineux, une série de tirages à photographier ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Écrivez-nous sur WhatsApp</a> ou appelez le {telephone}.</p>
    </form>
  );
}
