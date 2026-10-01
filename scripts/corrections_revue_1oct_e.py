# Relecture du 1er octobre 2026, lot E : rubrique Association (identité visuelle, démarches, engagements,
# événements, ONG) et Patrimoine (histoire et figures, lieux sacrés, généalogies, base de recherche, documents).
CORRECTIONS = {
    "evenements.html": [
        # 01 Mémoire & héritage coordonnée par Félix Mbété Nangmbatnan depuis le 30/09 ; le Dr Miaro-II dirige le pôle I
        ("Coordination&nbsp;: Dr Bé-Rammaj Miaro-II",
         "Coordination&nbsp;: Félix Mbété Nangmbatnan"),
        # description : aucun rendez-vous n'a de date (tous « À définir »)
        ("dans la diaspora : les dates annoncées et celles à fixer.",
         "dans la diaspora : toutes les dates restent à fixer."),
    ],
    "figures.html": [
        # fait faux depuis le 30/09 (cf. /bibliotheque, liste des chercheurs)
        ('Il coordonne aujourd&rsquo;hui la thématique <a href="poles.html#memoire-heritage">Mémoire &amp; héritage</a> de l&rsquo;association.',
         'Il dirige aujourd&rsquo;hui le pôle I, Mémoire, culture &amp; patrimoine, après avoir coordonné la thématique <a href="poles.html#memoire-heritage">Mémoire &amp; héritage</a> jusqu&rsquo;au 30 septembre 2026.'),
        # note du 7e rang : phrase obscure (« écrit simplement Gari » sans dire pour quel nom)
        ("&eacute;crit simplement &laquo;&nbsp;Gari&nbsp;&raquo;, et &eacute;crit &laquo;&nbsp;Bignero&nbsp;&raquo; sans accent au rang pr&eacute;c&eacute;dent&nbsp;; l&rsquo;association &eacute;crit Bign&eacute;ro.",
         "nomme ce chef simplement &laquo;&nbsp;Gari&nbsp;&raquo;&nbsp;; au rang pr&eacute;c&eacute;dent, elle &eacute;crit &laquo;&nbsp;Bignero&nbsp;&raquo;, sans accent, graphie que nous conservons, alors que l&rsquo;association &eacute;crit Bign&eacute;ro."),
    ],
    "documents.html": [
        # 21 thématiques depuis le 30/09 (résultat de corrections_fr.py, l. 311, remplacé ici)
        ("(dix-neuf dans cette édition de septembre 2026&nbsp;; vingt depuis le 29 septembre)",
         "(vingt et une)"),
        # /patrimoine/lieux-sacres : cinq règles « de tenue du cahier », distinctes des quatre règles de discrétion
        ("Les cinq r&egrave;gles de discr&eacute;tion",
         "Les cinq r&egrave;gles de tenue du cahier"),
        # tiret d'incise non refermé
        ("la menuiserie métallique, y habiliter",
         "la menuiserie métallique &mdash;, y habiliter"),
    ],
    "ong-partenaires.html": [
        # le tableau n'est pas la liste des 8 dossiers (7 plaidoyers + note à la commune)
        ("Nos huit dossiers de plaidoyer",
         "Nos dossiers &mdash; plaidoyers et dossiers thématiques &mdash;"),
        # le PMCR est clos depuis le 30 avril 2026 (même page)
        ("Demander l&rsquo;inscription de nos pistes de cantons au programme, la voirie urbaine relevant d&rsquo;abord de la commune.",
         "Identifier le programme qui succède au PMCR et y demander l&rsquo;inscription de nos pistes de cantons, la voirie urbaine relevant d&rsquo;abord de la commune."),
        # nom de l'ONG (deux occurrences, deux encodages)
        ("Solidarit&eacute; International", "Solidarit&eacute;s International"),
        ("Solidarité International", "Solidarités International"),
        # répétition
        ("Une adresse &eacute;lectronique d&eacute;di&eacute;e sera publi&eacute;e ici d&egrave;s qu&rsquo;une adresse &eacute;lectronique sera rattach&eacute;e &agrave; lonodji.org.",
         "Une adresse &eacute;lectronique d&eacute;di&eacute;e sera publi&eacute;e ici d&egrave;s qu&rsquo;une bo&icirc;te de messagerie sera rattach&eacute;e &agrave; lonodji.org."),
        # « vous » sans destinataire sur une page publique
        ("au problème que vous nous avez signalé",
         "au problème que nos membres nous ont signalé"),
    ],
    "demarches.html": [
        # contradiction avec l'encadré « Statut visé » et le paragraphe suivant (nom ODEB LONODJI retenu)
        ("l&rsquo;instance et la date de la décision ne sont pas encore publiées, et le nom comme l&rsquo;objet de la future ONG seront fixés par l&rsquo;assemblée générale",
         "l&rsquo;instance et la date de la décision ne sont pas encore publiées&nbsp;; le nom prévu est ODEB LONODJI, et l&rsquo;objet de la future ONG sera fixé par l&rsquo;assemblée générale"),
        # « compatir » n'a pas de forme pronominale passive
        ("une demande qui s&rsquo;appuie sur un besoin se compatit.",
         "une demande qui s&rsquo;appuie sur un besoin n&rsquo;obtient, au mieux, que de la compassion."),
        # renvoi faux : « cette section » est « Ce que nous ne savons pas »
        ("nos lacunes sont documentées directement dans cette section&nbsp;: nous ne les répétons pas ici.",
         "nos lacunes sont documentées dans la section «&nbsp;Vers le statut d&rsquo;ONG&nbsp;» ci-dessus&nbsp;: nous ne les répétons pas ici."),
        # lettre modèle : aucune collaboration avec la commune n'est établie
        ("Nous préparons avec la commune de Bédjondo un ensemble de dossiers",
         "Nous avons préparé, pour le département et la commune de Bédjondo, un ensemble de dossiers"),
        # concordance des temps
        ("Un membre qui veut agir lundi matin ne trouvait nulle part à qui écrire ni comment.",
         "Un membre qui voulait agir lundi matin ne trouvait nulle part à qui écrire ni comment."),
    ],
    "engagements.html": [
        # « les … telles qu'elles » sans antécédent
        ("nous n&rsquo;y récrivons rien, nous les copions telles qu&rsquo;elles apparaissent sur leur page d&rsquo;origine",
         "nous n&rsquo;y récrivons rien&nbsp;: nous copions les engagements tels qu&rsquo;ils apparaissent sur leur page d&rsquo;origine"),
        # incises ouvertes par un tiret jamais refermées (ponctuation seule, comme dans les plaidoyers d'origine)
        ("jours d&rsquo;arrêt constatés et à le remettre",
         "jours d&rsquo;arrêt constatés &mdash; et à le remettre"),
        ("emprises encore libres remis aux services de l&rsquo;État",
         "emprises encore libres &mdash;, remis aux services de l&rsquo;État"),
    ],
    "articles/2026-09-17-plaidoyer-eau-potable-bedjondo.html": [
        # même phrase cassée dans le plaidoyer (ponctuation seule)
        ("jours d&rsquo;arrêt constatés et à le remettre",
         "jours d&rsquo;arrêt constatés &mdash; et à le remettre"),
    ],
    "articles/2026-09-17-plaidoyer-routes-ponts-bedjondo.html": [
        ("emprises encore libres remis aux services de l&rsquo;État",
         "emprises encore libres &mdash;, remis aux services de l&rsquo;État"),
    ],
    "identite-visuelle.html": [
        # la page décrit l'identité d'avant le 28/09 : titre distinct de la charte en vigueur (/odeb/identite)
        ("<h1>Identit&eacute; visuelle</h1>", "<h1>Ancienne identit&eacute; visuelle</h1>"),
        ("Identité visuelle — ADEB LONODJI", "Ancienne identité visuelle — ADEB LONODJI"),
        # description : complète, sans présenter comme actuelle la charte remplacée
        ("Le logo d&rsquo;ADEB LONODJI, ses couleurs, ses polices et ses signes (barre des quatre p&ocirc;les, carte du pays bedjond, frise des chefs de canton)&nbsp;: la charte graphique de l&rsquo;association, avec les fichiers &agrave; t&eacute;l&eacute;charger.",
         "L&rsquo;identit&eacute; visuelle d&rsquo;ADEB LONODJI avant le 28 septembre 2026&nbsp;: logo bleu, couleurs, polices, signes bedjond et fichiers &agrave; t&eacute;l&eacute;charger."),
        # contredit la mise à jour du 28/09 en tête de page
        ("Cette page tient lieu de charte graphique. Toute &eacute;volution du logo ou des couleurs y sera consign&eacute;e, avec sa date, comme le reste du site.",
         "Cette page a tenu lieu de charte graphique jusqu&rsquo;au 28 septembre 2026&nbsp;; la charte en vigueur est celle de l&rsquo;identit&eacute; &laquo;&nbsp;Les Pas vers l&rsquo;Avenir&nbsp;&raquo;."),
        # énumération apposée ; la palette nomme « Argile » le fond des pages de mémoire
        ("Les pages de m&eacute;moire, Mission, B&eacute;djondo, Grandes figures, Lieux sacr&eacute;s, G&eacute;n&eacute;alogies, Base de recherche et les articles d&rsquo;histoire, sont sur fond de sable",
         "Les pages de m&eacute;moire (Mission, B&eacute;djondo, Grandes figures, Lieux sacr&eacute;s, G&eacute;n&eacute;alogies, Base de recherche et articles d&rsquo;histoire) sont sur fond d&rsquo;argile"),
    ],
    "lieux-sacres.html": [
        # description plus absolue que le corps (« presque personne »)
        ("inaliénable, et personne ne s&rsquo;en sert", "inaliénable, et presque personne ne s&rsquo;en sert"),
        # contresens : pas d'« atteintes aux défrichements »
        ("punit les atteintes aux d&eacute;frichements, aux incendies, aux r&eacute;serves foresti&egrave;res, aux plans d&rsquo;am&eacute;nagement",
         "punit les d&eacute;frichements et les incendies illicites, les atteintes aux r&eacute;serves foresti&egrave;res et aux plans d&rsquo;am&eacute;nagement"),
        # contredit « La décision n'est pas la nôtre » et le tableau (saisine par la chefferie)
        ("la seule qui ne d&eacute;pende que de nous-m&ecirc;mes et du conseil communal",
         "la seule qui ne d&eacute;pende que de la chefferie et du conseil communal"),
    ],
    "mission.html": [
        # texte repris sur /histoire (Origines) : sujet pluriel « Les Sara »
        ("Il regroupe plusieurs composantes", "Cet ensemble regroupe plusieurs composantes"),
        # le Mandoul manque ; le paragraphe « Origines » le cite en premier
        ("principalement répartis dans le Logone Occidental, le Logone Oriental, le Moyen-Chari et le Tandjilé Est",
         "principalement répartis dans le Mandoul, le Logone Occidental, le Logone Oriental, le Moyen-Chari et le Tandjilé Est"),
        # connecteur sans référent
        ("Plus tôt encore, la région garde la mémoire", "La région garde aussi la mémoire"),
        # chiffre de la liste du 13 septembre (article Villages et cantons) : daté, pour ne pas paraître contredire la carte
        ("133 déjà inventoriés &mdash; brouillon en cours", "133 inventoriés (liste du 13 septembre)"),
    ],
    "genealogies.html": [
        # « la seconde » ambiguë (ce n'est pas la deuxième feuille du tableau)
        ("La premi&egrave;re feuille se remplit en une heure et donne confiance&nbsp;; la seconde demande des semaines d&rsquo;enqu&ecirc;te et d&eacute;courage ceux qui commencent par l&agrave;.",
         "La maison du p&egrave;re se remplit en une heure et donne confiance&nbsp;; l&rsquo;anc&ecirc;tre lointain demande des semaines d&rsquo;enqu&ecirc;te et d&eacute;courage ceux qui commencent par lui."),
        # la page s'appelle Histoire & grandes figures
        ('Notre page <a href="figures.html#lignee">Figures</a> pr&eacute;sente',
         'Notre page <a href="figures.html#lignee">Histoire &amp; grandes figures</a> pr&eacute;sente'),
        # demi-cadratin d'intervalle, comme sur /histoire et la base
        ("de 1927-1928 et la r&eacute;pression de la &laquo;&nbsp;guerre de Bouna&nbsp;&raquo; en 1928-1929",
         "de 1927&ndash;1928 et la r&eacute;pression de la &laquo;&nbsp;guerre de Bouna&nbsp;&raquo; en 1928&ndash;1929"),
    ],
    "recherche.html": [
        # « pays bedjond », « langue nangnda » partout ailleurs
        ("dans la langue du pays nangnda", "en nangnda, la langue du pays bedjond"),
        # majuscules : « École normale supérieure de Bongor » sur /langue et la liste des chercheurs
        ("affilié à l&rsquo;École Normale Supérieure de Bongor", "affilié à l&rsquo;École normale supérieure de Bongor"),
        # étiquette hors des quatre catégories (la fiche est filtrée en anthropologie)
        ("Ressource comparative", "Anthropologie"),
    ],
}
