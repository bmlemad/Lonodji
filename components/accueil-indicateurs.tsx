import Link from "@/components/lien";
import type { Indicateurs } from "@/lib/indicateurs";

/* Repères publiés et datés : aucun compteur de formulaire ni intention d’adhésion. */
export default function AccueilIndicateurs({ donnees, lang = "fr" }: { donnees: Indicateurs; lang?: "fr" | "en" }) {
  const en = lang === "en";
  const c = donnees.contenu;
  const n = new Intl.NumberFormat(en ? "en-GB" : "fr-FR");
  const cartes = [
    { titre: en ? "Advocacy briefs published" : "Plaidoyers publiés", valeur: n.format(c.plaidoyers.publies), unite: "", source: en ? "Published briefs" : "Dossiers publiés", href: en ? "/en/advocacy" : "/impact#plaidoyers" },
    { titre: en ? "Needs documented" : "Besoins documentés", valeur: n.format(c.problematiques.documentees), unite: `/ ${n.format(c.problematiques.total)}`, source: en ? "Territorial diagnosis" : "Diagnostic territorial", href: en ? "/en/impact" : "/territoire/diagnostic" },
    { titre: en ? "Needs confirmed resolved" : "Besoins confirmés résolus", valeur: donnees.bureau.besoinsResolus == null ? (en ? "Not published" : "Non publié") : n.format(donnees.bureau.besoinsResolus), unite: "", source: en ? "Dated evidence required" : "Preuve datée requise", href: en ? "/en/impact" : "/association/engagements" },
  ];
  return (
    <dl className="acc-impact-chiffres" aria-label={en ? "Three dated progress indicators" : "Trois repères datés du suivi"}>
      {cartes.map((carte) => <div key={carte.titre}><dt>{carte.titre}</dt><dd><strong className={carte.valeur.includes(" ") ? "acc-impact-texte" : undefined}>{carte.valeur}</strong>{carte.unite ? <small>{carte.unite}</small> : null}</dd><dd className="acc-impact-source"><Link href={carte.href}>{carte.source}</Link></dd></div>)}
    </dl>
  );
}
