import type { Metadata } from "next";
import Link from "@/components/lien";
import { SectionHead, Stats } from "../../components/blocks";
import { OdebHero } from "../../components/odeb-marque";
import OdebNav, { OdebEtat } from "../../components/odeb-nav";
import { enLettres, ogFor } from "../../lib/content";
import { MISSIONS, ODEB, PROGRAMMES, REPERES_2030, routeProgramme } from "../../lib/odeb";
import { chiffresOdeb, thematiquesParId } from "../../lib/odeb-chiffres";

export const metadata: Metadata = {
  title: "Projet ODEB LONODJI — Vision 2030",
  description: "L’ODEB LONODJI, Organisation pour le Développement et l’Émergence Bedjonde : un projet porté par ADEB LONODJI pour doter le pays bedjond d’un outil permanent, à l’horizon 2030.",
  alternates: { canonical: "/odeb", languages: { fr: "/odeb", en: "/en/odeb" } },
  openGraph: ogFor("/odeb"),
};

const nf = new Intl.NumberFormat("fr-FR");

export default function Odeb() {
  const c = chiffresOdeb();
  const th = thematiquesParId();
  const coordonnateurs = new Set(PROGRAMMES.flatMap((p) => p.thematiques).filter((id) => th[id]?.filled).map((id) => th[id].coordinator));
  return (
    <main id="main-content" className="hub-page od-page">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · Vision ${ODEB.horizon}`}
        title="Organisation pour le Développement"
        em="et l’Émergence Bedjonde."
        lead={ODEB.formulation}
        crumbs={[{ label: "Projet ODEB" }]}
        pills={["Projet porté par ADEB LONODJI", `Réflexion lancée le ${ODEB.presenteLabel}`, "Pour les quarante ans des fondations, 1986-2026", "Six missions, six programmes", "Livre blanc en version de travail"]}
      />
      <OdebNav actif="vision" />

      <Stats items={[
        { value: "6", label: "missions permanentes", note: "recherche, documentation, développement territorial, innovation, patrimoine, diaspora" },
        { value: String(PROGRAMMES.length), label: "programmes", note: "mémoire et patrimoine, recherche, développement territorial, jeunesse et innovation, diaspora, économie sociale et revenus" },
        { value: ODEB.horizon, label: "l’horizon", note: "une feuille de route en trois phases, de 2026 à 2030" },
        { value: `${c.pourvues}/${c.total}`, label: "thématiques déjà pourvues", note: `${nf.format(coordonnateurs.size)} coordonnateurs et coordonnatrices portent déjà les programmes` },
      ]} />

      <section className="hub-section" id="pourquoi">
        <SectionHead eyebrow="Pourquoi créer l’ODEB ?" title="Une association agit ;" em="un territoire a besoin d’un outil permanent." text={`${ODEB.objet} Quarante ans après les premières réflexions de 1986, l’association a choisi de fêter ses fondations par ce pas plutôt que par une cérémonie.`} />
        <div className="detail-grid od-pourquoi">
          <article><span>01</span><h3>Ce qui a été produit doit être tenu</h3><p>Reconnue en 1995, remise en mouvement en 2026, l’ADEB LONODJI agit par thématiques bénévoles. En quelques semaines, elle a publié {enLettres(c.plaidoyers)} plaidoyers, un diagnostic de {c.problematiques} problématiques, une carte de {nf.format(c.localites)} localités, {nf.format(c.fiches)} fiches de villages, une bibliothèque de {c.references} références. Tout cela demande à être tenu à jour, enrichi et gardé sur des années : c’est la fonction d’une organisation, pas d’une campagne.</p><Link className="text-link" href="/impact">Le tableau de bord <span aria-hidden="true">→</span></Link></article>
          <article><span>02</span><h3>Six fonctions que personne n’assure</h3><p>Recherche, documentation, développement territorial, innovation, préservation du patrimoine, mobilisation de la diaspora : chacune existe aujourd’hui en morceaux — une thématique, un dossier, un formulaire — et aucune n’a de structure permanente pour la porter au nom du pays bedjond tout entier.</p><Link className="text-link" href="#missions">Les six missions <span aria-hidden="true">→</span></Link></article>
          <article><span>03</span><h3>Le pas institutionnel est déjà annoncé</h3><p>L’association a annoncé sa conversion en ONG, et le nom ODEB pour la structure à venir ; aucun dossier n’est déposé à ce jour. Le projet donne un contenu à ce nom avant le statut : une vision, des programmes, une feuille de route, un livre blanc à discuter.</p><Link className="text-link" href="/dossiers/demarches#vers-ong">Vers le statut d’ONG <span aria-hidden="true">→</span></Link></article>
          <article><span>04</span><h3>Ce que l’ODEB n’est pas</h3><p>Ni une nouvelle association concurrente, ni une structure déjà constituée : pas de statut, pas de budget, pas de personnel. Un projet stratégique porté par l’ADEB LONODJI, lancé comme une réflexion le {ODEB.presenteLabel} — le jour où l’association a fêté {ODEB.anniversaire} —, dont l’adoption et le calendrier lui appartiennent, et qui se juge sur les mêmes preuves que le reste du site.</p><Link className="text-link" href="/odeb/livre-blanc#statut">Le statut du livre blanc <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>

      <section className="hub-section" id="missions">
        <SectionHead eyebrow="Six missions" title="Ce que l’ODEB" em="devra assurer, en permanence." text="Les six fonctions du document fondateur, et pour chacune ce que le site fait déjà : l’ODEB ne part pas de rien, il donne une suite à ce qui existe." />
        <ol className="od-missions">
          {MISSIONS.map((m, i) => (
            <li key={m.id} id={`mission-${m.id}`}>
              <span className="od-num">0{i + 1}</span>
              <div>
                <h3>{m.nom}</h3>
                <p>{m.texte}</p>
                <p className="od-existant"><span>Déjà en place :</span>{m.existant.map((l) => <Link href={l.href} key={l.href}>{l.label}</Link>)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="hub-section" id="programmes">
        <SectionHead eyebrow="Six programmes" title="Des programmes," em="pas des promesses." text="Chaque programme a trois axes, s’appuie sur des thématiques nommées et dit, page par page, ce qui existe déjà et ce qu’il construira. Ce qui n’est pas fait est écrit au conditionnel. Le sixième, ajouté le soir du 28 septembre 2026, propose des entreprises dont les bénéfices financeraient les projets." />
        <div className="od-programmes">
          {PROGRAMMES.map((p) => {
            const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
            const pourvues = ths.filter((t) => t.filled).length;
            return (
              <Link className="od-programme" href={routeProgramme(p)} key={p.slug}>
                <span className="od-num">{p.numero}</span>
                <strong>{p.nom}</strong>
                <span className="od-accroche">{p.accroche}</span>
                <span className="od-axes">{p.axes.map((a) => <em key={a.titre}>{a.titre}</em>)}</span>
                <small>{ths.length} {ths.length > 1 ? "thématiques" : "thématique"} · {pourvues} {pourvues > 1 ? "pourvues" : "pourvue"} <b aria-hidden="true">→</b></small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="hub-section" id="2030">
        <SectionHead eyebrow="En 2030" title="Ce que l’ODEB" em="devra être devenu." text="Cinq repères, énoncés par l’association avec sa feuille de route. Ils ne sont pas des résultats : ils sont ce à quoi les résultats seront comparés." />
        <ol className="od-reperes">
          {REPERES_2030.map((r, i) => <li key={r}><span className="od-num">0{i + 1}</span><strong>{r.charAt(0).toUpperCase() + r.slice(1)}</strong></li>)}
        </ol>
      </section>

      <section className="hub-section" id="documents">
        <SectionHead eyebrow="Les deux documents" title="Le livre blanc" em="et la feuille de route." />
        <div className="od-docs">
          <article>
            <span className="status">Document fondateur · version de travail</span>
            <h3>Livre blanc du projet ODEB LONODJI</h3>
            <p>D’où nous partons, pourquoi une organisation, la vision 2030, les six missions, les six programmes, les principes de gouvernance et de redevabilité, les ressources, la feuille de route — et le statut du document.</p>
            <div className="doc-links"><Link className="button primary" href="/odeb/livre-blanc">Lire en ligne <span aria-hidden="true">↗</span></Link><a className="button secondary" href={ODEB.livreBlancPdf} download>PDF</a></div>
          </article>
          <article>
            <span className="status">2026-2030 · trois phases</span>
            <h3>Feuille de route 2026-2030</h3>
            <p>Ce qui est fait, ce qui est en cours, ce qui reste à faire et ce qui reste à décider, phase par phase, avec l’état réel de chaque chantier à la date de mise en ligne.</p>
            <div className="doc-links"><Link className="button primary" href="/odeb/feuille-de-route">Voir la feuille de route <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/impact">Le tableau de bord <span aria-hidden="true">→</span></Link></div>
          </article>
        </div>
      </section>

      <OdebEtat />
      <p className="lg-footnote">Sources : « Projet ODEB LONODJI — Vision 2030 » (formulation institutionnelle, missions, programmes, {ODEB.presenteLabel}) ; plan d’action stratégique 2026-2028 ; « ADEB LONODJI 2030 — de site associatif à infrastructure numérique du peuple bedjond » ; recommandations stratégiques pour lonodji.org, vision 2027-2030 ; feuille de route en trois phases énoncée par l’association le {ODEB.presenteLabel} ; <Link href={ODEB.article}>article du journal</Link> annonçant le lancement de la réflexion pour les quarante ans des fondations. Les chiffres de cette page sont ceux du site à sa mise en ligne.</p>
    </main>
  );
}
