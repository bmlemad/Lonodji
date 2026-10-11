import Link from "@/components/lien";
import architecture from "@/content/architecture.json";

/* Aperçu rendu sur le serveur : les intitulés viennent du référentiel commun. */
export default function AccueilPiliers({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const en = lang === "en";
  return (
    <ul className="acc-piliers" aria-label={en ? "Strategic pillars" : "Les piliers stratégiques"}>
      {architecture.piliers.map((pilier, index) => (
        <li key={pilier.roman}>
          <Link href={en ? `/en/themes#pole-${index + 1}` : `/association/architecture#pilier-${pilier.roman.toLowerCase()}`}>
            <span className="acc-pilier-repere">{en ? "Pillar" : "Pilier"} {pilier.roman}</span>
            <strong>{en ? pilier.nomEn : pilier.nom}</strong>
            <span className="acc-pilier-fleche" aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
