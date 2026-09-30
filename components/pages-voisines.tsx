import Link from "@/components/lien";
import { voisinesDe } from "@/lib/navigation";

/* « Dans la même rubrique » : les autres pages de la rubrique du menu, en pied de page. Même bloc sur les
   pages importées (legacy-content.tsx) et sur les pages conçues (gouvernance locale, propositions…). */
export default function PagesVoisines({ route }: { route: string }) {
  const liens = voisinesDe(route);
  if (!liens.length) return null;
  return (
    <section className="hub-section lg-voisines" aria-labelledby="lg-voisines-titre">
      <p className="eyebrow" id="lg-voisines-titre">Dans la même rubrique</p>
      <div className="link-list">
        {liens.map((l) => <Link key={l.href} href={l.href}><strong>{l.label}</strong>{l.note ? <span>{l.note}</span> : null}</Link>)}
      </div>
    </section>
  );
}
