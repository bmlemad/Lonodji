/* English version of lib/propositions-commune.ts (30/09/2026).
   The French file is the reference: the structure, sources, programmes and "no-cost" flags are read from it;
   this file only carries the English wording, item by item, in the same order. A French item with no English
   counterpart keeps its French text (visible, never silently dropped). */
import { APPORTS, DEMARCHE, GROUPES, PROJETS_PRIORITAIRES, type Proposition, type Source } from "./propositions-commune";

/* Source labels: the linked pages are in French. */
const SOURCES_EN: Record<string, string> = {
  "Note à la commune, § 1": "Note to the commune, § 1",
  "Note à la commune, § 2": "Note to the commune, § 2",
  "Note à la commune, § 3": "Note to the commune, § 3",
  "Note à la commune, § 4": "Note to the commune, § 4",
  "Note à la commune, § 5": "Note to the commune, § 5",
  "Note à la commune, § 6": "Note to the commune, § 6",
  "Village devenu ville, proposition 1": "“A village become a town”, proposal 1",
  "Village devenu ville, proposition 2": "“A village become a town”, proposal 2",
  "Village devenu ville, proposition 4": "“A village become a town”, proposal 4",
  "Village devenu ville, proposition 6": "“A village become a town”, proposal 6",
  "Village devenu ville, proposition 7": "“A village become a town”, proposal 7",
  "Village devenu ville, proposition 12": "“A village become a town”, proposal 12",
  "Décentralisation": "Decentralisation",
  "Plaidoyer eau potable": "Drinking water advocacy",
  "Plaidoyer électricité": "Electricity advocacy",
  "Plaidoyer haut débit": "Broadband advocacy",
  "Plaidoyer santé": "Health advocacy",
  "Plaidoyer routes et ponts": "Roads and bridges advocacy",
  "Plaidoyer école": "School advocacy",
  "Plaidoyer formation professionnelle": "Vocational training advocacy",
  "Lieux sacrés et sépultures": "Sacred sites and burial grounds",
  "Agriculture et sécurité alimentaire": "Agriculture and food security",
  "Complexe sportif": "Sports complex",
  "Carte des besoins": "Needs map",
  "Solidarité et inclusion": "Social protection and inclusion",
  "Projet : espace numérique": "Project: digital space",
  "Diagnostic : assainissement": "Diagnosis: sanitation",
  "Environnement et ressources": "Environment and resources",
};
export const sourceEn = (s: Source): Source => ({ label: SOURCES_EN[s.label] ?? s.label, href: s.href });

const GROUPES_TEXTE: { titre: string; em: string; intro: string; items: string[] }[] = [
  { titre: "Plan the town", em: "before building.", intro: "The law gives the commune building permits and the public domain; without a town plan, these powers remain theoretical.", items: [
    "Make the communal development plan public: one page posted at the town hall and online, with three priorities that are dated and costed, debated in session.",
    "Back it with a simple land-use plan: main and secondary roads, residential areas, land reserved for public facilities, areas where no building is allowed.",
    "Issue a first by-law freezing construction in low-lying land and in rainwater runoff corridors.",
    "Mark on this plan the perimeters of sacred sites and burial grounds, at the request of the traditional chieftaincy: an outline on a map, with no reason or name given, that subdivisions, tracks and works respect.",
    "Survey plots and compounds: one register that serves as land registry, street addressing and base for property tax.",
    "Reserve now, in the plan, the land needed for facilities: extension of the water network and standpipes, roads, school sites, the vocational training centre site, a solar plant and street lighting, a public digital space.",
    "Adopt by by-law and post — at the town hall, in the cantons and on the ground — the livestock corridors, grazing areas and cropland mapped with canton chiefs, farmers and herders.",
  ] },
  { titre: "Finance,", em: "and account for it.", intro: "Market fees, business licences, property tax: transparency is what persuades residents to pay and partners to fund.", items: [
    "Regularise the collection of market fees: numbered tickets, a revenue office, monthly posting of the amounts collected.",
    "Open an “infrastructure and maintenance” budget line, fed by a fixed share of revenue, so that maintaining what is built does not depend on the next budget.",
    "Earmark it in particular for drain maintenance and, for solar lighting, for the lamps and battery replacement.",
    "Until pumping is solarised, secure a fuel line in the budget so that water distribution no longer stops.",
  ] },
  { titre: "Open the council,", em: "organise the neighbourhoods.", intro: "The law already provides for council sessions; what is often missing is publicity.", items: [
    "Announce council sessions in advance, post the agenda, make decisions available for consultation; hold a public session every quarter.",
    "Recognise by by-law a neighbourhood committee in each neighbourhood: relaying needs, organising clean-up days, looking after local facilities.",
    "Keep a register of grievances at the town hall, read out in session.",
    "Present public accounts every year, at the excellence ceremony that already brings the town together each summer.",
    "Open an official town hall page on social media; enter the civil registry and plot registers in a spreadsheet, then back them up.",
  ] },
  { titre: "Basic services,", em: "sector by sector.", intro: "Each of our advocacy files separates what is for the State from what is for the commune. Here, gathered together, are the requests addressed to the commune.", items: [
    "Water — create by by-law a management committee for each water point and a communal water service in charge of maintenance, with a tariff that covers upkeep.",
    "Electricity — include electrification in the communal development plan and carry the request to provincial and national bodies.",
    "Broadband — carry the request to the relevant bodies, provide a budget line for a public digital space, report each step forward to residents.",
    "Health — guarantee water, solar power and sanitation at the health centre; organise with neighbourhood chiefs a community relay (community health workers, emergency transport).",
    "Roads — include a road and drainage plan in the communal development plan, reserve rights of way before buildings close them off, organise road maintenance with neighbourhood chiefs.",
    "Schools — guarantee water and solar power in schools, support the parents’ association.",
    "Vocational training — guarantee water and solar power at the centre, add to the commune’s contracts a clause favouring local graduates and craftspeople, and place its first order for school furniture and joinery with the centre’s workshops.",
  ] },
  { titre: "Build partnerships:", em: "the commune can sign.", intro: "A commune can do what an association cannot: sign agreements.", items: [
    "Formally approach the Swiss cooperation and Caritas Switzerland programmes already active in Mandoul, so that their next works are located in Bédjondo.",
    "Refer the Bédjondo–Békamba road bridge to the State and the province, requested by the town’s women since November 2023.",
    "Seek a twinning with a French or Swiss commune.",
    "Sign written agreements with associations stating, for each co-funded facility, who owns it, who maintains it and with what budget — starting with a one-page agreement with ADEB LONODJI.",
    "Guarantee in writing, with the chieftaincy, a site for the sports complex, for sports use and for a long period.",
  ] },
  { titre: "A first visible project,", em: "in under a year.", intro: "A growing commune needs a visible success to rally its residents.", items: [
    "Solar lighting of the market and the main road: stand-alone street lamps, funded half by the commune and half by a diaspora subscription run by ADEB LONODJI, with a share of market fees earmarked for maintenance and battery replacement.",
  ] },
];

export const GROUPES_EN = GROUPES.map((g, i) => {
  const t = GROUPES_TEXTE[i];
  return { ...g, titre: t?.titre ?? g.titre, em: t?.em ?? g.em, intro: t?.intro ?? g.intro,
    items: g.items.map((p, j) => ({ ...p, texte: t?.items[j] ?? p.texte, sources: p.sources.map(sourceEn) })) };
});

const APPORTS_TEXTE = [
  "Mobilise, free of charge, the skills of the diaspora and Bedjond professionals — urban planners, surveyors, engineers, hydraulic engineers, IT specialists — for the studies the commune cannot fund: survey and map of the town, preliminary design of solar lighting, funding applications.",
  "Carry out, with the neighbourhood committees, a participatory assessment of existing facilities; reports from the needs map are summarised for the commune.",
  "Inventory the water points and survey the network, and survey the town’s roads (streets, standing-water spots, rights of way still free).",
  "Run the diaspora subscription for the first project, and co-fund with the commune a first crossing structure or a road-maintenance campaign if the State provides technical supervision.",
  "Organise and co-fund, with the commune and the civil registry, a first birth-certificate campaign.",
  "Set up the town hall’s digital tools (official page, spreadsheet registers) and train those who will keep them.",
  "Publish on this website the progress of each party’s commitments.",
];
export const APPORTS_EN: Proposition[] = APPORTS.map((p, i) => ({ ...p, texte: APPORTS_TEXTE[i] ?? p.texte, sources: p.sources.map(sourceEn) }));

export const EN_RETOUR_EN = [
  "a designated contact at the town hall;",
  "access to the relevant documents: communal development plan, budget, registers;",
  "a consultative seat in the consultation framework that will follow the plan;",
  "the note placed on the agenda of a forthcoming session, and the choice of the first project to start with.",
];

const PROJETS_TEXTE: Record<string, { titre: string; volets: string[]; apport: string[] }> = {
  "eau": { titre: "Drinking water access programme", volets: ["Boreholes fitted with solar pumps", "Rehabilitation of existing water points", "Local water management committees"],
    apport: ["an inventory of water points (condition, flow, management committee) and a survey of the existing network", "emergency repair, with the diaspora, of broken boreholes found by the inventory, and training of local repairers", "support to management committees and training in bookkeeping"] },
  "marche": { titre: "Modern inter-community market", volets: ["Construction of a covered market", "Storage and preservation areas", "Selling areas for women traders"],
    apport: ["the studies and the funding application, entrusted free of charge to the skills of the diaspora", "the diaspora subscription for solar lighting of the market, the first proposed project"] },
  "transformation": { titre: "Agricultural processing centre", volets: ["Processing of cassava, maize, groundnuts and sesame", "Training of cooperatives", "Creating local added value"],
    apport: ["a census of producers, farmed areas and groups, canton by canton, handed to the agricultural services and programmes", "a census of workshops and master craftspeople, trade by trade"] },
  "maison-femme-jeunesse": { titre: "Women’s and Youth Centre", volets: ["Vocational training", "Functional literacy", "Entrepreneurship support"],
    apport: ["a pilot training workshop in solar installation, with the diaspora’s engineers and technicians", "a mentoring network linking Bedjond professionals and students to pupils, and a scholarship fund", "the scholarship fund open first to orphans and young mothers returning to school"] },
  "assainissement": { titre: "Communal sanitation programme", volets: ["Waste collection and treatment", "Hygiene awareness", "Creation of green jobs"], apport: [] },
  "centre-numerique": { titre: "Communal digital centre", volets: ["Digitised administrative services", "Digital skills training", "Internet access for young people"],
    apport: ["co-funding, with the diaspora, of a first community digital space (satellite connection, solar power), also open to the commune’s services", "setting up the town hall’s digital tools and training those who will keep them", "training young people from the town to maintain the equipment"] },
  "maraichage": { titre: "Irrigated market gardens", volets: ["Solar irrigation", "Year-round production", "Women’s and youth cooperatives"],
    apport: ["a census of producers, farmed areas and groups, canton by canton", "training young people in solar installation and maintenance, useful for irrigation"] },
  "reboisement": { titre: "Reforestation and environmental protection", volets: ["Communal woodlands", "Fighting deforestation", "Adding value to forest products"], apport: [] },
  "fonds-microprojets": { titre: "Communal micro-project support fund", volets: ["Funding local initiatives", "Support to community groups", "Developing the local economy"],
    apport: ["a proposal, at the general assembly, for a solidarity fund with written rules and a designated treasurer", "a census, with the consent of those concerned, of rotating savings groups already active, and the search for a microfinance institution working in Mandoul"] },
  "pdc": { titre: "Updating the communal development plan", volets: ["Participatory assessment", "Investment planning", "Mobilising technical and financial partners"],
    apport: ["a participatory assessment of existing facilities with the neighbourhood committees, and a summary of the needs-map reports", "a survey and map of the town by the diaspora’s urban planners and surveyors", "funding applications to partners"] },
};

export const PROJETS_EN = PROJETS_PRIORITAIRES.map((p) => {
  const t = PROJETS_TEXTE[p.id];
  return { ...p, titre: t?.titre ?? p.titre, volets: t?.volets ?? p.volets, deja: p.deja.map(sourceEn),
    apport: p.apport.map((a, j) => ({ ...a, texte: t?.apport[j] ?? a.texte, sources: a.sources.map(sourceEn) })) };
});

export const PORTEURS_EN = ["Drinking water and solar energy", "The agricultural processing centre and the modern market", "The Women’s and Youth Centre, with its digital centre"];
export const PROJET_INTEGRE_EN = {
  titre: "An integrated local economic development project",
  texte: "Bring together a modern market, an agricultural processing centre, solar boreholes and a support fund for young people and women in a single project, led by the commune.",
  pourquoi: "These projects combine job creation, poverty reduction, the empowerment of women and young people, and local economic development: this is the kind of project that local development partners — UNDP, the World Bank, AFD — most often fund, through communes and ministries.",
};

const DEMARCHE_TEXTE = [
  { etape: "Get our house in order", texte: "An up-to-date registration receipt, a recognised board, a bank account in the association’s name, and a focal point living in Bédjondo: without these, no agreement can be signed." },
  { etape: "Open the dialogue", texte: "A meeting with the mayor to hand over the note and these proposals; visits to the prefect of Mandoul Occidental, the sub-prefect of Péni, the canton chiefs of Bébopen, Nderguigui and Yomi and the chieftaincy of Bédjondo." },
  { etape: "Put it in writing", texte: "A one-page framework agreement — each party’s commitments, ownership and maintenance of facilities, publication — and a quarterly consultation committee: town hall, association, administrative and traditional authorities, women and young people." },
  { etape: "A first result within six months", texte: "The participatory assessment and the water-point inventory handed to the commune, or the town hall’s digital tools; then solar lighting of the market, the first visible project." },
  { etape: "Seek funding with the commune", texte: "The commune leads, the association prepares: Bédjondo proposed as a pilot commune for Swiss support to local authorities and for UNDP’s local governance programme." },
];
const ETATS_EN: Record<string, string> = { "en cours": "under way", "à venir": "to come", "fait": "done", "faite": "done" };
export const DEMARCHE_EN = DEMARCHE.map((d, i) => ({ etape: DEMARCHE_TEXTE[i]?.etape ?? d.etape, texte: DEMARCHE_TEXTE[i]?.texte ?? d.texte, etat: ETATS_EN[d.etat] ?? d.etat, enCours: d.etat === "en cours" }));
export const REGLES_EN = [
  "no party and no candidate, and no substituting for the commune or the chieftaincies;",
  "no money collected before a bank account is open in the association’s name;",
  "nothing promised that is not in writing;",
  "every meeting and every agreement published and dated on this website.",
];
