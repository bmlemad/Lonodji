# Revue du 29 septembre 2026 — corrections exactes des pages anglaises héritées (en/*.html).
# Chargé par scripts/import-legacy.py (corrections_revue), APRÈS RENOMMAGES_29_09 et COMPTES_29_09 :
# « ancien » doit correspondre au HTML source à ce stade (entités &amp; &rsquo; &eacute; conservées).
# Faits de référence : 20 thématiques, 16 pourvues (30/09/2026), 4 ouvertes ; 4 piliers (Pillar Lead ouverts) ;
# 2 cellules ; 8 plaidoyers ; lonodji.org en ligne depuis le 27/09/2026, pas encore d'e-mail.

MAJ = "<strong>Update, 29 September 2026:</strong>"

# Cibles ODD de la thématique 20 (1.5, 11.5, 13.1), au format des puces de en/themes.html
PUCES_20 = (
    '<div class="pole-odd"><span class="odd-legend">SDG</span>'
    '<a class="odd-chip" href="#sdg-1" style="--odd-accent:#E5243B;--odd-ink:#ffffff" title="SDG 1 &mdash; No Poverty | target 1.5 &mdash; resilience of the poor to disasters"><span class="odd-num">1</span><span class="odd-name">Poverty</span><span class="odd-cible">1.5</span></a>'
    '<a class="odd-chip" href="#sdg-11" style="--odd-accent:#FD9D24;--odd-ink:#10181f" title="SDG 11 &mdash; Sustainable Cities and Communities | target 11.5 &mdash; reduce deaths and losses caused by disasters"><span class="odd-num">11</span><span class="odd-name">Sustainable cities</span><span class="odd-cible">11.5</span></a>'
    '<a class="odd-chip" href="#sdg-13" style="--odd-accent:#3F7E44;--odd-ink:#ffffff" title="SDG 13 &mdash; Climate Action | target 13.1 &mdash; resilience to climate hazards"><span class="odd-num">13</span><span class="odd-name">Climate</span><span class="odd-cible">13.1</span></a>'
    '</div>'
)

CORRECTIONS = {
    "en/index.html": [
        ('<span class="hero-pill">Founded 1995</span>', '<span class="hero-pill">Recognised 1995</span>'),
        ('<span class="bento-num">4</span><span class="bento-label">areas of action</span>',
         '<span class="bento-num">4</span><span class="bento-label">pillars</span>'),
        ('<span class="bento-num">19</span><span class="bento-label">themes of action, 6 with a coordinator so far</span>',
         '<span class="bento-num">20</span><span class="bento-label">themes, 16 with a coordinator so far</span>'),
        ("before being relaunched in 2026 with four areas of action, twenty themes,",
         "before being relaunched in 2026 with four pillars, twenty themes,"),
        ("<h2>Four areas of action</h2>", "<h2>Four pillars</h2>"),
        ("<p>Agriculture and food security, inclusive finance, environment, water, energy and connectivity, roads and urban planning, youth, women&rsquo;s leadership, health, solidarity.</p>",
         "<p>Agriculture, livestock and food security; entrepreneurship and inclusive finance; environment and climate; water, sanitation and hygiene; energy, roads and urban planning; education, youth and training; women&rsquo;s empowerment; health and nutrition; social protection and children; emergencies and risks.</p>"),
        ("<p>Digital transformation and services, artificial intelligence and data, digital skills and entrepreneurship.</p>",
         "<p>Connectivity and digital services, artificial intelligence and data, digital skills and entrepreneurship.</p>"),
        ("On 28 September 2026, forty years after its founding reflections of 1986, the association launched the ODEB LONODJI reflection:",
         "On 28 September 2026, forty years after the first discussions of 1986, the association launched the ODEB LONODJI initiative:"),
        ("lead one of the four poles as Pillar Lead", "lead one of the four pillars as Pillar Lead"),
    ],
    "en/about.html": [
        ("Bedjond executives began discussing it in 1986;", "Bedjond professionals began discussing it in 1986;"),
        ("first purpose: agriculture, food security, entrepreneurship, water, energy and connectivity, roads and planning, environment, health, youth, women&rsquo;s leadership.",
         "first purpose: agriculture and food security, entrepreneurship and inclusive finance, environment and climate, water, sanitation and hygiene, energy, roads and urban planning, education and youth, women&rsquo;s empowerment, health and nutrition."),
        ("wherever they live: social support, emergency help, attention to people with disabilities and isolated elders,",
         "wherever they live: social protection and child protection, preparedness for emergencies and risks, attention to people with disabilities and isolated elders,"),
        ("<p>Four areas of action (Memory, Culture &amp; Heritage;", "<p>Four pillars (Memory, Culture &amp; Heritage;"),
        ("twenty themes each led by a coordinator who reports to the members,",
         "twenty themes, each meant to be led by a coordinator who reports to the members,"),
        ("an executive bureau &mdash;", "an executive committee &mdash;"),
        ("Thirteen of the twenty themes are still looking for a coordinator.",
         "Four of the twenty themes are still looking for a coordinator."),
        ("Presentation file (PDF, in French)", "Presentation brochure (PDF, in French)"),
    ],
    "en/contact.html": [
        ("E-mail addresses will be published here once the association&rsquo;s domain name is registered; until then, this form and WhatsApp are the reliable ways to reach us.",
         "No e-mail yet: the domain name lonodji.org has been live since 27 September 2026, but no e-mail address is attached to it yet. We will publish addresses here as soon as they work; until then, this form and WhatsApp are the two reliable ways to reach us."),
    ],
    "en/bedjondo.html": [
        ('<span class="bento-num">11086</span>', '<span class="bento-num">11,086</span>'),
        ("(6 % national access, 1&ndash;2 % in rural areas)", "(6% national access, 1&ndash;2% in rural areas)"),
    ],
    "en/advocacy.html": [
        ("Chad has 6 % electricity access (1&ndash;2 % rural).", "Chad has 6% electricity access (1&ndash;2% rural)."),
        ('content="Eight advocacy briefs by ADEB LONODJI for Bédjondo, Chad: broadband, electricity, drinking water, health, roads, education, vocational training, and a note to the commune."',
         'content="Eight advocacy briefs for Bédjondo, Chad: broadband, electricity, water, health, roads, education, training, and a note to the commune."'),
    ],
    "en/themes.html": [
        ('<span class="hero-pill">19 themes</span>', '<span class="hero-pill">20 themes</span>'),
        ("<h2>Sixteen coordinators out of twenty</h2>", "<h2>Sixteen themes out of twenty have a coordinator</h2>"),
        ("our themes carry forty-two of the one hundred and sixty-nine targets", "our themes carry forty-four of the one hundred and sixty-nine targets"),
        # thème 17 : note du 29/09 (avant le passage de « pole » à « pillar », qui touche aussi ce paragraphe)
        ("and digital inclusion. <strong>Update, 28 September 2026:</strong> the three themes of the Digital &amp; Innovation pole are now coordinated by Bign&eacute;ro Mo&iuml;alb&eacute;i LE MADANG, the association&rsquo;s general facilitator.</p>",
         "and digital inclusion. <strong>Update, 28 September 2026:</strong> the three themes of the Digital &amp; Innovation pillar are now coordinated by Bign&eacute;ro Mo&iuml;alb&eacute;i LE MADANG, the association&rsquo;s general facilitator. "
         + MAJ + " the theme, until now &ldquo;Digital Transformation &amp; Services&rdquo;, takes over <strong>connectivity</strong> &mdash; mobile network, broadband, the community digital space &mdash; from theme 07. Its coordination does not change.</p>"),
        ("the three themes of the Digital &amp; Innovation pole are", "the three themes of the Digital &amp; Innovation pillar are"),
        ("A specialised pole created in September 2026.", "A specialised pillar created in September 2026."),
        # notes de périmètre du 29/09/2026 (équivalents des notes de poles.html)
        ("solar waste.</p>",
         "solar waste. " + MAJ + " the theme widens to <strong>climate change adaptation</strong> &mdash; farming practices in the face of irregular rains, reforestation, riverbank protection; disaster preparedness belongs to theme 20, Emergencies &amp; Risks.</p>"),
        ("three priorities the community identified, all still inadequate.</p>",
         "three priorities the community identified, all still inadequate. " + MAJ + " the theme becomes <strong>Water, Sanitation &amp; Hygiene</strong> &mdash; what NGOs call WASH: drinking water, latrines, wastewater and waste, handwashing at school and at the market. Energy moves to theme 08, Energy, Roads &amp; Urban Planning, and internet access to theme 17, Connectivity &amp; Digital Services.</p>"),
        ("without ever being planned, waste management included.</p>",
         "without ever being planned, waste management included. " + MAJ + " the theme, until now &ldquo;Road Access &amp; Urban Growth&rdquo;, now brings the infrastructure together: <strong>energy</strong> (electricity and solar, moved from theme 07), roads, bridges and tracks, and the planning of B&eacute;djondo.</p>"),
        ("<strong>Update, 28 September 2026:</strong> the theme is now coordinated by Bruno Kodjadoum NGARTEL.</p>",
         "<strong>Update, 28 September 2026:</strong> the theme is now coordinated by Bruno Kodjadoum NGARTEL. " + MAJ + " the theme, until now &ldquo;Youth &amp; Achievement&rdquo;, takes the name of what it carries: <strong>education</strong> &mdash; primary and secondary school, vocational training and the advocacy briefs that concern them &mdash; and youth. Its coordination does not change.</p>"),
        ("Targets 3.1, 3.2 and 3.3 answer to that file, not to an intention.</p>",
         "Targets 3.1, 3.2 and 3.3 answer to that file, not to an intention. " + MAJ + " the theme widens to <strong>nutrition</strong> &mdash; screening young children for malnutrition, feeding pregnant and breastfeeding women, links with the health centres and with the Agriculture, Livestock &amp; Food Security theme.</p>"),
        ("where a death, an illness or a failed harvest tips a whole family over.</p>",
         "where a death, an illness or a failed harvest tips a whole family over. " + MAJ + " the theme widens to <strong>child protection</strong> &mdash; birth registration, children out of school, early marriage, in line with the association&rsquo;s safeguarding policy; emergency aid in the event of a disaster or an epidemic moves to theme 20, Emergencies &amp; Risks.</p>"),
        # thème 20 : phrase de reprise et cibles ODD (carte, somme du pilier II, index des objectifs)
        ("no money is collected before the association has an account in its name.</p>",
         "no money is collected before the association has an account in its name. It takes over the emergency aid previously handled by Social Protection, Children &amp; Inclusion.</p>\n          " + PUCES_20),
        ('title="SDG 1 &mdash; No Poverty | target 1.4 &mdash; access to economic resources and financial services"><span class="sr-only">SDG 1, target </span>1.4</a>',
         'title="SDG 1 &mdash; No Poverty | target 1.4 &mdash; access to economic resources and financial services"><span class="sr-only">SDG 1, target </span>1.4</a>'
         '<a class="odd-dot odd-dot--cible" href="#sdg-1" style="--odd-accent:#E5243B;--odd-ink:#ffffff" title="SDG 1 &mdash; No Poverty | target 1.5 &mdash; resilience of the poor to disasters"><span class="sr-only">SDG 1, target </span>1.5</a>'),
        ('title="SDG 11 &mdash; Sustainable Cities and Communities | target 11.3 &mdash; participatory and planned urbanisation"><span class="sr-only">SDG 11, target </span>11.3</a>',
         'title="SDG 11 &mdash; Sustainable Cities and Communities | target 11.3 &mdash; participatory and planned urbanisation"><span class="sr-only">SDG 11, target </span>11.3</a>'
         '<a class="odd-dot odd-dot--cible" href="#sdg-11" style="--odd-accent:#FD9D24;--odd-ink:#10181f" title="SDG 11 &mdash; Sustainable Cities and Communities | target 11.5 &mdash; reduce deaths and losses caused by disasters"><span class="sr-only">SDG 11, target </span>11.5</a>'),
        ('12 &middot; Social Protection, Children &amp; Inclusion <span class="odd-cible">1.3</span></a>',
         '12 &middot; Social Protection, Children &amp; Inclusion <span class="odd-cible">1.3</span></a><a href="#theme-list">20 &middot; Emergencies &amp; Risks <span class="odd-cible">1.5</span></a>'),
        ('08 &middot; Energy, Roads &amp; Urban Planning <span class="odd-cible">11.3&thinsp;/&thinsp;11.6</span></a>',
         '08 &middot; Energy, Roads &amp; Urban Planning <span class="odd-cible">11.3&thinsp;/&thinsp;11.6</span></a><a href="#theme-list">20 &middot; Emergencies &amp; Risks <span class="odd-cible">11.5</span></a>'),
        ('06 &middot; Environment, Climate &amp; Natural Resources <span class="odd-cible">13.1</span></a>',
         '06 &middot; Environment, Climate &amp; Natural Resources <span class="odd-cible">13.1</span></a><a href="#theme-list">20 &middot; Emergencies &amp; Risks <span class="odd-cible">13.1</span></a>'),
    ],
}


# Accueil anglais mis en cohérence avec l'accueil français (audit du 30 septembre 2026).
CORRECTIONS.setdefault("en/index.html", []).extend([
    ("no piped water", "a water network that serves a single village and often stops for lack of fuel"),
    ("knowledge and innovation", "research and knowledge"),
    ("the network of experts and the diaspora.</p></article>", "the network of experts and the diaspora, justice and human rights.</p></article>"),
    ("and our own commitments.</p>", "and our own commitments. Each dispatch and each reply is dated on the <a href=\"impact.html\">impact dashboard</a>.</p>"),
])
