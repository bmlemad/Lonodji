/* Adresse où les formulaires du site envoient leurs données.
   - Netlify (hébergement actuel) : /__forms.html, intercepté par Netlify Forms.
   - OVH (export statique, scripts/statique/construire.sh) : /formulaires.php, servi par serveur/ovh/formulaires.php.
   La valeur se fixe à la construction (NEXT_PUBLIC_FORMULAIRES_URL) ; les composants ne la connaissent pas. */
export const FORMULAIRES_URL = process.env.NEXT_PUBLIC_FORMULAIRES_URL || "/__forms.html";
