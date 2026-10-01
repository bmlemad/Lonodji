# Relecture du 1er octobre 2026, lot B : rubrique Territoire (pages héritées de l'ancien site).
# Remplacements exacts appliqués par scripts/import-legacy.py (corrections_revue), comme corrections_fr.py.
CORRECTIONS = {
    "bedjondo.html": [
        # le RGPH-3 a eu lieu en 2026 (résultats non publiés) : 2009 est le dernier recensement publié
        ("habitants au dernier recensement, berceau",
         "habitants au recensement de 2009, le dernier publié, berceau"),
        # inventaire : content/villages.json donne 215 localités, dont 205 nommées, pour le Mandoul Occidental (OpenStreetMap)
        ("dont 133 figurent déjà dans l&rsquo;inventaire de l&rsquo;association",
         "et l&rsquo;inventaire de l&rsquo;association y compte déjà 215 localités, dont 205 nommées"),
        ("133</span> localités dans notre inventaire",
         "215</span> localités dans notre inventaire"),
        ("GeoNames, rangé dans les limites GADM.</strong>",
         "OpenStreetMap, rangé dans les limites GADM&nbsp;; 205 localités nommées.</strong>"),
        # Bédjo (texte) / Bedjo (liste communautaire) : « tels quels » est faux
        ("six noms dont cinq figurent tels quels dans la",
         "six noms dont cinq figurent, à l&rsquo;accent près, dans la"),
        # même enquête datée 2007 puis 1999-2000 sur la page
        ("documentée par l&rsquo;enquête sociolinguistique de la SIL (2007)",
         "documentée par l&rsquo;enquête sociolinguistique de la SIL (menée en 1999-2000, publiée en 2007)"),
        # 8 dossiers = 7 plaidoyers + 1 note à la commune
        ("huit plaidoyers pour la ville",
         "sept plaidoyers et une note à la commune pour la ville"),
        # alignement sur le plaidoyer eau (château d'eau et réseau : un seul village, arrêts faute de carburant)
        ("Forages isolés, réseau limité à un seul village, écoles et centre de santé sans eau courante.",
         "Château d&rsquo;eau et réseau limités à un seul village et souvent à l&rsquo;arrêt faute de carburant&nbsp;; ailleurs, forages isolés&nbsp;; écoles et centre de santé sans eau courante."),
        # alignement sur le plaidoyer routes du 17/09 : desservie par la nationale, pas de voirie
        ("Axe Koumra–Bédjondo coupé en saison des pluies, pont demandé",
         "Desservie par la route nationale mais sans voirie urbaine&nbsp;; pistes des cantons coupées en saison des pluies, pont demandé"),
    ],
    "besoins.html": [
        # la carte et le texte couvrent 14 unités, pas Bédjondo + 4 cantons
        ("Bédjondo + 4 cantons", "14 unités du pays bedjond"),
        # rien n'a encore été remis à la commune, qui n'a rien demandé (dialogue « à venir »)
        ("Les signalements sont synthétisés, remis à la commune et joints à nos plaidoyers",
         "Les signalements seront synthétisés, remis à la commune et joints à nos plaidoyers"),
        ("Cette synthèse est transmise à la commune de Bédjondo, qui l&rsquo;a demandée pour son plan de développement, et jointe",
         "Cette synthèse sera transmise à la commune de Bédjondo, pour son plan de développement, et jointe"),
        ("signalement publié, avec leur nombre", "signalement publié, avec le nombre de signalements"),
        # alignement sur le plaidoyer eau
        ("Forages isolés, pannes non réparées, réseau limité à un seul village&nbsp;;",
         "Forages isolés, pannes non réparées, château d&rsquo;eau et réseau limités à un seul village et souvent à l&rsquo;arrêt faute de carburant&nbsp;;"),
    ],
    "decentralisation.html": [
        # 7 plaidoyers + 1 note (la note est tout entière adressée à la commune)
        ("chacun des huit plaidoyers que nous portons touche à un domaine",
         "chacun de nos sept plaidoyers touche à un domaine"),
        # seules provinces et communes sont des collectivités (23 + 420 = 443)
        ("soit près de cinq cent soixante collectivités",
         "soit près de cinq cent soixante entités, dont quatre cent quarante-trois collectivités autonomes (provinces et communes)"),
        # collecte suspendue depuis le 23/09/2026 : rien n'est financé
        ("», financée par ses membres et sa diaspora.",
         "», à financer par ses membres et sa diaspora."),
        # la source citée en bas de page dit « 7 dollars PPA »
        ("soit environ <strong>sept dollars par habitant et par an",
         "soit environ <strong>sept dollars PPA par habitant et par an"),
        # redite du chapeau
        ("Cette page expose le cadre tel qu&rsquo;il existe, l&rsquo;écart entre les textes et la pratique, et la manière dont nous entendons nous en servir. Elle ne prend pas parti",
         "Cette page ne prend pas parti"),
    ],
    "problematiques.html": [
        # onze inconnues annoncées, huit nommées : les trois manquantes
        ("l&rsquo;ampleur des pertes après récolte, et les années de règne de nos propres chefs.",
         "l&rsquo;ampleur des pertes après récolte, l&rsquo;absence d&rsquo;inventaire des lieux et bois sacrés, les sépultures anciennes sans marquage, la transmission des limites et des interdits, et les années de règne de nos propres chefs."),
        # le tableau utilise aussi canton, chefferie, services et établissements
        ("nous, la commune, le département, la province, ou l&rsquo;État.",
         "nous, la chefferie ou le canton, la commune, le département, la province, les services de l&rsquo;État et les établissements, ou l&rsquo;État lui-même."),
        # repères relatifs devenus faux sur une page tenue à jour
        ("Ce que nous avons appris aujourd&rsquo;hui", "Ce que ce recensement nous a appris"),
        ("Nous en avions zéro sur trois il y a un mois", "Nous en avions zéro sur trois avant la réactivation de l&rsquo;association"),
        # même ligne, même étiquette dans les deux vues
        ("ni bourse, ni h&eacute;ritage (solidarit&eacute;)", "ni bourse, ni h&eacute;ritage (personnes vuln&eacute;rables)"),
    ],
    "enquetes.html": [
        # repère relatif sur une page tenue à jour
        ("Les quatre premières valent d&rsquo;être lancées avant la fin du mois",
         "Les quatre premières valent d&rsquo;être lancées sans attendre"),
    ],
}
