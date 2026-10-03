/* Contact officiel de l'association : la seule source du numéro dans le code.
   Sans dépendance serveur, importable depuis un composant client ; lu aussi par les scripts
   (scripts/org.py, scripts/build-diaporama.js). Ne jamais recopier ces valeurs ailleurs. */
export const TELEPHONE = "+235 66 29 94 03";
export const TELEPHONE_HREF = "tel:+23566299403";
export const WHATSAPP = "https://wa.me/23566299403";
/* Groupe WhatsApp de l’association (lien d’invitation communiqué le 2 octobre 2026). */
export const GROUPE_WHATSAPP = "https://chat.whatsapp.com/HcbIMO4PBBc2r6u7IjByQz";

/* Réseaux sociaux de l’association : une seule source pour ORG (lib/content.ts), le schéma
   (lib/schema.ts) et le menu « Médias » (lib/navigation.ts, chargé aussi côté client). */
export const RESEAUX = {
  facebook: "https://www.facebook.com/profile.php?id=61594849805565",   // page « Lonodji », créée le 1er octobre 2026
  x: "https://x.com/adeb_lonodji",   // compte X « Lonodji », créé le 1er octobre 2026
  youtube: "https://www.youtube.com/@adeb.lonodji",   // chaîne YouTube « Lonodji », créée le 1er octobre 2026
  linkedin: "https://www.linkedin.com/company/lonodji/",   // page LinkedIn « Lonodji », créée le 3 octobre 2026
};
