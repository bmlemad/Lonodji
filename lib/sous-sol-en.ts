/* English version of lib/sous-sol.ts (30/09/2026). The French file is the reference: sources, links and order
   are read from it; this file only carries the English wording, item by item in the same order. A French item
   with no English counterpart keeps its French text (visible, never silently dropped). */
import { ENGAGEMENTS, INCONNUES, LECONS, PROPOSITIONS, SAVOIRS, SOURCES, type Constat, type Lien, type Proposition } from "./sous-sol";

/* Link labels: the linked pages are in French, except where an English page exists. */
const LIENS_EN: Record<string, Lien> = {
  "Le Kul et les monnaies de fer": { label: "The Kul and the iron currencies (in French)", href: "/journal/2026-09-15-monnaie-kul-echanges-economiques" },
  "La fondation ndjan": { label: "The Ndjan foundation (in French)", href: "/journal/2026-09-13-bedjondo-bedaya-fondation-ndjan" },
  "Diagnostic territorial": { label: "Territorial diagnosis (in French)", href: "/territoire/diagnostic#prob-06" },
  "Gouvernance locale": { label: "Local governance", href: "/en/governance" },
  "Lieux sacrés et sépultures": { label: "Sacred sites and burial grounds (in French)", href: "/patrimoine/lieux-sacres" },
  "Plaidoyer formation professionnelle": { label: "Vocational training advocacy (in French)", href: "/journal/2026-09-17-plaidoyer-formation-professionnelle-bedjondo" },
  "Plaidoyer électricité": { label: "Electricity advocacy (in French)", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" },
  "Protection sociale, enfance & inclusion": { label: "Social Protection, Children & Inclusion", href: "/en/themes" },
  "Bibliothèque": { label: "Library (in French)", href: "/bibliotheque" },
  "Enquêtes de terrain": { label: "Field surveys (in French)", href: "/territoire/enquetes" },
};
const lienEn = (l: Lien): Lien => LIENS_EN[l.label] ?? l;

const SAVOIRS_TEXTE: { titre: string; texte: string }[] = [
  { titre: "Oil has been produced next door since 2003", texte: "The Doba basin has been in production since its inauguration on 10 October 2003; its fields (Komé, Bolobo, Miandoum, Nya, Moundouli, Maikeri, Timbré) were run by the Esso-led consortium, around Doba, the capital of Logone Oriental. In 2023, the transitional Parliament nationalised ExxonMobil’s assets in Chad." },
  { titre: "The Doba basin is still being explored", texte: "In 2014, United Hydrocarbon reported oil in the Belanga North-1 well, in the Doba basin. In March 2025, the government announced that the Belanga field would come on stream in the third quarter of 2025. We know neither whether it did, nor exactly where the field lies." },
  { titre: "Blocks straddling two basins", texte: "In 2011, ERHC Energy signed a production-sharing contract for block BDS 2008 (41,800 km²), which covers parts of the Doseo and Doba basins. We have not found what this block covers in Mandoul, nor whether it is still active." },
  { titre: "Seismic surveys all around, none located here", texte: "By 2012, about 30,000 km of 2D seismic and 600 km² of 3D had been acquired in Chad, for more than 150 exploration wells. In the south, Glencore acquired with BGP, between 2011 and 2015, four 3D surveys (1,200 km²) and 216 2D lines (4,500 km); in 2017, Delonex ordered 400 km of 2D and 1,200 km² of 3D over Block H, in the Doba basin. The Doseo basin, the eastern neighbour of the Doba basin, stretches some 450 km from west to east: a 2023 study counts about 25,000 km of 2D, 1,200 km² of 3D and 24 wells there. On block BDS 2008, ERHC flew a 4,720 km airborne gravity and magnetic survey in 2014 and then announced a 2D campaign, of which we have found no trace. None of these sources places a seismic line or a well in Mandoul Occidental, or says whether the Doseo basin extends beneath the department." },
  { titre: "A barely studied subsoil", texte: "According to the World Bank, airborne geophysical surveys cover only 5% of Chad’s territory. Saying that the subsoil of Mandoul Occidental is promising is therefore a reasonable hypothesis, next to a producing basin: it is not yet an established fact." },
  { titre: "Iron, a long-standing source of wealth in the Sara country", texte: "In the Sara country, iron came from local ore, mined and then smelted in furnaces by smelters settled in ore-rich areas; south of Lake Chad it was iron, rather than cowries or cattle, that served as currency (Josette Rivallain, ORSTOM, 1988). The Ndjan, founders of Bédjondo and Bédaya, are known for their mastery of this metallurgy. Seismic crews encountered red, iron-rich clay soils and surface laterite in parts of southern Chad, without the source saying where; an iron-rich laterite is not necessarily a workable ore. Whether the department holds workable iron ore in quantity today, no public source we consulted says: it remains to be checked." },
  { titre: "Gold, for now, is elsewhere — and it draws our children", texte: "Artisanal gold mining in Chad has been reported in the north, in the Tibesti, since 2012. Our territorial diagnosis already documents children leaving the department for the northern gold sites, Péni being expressly named." },
];

const INCONNUES_EN: string[] = [
  "Whether an oil, mining or quarry permit currently covers all or part of Mandoul Occidental, for whom, and until when: we have found no map of permits published online.",
  "Whether seismic lines or wells have already crossed the department: tens of thousands of kilometres have been acquired in the neighbouring basins, but no public source gives their layout.",
  "Where the old smelters’ mines and furnaces stood, and what the department’s iron ore is worth today: grade, extent, depth. No public analysis says.",
  "Whether artisanal gold sites or quarries (sand, gravel, laterite, clay) operate in the department, and who authorises them.",
  "What the producing region has received as its share of oil revenue: the 2018 EITI report could not obtain these data from the body that manages it.",
  "The baseline state of the department’s water and soils: without it, no future damage can be proven.",
];

const LECONS_TEXTE: { titre: string; texte: string }[] = [
  { titre: "A local share written into law…", texte: "Law 001/PR/1999 reserved 4.5% of direct oil revenue for the producing region of the south, as additional funding. Chad has been part of the Extractive Industries Transparency Initiative (EITI) since 20 August 2007; according to the 2018 EITI report, oil revenue management was then governed by Law 02/2014." },
  { titre: "… is not enough", texte: "The revision of the law at the end of 2005 abolished the future generations fund and raised the share paid into the general budget from 15% to 30%. In 2021, a report from Komé found that electricity from the oil installations had never reached the neighbouring villages, and that buildings funded by the regional share had been put up in absurd places." },
  { titre: "What we take from it", texte: "A resource does not, by itself, benefit those who live on it. The rules must be set before the first well, not after: who is consulted, what is protected, what returns to the territory, and how it is checked." },
];

const PROPOSITIONS_TEXTE: { qui: string; texte: string }[] = [
  { qui: "State · ministries of Petroleum and Mines", texte: "Publish the oil, mining and quarry permits covering Mandoul Occidental (holder, dates, perimeter), and the layout of the seismic lines and wells already carried out in the department. Since Chad is a member of the EITI, this information should be public." },
  { qui: "Prefecture · sub-prefectures", texte: "Inform the commune and the canton chiefs in writing before any survey, drilling or site opening, and bring the communities concerned together before the work, not after." },
  { qui: "Commune · chieftaincies", texte: "Record in the town plan the perimeter of sacred sites and burial grounds before any exploration, and guarantee land compensation in writing." },
  { qui: "Operators, if any", texte: "Publish a baseline of water and soils before the work; hire and train in the department first; share the electricity produced on site with the neighbouring villages." },
  { qui: "Everyone", texte: "No child on an extraction site, here or in the north." },
];

const ENGAGEMENTS_TEXTE: { qui: string; texte: string }[] = [
  { qui: "Write", texte: "Ask the ministries in writing for the map of permits and seismic surveys covering the department, and publish the reply — or the silence." },
  { qui: "Document", texte: "Gather in our library the public studies on the geology of the Bedjond country and the Doba basin." },
  { qui: "Survey", texte: "Carry out the field survey on departures to gold sites, always with two surveyors, and without the completed forms leaving the office." },
  { qui: "Stay independent", texte: "Accept no funding from an extractive company without publishing it." },
];

const constats = (fr: Constat[], en: { titre: string; texte: string }[]) =>
  fr.map((c, i) => ({ ...c, titre: en[i]?.titre ?? c.titre, texte: en[i]?.texte ?? c.texte, liens: c.liens?.map(lienEn) }));
const propositions = (fr: Proposition[], en: { qui: string; texte: string }[]) =>
  fr.map((p, i) => ({ ...p, qui: en[i]?.qui ?? p.qui, texte: en[i]?.texte ?? p.texte, liens: p.liens?.map(lienEn) }));

export const SAVOIRS_EN = constats(SAVOIRS, SAVOIRS_TEXTE);
export const INCONNUES_EN_LISTE = INCONNUES.map((q, i) => INCONNUES_EN[i] ?? q);
export const LECONS_EN = constats(LECONS, LECONS_TEXTE);
export const PROPOSITIONS_EN = propositions(PROPOSITIONS, PROPOSITIONS_TEXTE);
export const ENGAGEMENTS_EN = propositions(ENGAGEMENTS, ENGAGEMENTS_TEXTE);

/* Publisher and date of each source in English, by source id (lib/sous-sol.ts keeps them in French).
   Titles stay in their original language. A source with no entry here keeps its French publisher and date. */
const SOURCES_EN: Record<string, { editeur?: string; date?: string }> = {
  manara: { date: "10 October 2025" },
  itie2018: { editeur: "EITI Chad", date: "2018 financial year" },
  doba: { editeur: "Wikipedia (English)", date: "accessed 30 September 2026" },
  ecofin2014: { date: "2 April 2014" },
  ecomatin2025: { date: "13 March 2025" },
  erhc: { date: "accessed 30 September 2026" },
  bm2023: { editeur: "World Bank", date: "August 2023" },
  orTchad: { editeur: "Wikipedia (French)", date: "accessed 30 September 2026" },
  crs2004: { editeur: "Catholic Relief Services and Bank Information Center", date: "December 2004" },
  afrik2005: { date: "30 December 2005" },
  bm2019: { editeur: "World Bank", date: "February 2019" },
  cseg2015: { date: "December 2015" },
  blocH2017: { date: "9 November 2017" },
  erhc2014: { date: "October 2014" },
  kome2021: { date: "21 May 2021" },
};
export const sourceEn = (id: string) => {
  const s = SOURCES[id];
  return { ...s, editeur: SOURCES_EN[id]?.editeur ?? s.editeur, date: SOURCES_EN[id]?.date ?? s.date };
};
