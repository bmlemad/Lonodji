import Link from "@/components/lien";
import { IDENTITE, ODEB } from "../lib/odeb";

/* Barre de section du projet ODEB : les mêmes entrées que le menu, en pilules,
   sur chaque page /odeb. `actif` : l'entrée de la page courante. */
const ENTREES = [
  { id: "vision", label: "La vision", href: "/odeb" },
  { id: "pourquoi", label: "Pourquoi l’ODEB ?", href: "/odeb#pourquoi" },
  { id: "livre-blanc", label: "Livre blanc", href: "/odeb/livre-blanc" },
  { id: "feuille-de-route", label: "Feuille de route 2026-2030", href: "/odeb/feuille-de-route" },
  { id: "programmes", label: "Les six programmes", href: "/odeb/programmes" },
  { id: "identite", label: "Identité visuelle", href: "/odeb/identite" },
];

export default function OdebNav({ actif }: { actif: string }) {
  return (
    <nav className="od-nav" aria-label={`Projet ${ODEB.sigle}`}>
      <span className="od-nav-sigle"><img className="od-embleme--medaillon" src={IDENTITE.embleme} alt="" width={30} height={30} loading="lazy" decoding="async" />{ODEB.sigle} · {ODEB.horizon}</span>
      {ENTREES.map((e) => <Link href={e.href} key={e.id} aria-current={e.id === actif ? "page" : undefined}>{e.label}</Link>)}
    </nav>
  );
}

/* Encadré d'état du projet, identique sur toutes ses pages. */
export function OdebEtat() {
  return (
    <div className="notice od-etat">
      <strong>Où en est le projet.</strong> La réflexion ODEB LONODJI a été lancée le {ODEB.presenteLabel}, jour où ADEB LONODJI a fêté {ODEB.anniversaire} (<Link href={ODEB.article}>l’article du jour</Link>). L’ODEB n’est pas encore constituée : ni statut, ni budget, ni personnel. Le livre blanc est une version de travail ; son adoption, comme le calendrier de la transformation, appartient à l’association. Une remarque, une objection, une compétence à apporter : <Link href="/participer?objet=odeb#contact">écrivez-nous</Link>, objet « Le projet ODEB LONODJI ».
    </div>
  );
}
