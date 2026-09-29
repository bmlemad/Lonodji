/* Programmes des partenaires techniques et financiers au Tchad, rapprochés des thématiques
   et des plaidoyers d'ADEB LONODJI. Relevé du 29 septembre 2026 : chaque ligne vient d'une
   source officielle ouverte (portail projets, document d'évaluation, registre IATI, fiche
   d'agence) ou, à défaut, de la presse tchadienne, citée comme telle. Ce qui n'a pas été
   trouvé est dit ; rien n'est présenté comme acquis pour Bédjondo. */

export type Famille = "banque-mondiale" | "europe" | "nations-unies" | "bad-fonds" | "autres";
export type Statut = "actif" | "preparation" | "fin-proche" | "clos" | "incertain";
/* où le programme touche notre zone, du plus proche au plus lointain */
export type Portee = "bedjondo" | "koumra" | "mandoul" | "sud" | "national" | "hors-zone";

export type ProgrammeBailleur = {
  id: string;
  famille: Famille;
  bailleur: string;
  nom: string;
  ref?: string;
  montant: string;
  periode: string;
  statut: Statut;
  portee: Portee;
  zones: string;
  thematiques: string[];
  plaidoyers?: string[];
  accroche: string;
  source: string;
  sourceLabel: string;
};

export const RELEVE = "29 septembre 2026";

export const FAMILLES: Record<Famille, string> = {
  "banque-mondiale": "Banque mondiale",
  europe: "Union européenne et coopérations européennes",
  "nations-unies": "Système des Nations unies",
  "bad-fonds": "Banque africaine de développement et fonds mondiaux",
  autres: "Autres partenaires",
};

export const STATUTS: Record<Statut, string> = {
  actif: "En cours",
  preparation: "En préparation",
  "fin-proche": "Fin proche",
  clos: "Clos",
  incertain: "À vérifier",
};

export const PORTEES: Record<Portee, string> = {
  bedjondo: "Actif à Bédjondo",
  koumra: "Koumra cité",
  mandoul: "Mandoul cité",
  sud: "Sud du Tchad",
  national: "National",
  "hors-zone": "Hors de notre zone",
};

export const PLAIDOYERS_NOMS: Record<string, { titre: string; href: string }> = {
  "plaidoyer-eau": { titre: "De l’eau potable pour chaque quartier", href: "/journal/2026-09-17-plaidoyer-eau-potable-bedjondo" },
  "plaidoyer-electricite": { titre: "De la lumière pour Bédjondo", href: "/journal/2026-09-16-plaidoyer-electricite-bedjondo" },
  "plaidoyer-sante": { titre: "Soigner à Bédjondo", href: "/journal/2026-09-17-plaidoyer-sante-bedjondo" },
  "plaidoyer-routes": { titre: "Une voirie, des pistes", href: "/journal/2026-09-17-plaidoyer-routes-ponts-bedjondo" },
  "plaidoyer-education": { titre: "Une école à la hauteur", href: "/journal/2026-09-17-plaidoyer-education-bedjondo" },
  "plaidoyer-formation-pro": { titre: "Le centre de formation professionnelle", href: "/journal/2026-09-17-plaidoyer-formation-professionnelle-bedjondo" },
  "plaidoyer-internet": { titre: "Le haut débit", href: "/journal/2026-09-16-plaidoyer-internet-haut-debit-bedjondo" },
  "plaidoyer-commune": { titre: "Note à la commune", href: "/journal/2026-09-16-note-commune-bedjondo" },
};

const WB = (n: string) => `http://documents.worldbank.org/curated/en/${n}`;

export const PROGRAMMES_BAILLEURS: ProgrammeBailleur[] = [
  // ——— au plus près de Bédjondo ———
  {
    id: "deesse", famille: "europe", bailleur: "AFD — CARE France, BASE, Groupe URD", nom: "DEESSE — droits et santé sexuelle des femmes (volet PASFASS2)", ref: "AFD CTD1280",
    montant: "11 M€ (volet CARE 5,25 M€)", periode: "2024 → février 2028", statut: "actif", portee: "bedjondo",
    zones: "Mandoul et Logone Oriental ; forums communautaires tenus à Bédjondo le 27 septembre 2026 par BASE Mandoul",
    thematiques: ["sante-prevention", "leadership-feminin", "justice-droits-homme", "entrepreneuriat-finance-inclusive"], plaidoyers: ["plaidoyer-sante"],
    accroche: "Le partenaire le plus présent à Bédjondo : proposer à BASE Mandoul un relais communautaire (groupes de femmes, messages en bedjond) et lui remonter les besoins des centres de santé.",
    source: "https://www.alwihdainfo.com/tchad-a-bedjondo-des-fora-communautaires-pour-intensifier-la-lutte-contre-les-vbg-et-promouvoir-la-sante-reproductive/", sourceLabel: "Alwihda Info, forums de Bédjondo",
  },
  {
    id: "paaet", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA) — ministère de l’Énergie, SNE", nom: "PAAET — accroissement de l’accès à l’énergie", ref: "P174495",
    montant: "295 M USD", periode: "2022 → juin 2027", statut: "actif", portee: "koumra",
    zones: "Centrale solaire avec stockage à Koumra (plan de passation, septembre 2026) ; une vague de 700 000 kits solaires « pour les autres zones » en cours de passation",
    thematiques: ["desenclavement-urbanisation", "environnement-ressources"], plaidoyers: ["plaidoyer-electricite"],
    accroche: "Demander par écrit à l’unité du projet et à la SNE l’inscription de Bédjondo dans la prochaine vague de kits et dans l’extension du réseau depuis Koumra, recensement des ménages et services à l’appui.",
    source: WB("099092226035550210"), sourceLabel: "Banque mondiale, plan de passation PAAET",
  },
  {
    id: "prpss", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA, GFF) — ministère de la Santé", nom: "PRPSS — performance du système de santé (financement basé sur les résultats)", ref: "P172504",
    montant: "240 M USD", periode: "2021 → décembre 2026", statut: "fin-proche", portee: "mandoul",
    zones: "Huit provinces dont le Mandoul ; l’hôpital de Koumra parmi les hôpitaux provinciaux à mettre aux normes",
    thematiques: ["sante-prevention"], plaidoyers: ["plaidoyer-sante"],
    accroche: "Avant décembre 2026, demander à la délégation sanitaire du Mandoul que les centres de santé de Bédjondo soient dans le financement basé sur les résultats.",
    source: WB("644541628560941255"), sourceLabel: "Banque mondiale, document d’évaluation PRPSS",
  },
  {
    id: "sahit-na", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA) — ministère de la Santé publique", nom: "SAHIT-NA — résilience du système de santé (successeur du PRPSS)", ref: "P518325",
    montant: "80 M USD indicatifs", periode: "approbation prévue en mars 2027", statut: "preparation", portee: "national",
    zones: "Étendre le financement basé sur les résultats « aux provinces restantes » ; zones non précisées",
    thematiques: ["sante-prevention"], plaidoyers: ["plaidoyer-sante"],
    accroche: "Fenêtre ouverte pendant la conception : envoyer au ministère et au bureau de la Banque une note sur la carte sanitaire de Bédjondo.",
    source: WB("099071726113528393"), sourceLabel: "Banque mondiale, fiche de projet SAHIT-NA",
  },
  {
    id: "bid-unicef-sante", famille: "bad-fonds", bailleur: "Banque islamique de développement, Lives and Livelihoods Fund, État, UNICEF", nom: "Santé maternelle et infantile — 104 formations sanitaires",
    montant: "48,4 M USD", periode: "2023 → vers 2028", statut: "actif", portee: "mandoul",
    zones: "Ennedi Est, Mandoul, Salamat ; 20 formations sanitaires construites et 84 réhabilitées, districts du Mandoul non précisés",
    thematiques: ["sante-prevention", "leadership-feminin", "eau-energie-connectivite"], plaidoyers: ["plaidoyer-sante"],
    accroche: "Demander à la délégation sanitaire du Mandoul et à l’UNICEF la liste des formations sanitaires retenues, et plaider pour le centre de santé de Bédjondo (réhabilitation, soins obstétricaux, eau solaire).",
    source: "https://www.isdb.org/news/us-484-million-maternal-and-child-health-project-funded-by-islamic-development-bank-lives-and-livelihoods-fund-government-of-chad-and-unicef-launched", sourceLabel: "Banque islamique de développement",
  },
  {
    id: "paepa-2", famille: "bad-fonds", bailleur: "BAD (Facilité d’appui à la transition) — ministère de l’Hydraulique", nom: "PAEPA SU MR phase II — eau potable et assainissement semi-urbain et rural", ref: "P-TD-E00-006",
    montant: "28 M UC", periode: "2023 → décembre 2028", statut: "actif", portee: "mandoul",
    zones: "54 mini-réseaux d’eau dont le Mandoul, 225 forages à pompe manuelle, 500 latrines ; localités du Mandoul citées : cantons Nadilli (Moïssala), Mouroum Goulaye, Béssada, Béboro — pas Bédjondo. 4,9 % décaissé en avril 2026",
    thematiques: ["eau-energie-connectivite", "sante-prevention"], plaidoyers: ["plaidoyer-eau"],
    accroche: "Destinataire direct du plaidoyer eau : les listes de forages ne sont pas closes ; demander à la coordination du programme l’inscription de Bédjondo et de ses villages, fiche des besoins localité par localité à l’appui.",
    source: "https://www.afdb.org/sites/default/files/documents/projects-and-operations/p-td-e00-006.doc.pdf", sourceLabel: "BAD, fiche PAEPA SU MR II",
  },
  {
    id: "chine-eau", famille: "autres", bailleur: "Chine (don) — ministère de l’Eau et de l’Énergie", nom: "Aide à l’approvisionnement en eau potable au Tchad",
    montant: "non publié", periode: "depuis octobre 2024", statut: "actif", portee: "koumra",
    zones: "Mandoul et Salamat : plus de 500 forages, 57 stations ; Koumra (quartier Madan), Kouman, Ngonbé cités — pas Bédjondo",
    thematiques: ["eau-energie-connectivite"], plaidoyers: ["plaidoyer-eau"],
    accroche: "Demander à la délégation provinciale de l’Eau la liste des sites réalisés dans le Mandoul Occidental ; si Bédjondo en est absent, demander son inscription dans une extension, en copie à l’ambassade de Chine.",
    source: "http://french.peopledaily.com.cn/Afrique/n3/2026/0702/c96852-20473397.html", sourceLabel: "Xinhua / Quotidien du Peuple, 2 juillet 2026",
  },
  {
    id: "swedd", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA)", nom: "SWEDD+ — autonomisation des femmes et dividende démographique", ref: "P176693",
    montant: "82,5 M USD (Tchad)", periode: "2023 → 2028-2030", statut: "actif", portee: "mandoul",
    zones: "Étendu au Mandoul (17 provinces sur 23)",
    thematiques: ["leadership-feminin", "jeunesse-reussite", "sante-prevention", "solidarite-inclusion"], plaidoyers: ["plaidoyer-education", "plaidoyer-sante"],
    accroche: "Proposer les groupements féminins et « espaces sûrs » de Bédjondo à l’unité nationale, et se porter candidat comme relais communautaire.",
    source: WB("099091223044513462"), sourceLabel: "Banque mondiale, document d’évaluation SWEDD+",
  },
  {
    id: "mbaidene", famille: "europe", bailleur: "Union européenne (appel « Femmes, paix et sécurité 1325 »)", nom: "MBAIDENE — résilience, droits et opportunités des femmes", ref: "2026-PC-55732",
    montant: "2,6 M€ (sous-subventions possibles jusqu’à 60 000 €)", periode: "août 2026 → août 2031", statut: "actif", portee: "mandoul",
    zones: "Mandoul, Logone Occidental, Lac",
    thematiques: ["leadership-feminin", "justice-droits-homme", "paix-cohesion"],
    accroche: "Identifier l’ONG attributaire auprès de la délégation de l’UE et se positionner comme organisation locale bénéficiaire des sous-subventions au Mandoul.",
    source: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/184496PROSPECTSEN", sourceLabel: "UE, appel EuropeAid/184496",
  },
  {
    id: "unfpa", famille: "nations-unies", bailleur: "UNFPA", nom: "8e programme de pays — santé maternelle, planification familiale, VBG, jeunes",
    montant: "60 M USD", periode: "2024 → 2028", statut: "actif", portee: "mandoul",
    zones: "12 provinces dont le Mandoul, le Logone Oriental et le Moyen-Chari",
    thematiques: ["sante-prevention", "leadership-feminin", "jeunesse-reussite"], plaidoyers: ["plaidoyer-sante"],
    accroche: "Demander l’inscription du centre de santé de Bédjondo au réseau des soins obstétricaux et néonatals d’urgence, et proposer l’association comme relais jeunes et santé.",
    source: "https://www.unfpa.org/sites/default/files/portal-document/ENG%20-%20DP.FPA_.CPD_.TCD_.8%20-%20Chad%20CPD%20-%203Jul23.pdf", sourceLabel: "UNFPA, programme de pays",
  },
  {
    id: "hnrp", famille: "nations-unies", bailleur: "OCHA et équipe humanitaire pays", nom: "Plan de réponse humanitaire 2026",
    montant: "986 M USD requis, financé à 35 % au 30 juin", periode: "2026", statut: "actif", portee: "mandoul",
    zones: "Mandoul Occidental parmi les 29 départements prioritaires du cluster eau-hygiène-assainissement ; inondations possibles au Mandoul",
    thematiques: ["eau-energie-connectivite", "sante-prevention", "urgences-risques", "paix-cohesion"], plaidoyers: ["plaidoyer-eau", "plaidoyer-sante"],
    accroche: "Argument central du plaidoyer eau : transmettre au cluster EHA une fiche de besoins par quartier de Bédjondo, et signaler inondations et tensions dans les outils d’alerte.",
    source: "https://reliefweb.int/report/chad/tchad-besoins-et-plan-de-reponse-humanitaires-2026-hnrp", sourceLabel: "OCHA / ReliefWeb, HNRP 2026",
  },
  {
    id: "renfort", famille: "nations-unies", bailleur: "FIDA (+ Fonds vert pour le climat)", nom: "RENFORT — entrepreneuriat agropastoral des jeunes et des femmes", ref: "2000003305",
    montant: "plus de 100 M USD selon la presse (non vérifié)", periode: "2023 → mars 2029", statut: "incertain", portee: "mandoul",
    zones: "Six provinces dont le Mandoul (départements non précisés) ; décaissements suspendus fin 2024-début 2025 après un audit",
    thematiques: ["agriculture-elevage-securite-alimentaire", "entrepreneuriat-finance-inclusive", "leadership-feminin", "jeunesse-reussite"], plaidoyers: ["plaidoyer-formation-pro"],
    accroche: "Demander à l’unité de gestion si des départements du Mandoul sont couverts et présenter des groupements de jeunes et de femmes de Bédjondo.",
    source: "https://webapps.ifad.org/members/ec/133/docs/french/EC-2026-133-W-P-2.pdf", sourceLabel: "FIDA, évaluation de programme pays 2026",
  },
  {
    id: "sodefika", famille: "europe", bailleur: "Coopération suisse (DDC) — Caritas Suisse", nom: "SODEFIKA — filières arachide, sésame et karité", ref: "DDC 7F08749",
    montant: "8,2 M CHF", periode: "2023 → novembre 2027", statut: "actif", portee: "mandoul",
    zones: "Logone Oriental, Mandoul, Moyen-Chari ; 120 000 personnes, dont au moins 60 % de femmes",
    thematiques: ["agriculture-elevage-securite-alimentaire", "entrepreneuriat-finance-inclusive", "leadership-feminin"],
    accroche: "Signaler les groupements de productrices de sésame et de karité de Bédjondo pour qu’ils accèdent aux semences, au stockage et au crédit du projet.",
    source: "https://www.caritas.ch/en/supporting-the-development-of-the-peanut-sesame-and-shea-value-chains/", sourceLabel: "Caritas Suisse",
  },
  {
    id: "pfnl", famille: "europe", bailleur: "Coopération suisse (DDC)", nom: "Valorisation des produits forestiers non ligneux (néré, karité, miel)", ref: "DDC 7F10500",
    montant: "12,4 M CHF", periode: "2021 → février 2027", statut: "fin-proche", portee: "mandoul",
    zones: "Logone Oriental, Mandoul, Moyen-Chari",
    thematiques: ["environnement-ressources", "entrepreneuriat-finance-inclusive", "leadership-feminin"],
    accroche: "Signaler les transformatrices de karité et de néré, et demander si une phase 2 est prévue après 2027.",
    source: "https://www.eda.admin.ch/deza/fr/home/projets-vue-ensemble/projekte.filterResults.html/content/dezaprojects/SDC/en/2020/7F10500/phase1", sourceLabel: "DDC, fiche projet",
  },
  {
    id: "nexsud", famille: "europe", bailleur: "AFD et Union européenne — Caritas Suisse (chef de file)", nom: "NexSud — résilience socio-économique au sud du Tchad", ref: "AFD CTD1277",
    montant: "13 M€ AFD + 7 M€ UE (chiffres à rapprocher)", periode: "2024 → 2029", statut: "actif", portee: "mandoul",
    zones: "Logone Oriental, Mandoul, Moyen-Chari ; localités non précisées",
    thematiques: ["agriculture-elevage-securite-alimentaire", "paix-cohesion", "urgences-risques", "solidarite-inclusion"], plaidoyers: ["plaidoyer-eau"],
    accroche: "Demander à Caritas Suisse Tchad si des cantons du Mandoul Occidental sont couverts et, sinon, l’inscription de Bédjondo à la revue à mi-parcours.",
    source: "https://www.afd.fr/fr/projets/resilience-socio-economique-des-populations-tchad", sourceLabel: "AFD, fiche projet",
  },
  {
    id: "alapaj", famille: "europe", bailleur: "Union européenne et AFD — Enfants du Monde", nom: "AQUEDUCT-ALAPAJ « Bâtisseuses d’avenir » — éducation non formelle et alphabétisation", ref: "UE 2023-PC-30871 · AFD CTD1248",
    montant: "37,8 M€", periode: "2022 → 2026-2027", statut: "fin-proche", portee: "koumra",
    zones: "Mandoul (42 centres d’alphabétisation, 30 centres d’éducation non formelle ; comités appuyés à Koumra en avril 2026), Logone Oriental, Ouaddaï, Wadi Fira",
    thematiques: ["jeunesse-reussite", "leadership-feminin", "culture-patrimoine-vivant"], plaidoyers: ["plaidoyer-education"],
    accroche: "Demander à Enfants du Monde si Bédjondo a des centres, et proposer l’appui de la diaspora pour leur pérennisation après le projet.",
    source: "https://tchadinfos.com/2026/04/27/mandoul-dix-comites-de-gestion-des-centres-deducation-non-formelle-recoivent-un-appui-financier/", sourceLabel: "Tchadinfos, 27 avril 2026",
  },
  {
    id: "corridor-competences", famille: "europe", bailleur: "AFD — Enfants du Monde, ESSOR (et programme UE FORMAPRO, 30 M€)", nom: "Compétences professionnelles sur le corridor N’Djamena-Douala",
    montant: "non trouvé (FORMAPRO : 30 M€)", periode: "lancé à Koumra le 10 juin 2026, 4 ans", statut: "actif", portee: "koumra",
    zones: "Province du Mandoul (lancement à Koumra) ; lien exact avec FORMAPRO à confirmer",
    thematiques: ["jeunesse-reussite", "competences-entrepreneuriat-numerique", "entrepreneuriat-finance-inclusive"], plaidoyers: ["plaidoyer-formation-pro"],
    accroche: "Destinataire direct du plaidoyer formation : demander que le centre de formation professionnelle de Bédjondo soit retenu comme centre partenaire.",
    source: "https://www.alwihdainfo.com/mandoul-un-projet-pour-booster-les-competences-sur-le-corridor-ndjamena-douala/", sourceLabel: "Alwihda Info",
  },
  {
    id: "lapia", famille: "europe", bailleur: "Union européenne (programme OSC) — Coginta", nom: "LAPIA — cohésion sociale et cohabitation pacifique dans le sud", ref: "NDICI CSO/2024/456-913",
    montant: "2 M€", periode: "novembre 2024 → octobre 2027", statut: "actif", portee: "koumra",
    zones: "Logone Oriental, Mandoul (Mandoul Oriental, Koumra), Moyen-Chari ; 18 comités de dialogue",
    thematiques: ["paix-cohesion", "gouvernance-plaidoyer", "culture-patrimoine-vivant"],
    accroche: "Proposer l’extension d’un comité de dialogue aux cantons bedjond et des messages radio en bedjond.",
    source: "https://coginta.org/en/projets/soutien-a-la-cohesion-sociale-et-la-cohabitation-pacifique-dans-le-sud-du-tchad-lapia/", sourceLabel: "Coginta",
  },
  {
    id: "pbf-hi", famille: "nations-unies", bailleur: "Fonds pour la consolidation de la paix — Humanité & Inclusion", nom: "Groupements de femmes et conflits agropastoraux au Logone Oriental et au Mandoul", ref: "IRF-566",
    montant: "1,8 M USD", periode: "septembre 2024 → 25 septembre 2026", statut: "clos", portee: "koumra",
    zones: "Logone Oriental ; Mandoul Oriental (Koumra) — pas le Mandoul Occidental",
    thematiques: ["paix-cohesion", "leadership-feminin", "agriculture-elevage-securite-alimentaire"],
    accroche: "Le projet vient de se terminer : demander à HI, à l’UFEP et au secrétariat du Fonds qu’une phase 2 s’étende au Mandoul Occidental.",
    source: "https://mptf.undp.org/sites/default/files/documents/2024-09/05_prodoc_240924_irf-566_gw.pdf", sourceLabel: "MPTF, document de projet",
  },
  {
    id: "pea", famille: "europe", bailleur: "Union européenne (Global Gateway) — AFD, GIZ", nom: "Programme d’entrepreneuriat agroalimentaire (PEA, dont PAMELOT)", ref: "ACT-61843",
    montant: "45,2 M€", periode: "2025 → 2029", statut: "actif", portee: "mandoul",
    zones: "Corridor N’Djamena-Douala, dont le Mandoul (fiche d’assistance technique)",
    thematiques: ["agriculture-elevage-securite-alimentaire", "entrepreneuriat-finance-inclusive", "jeunesse-reussite"], plaidoyers: ["plaidoyer-formation-pro"],
    accroche: "Présenter les porteurs d’initiatives agroalimentaires de Bédjondo aux opérateurs du volet AFD (ESSOR, Bet Al Nadjah).",
    source: "https://mesrsfp.gouv.td/2026/05/19/formation-professionnelle-le-pamelot-la-giz-et-le-mesrsfp-renforcent-les-capacites-des-formateurs/", sourceLabel: "Ministère de la Formation professionnelle",
  },
  {
    id: "ue-electrification-sud", famille: "europe", bailleur: "Union européenne — GIZ", nom: "Accès aux services énergétiques modernes dans le sud du Tchad", ref: "2026-PC-53519",
    montant: "20,5 M€ (et 27,3 M€ pour l’axe N’Djamena-Moundou-Sarh)", periode: "2026 → 2029", statut: "actif", portee: "sud",
    zones: "Deux villes secondaires du corridor électrifiées en renouvelable ; lesquelles : non publié",
    thematiques: ["desenclavement-urbanisation"], plaidoyers: ["plaidoyer-electricite"],
    accroche: "Ajouter la GIZ et la délégation de l’UE aux destinataires du plaidoyer électricité et demander les critères de choix des villes.",
    source: "https://d-portal.org/ctrack.html#view=act&aid=XI-IATI-EC_INTPA-2026-PC-53519", sourceLabel: "Registre IATI",
  },
  {
    id: "ddc-collectivites", famille: "europe", bailleur: "Coopération suisse — PNUD (RGDL), Initiative Développement (AGIL)", nom: "Appui aux collectivités autonomes", ref: "DDC 7F11681",
    montant: "4,5 M CHF (22 M CHF avec les partenaires)", periode: "septembre 2026 → septembre 2029", statut: "actif", portee: "national",
    zones: "23 conseils provinciaux ; 4 communes pilotes non nommées ; 29 initiatives citoyennes à financer",
    thematiques: ["gouvernance-plaidoyer"], plaidoyers: ["plaidoyer-commune"],
    accroche: "Proposer avec la mairie une « initiative citoyenne » de Bédjondo, et vérifier si la commune peut être pilote.",
    source: "https://www.eda.admin.ch/deza/fr/home/projets-vue-ensemble/projekte.filterResults.html/content/dezaprojects/SDC/en/2026/7F11681/phase1", sourceLabel: "DDC, fiche projet",
  },
  {
    id: "patn", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA) — ministère des Communications et de l’Économie numérique", nom: "PATN — transformation numérique du Tchad", ref: "P180000",
    montant: "92,2 M USD", periode: "2024 → avril 2029", statut: "actif", portee: "sud",
    zones: "3G/4G dans 500 localités non couvertes, centres numériques communautaires ; liste des zones blanches non publiée ; présentation aux autorités du Moyen-Chari en mars 2026",
    thematiques: ["transformation-numerique-services", "competences-entrepreneuriat-numerique"], plaidoyers: ["plaidoyer-internet"],
    accroche: "Demander par écrit l’inscription de Bédjondo et de ses cantons sur la liste des 500 zones blanches et un centre numérique communautaire.",
    source: WB("099090624105035738"), sourceLabel: "Banque mondiale, document d’évaluation PATN",
  },
  {
    id: "smarted", famille: "bad-fonds", bailleur: "BID, BADEA, OPEP Fund, Fonds saoudien, Partenariat mondial pour l’éducation", nom: "SmartEd — éducation de base inclusive",
    montant: "environ 160 M USD", periode: "2026 → 2030", statut: "actif", portee: "national",
    zones: "Les 23 provinces ; 2 400 à 2 848 salles de classe, 35 000 enseignants formés ; sélection des écoles en cours",
    thematiques: ["jeunesse-reussite", "leadership-feminin", "solidarite-inclusion"], plaidoyers: ["plaidoyer-education"],
    accroche: "Transmettre dès maintenant à la délégation provinciale un dossier « écoles de Bédjondo » (effectifs, classes sous paillote, latrines) pour la liste des sites.",
    source: "https://tchadinfos.com/2026/06/16/financement-de-leducation-le-tchad-et-la-badea-signent-un-accord-de-30-millions-de-dollars/", sourceLabel: "Tchadinfos, 16 juin 2026",
  },
  {
    id: "education-bm", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA) — ministère de l’Éducation nationale", nom: "Amélioration des résultats d’apprentissage", ref: "P175803",
    montant: "144,1 M USD", periode: "2022 → octobre 2027", statut: "actif", portee: "national",
    zones: "1 500 salles de classe avec latrines et point d’eau ; maîtres communautaires ; national",
    thematiques: ["jeunesse-reussite"], plaidoyers: ["plaidoyer-education"],
    accroche: "Demander que des écoles de Bédjondo figurent sur les listes de construction et que les maîtres communautaires soient recensés.",
    source: WB("486611650320066020"), sourceLabel: "Banque mondiale, document d’évaluation",
  },
  {
    id: "competences-bm", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA)", nom: "Apprentissages fondamentaux et compétences pour l’emploi", ref: "P518731",
    montant: "60 M USD", periode: "approbation prévue en mai 2027", statut: "preparation", portee: "national",
    zones: "Non précisées",
    thematiques: ["jeunesse-reussite", "competences-entrepreneuriat-numerique"], plaidoyers: ["plaidoyer-formation-pro", "plaidoyer-education"],
    accroche: "Pendant la préparation, proposer le centre de formation professionnelle de Bédjondo comme site pilote.",
    source: WB("099082826175531444"), sourceLabel: "Banque mondiale, fiche de projet",
  },
  {
    id: "acpesi", famille: "bad-fonds", bailleur: "BAD", nom: "ACPESI-4.0 — compétences et emploi (au moins 30 centres de formation)",
    montant: "non trouvé", periode: "études de faisabilité en 2026", statut: "preparation", portee: "national",
    zones: "Sites non choisis",
    thematiques: ["jeunesse-reussite", "competences-entrepreneuriat-numerique"], plaidoyers: ["plaidoyer-formation-pro"],
    accroche: "Le point d’entrée le plus stratégique du plaidoyer formation : saisir maintenant le ministère et le bureau de la BAD pour que le centre de Bédjondo figure parmi les centres étudiés.",
    source: "https://www.afdb.org/sites/default/files/documents/projects-and-operations/chad_country_strategy_paper_2026-2031_revised_version_1.pdf", sourceLabel: "BAD, stratégie pays 2026-2031",
  },
  {
    id: "unicef", famille: "nations-unies", bailleur: "UNICEF", nom: "Programme de pays 2027-2030 (eau, santé, éducation, protection, état civil)",
    montant: "288,8 M USD prévus", periode: "2027 → 2030 (soumis en septembre 2026)", statut: "preparation", portee: "national",
    zones: "Provinces non nommées ; plans communaux « sensibles à l’enfant », état civil décentralisé, solarisation des services",
    thematiques: ["eau-energie-connectivite", "sante-prevention", "jeunesse-reussite", "solidarite-inclusion", "transformation-numerique-services"], plaidoyers: ["plaidoyer-eau", "plaidoyer-sante", "plaidoyer-education", "plaidoyer-commune"],
    accroche: "Proposer la commune de Bédjondo comme pilote d’un plan communal « sensible à l’enfant » et d’un centre d’état civil décentralisé.",
    source: "https://www.unicef.org/executiveboard/documents/country-programme-document-chad-srs-2026", sourceLabel: "UNICEF, programme de pays",
  },
  {
    id: "unsdcf", famille: "nations-unies", bailleur: "Bureau du Coordonnateur résident des Nations unies", nom: "Cadre de coopération ONU-Tchad 2027-2030 (UNSDCF)",
    montant: "à définir", periode: "travaux lancés le 22 mai 2026", statut: "preparation", portee: "national",
    zones: "Provinces de convergence à définir",
    thematiques: ["gouvernance-plaidoyer"], plaidoyers: ["plaidoyer-commune", "plaidoyer-eau", "plaidoyer-sante", "plaidoyer-education"],
    accroche: "Demander à participer aux consultations de la société civile et déposer une note « Mandoul Occidental / Bédjondo » qui résume nos plaidoyers et la note à la commune.",
    source: "https://tchadinfos.com/2026/05/22/tchad-onu-le-comite-de-pilotage-clot-le-cycle-2024-2026-et-lance-les-travaux-pour-lunsdcf-2027-2030/", sourceLabel: "Tchadinfos, 22 mai 2026",
  },
  {
    id: "pnud-minireseaux", famille: "nations-unies", bailleur: "PNUD et FEM — ADERME", nom: "Mini-réseaux et électrification rurale (Africa Minigrids, préparation d’un projet FEM)", ref: "PNUD 00135028 · 01006057",
    montant: "600 000 USD (FEM) ; préparation 44 000 USD", periode: "préparation 2026 → 2027", statut: "preparation", portee: "national",
    zones: "Sites non choisis",
    thematiques: ["desenclavement-urbanisation"], plaidoyers: ["plaidoyer-electricite"],
    accroche: "Pendant la préparation, demander au PNUD et à l’ADERME d’inscrire Bédjondo parmi les sites candidats aux mini-réseaux solaires.",
    source: "https://api.open.undp.org/api/projects/01006057.json", sourceLabel: "PNUD, open.undp.org",
  },
  {
    id: "pnud-rgdl", famille: "nations-unies", bailleur: "PNUD", nom: "Gouvernance pour le développement local (RGDL)", ref: "01005819",
    montant: "450 000 USD", periode: "mars 2026 → mars 2029", statut: "actif", portee: "national",
    zones: "National",
    thematiques: ["gouvernance-plaidoyer"], plaidoyers: ["plaidoyer-commune"],
    accroche: "Proposer la commune de Bédjondo comme pilote des outils de planification et de budget participatif.",
    source: "https://api.open.undp.org/api/projects/01005819.json", sourceLabel: "PNUD, open.undp.org",
  },
  {
    id: "fonds-mondial", famille: "bad-fonds", bailleur: "Fonds mondial — ministère de la Santé, PNUD", nom: "Paludisme, VIH, tuberculose (subventions en cours, cycle 8 en préparation)",
    montant: "110,6 M USD (VIH-tuberculose, 2024-2027)", periode: "2024 → 2027", statut: "actif", portee: "national",
    zones: "National ; campagne de moustiquaires 2026 dans 16 provinces",
    thematiques: ["sante-prevention"], plaidoyers: ["plaidoyer-sante"],
    accroche: "Signaler à l’instance de coordination nationale les villages non couverts par les moustiquaires et demander à participer au dialogue pays du cycle 8.",
    source: "https://data.theglobalfund.org/location/TCD/overview", sourceLabel: "Fonds mondial, données pays",
  },
  {
    id: "cerp", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA)", nom: "Réponse d’urgence contingente (CERP)", ref: "P511560",
    montant: "activé en cas de crise", periode: "2026 → 2032", statut: "actif", portee: "mandoul",
    zones: "Le Mandoul parmi les provinces dotées de plans de réponse multirisques",
    thematiques: ["urgences-risques"],
    accroche: "Documenter inondations et épidémies à Bédjondo et les transmettre à la protection civile du Mandoul.",
    source: WB("099041326203533902"), sourceLabel: "Banque mondiale, document de projet",
  },
  {
    id: "unesco-pci", famille: "nations-unies", bailleur: "UNESCO", nom: "Inventaire pilote du patrimoine culturel immatériel de six provinces",
    montant: "99 610 à 250 000 USD (sources divergentes)", periode: "statut « en cours »", statut: "incertain", portee: "national",
    zones: "Six provinces, non trouvées",
    thematiques: ["culture-patrimoine-vivant", "memoire-heritage", "savoirs-innovation"],
    accroche: "Demander au ministère de la Culture si le pays sara-bedjond en fait partie, et proposer les fiches d’inventaire du programme Bedjond Digital Heritage.",
    source: "https://ich.unesco.org/fr/etat/tchad-TD?info=projets", sourceLabel: "UNESCO, patrimoine immatériel",
  },
  {
    id: "hiswaca", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA) — INSEED", nom: "Statistiques et recensement (HISWACA)", ref: "P180085",
    montant: "105 M USD", periode: "2023 → 2029", statut: "actif", portee: "national",
    zones: "National",
    thematiques: ["intelligence-artificielle-donnees", "gouvernance-plaidoyer"],
    accroche: "Demander à l’INSEED les données du recensement par commune et canton pour étayer tous les plaidoyers.",
    source: WB("099081423141036095"), sourceLabel: "Banque mondiale, document d’évaluation",
  },
  {
    id: "debacos", famille: "europe", bailleur: "AFD — ministère de la Production agricole", nom: "DEBACOS — bassin cotonnier du sud", ref: "CTD1262",
    montant: "14 M€", periode: "2024 → juin 2029", statut: "actif", portee: "sud",
    zones: "Bassin cotonnier (7 provinces du sud) ; Mayo-Kebbi Ouest et Moyen-Chari cités, le Mandoul non",
    thematiques: ["agriculture-elevage-securite-alimentaire", "environnement-ressources", "paix-cohesion"],
    accroche: "Demander la liste des zones retenues et plaider l’inclusion du Mandoul Occidental, zone cotonnière.",
    source: "https://tchadinfos.com/2026/05/13/tchad-un-projet-de-14-millions-deuros-pour-relancer-le-bassin-cotonnier/", sourceLabel: "Tchadinfos, 13 mai 2026",
  },
  // ——— à connaître : clos, ou sans le Mandoul ———
  {
    id: "pmcr", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA)", nom: "PMCR — mobilité et connectivité rurales", ref: "P164747",
    montant: "45 M USD", periode: "clos le 30 avril 2026", statut: "clos", portee: "mandoul",
    zones: "211 km de pistes dans le Mandoul et le Moyen-Chari, pont sur le Mandoul à Bédaya ; successeur non identifié",
    thematiques: ["desenclavement-urbanisation"], plaidoyers: ["plaidoyer-routes"],
    accroche: "Notre plaidoyer routes le citait comme destinataire : s’adresser désormais au ministère des Infrastructures, au Fonds d’entretien routier et à la Banque pour le projet qui lui succédera.",
    source: WB("099042926134598032"), sourceLabel: "Banque mondiale, restructuration 2026",
  },
  {
    id: "paser", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA)", nom: "PASER — eau et résilience", ref: "P507957",
    montant: "155,5 M USD", periode: "approuvé le 18 juin 2026", statut: "actif", portee: "hors-zone",
    zones: "Est du Tchad, N’Djamena et 13 petites villes de l’Est — pas le Mandoul",
    thematiques: ["eau-energie-connectivite"],
    accroche: "Ne pas le présenter comme destinataire du plaidoyer eau ; privilégier la BAD, l’UNICEF et la coopération suisse.",
    source: WB("099060126173538264"), sourceLabel: "Banque mondiale, document d’évaluation",
  },
  {
    id: "pilier", famille: "banque-mondiale", bailleur: "Banque mondiale (IDA) — mairie de N’Djamena ; volet communautaire confié au PNUD", nom: "PILIER — lutte contre les inondations et résilience urbaine à N’Djamena",
    montant: "150 M USD (don IDA, 2023) + 20 M USD pour le volet communautaire (mai 2024)", periode: "approuvé le 6 avril 2023 ; six ans de mise en œuvre selon la presse", statut: "actif", portee: "hors-zone",
    zones: "N’Djamena seulement (dix communes d’arrondissement) : drainage, curage de 200 km de caniveaux en 2026, comités de quartier et alerte précoce — pas le Mandoul",
    thematiques: ["urgences-risques"],
    accroche: "Hors de notre zone : ne pas lui écrire pour Bédjondo. Son volet communautaire (comités de quartier, alerte précoce aux inondations, mis en œuvre par le PNUD) peut servir de modèle à une demande pour Bédjondo, adressée à la protection civile du Mandoul au titre de la réponse d’urgence contingente (CERP).",
    source: "https://www.banquemondiale.org/fr/news/press-release/2023/04/06/chad-world-bank-supports-flood-risk-management-and-resilient-urban-planning-in-n-djamena", sourceLabel: "Banque mondiale, communiqué du 6 avril 2023",
  },
  {
    id: "usaid", famille: "autres", bailleur: "États-Unis", nom: "USAID — fermée le 1er juillet 2025",
    montant: "6,3 M USD déclarés pour l’exercice 2025", periode: "—", statut: "clos", portee: "hors-zone",
    zones: "Aucun programme américain actif identifié dans le Mandoul",
    thematiques: [],
    accroche: "Ne pas cibler.",
    source: "https://donortracker.org/policy_updates?policy=us-government-announces-official-closure-of-usaid-2025", sourceLabel: "Donor Tracker",
  },
];

/* Guichets auxquels l'association (ou sa diaspora) peut déposer elle-même */
export const GUICHETS: { nom: string; qui: string; montant: string; echeance: string; note: string; source: string }[] = [
  { nom: "Petits projets de la coopération suisse", qui: "Organisations tchadiennes (cofinancement d’au moins 20 %)", montant: "jusqu’à 200 000 CHF, 18 mois", echeance: "en continu, deux mois avant le démarrage", note: "Formation, entrepreneuriat, femmes et jeunes, cohésion sociale, climat ; dépôt par courriel au bureau de N’Djamena. Le guichet le plus directement accessible à l’association, une fois ses pièces en règle.", source: "https://www.schweiz-tschad.eda.admin.ch/fr/petits-projets" },
  { nom: "PRA/OSIM 2026 (FORIM, financé par l’AFD)", qui: "Associations de la diaspora déclarées en France (loi 1901, un an d’existence)", montant: "jusqu’à 15 000 €, 70 % du projet au plus", echeance: "28 octobre 2026, 12 h (Paris)", note: "Accompagnement obligatoire par un opérateur d’appui ; contacter le FORIM au plus vite. Possible seulement si une association sœur existe en France.", source: "https://forim.net/actualite/lancement-de-lappel-a-projets-pra-osim-2026/" },
  { nom: "Sous-subventions MBAIDENE (Union européenne)", qui: "Organisations locales du Mandoul, du Logone Occidental et du Lac", montant: "jusqu’à 60 000 €", echeance: "selon l’ONG attributaire (projet lancé en août 2026)", note: "Femmes, paix et sécurité ; identifier l’attributaire auprès de la délégation de l’UE.", source: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/184496PROSPECTSEN" },
  { nom: "Initiatives OSC de l’AFD", qui: "ONG françaises, ou locales ayant déjà reçu plus de 100 000 € de l’AFD", montant: "variable", echeance: "appel 2026 clos le 9 octobre ; à viser en 2027 avec une ONG française", note: "Hors de portée cette année.", source: "https://www.afd.fr/en/calls-for-projects/2026-cso-call-expressions-project-intentions" },
];

/* Fenêtres datées : ce qui se décide maintenant */
export const FENETRES: { quand: string; quoi: string; ou: string; lien: string }[] = [
  { quand: "avant le 28 octobre 2026", quoi: "Appel PRA/OSIM pour les associations de la diaspora en France", ou: "FORIM", lien: "guichets" },
  { quand: "d’ici décembre 2026", quoi: "Centres de santé de Bédjondo dans le financement basé sur les résultats (PRPSS, clôture fin 2026)", ou: "Délégation sanitaire du Mandoul", lien: "prpss" },
  { quand: "2026", quoi: "Listes de forages du PAEPA II (marchés en retard, listes encore ouvertes)", ou: "Coordination PAEPA, ministère de l’Hydraulique", lien: "paepa-2" },
  { quand: "2026", quoi: "Sélection des écoles SmartEd", ou: "Délégation provinciale de l’Éducation", lien: "smarted" },
  { quand: "2026", quoi: "Liste des 500 zones blanches du PATN et vague de 700 000 kits solaires du PAAET", ou: "Ministère du Numérique ; SNE", lien: "patn" },
  { quand: "2026-2027", quoi: "Consultations du cadre ONU 2027-2030 et du programme FIDA", ou: "Bureau du Coordonnateur résident ; FIDA", lien: "unsdcf" },
  { quand: "avant mars 2027", quoi: "Conception de SAHIT-NA, successeur du PRPSS", ou: "Ministère de la Santé ; Banque mondiale", lien: "sahit-na" },
  { quand: "2026-2027", quoi: "Études de faisabilité ACPESI-4.0 (30 centres de formation)", ou: "Ministère de la Formation professionnelle ; BAD", lien: "acpesi" },
];

export function programmesDe(thematique: string): ProgrammeBailleur[] {
  return PROGRAMMES_BAILLEURS.filter((p) => p.thematiques.includes(thematique));
}

export function programmesDuPlaidoyer(plaidoyer: string): ProgrammeBailleur[] {
  return PROGRAMMES_BAILLEURS.filter((p) => p.plaidoyers?.includes(plaidoyer));
}

/* ── Rapprochement dans l'autre sens : de nos actions vers les programmes ── */

const ORDRE_PORTEE: Portee[] = ["bedjondo", "koumra", "mandoul", "sud", "national", "hors-zone"];
const utile = (p: ProgrammeBailleur) => p.statut !== "clos" && p.portee !== "hors-zone";
const parProximite = (a: ProgrammeBailleur, b: ProgrammeBailleur) => ORDRE_PORTEE.indexOf(a.portee) - ORDRE_PORTEE.indexOf(b.portee);

/* Programmes en cours ou en préparation qui financent une thématique, du plus proche au plus lointain. */
export function programmesUtilesDe(thematique: string): ProgrammeBailleur[] {
  return PROGRAMMES_BAILLEURS.filter((p) => utile(p) && p.thematiques.includes(thematique)).sort(parProximite);
}

/* Même chose pour un ensemble de thématiques (programme ODEB, projet), sans doublon. */
export function programmesUtilesDes(thematiques: string[]): ProgrammeBailleur[] {
  return PROGRAMMES_BAILLEURS.filter((p) => utile(p) && p.thematiques.some((t) => thematiques.includes(t))).sort(parProximite);
}

export const programmeParId = (id: string) => PROGRAMMES_BAILLEURS.find((p) => p.id === id);

/* Nos projets (content/projets.json) rapprochés à la main des programmes et guichets :
   un programme n'est cité que s'il finance ce que le projet contient. Quand rien ne
   correspond, on le dit. `guichets` : index dans GUICHETS. */
export type AlignementProjet = { programmes: string[]; guichets: number[]; lecture: string };
export const ALIGNEMENT_PROJETS: Record<string, AlignementProjet> = {
  "espace-numerique": {
    programmes: ["patn", "paaet", "pnud-minireseaux", "unicef"],
    guichets: [0, 1],
    lecture: "Le projet le mieux aligné : le PATN prévoit des centres numériques communautaires et une liste de 500 zones blanches à couvrir, le PAAET et les mini-réseaux financent l’énergie solaire. Demander l’inscription de Bédjondo ne finance pas la salle, mais peut lui apporter le réseau et l’électricité. Pour l’équipement lui-même, les guichets ouverts aux associations conviennent, une fois l’association en règle.",
  },
  application: {
    programmes: ["patn"],
    guichets: [],
    lecture: "Aucun programme relevé ne finance une application associative. Le PATN finance les services numériques publics : le lien est indirect (couverture réseau, compétences). L’application reste portée par les bénévoles.",
  },
  "complexe-sportif": {
    programmes: [],
    guichets: [0, 1],
    lecture: "Aucun programme relevé ne finance le sport. Seuls les guichets ouverts aux associations pourraient contribuer à une première tranche (équipement, terrain), une fois le projet chiffré et l’association en règle.",
  },
  "air-bedjondo": {
    programmes: [],
    guichets: [],
    lecture: "Aucun programme en cours ne finance le transport rural dans le Mandoul : le PMCR est clos depuis le 30 avril 2026. Le projet dépend d’investisseurs privés ; le plaidoyer routes s’adresse désormais au ministère des Infrastructures et au Fonds d’entretien routier.",
  },
  "complexe-hotelier": {
    programmes: [],
    guichets: [],
    lecture: "Investissement privé : aucun bailleur public relevé ne finance l’hôtellerie. Le financement viendra de la diaspora et d’investisseurs, dans un montage à définir.",
  },
  "complexe-scolaire-internat": {
    programmes: ["smarted", "education-bm", "acpesi"],
    guichets: [],
    lecture: "Ces programmes financent l’école publique (salles, latrines, enseignants) et la formation professionnelle, pas un établissement privé avec internat. Ils servent le plaidoyer éducation en parallèle : de meilleures écoles publiques à Bédjondo préparent les élèves qui entreront au collège.",
  },
  "chu-bedjondo": {
    programmes: ["deesse", "bid-unicef-sante", "prpss", "unfpa", "sahit-na", "fonds-mondial"],
    guichets: [],
    lecture: "Aucun programme ne finance un hôpital universitaire. Ceux-ci financent les centres de santé et la santé maternelle : ce sont les premières marches du « système de santé » que le projet décrit. La conception de SAHIT-NA, avant mars 2027, est le moment de faire inscrire Bédjondo dans la carte sanitaire.",
  },
};
