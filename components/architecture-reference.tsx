import Link from "@/components/lien";
import architecture from "@/content/architecture.json";

export default function ArchitectureReference() {
  return <aside className="notice" aria-label="Référentiel institutionnel">
    <p><strong>Architecture institutionnelle d’ADEB LONODJI</strong></p>
    <p>{architecture.signature}</p>
    <Link className="text-link" href="/association/architecture">Les piliers stratégiques et leurs missions <span aria-hidden="true">→</span></Link>
  </aside>;
}
