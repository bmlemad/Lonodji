import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "../../components/blocks";
import { ogFor } from "../../lib/content";
import { getObservatoire } from "../../lib/observatoire";
import { thematiquesParId } from "../../lib/odeb-chiffres";
import { GROUPES, km } from "../../lib/villages";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Observatoire du Mandoul Occidental : le territoire, unité par unité",
  description: "Localités, équipements connus, couverture, diagnostic par domaine, plaidoyers et besoins signalés : les chiffres du pays bedjond par unité, datés et sourcés, et ce que l’observatoire ne sait pas encore.",
  alternates: { canonical: "/observatoire" },
  openGraph: ogFor("/observatoire"),
};

const nf = new Intl.NumberFormat("fr-FR");
const date = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);

const STATUTS: [string, string, string][] = [
  ["documente", "Documenté", "chiffres locaux, sourcés"],
  ["partiel", "Partiel", "des éléments, pas de mesure complète"],
  ["ailleurs", "Ailleurs", "documenté par des chiffres nationaux ou d’autres territoires, pas ici"],
  ["inconnu", "Inconnu", "aucune donnée ; une enquête est nécessaire"],
];

export default function Observatoire() {
  const o = getObservatoire();
  const th = thematiquesParId();
  const t = o.totaux;
  const famillesOrdre = Object.entries(o.familles);
  const decideurs = Object.entries(o.diagnostic.decideurs).sort((a, b) => b[1] - a[1]);
  const transmis = o.plaidoyers.filter((p) => p.sent && !/aucun|non|—|pas/i.test(p.sent)).length;
  return (
    <main id="main-content" className="hub-page ob-page">
      <PageHeader
        eyebrow="Territoire · observatoire"
        title="Observatoire"
        em="du Mandoul Occidental."
        lead="Les mêmes règles que le tableau de bord — un chiffre, sa source, sa date — appliquées au territoire, unité par unité : ce que l’on sait des localités et des équipements, l’état du diagnostic par domaine, le suivi des plaidoyers et des besoins signalés. Et, tout aussi précisément, ce que l’observatoire ne sait pas encore."
        crumbs={[{ label: "Territoire", href: "/carte" }, { label: "Observatoire" }]}
        pills={[`${t.unites} unités`, `${nf.format(t.localites)} localités`, `${o.diagnostic.total} problématiques`, `données du ${date(o.sources.carte)}`]}
      />

      <Stats items={[
        { value: nf.format(t.equipements), label: "équipements connus des données ouvertes", note: famillesOrdre.filter(([, f]) => f.total).map(([, f]) => `${f.total} ${f.libelle}`).join(", ") },
        { value: `${pct(t.couvertes, t.nommees)} %`, label: "des localités à moins de 10 km d’un équipement connu", note: `${nf.format(t.couvertes)} sur ${nf.format(t.nommees)} localités nommées — le reste n’est pas dépourvu, il est non relevé` },
        { value: String(o.besoins.signales), label: o.besoins.signales > 1 ? "besoins signalés" : "besoin signalé", note: `par le formulaire, relevé du ${date(o.sources.releve)} ; résolus : ${o.besoins.resolus == null ? "non publié" : o.besoins.resolus}` },
        { value: `${o.plaidoyers.length} / ${transmis}`, label: "plaidoyers publiés / transmis", note: "aucune réponse écrite reçue à ce jour" },
      ]} />

      <section className="hub-section" id="unites">
        <SectionHead eyebrow="Par unité" title="Quatorze unités," em="ce que l’on en sait." text="Sept sous-préfectures du cœur, trois du sud où la présence bedjond est attestée, une signalée, trois de diaspora agricole. Les équipements sont ceux que des contributeurs ont placés sur OpenStreetMap : presque aucun au cœur du pays bedjond, ce qui mesure d’abord une absence de relevé. La colonne « citées » compte les localités dont le site parle déjà." />
        <div className="ob-table-wrap">
          <table className="ob-table">
            <thead>
              <tr>
                <th scope="col">Unité</th><th scope="col">Localités nommées</th><th scope="col">Équipements connus</th><th scope="col">École · santé · eau · marché</th><th scope="col">Couverture à 10 km</th><th scope="col">Citées sur le site</th><th scope="col">Pages du site</th>
              </tr>
            </thead>
            <tbody>
              {o.unites.map((u) => {
                const f = u.equipements.familles;
                const c = pct(u.couvertes, u.nommees);
                return (
                  <tr key={u.id}>
                    <th scope="row"><Link href={u.route}>{u.nom}</Link><small>{(GROUPES as Record<string, string>)[u.groupe] ?? u.groupe} · {u.kmBedjondo < 1 ? "chef-lieu" : `à ${km(u.kmBedjondo)}`}</small></th>
                    <td>{nf.format(u.nommees)}{u.localites > u.nommees ? <small>+ {nf.format(u.localites - u.nommees)} sans nom</small> : null}</td>
                    <td className={u.equipements.total ? undefined : "est-vide"}>{u.equipements.total || "aucun relevé"}</td>
                    <td className="ob-fam">{[f.ecole, f.sante, f.eau, f.marche].map((n, i) => <span key={i} className={n ? undefined : "est-vide"}>{n}</span>)}</td>
                    <td><span className="ob-barre" aria-hidden="true"><i style={{ width: `${c}%` }} /></span><b>{c} %</b><small>{u.couvertes} localités</small></td>
                    <td>{u.citees}</td>
                    <td>{u.pages}{u.plaidoyers ? <small>dont {u.plaidoyers} {u.plaidoyers > 1 ? "plaidoyers" : "plaidoyer"}</small> : null}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Lecture : une unité « sans relevé » n’est pas une unité sans école ni forage ; c’est une unité que personne n’a encore cartographiée. Les fiches de villages disent, localité par localité, ce qui reste à documenter, avec le formulaire pour le faire. Les besoins signalés par localité paraîtront ici dès qu’il y en aura : ils sont comptés, jamais nommés.</p>
      </section>

      <section className="hub-section" id="diagnostic">
        <SectionHead eyebrow="Par domaine" title="Trente-quatre problématiques," em="et l’état de ce qu’on en sait." text="Le diagnostic territorial classe les problématiques par domaine et dit, pour chacune, si elle est documentée ici, partiellement, ailleurs ou pas du tout — et qui décide. L’observatoire en tient le compte ; le diagnostic en donne le détail." />
        <ul className="ob-statuts">
          {STATUTS.map(([cle, nom, texte]) => <li key={cle} className={`ob-statut ob-statut--${cle}`}><strong>{o.diagnostic.statuts[cle] ?? 0}</strong><span>{nom}</span><small>{texte}</small></li>)}
        </ul>
        <div className="ob-table-wrap">
          <table className="ob-table ob-table--domaines">
            <thead><tr><th scope="col">Domaine</th><th scope="col">Problématiques</th><th scope="col">Documenté</th><th scope="col">Partiel</th><th scope="col">Ailleurs</th><th scope="col">Inconnu</th><th scope="col">Qui décide</th><th scope="col">Thématiques</th></tr></thead>
            <tbody>
              {o.diagnostic.domaines.map((d) => (
                <tr key={d.nom}>
                  <th scope="row"><Link href={`/dossiers/problematiques#${d.ancre}`}>{d.nom}</Link></th>
                  <td>{d.total}</td>
                  <td className={d.documente ? "ob-ok" : "est-vide"}>{d.documente}</td>
                  <td className={d.partiel ? undefined : "est-vide"}>{d.partiel}</td>
                  <td className={d.ailleurs ? undefined : "est-vide"}>{d.ailleurs}</td>
                  <td className={d.inconnu ? "ob-manque" : "est-vide"}>{d.inconnu}</td>
                  <td><small>{Object.entries(d.decideurs).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} (${n})`).join(", ")}</small></td>
                  <td><small>{Object.keys(d.thematiques).filter((id) => th[id]).map((id, i) => <span key={id}>{i ? " · " : ""}<Link href={`/programmes#${id}`}>{th[id].name}</Link></span>)}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Échelons de décision sur l’ensemble du diagnostic : {decideurs.map(([k, n]) => `${k} (${n})`).join(", ")}. Les {o.diagnostic.statuts.inconnu} problématiques « inconnues » sont l’objet des <Link href="/dossiers/enquetes">huit enquêtes de terrain</Link>, qui ne demandent pas d’argent.</p>
      </section>

      <section className="hub-section" id="plaidoyers">
        <SectionHead eyebrow="Suivi des plaidoyers" title="Publiés, transmis," em="répondus." text="Chaque plaidoyer nomme ses destinataires. L’observatoire suit la transmission et la réponse ; le dossier de chaque plaidoyer garde le texte, les chiffres et les sources." />
        <div className="ob-table-wrap">
          <table className="ob-table ob-table--plaidoyers">
            <thead><tr><th scope="col">Plaidoyer</th><th scope="col">Thème</th><th scope="col">Destinataires</th><th scope="col">Publié</th><th scope="col">Transmis</th><th scope="col">Réponse</th></tr></thead>
            <tbody>
              {o.plaidoyers.map((p) => (
                <tr key={p.id}>
                  <th scope="row"><Link href={p.href}>{p.title}</Link></th>
                  <td>{p.theme}</td>
                  <td><small>{p.recipients}</small></td>
                  <td>{p.published}</td>
                  <td className={/aucun|non|—|pas/i.test(p.sent) || !p.sent ? "ob-manque" : "ob-ok"}>{p.sent || "—"}</td>
                  <td className={/aucun|non|—|pas/i.test(p.answer) || !p.answer ? "est-vide" : "ob-ok"}>{p.answer || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">Les lettres de transmission des huit plaidoyers ont été préparées le 24 septembre 2026 et attendent la signature du bureau ; la date d’envoi de chaque dossier sera inscrite ici dès la transmission. {o.engagements.total} engagements publics sont suivis par ailleurs, {o.engagements.realises} confirmé{o.engagements.realises > 1 ? "s" : ""} réalisé{o.engagements.realises > 1 ? "s" : ""}.</p>
      </section>

      <section className="hub-section" id="indicateurs">
        <SectionHead eyebrow="Ce que l’observatoire suit" title="Huit indicateurs," em="leur source et leur état." />
        <div className="ob-table-wrap">
          <table className="ob-table ob-table--indic">
            <thead><tr><th scope="col">Indicateur</th><th scope="col">Source et méthode</th><th scope="col">Mise à jour</th><th scope="col">État</th></tr></thead>
            <tbody>
              <tr><th scope="row">Localités par unité</th><td>OpenStreetMap (exports humanitaires) rattaché aux contours GADM 4.1</td><td>à chaque rafraîchissement de la carte</td><td className="ob-ok">disponible — {nf.format(t.nommees)} nommées</td></tr>
              <tr><th scope="row">Équipements connus par famille</th><td>Points d’intérêt OpenStreetMap : écoles, santé, eau, marchés, télécoms, administration, culte</td><td>idem</td><td className="ob-manque">très incomplet — {t.equipements} points, aucun à Bédjondo</td></tr>
              <tr><th scope="row">Couverture à 10 km</th><td>Part des localités nommées ayant un équipement connu à moins de 10 km (calcul du site)</td><td>idem</td><td className="ob-ok">disponible, mais hérite de l’incomplétude des équipements</td></tr>
              <tr><th scope="row">Besoins signalés</th><td>Formulaire de la carte des besoins ; comptés par localité et par type, jamais nommés</td><td>relevé daté, en direct dès l’accès configuré</td><td className={o.besoins.signales ? "ob-ok" : "est-vide"}>{o.besoins.signales ? `${o.besoins.signales} signalés` : "aucun signalement à ce jour"}</td></tr>
              <tr><th scope="row">Besoins résolus</th><td>Confirmation par le bureau, avec date et preuve</td><td>à chaque transmission du bureau</td><td className="ob-manque">non publié</td></tr>
              <tr><th scope="row">Diagnostic par domaine</th><td>Les trente-quatre problématiques, leur état et leur échelon de décision</td><td>à chaque révision du diagnostic</td><td className="ob-ok">disponible — {o.diagnostic.statuts.inconnu} inconnues</td></tr>
              <tr><th scope="row">Plaidoyers : transmission et réponse</th><td>Tableau des plaidoyers, dates de publication, d’envoi et de réponse</td><td>à chaque étape</td><td className="ob-manque">{o.plaidoyers.length} publiés, {transmis} transmis</td></tr>
              <tr><th scope="row">Population par unité</th><td>Recensement général (RGPH-3) : résultats attendus</td><td>à la publication officielle</td><td className="ob-manque">indisponible — aucune statistique publiée à l’échelle du département</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="hub-section" id="alimenter">
        <SectionHead eyebrow="Alimenter l’observatoire" title="Quatre gestes" em="qui changent un chiffre." />
        <div className="link-list">
          <Link href="/dossiers/besoins"><small>Besoins</small><strong>Signaler un besoin, localité par localité</strong><span>Un forage en panne, une école sans maître, un pont coupé : compté ici dès l’envoi, jamais nommé.</span></Link>
          <Link href="/villages"><small>Équipements</small><strong>Dire ce qu’il y a dans son village</strong><span>Chaque fiche pose six questions — eau, école, santé, réseau, histoire, habitants — avec le formulaire pour y répondre.</span></Link>
          <Link href="/dossiers/enquetes"><small>Diagnostic</small><strong>Mener une des huit enquêtes de terrain</strong><span>Les onze problématiques inconnues ont chacune leur détenteur de réponse, leur méthode et leur fiche de relevé.</span></Link>
          <Link href="/actions#mesure-debit"><small>Connectivité</small><strong>Mesurer le débit internet chez soi</strong><span>Une mesure datée et située, pour le plaidoyer haut débit.</span></Link>
        </div>
        <Partager route="/observatoire" titre="Observatoire du Mandoul Occidental" texte="Localités, équipements connus, couverture, diagnostic par domaine, plaidoyers et besoins signalés : les chiffres du pays bedjond par unité, datés et sourcés, et ce que l’observatoire ne sait pas encore." />
        <p className="lg-footnote">Observatoire ouvert le 28 septembre 2026, première version, au titre de la phase 3 de la <Link href="/odeb/feuille-de-route#phase-3">feuille de route 2026-2030</Link> et de l’axe « Observatoire » du <Link href="/odeb/programmes/developpement-territorial">programme Développement territorial</Link>. Données : <code>scripts/build-observatoire.py</code> (carte du {date(o.sources.carte)}, fiches du {date(o.sources.villages)}, relevé des formulaires du {date(o.sources.releve)}). Une erreur ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p>
      </section>
    </main>
  );
}
