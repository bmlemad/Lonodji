/* Répertoire des compétences de la diaspora : listes partagées entre la page
   (formulaire) et ses compteurs. Les clés servent de noms de champs
   (domaine-<clé>, offre-<clé>) et de clés d'agrégation dans /api/indicateurs. */

export const DOMAINES: [string, string][] = [
  ["sante", "Santé & médecine"],
  ["education", "Éducation & formation"],
  ["ingenierie", "Ingénierie, BTP & énergie"],
  ["droit", "Droit & justice"],
  ["entreprise", "Entrepreneuriat, finance & gestion"],
  ["numerique", "Informatique & numérique"],
  ["agriculture", "Agriculture, élevage & environnement"],
  ["communication", "Communication, médias & culture"],
  ["administration", "Administration, gouvernance & développement"],
  ["autre", "Autre domaine"],
];

export const OFFRES: [string, string][] = [
  ["conseil", "Relire, conseiller ou expertiser à distance (un dossier, un plaidoyer, un devis)"],
  ["mentorat", "Accompagner un jeune ou une jeune de Bédjondo (mentorat)"],
  ["formation", "Former à distance (un atelier, un cours, une session)"],
  ["mission", "Venir sur place pour une mission courte"],
  ["reseau", "Ouvrir mon réseau (contacts, partenaires, financeurs)"],
  ["financement", "Financer un besoin précis, quand la collecte sera autorisée"],
];
