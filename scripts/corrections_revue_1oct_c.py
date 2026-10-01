# Relecture du 1er octobre 2026, lot C : pages anglaises héritées (en/*.html).
# Remplacements exacts appliqués par scripts/import-legacy.py (corrections_revue), après corrections_en.py.
# Arbitrages de la relecture : le plaidoyer routes à jour dit que Bédjondo est desservie par la nationale mais
# n'a pas de voirie ; le château d'eau et son réseau ne desservent qu'un village et s'arrêtent faute de carburant.

# en/themes.html : le paragraphe sur les cibles répondait à une question pas encore posée ; il passe après celui
# qui présente objectifs et cibles. 45 cibles une fois 2.2 ajoutée à la thématique 11 (comme poles.html en FR).
CIBLES_ANCIEN = (
    '<p>At target level the answer is more qualified, and we would rather give it ourselves: our themes carry forty-four of the one hundred and '
    'sixty-nine targets, and four targets central to development are still not among them. We do not claim <strong>child stunting</strong> (2.2), '
    '<strong>adult literacy</strong> (4.6), <strong>child labour</strong> (8.7) or the <strong>cost of diaspora remittances</strong> (10.c). '
    'For a rural territory in southern Chad these are front-rank issues, and two of them are already listed among the local problems we track. '
    'But none of our themes has put them on its programme, and we will not display a target nobody is working on. Those four are open pieces of '
    'work &mdash; if one of them matters to you, <a href="contact.html">tell us</a>.</p>\n'
    '      <p>Each theme is set against the <a href="#sdg-index">United Nations Sustainable Development Goals</a> it actually touches &mdash; two or '
    'three, no more. For each goal we also give the precise <strong>target</strong> number: the seventeen goals break down into one hundred and '
    'sixty-nine targets, and that is the level at which a mapping means anything &mdash; &ldquo;SDG&nbsp;5&rdquo; says nothing, &ldquo;target 5.2, '
    'eliminate violence against women and girls&rdquo; says exactly what is meant. Hover a badge for the full wording. That alignment is our own '
    'reading, not a label awarded by anyone, and it can be corrected.</p>'
)
CIBLES_NOUVEAU = (
    '<p>Each theme is set against the <a href="#sdg-index">United Nations Sustainable Development Goals</a> it actually touches &mdash; two or '
    'three, no more. For each goal we also give the precise <strong>target</strong> number: the seventeen goals break down into one hundred and '
    'sixty-nine targets, and that is the level at which a mapping means anything &mdash; &ldquo;SDG&nbsp;5&rdquo; says nothing, &ldquo;target 5.2, '
    'eliminate violence against women and girls&rdquo; says exactly what is meant. Hover a badge for the full wording. That alignment is our own '
    'reading, not a label awarded by anyone, and it can be corrected.</p>\n'
    '      <p>At target level the answer is more qualified, and we would rather give it ourselves: our themes carry forty-five of the one hundred and '
    'sixty-nine targets, and three targets central to development are still not among them. We do not claim '
    '<strong>adult literacy</strong> (4.6), <strong>child labour</strong> (8.7) or the <strong>cost of diaspora remittances</strong> (10.c). '
    '<strong>Child malnutrition</strong> (2.2), which we used to cite here, joined Health, Nutrition &amp; Prevention on 29 September 2026. '
    'For a rural territory in southern Chad these are front-rank issues, and two of them are already listed among the local problems we track. '
    'But none of our themes has put them on its programme, and we will not display a target nobody is working on. Those three are open pieces of '
    'work &mdash; if one of them matters to you, <a href="contact.html">tell us</a>.</p>'
)

CHIP_2_2 = ('<a class="odd-chip" href="#sdg-2" style="--odd-accent:#DDA63A;--odd-ink:#10181f" title="SDG 2 &mdash; Zero Hunger | '
            'target 2.2 &mdash; end all forms of malnutrition"><span class="odd-num">2</span><span class="odd-name">Hunger</span>'
            '<span class="odd-cible">2.2</span></a>')
DOT_2_3 = ('<a class="odd-dot odd-dot--cible" href="#sdg-2" style="--odd-accent:#DDA63A;--odd-ink:#10181f" title="SDG 2 &mdash; Zero Hunger | '
           'target 2.3')
DOT_2_2 = ('<a class="odd-dot odd-dot--cible" href="#sdg-2" style="--odd-accent:#DDA63A;--odd-ink:#10181f" title="SDG 2 &mdash; Zero Hunger | '
           'target 2.2 &mdash; end all forms of malnutrition"><span class="sr-only">SDG 2, target </span>2.2</a>')

CORRECTIONS = {
    "en/advocacy.html": [
        # aucun dossier n'est envoyé (lettres de transmission en attente de signature, /actions)
        ("All are published in French, sent officially, and tracked publicly (sending date, replies, results).",
         "All are published in French and tracked publicly (sending date, replies, results); none has been sent yet: the covering letters "
         "await the executive committee&rsquo;s signature."),
        ("Bédjondo is a broadband white zone with the most expensive small data bundles.",
         "Bédjondo has no broadband coverage, in a country where mobile data, especially in small bundles, is among the dearest in Africa."),
        ("an accessible Starlink outlet", "an accessible Starlink retailer"),
        ("Chad has 6% electricity access (1&ndash;2% rural).", "Only 6% of people in Chad have electricity (1&ndash;2% in rural areas)."),
        # eau : le château d'eau existant ne dessert qu'un village et s'arrête faute de carburant
        ("A departmental capital without a water network. We ask for an inventory of water points, a solar mini-network (borehole, water tower, "
         "standpipes), water and latrines in every school",
         "A departmental capital whose water tower serves a single village and stops for lack of fuel. We ask for solar pumping, extension of "
         "the network to the whole town, an inventory of water points, water and latrines in every school"),
        ("Ministry of Water, PAEPA SU MR (AfDB), UNICEF, Caritas Switzerland / NexSud, commune",
         "Ministry of Water, provincial delegation, PAEPA SU MR (AfDB), UNICEF, Caritas Switzerland / NexSud, commune"),
        # santé : 1 063 décès maternels pour 100 000 naissances (« près d'une femme sur cent »)
        ("One woman in a hundred dies in childbirth in Chad.", "In Chad, nearly one birth in a hundred costs the mother her life."),
        ("and a health mutual", "and a community health insurance scheme"),
        ("Ministry of Public Health, provincial health delegation, Koumra provincial hospital, partners",
         "Ministry of Public Health, Mandoul health delegation, health district, Koumra hospital, WHO, UNICEF, Swiss cooperation, commune"),
        # routes : la ville est desservie par la nationale mais n'a pas de voirie (plaidoyer du 17/09 à jour)
        ("The Koumra&ndash;Bédjondo road is cut in the rainy season; women have asked since 2023 for a bridge on the Bédjondo&ndash;Békamba road; "
         "the Hoblo bridge is broken. We ask for an all-season road, both bridges, and local maintenance crews.",
         "Bédjondo is served by the national road but has no proper streets or drains; women have been asking since 2023 for a bridge on the "
         "Bédjondo&ndash;Békamba road, and the Hoblo bridge has collapsed. We ask for a first urban road plan with drains, both bridges, "
         "cantonal tracks and local maintenance crews."),
        ("PMCR rural mobility project (World Bank)",
         "provincial delegation, PMCR rural mobility project (World Bank; closed on 30 April 2026, successor to be identified)"),
        # éducation : 73 et 83 sont des moyennes nationales (UNICEF 2024)
        ("73 pupils per teacher, classes of 83, community teachers paid late, a secondary school without a laboratory.",
         "Nationally, 73 pupils per teacher and classes of 83; in Bédjondo, community teachers paid late and a secondary school without a laboratory."),
        ("an equipped lycée", "an equipped upper secondary school (lycée)"),
        ("Ministry of Education, provincial delegation, ProQEB / Swiss cooperation, UNICEF, commune",
         "Ministry of Education, provincial delegation, departmental inspectorate, ProQEB / Swiss cooperation, UNICEF, commune"),
        ("Ministry responsible for vocational training, FONAP, provincial delegation, commune",
         "Ministry responsible for vocational training, Directorate of vocational education, FONAP, ONAPE, AFD (AFPACET), "
         "Swiss cooperation / Caritas Switzerland, chamber of commerce and craftspeople, commune"),
        ("Six proposals for a commune equal to its town", "Six proposals for a commune that matches the size of its town"),
        ("and free studies from the diaspora", "and pro bono studies by diaspora professionals"),
    ],
    "en/bedjondo.html": [
        ("sub-prefectures: Bédjondo, Bébopen, Békamba, Péni", "sub-prefectures according to the ACAREF study: Bédjondo, Bébopen, Békamba, Péni"),
        ("The department has four sub-prefectures, five cantons and about 256 villages.",
         "According to the ACAREF study, the department has four sub-prefectures, five cantons and about 256 villages; other sources count differently."),
        ("multiplied by 2.5", "grew 2.5-fold"),
        ("without piped drinking water, in a broadband white zone with expensive mobile data,",
         "with piped water reaching only one village, with no broadband coverage and expensive mobile data,"),
        ("linked to Koumra by a track that is cut in the rainy season", "served by the national road but without proper streets or drains"),
        # 80 élèves par classe : moyenne nationale, pas un relevé de Bédjondo
        ("with a health centre without a laboratory and schools of 80 pupils per class",
         "with a health centre without a laboratory and overcrowded classes"),
    ],
    "en/index.html": [
        ("A town of probably over 15,000 without the infrastructure of a town",
         "A town of probably over 15,000 people without a town&rsquo;s infrastructure"),
        ("a road cut off in the rainy season", "no proper streets or drains, unmaintained tracks to its cantons"),
        # la collecte est suspendue depuis le 23/09/2026
        ("Join, give, share your skills, spread the word", "Join, share your skills, spread the word"),
        ("fourteen units, 966 localities", "fourteen units, 966 named localities"),
    ],
    "en/about.html": [
        ("a more inclusive, modern and federating framework", "a more inclusive and modern framework that brings existing initiatives together"),
        ("to federate existing initiatives rather than compete with them", "to bring existing initiatives together rather than compete with them"),
    ],
    "en/contact.html": [
        ('Data and rights <span lang="fr">(en fran&ccedil;ais)', 'Data and rights <span>(in French)'),
        ("with its host in the United States (Netlify)", "stored with its host in the United States (Netlify)"),
    ],
    "en/themes.html": [
        # description (meta) : complète, sans « … » ; « twenty » devient « twenty-one » plus loin (comptes)
        ("each set against the UN Sustainable Development Goals it touches.", "each mapped to the SDG targets it actually touches."),
        ('every theme has a fuller description <span lang="fr">en fran&ccedil;ais', 'every theme has a fuller description <span>in French'),
        ('Full description <span lang="fr">en fran&ccedil;ais', 'Full description <span>(in French)'),
        (CIBLES_ANCIEN, CIBLES_NOUVEAU),
        # cible 2.2 : thématique 11, résumé du pilier II, tableau ODD 2
        ('target 6.2 &mdash; sanitation and hygiene"><span class="odd-num">6</span><span class="odd-name">Water &amp; sanitation</span>'
         '<span class="odd-cible">6.2</span></a></div>',
         'target 6.2 &mdash; sanitation and hygiene"><span class="odd-num">6</span><span class="odd-name">Water &amp; sanitation</span>'
         '<span class="odd-cible">6.2</span></a>' + CHIP_2_2 + '</div>'),
        (DOT_2_3, DOT_2_2 + DOT_2_3),
        ('04 &middot; Agriculture, Livestock &amp; Food Security <span class="odd-cible">2.1&thinsp;/&thinsp;2.3</span></a></div>',
         '04 &middot; Agriculture, Livestock &amp; Food Security <span class="odd-cible">2.1&thinsp;/&thinsp;2.3</span></a>'
         '<a href="#theme-list">11 &middot; Health, Nutrition &amp; Prevention <span class="odd-cible">2.2</span></a></div>'),
        ("Targets 3.1, 3.2 and 3.3 answer to that file, not to an intention.",
         "Targets 3.1, 3.2 and 3.3 rest on that brief, not on a mere intention."),
        # thématique 07 : la description principale décrivait encore l'ancien périmètre (eau, énergie, internet)
        ("Drinking water, electricity through renewables first, and internet access &mdash; three priorities the community identified, all still inadequate.",
         "Drinking water, sanitation and hygiene &mdash; what NGOs call WASH: water in every neighbourhood, latrines, wastewater and waste, "
         "handwashing at school and at the market, with schools and health centres."),
        # thématique 08 : les déchets relèvent de la 07 (WASH)
        (", waste management included.", "."),
        ("Micro-credit and rotating savings", "Microcredit and rotating savings"),
        # directions de pôle (rang de chef de projet), comme /programmes en français : I et II pourvues, III et IV à pourvoir
        ('<p class="prose-note">Memory, culture, language and knowledge of the Bedjond people.</p>',
         '<p class="prose-note">Memory, culture, language and knowledge of the Bedjond people. Pillar Lead (programme-manager level): Dr Bé-Rammaj Miaro-II.</p>'),
        ('<p class="prose-note">Everyday life and the future: feeding, treating, teaching, connecting and doing business in B&eacute;djondo.</p>',
         '<p class="prose-note">Everyday life and the future: feeding, treating, teaching, connecting and doing business in B&eacute;djondo. '
         'Pillar Lead (programme-manager level): Franco Joseph Ngarlena.</p>'),
        ('<p class="prose-note">Organising, representing, reconciling and connecting.</p>',
         '<p class="prose-note">Organising, representing, reconciling and connecting. Pillar Lead (programme-manager level): post open &mdash; '
         '<a href="contact.html">write to us</a>.</p>'),
        ('<p class="prose-note">A specialised pillar created in September 2026.</p>',
         '<p class="prose-note">A specialised pillar created in September 2026. Pillar Lead (programme-manager level): post open &mdash; '
         '<a href="contact.html">write to us</a>.</p>'),
    ],
}
