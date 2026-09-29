import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import LegacyEnhance from "../../components/legacy-enhance";
import { enLettres, ogFor, ORG } from "../../lib/content";
import { getIndicateurs } from "../../lib/indicateurs";
import { thematiquesParId } from "../../lib/odeb-chiffres";
import { getProjets, STADES_ACTIFS, stadeIndex } from "../../lib/projets";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Plateforme de projets : chaque projet, son stade, ce qui manque",
  description: "Espace numérique, application, complexe sportif, Air Bedjondo : chaque projet avec son stade, ce qui existe, ce qui manque, son budget et comment contribuer — et le formulaire pour en proposer un.",
  alternates: { canonical: "/projets", languages: { fr: "/projets", en: "/en/projects" } },
  openGraph: ogFor("/projets"),
};

const PROBLEMES = ["Eau", "Électricité, énergie", "École, formation", "Santé", "Routes, ponts, transport", "Internet, réseau", "Agriculture, élevage", "Culture, patrimoine, langue", "Jeunesse, sport", "Autre"];

export default function Projets() {
  const d = getProjets();
  const th = thematiquesParId();
  const ind = getIndicateurs();
  const recues = ind.formulaires.comptes["proposition-projet"]?.envois ?? 0;
  const actifs = d.projets.filter((p) => STADES_ACTIFS.has(p.stade)).length;
  const finances = d.projets.filter((p) => ["finance", "realisation", "service"].includes(p.stade)).length;
  const tries = [...d.projets].sort((a, b) => stadeIndex(d, b.stade) - stadeIndex(d, a.stade));
  return (
    <main id="main-content" className="hub-page pj-page">
      <PageHeader
        eyebrow="Nos actions · plateforme de projets"
        title="Chaque projet,"
        em="son stade et ce qui lui manque."
        lead="Un projet n’est pas une promesse : c’est un besoin documenté, un porteur nommé, un budget publié avant d’être demandé, un calendrier tenu et un suivi daté. Cette page tient le registre — y compris de ce qui n’avance pas — et reçoit les projets que vous proposez."
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Projets" }]}
        pills={[`${enLettres(d.projets.length, true)} projets décrits`, `${actifs} ${actifs > 1 ? "actifs" : "actif"}`, `${finances} ${finances > 1 ? "financés" : "financé"}`, "Collecte suspendue jusqu’au compte de l’association"]}
      />

      <Stats items={[
        { value: String(d.projets.length), label: "projets décrits", note: "chacun avec sa page, son porteur, ses inconnues" },
        { value: String(actifs), label: actifs > 1 ? "projets actifs" : "projet actif", note: "une version existe ou un chantier avance" },
        { value: String(finances), label: finances > 1 ? "projets financés" : "projet financé", note: "aucun budget ne sera demandé sans compte au nom de l’association" },
        { value: String(recues), label: recues > 1 ? "projets proposés" : "projet proposé", note: `par le formulaire ci-dessous, relevé du ${new Date(ind.formulaires.date + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` },
      ]} />

      <section className="hub-section" id="stades">
        <SectionHead eyebrow="Le chemin d’un projet" title="Huit stades," em="et l’on dit lequel." text="Chaque projet porte le stade où il en est réellement. On n’en saute aucun : pas de « financé » sans budget publié, pas de « réalisé » sans suivi daté. Le stade change quand la preuve existe, pas quand l’envie le dit." />
        <ol className="pj-stades">
          {d.stades.map((s, i) => {
            const n = d.projets.filter((p) => p.stade === s.id).length;
            return <li key={s.id} className={n ? "est-occupe" : undefined}><span className="pj-stade-num">{i + 1}</span><strong>{s.nom}</strong><span>{s.texte}</span>{n ? <b>{n} {n > 1 ? "projets" : "projet"}</b> : null}</li>;
          })}
        </ol>
      </section>

      <section className="hub-section" id="projets">
        <SectionHead eyebrow="Le registre" title="Ce qui est en cours," em="et ce qui attend." text="Du plus avancé au moins avancé. Pour chacun : ce qui existe déjà — des liens, pas des intentions —, ce qui manque, le budget tel qu’il est connu, et ce que vous pouvez faire." />
        <div className="pj-liste">
          {tries.map((p) => {
            const stade = d.stades.find((s) => s.id === p.stade);
            const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
            return (
              <article className="pj-projet" id={p.slug} key={p.slug}>
                <div className="pj-tete">
                  <div>
                    <span className={`pj-stade pj-stade--${p.stade}`}>{stade?.nom ?? p.stade}</span>
                    <h3><Link href={p.route}>{p.nom}</Link></h3>
                    <p className="pj-resume">{p.resume}</p>
                  </div>
                  <dl className="pj-faits">
                    <div><dt>Stade</dt><dd>{p.libelle}</dd></div>
                    <div><dt>Budget</dt><dd>{p.budget}</dd></div>
                    <div><dt>Calendrier</dt><dd>{p.calendrier}</dd></div>
                    <div><dt>Porté par</dt><dd>{ths.length ? ths.map((t, i) => <span key={t.id}>{i ? " · " : ""}<Link href={`/programmes#${t.id}`}>{t.name}</Link>{t.filled ? ` (${t.coordinator})` : " (à pourvoir)"}</span>) : "—"}</dd></div>
                  </dl>
                </div>
                <div className="pj-cols">
                  <div><p className="pj-label">Ce qui existe</p><ul>{p.existant.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><p className="pj-label">Ce qui manque</p><ul>{p.manque.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><p className="pj-label">Contribuer</p><ul className="pj-contribuer">{p.contribuer.map((l) => <li key={l.href + l.label}><Link href={l.href}>{l.label} <span aria-hidden="true">→</span></Link></li>)}</ul><Link className="text-link" href={p.route}>Le dossier complet <span aria-hidden="true">↗</span></Link></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="hub-section" id="regles">
        <SectionHead eyebrow="Les règles de la plateforme" title="Publié avant d’être demandé," em="suivi après avoir été promis." />
        <div className="detail-grid">
          <article><h3>Aucun franc sans compte</h3><p>La collecte de l’association est suspendue tant qu’elle n’a pas de compte à son nom et de récépissé publié. D’ici là, un projet ne reçoit que des promesses, du matériel et du temps — jamais d’argent.</p><Link className="text-link" href="/participer#soutenir">Pourquoi la collecte est suspendue <span aria-hidden="true">→</span></Link></article>
          <article><h3>Un budget publié, sur devis</h3><p>Aucun chiffre non sourcé : les repères de coût disent d’où ils viennent, et le budget réel se fait sur devis locaux, publié ici avant toute demande de financement — puis suivi, dépense par dépense.</p><Link className="text-link" href="/impact">Le tableau de bord <span aria-hidden="true">→</span></Link></article>
          <article><h3>Un porteur, une thématique, un compte rendu</h3><p>Chaque projet est rattaché à une thématique et à son coordonnateur ; les promesses sont comptées, jamais nommées sans accord ; ce qui n’avance pas est écrit comme tel, et les erreurs sont corrigées à découvert.</p><Link className="text-link" href="/transparence">Notre charte de redevabilité <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>

      <section className="hub-section" id="proposer">
        <SectionHead eyebrow="Proposer un projet" title="Un besoin, une idée," em="un premier porteur." text="Un forage, une salle de classe, un pont, une bibliothèque de village, un atelier : décrivez le besoin et ce que vous proposez. Une thématique l’instruira et vous répondra sous quarante-huit heures ouvrées ; les projets retenus entrent ici au stade « Idée », avec leur porteur." />
        <div className="legacy dp-formulaire">
          <form action="/__forms.html" id="formulaire-projet" method="POST" name="proposition-projet">
            <input name="form-name" type="hidden" value="proposition-projet" />
            <input autoComplete="off" name="_honey" style={{ display: "none" }} tabIndex={-1} type="text" />
            <fieldset>
              <legend>Le projet</legend>
              <div className="field"><label htmlFor="pj-nom">Nom du projet *</label><input id="pj-nom" name="projet" required type="text" placeholder="Un forage pour le quartier de…, une bibliothèque à…" /></div>
              <div className="dp-deux">
                <div className="field"><label htmlFor="pj-localite">Localité concernée *</label><input id="pj-localite" name="localite" required type="text" placeholder="Village, quartier, canton" /></div>
                <div className="field"><label htmlFor="pj-domaine">Domaine *</label><select id="pj-domaine" name="domaine" required><option value="">Choisir</option>{PROBLEMES.map((x) => <option key={x}>{x}</option>)}</select></div>
              </div>
              <div className="field"><label htmlFor="pj-probleme">Le besoin, tel que vous le constatez *</label><textarea id="pj-probleme" name="probleme" required rows={4} placeholder="Ce qui manque, à qui, depuis quand ; ce qui a déjà été tenté." /></div>
              <div className="field"><label htmlFor="pj-solution">Ce que vous proposez *</label><textarea id="pj-solution" name="solution" required rows={4} placeholder="La réponse envisagée, ce qu’elle demande (terrain, matériel, personnes), qui pourrait la porter." /></div>
              <div className="field"><label htmlFor="pj-cout">Ordre de grandeur du coût, si vous en avez un (facultatif)</label><input id="pj-cout" name="cout" type="text" placeholder="Un devis, un prix constaté ailleurs, et d’où vient le chiffre" /></div>
            </fieldset>
            <fieldset>
              <legend>Vous</legend>
              <div className="dp-deux">
                <div className="field"><label htmlFor="pj-porteur">Votre nom *</label><input autoComplete="name" id="pj-porteur" name="nom" required type="text" /></div>
                <div className="field"><label htmlFor="pj-qualite">Votre lien avec le projet</label><input id="pj-qualite" name="qualite" type="text" placeholder="Habitant·e, enseignant·e, membre de la diaspora, chef de quartier…" /></div>
              </div>
              <div className="field"><label htmlFor="pj-contact">Téléphone, WhatsApp ou e-mail *</label><input id="pj-contact" name="contact" required type="text" placeholder="+235 … ou vous@exemple.org" /><span className="hint">Pour vous répondre, jamais publié.</span></div>
              <div className="field">
                <label htmlFor="pj-publication">Si le projet est retenu *</label>
                <select id="pj-publication" name="publication" required>
                  <option value="">Choisir</option>
                  <option>Il peut être publié ici avec mon nom comme proposant·e</option>
                  <option>Il peut être publié ici, sans mon nom</option>
                  <option>Il reste dans les échanges avec la thématique, sans publication</option>
                </select>
              </div>
            </fieldset>
            <label className="check check--consentement"><input name="consentement" required type="checkbox" value="oui" /> <span>J’accepte qu’ADEB LONODJI conserve cette proposition et mon contact pour l’instruire et me répondre, selon ses <Link href="/mentions-legales#donnees">mentions légales</Link>. *</span></label>
            <div className="section-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
              <button className="button primary" type="submit">Proposer ce projet <span aria-hidden="true">↗</span></button>
            </div>
            <p className="form-note">Vous préférez en parler d’abord ? <a href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">Écrivez-nous sur WhatsApp</a> ou appelez le {ORG.phone}.</p>
          </form>
        </div>
        <LegacyEnhance hasForms />
      </section>

      <Partager route="/projets" titre="Plateforme de projets" texte="Espace numérique, application, complexe sportif, Air Bedjondo : chaque projet avec son stade, ce qui existe, ce qui manque, son budget et comment contribuer — et le formulaire pour en proposer un." />

      <p className="lg-footnote">Plateforme ouverte le 28 septembre 2026, au titre de la phase 2 de la <Link href="/odeb/feuille-de-route#phase-2">feuille de route 2026-2030</Link> et de l’axe « Investissements » du <Link href="/odeb/programmes/diaspora">programme Diaspora</Link> du projet ODEB LONODJI. Les projets sont décrits dans <code>content/projets.json</code> ; leur stade et leurs compteurs paraissent sur le <Link href="/impact">tableau de bord</Link>. Les propositions sont enregistrées par le service de formulaires de notre hébergeur (<Link href="/mentions-legales#donnees">où vont vos réponses</Link>).</p>
    </main>
  );
}
