"use client";

import RetourFormulaire from "@/components/retour-formulaire";

import Link from "@/components/lien";
import Appel from "@/components/appel";
import { useRef, useState } from "react";

/* Recensement des membres et des sympathisants (Netlify « recensement-membres »), décidé par le bureau
   exécutif élargi le 18 septembre 2026 (CR-BE-2026-01, phase 1 : recensement et mise à jour de la base
   de données, au 18 octobre 2026). Champs déclarés dans scripts/import-legacy.py (FORMULAIRES_SITE). */

const AGES = ["Moins de 18 ans", "18 à 35 ans", "36 à 60 ans", "Plus de 60 ans"];
const RESIDENCES = ["À Bédjondo ou dans ses cantons", "Ailleurs au Tchad", "Hors du Tchad"];
const STATUTS = [
  "Membre de l’association (adhérent, ancien ou actuel)",
  "Pas encore membre : je veux adhérer",
  "Sympathisant, sans adhérer pour l’instant",
];

export default function RecensementForm({ thematiques, telephone, whatsapp }: { thematiques: string[]; telephone: string; whatsapp: string }) {
  const [etat, setEtat] = useState<"pret" | "envoi" | "ok" | "erreur">("pret");
  const [age, setAge] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const mineur = age === AGES[0];

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
      <RetourFormulaire className="form-note form-success" role="status">
        Merci : vous êtes recensé. Le Comité de réactivation vous recontactera si une information manque. Pour adhérer et recevoir votre carte, la marche à suivre est sur la page <Link href="/participer#adherer">Participer</Link>.
      </RetourFormulaire>
    );
  }

  return (
    <form ref={form} action="/__forms.html" id="formulaire-recensement" method="POST" name="recensement-membres" onSubmit={envoyer}>
      <input name="form-name" type="hidden" value="recensement-membres" />
      <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />

      <fieldset>
        <legend>Vous</legend>
        <div className="dp-deux">
          <div className="field"><label htmlFor="rc-nom">Nom et prénoms *</label><input autoComplete="name" id="rc-nom" name="nom" required type="text" /></div>
          <div className="field">
            <label htmlFor="rc-age">Tranche d’âge *</label>
            <select id="rc-age" name="tranche_age" required value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="">Choisir</option>
              {AGES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        {mineur ? (
          <div className="field">
            <label htmlFor="rc-parent">Nom et téléphone d’un parent ou tuteur *</label>
            <input id="rc-parent" name="parent_tuteur" required type="text" />
            <span className="hint">Pour une personne de moins de 18 ans, le parent ou tuteur est recontacté avant toute inscription.</span>
          </div>
        ) : null}
        <div className="dp-deux">
          <div className="field"><label htmlFor="rc-tel">Téléphone ou WhatsApp *</label><input autoComplete="tel" id="rc-tel" inputMode="tel" name="telephone" placeholder="+235 …" required type="tel" /></div>
          <div className="field"><label htmlFor="rc-email">E-mail</label><input autoComplete="email" id="rc-email" name="email" type="email" /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Où vous êtes, d’où vous venez</legend>
        <div className="dp-deux">
          <div className="field">
            <label htmlFor="rc-residence">Vous vivez *</label>
            <select id="rc-residence" name="residence" required>
              <option value="">Choisir</option>
              {RESIDENCES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="rc-ville">Ville et pays</label><input id="rc-ville" name="ville" placeholder="Bédjondo, Koumra, N’Djamena, Paris…" type="text" /></div>
        </div>
        <div className="field">
          <label htmlFor="rc-origine">Quartier, village ou canton d’attache</label>
          <input id="rc-origine" name="origine" placeholder="Le lieu de votre famille, ou celui où vous vivez" type="text" />
          <span className="hint">L’association est ouverte à tous les habitants de Bédjondo, sans distinction d’origine, et à toute la diaspora.</span>
        </div>
      </fieldset>

      <fieldset>
        <legend>Votre lien avec l’association</legend>
        <div className="field">
          <label htmlFor="rc-statut">Vous êtes *</label>
          <select id="rc-statut" name="statut" required>
            <option value="">Choisir</option>
            {STATUTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="dp-deux">
          <div className="field"><label htmlFor="rc-depuis">Membre depuis (année), si vous le savez</label><input id="rc-depuis" inputMode="numeric" name="membre_depuis" placeholder="1995, 2003…" type="text" /></div>
          <div className="field"><label htmlFor="rc-metier">Métier ou études</label><input id="rc-metier" name="metier" type="text" /></div>
        </div>
        <div className="field">
          <label htmlFor="rc-theme">Une thématique qui vous intéresse</label>
          <select id="rc-theme" name="thematique">
            <option value="">Aucune pour l’instant</option>
            {thematiques.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="rc-message">Un mot pour le Comité</label><textarea id="rc-message" name="message" rows={4} placeholder="Une compétence à offrir, un ancien membre à retrouver, une question…" /></div>
      </fieldset>

      <fieldset>
        <legend>Les accords</legend>
        <label className="check check--consentement"><input name="contact_ok" type="checkbox" value="oui" /> <span>J’accepte que le Comité de réactivation et le bureau me contactent par téléphone, WhatsApp ou e-mail pour la vie de l’association.</span></label>
        <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte que ces informations soient conservées dans le registre des membres d’ADEB LONODJI, chez notre hébergeur aux États-Unis, et consultées par le bureau et le Comité seulement ; elles ne sont jamais publiées, et je peux demander à tout moment qu’elles soient effacées (<Link href="/mentions-legales#donnees">données et droits</Link>). *</span></label>
      </fieldset>

      {etat === "erreur" ? <RetourFormulaire className="form-note form-error" role="alert">L’envoi n’a pas abouti. Réessayez dans un instant, ou envoyez ces informations <a href={whatsapp} target="_blank" rel="noopener noreferrer">par WhatsApp</a>.</RetourFormulaire> : null}
      <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
        <button className="button primary" disabled={etat === "envoi"} type="submit">{etat === "envoi" ? "Envoi…" : "Me faire recenser"} <span aria-hidden="true">→</span></button>
      </div>
      <p className="form-note">Un proche sans accès à Internet ? Il peut se faire recenser <a href={whatsapp} target="_blank" rel="noopener noreferrer">par WhatsApp</a> ou <Appel texte="par téléphone" /> : nous prenons note.</p>
    </form>
  );
}
