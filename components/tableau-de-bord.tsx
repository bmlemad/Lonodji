"use client";

import Link from "@/components/lien";
import { useEffect, useState } from "react";
import type { Indicateurs, Releve } from "../lib/indicateurs";

/* Tableau de bord d'impact : les six indicateurs du plan d'action 2026-2028
   (adhérents, coordonnateurs, plaidoyers, besoins recensés, besoins résolus,
   projets actifs), puis ce que le site produit et ce qu'il reçoit. Chaque
   chiffre porte sa source et sa date ; ce qui n'existe pas est écrit à zéro
   plutôt qu'omis. Les compteurs de formulaires se rafraîchissent en direct
   quand /api/indicateurs y a accès ; sinon la page garde le relevé daté. */

const nf = new Intl.NumberFormat("fr-FR");
const n = (v: number) => nf.format(v);

function dateLongue(iso: string) {
  return new Date(iso + (iso.length === 10 ? "T12:00:00Z" : "")).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function pluriel(v: number, un: string, plusieurs: string) {
  return v === 1 || v === 0 ? un : plusieurs;
}

type Carte = { cle: string; eyebrow: string; valeur: string; unite?: string; libelle: string; detail: string; source: string; courte: string; href?: string };

function cartesDuPlan(d: Indicateurs, f: Releve): Carte[] {
  const c = d.contenu;
  const adh = f.comptes["intention-adhesion"] ?? { envois: 0 };
  const personnes = adh.personnes ?? adh.envois;
  const besoinsForm = f.comptes["signalement-besoin"]?.envois ?? 0;
  const releve = f.live ? "compteur en direct" : `relevé du ${dateLongue(f.date)}`;
  const vacantes = c.coordinations.total - c.coordinations.pourvues;
  const cellulesVacantes = c.coordinations.cellulesTotal - c.coordinations.cellulesPourvues;
  const actif = c.projets.liste.find((p) => p.stade === "essai" || p.stade === "realisation" || p.stade === "service");
  return [
    {
      cle: "adherents",
      eyebrow: "Adhérents",
      valeur: d.bureau.adherents != null ? n(d.bureau.adherents) : n(personnes),
      libelle: d.bureau.adherents != null ? "adhérents à jour de cotisation" : `${pluriel(personnes, "personne a", "personnes ont")} déclaré leur intention d’adhérer`,
      detail: d.bureau.adherents != null
        ? `Chiffre transmis par le bureau. ${n(personnes)} ${pluriel(personnes, "personne a", "personnes ont")} par ailleurs déclaré leur intention d’adhérer sur le site.`
        : `${n(adh.envois)} ${pluriel(adh.envois, "envoi reçu", "envois reçus")} par le formulaire d’adhésion. Le nombre d’adhérents à jour de cotisation est tenu par le bureau : il paraîtra ici, daté, dès sa première transmission.`,
      source: `Formulaire du site · ${releve}`,
      courte: "Formulaire du site",
      href: "/participer#adherer",
    },
    {
      cle: "coordonnateurs",
      eyebrow: "Coordonnateurs",
      valeur: n(c.coordinations.pourvues),
      unite: `/ ${c.coordinations.total}`,
      libelle: "thématiques pourvues d’un coordonnateur",
      detail: `${n(vacantes)} thématiques et ${n(cellulesVacantes)} ${pluriel(cellulesVacantes, "cellule transversale cherchent", "cellules transversales cherchent")} encore la personne qui les portera ; les quatre directions de pôle (rang de chef de projet) sont à pourvoir.`,
      source: "Structure publiée · mise en ligne",
      courte: "Structure publiée",
      href: "/programmes",
    },
    {
      cle: "plaidoyers",
      eyebrow: "Plaidoyers",
      valeur: n(c.plaidoyers.publies),
      libelle: "dossiers de plaidoyer publiés",
      detail: `${n(c.plaidoyers.envoyes)} ${pluriel(c.plaidoyers.envoyes, "envoyé officiellement", "envoyés officiellement")}, ${n(c.plaidoyers.reponses)} ${pluriel(c.plaidoyers.reponses, "réponse reçue", "réponses reçues")}. Sept plaidoyers et une note à la commune, chacun avec ses destinataires nommés.`,
      source: "Suivi des plaidoyers · mise en ligne",
      courte: "Suivi des plaidoyers",
      href: "/actions",
    },
    {
      cle: "besoins",
      eyebrow: "Besoins recensés",
      valeur: n(c.problematiques.total + besoinsForm),
      libelle: "problématiques et besoins recensés",
      detail: `${n(c.problematiques.total)} problématiques du diagnostic territorial (${n(c.problematiques.documentees)} documentées) et ${n(besoinsForm)} ${pluriel(besoinsForm, "signalement citoyen reçu", "signalements citoyens reçus")} par la carte des besoins.`,
      source: `Diagnostic + formulaire · ${releve}`,
      courte: "Diagnostic + formulaire",
      href: "/dossiers/problematiques",
    },
    {
      cle: "resolus",
      eyebrow: "Besoins résolus",
      valeur: n(d.bureau.besoinsResolus),
      libelle: pluriel(d.bureau.besoinsResolus, "besoin confirmé résolu", "besoins confirmés résolus"),
      detail: `Rien n’est compté ici sans preuve datée. ${n(c.engagements.total)} engagements publics sont suivis un par un ; ${n(c.engagements.realises)} ${pluriel(c.engagements.realises, "est confirmé réalisé", "sont confirmés réalisés")}.`,
      source: "Règle de preuve · mise en ligne",
      courte: "Règle de preuve",
      href: "/dossiers/engagements",
    },
    {
      cle: "projets",
      eyebrow: "Projets actifs",
      valeur: n(c.projets.actifs),
      libelle: pluriel(c.projets.actifs, "projet en cours", "projets en cours"),
      detail: `${actif ? `${actif.nom}, ${actif.libelle}. ` : ""}${n(c.projets.annonces)} ${pluriel(c.projets.annonces, "projet annoncé ou à l’étude", "projets annoncés ou à l’étude")}, ${n(c.projets.finances)} ${pluriel(c.projets.finances, "financé", "financés")}.`,
      source: "Plateforme de projets · mise en ligne",
      courte: "Plateforme de projets",
      href: "/projets",
    },
  ];
}

const FORMULAIRES: { cle: string; libelle: string; note?: string; href: string }[] = [
  { cle: "intention-adhesion", libelle: "intentions d’adhésion", href: "/participer#adherer" },
  { cle: "signalement-besoin", libelle: "signalements de besoin", href: "/dossiers/besoins" },
  { cle: "soutien-plaidoyer", libelle: "soutiens à un plaidoyer", href: "/actions" },
  { cle: "promesse-contribution", libelle: "promesses de contribution", href: "/participer#soutenir" },
  { cle: "proposition-article", libelle: "propositions d’article", href: "/participer#proposer" },
  { cle: "lettre-info", libelle: "abonnés à la lettre", href: "/participer#newsletter" },
  { cle: "temoignage-lignee", libelle: "témoignages de lignée", href: "/histoire" },
  { cle: "lieu-sacre", libelle: "lieux sacrés signalés", href: "/dossiers/lieux-sacres" },
  { cle: "mesure-debit", libelle: "mesures de débit internet", href: "/actions#mesure-debit" },
  { cle: "diaspora-competences", libelle: "compétences inscrites au répertoire", href: "/diaspora" },
  { cle: "temoignage", libelle: "récits, photos et enregistrements reçus", href: "/temoignages" },
  { cle: "depot-document", libelle: "documents déposés à la bibliothèque", href: "/bibliotheque" },
  { cle: "mot-nangnda", libelle: "mots versés au dictionnaire nangnda", href: "/langue" },
  { cle: "proposition-projet", libelle: "projets proposés", href: "/projets#proposer" },
];

export default function TableauDeBord({ donnees, mode = "complet" }: { donnees: Indicateurs; mode?: "complet" | "compact" }) {
  const [formulaires, setFormulaires] = useState<Releve>({ ...donnees.formulaires, live: false });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/indicateurs", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { formulaires?: Releve } | null) => { if (j?.formulaires?.live) setFormulaires(j.formulaires); })
      .catch(() => { /* hors ligne ou API absente : le relevé daté reste affiché */ });
    return () => ctrl.abort();
  }, []);

  const cartes = cartesDuPlan(donnees, formulaires);
  const c = donnees.contenu;
  const miseEnLigne = dateLongue(donnees.genere);

  if (mode === "compact") {
    return (
      <ul className="tb-compact" aria-label="Six indicateurs du tableau de bord">
        {cartes.map((k) => (
          <li key={k.cle}>
            <span className="eyebrow">{k.eyebrow}</span>
            <strong className="tb-valeur">{k.valeur}{k.unite ? <small>{k.unite}</small> : null}</strong>
            <span className="tb-libelle">{k.libelle}</span>
            <span className="tb-source">{k.courte}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="tb" aria-labelledby="tb-titre">
      <div className={`tb-etat${formulaires.live ? " is-live" : ""}`} role="status">
        <span className="tb-point" aria-hidden="true" />
        <span>
          {formulaires.live
            ? `Compteurs des formulaires en direct (${dateLongue(formulaires.date)}) · contenus comptés à la mise en ligne du ${miseEnLigne}.`
            : `Compteurs des formulaires relevés le ${dateLongue(formulaires.date)} · contenus comptés à la mise en ligne du ${miseEnLigne}.`}
        </span>
      </div>

      <h2 id="tb-titre" className="tb-h2">Six indicateurs, <em>sans chiffre fabriqué.</em></h2>
      <div className="tb-grille">
        {cartes.map((k) => (
          <article className="tb-carte" key={k.cle} id={`indicateur-${k.cle}`}>
            <p className="eyebrow">{k.eyebrow}</p>
            <strong className="tb-valeur">{k.valeur}{k.unite ? <small>{k.unite}</small> : null}</strong>
            <span className="tb-libelle">{k.libelle}</span>
            <p className="tb-detail">{k.detail}</p>
            <span className="tb-source">{k.source}</span>
            {k.href ? <Link className="tb-lien" href={k.href}>Voir <span aria-hidden="true">→</span></Link> : null}
          </article>
        ))}
      </div>

      <div className="tb-titre">
        <h3>Ce que le site produit</h3>
        <p>Compté dans le contenu publié, à la mise en ligne du {miseEnLigne}.</p>
      </div>
      <ul className="tb-secondaire tb-produit">
        <li><Link className="tb-mini" href="/journal"><strong>{n(c.articles)}</strong><span>articles du journal</span><small>depuis le {c.premierArticle ? dateLongue(c.premierArticle) : "11 septembre 2026"}</small></Link></li>
        <li><Link className="tb-mini" href="/documents"><strong>{n(c.documentsPdf)}</strong><span>documents PDF</span><small>{n(c.documentsAnnonces)} annoncés, à venir</small></Link></li>
        <li><Link className="tb-mini" href="/transparence#corrections"><strong>{n(c.corrections)}</strong><span>corrections datées</span><small>journal des corrections</small></Link></li>
        <li><Link className="tb-mini" href="/dossiers/engagements"><strong>{n(c.engagements.total)}</strong><span>engagements publics</span><small>{n(c.engagements.realises)} confirmé réalisé</small></Link></li>
        <li><Link className="tb-mini" href="/dossiers/problematiques"><strong>{n(c.problematiques.chantiersPrioritaires)}</strong><span>chantiers prioritaires</span><small>tirés du diagnostic</small></Link></li>
        <li><Link className="tb-mini" href="/carte"><strong>{n(c.carte.localites)}</strong><span>localités cartographiées</span><small>{n(c.carte.unites)} unités du pays bedjond</small></Link></li>
        <li><Link className="tb-mini" href="/carte"><strong>{n(c.carte.equipements)}</strong><span>équipements cartographiés</span><small>dans les données ouvertes</small></Link></li>
        <li><Link className="tb-mini" href="/plan-du-site"><strong>{n(c.pages)}</strong><span>pages publiées</span><small>hors journal</small></Link></li>
      </ul>

      <div className="tb-titre">
        <h3>Ce que le site reçoit</h3>
        <p>{formulaires.live ? "Compteurs en direct" : `Relevé du ${dateLongue(formulaires.date)}`} · des nombres seulement, jamais un nom. Contact, plaintes et formulaires des veuves et des personnes handicapées ne sont jamais comptés.</p>
      </div>
      <ul className="tb-secondaire tb-recoit">
        {FORMULAIRES.map((f) => {
          const cpt = formulaires.comptes[f.cle] ?? { envois: 0 };
          const personnes = cpt.personnes;
          return (
            <li key={f.cle}><Link className="tb-mini" href={f.href}>
              <strong>{n(personnes ?? cpt.envois)}</strong>
              <span>{f.libelle}</span>
              <small>{personnes != null && personnes !== cpt.envois ? `${n(cpt.envois)} envois, ${n(personnes)} personnes distinctes` : cpt.envois === 0 ? "aucun envoi à ce jour" : `${n(cpt.envois)} ${pluriel(cpt.envois, "envoi", "envois")}`}</small>
            </Link></li>
          );
        })}
      </ul>

      <div className="tb-methode">
        <strong>Comment ces chiffres sont faits.</strong> Les contenus (plaidoyers, articles, documents, corrections, coordinations, localités) sont comptés dans les pages elles-mêmes à chaque mise en ligne : un chiffre change quand la page change. Les envois de formulaires sont comptés sur la plateforme qui les reçoit, après retrait des envois de test ; une même personne qui envoie deux fois compte une fois. Aucune donnée personnelle ne quitte la boîte de réception. Les chiffres que seule l’association détient — adhérents à jour de cotisation, besoins effectivement résolus — ne sont pas estimés : ils paraîtront datés quand le bureau les transmettra. Méthode du relevé : {formulaires.methode}
      </div>
    </section>
  );
}
