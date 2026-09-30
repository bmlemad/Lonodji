/* English version of lib/gouvernance-locale.ts (30/09/2026).
   The French file is the reference: levels, links, statuses and the counts of diagnosis problems are read from
   it; this file only carries the English wording, in the same order and keyed by the same ids. A French item with
   no English counterpart keeps its French text (visible, never silently dropped). */
import { nombrePropositions, PROJETS_PRIORITAIRES } from "./propositions-commune";
import { ARTICULATIONS, INDICATEURS, NIVEAUX, type Lien } from "./gouvernance-locale";

/* Link labels: the linked pages are in French. */
const LIENS_EN: Record<string, string> = {
  "Décentralisation": "Decentralisation",
  "Propositions à la commune": "Proposals to the commune",
  "Note à la commune": "Note to the commune",
  "Paix agriculteurs-éleveurs": "Farmer–herder peace",
  "Lieux sacrés et sépultures": "Sacred sites and burial grounds",
  "Plaidoyer routes et ponts": "Roads and bridges advocacy",
  "Plaidoyer électricité": "Electricity advocacy",
  "Les huit plaidoyers": "The eight advocacy files",
  "Plaidoyer santé": "Health advocacy",
  "Enquêtes de terrain": "Field surveys",
  "Carte des besoins": "Needs map",
  "Complexe sportif": "Sports complex",
  "Bédjondo": "Bédjondo",
};
export const lienEn = (l: Lien): Lien => ({ label: LIENS_EN[l.label] ?? l.label, href: l.href });

const NOMBRES_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const DIZAINES_EN: Record<number, string> = { 2: "twenty", 3: "thirty", 4: "forty", 5: "fifty", 6: "sixty" };
export const inWords = (n: number, capital = false) => {
  const d = Math.floor(n / 10), u = n % 10;
  const t = NOMBRES_EN[n] ?? (DIZAINES_EN[d] ? (u ? `${DIZAINES_EN[d]}-${NOMBRES_EN[u]}` : DIZAINES_EN[d]) : String(n));
  return capital ? t.charAt(0).toUpperCase() + t.slice(1) : t;
};
export const RESUME_PROPOSITIONS_EN = `${inWords(PROJETS_PRIORITAIRES.length, true)} priority projects and ${inWords(nombrePropositions())} measures`;

const NIVEAUX_TEXTE: Record<string, { nom: string; qui: string; role: string; demandes: string[] }> = {
  etat: {
    nom: "The State", qui: "Ministries, agencies, national programmes",
    role: "What the commune cannot do alone: electricity and telecommunications networks, major infrastructure, teachers and health workers, donor-funded programmes.",
    demandes: [
      "Our advocacy files separate what falls to the State from what falls to the commune: we write to N’Djamena only about what the commune cannot do alone.",
      "That national programmes and donors name Bédjondo among their targets.",
    ],
  },
  province: {
    nom: "The province of Mandoul", qui: "Governor; provincial council elected on 29 December 2024",
    role: "A self-governing local authority, like the commune: it is run by an elected assembly. Our files attach to it the boundaries and attachments of the cantons, and fuelwood.",
    demandes: [
      "Bring the State and the province in on the bridge on the Bédjondo–Békamba road, requested by the town’s women since November 2023.",
      "Carry the request to bring electricity to Bédjondo to provincial and national bodies.",
    ],
  },
  departement: {
    nom: "The department of Mandoul Occidental", qui: "Prefect; sub-prefectures (Bédjondo, Bébopen, Békamba, Péni)",
    role: "The State’s representative in the department. Our files address to it the boundary disputes between cantons and the departure of children to gold-mining sites, which the diagnosis attaches to the department.",
    demandes: [
      "That the disputed boundaries between the department’s cantons be surveyed, discussed and settled, rather than reawakened every season; the association undertakes to hand the prefecture its survey of disputed boundaries.",
    ],
  },
  commune: {
    nom: "The commune of Bédjondo", qui: "Mayor; council of eighteen councillors elected for six years",
    role: "An autonomous urban local authority. Thirteen areas shared with the State, including water, sanitation, the market, roads, town planning, and support to schools and health centres.",
    demandes: [
      "Four rules, at no cost: a public and binding communal development plan, own revenues collected and accounted for, sessions announced and open, written agreements with associations.",
      `${RESUME_PROPOSITIONS_EN}, gathered on one page.`,
    ],
  },
  chefferies: {
    nom: "The traditional chieftaincies", qui: "Canton chiefs, village chiefs, customary custodians",
    role: "What may be said about a place, and to whom; preventing conflicts closest to the ground; guaranteeing land. Our files also note the weakening role of traditional authorities, who once settled disputes.",
    demandes: [
      "Chair, in each canton, a joint farmer–herder committee with equal representation, meeting before the season, and keep the mediation logbook with the town hall.",
      "Keep the register of sacred sites, in a single paper copy, under the canton chief’s responsibility, never published; ask the commune to record their perimeters in the plan.",
      "Guarantee in writing, with the commune, the land for public facilities.",
    ],
  },
  quartiers: {
    nom: "Neighbourhoods and residents", qui: "Neighbourhood chiefs; neighbourhood committees (proposed); residents",
    role: "The first informants and the first relays: needs reported, upkeep of local facilities, health relays.",
    demandes: [
      "Recognise by municipal order a committee in each neighbourhood: to relay needs, organise clean-up days, and see to the upkeep of local facilities.",
      "Organise, with neighbourhood chiefs, a community health relay and the upkeep of the town’s streets.",
      "Keep a register of complaints at the town hall, read out in session; report needs on the participatory map.",
    ],
  },
};

export const NIVEAUX_EN = NIVEAUX.map((n) => {
  const t = NIVEAUX_TEXTE[n.id];
  return { ...n, nom: t?.nom ?? n.nom, qui: t?.qui ?? n.qui, role: t?.role ?? n.role,
    demandes: n.demandes.map((d, i) => ({ texte: t?.demandes[i] ?? d.texte, sources: d.sources.map(lienEn) })) };
});

const ARTICULATIONS_TEXTE: { titre: string; qui: string; texte: string }[] = [
  { titre: "The town plan", qui: "Commune · chieftaincy", texte: "The commune adopts the plan and issues building permits; the chieftaincy asks it to record the perimeter of sacred sites and burial grounds — an outline, with no reason given and no name." },
  { titre: "Land for facilities", qui: "Commune · chieftaincy", texte: "Land guaranteed in writing, by the commune and the chieftaincy, before any building work: not one bag of cement without an agreement." },
  { titre: "Peace between farmers and herders", qui: "Canton chiefs · commune · prefecture", texte: "Corridors traced with the canton chiefs, adopted by the commune and posted; a joint committee chaired by the chieftaincy; a mediation logbook in two copies, at the chieftaincy and at the town hall; disputed boundaries taken to the prefecture." },
  { titre: "Neighbourhoods", qui: "Commune · neighbourhood chiefs · residents", texte: "Neighbourhood committees recognised by municipal order, a register of complaints read out in session, health relays and street upkeep organised with the neighbourhood chiefs." },
  { titre: "Consultation", qui: "All levels", texte: "A quarterly consultation committee: town hall, association, prefecture or sub-prefecture, chieftaincies, women’s representatives and youth representatives." },
];
export const ARTICULATIONS_EN = ARTICULATIONS.map((a, i) => ({ ...a, ...(ARTICULATIONS_TEXTE[i] ?? {}), sources: a.sources.map(lienEn) }));

const INDICATEURS_TEXTE: { indicateur: string; verification: string }[] = [
  { indicateur: "Ordinary council sessions announced in advance", verification: "Posted notice and agenda" },
  { indicateur: "The commune’s own revenues published", verification: "Communal administrative account" },
  { indicateur: "Framework agreement between commune and association signed and published", verification: "Agreement published on the site" },
  { indicateur: "Neighbourhood committees recognised by municipal order", verification: "Municipal orders" },
  { indicateur: "Register of complaints kept and read out in session", verification: "Session minutes" },
  { indicateur: "Mediation logbooks kept", verification: "Logbooks, at the chieftaincy and the town hall" },
  { indicateur: "Women and young people on the consultation committee", verification: "Attendance list published" },
];
const VALEURS_EN: Record<string, string> = {
  "non": "no", "oui": "yes", "oui, annuellement": "yes, every year", "signée": "signed", "aucun connu": "none known",
  "un par quartier": "one per neighbourhood", "non connu": "not known", "un par canton": "one per canton",
  "comité non réuni": "committee not yet convened", "à fixer par le comité": "to be set by the committee", "à fixer": "to be set",
};
const v = (s: string) => VALEURS_EN[s] ?? s;
export const INDICATEURS_EN = INDICATEURS.map((x, i) => ({ ...x, indicateur: INDICATEURS_TEXTE[i]?.indicateur ?? x.indicateur,
  verification: INDICATEURS_TEXTE[i]?.verification ?? x.verification, depart: v(x.depart), cible: v(x.cible), echeance: v(x.echeance),
  statutEn: x.statut === "publié" ? "published" : "proposed" }));

export const REGLES_EN: { titre: string; texte: string }[] = [
  { titre: "Nothing without data.", texte: "No figure without its source; the inventories that are missing, we produce." },
  { titre: "Subsidiarity.", texte: "What can be decided in Bédjondo should be decided in Bédjondo." },
  { titre: "Something in return.", texte: "We never ask without committing ourselves." },
  { titre: "A public record.", texte: "Dates sent, replies, commitments: everything is recorded, silences included." },
  { titre: "Upkeep before inauguration.", texte: "Who maintains it, with what money, trained by whom." },
  { titre: "No party, no substitute.", texte: "We put forward no candidates and we replace neither the commune nor the chieftaincies." },
];
