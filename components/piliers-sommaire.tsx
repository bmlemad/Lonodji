import architecture from "@/content/architecture.json";
import { getIndex, thematiqueCount } from "@/lib/content";

/* Navigation native et compacte : utilisable aussi sans JavaScript. */
export default function PiliersSommaire({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const en = lang === "en";
  const idx = getIndex();
  const poles = idx.structure.poles;
  return (
    <details className="piliers-sommaire">
      <summary>
        <strong>{en ? "Choose a pillar" : "Choisir un pilier"}</strong>
        <span>{poles.length} {en ? "pillars" : "piliers"} · {thematiqueCount(idx)} {en ? "themes" : "thématiques"}</span>
        <span className="piliers-sommaire-fleche" aria-hidden="true">↓</span>
      </summary>
      <nav aria-label={en ? "Go directly to a pillar" : "Accès direct aux piliers"}>
        <ol>
          {poles.map((pole, i) => {
            const ouvertes = pole.items.filter((t) => !t.filled).length;
            return <li key={pole.id}>
              <a href={`#${pole.id}`}>
                <span className="piliers-sommaire-roman">{pole.roman}</span>
                <span><strong>{en ? architecture.piliers[i].nomEn : pole.name}</strong><small>{pole.items.length} {en ? "themes" : "thématiques"} · {ouvertes ? `${ouvertes} ${en ? "open" : "à pourvoir"}` : en ? "all coordinated" : "toutes pourvues"}</small></span>
              </a>
            </li>;
          })}
        </ol>
      </nav>
    </details>
  );
}
