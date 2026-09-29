import NextLink from "next/link";
import type { ComponentProps } from "react";

/* Lien du site. Sans préchargement automatique : mesuré le 29 septembre 2026
   sur téléphone, chaque page déclenchait de 170 à 210 ko de préchargements
   (les liens du menu, du pied de page et des listes), pour un public qui paie
   la donnée au mégaoctet. Le contenu d'une page se charge au clic, en une
   requête ; une page peut rétablir le préchargement d'un lien précis en
   passant prefetch explicitement. */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
