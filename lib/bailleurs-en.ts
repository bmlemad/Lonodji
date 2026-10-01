/* English version of the donor-programme survey (lib/bailleurs.ts), same date, same sources.
   Proper names, references and amounts stay as published; everything else is translated.
   Keep in step with lib/bailleurs.ts: a programme without an entry here falls back to French. */
import type { Famille, Portee, Statut } from "./bailleurs";

export const RELEVE_EN = "29 September 2026";

export const FAMILLES_EN: Record<Famille, string> = {
  "banque-mondiale": "World Bank",
  europe: "European Union and European cooperation",
  "nations-unies": "United Nations system",
  "bad-fonds": "African Development Bank and global funds",
  autres: "Other partners",
};

export const STATUTS_EN: Record<Statut, string> = {
  actif: "Ongoing",
  preparation: "In preparation",
  "fin-proche": "Ending soon",
  clos: "Closed",
  incertain: "To be checked",
};

export const PORTEES_EN: Record<Portee, string> = {
  bedjondo: "Active in Bédjondo",
  koumra: "Koumra named",
  mandoul: "Mandoul named",
  sud: "Southern Chad",
  national: "National",
  "hors-zone": "Outside our area",
};

export const PLAIDOYERS_EN: Record<string, string> = {
  "plaidoyer-eau": "Drinking water",
  "plaidoyer-electricite": "Electricity",
  "plaidoyer-sante": "Health",
  "plaidoyer-routes": "Roads and bridges",
  "plaidoyer-education": "Education",
  "plaidoyer-formation-pro": "Vocational training",
  "plaidoyer-internet": "Broadband internet",
  "plaidoyer-commune": "Note to the commune",
};

export type ProgrammeEn = { bailleur: string; nom: string; montant: string; periode: string; zones: string; accroche: string };

export const PROGRAMMES_EN: Record<string, ProgrammeEn> = {
  deesse: { bailleur: "AFD — CARE France, BASE, Groupe URD", nom: "DEESSE — women’s sexual and reproductive health and rights (PASFASS2 component)", montant: "€11M (CARE component €5.25M)", periode: "2024 → February 2028", zones: "Mandoul and Logone Oriental; community forums held in Bédjondo on 27 September 2026 by BASE Mandoul", accroche: "The partner most present in Bédjondo: offer BASE Mandoul a community partnership (women’s groups, messages in Bedjond) and report health-centre needs to it." },
  paaet: { bailleur: "World Bank (IDA) — Ministry of Energy, SNE", nom: "PAAET — Chad Energy Access Scale-up", montant: "USD 295M", periode: "2022 → June 2027", zones: "Solar plant with storage in Koumra (procurement plan, September 2026); a batch of 700,000 solar kits “for the other areas” under procurement", accroche: "Ask the project unit and SNE in writing to include Bédjondo in the next batch of kits and in the grid extension from Koumra, with a census of households and services." },
  prpss: { bailleur: "World Bank (IDA, GFF) — Ministry of Health", nom: "PRPSS — health system performance (results-based financing)", montant: "USD 240M", periode: "2021 → December 2026", zones: "Eight provinces including Mandoul; Koumra hospital among the provincial hospitals to be upgraded", accroche: "Before December 2026, ask the Mandoul health delegation to bring Bédjondo’s health centres into results-based financing." },
  "sahit-na": { bailleur: "World Bank (IDA) — Ministry of Public Health", nom: "SAHIT-NA — health system resilience (PRPSS successor)", montant: "USD 80M (indicative)", periode: "approval expected March 2027", zones: "Extends results-based financing “to the remaining provinces”; areas not specified", accroche: "Window open during design: send the ministry and the Bank office a note on Bédjondo’s health map." },
  "bid-unicef-sante": { bailleur: "Islamic Development Bank, Lives and Livelihoods Fund, Government, UNICEF", nom: "Maternal and child health — 104 health facilities", montant: "USD 48.4M", periode: "2023 → around 2028", zones: "Ennedi Est, Mandoul, Salamat; 20 facilities built and 84 rehabilitated, Mandoul districts not specified", accroche: "Ask the Mandoul health delegation and UNICEF for the list of selected facilities, and advocate for Bédjondo’s health centre (rehabilitation, obstetric care, solar water)." },
  "paepa-2": { bailleur: "AfDB (Transition Support Facility) — Ministry of Water", nom: "PAEPA SU MR phase II — semi-urban and rural water supply and sanitation", montant: "UA 28M", periode: "2023 → December 2028", zones: "54 piped mini-networks including Mandoul, 225 hand-pump boreholes, 500 latrines; Mandoul localities named: Nadilli (Moïssala), Mouroum Goulaye, Béssada, Béboro cantons — not Bédjondo. 4.9% disbursed in April 2026", accroche: "Direct recipient of our water advocacy: borehole lists are not closed; ask the programme coordination to add Bédjondo and its villages, with a needs sheet per locality." },
  "chine-eau": { bailleur: "China (grant) — Ministry of Water and Energy", nom: "Drinking water supply assistance to Chad", montant: "not published", periode: "since October 2024", zones: "Mandoul and Salamat: over 500 boreholes, 57 stations; Koumra (Madan quarter), Kouman, Ngonbé named — not Bédjondo", accroche: "Ask the provincial water delegation for the list of sites built in Mandoul Occidental; if Bédjondo is missing, request its inclusion in an extension, copying the Chinese embassy." },
  swedd: { bailleur: "World Bank (IDA)", nom: "SWEDD+ — women’s empowerment and demographic dividend", montant: "USD 82.5M (Chad)", periode: "2023 → 2028–2030", zones: "Extended to Mandoul (17 of 23 provinces)", accroche: "Put Bédjondo’s women’s groups and “safe spaces” forward to the national unit, and offer to act as a community partner." },
  mbaidene: { bailleur: "European Union (call “Women, Peace and Security 1325”)", nom: "MBAIDENE — women’s resilience, rights and opportunities", montant: "€2.6M (sub-grants up to €60,000)", periode: "August 2026 → August 2031", zones: "Mandoul, Logone Occidental, Lac", accroche: "Identify the grant-holding NGO through the EU delegation and position the association as a local sub-grantee in Mandoul." },
  unfpa: { bailleur: "UNFPA", nom: "8th country programme — maternal health, family planning, GBV, youth", montant: "USD 60M", periode: "2024 → 2028", zones: "12 provinces including Mandoul, Logone Oriental and Moyen-Chari", accroche: "Ask for Bédjondo’s health centre to join the emergency obstetric and newborn care network, and offer the association as a community partner for youth and health." },
  hnrp: { bailleur: "OCHA and the Humanitarian Country Team", nom: "Humanitarian Response Plan 2026", montant: "USD 986M required, 35% funded as of 30 June", periode: "2026", zones: "Mandoul Occidental among the 29 priority departments of the WASH cluster; flooding possible in Mandoul", accroche: "Core argument of our water advocacy: send the WASH cluster a needs sheet per Bédjondo neighbourhood, and report floods and tensions through the alert tools." },
  renfort: { bailleur: "IFAD (+ Green Climate Fund)", nom: "RENFORT — agro-pastoral entrepreneurship for youth and women", montant: "over USD 100M according to the press (not verified)", periode: "2023 → March 2029", zones: "Six provinces including Mandoul (departments not specified); disbursements suspended late 2024 – early 2025 after an audit", accroche: "Ask the management unit whether Mandoul departments are covered and introduce Bédjondo’s youth and women’s groups." },
  sodefika: { bailleur: "Swiss cooperation (SDC) — Caritas Switzerland", nom: "SODEFIKA — groundnut, sesame and shea value chains", montant: "CHF 8.2M", periode: "2023 → November 2027", zones: "Logone Oriental, Mandoul, Moyen-Chari; 120,000 people, at least 60% women", accroche: "Point out Bédjondo’s sesame and shea producer groups so they can access the project’s seeds, storage and credit." },
  pfnl: { bailleur: "Swiss cooperation (SDC)", nom: "Non-timber forest products (néré, shea, honey)", montant: "CHF 12.4M", periode: "2021 → February 2027", zones: "Logone Oriental, Mandoul, Moyen-Chari", accroche: "Point out shea and néré processors, and ask whether a phase 2 is planned after 2027." },
  nexsud: { bailleur: "AFD and European Union — Caritas Switzerland (lead)", nom: "NexSud — socio-economic resilience in southern Chad", montant: "€13M AFD + €7M EU (figures to reconcile)", periode: "2024 → 2029", zones: "Logone Oriental, Mandoul, Moyen-Chari; localities not specified", accroche: "Ask Caritas Switzerland Chad whether Mandoul Occidental cantons are covered and, if not, for Bédjondo’s inclusion at the mid-term review." },
  alapaj: { bailleur: "European Union and AFD — Enfants du Monde", nom: "AQUEDUCT-ALAPAJ “Bâtisseuses d’avenir” — non-formal education and literacy", montant: "€37.8M", periode: "2022 → 2026–2027", zones: "Mandoul (42 literacy centres, 30 non-formal education centres; committees supported in Koumra in April 2026), Logone Oriental, Ouaddaï, Wadi Fira", accroche: "Ask Enfants du Monde whether Bédjondo has centres, and offer diaspora support to keep them running after the project." },
  "corridor-competences": { bailleur: "AFD — Enfants du Monde, ESSOR (and EU programme FORMAPRO, €30M)", nom: "Vocational skills along the N’Djamena–Douala corridor", montant: "not found (FORMAPRO: €30M)", periode: "launched in Koumra on 10 June 2026, 4 years", zones: "Mandoul province (launch in Koumra); exact link with FORMAPRO to be confirmed", accroche: "Direct recipient of our vocational training advocacy: ask for Bédjondo’s training centre to be selected as a partner centre." },
  lapia: { bailleur: "European Union (CSO programme) — Coginta", nom: "LAPIA — social cohesion and peaceful coexistence in the south", montant: "€2M", periode: "November 2024 → October 2027", zones: "Logone Oriental, Mandoul (Mandoul Oriental, Koumra), Moyen-Chari; 18 dialogue committees", accroche: "Propose extending a dialogue committee to the Bedjond cantons, with radio messages in Bedjond." },
  "pbf-hi": { bailleur: "Peacebuilding Fund — Humanity & Inclusion", nom: "Women’s groups and agro-pastoral conflict in Logone Oriental and Mandoul", montant: "USD 1.8M", periode: "September 2024 → 25 September 2026", zones: "Logone Oriental; Mandoul Oriental (Koumra) — not Mandoul Occidental", accroche: "The project has just ended: ask HI, UFEP and the Fund secretariat for a phase 2 reaching Mandoul Occidental." },
  pea: { bailleur: "European Union (Global Gateway) — AFD, GIZ", nom: "Agri-food entrepreneurship programme (PEA, including PAMELOT)", montant: "€45.2M", periode: "2025 → 2029", zones: "N’Djamena–Douala corridor, including Mandoul (technical assistance sheet)", accroche: "Introduce Bédjondo’s agri-food entrepreneurs to the operators of the AFD component (ESSOR, Bet Al Nadjah)." },
  "ue-electrification-sud": { bailleur: "European Union — GIZ", nom: "Access to modern energy services in southern Chad", montant: "€20.5M (and €27.3M for the N’Djamena–Moundou–Sarh axis)", periode: "2026 → 2029", zones: "Two secondary towns on the corridor electrified with renewables; which ones: not published", accroche: "Add GIZ and the EU delegation to the recipients of our electricity advocacy and ask for the town selection criteria." },
  "ddc-collectivites": { bailleur: "Swiss cooperation — UNDP (RGDL), Initiative Développement (AGIL)", nom: "Support to local authorities", montant: "CHF 4.5M (CHF 22M with partners)", periode: "September 2026 → September 2029", zones: "23 provincial councils; 4 pilot municipalities not named; 29 citizen initiatives to fund", accroche: "Propose a Bédjondo “citizen initiative” together with the town hall, and check whether the commune can be a pilot." },
  patn: { bailleur: "World Bank (IDA) — Ministry of Communications and Digital Economy", nom: "PATN — Chad digital transformation", montant: "USD 92.2M", periode: "2024 → April 2029", zones: "3G/4G in 500 unserved localities, community digital centres; list of unserved areas not published; presented to Moyen-Chari authorities in March 2026", accroche: "Ask in writing for Bédjondo and its cantons to be on the list of 500 unserved areas, and for a community digital centre." },
  smarted: { bailleur: "IsDB, BADEA, OPEC Fund, Saudi Fund, Global Partnership for Education", nom: "SmartEd — inclusive basic education", montant: "about USD 160M", periode: "2026 → 2030", zones: "All 23 provinces; 2,400 to 2,848 classrooms, 35,000 teachers trained; school selection under way", accroche: "Send the provincial delegation a “Bédjondo schools” file now (enrolment, classes under straw shelters, latrines) for the site list." },
  "education-bm": { bailleur: "World Bank (IDA) — Ministry of National Education", nom: "Improving learning outcomes", montant: "USD 144.1M", periode: "2022 → October 2027", zones: "1,500 classrooms with latrines and water points; community teachers; national", accroche: "Ask for Bédjondo schools to be on the construction lists and for community teachers to be registered." },
  "competences-bm": { bailleur: "World Bank (IDA)", nom: "Foundational learning and skills for employment", montant: "USD 60M", periode: "approval expected May 2027", zones: "Not specified", accroche: "During preparation, propose Bédjondo’s vocational training centre as a pilot site." },
  acpesi: { bailleur: "AfDB", nom: "ACPESI-4.0 — skills and employment (at least 30 training centres)", montant: "not found", periode: "feasibility studies in 2026", zones: "Sites not chosen", accroche: "The most strategic entry point for our training advocacy: approach the ministry and the AfDB office now so that Bédjondo is among the centres studied." },
  unicef: { bailleur: "UNICEF", nom: "Country programme 2027–2030 (water, health, education, protection, civil registration)", montant: "USD 288.8M planned", periode: "2027 → 2030 (submitted September 2026)", zones: "Provinces not named; “child-friendly” municipal plans, decentralised civil registration, solarisation of services", accroche: "Propose Bédjondo as a pilot for a “child-friendly” municipal plan and a decentralised civil registration centre." },
  unsdcf: { bailleur: "Office of the UN Resident Coordinator", nom: "UN–Chad Cooperation Framework 2027–2030 (UNSDCF)", montant: "to be defined", periode: "work launched on 22 May 2026", zones: "Convergence provinces to be defined", accroche: "Ask to take part in civil-society consultations and submit a “Mandoul Occidental / Bédjondo” note summarising our advocacy briefs and the note to the commune." },
  "pnud-minireseaux": { bailleur: "UNDP and GEF — ADERME", nom: "Mini-grids and rural electrification (Africa Minigrids, GEF project preparation)", montant: "USD 600,000 (GEF); preparation USD 44,000", periode: "preparation 2026 → 2027", zones: "Sites not chosen", accroche: "During preparation, ask UNDP and ADERME to list Bédjondo among candidate sites for solar mini-grids." },
  "pnud-rgdl": { bailleur: "UNDP", nom: "Governance for local development (RGDL)", montant: "USD 450,000", periode: "March 2026 → March 2029", zones: "National", accroche: "Propose Bédjondo as a pilot for planning and participatory budgeting tools." },
  "fonds-mondial": { bailleur: "Global Fund — Ministry of Health, UNDP", nom: "Malaria, HIV, tuberculosis (current grants, cycle 8 in preparation)", montant: "USD 110.6M (HIV-TB, 2024–2027)", periode: "2024 → 2027", zones: "National; 2026 bed-net campaign in 16 provinces", accroche: "Report villages not reached by bed nets to the country coordinating mechanism and ask to join the cycle 8 country dialogue." },
  cerp: { bailleur: "World Bank (IDA)", nom: "Contingent Emergency Response (CERP)", montant: "triggered in a crisis", periode: "2026 → 2032", zones: "Mandoul among the provinces with multi-hazard response plans", accroche: "Document floods and epidemics in Bédjondo and pass them to Mandoul civil protection." },
  "unesco-pci": { bailleur: "UNESCO", nom: "Pilot inventory of intangible cultural heritage in six provinces", montant: "USD 99,610 to 250,000 (sources differ)", periode: "status “ongoing”", zones: "Six provinces, not identified", accroche: "Ask the Ministry of Culture whether the Sara-Bedjond country is included, and offer the inventory sheets of the Bedjond Digital Heritage programme." },
  hiswaca: { bailleur: "World Bank (IDA) — INSEED", nom: "Statistics and census (HISWACA)", montant: "USD 105M", periode: "2023 → 2029", zones: "National", accroche: "Ask INSEED for census data by commune and canton to support every advocacy brief." },
  debacos: { bailleur: "AFD — Ministry of Agricultural Production", nom: "DEBACOS — southern cotton basin", montant: "€14M", periode: "2024 → June 2029", zones: "Cotton basin (7 southern provinces); Mayo-Kebbi Ouest and Moyen-Chari named, Mandoul not", accroche: "Ask for the list of selected areas and advocate for Mandoul Occidental, a cotton-growing area." },
  pmcr: { bailleur: "World Bank (IDA)", nom: "PMCR — rural mobility and connectivity", montant: "USD 45M", periode: "closed on 30 April 2026", zones: "211 km of rural roads in Mandoul and Moyen-Chari, bridge over the Mandoul at Bédaya; no successor identified", accroche: "Our roads advocacy named it as addressee: write instead to the Ministry of Infrastructure, the Road Maintenance Fund and the Bank about its successor." },
  paser: { bailleur: "World Bank (IDA)", nom: "PASER — water and resilience", montant: "USD 155.5M", periode: "approved on 18 June 2026", zones: "Eastern Chad, N’Djamena and 13 small towns in the east — not Mandoul", accroche: "Do not present it as an addressee of our water advocacy; favour the AfDB, UNICEF and Swiss cooperation." },
  pilier: { bailleur: "World Bank (IDA) — N’Djamena city hall; community component implemented by UNDP", nom: "PILIER — flood control and urban resilience in N’Djamena", montant: "USD 150M (IDA grant, 2023) + USD 20M for the community component (May 2024)", periode: "approved on 6 April 2023; six years of implementation according to the press", zones: "N’Djamena only (ten district municipalities): drainage, 200 km of gutters cleared in 2026, neighbourhood committees and early warning — not Mandoul", accroche: "Outside our area: do not write to it about Bédjondo. Its community component (neighbourhood committees, flood early warning, implemented by UNDP) can serve as a model for a request for Bédjondo, addressed to Mandoul civil protection under the Contingent Emergency Response (CERP)." },
  usaid: { bailleur: "United States", nom: "USAID — closed on 1 July 2025", montant: "USD 6.3M reported for fiscal year 2025", periode: "—", zones: "No active US programme identified in Mandoul", accroche: "Do not target." },
};

export const GUICHETS_EN: { nom: string; qui: string; montant: string; echeance: string; note: string }[] = [
  { nom: "Swiss cooperation small projects", qui: "Chadian organisations (co-funding of at least 20%)", montant: "up to CHF 200,000, 18 months", echeance: "rolling, two months before start", note: "Training, entrepreneurship, women and youth, social cohesion, climate; submission by e-mail to the N’Djamena office. The window most directly open to the association, once its papers are in order." },
  { nom: "PRA/OSIM 2026 (FORIM, funded by AFD)", qui: "Diaspora associations registered in France (1901 law, at least one year old)", montant: "up to €15,000, at most 70% of the project", echeance: "28 October 2026, 12:00 (Paris)", note: "Support from a partner organisation (“opérateur d’accompagnement”) is compulsory; contact FORIM as soon as possible. Possible only if a sister association exists in France." },
  { nom: "MBAIDENE sub-grants (European Union)", qui: "Local organisations in Mandoul, Logone Occidental and Lac", montant: "up to €60,000", echeance: "set by the grant-holding NGO (project launched August 2026)", note: "Women, peace and security; identify the grant holder through the EU delegation." },
  { nom: "AFD CSO initiatives", qui: "French NGOs, or local ones that have already received over €100,000 from AFD", montant: "variable", echeance: "2026 call closed on 9 October; aim for 2027 with a French NGO", note: "Out of reach this year." },
];

export const FENETRES_EN: { quand: string; quoi: string; ou: string; lien: string }[] = [
  { quand: "before 28 October 2026", quoi: "PRA/OSIM call for diaspora associations in France", ou: "FORIM", lien: "guichets" },
  { quand: "by December 2026", quoi: "Bédjondo health centres in results-based financing (PRPSS, closing end 2026)", ou: "Mandoul health delegation", lien: "prpss" },
  { quand: "2026", quoi: "PAEPA II borehole lists (contracts delayed, lists still open)", ou: "PAEPA coordination, Ministry of Water", lien: "paepa-2" },
  { quand: "2026", quoi: "SmartEd school selection", ou: "Provincial education delegation", lien: "smarted" },
  { quand: "2026", quoi: "PATN list of 500 unserved areas and PAAET batch of 700,000 solar kits", ou: "Ministry of Digital Economy; SNE", lien: "patn" },
  { quand: "2026–2027", quoi: "Consultations on the UN framework 2027–2030 and the IFAD programme", ou: "Resident Coordinator’s Office; IFAD", lien: "unsdcf" },
  { quand: "before March 2027", quoi: "Design of SAHIT-NA, successor to PRPSS", ou: "Ministry of Health; World Bank", lien: "sahit-na" },
  { quand: "2026–2027", quoi: "ACPESI-4.0 feasibility studies (30 training centres)", ou: "Ministry of Vocational Training; AfDB", lien: "acpesi" },
];

/* Source labels: the publisher's name and document type, in English. */
const SOURCES_EN: [RegExp, string][] = [
  [/évaluation de programme pays/g, "country programme evaluation"], [/document d’évaluation/g, "appraisal document"], [/document de projet/g, "project document"],
  [/fiche de projet|fiche projet/g, "project page"], [/fiche (PAEPA SU MR II)/g, "$1 page"], [/Caritas Suisse/g, "Caritas Switzerland"], [/plan de passation/g, "procurement plan"], [/restructuration/g, "restructuring"], [/communiqué du 6 avril 2023/g, "press release of 6 April 2023"],
  [/programme de pays/g, "country programme"], [/stratégie pays/g, "country strategy"], [/données pays/g, "country data"], [/patrimoine immatériel/g, "intangible heritage"],
  [/forums de Bédjondo/g, "Bédjondo forums"], [/Registre IATI/g, "IATI register"], [/appel/g, "call"], [/Ministère de la Formation professionnelle/g, "Ministry of Vocational Training"],
  [/Quotidien du Peuple/g, "People’s Daily"], [/Banque islamique de développement/g, "Islamic Development Bank"], [/Banque mondiale/g, "World Bank"], [/Fonds mondial/g, "Global Fund"],
  [/\bBAD\b/g, "AfDB"], [/\bUE\b/g, "EU"], [/\bDDC\b/g, "SDC"], [/\bPNUD\b/g, "UNDP"], [/\bFIDA\b/g, "IFAD"],
  [/ janvier /g, " January "], [/ avril /g, " April "], [/ mai /g, " May "], [/ juin /g, " June "], [/ juillet /g, " July "],
];
export const sourceEn = (label: string) => SOURCES_EN.reduce((s, [re, en]) => s.replace(re, en), label);
