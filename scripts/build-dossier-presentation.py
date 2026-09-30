#!/usr/bin/env python3
"""Régénère le dossier de présentation (PDF, 4 pages A4) à partir des données du site.

Le PDF d'origine (septembre 2026) était figé : « dix-neuf thématiques, 6 pourvues ».
Celui-ci lit content/index.json (pôles, thématiques, coordonnateurs, plaidoyers),
content/bibliotheque.json et lib/content.ts (bureau), puis l'imprime avec Chromium.

  python3 scripts/build-dossier-presentation.py

Écrit public/documents/dossier-presentation-adeb-lonodji-2026.pdf, et la même copie
dans l'ancien site (/home/claude/lonodji/documents/) pour que l'import ne la remplace
pas par l'ancienne édition. À relancer après scripts/import-legacy.py.
"""
import html
import json
import re
import sys
from datetime import date
from pathlib import Path
from org import TELEPHONE  # seule source : lib/contact.ts

ROOT = Path(__file__).resolve().parent.parent
LEGACY = Path("/home/claude/lonodji")
NOM = "dossier-presentation-adeb-lonodji-2026.pdf"
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
NOMBRES = {1: "une", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six", 7: "sept", 8: "huit", 9: "neuf", 10: "dix",
           11: "onze", 12: "douze", 13: "treize", 14: "quatorze", 15: "quinze", 16: "seize", 17: "dix-sept",
           18: "dix-huit", 19: "dix-neuf", 20: "vingt", 21: "vingt et une", 22: "vingt-deux"}


def e(s: str) -> str:
    return html.escape(s, quote=False)


def vrai(v) -> bool:
    return v is True or str(v).lower() == "true"


def bureau() -> list[tuple[str, str]]:
    src = (ROOT / "lib" / "content.ts").read_text(encoding="utf-8")
    return re.findall(r'\{ role: "([^"]+)", name: "([^"]+)"', src)


def main() -> None:
    idx = json.loads((ROOT / "content" / "index.json").read_text(encoding="utf-8"))
    biblio = json.loads((ROOT / "content" / "bibliotheque.json").read_text(encoding="utf-8"))
    poles = idx["structure"]["poles"]
    cellules = idx["structure"]["cellules"]["items"]
    thematiques = [t for p in poles for t in p["items"] if t.get("kind", "thematique") == "thematique"]
    total, pourvues = len(thematiques), sum(1 for t in thematiques if vrai(t.get("filled")))
    ouvertes = total - pourvues
    plaidoyers = idx["plaidoyers"]
    envoyes = sum(1 for p in plaidoyers if p.get("sent", "").strip().lower() not in ("à envoyer", "a envoyer", ""))
    refs = len(biblio.get("references", []))
    auj = date.today()
    edition = f"{MOIS[auj.month - 1]} {auj.year}"
    jour = f"{auj.day} {MOIS[auj.month - 1]} {auj.year}"
    b = dict((r, n) for r, n in bureau())

    def pole_html(p):
        items = []
        for t in p["items"]:
            if t.get("kind", "thematique") != "thematique":
                continue
            qui = t["coordinator"].split(",")[0].strip() if vrai(t.get("filled")) else "à pourvoir"
            cls = "" if vrai(t.get("filled")) else ' class="ouvert"'
            items.append(f'<li{cls}><b>{e(t["name"])}</b> — {e(qui)}</li>')
        n = len(items)
        return (f'<div class="pole"><h3>{e(p["name"])} — {n}</h3>'
                f'<p class="dir">Direction de pôle : à pourvoir (rang de chef de projet)</p><ul>{"".join(items)}</ul></div>')

    lignes_plaidoyers = "".join(
        f'<tr><td>{e(p["title"])}</td><td>{e(p["recipients"])}</td><td>{e(p.get("sent") or "—")}</td></tr>' for p in plaidoyers)
    cell = " · ".join(f'{e(c["name"])} ({e(c["coordinator"].split(",")[0]) if vrai(c.get("filled")) else "à pourvoir"})' for c in cellules)
    bureau_txt = ", ".join(f"{e(n)} ({e(r.lower())})" for r, n in b.items() if r != "Animateur")

    page = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><title>Dossier de présentation — ADEB LONODJI</title>
<style>
@page {{ size:A4; margin:18mm 16mm 16mm; }}
@page:first {{ margin:0; }}
* {{ box-sizing:border-box; }}
body {{ font-family:"DejaVu Sans",sans-serif; font-size:8.9pt; line-height:1.45; color:#10241e; margin:0; }}
h1,h2,h3 {{ font-family:"DejaVu Serif",Georgia,serif; color:#173b8a; margin:0; }}
.couv {{ height:297mm; padding:24mm 20mm; color:#fff; background:linear-gradient(160deg,#1d4fb8 0%,#1f7fb0 55%,#18a38a 100%);
  display:flex; flex-direction:column; page-break-after:always; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.couv .sigle {{ font-weight:700; font-size:20pt; letter-spacing:.02em; }}
.couv .sous {{ font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase; opacity:.9; margin-top:4px; }}
.couv h1 {{ color:#fff; font-size:36pt; line-height:1.08; margin-top:auto; }}
.couv .chapo {{ font-size:12pt; margin:14px 0 18px; max-width:120mm; }}
.pills span {{ display:inline-block; border:1px solid rgba(255,255,255,.75); border-radius:99px; padding:3px 10px; margin:0 6px 6px 0; font-size:7.5pt; letter-spacing:.1em; text-transform:uppercase; }}
.couv .devise {{ margin-top:auto; font-size:7.5pt; letter-spacing:.2em; }}
.eyebrow {{ font-size:6.8pt; letter-spacing:.16em; text-transform:uppercase; color:#1f7fb0; margin:14px 0 4px; }}
h2 {{ font-size:15pt; margin-bottom:6px; }}
p {{ margin:0 0 7px; text-align:justify; }}
.chiffres {{ display:flex; gap:8px; margin:10px 0 4px; }}
.chiffres div {{ flex:1; background:#e9f0fb; border-radius:6px; padding:7px 9px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.chiffres b {{ display:block; font-family:"DejaVu Serif",serif; font-size:17pt; color:#173b8a; }}
.chiffres small {{ font-size:7pt; color:#3d4c6b; }}
.poles {{ display:grid; grid-template-columns:1fr 1fr; gap:6px; }}
.pole {{ border:1px solid #cfdcf0; border-radius:6px; padding:7px 9px; background:#f6f9fe; break-inside:avoid; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.pole h3 {{ font-size:9.5pt; margin-bottom:2px; }}
.pole .dir {{ font-size:7pt; color:#5a6780; margin:0 0 3px; text-align:left; }}
.pole ul {{ margin:0; padding-left:12px; font-size:7.6pt; line-height:1.32; }}
.pole li.ouvert {{ color:#8a4b00; }}
table {{ width:100%; border-collapse:collapse; font-size:7.8pt; margin:6px 0; }}
th {{ text-align:left; font-size:6.8pt; letter-spacing:.1em; text-transform:uppercase; color:#1f7fb0; border-bottom:1.5px solid #173b8a; padding:3px 4px; }}
td {{ border-bottom:1px solid #dde5f0; padding:4px; vertical-align:top; }}
.cartes {{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }}
.cartes div {{ border:1px solid #cfdcf0; border-radius:6px; padding:7px 9px; background:#f6f9fe; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.cartes h3 {{ font-size:9pt; margin-bottom:3px; }}
.cartes p {{ font-size:8pt; text-align:left; margin:0; }}
.encadre {{ border-left:3px solid #18a38a; padding:5px 10px; background:#eefaf6; font-size:8.3pt; margin:8px 0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.sources {{ font-size:7pt; color:#5a6780; }}
.saut {{ page-break-before:always; }}
footer {{ position:fixed; bottom:-9mm; left:0; right:0; text-align:center; font-size:6.8pt; color:#5a6780; }}
</style>
<body>
<section class="couv">
  <div class="sigle">ADEB LONODJI</div>
  <div class="sous">Association de Développement et d'Entraide de Bédjondo · Mandoul · Tchad</div>
  <h1>Bâtir ensemble<br>l'héritage de<br>Bédjondo</h1>
  <p class="chapo">Dossier de présentation — édition du {jour}. Qui nous sommes, ce que nous faisons, ce que nous demandons, et comment nous aider.</p>
  <div class="pills"><span>4 pôles</span><span>{total} thématiques</span><span>{pourvues} pourvues</span><span>8 dossiers de plaidoyer</span><span>{refs} références</span></div>
  <div class="devise">COURAGE · DISCIPLINE · HÉRITAGE · lonodji.org</div>
</section>


<div class="eyebrow">Qui nous sommes</div>
<h2>L'association de Bédjondo et de sa diaspora</h2>
<p>ADEB LONODJI — Association de Développement et d'Entraide de Bédjondo — rassemble Bédjondo et sa diaspora et fait vivre les valeurs, l'héritage et l'histoire du peuple bedjond, peuple d'origine de Bédjondo, chef-lieu du département du Mandoul Occidental, dans la province du Mandoul, au sud du Tchad. Composante du grand ensemble sara, le peuple bedjond vit dans les cantons de Bédjondo, Bébopen, Nderguigui et Yomi ainsi que dans la sous-préfecture de Péni, à N'Djamena et dans une diaspora nombreuse et qualifiée. Ses actions de développement servent tous les habitants de Bédjondo, sans distinction d'origine.</p>
<p>Les réflexions ont commencé en 1986 ; l'association a été reconnue officiellement en 1995 (sa mise en conformité avec l'ordonnance n° 023/PR/2018 est en vérification), a tenu un premier forum à Bédjondo en 2000, puis un second à Bébopen en décembre 2003. Après des années de mise en veille, ses membres ont engagé en 2026 sa réactivation et sa modernisation : quatre pôles, {NOMBRES.get(total, total)} thématiques d'action — {NOMBRES.get(pourvues, pourvues)} ont déjà leur coordonnateur —, deux cellules transversales, un bureau exécutif et un animateur. L'association fédère les initiatives existantes plutôt que de les concurrencer.</p>
<div class="chiffres">
  <div><b>1995</b><small>reconnaissance officielle</small></div>
  <div><b>4</b><small>pôles d'action</small></div>
  <div><b>{total}</b><small>thématiques, {pourvues} pourvues</small></div>
  <div><b>8</b><small>dossiers de plaidoyer</small></div>
</div>
<div class="eyebrow">Notre organisation</div>
<h2>Quatre pôles, {NOMBRES.get(total, total)} thématiques</h2>
<div class="poles">{"".join(pole_html(p) for p in poles)}</div>
<p style="margin-top:8px"><b>Cellules transversales :</b> {cell}. <b>Bureau exécutif :</b> {bureau_txt}. <b>Animation :</b> {e(b.get("Animateur", ""))}. Les {NOMBRES.get(ouvertes, ouvertes)} thématiques et les quatre directions de pôle encore à pourvoir sont ouvertes aux candidatures (fiches de mission : lonodji.org/programmes/fiches-de-mission).</p>

<div class="saut"></div>
<div class="eyebrow">Bédjondo aujourd'hui</div>
<h2>Un village devenu ville, sans les infrastructures d'une ville</h2>
<p>Le centre urbain de Bédjondo est passé de 4 344 habitants (recensement de 1993) à 11 086 (recensement de 2009) et dépasse très probablement 15 000 habitants aujourd'hui. Bédjondo est une commune dotée d'un maire, d'un conseil et d'un plan de développement communal. Mais la ville reste, pour l'essentiel, sans électricité, sans réseau d'eau potable, en zone blanche du haut débit, reliée à Koumra par une piste impraticable en saison des pluies, avec un centre de santé sans laboratoire et des écoles surchargées.</p>
<div class="eyebrow">Nos plaidoyers</div>
<h2>Sept plaidoyers et une note à la commune, un suivi public</h2>
<p>Chaque plaidoyer expose un constat chiffré et sourcé, ce que le changement rendrait possible, des demandes précises à des destinataires nommés, et ce que l'association s'engage à faire en retour. Ils sont publiés sur le site ; ils seront transmis officiellement après signature du bureau, et leur suivi (envoi, réponses, résultats) sera public. Au {jour} : {envoyes} transmis sur {len(plaidoyers)}.</p>
<table><thead><tr><th>Plaidoyer</th><th>Destinataires principaux</th><th>Envoi</th></tr></thead><tbody>{lignes_plaidoyers}</tbody></table>
<div class="encadre">Outils citoyens : une carte participative des besoins (signalement localité par localité), un formulaire de soutien aux plaidoyers, une campagne de mesure des débits, et un kit de mobilisation (visuels et messages) pour relayer.</div>

<div class="saut"></div>
<div class="eyebrow">Savoirs</div>
<h2>La bibliothèque bedjond et sara</h2>
<p>La base de recherche du site réunit {refs} références — thèses, ouvrages, enquêtes de terrain, articles scientifiques, données publiques — sur le peuple bedjond et l'ensemble sara : la thèse de Djarangar Djita Issa sur la langue bedjond, les travaux de Joseph Fortier, Robert Jaulin, Jean-Pierre Magnant, Bé-Rammaj Miaro-II, Rosalie Kantiebo, Josette Rivallain, l'enquête SIL de 2007, l'étude ACAREF de Masnan Beoss. L'association publie ses propres synthèses dans son journal et souhaite travailler avec les bibliothèques du Mandoul Occidental pour constituer sur place un fonds documentaire bedjond et sara.</p>
<div class="eyebrow">Comment nous aider</div>
<h2>Quatre façons de contribuer</h2>
<div class="cartes">
  <div><h3>Rejoindre</h3><p>Adhérer par la déclaration d'intention (lonodji.org/participer) ; candidater à la coordination de l'une des {NOMBRES.get(ouvertes, ouvertes)} thématiques encore à pourvoir, à une direction de pôle, ou rejoindre une thématique existante.</p></div>
  <div><h3>Donner</h3><p>La collecte est suspendue depuis le 23 septembre 2026, jusqu'à l'autorisation de l'association, au vote de la grille par l'assemblée générale et à l'ouverture d'un compte à son nom, à double signature. Ne remettez aucun argent à qui que ce soit en son nom. D'ici là, les promesses de contribution restent ouvertes, sans paiement.</p></div>
  <div><h3>Apporter ses compétences</h3><p>Urbanistes, géomètres, ingénieurs, hydrauliciens, médecins, enseignants, informaticiens : répertoire des compétences de la diaspora (lonodji.org/diaspora).</p></div>
  <div><h3>Relayer et témoigner</h3><p>Partager les plaidoyers, signaler un besoin sur la carte, mesurer son débit, confier un récit ou une photo (lonodji.org/temoignages).</p></div>
</div>
<div class="eyebrow">Contact</div>
<h2>Nous joindre</h2>
<p><b>Téléphone et WhatsApp :</b> {TELEPHONE} (Adoumbé Maoura, président, contact officiel). <b>Site :</b> lonodji.org — formulaire de contact sur la page Participer. Aucune adresse électronique n'est encore rattachée au domaine : elle sera publiée sur le site dès qu'elle fonctionnera. Les plaidoyers et documents sont libres de reproduction avec mention de l'association.</p>
<p class="sources">Sources des chiffres : INSEED (recensements 1993 et 2009, via City Population) ; Alwihda Info (session budgétaire de la commune, janv. 2026 ; cérémonie d'excellence, juil. 2025) ; Banque mondiale (accès à l'électricité, PAAET) ; Agence Ecofin (télécoms nov. 2024, électricité sept. 2025) ; ARCEP ; BAD (PAEPA SU MR) ; UNICEF Data Must Speak 2024 ; OMS ; Primature du Tchad (suivi des engagements 2024). Organisation et plaidoyers : état du site au {jour}.</p>
</body></html>"""

    sortie = ROOT / "public" / "documents" / NOM
    tmp = ROOT / ".dossier-presentation.html"
    tmp.write_text(page, encoding="utf-8")
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page()
        pg.goto(tmp.as_uri())
        pg.pdf(path=str(sortie), format="A4", print_background=True, prefer_css_page_size=True,
               display_header_footer=True, header_template="<span></span>",
               footer_template=f'<div style="width:100%;text-align:center;font-size:6.5pt;color:#5a6780;font-family:DejaVu Sans,sans-serif">ADEB LONODJI — Dossier de présentation, édition du {jour} · lonodji.org · <span class="pageNumber"></span>/<span class="totalPages"></span></div>')
        nav.close()
    tmp.unlink()
    if (LEGACY / "documents").exists():
        (LEGACY / "documents" / NOM).write_bytes(sortie.read_bytes())
    print(f"dossier de présentation : {total} thématiques, {pourvues} pourvues, {refs} références → {sortie.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
