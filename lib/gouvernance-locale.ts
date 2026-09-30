/* Gouvernance locale (30/09/2026) : qui décide quoi, du plus local au plus national, et ce que nos dossiers
   demandent à chaque niveau. Rien de nouveau ici, sauf les indicateurs marqués « proposé » : chaque ligne
   reprend un texte déjà publié, avec son lien. Les problématiques du diagnostic sont comptées depuis le
   tableau publié (colonne « Qui décide »), pas recopiées. */

import { enLettres, getPage } from "./content";
import { nombrePropositions, PROJETS_PRIORITAIRES } from "./propositions-commune";

export type Lien = { label: string; href: string };

/* « Dix projets prioritaires et vingt-neuf mesures », compté dans lib/propositions-commune.ts */
export const RESUME_PROPOSITIONS = `${enLettres(PROJETS_PRIORITAIRES.length, true)} projets prioritaires et ${enLettres(nombrePropositions())} mesures`;
export type Niveau = {
  id: string; nom: string; qui: string;
  decideurs: string[];            // valeurs de la colonne « Qui décide » du diagnostic rattachées à ce niveau
  role: string;                   // ce qui relève de ce niveau, d'après nos dossiers
  demandes: { texte: string; sources: Lien[] }[];
};

const L = {
  decentralisation: { label: "Décentralisation", href: "/territoire/decentralisation" },
  propositions: { label: "Propositions à la commune", href: "/territoire/propositions-commune" },
  note: { label: "Note à la commune", href: "/journal/2026-09-16-note-commune-bedjondo" },
  paix: { label: "Paix agriculteurs-éleveurs", href: "/programmes/agriculteurs-eleveurs" },
  lieux: { label: "Lieux sacrés et sépultures", href: "/patrimoine/lieux-sacres" },
  routes: { label: "Plaidoyer routes et ponts", href: "/journal/2026-09-17-plaidoyer-routes-ponts-bedjondo" },
  electricite: { label: "Plaidoyer électricité", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" },
  plaidoyers: { label: "Les huit plaidoyers", href: "/actions" },
  sante: { label: "Plaidoyer santé", href: "/journal/2026-09-17-plaidoyer-sante-bedjondo" },
  enquetes: { label: "Enquêtes de terrain", href: "/territoire/enquetes" },
  besoins: { label: "Carte des besoins", href: "/territoire/besoins" },
  complexe: { label: "Complexe sportif", href: "/projets/complexe-sportif" },
  bedjondo: { label: "Bédjondo", href: "/territoire/bedjondo" },
} satisfies Record<string, Lien>;
export { L as LIENS_GOUVERNANCE };

export const NIVEAUX: Niveau[] = [
  {
    id: "etat", nom: "L’État", qui: "Ministères, agences, programmes nationaux",
    decideurs: ["National"],
    role: "Ce que la commune ne peut pas faire seule : réseaux d’électricité et de télécommunications, grands ouvrages, enseignants et soignants, programmes financés par les bailleurs.",
    demandes: [
      { texte: "Nos plaidoyers séparent ce qui relève de l’État de ce qui relève de la commune : nous n’écrivons à N’Djamena que pour ce que la commune ne peut pas faire seule.", sources: [L.decentralisation, L.plaidoyers] },
      { texte: "Que les programmes nationaux et les bailleurs nomment Bédjondo dans leurs cibles.", sources: [L.decentralisation] },
    ],
  },
  {
    id: "province", nom: "La province du Mandoul", qui: "Gouverneur ; conseil provincial élu le 29 décembre 2024",
    decideurs: ["Province"],
    role: "Collectivité dotée de la libre administration, comme la commune : elle s’administre par une assemblée élue. Nos dossiers lui rattachent les limites et rattachements des cantons, et le bois-énergie.",
    demandes: [
      { texte: "Saisir l’État et la province sur le pont de l’axe Bédjondo–Békamba, demandé par les femmes de la ville dès novembre 2023.", sources: [L.note, L.routes] },
      { texte: "Porter la demande d’électrification de Bédjondo dans les instances provinciales et nationales.", sources: [L.electricite] },
    ],
  },
  {
    id: "departement", nom: "Le département du Mandoul Occidental", qui: "Préfet ; sous-préfectures (Bédjondo, Bébopen, Békamba, Péni)",
    decideurs: ["Département"],
    role: "Le représentant de l’État dans le département. Nos dossiers lui adressent les différends de limites entre cantons et le départ d’enfants vers les sites aurifères, que le diagnostic rattache au département.",
    demandes: [
      { texte: "Que les limites contestées entre cantons du département soient relevées, discutées et arrêtées, plutôt que réveillées à chaque saison ; l’association s’engage à remettre à la préfecture le relevé des limites contestées.", sources: [L.paix] },
    ],
  },
  {
    id: "commune", nom: "La commune de Bédjondo", qui: "Maire ; conseil de dix-huit conseillers élus pour six ans",
    decideurs: ["Commune"],
    role: "Collectivité autonome de catégorie urbaine. Treize domaines partagés avec l’État, dont l’eau, l’assainissement, le marché, la voirie, l’urbanisme, l’appui aux écoles et aux centres de santé.",
    demandes: [
      { texte: "Quatre règles, sans dépense : un plan de développement communal public et opposable, des ressources propres collectées et rendues, des sessions annoncées et ouvertes, des conventions écrites avec les associations.", sources: [L.decentralisation, L.note] },
      { texte: `${RESUME_PROPOSITIONS}, réunis sur une page.`, sources: [L.propositions] },
    ],
  },
  {
    id: "chefferies", nom: "Les chefferies", qui: "Chefs de canton, chefs de village, détenteurs coutumiers",
    decideurs: ["Canton", "Chefferie"],
    role: "Ce qui peut être dit d’un lieu, et à qui ; la prévention des conflits au plus près ; la garantie des terrains. Nos dossiers relèvent aussi l’affaiblissement du rôle des autorités traditionnelles, qui apaisaient autrefois les différends.",
    demandes: [
      { texte: "Présider, dans chaque canton, un comité mixte agriculteurs-éleveurs à parité, réuni avant la saison, et tenir avec la mairie le cahier de médiation.", sources: [L.paix] },
      { texte: "Tenir le registre des lieux sacrés, en un seul exemplaire papier, sous la responsabilité du chef de canton, jamais publié ; saisir la commune pour inscrire leurs périmètres au plan.", sources: [L.lieux] },
      { texte: "Garantir par écrit, avec la commune, les terrains des équipements publics.", sources: [L.complexe] },
    ],
  },
  {
    id: "quartiers", nom: "Les quartiers et les habitants", qui: "Chefs de quartier ; comités de quartier (proposés) ; habitants",
    decideurs: [],
    role: "Les premiers informateurs et les premiers relais : besoins signalés, entretien des équipements de proximité, relais de santé.",
    demandes: [
      { texte: "Reconnaître par arrêté un comité de quartier dans chaque quartier : relayer les besoins, organiser les journées de salubrité, veiller à l’entretien des équipements de proximité.", sources: [L.note, L.propositions] },
      { texte: "Organiser avec les chefs de quartier un relais communautaire de santé et l’entretien des voies de la ville.", sources: [L.sante, L.routes] },
      { texte: "Tenir à la mairie un registre des doléances, lu en session ; signaler les besoins sur la carte participative.", sources: [L.note, L.besoins] },
    ],
  },
];

/* Là où deux niveaux doivent agir ensemble : chacun de ces points est déjà écrit dans un dossier. */
export const ARTICULATIONS: { titre: string; qui: string; texte: string; sources: Lien[] }[] = [
  { titre: "Le plan de la ville", qui: "Commune · chefferie", texte: "La commune arrête le plan et le permis de construire ; la chefferie la saisit pour y porter le périmètre des lieux sacrés et des sépultures — un contour, sans motif ni nom.", sources: [L.lieux, L.propositions] },
  { titre: "Les terrains des équipements", qui: "Commune · chefferie", texte: "Un terrain garanti par écrit, par la commune et la chefferie, avant tout chantier : pas un sac de ciment sans convention.", sources: [L.complexe] },
  { titre: "La paix entre agriculteurs et éleveurs", qui: "Chefs de canton · commune · préfecture", texte: "Couloirs tracés avec les chefs de canton, arrêtés par la commune et affichés ; comité mixte présidé par la chefferie ; cahier de médiation en deux exemplaires, à la chefferie et à la mairie ; limites contestées portées à la préfecture.", sources: [L.paix] },
  { titre: "Les quartiers", qui: "Commune · chefs de quartier · habitants", texte: "Comités de quartier reconnus par arrêté, registre des doléances lu en session, relais de santé et entretien des voies organisés avec les chefs de quartier.", sources: [L.note, L.sante, L.routes] },
  { titre: "La concertation", qui: "Tous les niveaux", texte: "Un comité de concertation trimestriel : mairie, association, préfecture ou sous-préfecture, chefferies, représentantes des femmes et représentants des jeunes.", sources: [L.propositions] },
];

/* Indicateurs de gouvernance : les deux du cadre de résultats des plaidoyers (publiés), et des indicateurs
   proposés le 30/09/2026, à valider par le bureau — sans cible chiffrée ni échéance tant qu'ils ne le sont pas. */
export const INDICATEURS: { indicateur: string; depart: string; cible: string; echeance: string; verification: string; statut: "publié" | "proposé" }[] = [
  { indicateur: "Sessions ordinaires du conseil annoncées à l’avance", depart: "0 / 2", cible: "2 / 2", echeance: "2027", verification: "Avis affiché et ordre du jour", statut: "publié" },
  { indicateur: "Recettes propres de la commune publiées", depart: "non", cible: "oui, annuellement", echeance: "2027", verification: "Compte administratif communal", statut: "publié" },
  { indicateur: "Convention-cadre commune–association signée et publiée", depart: "non", cible: "signée", echeance: "à fixer", verification: "Convention publiée sur le site", statut: "proposé" },
  { indicateur: "Comités de quartier reconnus par arrêté", depart: "aucun connu", cible: "un par quartier", echeance: "à fixer", verification: "Arrêtés municipaux", statut: "proposé" },
  { indicateur: "Registre des doléances tenu et lu en session", depart: "non connu", cible: "oui", echeance: "à fixer", verification: "Procès-verbal de session", statut: "proposé" },
  { indicateur: "Cahiers de médiation tenus", depart: "0", cible: "un par canton", echeance: "à fixer", verification: "Cahiers, à la chefferie et à la mairie", statut: "proposé" },
  { indicateur: "Femmes et jeunes au comité de concertation", depart: "comité non réuni", cible: "à fixer par le comité", echeance: "à fixer", verification: "Liste de présence publiée", statut: "proposé" },
];

/* Problématiques du diagnostic, par échelon de décision (colonne « Qui décide » du tableau publié). */
export function problemesParDecideur(): Record<string, { id: string; texte: string }[]> {
  const html = getPage("problematiques").sections.map((s) => s.html).join("");
  const out: Record<string, { id: string; texte: string }[]> = {};
  for (const m of html.matchAll(/<tr[^>]*id="(prob-\d+)"[^>]*>([\s\S]*?)<\/tr>/g)) {
    const c = [...m[2].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((x) => x[1].replace(/<a[\s\S]*?<\/a>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim());
    if (c.length === 4) c.shift();
    if (c.length !== 3) continue;
    (out[c[2]] ??= []).push({ id: m[1], texte: c[0].replace(/\s*\(\s*\)\s*$/, "").split(" — ")[0] });
  }
  return out;
}
