import { PageHeader } from "./blocks";
import { IDENTITE, ODEB } from "../lib/odeb";

/* L'emblème du projet ODEB LONODJI, « Les Pas vers l'Avenir ». Sur fond sombre,
   la version en verre sans fond ; sur fond clair, l'emblème sur son fond vert
   profond, rogné en médaillon rond. Décoratif par défaut (alt vide) : les pages
   nomment déjà le projet dans leur titre. */
export function OdebEmbleme({ fond = "clair", taille = 200, className, alt = "", priorite = false }: {
  fond?: "clair" | "sombre"; taille?: number; className?: string; alt?: string; priorite?: boolean;
}) {
  const src = fond === "sombre" ? IDENTITE.superposable : IDENTITE.embleme;
  return (
    <img
      className={["od-embleme", fond === "clair" ? "od-embleme--medaillon" : null, className].filter(Boolean).join(" ")}
      src={src}
      alt={alt}
      width={taille}
      height={taille}
      loading={priorite ? "eager" : "lazy"}
      fetchPriority={priorite ? "high" : undefined}
      decoding="async"
    />
  );
}

/* En-tête des pages du projet : l'en-tête habituel, l'emblème à sa droite.
   lang="en" (page anglaise) : fil d'Ariane et texte de remplacement en anglais. */
export function OdebHero(props: Parameters<typeof PageHeader>[0]) {
  return (
    <div className="od-hero">
      <div><PageHeader {...props} /></div>
      <OdebEmbleme taille={240} className="od-hero-embleme" priorite alt={props.lang === "en" ? `Emblem of the ${ODEB.sigle} project` : `Emblème du projet ${ODEB.sigle}`} />
    </div>
  );
}
