import type { Metadata } from "next";
import Link from "next/link";
import { OdebHero } from "../../../components/odeb-marque";
import OdebNav from "../../../components/odeb-nav";
import { enLettres, ogFor, ORG } from "../../../lib/content";
import { feuilleDeRoute, MISSIONS, ODEB, PROGRAMMES, REPERES_2030, routeProgramme } from "../../../lib/odeb";
import { chiffresOdeb, thematiquesParId } from "../../../lib/odeb-chiffres";

export const metadata: Metadata = {
  title: "Livre blanc du projet ODEB LONODJI (version de travail)",
  description: "Le document fondateur de l’ODEB LONODJI : d’où nous partons, pourquoi une organisation, la vision 2030, six missions, six programmes, principes, ressources et feuille de route.",
  alternates: { canonical: "/odeb/livre-blanc" },
  openGraph: ogFor("/odeb/livre-blanc"),
};

const CHAPITRES = [
  ["preambule", "Préambule"],
  ["depart", "D’où nous partons"],
  ["pourquoi", "Pourquoi une organisation"],
  ["vision", "La vision 2030"],
  ["missions", "Six missions"],
  ["programmes", "Six programmes"],
  ["principes", "Principes de gouvernance et de redevabilité"],
  ["ressources", "Ressources et partenaires"],
  ["feuille-de-route", "Feuille de route 2026-2030"],
  ["statut", "Statut du document"],
];

const nf = new Intl.NumberFormat("fr-FR");

export default function LivreBlanc() {
  const c = chiffresOdeb();
  const th = thematiquesParId();
  const phases = feuilleDeRoute(c);
  const faits = phases.flatMap((p) => p.chantiers).filter((x) => x.etat === "fait").length;
  const total = phases.reduce((n, p) => n + p.chantiers.length, 0);
  return (
    <main id="main-content" className="hub-page od-page od-page--doc">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · livre blanc`}
        title="Livre blanc :"
        em="le document fondateur."
        lead="Ce que l’ODEB LONODJI doit être, pourquoi, avec quels programmes et selon quel calendrier — écrit avec les mêmes règles que le reste du site : des sources, des chiffres datés, et ce qui n’est pas encore fait écrit comme tel."
        crumbs={[{ label: "Projet ODEB", href: "/odeb" }, { label: "Livre blanc" }]}
        pills={["Version de travail n° 1", ODEB.presenteLabel, "Non adopté à ce jour"]}
      />
      <OdebNav actif="livre-blanc" />

      <div className="od-doc-layout">
        <aside className="od-sommaire" aria-label="Sommaire du livre blanc">
          <p className="eyebrow">Sommaire</p>
          <ol>{CHAPITRES.map(([id, titre], i) => <li key={id}><a href={`#${id}`}><span>{i + 1}.</span> {titre}</a></li>)}</ol>
          <a className="button secondary od-pdf" href={ODEB.livreBlancPdf} download>Télécharger le PDF <span aria-hidden="true">↓</span></a>
        </aside>

        <article className="od-doc">
          <header className="od-doc-tete">
            <p className="od-doc-kicker">{ODEB.sigle} — {ODEB.nom}</p>
            <h2 className="od-doc-titre">Livre blanc</h2>
            <p className="od-doc-sous">Document fondateur · version de travail n° 1 · {ODEB.presenteLabel} · préparé par {ORG.name}</p>
          </header>

          <section id="preambule" className="od-chap">
            <h2><span>1.</span> Préambule</h2>
            <p className="od-citation">{ODEB.formulation}</p>
            <p>Ce livre blanc dit ce que cette phrase engage. Il rassemble, en un seul document, la vision, les missions, les programmes, les principes et le calendrier du projet, tels qu’ils ressortent des quatre documents de stratégie de l’association : le plan d’action 2026-2028, la vision « ADEB LONODJI 2030 », les recommandations stratégiques 2027-2030 pour lonodji.org et le projet ODEB LONODJI du {ODEB.presenteLabel}.</p>
            <p>La réflexion qu’il ouvre a été lancée le {ODEB.presenteLabel}, jour où l’association a fêté les quarante ans de ses fondations : c’est en 1986 que des cadres bedjond engageaient les réflexions dont elle est née. Ce livre blanc est écrit pour être discuté, corrigé et adopté — ou non — par l’association. Rien de ce qu’il annonce n’est acquis ; tout ce qu’il constate est daté et sourcé.</p>
          </section>

          <section id="depart" className="od-chap">
            <h2><span>2.</span> D’où nous partons</h2>
            <p>L’Association de Développement et d’Entraide de Bédjondo est née de réflexions engagées dès 1986 par des cadres bedjond et a été reconnue officiellement en 1995. Deux forums, en 2000 et 2003, ont marqué ses premières années ; une longue mise en veille a suivi. En 2026, l’association s’est remise en mouvement et s’est organisée en quatre pôles, {enLettres(c.total)} thématiques et deux cellules transversales, chaque thématique animée par un coordonnateur ou une coordonnatrice qui rend compte publiquement.</p>
            <p>En quelques semaines, cette organisation a produit ce que le site lonodji.org tient à jour : {enLettres(c.plaidoyers)} plaidoyers publiés, à destinataires nommés ; un diagnostic territorial de {c.problematiques} problématiques, dont {c.inconnues} restent « inconnues » ; une carte du pays bedjond sur contours administratifs vérifiés — {c.unites} unités, {nf.format(c.localites)} localités — et {nf.format(c.fiches)} fiches de villages ; une bibliothèque de {c.references} références et {c.chercheurs} chercheurs ; un répertoire des compétences de la diaspora ; un journal de {c.articles} articles et {c.formulaires} formulaires par lesquels chacun peut signaler, déposer, raconter, proposer. Au {ODEB.presenteLabel}, {c.pourvues} coordinations sur {c.total} sont pourvues.</p>
            <p>Ce socle a deux limites, que nous préférons nommer. La première est humaine : tout repose sur des bénévoles, et une thématique sans coordonnateur reste une page. La seconde est institutionnelle : l’association n’a ni compte bancaire en son nom — la collecte est suspendue jusqu’à son ouverture —, ni statut lui permettant d’être l’interlocuteur crédible des bailleurs et des programmes ; sa conversion en ONG est annoncée, aucun dossier n’est déposé. Ce que le site sait produire, il ne sait pas encore le garantir dans la durée.</p>
          </section>

          <section id="pourquoi" className="od-chap">
            <h2><span>3.</span> Pourquoi une organisation</h2>
            <p>{ODEB.objet}</p>
            <p>Six fonctions sont en cause. Chacune existe aujourd’hui en morceaux : la recherche dans une thématique et une bibliothèque, la documentation dans des dossiers et des formulaires, le développement territorial dans un diagnostic et des plaidoyers, l’innovation dans un pôle et un chantier, le patrimoine dans des cahiers de terrain, la diaspora dans un répertoire. Aucune n’a de structure permanente qui la porte au nom du pays bedjond tout entier, avec des moyens propres, une gouvernance et une obligation de rendre compte.</p>
            <p>Une association peut lancer ces chantiers ; seule une organisation peut les tenir. C’est le sens de la transformation institutionnelle : non pas remplacer l’ADEB LONODJI, mais lui donner, à terme, la forme qui correspond à ce qu’elle fait déjà — et à ce que le pays bedjond attend d’elle. Le nom ODEB est celui que l’association a prévu pour sa conversion en ONG ; ce livre blanc lui donne un contenu avant le statut.</p>
          </section>

          <section id="vision" className="od-chap">
            <h2><span>4.</span> La vision 2030</h2>
            <p>En 2030, l’ODEB LONODJI devra être devenu :</p>
            <ol className="od-liste">{REPERES_2030.map((r) => <li key={r}>{r} ;</li>)}</ol>
            <p>Ces cinq repères ne sont pas des résultats : ils sont ce à quoi les résultats seront comparés, année après année, sur le tableau de bord. Ils ont été énoncés par l’association le {ODEB.presenteLabel}, avec sa feuille de route en trois phases.</p>
          </section>

          <section id="missions" className="od-chap">
            <h2><span>5.</span> Six missions</h2>
            <p>L’ODEB assure de façon permanente six missions. Pour chacune, le site fait déjà quelque chose ; l’organisation lui donne une suite.</p>
            <dl className="od-dl">
              {MISSIONS.map((m, i) => (
                <div key={m.id}>
                  <dt>{i + 1}. {m.nom}</dt>
                  <dd>{m.texte} <span className="od-existant"><span>Déjà en place :</span>{m.existant.map((l) => <Link href={l.href} key={l.href}>{l.label}</Link>)}</span></dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="programmes" className="od-chap">
            <h2><span>6.</span> Six programmes</h2>
            <p>Les missions s’exécutent à travers six programmes. Chacun a trois axes, s’appuie sur des thématiques nommées de l’association et dit, sur sa page, ce qui existe et ce qu’il construira. Le sixième, Économie sociale et revenus, proposé le soir du 28 septembre 2026, est d’une autre nature : des entreprises distinctes de l’association, dont les bénéfices reviendraient aux projets de développement et de bien-être — un complexe hôtelier, un collège-lycée avec internat, une société de transport, un centre hospitalier universitaire moderne avec ses annexes monté avec des partenaires financiers, et d’autres activités à étudier —, sous cinq règles : une société et non l’association, des comptes publiés et des bénéfices affectés aux projets, ce qui manque au pays et non ce qui y existe, de l’argent propre sans promesse de rendement, une entreprise à la fois.</p>
            <dl className="od-dl">
              {PROGRAMMES.map((p) => {
                const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
                const noms = [...new Set(ths.filter((t) => t.filled).map((t) => t.coordinator))];
                return (
                  <div key={p.slug}>
                    <dt>{p.numero}. <Link href={routeProgramme(p)}>{p.nom}</Link></dt>
                    <dd>{p.axes.map((a) => a.titre).join(" · ")}. {p.objet} <span className="od-porte">Thématiques : {ths.map((t) => t.name).join(", ")}{noms.length ? ` — coordination : ${noms.join(" ; ")}` : ""}{ths.some((t) => !t.filled) ? ` ; ${ths.filter((t) => !t.filled).length === 1 ? "une thématique reste" : `${enLettres(ths.filter((t) => !t.filled).length)} thématiques restent`} à pourvoir.` : "."}</span></dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section id="principes" className="od-chap">
            <h2><span>7.</span> Principes de gouvernance et de redevabilité</h2>
            <p>L’ODEB reprend les règles que le site applique depuis sa première page ; elles deviennent celles de l’organisation.</p>
            <ol className="od-liste">
              <li><strong>La preuve avant l’annonce.</strong> Aucun résultat n’est annoncé sans preuve : un chiffre paraît avec sa période, son périmètre, sa source et sa méthode. Ce qui n’est pas encore réalisé est écrit comme tel.</li>
              <li><strong>L’erreur corrigée à découvert.</strong> Toute affirmation inexacte est corrigée et datée dans le <Link href="/transparence#corrections">journal des corrections</Link>, qui compte déjà {c.corrections} entrées publiques.</li>
              <li><strong>Les personnes d’abord.</strong> Rien de nominatif n’est publié sans accord explicite ; un enfant identifiable n’est jamais publié sans l’accord d’un parent, et jamais avec son nom ni son école ; la localisation des lieux sacrés n’est pas publiée, leur registre restant tenu par la chefferie.</li>
              <li><strong>Des nombres, pas des fichiers.</strong> Les formulaires du site ne produisent publiquement que des comptes ; les données personnelles restent dans la boîte de réception de l’association, lues par le bureau et, pour une demande précise, par le coordonnateur concerné.</li>
              <li><strong>Une réponse sous quarante-huit heures ouvrées</strong>, un mécanisme de plainte — même anonyme — avec recours jusqu’à l’assemblée générale, et la protection des personnes vulnérables, selon la <Link href="/transparence">charte de redevabilité</Link>.</li>
              <li><strong>Portée par l’ADEB LONODJI.</strong> Le projet est conduit par l’association et par ses instances ; l’ODEB n’existe pas à côté d’elle mais à sa suite. Son statut, sa gouvernance et ses moyens seront ceux que l’association décidera, dans les formes prévues par <Link href="/dossiers/demarches#vers-ong">le droit tchadien des ONG</Link>.</li>
            </ol>
          </section>

          <section id="ressources" className="od-chap">
            <h2><span>8.</span> Ressources et partenaires</h2>
            <p>Ce livre blanc ne comporte pas de budget : aucun financement n’est acquis, aucun n’est sollicité tant que l’association n’a pas de compte à son nom et de récépissé publié. Il nomme en revanche les ressources sur lesquelles l’ODEB s’appuiera.</p>
            <ol className="od-liste">
              <li><strong>La diaspora bedjond</strong>, par le <Link href="/diaspora">répertoire des compétences</Link> : des experts, du temps, et à terme des investissements dans des projets documentés avant d’être financés.</li>
              <li><strong>Les chercheurs du pays bedjond</strong> — {enLettres(c.chercheurs)} sont recensés dans la <Link href="/bibliotheque">bibliothèque</Link> — et les linguistes qui écriront avec nous ce que le site ne sait pas encore de la langue nangnda.</li>
              <li><strong>Les données ouvertes</strong> : contours administratifs GADM, localités et équipements d’OpenStreetMap, que la communauté complète fiche par fiche.</li>
              <li><strong>Les partenaires opérationnels du Mandoul</strong>, ONG et programmes déjà présents sur le territoire, recensés dans <Link href="/dossiers/ong-partenaires">un dossier dédié</Link>, avec qui l’ODEB cherchera la complémentarité plutôt que la concurrence.</li>
              <li><strong>Les institutions</strong> — commune de Bédjondo, sous-préfectures, chefferies, services de l’État — destinataires des plaidoyers et interlocutrices de l’observatoire.</li>
              <li><strong>La cellule Financement & ressources</strong> de l’association, encore à pourvoir, qui préparera le cadre de financement et de reddition des comptes.</li>
            </ol>
          </section>

          <section id="feuille-de-route" className="od-chap">
            <h2><span>9.</span> Feuille de route 2026-2030</h2>
            <p>La feuille de route compte trois phases — de zéro à six mois, de six à dix-huit mois, de dix-huit à trente-six mois — puis le bilan du plan d’action 2026-2028 et la constitution de l’organisation. Au {ODEB.presenteLabel}, {faits} chantiers sur {total} sont réalisés ; l’état de chacun est tenu à jour sur <Link href="/odeb/feuille-de-route">la page de la feuille de route</Link>.</p>
            <dl className="od-dl od-dl--phases">
              {phases.map((p) => (
                <div key={p.id}>
                  <dt>{p.periode} — {p.titre}</dt>
                  <dd>{p.chantiers.map((x) => x.titre).join(" · ")}.</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="statut" className="od-chap">
            <h2><span>10.</span> Statut du document</h2>
            <p>Ce texte est la <strong>version de travail n° 1</strong> du livre blanc, établie le {ODEB.presenteLabel} à partir des documents de stratégie de l’association. Il n’a été adopté par aucune instance ; il n’engage pas l’association au-delà de ce que ses pages publiques engagent déjà. Les chiffres qu’il cite sont ceux du site à la date de mise en ligne, et la version PDF est produite à partir de cette page.</p>
            <p>Il sera amendé sur remarques et objections — <Link href="/participer?objet=odeb#contact">par le formulaire</Link>, objet « Le projet ODEB LONODJI », ou par WhatsApp — puis soumis aux instances de l’association. Chaque nouvelle version sera datée et numérotée ici ; les versions précédentes resteront lisibles dans les <Link href="/archives">archives du site</Link>.</p>
            <p className="od-signature">{ORG.name} · {ORG.motto}</p>
          </section>
        </article>
      </div>
    </main>
  );
}
