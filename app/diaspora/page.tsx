import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead } from "../../components/blocks";
import DiasporaCompteurs from "../../components/diaspora-compteurs";
import LegacyEnhance from "../../components/legacy-enhance";
import { filledCount, getIndex, ogFor, ORG, thematiqueCount } from "../../lib/content";
import { DOMAINES, OFFRES } from "../../lib/diaspora";
import { getIndicateurs } from "../../lib/indicateurs";

export const metadata: Metadata = {
  title: "Répertoire des compétences de la diaspora bedjond",
  description: "Médecins, enseignants, ingénieurs, juristes, entrepreneurs : inscrivez vos compétences pour que Bédjondo trouve la personne qui sait. Données protégées.",
  alternates: { canonical: "/diaspora" },
  openGraph: ogFor("/diaspora"),
};

/* Répertoire des compétences (plan d'action 2026-2028, action 4.1). Le site
   collecte les inscriptions et publie des comptes ; le répertoire nominatif
   reste dans la boîte de réception des formulaires, lu par le bureau et, pour
   chaque demande, par le coordonnateur concerné. Rien de nominatif n'est
   publié sans l'accord explicite « annuaire ». */
export default function Diaspora() {
  const idx = getIndex();
  const total = thematiqueCount(idx);
  const vacantes = total - filledCount(idx);
  const indicateurs = getIndicateurs();
  const poles = idx.structure.poles;
  const reseau = poles.flatMap((p) => p.items).find((t) => t.id === "reseau-experts-diaspora");
  return (
    <main id="main-content" className="hub-page dp-page">
      <PageHeader
        eyebrow="Diaspora · répertoire des compétences"
        title="Vos compétences,"
        em="au service de Bédjondo."
        lead="Médecins, enseignants, ingénieurs, juristes, entrepreneurs, informaticiens : la diaspora bedjond est riche de savoir-faire que personne n’a jamais recensés. Ce répertoire les rassemble, avec votre accord, pour qu’une thématique qui bute sur une question trouve la personne qui sait y répondre — depuis N’Djamena, Paris, Montréal ou Bédjondo même."
        crumbs={[{ label: "Participer", href: "/participer" }, { label: "Diaspora" }]}
        pills={["Inscription en cinq minutes", "Rien de publié sans votre accord", "Retrait à tout moment"]}
      />

      <DiasporaCompteurs releve={indicateurs.formulaires} vacantes={vacantes} />

      <section className="hub-section" id="pourquoi">
        <SectionHead eyebrow="Pourquoi un répertoire" title="Une question précise," em="la bonne personne." text="Nous ne cherchons pas des volontaires pour tout : nous cherchons, pour chaque dossier, la compétence qui manque. Un plaidoyer santé a besoin d’un médecin pour relire deux pages ; un projet de forage, d’un hydraulicien pour lire un devis ; une thématique sans coordonnateur, d’une personne qui accepte de la porter." />
        <div className="detail-grid">
          <article><span>01</span><h3>Répondre vite</h3><p>Quand un dossier attend un avis — un devis à lire, un texte de loi à comprendre, un budget à vérifier — nous saurons qui appeler, et vous ne serez sollicité·e que pour ce que vous avez dit pouvoir faire.</p><Link className="text-link" href="/actions">Les plaidoyers en cours <span aria-hidden="true">→</span></Link></article>
          <article><span>02</span><h3>Pourvoir les thématiques</h3><p>{vacantes} thématiques sur {total} attendent leur coordonnateur ou leur coordonnatrice. Le répertoire dit où sont les compétences ; la coordination reste un choix libre, proposé, jamais imposé.</p><Link className="text-link" href="/programmes#thematiques">Les dix-neuf thématiques <span aria-hidden="true">→</span></Link></article>
          <article><span>03</span><h3>Préparer les missions</h3><p>Mentorat d’un jeune, formation à distance, mission courte sur place : la plateforme d’engagement du plan 2026-2028 s’appuiera sur ce répertoire. En attendant, chaque mise en relation se fait à la main, par le bureau.</p><Link className="text-link" href="/dossiers/kit-mobilisation">Relayer autour de vous <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>

      <section className="hub-section" id="regles">
        <SectionHead eyebrow="Ce que nous demandons, ce que nous en faisons" title="Un répertoire," em="pas un annuaire." />
        <div className="detail-grid">
          <article><h3>Qui lit vos réponses</h3><p>Le bureau de l’association et, pour une demande précise, le coordonnateur ou la coordonnatrice de la thématique concernée. Personne d’autre. Vos coordonnées ne sont jamais transmises à un tiers, ni à une entreprise, ni à une administration, sans vous avoir demandé d’abord.</p></article>
          <article><h3>Ce qui est publié</h3><p>Des nombres seulement : combien de personnes inscrites, dans combien de pays, dans quels domaines. Votre nom, votre métier et votre pays ne figurent dans l’annuaire public que si vous cochez la case prévue — et rien d’autre n’y figure jamais.</p></article>
          <article><h3>Vos droits</h3><p>Vous pouvez consulter, corriger ou retirer votre inscription à tout moment par <Link href="/participer#contact">le formulaire de contact</Link>, objet « Mes données personnelles ». Les inscriptions sont revues chaque année ; le détail est dans nos <Link href="/mentions-legales#donnees">mentions légales</Link>.</p></article>
        </div>
      </section>

      <section className="hub-section" id="inscription">
        <SectionHead eyebrow="S’inscrire" title="Cinq minutes," em="une compétence de plus pour Bédjondo." text="Tout ce qui est marqué d’un astérisque est nécessaire ; le reste nous aide à vous solliciter à bon escient. Vous recevrez un accusé de réception sous quarante-huit heures ouvrées." />
        <div className="legacy dp-formulaire">
          <form action="/__forms.html" id="formulaire-diaspora" method="POST" name="diaspora-competences">
            <input name="form-name" type="hidden" value="diaspora-competences" />
            <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />

            <fieldset>
              <legend>Vous</legend>
              <div className="field"><label htmlFor="dp-nom">Nom complet *</label><input autoComplete="name" id="dp-nom" name="nom" required type="text" /></div>
              <div className="field"><label htmlFor="dp-email">E-mail *</label><input autoComplete="email" id="dp-email" name="email" required type="email" /><span className="hint">Notre seul moyen de vous joindre sans vous déranger ; jamais publié.</span></div>
              <div className="field"><label htmlFor="dp-tel">Téléphone ou WhatsApp (facultatif)</label><input autoComplete="tel" id="dp-tel" name="telephone" placeholder="+235 … ou +33 …" type="tel" /></div>
              <div className="dp-deux">
                <div className="field"><label htmlFor="dp-pays">Pays de résidence *</label><input autoComplete="country-name" id="dp-pays" name="pays" placeholder="Tchad, France, Canada…" required type="text" /></div>
                <div className="field"><label htmlFor="dp-ville">Ville</label><input autoComplete="address-level2" id="dp-ville" name="ville" placeholder="N’Djamena, Moundou, Paris…" type="text" /></div>
              </div>
              <div className="field">
                <label htmlFor="dp-lien">Votre lien avec Bédjondo</label>
                <select id="dp-lien" name="lien">
                  <option value="">Choisir</option>
                  <option>Originaire de Bédjondo</option>
                  <option>Famille bedjond, autre canton</option>
                  <option>Conjoint·e, ami·e, allié·e</option>
                  <option>Autre</option>
                </select>
              </div>
            </fieldset>

            <fieldset>
              <legend>Vos compétences</legend>
              <div className="field"><label htmlFor="dp-metier">Métier ou spécialité *</label><input id="dp-metier" name="metier" placeholder="Médecin généraliste, professeure de mathématiques, ingénieur hydraulicien, avocate, développeur…" required type="text" /></div>
              <div className="field">
                <span className="dp-label" id="dp-domaines-l">Domaines (cochez tout ce qui s’applique)</span>
                <div className="dp-cases" role="group" aria-labelledby="dp-domaines-l">
                  {DOMAINES.map(([cle, libelle]) => (
                    <div className="checkbox-row" key={cle}><input id={`dp-domaine-${cle}`} name={`domaine-${cle}`} type="checkbox" value="oui" /><label htmlFor={`dp-domaine-${cle}`}>{libelle}</label></div>
                  ))}
                </div>
              </div>
              <div className="dp-deux">
                <div className="field">
                  <label htmlFor="dp-exp">Années d’expérience</label>
                  <select id="dp-exp" name="experience"><option value="">Choisir</option><option>Moins de 3 ans</option><option>3 à 10 ans</option><option>Plus de 10 ans</option></select>
                </div>
                <div className="field"><label htmlFor="dp-langues">Langues parlées</label><input id="dp-langues" name="langues" placeholder="Français, bedjond, arabe, anglais…" type="text" /></div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Ce que vous pouvez offrir</legend>
              <div className="dp-cases" role="group" aria-label="Ce que vous pouvez offrir">
                {OFFRES.map(([cle, libelle]) => (
                  <div className="checkbox-row" key={cle}><input id={`dp-offre-${cle}`} name={`offre-${cle}`} type="checkbox" value="oui" /><label htmlFor={`dp-offre-${cle}`}>{libelle}</label></div>
                ))}
              </div>
              <div className="dp-deux">
                <div className="field">
                  <label htmlFor="dp-dispo">Disponibilité</label>
                  <select id="dp-dispo" name="disponibilite"><option value="">Choisir</option><option>Quelques heures par mois</option><option>Une journée par mois</option><option>Ponctuellement, sur demande</option><option>Une mission de plusieurs semaines sur place</option></select>
                </div>
                <div className="field">
                  <label htmlFor="dp-them">Thématique qui vous parle (facultatif)</label>
                  <select id="dp-them" name="thematique">
                    <option value="">Choisir une thématique</option>
                    {poles.map((p) => (
                      <optgroup key={p.id} label={`Pôle ${p.roman} — ${p.name}`}>
                        {p.items.map((t) => <option key={t.id}>{t.number}. {t.name}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field"><label htmlFor="dp-message">Un mot, si vous voulez (facultatif)</label><textarea id="dp-message" name="message" placeholder="Ce que vous aimeriez faire pour Bédjondo, une idée, une condition, un contact utile…" /></div>
            </fieldset>

            <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte qu’ADEB LONODJI conserve ces informations pour me proposer des missions et me mettre en relation avec ses thématiques, selon ses <Link href="/mentions-legales#donnees">mentions légales</Link>. Je peux retirer mon inscription à tout moment. *</span></label>
            <label className="check check--consentement"><input name="annuaire" type="checkbox" value="oui" /> <span>J’accepte que mon nom, mon métier et mon pays figurent dans l’annuaire public de la diaspora quand il sera ouvert (le reste n’y figurera jamais). Facultatif.</span></label>
            <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
              <button className="button primary" type="submit">M’inscrire au répertoire <span aria-hidden="true">↗</span></button>
            </div>
            <p className="form-note">Vous préférez en parler d’abord ? <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">Écrivez-nous sur WhatsApp</a> ou appelez le {ORG.phone}.</p>
          </form>
        </div>
        <LegacyEnhance hasForms />
      </section>

      <p className="lg-footnote">Répertoire ouvert le 28 septembre 2026, au titre de l’action 4.1 du plan d’action 2026-2028 ; les compteurs de cette page paraissent aussi sur le <Link href="/impact">tableau de bord</Link>. Le formulaire est enregistré par le service de formulaires de notre hébergeur (voir <Link href="/mentions-legales#donnees">où vont vos réponses</Link>). Une thématique porte ce chantier : <Link href="/programmes#reseau-experts-diaspora">Réseau d’experts &amp; diaspora</Link>{reseau?.filled ? <>, coordonnée par {reseau.coordinator}.</> : <>, encore sans coordonnateur — et si c’était vous ?</>}</p>
    </main>
  );
}
