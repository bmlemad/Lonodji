# Relecture du 1er octobre 2026, points vérifiés sur sources (après la relecture des lots A à G).
# - Masnan Béoss : graphie de l'article lui-même (ACAREF, éditions EFUA, décembre 2024, « Identification des peuples
#   sara du sud du Tchad »).
# - Eric Johnson : graphie de SIL International (sil.org/resources/archives/9030 et publications/entry/9236).
# - PMCR : « Projet de Mobilité et de Connectivité Rurale » (Alwihda Info, point du gouvernement sur les projets routiers).
# - Sarh : 9,146° N, 18,383° E (geodatos) ; Bédjondo 8,634° N, 17,187° E (content/villages.json) : environ 143 km.
_BEOSS = [("Masnan Beoss", "Masnan Béoss")]
CORRECTIONS = {
    "bedjondo.html": list(_BEOSS),
    "en/bedjondo.html": list(_BEOSS),
    "genealogies.html": list(_BEOSS),
    "recherche.html": _BEOSS + [("Éric Johnson", "Eric Johnson"), ("Nya Pende", "Nya Pendé")],
    "mission.html": [("Nya Pende", "Nya Pendé")],
    "ong-partenaires.html": [
        ("mobilit&eacute; et de collectivit&eacute; rurale", "mobilit&eacute; et de connectivit&eacute; rurale"),
        ("mobilité et collectivités rurales", "mobilité et de connectivité rurale"),
    ],
    "problematiques.html": [("à cent kilomètres", "à environ cent quarante kilomètres")],
    # /programmes disait qu'aucune thématique ne porte l'alphabétisation, que la page Solidarité & inclusion propose :
    # les deux sont vrais, la page le dit (aucune décision prise ici).
    "poles.html": [
        ("co&ucirc;t des transferts d&rsquo;argent de la diaspora</strong> (10.c). La",
         "co&ucirc;t des transferts d&rsquo;argent de la diaspora</strong> (10.c)&nbsp;; la page <a href=\"solidarite-inclusion.html\">Solidarité &amp; inclusion</a> "
         "propose bien des cours d&rsquo;alphabétisation dans un projet d&rsquo;entraide, mais aucune thématique ne les a encore inscrits à son programme. La"),
    ],
}
