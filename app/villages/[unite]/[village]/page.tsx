import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SectionHead, Stats } from "../../../../components/blocks";
import { ogFor } from "../../../../lib/content";
import { FAMILLES, ficheVillage, getVillages, GROUPES, km, nf, routeVillage, TYPES } from "../../../../lib/villages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getVillages().villages.map((v) => ({ unite: v.unite, village: v.slug }));
}

function description(nom: string, type: string, unite: string, kmB: number, eq: number, mentions: number) {
  const t = (TYPES[type] || "Localité").toLowerCase();
  return `${nom}, ${t} de ${unite}${kmB >= 1 ? `, à ${km(kmB)} de Bédjondo` : ""} : ${eq ? `${eq} équipement${eq > 1 ? "s" : ""} connu${eq > 1 ? "s" : ""} à moins de 10 km` : "aucun équipement connu des données ouvertes"}, ${mentions ? `${mentions} page${mentions > 1 ? "s" : ""} du site qui le cite${mentions > 1 ? "nt" : ""}` : "pas encore cité sur le site"}, et ce qui reste à documenter.`;
}

export async function generateMetadata({ params }: { params: Promise<{ unite: string; village: string }> }): Promise<Metadata> {
  const { unite, village } = await params;
  const v = ficheVillage(unite, village);
  const u = getVillages().unites[unite];
  if (!v || !u) return {};
  const route = routeVillage(v);
  const desc = description(v.nom, v.type, u.nom, v.kmBedjondo, v.equipements.length, v.mentions.length);
  return { title: `${v.nom} (${u.nom})`, description: desc, alternates: { canonical: route }, openGraph: { ...ogFor("/villages"), url: route, title: `${v.nom} — ${TYPES[v.type] || "Localité"} de ${u.nom}`, description: desc } };
}

type Question = { titre: string; question: string; liens: { action: string; href: string }[] };

const A_DOCUMENTER = (nom: string): Question[] => {
  const n = encodeURIComponent(nom);
  return [
    { titre: "L’eau", question: "Un forage, un puits, une source ? Combien, et fonctionnent-ils ? Quelle distance pour aller chercher l’eau ?", liens: [{ action: "Signaler un besoin d’eau", href: `/dossiers/besoins?localite=${n}` }] },
    { titre: "L’école", question: "Une école ? Combien de classes, de maîtres, d’élèves ? Jusqu’à quel niveau, et où vont ensuite les enfants ?", liens: [{ action: "Signaler un besoin d’école", href: `/dossiers/besoins?localite=${n}` }] },
    { titre: "La santé", question: "Un centre ou une case de santé ? Un agent, une sage-femme ? À quelle distance sont les soins les plus proches ?", liens: [{ action: "Signaler un besoin de santé", href: `/dossiers/besoins?localite=${n}` }] },
    { titre: "Le réseau et l’énergie", question: "Quel opérateur passe, avec quel débit, et où ? Y a-t-il de l’électricité, des panneaux solaires, un groupe électrogène ?", liens: [{ action: "Mesurer le débit ici", href: `/actions?lieu=${n}#mesure-debit` }, { action: "Signaler un besoin d’énergie", href: `/dossiers/besoins?localite=${n}` }] },
    { titre: "L’histoire et les lieux sacrés", question: "D’où vient le nom ? Quelles lignées, quels anciens ? Quels lieux sacrés ou sépultures à protéger, et sont-ils menacés ?", liens: [{ action: `Raconter ${nom}`, href: `/temoignages?lieu=${n}` }, { action: "Signaler un lieu sacré menacé", href: `/dossiers/lieux-sacres?localite=${n}#signalement` }] },
    { titre: "Les habitants", question: "Combien d’habitants, combien de familles ? Qui est chef de village ou de quartier ? Quelles associations, quels groupements ?", liens: [{ action: "Nous l’écrire", href: `/participer?localite=${n}#contact` }] },
  ];
};

export default async function Village({ params }: { params: Promise<{ unite: string; village: string }> }) {
  const { unite, village } = await params;
  const d = getVillages();
  const v = ficheVillage(unite, village);
  const u = d.unites[unite];
  if (!v || !u) notFound();
  const type = TYPES[v.type] || "Localité";
  const estBedjondo = v.kmBedjondo < 1 && unite === "bedjondo";
  const aDocumenter = A_DOCUMENTER(v.nom);
  const osm = `https://www.openstreetmap.org/?mlat=${v.lat}&mlon=${v.lon}#map=15/${v.lat}/${v.lon}`;
  const editerOsm = `https://www.openstreetmap.org/edit#map=17/${v.lat}/${v.lon}`;
  const genere = new Date(d.genere).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main id="main-content" className="hub-page vl-page vl-fiche">
      <PageHeader
        eyebrow={`${type} · ${u.nom} · ${u.dep}`}
        title={v.nom}
        em={estBedjondo ? "chef-lieu du pays bedjond." : `${type.toLowerCase()} de ${u.nom}.`}
        lead={`${estBedjondo ? "Chef-lieu du Mandoul Occidental et berceau du peuple bedjond" : `${type} de ${u.nom} (${u.dep}${u.prov && u.prov !== u.dep ? `, ${u.prov}` : ""}), à ${km(v.kmBedjondo)} de Bédjondo`}. Voici ce que les données ouvertes en savent, ce que le site en a écrit, et ce qui reste à documenter — chaque manque renvoie au formulaire qui permet de le combler.`}
        crumbs={[{ label: "Territoire", href: "/carte" }, { label: "Villages", href: "/villages" }, { label: u.nom, href: `/villages/${unite}` }, { label: v.nom }]}
        pills={[GROUPES[u.groupe], `${v.equipements.length ? nf.format(v.equipements.length) : "aucun"} équipement${v.equipements.length > 1 ? "s" : ""} connu${v.equipements.length > 1 ? "s" : ""} à moins de 10 km`, v.mentions.length ? `cité par ${nf.format(v.mentions.length)} page${v.mentions.length > 1 ? "s" : ""}` : "pas encore cité sur le site"]}
      />

      <Stats items={[
        { value: estBedjondo ? "0" : km(v.kmBedjondo).replace(/ (km|m)$/, ""), label: estBedjondo ? "km : c’est Bédjondo même" : `${v.kmBedjondo < 1 ? "m" : "km"} de Bédjondo`, note: "à vol d’oiseau, d’après les positions OpenStreetMap" },
        { value: nf.format(v.equipements.length), label: v.equipements.length === 1 ? "équipement connu à moins de 10 km" : "équipements connus à moins de 10 km", note: v.equipements.length ? v.equipements.slice(0, 3).map((e) => FAMILLES[e.famille] || e.famille).join(" · ") : "école, santé, eau, marché : rien dans les données ouvertes" },
        { value: nf.format(v.voisins.length), label: "localités voisines les plus proches", note: v.voisins.length ? `${v.voisins[0].nom} à ${km(v.voisins[0].km)}` : "aucune à moins de 15 km" },
        { value: nf.format(v.mentions.length), label: v.mentions.length === 1 ? "page du site le cite" : "pages du site le citent", note: v.mentions.length ? v.mentions[0].titre : "la première ligne reste à écrire" },
      ]} />

      <div className="section-actions" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
        <Link className="button primary" href={`/carte?village=${unite}/${v.slug}`}>Voir {v.nom} sur la carte <span aria-hidden="true">↗</span></Link>
        <Link className="button secondary" href={`/dossiers/besoins?localite=${encodeURIComponent(v.nom)}`}>Signaler un besoin ici <span aria-hidden="true">→</span></Link>
        <Link className="text-link" href={`/temoignages?lieu=${encodeURIComponent(v.nom)}`}>Raconter {v.nom} <span aria-hidden="true">→</span></Link>
      </div>

      <section className="hub-section" id="savons">
        <SectionHead eyebrow="Ce que nous savons" title="Ce que les données" em="ouvertes en disent." />
        <div className="vl-deux">
          <dl className="vl-faits">
            <div><dt>Nom</dt><dd>{v.nom}</dd></div>
            <div><dt>Type</dt><dd>{type}, d’après OpenStreetMap</dd></div>
            <div><dt>Unité</dt><dd><Link href={`/villages/${unite}`}>{u.nom}</Link> — {u.dep}{u.prov && u.prov !== u.dep ? `, ${u.prov}` : ""}</dd></div>
            <div><dt>Position</dt><dd>{v.lat.toFixed(4)}, {v.lon.toFixed(4)} · <a href={osm} target="_blank" rel="noopener noreferrer">voir sur OpenStreetMap ↗</a></dd></div>
            <div><dt>Distance à Bédjondo</dt><dd>{estBedjondo ? "c’est Bédjondo" : `${km(v.kmBedjondo)} à vol d’oiseau`}</dd></div>
            <div><dt>Population</dt><dd>non renseignée dans les données ouvertes</dd></div>
          </dl>
          <div className="vl-equipements">
            <h3>Équipements connus à moins de 10 km</h3>
            {v.equipements.length ? (
              <ul>
                {v.equipements.map((e, i) => (
                  <li key={i}><b>{FAMILLES[e.famille] || e.famille}</b> {e.nom || <em>sans nom</em>} <span>· {km(e.km)}{e.unite !== unite ? ` · ${d.unites[e.unite]?.nom || e.unite}` : ""}</span></li>
                ))}
              </ul>
            ) : (
              <p className="vl-vide">Aucune école, aucun centre de santé, aucun forage, aucun marché n’est cartographié à moins de dix kilomètres de {v.nom} dans les données ouvertes. Ce silence est une information, pas une réalité : il dit ce qui reste à cartographier.</p>
            )}
            <p className="vl-note">Vous connaissez l’école, le forage, le centre de santé ? <a href={editerOsm} target="_blank" rel="noopener noreferrer">Placez-les sur OpenStreetMap ↗</a> : ils apparaîtront ici à la mise à jour suivante des données.</p>
          </div>
        </div>
      </section>

      <section className="hub-section" id="documenter">
        <SectionHead eyebrow="Ce qu’il reste à documenter" title="Six questions," em={`une fiche à écrire pour ${v.nom}.`} text="Personne n’a encore répondu à ces questions pour ce village. Chaque réponse reçue est vérifiée, puis publiée ici, datée et sourcée. Vous y vivez, vous en venez, vous y avez de la famille : vous savez." />
        <div className="vl-questions">
          {aDocumenter.map((q) => (
            <article key={q.titre}>
              <h3>{q.titre}</h3>
              <p>{q.question}</p>
              <div className="vl-actions">{q.liens.map((l) => <Link className="text-link" href={l.href} key={l.href}>{l.action} <span aria-hidden="true">→</span></Link>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="site">
        <SectionHead eyebrow="Le site en parle" title={v.mentions.length ? "Ce que nous avons écrit" : "Rien encore"} em={v.mentions.length ? `sur ${v.nom}.` : `sur ${v.nom}.`} text={v.mentions.length ? undefined : `Aucune page du site ne cite encore ${v.nom}. Les pages qui concernent ${u.nom} s’appliquent en attendant.`} />
        <div className="link-list">
          {(v.mentions.length ? v.mentions : u.liens.slice(0, 6)).map((l) => <Link key={l.route} href={l.route}><small>{l.type}</small><strong>{l.titre}</strong></Link>)}
        </div>
      </section>

      {v.voisins.length ? (
        <section className="hub-section" id="autour">
          <SectionHead eyebrow="Autour" title="Les localités" em="les plus proches." />
          <ul className="vl-voisins">
            {v.voisins.map((w) => <li key={`${w.unite}/${w.slug}`}><Link href={routeVillage(w)}><strong>{w.nom}</strong><span>{km(w.km)}{w.unite !== unite ? ` · ${d.unites[w.unite]?.nom || w.unite}` : ""}</span></Link></li>)}
          </ul>
          <div className="section-actions" style={{ justifyContent: "flex-start" }}>
            <Link className="button secondary" href={`/villages/${unite}`}>Tous les villages de {u.nom} <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      ) : null}

      <p className="lg-footnote">Nom et position : OpenStreetMap (export humanitaire HOT, données du {genere}) ; rattachement à {u.nom} : contours GADM 4.1. Un nom mal écrit, une position fausse ? Corrigez-la sur OpenStreetMap ou <Link href="/transparence#corrections">signalez-la</Link> : elle sera corrigée et datée. Fiche générée par <code>scripts/build-villages.py</code>.</p>
    </main>
  );
}
