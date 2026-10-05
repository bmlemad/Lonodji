#!/usr/bin/env python3
"""Importe le contenu de l'ancien site statique ADEB LONODJI (dossier HTML publié
le 24/09/2026) dans les modules de contenu du site Next.js.

Usage : python3 scripts/import-legacy.py /chemin/vers/ancien-site

Produit :
  content/pages/<slug>.json      pages de fond (dossiers, hubs) nettoyées, liens réécrits
  content/articles/<slug>.json   articles du journal
  content/index.json             index des pages, articles, structure, plaidoyers, documents
  public/__forms.html            déclaration statique des formulaires Netlify
  public/{documents,identite,kit,app,og}/…   ressources copiées

Le script est idempotent : il écrase les fichiers générés.
"""
import importlib.util
import json
import os
import re
import shutil
import sys
from copy import copy
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

LEGACY = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/lonodji").resolve()
ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PUBLIC = ROOT / "public"

# ----------------------------------------------------------------------------
# Carte des routes : ancien fichier -> nouvelle route
# ----------------------------------------------------------------------------
HUB_ROUTES = {
    "index": "/",
    "mission": "/mission",
    "poles": "/programmes",
    "plaidoyers": "/actions",
    "suivi": "/impact",
    "actualites": "/journal",
    "documents": "/documents",
    "contact": "/participer#contact",
    "adherer": "/participer#adherer",
    "soutenir": "/participer#soutenir",
    "redevabilite": "/transparence",
    "mentions-legales": "/mentions-legales",
    "figures": "/histoire",
    "sitemap": "/plan-du-site",
    "hors-ligne": "/hors-ligne",
    "404": "/",
    "redaction": "/",
}
# Scripts de page (outils interactifs), servis depuis public/
PAGE_SCRIPTS = {
    "trouver-ma-thematique": ["/trouver.js"],
    "genealogie-outil": ["/genealogie.js"],
}
# Pages portées telles quelles ; leur adresse vient de content/routes-dossiers.json (restructuration du 29/09/2026 :
# chaque page rejoint sa rubrique). « air-bedjondo » n’est plus importée : remplacée par la page du projet renommé.
ROUTES_DOSSIERS = json.loads((Path(__file__).resolve().parent.parent / "content" / "routes-dossiers.json").read_text(encoding="utf-8"))["routes"]
DOSSIERS = [
    "agriculteurs-eleveurs", "agriculture-securite-alimentaire", "application",
    "bedjondo", "besoins", "complexe-sportif", "decentralisation", "demarches", "drones-innovation",
    "engagements", "enquetes", "environnement", "espace-numerique", "evenements", "genealogies",
    "handicap", "identite-visuelle", "kit-mobilisation", "lieux-sacres", "odd", "ong-partenaires",
    "problematiques", "recherche", "solidarite-inclusion", "veuves",
    "trouver-ma-thematique", "genealogie-outil",
]
# Pages de fond dont les sections alimentent une page conçue
HUB_PAGES = ["mission", "poles", "plaidoyers", "suivi", "contact", "adherer", "soutenir",
             "redevabilite", "mentions-legales", "figures", "documents", "actualites"]
EN_PAGES = ["index", "about", "advocacy", "bedjondo", "contact", "themes"]

PARENTS = {
    "Nos actions": "/programmes",
    "L’association": "/mission",
    "L'association": "/mission",
    "Bédjondo & héritage": "/histoire",
    "Actualités": "/journal",
    "Agir avec nous": "/participer",
    "Le journal": "/journal",
}


def route_for(name: str, base_dir: str) -> str:
    """name : chemin relatif tel qu'écrit dans l'ancien site (sans ancre ni requête)."""
    p = name
    # normalisation du chemin par rapport au dossier de la page source
    parts = []
    for seg in (base_dir.rstrip("/").split("/") if base_dir else []) + p.split("/"):
        if seg in ("", "."):
            continue
        if seg == "..":
            if parts:
                parts.pop()
            continue
        parts.append(seg)
    p = "/".join(parts)
    if p.endswith(".pdf"):
        return "/" + p
    if re.search(r"\.(png|jpe?g|svg|webp|ico|json|xml|txt|webmanifest|css|js)$", p):
        return "/" + p
    if p.startswith("articles/"):
        slug = p[len("articles/"):].replace(".html", "")
        return "/journal/" + slug
    if p.startswith("en/"):
        n = p[3:].replace(".html", "")
        return "/en/" + ("index" if n == "" else n)
    n = p.replace(".html", "")
    if n == "":
        return "/"
    if n in HUB_ROUTES:
        return HUB_ROUTES[n]
    if n in ROUTES_DOSSIERS:
        return ROUTES_DOSSIERS[n]
    return "/dossiers/" + n


ANCHOR_MAP = {
    "/journal#formulaire-newsletter": "/participer#newsletter",
    # 30/09/2026 : l'étagère quitte la base de recherche (doublon du classement de la bibliothèque)
    "/patrimoine/base-de-recherche#shelf-title": "/bibliotheque",
}


def rewrite_href(href: str, base_dir: str) -> str:
    if not href or href.startswith(("#", "http://", "https://", "mailto:", "tel:", "sms:", "data:", "javascript:")):
        return href
    m = re.match(r"^([^?#]*)(\?[^#]*)?(#.*)?$", href)
    path, query, frag = m.group(1), m.group(2) or "", m.group(3) or ""
    if path == "":
        return href
    route = route_for(path, base_dir)
    # Une route qui porte déjà une ancre (ex. /participer#contact) garde la sienne
    if "#" in route and frag:
        route = route.split("#")[0]
        return route + query + frag
    if "#" in route:
        r, f = route.split("#", 1)
        return r + query + "#" + f
    out = route + query + frag
    return ANCHOR_MAP.get(out, out)


def rewrite_src(src: str, base_dir: str) -> str:
    if not src or src.startswith(("http://", "https://", "data:")):
        return src
    return route_for(src.split("#")[0].split("?")[0], base_dir)


# ----------------------------------------------------------------------------
# Nettoyage
# ----------------------------------------------------------------------------
REMOVE_SELECTORS = [
    'script:not([type="application/json"])', "noscript", ".crumbs", ".tri-bar", ".page-hero-visual", ".article-share",
    ".related", ".article-back", ".filter-tabs", "[data-journal-filters]", ".search-bar",
    ".journal-search", "#journal-search", ".result-count", ".share-feedback",
    ".back-to-top", ".retour-haut", "[data-share]", ".kit-actions",
]


def text(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def clean_tree(root: Tag, base_dir: str, collected_forms: dict):
    for sel in REMOVE_SELECTORS:
        for el in root.select(sel):
            el.decompose()
    for a in root.find_all("a"):
        if a.has_attr("href"):
            a["href"] = rewrite_href(a["href"], base_dir)
    for el in root.find_all(["img", "source", "video", "audio", "iframe"]):
        if el.has_attr("src"):
            el["src"] = rewrite_src(el["src"], base_dir)
        if el.has_attr("srcset"):
            el["srcset"] = ", ".join(
                (rewrite_src(part.strip().split(" ")[0], base_dir) + (" " + part.strip().split(" ")[1] if " " in part.strip() else ""))
                for part in el["srcset"].split(",") if part.strip()
            )
        if el.name == "img" and not el.has_attr("loading"):
            el["loading"] = "lazy"
    for f in root.find_all("form"):
        name = f.get("name")
        if name:
            collected_forms[name] = f
            f["action"] = "/__forms.html"
            f["method"] = "POST"
            for attr in ("data-local-form", "data-netlify", "netlify-honeypot", "netlify"):
                if f.has_attr(attr):
                    del f[attr]
            # remplace le libellé d'accord (adresse chez Netlify) : inchangé, conforme aux mentions
            marquer_obligatoires(f, root)
            for champ in f.find_all("input", attrs={"name": "nom"}):
                if not champ.has_attr("autocomplete"):
                    champ["autocomplete"] = "name"
        else:
            # outil local (cahier généalogique) : les noms saisis sont ceux des ancêtres, pas de l'utilisateur
            for champ in f.find_all("input"):
                if champ.get("type", "text") == "text" and not champ.has_attr("autocomplete"):
                    champ["autocomplete"] = "off"
        # les formulaires sans nom sont des outils locaux (cahier généalogique) : conservés tels quels
    # les attributs `style` avec variables ODD sont conservés ; on retire les data-* d'interactivité inutiles
    for el in root.find_all(True):
        for attr in list(el.attrs):
            if attr in ("data-search", "data-need-loc", "data-plea"):
                del el[attr]


def marquer_obligatoires(form: Tag, root: Tag) -> None:
    """Une seule convention pour les champs obligatoires : un astérisque après le libellé, expliqué en tête."""
    soup = form
    while soup.parent is not None:
        soup = soup.parent
    marques = 0
    for champ in form.find_all(["input", "textarea", "select"]):
        if not champ.has_attr("required") or champ.get("type") in ("hidden", "submit"):
            continue
        lab = None
        if champ.get("id"):
            lab = form.find("label", attrs={"for": champ["id"]}) or root.find("label", attrs={"for": champ["id"]})
        if lab is None:
            lab = champ.find_parent("label")
        if lab is None or "*" in lab.get_text() or lab.find(class_="requis"):
            marques += 1 if lab is not None else 0
            continue
        etoile = soup.new_tag("span", attrs={"class": "requis", "aria-hidden": "true"})
        etoile.string = " *"
        cible = lab.find("span") if champ.get("type") in ("checkbox", "radio") and lab.find("span") else lab
        if cible is lab and champ.find_parent("label") is lab:
            # libellé qui englobe le champ : l'astérisque suit le texte, avant le champ
            premier_texte = next((c for c in lab.contents if isinstance(c, NavigableString) and c.strip()), None)
            if premier_texte is not None:
                premier_texte.insert_after(etoile)
            else:
                lab.append(etoile)
        else:
            cible.append(etoile)
        marques += 1
    if marques and not form.find(class_="form-requis"):
        note = soup.new_tag("p", attrs={"class": "form-requis"})
        note.append("Les champs marqués ")
        e = soup.new_tag("span", attrs={"class": "requis", "aria-hidden": "true"})
        e.string = "*"
        note.append(e)
        note.append(" sont obligatoires." if form.find_parent(attrs={"lang": "en"}) is None and "lang=\"en\"" not in str(root)[:400] else "")
        if note.get_text().endswith("*"):
            note.clear()
            note.append("Fields marked ")
            e2 = soup.new_tag("span", attrs={"class": "requis", "aria-hidden": "true"})
            e2.string = "*"
            note.append(e2)
            note.append(" are required.")
        form.insert(0, note)


def inner_html(el: Tag) -> str:
    return "".join(str(c) for c in el.contents).strip()


def unwrap_wrap(section: Tag) -> str:
    """Renvoie le HTML interne d'une section en retirant l'enveloppe .wrap."""
    wraps = [c for c in section.find_all(recursive=False) if isinstance(c, Tag) and "wrap" in (c.get("class") or [])]
    if len(wraps) == 1 and len([c for c in section.find_all(recursive=False) if isinstance(c, Tag)]) == 1:
        w = wraps[0]
        classes = [k for k in (w.get("class") or []) if k != "wrap"]
        if classes:
            w["class"] = classes
            return str(w)
        return inner_html(w)
    return inner_html(section)


# Allègement du 30/09/2026 : les longs tableaux de détail sont repliés (details.plier) sous un titre qui dit
# ce qu'ils contiennent ; une ancre qui vise une ligne ouvre le bloc (components/ouvrir-ancre.tsx).
# fichier de l'ancien site → [(sélecteur du bloc, titre, sous-titre)]
PLIER_BLOCS = {
    "problematiques.html": [(".table-wrap:has(> table.indic-table)", "Le tableau détaillé, domaine par domaine",
                             "34 lignes : constat, thématique, état de la connaissance, qui décide")],
    "plaidoyers.html": [(".table-wrap:has(> table.indic-table)", "Les indicateurs, dossier par dossier",
                         "22 indicateurs : valeur de départ, cible, échéance, moyen de vérification")],
}


def plier_sources(main: Tag) -> None:
    """Base de recherche : la présentation de chaque source se replie sous « Ce que contient cette source »."""
    for carte in main.select("article.source-card"):
        paras = [c for c in carte.find_all("p", recursive=False) if "source-meta" not in (c.get("class") or [])]
        if not paras or sum(len(text(x)) for x in paras) < 160:
            continue
        soup = BeautifulSoup("", "lxml")
        det = soup.new_tag("details", attrs={"class": "source-plus"})
        summ = soup.new_tag("summary")
        summ.string = "Ce que contient cette source"
        paras[0].insert_before(det)
        det.append(summ)
        for x in paras:
            det.append(x.extract())


def dedoublonner_recherche(main: Tag) -> None:
    """Base de recherche (30/09/2026) : les 40 références y figuraient deux fois (l'étagère de couvertures, puis
    les fiches), et une troisième sur la bibliothèque. La base garde les fiches ; l'étagère devient un renvoi
    vers la bibliothèque, qui range les mêmes références par type."""
    h = main.select_one("#shelf-title")
    sec = h.find_parent("section") if h else None
    if sec:
        wrap = sec.select_one(".wrap") or sec
        wrap.clear()
        wrap.append(BeautifulSoup(
            '<div class="section-head"><div><div class="eyebrow">La bibliothèque</div>'
            '<h2 id="shelf-title">Les mêmes références, rangées par type</h2>'
            '<p class="lede">Thèses, articles, ouvrages, rapports et archives, avec les publications de l’association, '
            'les chercheurs du pays bedjond et le dépôt d’un document : <a href="/bibliotheque">la bibliothèque</a>. '
            'Ici, chaque référence a sa fiche complète et sa citation à copier ; cherchez par titre, auteur ou mot-clé, '
            'ou filtrez par catégorie.</p></div></div>', "lxml").find("div"))
        sec["class"] = [c for c in (sec.get("class") or []) if c != "shelf-section"]


def plier_blocs(main: Tag, nom: str) -> None:
    if nom == "recherche.html":
        dedoublonner_recherche(main)
        plier_sources(main)
    for sel, titre, sous in PLIER_BLOCS.get(nom, []):
        for el in main.select(sel):
            soup = BeautifulSoup("", "lxml")
            det = soup.new_tag("details", attrs={"class": "plier plier--tableau"})
            summ = soup.new_tag("summary")
            st = soup.new_tag("strong"); st.string = titre
            sp = soup.new_tag("span"); sp.string = sous
            summ.append(st); summ.append(sp)
            el.wrap(det)
            det.insert(0, summ)


def parse_page(path: Path):
    html = lire_source(path)
    soup = BeautifulSoup(html, "lxml")
    base_dir = str(path.parent.relative_to(LEGACY)).replace(".", "")
    main = soup.find("main")
    head = soup.find("head")
    root_attrs = {k: v for k, v in main.attrs.items() if k.startswith("data-")}
    meta_desc = head.find("meta", attrs={"name": "description"})
    title_tag = head.find("title")
    forms = {}
    data = {
        "legacy": str(path.relative_to(LEGACY)),
        "lang": soup.html.get("lang", "fr") if soup.html else "fr",
        "documentTitle": text(title_tag),
        "description": (meta_desc.get("content") if meta_desc else "").strip(),
    }
    hero = main.select_one(".page-hero")
    if hero:
        crumbs = [text(li) for li in hero.select(".crumbs li")]
        eyebrow = hero.select_one(".eyebrow")
        h1 = hero.find("h1")
        lede = hero.select_one(".lede")
        pills = [text(p) for p in hero.select(".hero-pill")]
        kicker = hero.select_one(".hero-tile-kicker")
        meta = hero.select_one(".article-meta")
        art = {}
        if meta:
            t = meta.find("time")
            art["date"] = t.get("datetime") if t else ""
            art["dateLabel"] = text(t)
            rt = meta.select_one(".read-time")
            art["readTime"] = text(rt)
            by = meta.select_one(".article-byline")
            art["byline"] = text(by)
            tag = meta.select_one(".news-tag")
            art["tag"] = text(tag)
        data.update({
            "title": text(h1),
            "eyebrow": text(eyebrow),
            "lede": text(lede),
            "pills": pills,
            "kicker": text(kicker),
            "crumbs": crumbs,
            "parent": crumbs[-2] if len(crumbs) >= 2 else "",
            **art,
        })
        hero.decompose()
    else:
        h1 = main.find("h1")
        data.update({"title": text(h1), "eyebrow": "", "lede": "", "pills": [], "crumbs": [], "parent": ""})
    resume = main.select_one(".resume")
    if resume:
        data["resume"] = [text(li) for li in resume.select("li")]
        resume.decompose()
    sommaire = main.select_one("nav.sommaire, .sommaire")
    if sommaire:
        data["toc"] = [{"href": a.get("href", ""), "label": text(a)} for a in sommaire.select("a")]
        sommaire.decompose()
    # Article : corps
    body = main.select_one(".article-body")
    sections = []
    if body:
        clean_tree(main, base_dir, forms)
        plier_blocs(main, path.name)  # après la réécriture des liens : les liens ajoutés sont déjà des routes
        for child in [c for c in main.find_all(recursive=False) if isinstance(c, Tag)]:
            cls = child.get("class") or []
            if child.select_one(".article-body"):
                b = child.select_one(".article-body")
                classes = [k for k in (b.get("class") or []) if k not in ("wrap", "article-body")]
                sections.append({"id": "", "alt": False, "cls": " ".join(classes), "tag": "section", "html": inner_html(b)})
            elif child.name in ("section", "div", "aside", "figure") and "related" not in cls and text(child):
                sections.append({"id": child.get("id", "") or "", "alt": "alt" in cls, "cls": " ".join(k for k in cls if k != "alt"), "tag": child.name, "html": unwrap_wrap(child)})
    else:
        clean_tree(main, base_dir, forms)
        plier_blocs(main, path.name)  # après la réécriture des liens : les liens ajoutés sont déjà des routes
        for child in [c for c in main.find_all(recursive=False) if isinstance(c, Tag)]:
            cls = child.get("class") or []
            if child.name in ("section", "div", "nav", "aside", "figure", "article"):
                html_inner = unwrap_wrap(child)
                if not text(child) and not child.find(["img", "svg", "form"]):
                    continue
                sections.append({
                    "id": child.get("id", "") or "",
                    "alt": "alt" in cls,
                    "cls": " ".join(k for k in cls if k not in ("alt",)),
                    "tag": child.name,
                    "html": html_inner,
                })
    for sec in sections:
        sec["html"] = apply_updates(sec["html"])
    data["sections"] = sections
    plain = " ".join(re.sub(r"<[^>]+>", " ", s["html"]) for s in sections)
    data["words"] = len(plain.split())
    data["forms"] = sorted(forms.keys())
    data["hasMap"] = any("data-geo" in s["html"] for s in sections)
    data["scripts"] = PAGE_SCRIPTS.get(path.stem, []) if base_dir == "" else []
    data["rootAttrs"] = {k: (v if isinstance(v, str) else " ".join(v)) for k, v in root_attrs.items()}
    return data, forms


# ----------------------------------------------------------------------------
# Données structurées des hubs
# ----------------------------------------------------------------------------
ROMAN = {"pole-1": "I", "pole-2": "II", "pole-3": "III", "pole-4": "IV", "pole-5": "V", "pole-6": "VI"}   # pôles V et VI : 01/10/2026


# Direction des pôles (décision du 28/09/2026) : chaque pôle est dirigé par un directeur
# ou une directrice de pôle, au rang de chef de projet (project manager), qui anime les
# coordonnateurs de ses thématiques, tient le plan d'action et le calendrier, et rend
# compte au bureau. Nommer quelqu'un : DIRECTIONS_POLES["pole-2"] = "Prénom Nom, qualité".
# 30/09/2026 : direction du pôle I confiée au Dr Bé-Rammaj Miaro-II (qui laisse la coordination de Mémoire & héritage
# à Félix Mbété Nangmbatnan) ;
# direction du pôle II (Développement humain & moyens d'existence) confiée à Franco Joseph Ngarlena.
# 01/10/2026 (registre 2026-31) : les directions de pôle deviennent des vice-présidences déléguées, pourvues par
# élection ; les deux titulaires gardent leur fonction. Le pôle II est scindé : le pôle II (Services essentiels) garde
# sa vice-présidence, le pôle V (Économie, territoire & risques) est à pourvoir.
DIRECTIONS_POLES: dict[str, str | None] = {"pole-1": "Dr Bé-Rammaj Miaro-II", "pole-2": "Franco Joseph Ngarlena", "pole-3": None, "pole-4": None, "pole-5": None, "pole-6": None}
DIRECTION_LABEL = "Vice-président délégué ou vice-présidente déléguée du pôle"
DIRECTION_RANG = "vice-présidence déléguée"


def structure(soup_poles: BeautifulSoup, base_dir="") -> dict:
    main = soup_poles.find("main")
    poles, cellules = [], []
    for sec in main.find_all("section", recursive=False):
        if "pole-group" not in (sec.get("class") or []):
            continue
        h2 = sec.find("h2")
        eyebrow = text(sec.select_one(".eyebrow"))
        intro_p = sec.select_one(".section-head p, .pole-intro, .section-head + p")
        intro = ""
        sh = sec.select_one(".section-head")
        if sh:
            ps = sh.find_all("p")
            intro = " ".join(text(p) for p in ps if "eyebrow" not in (p.get("class") or []))
        cards = []
        for c in sec.select(".pole-card"):
            num = text(c.select_one(".pole-num"))
            status = text(c.select_one(".pole-status"))
            coord = text(c.select_one(".coord"))
            desc_p = None
            for p in c.find_all("p", recursive=False):
                if "coord" in (p.get("class") or []):
                    continue
                desc_p = p
                break
            desc_html = ""
            if desc_p:
                dp = copy(desc_p)
                for a in dp.find_all("a"):
                    a["href"] = rewrite_href(a.get("href", ""), base_dir)
                desc_html = inner_html(dp)
            tags = [text(t) for t in c.select(".pole-tags .tag")]
            odd = []
            for chip in c.select(".odd-chip"):
                odd.append({
                    "num": text(chip.select_one(".odd-num")),
                    "name": text(chip.select_one(".odd-name")),
                    "cible": text(chip.select_one(".odd-cible")),
                    "title": chip.get("title", ""),
                    "accent": (re.search(r"--odd-accent:(#[0-9A-Fa-f]{6})", chip.get("style", "")) or [None, ""])[1],
                    "ink": (re.search(r"--odd-ink:(#[0-9A-Fa-f]{6})", chip.get("style", "")) or [None, ""])[1],
                })
            links = [{"label": text(a), "href": rewrite_href(a.get("href", ""), base_dir)} for a in c.select(".pole-hub-links a")]
            m = re.search(r"(\d+)", num)
            cards.append({
                "id": c.get("id", ""),
                "number": m.group(1) if m else "",
                "kind": "cellule" if "CELLULE" in num.upper() else "thematique",
                "name": text(c.find("h3")),
                "status": status,
                "filled": status.lower().startswith("pourvu"),
                "coordinator": re.sub(r"^Coordonn(?:ateur|atrice)\s*:\s*", "", coord),
                "coordinatorLabel": coord.split(":")[0].strip() if ":" in coord else "",
                "description": desc_html,
                "descriptionText": text(desc_p) if desc_p else "",
                "tags": tags,
                "odd": odd,
                "links": links,
            })
        entry = {"id": sec.get("id", ""), "roman": ROMAN.get(sec.get("id", ""), ""), "eyebrow": eyebrow,
                 "name": text(h2), "intro": intro, "items": cards}
        if sec.get("id", "") in DIRECTIONS_POLES:
            qui = DIRECTIONS_POLES[sec.get("id", "")]
            entry["direction"] = {"label": DIRECTION_LABEL, "rang": DIRECTION_RANG, "name": qui or "à pourvoir", "filled": bool(qui)}
        if sec.get("id") == "cellules":
            cellules = entry
        else:
            poles.append(entry)
    return {"poles": poles, "cellules": cellules}


def plaidoyers(soup_plea: BeautifulSoup) -> list:
    out = []
    for c in soup_plea.select(".plea-card"):
        h3 = c.find("h3")
        a = h3.find("a") if h3 else None
        meta = {}
        for div in c.select(".plea-meta > div"):
            dt, dd = div.find("dt"), div.find("dd")
            if dt and dd:
                meta[text(dt)] = text(dd)
        pdf = c.select_one('a[href$=".pdf"]')
        theme = c.select_one(".plea-theme")
        out.append({
            "id": c.get("id", ""),
            "title": text(h3),
            "href": rewrite_href(a.get("href", ""), "") if a else "",
            "theme": text(theme),
            "themeHref": rewrite_href(theme.get("href", ""), "") if theme else "",
            "status": text(c.select_one(".plea-status")),
            "demand": text(c.select_one(".plea-demande")),
            "recipients": meta.get("Destinataires", ""),
            "published": meta.get("Publié", ""),
            "sent": meta.get("Envoyé", ""),
            "answer": meta.get("Réponse", ""),
            "pdf": rewrite_href(pdf.get("href", ""), "") if pdf else "",
        })
    return out


def documents(soup_docs: BeautifulSoup) -> list:
    out = []
    for c in soup_docs.select(".pole-card"):
        pdf = c.select_one('a[href$=".pdf"]')
        links = [{"label": text(a), "href": rewrite_href(a.get("href", ""), "")} for a in c.select("a") if not a.get("href", "").endswith(".pdf")]
        desc = ""
        for p in c.find_all("p"):
            if "coord" in (p.get("class") or []):
                continue
            desc = text(p)
            break
        out.append({
            "title": text(c.find("h3")),
            "status": text(c.select_one(".pole-status")),
            "meta": text(c.select_one(".coord")),
            "description": desc,
            "pdf": rewrite_href(pdf.get("href", ""), "") if pdf else "",
            "links": links,
        })
    return out


def history(soup_mission: BeautifulSoup) -> list:
    out = []
    for h in soup_mission.select(".history-item"):
        out.append({
            "year": text(h.select_one(".history-year")),
            "title": text(h.find(["h3", "h4"])),
            "text": text(h.find("p")),
        })
    return out


def journal_categories(soup_news: BeautifulSoup) -> tuple:
    cats = []
    for b in soup_news.select(".filter-tab"):
        cats.append({"slug": b.get("data-cat", ""), "label": text(b)})
    by_slug = {}
    for c in soup_news.select(".news-card"):
        a = c.select_one("h3 a")
        if not a:
            continue
        slug = a.get("href", "").split("/")[-1].replace(".html", "")
        by_slug[slug] = {
            "category": c.get("data-cat", ""),
            "summary": text(c.select_one(".news-body > p")),
            "tag": text(c.select_one(".news-tag")),
        }
    return cats, by_slug


# ----------------------------------------------------------------------------
# Formulaires Netlify : fichier statique de déclaration
# ----------------------------------------------------------------------------

# Répertoire des compétences de la diaspora (app/diaspora/page.tsx) : déclaré ici pour
# que public/__forms.html le garde à chaque import. Les cases à cocher ont chacune
# leur nom (domaine-*, offre-*) : Netlify ne fusionne pas les valeurs multiples.
FORMULAIRES_SITE = {
    # 02/10/2026 : demande de mise à jour du site (/participer/mise-a-jour), lien dans le pied de chaque page
    "demande-mise-a-jour": (
        '<form name="demande-mise-a-jour"><input type="hidden" name="_honey"><input type="text" name="page">'
        '<select name="type"><option value="">Choisir</option><option value="Une erreur à corriger : un fait, un nom, une date, un chiffre">Une erreur à corriger : un fait, un nom, une date, un chiffre</option>'
        '<option value="Une information nouvelle à publier">Une information nouvelle à publier</option>'
        '<option value="La mise à jour d’une thématique, d’une fiche ou d’une page que je suis">La mise à jour d’une thématique, d’une fiche ou d’une page que je suis</option>'
        '<option value="Un lien ou une page qui ne fonctionne pas">Un lien ou une page qui ne fonctionne pas</option><option value="Autre">Autre</option></select>'
        '<textarea name="texte_actuel"></textarea><textarea name="demande"></textarea><input type="text" name="source">'
        '<input type="text" name="nom"><input type="text" name="qualite"><input type="text" name="contact">'
        '<input type="checkbox" name="citer"><input type="checkbox" name="consentement"></form>'
    ),
    # 02/10/2026 : recensement des membres (compte rendu du bureau du 18 septembre 2026, phase 1), /participer/recensement
    "recensement-membres": (
        '<form name="recensement-membres"><input type="hidden" name="_honey"><input type="text" name="nom">'
        '<select name="tranche_age"><option value="">Choisir</option><option value="Moins de 18 ans">Moins de 18 ans</option><option value="18 à 35 ans">18 à 35 ans</option>'
        '<option value="36 à 60 ans">36 à 60 ans</option><option value="Plus de 60 ans">Plus de 60 ans</option></select>'
        '<input type="text" name="parent_tuteur"><input type="tel" name="telephone"><input type="email" name="email">'
        '<select name="residence"><option value="">Choisir</option><option value="À Bédjondo ou dans ses cantons">À Bédjondo ou dans ses cantons</option>'
        '<option value="Ailleurs au Tchad">Ailleurs au Tchad</option><option value="Hors du Tchad">Hors du Tchad</option></select>'
        '<input type="text" name="ville"><input type="text" name="origine">'
        '<select name="statut"><option value="">Choisir</option><option value="Membre de l’association (adhérent, ancien ou actuel)">Membre de l’association (adhérent, ancien ou actuel)</option>'
        '<option value="Pas encore membre : je veux adhérer">Pas encore membre : je veux adhérer</option><option value="Sympathisant, sans adhérer pour l’instant">Sympathisant, sans adhérer pour l’instant</option></select>'
        '<input type="text" name="membre_depuis"><input type="text" name="metier"><input type="text" name="thematique"><textarea name="message"></textarea>'
        '<input type="checkbox" name="contact_ok"><input type="checkbox" name="consentement"></form>'
    ),
    "temoignage": (
        '<form name="temoignage"><input type="hidden" name="_honey">'
        '<select name="type"><option value="">Choisir</option><option value="Un ancien ou une ancienne raconte">Un ancien ou une ancienne raconte</option>'
        '<option value="Une femme qui fait bouger les choses">Une femme qui fait bouger les choses</option><option value="Un jeune talent">Un jeune talent</option>'
        '<option value="Une histoire de Bédjondo : un lieu, un événement, une tradition">Une histoire de Bédjondo : un lieu, un événement, une tradition</option>'
        '<option value="Un retour au pays, une vie de diaspora">Un retour au pays, une vie de diaspora</option>'
        '<option value="Une photo ou une série de photos, avec leur histoire">Une photo ou une série de photos, avec leur histoire</option><option value="Autre">Autre</option></select>'
        '<input type="text" name="titre"><textarea name="recit"></textarea><input type="file" name="fichier"><input type="text" name="lieu">'
        '<input type="text" name="nom"><input type="text" name="qualite"><input type="text" name="contact"><input type="text" name="localite">'
        '<select name="publication"><option value="">Choisir</option><option value="Publiable, avec mon nom">Publiable, avec mon nom</option>'
        '<option value="Publiable, sans mon nom">Publiable, sans mon nom</option><option value="Pour les archives de l’association seulement, sans publication">Pour les archives de l’association seulement, sans publication</option></select>'
        '<input type="checkbox" name="personnes"><input type="checkbox" name="mineurs"><input type="checkbox" name="consentement"></form>'
    ),
    "depot-document": (
        '<form name="depot-document"><input type="hidden" name="_honey"><input type="text" name="titre"><input type="text" name="auteurs"><input type="text" name="annee">'
        '<select name="type"><option value="">Choisir</option><option value="Thèse ou mémoire">Thèse ou mémoire</option><option value="Article ou étude scientifique">Article ou étude scientifique</option>'
        '<option value="Ouvrage, lexique ou recueil">Ouvrage, lexique ou recueil</option><option value="Rapport d’enquête, données, source institutionnelle">Rapport d’enquête, données, source institutionnelle</option>'
        '<option value="Archive, document historique, coupure de presse">Archive, document historique, coupure de presse</option><option value="Publication d’ADEB LONODJI ou d’une association bedjond">Publication d’ADEB LONODJI ou d’une association bedjond</option><option value="Autre">Autre</option></select>'
        '<input type="text" name="langue"><textarea name="resume"></textarea><input type="url" name="lien"><input type="file" name="fichier">'
        '<select name="droits"><option value="">Choisir</option><option value="Je suis l’auteur·e">Je suis l’auteur·e</option><option value="J’ai l’accord de l’auteur·e ou de l’éditeur">J’ai l’accord de l’auteur·e ou de l’éditeur</option><option value="Document public ou libre de droits">Document public ou libre de droits</option><option value="Je ne sais pas : à vérifier avec vous">Je ne sais pas : à vérifier avec vous</option></select>'
        '<select name="publication"><option value="">Choisir</option><option value="Publier le fichier en ligne dans la bibliothèque">Publier le fichier en ligne dans la bibliothèque</option><option value="Référencer seulement (titre, auteur, résumé), sans le fichier">Référencer seulement (titre, auteur, résumé), sans le fichier</option><option value="Le garder dans les archives de l’association, sans publication">Le garder dans les archives de l’association, sans publication</option></select>'
        '<input type="text" name="nom"><input type="text" name="contact"><textarea name="message"></textarea><input type="checkbox" name="consentement"></form>'
    ),
    "mot-nangnda": (
        '<form name="mot-nangnda"><input type="hidden" name="_honey"><input type="text" name="mot">'
        '<select name="categorie"><option value="">Choisir</option><option value="Un mot (nom, verbe, adjectif…)">Un mot (nom, verbe, adjectif…)</option><option value="Une expression">Une expression</option><option value="Un proverbe">Un proverbe</option>'
        '<option value="Une salutation, une formule de politesse">Une salutation, une formule de politesse</option><option value="Un nombre, une mesure, un temps">Un nombre, une mesure, un temps</option><option value="Un nom de lieu, de plante, d’animal, d’objet">Un nom de lieu, de plante, d’animal, d’objet</option><option value="Autre">Autre</option></select>'
        '<input type="text" name="sens"><input type="text" name="exemple"><input type="text" name="traduction"><input type="file" name="audio"><input type="text" name="variante"><input type="text" name="source">'
        '<input type="text" name="nom"><input type="text" name="contact"><select name="publication"><option value="">Choisir</option><option value="Publiable, avec mon nom comme contributeur">Publiable, avec mon nom comme contributeur</option><option value="Publiable, sans mon nom">Publiable, sans mon nom</option></select>'
        '<input type="checkbox" name="consentement"></form>'
    ),
    "proposition-projet": (
        '<form name="proposition-projet"><input type="hidden" name="_honey"><input type="text" name="projet"><input type="text" name="localite">'
        '<select name="domaine"><option value="">Choisir</option>' + "".join(f'<option value="{d}">{d}</option>' for d in ("Eau", "Électricité, énergie", "École, formation", "Santé", "Routes, ponts, transport", "Internet, réseau", "Agriculture, élevage", "Culture, patrimoine, langue", "Jeunesse, sport", "Autre")) + '</select>'
        '<textarea name="probleme"></textarea><textarea name="solution"></textarea><input type="text" name="cout"><input type="text" name="nom"><input type="text" name="qualite"><input type="text" name="contact">'
        '<select name="publication"><option value="">Choisir</option><option value="Il peut être publié ici avec mon nom comme proposant·e">Il peut être publié ici avec mon nom comme proposant·e</option><option value="Il peut être publié ici, sans mon nom">Il peut être publié ici, sans mon nom</option><option value="Il reste dans les échanges avec la thématique, sans publication">Il reste dans les échanges avec la thématique, sans publication</option></select>'
        '<input type="checkbox" name="consentement"></form>'
    ),
    "diaspora-competences": (
        '<form name="diaspora-competences"><input type="hidden" name="_honey">'
        '<input type="text" name="nom"><input type="email" name="email"><input type="text" name="telephone">'
        '<input type="text" name="pays"><input type="text" name="ville">'
        '<select name="lien"><option value="">Choisir</option><option value="Originaire de Bédjondo">Originaire de Bédjondo</option>'
        '<option value="Famille bedjond, autre canton">Famille bedjond, autre canton</option><option value="Conjoint·e, ami·e, allié·e">Conjoint·e, ami·e, allié·e</option>'
        '<option value="Autre">Autre</option></select>'
        '<input type="text" name="metier">'
        + "".join(f'<input type="checkbox" name="domaine-{d}">' for d in ("sante", "education", "ingenierie", "droit", "entreprise", "numerique", "agriculture", "communication", "administration", "autre"))
        + '<select name="experience"><option value="">Choisir</option><option value="Moins de 3 ans">Moins de 3 ans</option><option value="3 à 10 ans">3 à 10 ans</option><option value="Plus de 10 ans">Plus de 10 ans</option></select>'
        + "".join(f'<input type="checkbox" name="offre-{o}">' for o in ("conseil", "mentorat", "mission", "formation", "reseau", "financement"))
        + '<input type="text" name="thematique"><input type="text" name="langues">'
        '<select name="disponibilite"><option value="">Choisir</option><option value="Quelques heures par mois">Quelques heures par mois</option><option value="Une journée par mois">Une journée par mois</option><option value="Ponctuellement, sur demande">Ponctuellement, sur demande</option><option value="Une mission de plusieurs semaines sur place">Une mission de plusieurs semaines sur place</option></select>'
        '<textarea name="message"></textarea><input type="checkbox" name="consentement"><input type="checkbox" name="annuaire"></form>'
    ),
}


def forms_html(all_forms: dict) -> str:
    parts = ["<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
             "<title>Merci — ADEB LONODJI</title>",
             "<meta name=\"robots\" content=\"noindex\">"
             "<style>body{margin:0;font:17px/1.6 system-ui,sans-serif;color:#10241e;background:#f4f6f1}"
             "main{max-width:560px;margin:12vh auto;padding:0 20px}h1{font-size:30px;line-height:1.15;margin:0 0 12px}"
             "a{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:99px;background:#173b2d;color:#fff;text-decoration:none;font-weight:600;margin:8px 8px 0 0}"
             "a.second{background:#fff;color:#173b2d;border:1px solid rgba(16,36,30,.2)}form{display:none}</style></head><body>",
             # page affichée si un formulaire est envoyé sans JavaScript (l'action des formulaires pointe ici)
             "<main><h1>Merci, votre envoi est bien parti.</h1>"
             "<p>Si vous avez laissé un moyen de vous joindre, vous recevrez un accusé de réception sous 48 heures ouvrées. "
             "<span lang=\"en\">Thank you, your message has been sent.</span></p>"
             "<p><a href=\"/\">Retour au site</a><a class=\"second\" href=\"https://wa.me/23566299403\">WhatsApp</a></p></main>",
             "<!-- Déclaration statique des formulaires pour Netlify Forms (site Next.js). Généré par scripts/import-legacy.py -->"]
    for name in sorted(all_forms):
        f = all_forms[name]
        fields = []
        seen = set()
        for el in f.find_all(["input", "textarea", "select"]):
            n = el.get("name")
            if not n or n in seen or n == "form-name":
                continue
            seen.add(n)
            t = el.get("type", "text") if el.name == "input" else el.name
            if el.name == "select":
                opts = "".join(f"<option value=\"{o.get('value', text(o))}\">{text(o)}</option>" for o in el.find_all("option"))
                fields.append(f"<select name=\"{n}\">{opts}</select>")
            elif el.name == "textarea":
                fields.append(f"<textarea name=\"{n}\"></textarea>")
            else:
                if t in ("submit", "button", "reset"):
                    continue
                t = "hidden" if n == "_honey" else t
                fields.append(f"<input type=\"{t}\" name=\"{n}\">")
        parts.append(f"<form name=\"{name}\" method=\"POST\" data-netlify=\"true\" netlify-honeypot=\"_honey\">"
                     f"<input type=\"hidden\" name=\"form-name\" value=\"{name}\">" + "".join(fields) + "</form>")
    parts.append("</body></html>")
    return "\n".join(parts)


# ----------------------------------------------------------------------------
# Mises à jour éditoriales postérieures au 24/09/2026 (faits devenus inexacts)
# ----------------------------------------------------------------------------
UPDATES = [
    # 28/09/2026 au soir : nouveau logo « Les Pas vers l'Avenir » ; la page d'identité précédente reçoit une note datée.
    ('<div class="eyebrow">Le logo</div>\n<h2>Un cercle, deux pas, deux mains</h2>',
     '<p class="form-note"><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> l’association a adopté un nouveau logo, «\u00a0Les Pas vers l’Avenir\u00a0» — trois empreintes qui avancent vers un soleil levant —, commun à l’association et à son projet ODEB LONODJI\u00a0: voir <a href="/odeb/identite">l’identité visuelle</a>. Cette page décrit l’identité précédente (logo bleu, couleurs, signes), qui reste celle des documents publiés avant cette date.</p>\n<div class="eyebrow">Le logo</div>\n<h2>Un cercle, deux pas, deux mains</h2>'),
    # Le domaine lonodji.org est en service depuis le 27/09/2026 ; les adresses e-mail ne le sont pas encore.
    ("Le nom de domaine lonodji.org, que nous annoncions, n’est pas enregistré à ce jour\u00a0: les adresses qui y étaient rattachées ne reçoivent rien. Nous publierons ici les nouvelles adresses dès qu’elles fonctionneront.",
     "Le nom de domaine lonodji.org est en service depuis le 27 septembre 2026, mais aucune adresse électronique n’y est encore rattachée. Nous publierons ici les adresses dès qu’elles fonctionneront."),
    ("Le nom de domaine lonodji.org, que nous annoncions comme réservé, n’est pas enregistré à ce jour, et les adresses qui y étaient rattachées ne reçoivent rien\u00a0: nous publierons les nouvelles adresses ici dès qu’elles fonctionneront.",
     "Le nom de domaine lonodji.org héberge le site depuis le 27 septembre 2026, mais aucune adresse électronique n’y est encore rattachée\u00a0: nous publierons les adresses ici dès qu’elles fonctionneront."),
    # Projet d'application : la réserve sur l'aperçu partagé n'a plus lieu d'être ; l'état des applis du 24/09 est daté.
    ('<p class="form-note">Une réserve d’honnêteté\xa0: sur l’aperçu actuel du site, l’installation hors ligne est <strong>volontairement désactivée</strong>. Le site y est servi depuis un domaine partagé avec d’autres\xa0; y installer un cache serait s’approprier un espace qui n’est pas le nôtre, et l’aperçu doit montrer exactement le fichier publié. La lecture hors ligne s’activera d’elle-même le jour où le site vivra sur le nom de domaine de l’association — qui reste à acquérir.</p>',
     '<p class="form-note"><strong>Mise à jour du 28 septembre 2026\xa0:</strong> le site vit sur lonodji.org depuis le 27 septembre, et la lecture hors ligne y est active. Une première version d’essai de l’application Android (1.0.0) et le projet de l’application iPhone ont été préparés le 24 septembre 2026\xa0; leur publication sur Google Play et sur l’App Store attend, comme cette page le prévoit, le récépissé de l’association et l’ouverture des comptes en son nom.</p>\n<p class="form-note"><strong>Mise à jour du 1er octobre 2026\xa0:</strong> une version d’essai Android 1.0.1, datée du 28 septembre 2026, est en ligne pour être testée\xa0; voir <a href="/projets">la plateforme de projets</a>. La publication sur les boutiques attend toujours les mêmes conditions.</p>'),
    # Plaidoyers : lettres de transmission préparées le 24/09, en attente de signature (note datée).
    ('<p class="form-note">Statuts\xa0: <span class="plea-status st-publie">Publié</span> le texte est en ligne · <span class="plea-status st-envoye">Envoyé</span> transmis officiellement aux destinataires · <span class="plea-status st-reponse">Réponse reçue</span> une réponse écrite est arrivée et publiée · <span class="plea-status st-obtenu">Obtenu</span> une décision ou un chantier concret a suivi. Cette page est mise à jour à chaque étape.</p>',
     '<p class="form-note">Statuts\xa0: <span class="plea-status st-publie">Publié</span> le texte est en ligne · <span class="plea-status st-envoye">Envoyé</span> transmis officiellement aux destinataires · <span class="plea-status st-reponse">Réponse reçue</span> une réponse écrite est arrivée et publiée · <span class="plea-status st-obtenu">Obtenu</span> une décision ou un chantier concret a suivi. Cette page est mise à jour à chaque étape.</p>\n<p class="form-note"><strong>Mise à jour du 28 septembre 2026\xa0:</strong> les lettres de transmission des huit plaidoyers — au ministre concerné, avec copie aux services, aux partenaires et aux autorités du Mandoul Occidental — ont été préparées le 24 septembre 2026 et attendent la signature du bureau. La date d’envoi de chaque dossier sera inscrite dans ce tableau dès la transmission.</p>'),
    # Redevabilité : politiques d'intégrité en projet (23/09), non adoptées (note datée).
    ('<p style="margin-top:1.3rem;">Une règle vaut pour tout ce qui précède, et c’est celle que nous appliquons depuis la première page de ce site\xa0: <strong>nous publions nos sources, et nous écrivons ce que nous ne savons pas</strong>. La transparence sur nos lacunes est la seule garantie sérieuse que nous ne racontons pas ce qui nous arrange.</p>',
     '<p style="margin-top:1.3rem;">Une règle vaut pour tout ce qui précède, et c’est celle que nous appliquons depuis la première page de ce site\xa0: <strong>nous publions nos sources, et nous écrivons ce que nous ne savons pas</strong>. La transparence sur nos lacunes est la seule garantie sérieuse que nous ne racontons pas ce qui nous arrange.</p>\n<p class="form-note"><strong>Mise à jour du 28 septembre 2026\xa0:</strong> cinq politiques d’intégrité écrites — conflits d’intérêts, fraude et corruption, données personnelles, achats et dépenses, exploitation et abus sexuels — ont été rédigées en projet le 23 septembre 2026 et sont soumises au bureau exécutif. Elles seront publiées sur cette page une fois adoptées\xa0; d’ici là, seules les règles ci-dessus engagent l’association.</p>'),
    # Mentions légales : seizième formulaire, le répertoire des compétences de la diaspora (28/09/2026).
    ("<p>Le site compte quinze formulaires. Ils ne servent pas tous à la même chose",
     "<p>Le site compte vingt formulaires. Ils ne servent pas tous à la même chose"),
    ('aria-label="Les quinze formulaires du site et le sort de vos données"',
     'aria-label="Les vingt formulaires du site et le sort de vos données"'),
    ("<p>Pour dix de ces formulaires, un compteur anonyme tient le nombre total d’envois\u00a0; pour le signalement des besoins, il retient aussi la localité, le type de besoin et l’urgence, quand vous acceptez la publication.",
     "<p>Pour quinze de ces formulaires, un compteur anonyme tient le nombre total d’envois, publié sur le <a href=\"/impact\">tableau de bord</a>\u00a0; pour le signalement des besoins, il retient aussi la localité, le type de besoin et l’urgence, quand vous acceptez la publication\u00a0; pour le répertoire des compétences, le nombre de pays et de domaines représentés, sans autre détail."),
    ('<tr><th scope="row"><a href="/dossiers/lieux-sacres#signalement">Lieu sacré menacé</a>',
     '<tr><th scope="row"><a href="/diaspora#inscription">Répertoire des compétences</a><span class="notice-page">Diaspora</span></th><td>Nom, e-mail, téléphone facultatif, pays et ville, lien avec Bédjondo, domaines et métier, expérience, ce que vous offrez, thématique, langues, disponibilité, message</td><td>Trouver la compétence qu’une thématique ou un plaidoyer attend, et vous proposer une mission</td><td>Tant que votre inscription est active, revue chaque année\u00a0; nom, métier et pays publiés dans l’annuaire seulement avec votre accord, le reste jamais</td></tr>'
     '<tr><th scope="row"><a href="/bibliotheque#deposer">Dépôt de document</a><span class="notice-page">Bibliothèque</span></th><td>Titre, auteurs, année, type, langue, résumé, lien, fichier (10 Mo au plus), droits déclarés, choix de publication, nom, contact, message</td><td>Vérifier la référence et les droits, puis l’ajouter à la bibliothèque selon votre choix</td><td>Conservé comme archive tant que vous ne le retirez pas\u00a0; votre nom n’est publié qu’avec votre accord</td></tr>'
     '<tr><th scope="row"><a href="/langue#dictionnaire">Un mot en nangnda</a><span class="notice-page">Langue</span></th><td>Mot, catégorie, sens, exemple et traduction, enregistrement (10 Mo au plus), variante, source, nom, contact facultatif, choix de publication</td><td>Vérifier le mot avec les linguistes et l’ajouter au dictionnaire numérique</td><td>Conservé comme source du dictionnaire\u00a0; publié avec ou sans votre nom selon votre choix, retrait possible</td></tr>'
     '<tr><th scope="row"><a href="/projets#proposer">Proposition de projet</a><span class="notice-page">Projets</span></th><td>Nom du projet, localité, domaine, besoin, proposition, ordre de grandeur du coût, nom, lien avec le projet, contact, choix de publication</td><td>Instruire la proposition avec la thématique concernée et vous répondre</td><td>Conservée le temps de l’instruction, puis comme archive du projet\u00a0; votre nom n’est publié qu’avec votre accord</td></tr>'
     '<tr><th scope="row"><a href="/temoignages#envoyer">Témoignage, photo ou enregistrement</a><span class="notice-page">Racontez Bédjondo</span></th><td>Type de récit, titre, récit, fichier joint (photo, son, vidéo, 10 Mo au plus), lieu et date, nom, qualité, contact, localité, choix de publication, accords (personnes citées, mineurs)</td><td>Vérifier le récit avec vous, le publier selon votre choix, constituer la banque d’images et les archives de l’association</td><td>Conservé comme archive tant que vous ne le retirez pas\u00a0; publié seulement après votre relecture, avec ou sans votre nom selon votre choix</td></tr>'
     '<tr><th scope="row"><a href="/dossiers/lieux-sacres#signalement">Lieu sacré menacé</a>'),
    # 28/09/2026 : le sigle ODEB se développe désormais « Organisation pour le Développement et l’Émergence
    # Bedjonde » (projet ODEB LONODJI, vision 2030) ; les trois pages qui citaient l'ancien développement renvoient au projet.
    ("vers <strong>ODEB</strong> (Organisation de Développement et d’Entraide des Bedjond). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"#vers-ong\">Vers le statut d’ONG</a>.</p>",
     "vers <strong>ODEB LONODJI</strong> (Organisation pour le Développement et l’Émergence Bedjonde, développement retenu le 28 septembre 2026 — voir <a href=\"/odeb\">le projet ODEB LONODJI</a>). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"#vers-ong\">Vers le statut d’ONG</a>.</p>"),
    ("vers <strong>ODEB</strong> (Organisation de Développement et d’Entraide des Bedjond). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"/dossiers/demarches#vers-ong\">Vers le statut d’ONG</a>.</p>",
     "vers <strong>ODEB LONODJI</strong> (Organisation pour le Développement et l’Émergence Bedjonde, développement retenu le 28 septembre 2026 — voir <a href=\"/odeb\">le projet ODEB LONODJI</a>). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"/dossiers/demarches#vers-ong\">Vers le statut d’ONG</a>.</p>"),
    ("l’association prendra alors le nom d’<strong>ODEB</strong> — Organisation de Développement et d’Entraide des Bedjond — en cohérence avec son nouveau statut. Le nom ADEB LONODJI reste, à ce jour, celui de l’association telle qu’elle existe\u00a0; ODEB est le nom prévu pour l’ONG à venir, pas encore effectif.</p>",
     "l’association prendra alors le nom d’<strong>ODEB LONODJI</strong> — Organisation pour le Développement et l’Émergence Bedjonde — en cohérence avec son nouveau statut. Le nom ADEB LONODJI reste, à ce jour, celui de l’association telle qu’elle existe\u00a0; ODEB est le nom prévu pour l’ONG à venir, pas encore effectif.</p>\n<p class=\"form-note\"><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> le développement du sigle, que nous écrivions «\u00a0Organisation de Développement et d’Entraide des Bedjond\u00a0», est désormais «\u00a0Organisation pour le Développement et l’Émergence Bedjonde\u00a0», conformément au projet ODEB LONODJI présenté ce jour — vision 2030, six missions, cinq programmes et livre blanc en version de travail, sur <a href=\"/odeb\">sa page</a>. Le statut, lui, n’a pas changé\u00a0: aucun dossier déposé.</p>"),
    # Redevabilité : le nombre de formulaires (vingt au 28/09/2026)
    ("Le site compte quinze formulaires, dont les réponses sont enregistrées par Netlify", "Le site compte vingt formulaires, dont les réponses sont enregistrées par Netlify"),
    # 02/10/2026 : vingt et unième formulaire, le recensement des membres (/participer/recensement)
    ("Le site compte vingt formulaires", "Le site compte vingt-deux formulaires"),
    ('aria-label="Les vingt formulaires du site et le sort de vos données"', 'aria-label="Les vingt-deux formulaires du site et le sort de vos données"'),
    ("puis les publier après votre relecture</td><td>Pas encore fixée\u00a0: vous pouvez demander à tout moment que ces données soient effacées</td></tr></tbody>",
     "puis les publier après votre relecture</td><td>Pas encore fixée\u00a0: vous pouvez demander à tout moment que ces données soient effacées</td></tr>"
     '<tr><th scope="row"><a href="/participer/recensement">Recensement des membres</a><span class="notice-page">Participer</span></th>'
     "<td>Nom, tranche d’âge, parent ou tuteur pour un mineur, téléphone, e-mail facultatif, lieu de vie, quartier ou village d’attache, lien avec l’association, année d’adhésion, métier, thématique, message, accord pour être contacté</td>"
     "<td>Tenir le registre des membres et préparer l’assemblée générale de relance ; consulté par le bureau et le Comité de réactivation, jamais publié</td>"
     "<td>Pas encore fixée\u00a0: vous pouvez demander à tout moment que ces données soient effacées</td></tr>"
     '<tr><th scope="row"><a href="/participer/mise-a-jour">Demande de mise à jour du site</a><span class="notice-page">Toutes les pages (pied de page)</span></th>'
     "<td>Page concernée, type de demande, texte actuel, texte demandé, source, nom, lien avec la page, contact, accord pour être cité au journal des corrections</td>"
     "<td>Vérifier la demande et corriger la page ; une erreur de fait corrigée est inscrite au journal des corrections, avec votre nom seulement si vous l’acceptez</td>"
     "<td>Pas encore fixée\u00a0: vous pouvez demander à tout moment que ces données soient effacées</td></tr></tbody>"),
    # Journal des corrections : le nom du coordonnateur de Culture & patrimoine vivant, mal orthographié le 28/09.
    ('seulement les cas où <strong>nous avons affirmé quelque chose d’inexact</strong>.</p>\n<article class="info-card">\n<p class="form-note">24 septembre 2026 · Identité',
     'seulement les cas où <strong>nous avons affirmé quelque chose d’inexact</strong>.</p>\n<article class="info-card">\n<p class="form-note">28 septembre 2026 · Nom · Relevé par l’intéressé, corrigé dans l’heure</p>\n<h3>Le nom du coordonnateur de Culture &amp; patrimoine vivant était mal orthographié</h3>\n<p><strong>Ce que nous écrivions\u00a0:</strong> en annonçant, le 28 septembre en fin de matinée, que la thématique Culture &amp; patrimoine vivant était confiée à un nouveau coordonnateur, nous avons écrit son nom «\u00a0Madjirabé\u00a0» sur la page Nos actions, le suivi, la page anglaise et l’outil «\u00a0Trouver ma thématique\u00a0».</p>\n<p><strong>Ce qui est exact\u00a0:</strong> le Dr Yaphete Madjiradé. Toutes les pages sont corrigées.</p>\n<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> par la comparaison, moins d’une heure après la mise en ligne, avec une liste de chercheurs du pays bedjond transmise à l’animation, où le nom est correctement écrit\u00a0; l’animation l’a confirmé.</p>\n</article>\n<article class="info-card">\n<p class="form-note">24 septembre 2026 · Identité'),
    # Journal des corrections : l'entrée du 23/09 reste telle quelle ; une mise à jour datée la complète.
    ("<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> un audit complet du site, le 23 septembre, qui a interrogé le registre du .org et l’annuaire RDAP, sans réponse pour lonodji.org, puis relu la notice à la lumière des formulaires réellement en service.</p>",
     "<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> un audit complet du site, le 23 septembre, qui a interrogé le registre du .org et l’annuaire RDAP, sans réponse pour lonodji.org, puis relu la notice à la lumière des formulaires réellement en service.</p>\n<p><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> le nom de domaine lonodji.org a depuis été enregistré et héberge le site depuis le 27 septembre. Les adresses électroniques restent à créer\u00a0; le formulaire et WhatsApp demeurent les deux voies sûres.</p>"),
]


# Mises à jour de la source AVANT analyse (structure, scripts et pages) : décisions de
# l'association postérieures à l'export de l'ancien site, datées dans le texte.
UPDATES_SOURCE = [
    # 28/09/2026 : les pôles ont des directeurs (rang de chef de projet) ; le formulaire de contact les propose.
    ('<option data-objet="thematique">Rejoindre une thématique, ou la coordonner</option>',
     '<option data-objet="thematique">Rejoindre une thématique, la coordonner, ou diriger un pôle</option>'),
    ('<legend>Si vous voulez rejoindre une thématique</legend>',
     '<legend>Si vous voulez rejoindre une thématique ou diriger un pôle</legend>'),
    ('<label for="pole">Thématique</label>\n              <select id="pole" name="pole">\n                <option value="">Choisir une thématique (optionnel)</option>',
     '<label for="pole">Thématique, ou direction d’un pôle</label>\n              <select id="pole" name="pole">\n                <option value="">Choisir une thématique ou un pôle (optionnel)</option>\n'
     '                <optgroup label="Direction d’un pôle — rang de chef de projet">\n'
     '                  <option>Direction du pôle I — Mémoire, culture &amp; patrimoine</option>\n'
     '                  <option>Direction du pôle II — Développement humain &amp; moyens d’existence</option>\n'
     '                  <option>Direction du pôle III — Gouvernance, paix &amp; plaidoyer</option>\n'
     '                  <option>Direction du pôle IV — Numérique &amp; innovation</option>\n'
     '                </optgroup>'),
    ('<label for="coordo">Je candidate pour être coordonnateur de cette thématique</label>',
     '<label for="coordo">Je candidate pour coordonner cette thématique, ou pour diriger ce pôle</label>'),
    # 28/09/2026 : la coordination de Culture & patrimoine vivant est confiée au Dr Yaphete Madjiradé.
    ('<span class="coord-qui">Félix Mbété Nangmbatnan</span>', '<span class="coord-qui">Dr Yaphete Madjiradé</span>'),
    ('<p class="coord">Coordonnateur&nbsp;: Félix Mbété Nangmbatnan</p>', '<p class="coord">Coordonnateur&nbsp;: Dr Yaphete Madjiradé</p>'),
    ('<p class="coord">Coordinator: F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan</p>', '<p class="coord">Coordinator: Dr Yaphete Madjirad&eacute;</p>'),
    ('"coord": "Coordonnateur : Félix Mbété Nangmbatnan",', '"coord": "Coordonnateur : Dr Yaphete Madjiradé",'),
    # 30/09/2026 : la coordination de Mémoire & héritage est confiée à Félix Mbété Nangmbatnan ; le Dr Bé-Rammaj
    # Miaro-II, qui la tenait, dirige depuis le même jour le pôle Mémoire, culture & patrimoine.
    ('<span class="coord-qui">Dr Bé-Rammaj Miaro-II, historien</span>', '<span class="coord-qui">Félix Mbété Nangmbatnan</span>'),
    ('<p class="coord">Coordonnateur&nbsp;: Dr Bé-Rammaj Miaro-II, historien</p>', '<p class="coord">Coordonnateur&nbsp;: Félix Mbété Nangmbatnan</p>'),
    ('<p class="coord">Coordinator: Dr B&eacute;-Rammaj Miaro-II, historian</p>', '<p class="coord">Coordinator: F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan</p>'),
    ('"coord": "Coordonnateur : Dr Bé-Rammaj Miaro-II, historien",', '"coord": "Coordonnateur : Félix Mbété Nangmbatnan",'),
    # 28/09/2026 : objet « Le projet ODEB LONODJI » dans le formulaire de contact (remarques sur le livre blanc)
    ('              <option data-objet="partenariat">Partenariat, presse ou recherche</option>\n',
     '              <option data-objet="odeb">Le projet ODEB LONODJI (livre blanc, remarques, contributions)</option>\n              <option data-objet="partenariat">Partenariat, presse ou recherche</option>\n'),
    # 28/09/2026 : la page anglaise renvoie au projet ODEB LONODJI et ne parle plus de « thirteen themes still open »
    ('      <div class="eyebrow">How to help</div>\n      <h2>Join, give, share your skills, spread the word</h2>\n',
     '      <div class="eyebrow">Vision 2030</div>\n      <h2>The ODEB LONODJI project</h2>\n      <p>On 28 September 2026, forty years after its founding reflections of 1986, the association launched the ODEB LONODJI reflection: a project to give the Bedjond country a permanent organisation for research, documentation, territorial development, innovation, heritage and diaspora mobilisation by 2030. Six missions, six programmes, a roadmap and a white paper (working draft, in French). <a href="odeb.html">Read the summary in English &rarr;</a></p>\n      <div class="eyebrow">How to help</div>\n      <h2>Join, give, share your skills, spread the word</h2>\n'),
    ('coordinate one of the thirteen themes still open,', 'coordinate one of the themes still open (see the list on the themes page), lead one of the pillars still without a Pillar Lead (programme-manager level; posts created on 28 September 2026, see the themes page),'),
    # 28/09/2026 : chiffres figés de l'ancien site devenus inexacts (inspection de cohérence)
    ('The full site, the journal (29 articles), the research base', 'The full site, the journal, the research base'),
    ('<p>The full site, the journal, the research base and all PDFs are in French: <a href="../index.html">visit the French site</a>.</p>',
     '<p>Also in English: <a href="villages.html">find your village</a> (fourteen units, 966 localities), <a href="projects.html">the projects and their stage</a>, <a href="impact.html">the impact dashboard</a>, <a href="sectors.html">our sectors (WASH, health, relief…)</a>, <a href="odeb.html">the ODEB project</a>, <a href="https://lonodji.org/en/governance">local governance: who decides what</a>, <a href="https://lonodji.org/en/commune">our proposals to the commune</a> and <a href="https://lonodji.org/en/subsoil">the subsoil: oil, iron, gold</a>. The full site, the journal, the research base and all PDFs are in French: <a href="../index.html">visit the French site</a>.</p>'),
    ('        <span class="bento-num">38</span>\n        <span class="bento-label">références réunies à ce jour</span>', '        <span class="bento-num">40</span>\n        <span class="bento-label">références réunies à ce jour</span>'),
    # nominations de coordonnateurs : générées depuis NOMINATIONS (voir plus bas), ajoutées à l'exécution
    # la tuile « à pourvoir » pointait vers la thématique 04, désormais pourvue
    ('<a class="bento-tile" href="#agriculture-elevage-securite-alimentaire" aria-label="13 thématiques', '<a class="bento-tile" href="#entrepreneuriat-finance-inclusive" aria-label="13 thématiques'),
    # suivi : Jeunesse & réussite a désormais sa coordination
    ('<p>Ces quatre thématiques ont des problématiques documentées <strong>et</strong> un plaidoyer déjà publié&nbsp;: <a href="poles.html#eau-energie-connectivite">Eau, énergie &amp; connectivité</a> &middot; <a href="poles.html#desenclavement-urbanisation">Désenclavement &amp; urbanisation</a> &middot; <a href="poles.html#jeunesse-reussite">Jeunesse &amp; réussite</a> &middot; <a href="poles.html#gouvernance-plaidoyer">Gouvernance &amp; plaidoyer</a>. Il ne leur manque qu&rsquo;un coordonnateur ou une coordonnatrice pour suivre les dossiers et relancer les destinataires.</p>',
     '<p>Ces deux thématiques ont des problématiques documentées <strong>et</strong> un plaidoyer déjà publié&nbsp;: <a href="poles.html#eau-energie-connectivite">Eau, énergie &amp; connectivité</a> &middot; <a href="poles.html#desenclavement-urbanisation">Désenclavement &amp; urbanisation</a>. Il ne leur manque qu&rsquo;un coordonnateur ou une coordonnatrice pour suivre les dossiers et relancer les destinataires. <a href="poles.html#jeunesse-reussite">Jeunesse &amp; réussite</a> et <a href="poles.html#gouvernance-plaidoyer">Gouvernance &amp; plaidoyer</a>, qui étaient dans le même cas, ont leur coordination depuis le 28 septembre 2026.</p>'),
    # comptes : quinze pourvues, quatre à pourvoir (28/09/2026)
    ('pas encore de coordonnateur pour quinze de ses dix-neuf th&eacute;matiques', 'pas encore de coordonnateur pour quatre de ses dix-neuf th&eacute;matiques'),
    ('aria-label="6 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">6</span>',
     'aria-label="15 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">15</span>'),
    ('Santé &amp; prévention, Protection sociale &amp; inclusion</span>', 'Agriculture, élevage &amp; sécurité alimentaire, Jeunesse &amp; réussite, Santé &amp; prévention, Protection sociale &amp; inclusion, Gouvernance &amp; plaidoyer, Paix &amp; cohésion, Réseau d&rsquo;experts &amp; diaspora, Justice &amp; droits humains, Transformation numérique &amp; services, Intelligence artificielle &amp; données, Compétences &amp; entrepreneuriat numérique</span>'),
    ('aria-label="13 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">13</span>',
     'aria-label="4 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">4</span>'),
    ('<p>Treize des dix-neuf thématiques d&rsquo;ADEB LONODJI n&rsquo;ont pas encore de coordon', '<p>Quatre des dix-neuf thématiques d&rsquo;ADEB LONODJI n&rsquo;ont pas encore de coordon'),
    ('<p>Treize thématiques attendent un coordonnateur ou une coordonnatrice.', '<p>Quatre thématiques attendent un coordonnateur ou une coordonnatrice.'),
    ('<p>Dix-neuf thématiques, et treize attendent encore leur coordonnateur.</p>', '<p>Dix-neuf thématiques, et quatre attendent encore leur coordonnateur.</p>'),
    ('pourvoir les treize thématiques encore sans coordonnateur', 'pourvoir les quatre thématiques encore sans coordonnateur'),
    ('<p class="lede">Treize des dix-neuf thématiques d&rsquo;ADEB LONODJI cherchent encore un coordonnateur', '<p class="lede">Quatre des dix-neuf thématiques d&rsquo;ADEB LONODJI cherchent encore un coordonnateur'),
    ('<p>Treize thématiques et deux cellules cherchent des coordonnateurs et des membres actifs.', '<p>Quatre thématiques et une cellule cherchent des coordonnateurs et des membres actifs.'),
    ('où vous seriez le plus utile. Treize attendent un coordonnateur."', 'où vous seriez le plus utile. Quatre attendent un coordonnateur."'),
    ('<p class="lede">Dix-neuf th&eacute;matiques, dont treize sans coordonnateur.', '<p class="lede">Dix-neuf th&eacute;matiques, dont quatre sans coordonnateur.'),
    ('<span class="hero-pill">Treize th&eacute;matiques &agrave; pourvoir</span>', '<span class="hero-pill">Quatre th&eacute;matiques &agrave; pourvoir</span>'),
]
# Nominations de coordonnateurs postérieures à l'export : une ligne par thématique.
# (ancre, nom FR (html), nom EN (html), nom dans trouver.js, pôle FR (html), coordonnateur FR, coordonnateur EN (html), note FR, note EN)
BIG = "Bignéro Moïalbéi LE MADANG"
BIG_EN = "Bign&eacute;ro Mo&iuml;alb&eacute;i LE MADANG"
NOTE_P4_FR = " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> les trois thématiques du pôle Numérique &amp; innovation sont confiées à Bignéro Moïalbéi LE MADANG, animateur général de l&rsquo;association."
NOTE_P4_EN = " <strong>Update, 28 September 2026:</strong> the three themes of the Digital &amp; Innovation pole are now coordinated by " + BIG_EN + ", the association&rsquo;s general facilitator."
NOMINATIONS = [
    ("transformation-numerique-services", "Transformation numérique &amp; services", "Digital Transformation &amp; Services", "Transformation numérique & services", "Numérique &amp; innovation", BIG, BIG_EN, NOTE_P4_FR, NOTE_P4_EN),
    # 30/09/2026 : Bonheur Allahaddje succède à Bignéro Moïalbéi LE MADANG ; la note du 28/09 reste, datée.
    ("intelligence-artificielle-donnees", "Intelligence artificielle &amp; données", "Artificial Intelligence &amp; Data", "Intelligence artificielle & données", "Numérique &amp; innovation",
     "Bonheur Allahaddje", "Bonheur Allahaddje",
     NOTE_P4_FR + " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de cette thématique est confiée à Bonheur Allahaddje, qui succède à Bignéro Moïalbéi LE MADANG.",
     NOTE_P4_EN + " <strong>Update, 30 September 2026:</strong> this theme is now coordinated by Bonheur Allahaddje, who succeeds " + BIG_EN + "."),
    # 30/09/2026 : Rosine Mbaïnodoum succède à Bignéro Moïalbéi LE MADANG ; la note du 28/09 reste, datée.
    ("competences-entrepreneuriat-numerique", "Compétences &amp; entrepreneuriat numérique", "Digital Skills &amp; Entrepreneurship", "Compétences & entrepreneuriat numérique", "Numérique &amp; innovation",
     "Rosine Mbaïnodoum", "Rosine Mba&iuml;nodoum",
     NOTE_P4_FR + " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de cette thématique est confiée à Rosine Mbaïnodoum, qui succède à Bignéro Moïalbéi LE MADANG.",
     NOTE_P4_EN + " <strong>Update, 30 September 2026:</strong> this theme is now coordinated by Rosine Mba&iuml;nodoum, who succeeds " + BIG_EN + "."),
    ("agriculture-elevage-securite-alimentaire", "Agriculture, élevage &amp; sécurité alimentaire", "Agriculture, Livestock &amp; Food Security", "Agriculture, élevage & sécurité alimentaire", "Développement humain &amp; moyens d’existence",
     "Olivier Allaramadji Nomaye, ingénieur agroéconomiste", "Olivier Allaramadji Nomaye, agricultural economist",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Olivier Allaramadji Nomaye, ingénieur agroéconomiste.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Olivier Allaramadji Nomaye, agricultural economist."),
    ("jeunesse-reussite", "Jeunesse &amp; réussite", "Youth &amp; Achievement", "Jeunesse & réussite", "Développement humain &amp; moyens d’existence",
     "Bruno Kodjadoum NGARTEL", "Bruno Kodjadoum NGARTEL",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Bruno Kodjadoum NGARTEL.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Bruno Kodjadoum NGARTEL."),
    ("paix-cohesion", "Paix &amp; cohésion", "Peace &amp; Social Cohesion", "Paix & cohésion", "Gouvernance, paix &amp; plaidoyer",
     "Sa Majesté Moulbe Brahim Nadoumbeye, chef de canton de Bébopen", "His Majesty Moulbe Brahim Nadoumbeye, canton chief of B&eacute;bopen",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Sa Majesté Moulbe Brahim Nadoumbeye, chef de canton de Bébopen.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by His Majesty Moulbe Brahim Nadoumbeye, canton chief of B&eacute;bopen."),
    ("justice-droits-homme", "Justice &amp; droits humains", "Justice &amp; Human Rights", "Justice & droits humains", "Gouvernance, paix &amp; plaidoyer",
     "Dr Eugène Ngartebaye Le Yotha", "Dr Eug&egrave;ne Ngartebaye Le Yotha",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée au Dr Eugène Ngartebaye Le Yotha.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Dr Eug&egrave;ne Ngartebaye Le Yotha."),
    ("gouvernance-plaidoyer", "Gouvernance &amp; plaidoyer", "Governance &amp; Advocacy", "Gouvernance & plaidoyer", "Gouvernance, paix &amp; plaidoyer",
     "Adoumbé Maoura, président de l’association", "Adoumb&eacute; Maoura, president of the association",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Adoumbé Maoura, président de l&rsquo;association.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Adoumb&eacute; Maoura, president of the association."),
    ("reseau-experts-diaspora", "Réseau d&rsquo;experts &amp; diaspora", "Expert Network &amp; Diaspora", "Réseau d’experts & diaspora", "Gouvernance, paix &amp; plaidoyer",
     "Edgard Djerassem Djimhotengar", "Edgard Djerassem Djimhotengar",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Edgard Djerassem Djimhotengar.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Edgard Djerassem Djimhotengar."),
    # 30/09/2026 : thématique 05, jusqu'ici à pourvoir
    ("entrepreneuriat-finance-inclusive", "Entrepreneuriat &amp; finance inclusive", "Entrepreneurship &amp; Inclusive Finance", "Entrepreneuriat & finance inclusive", "Développement humain &amp; moyens d’existence",
     "Tamar Neloum DOUMANBE", "Tamar Neloum DOUMANBE",
     " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Tamar Neloum DOUMANBE.",
     " <strong>Update, 30 September 2026:</strong> the theme is now coordinated by Tamar Neloum DOUMANBE."),
    # cellule transversale : mêmes gabarits (tableau, carte, page anglaise, trouver.js), pas de fiche de suivi
    ("cellule-communication-numerique", "Communication &amp; numérique", "Communication &amp; Digital", "Communication & numérique", "Un appui à toutes les thématiques",
     "Djimtebaye Mahamat Mamadou Banadji", "Djimtebaye Mahamat Mamadou Banadji",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la cellule est confiée à Djimtebaye Mahamat Mamadou Banadji.",
     " <strong>Update, 28 September 2026:</strong> the unit is now coordinated by Djimtebaye Mahamat Mamadou Banadji."),
    # 01/10/2026 (registre 2026-31, proposition 3) : la cellule, vacante, est confiée à la trésorière élue, par intérim.
    ("cellule-financement-ressources", "Financement &amp; ressources", "Funding &amp; Resources", "Financement & ressources", "Un appui à toutes les thématiques",
     "Élisabeth Neloumngaye Ndodinguem, trésorière de l’association, par intérim", "&Eacute;lisabeth Neloumngaye Ndodinguem, treasurer of the association (interim)",
     " <strong>Mise à jour du 1er octobre 2026&nbsp;:</strong> sur décision du bureau exécutif, la cellule est confiée par intérim à la trésorière élue, Élisabeth Neloumngaye Ndodinguem&nbsp;; l&rsquo;argent relève du bureau. La collecte reste suspendue jusqu&rsquo;aux trois conditions publiées.",
     " <strong>Update, 1 October 2026:</strong> by decision of the executive board, the unit is entrusted, on an interim basis, to the elected treasurer, &Eacute;lisabeth Neloumngaye Ndodinguem; money is a matter for the board. Fundraising remains suspended."),
]


# Coordinatrices parmi les NOMINATIONS : libellé « Coordonnatrice » (l'anglais « Coordinator » est neutre).
COORDINATRICES = {"competences-entrepreneuriat-numerique", "entrepreneuriat-finance-inclusive", "cellule-financement-ressources"}
def libelle_coord(anc: str) -> str:
    return "Coordonnatrice" if anc in COORDINATRICES else "Coordonnateur"


def nominations_source() -> list[tuple[str, str]]:
    """Remplacements de source pour chaque nomination : tableau, carte, suivi, page anglaise, trouver.js."""
    out = []
    for anc, fr, en, js, pole, qui, qui_en, _nf, _ne in NOMINATIONS:
        lib = libelle_coord(anc)
        out += [
            (f'<a class="coord-row" href="poles.html#{anc}"><span class="coord-etat">&Agrave; pourvoir</span><span class="coord-nom">{fr}</span><span class="coord-pole">{pole}</span><span class="coord-qui coord-qui--vide">&mdash;</span></a>',
             f'<a class="coord-row" href="poles.html#{anc}"><span class="coord-etat coord-etat--ok">Pourvu</span><span class="coord-nom">{fr}</span><span class="coord-pole">{pole}</span><span class="coord-qui">{qui}</span></a>'),
            (f'<span class="pole-status pole-status--vacant">À pourvoir</span>\n          <h3>{fr}</h3>\n          <p class="coord">Coordonnateur&nbsp;: à pourvoir</p>',
             f'<span class="pole-status pole-status--pourvu">Pourvu</span>\n          <h3>{fr}</h3>\n          <p class="coord">{lib}&nbsp;: {qui}</p>'),
            (f'<span class="pole-status pole-status--vacant">À pourvoir</span><h3><a href="poles.html#{anc}">{fr}</a></h3>',
             f'<span class="pole-status pole-status--pourvu">Pourvu</span><h3><a href="poles.html#{anc}">{fr}</a></h3><p class="coord">{lib}&nbsp;: {qui}</p>'),
            (f'<span class="pole-status pole-status--vacant">Open</span>\n          <h3>{en}</h3>\n          <p class="coord">Coordinator: to be appointed</p>',
             f'<span class="pole-status pole-status--pourvu">Coordinator in post</span>\n          <h3>{en}</h3>\n          <p class="coord">Coordinator: {qui_en}</p>'),
            (f'"name": "{js}",\n    "status": "open",\n    "coord": "Coordonnateur : à pourvoir",',
             f'"name": "{js}",\n    "status": "filled",\n    "coord": "{lib} : {qui}",'),
        ]
    return out


NOTES_COORDINATION = [
    # (marqueur dans la source, note ajoutée à la fin de la description de la carte, fichiers concernés)
    ('<p class="coord">Coordonnateur&nbsp;: Dr Yaphete Madjiradé</p>', " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée au Dr Yaphete Madjiradé, qui succède à Félix Mbété Nangmbatnan.", ("poles.html",)),
    ('<p class="coord">Coordonnateur&nbsp;: Félix Mbété Nangmbatnan</p>', " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Félix Mbété Nangmbatnan, qui succède au Dr Bé-Rammaj Miaro-II, devenu directeur du pôle Mémoire, culture &amp; patrimoine.", ("poles.html",)),
    ('<p class="coord">Coordinator: F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan</p>', " <strong>Update, 30 September 2026:</strong> the theme is now coordinated by F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan, who succeeds Dr B&eacute;-Rammaj Miaro-II, now Pillar Lead of Memory, Culture &amp; Heritage.", ("themes.html",)),
    ('<p class="coord">Coordinator: Dr Yaphete Madjirad&eacute;</p>', " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Dr Yaphete Madjirad&eacute;, who succeeds F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan.", ("themes.html",)),
] + [(f'<h3>{fr}</h3>\n          <p class="coord">{libelle_coord(_a)}&nbsp;: {qui}</p>', nf, ("poles.html",)) for _a, fr, _en, _js, _p, qui, _qe, nf, _ne in NOMINATIONS] \
  + [(f'<h3>{en}</h3>\n          <p class="coord">Coordinator: {qui_en}</p>', ne, ("themes.html",)) for _a, _fr, en, _js, _p, _q, qui_en, _nf, ne in NOMINATIONS]


# ----------------------------------------------------------------------------
# 29/09/2026 : périmètres élargis (secteurs standards des ONG de développement et
# d'aide) et vingtième thématique « Urgences & risques » dans le pôle II.
# Les articles du journal, datés, restent tels qu'écrits ; tout le reste suit.
# ----------------------------------------------------------------------------
RENOMMAGES_29_09 = [
    # (ancien, nouveau) — HTML et texte brut (trouver.js), FR puis EN
    ("Eau, énergie &amp; connectivité", "Eau, assainissement, énergie &amp; connectivité"),
    ("Eau, énergie & connectivité", "Eau, assainissement, énergie & connectivité"),
    ("Eau, &eacute;nergie &amp; connectivit&eacute;", "Eau, assainissement, &eacute;nergie &amp; connectivit&eacute;"),
    ("Santé &amp; prévention", "Santé, nutrition &amp; prévention"),
    ("Santé & prévention", "Santé, nutrition & prévention"),
    ("Sant&eacute; &amp; pr&eacute;vention", "Sant&eacute;, nutrition &amp; pr&eacute;vention"),
    ("Environnement &amp; ressources naturelles", "Environnement, climat &amp; ressources naturelles"),
    ("Environnement & ressources naturelles", "Environnement, climat & ressources naturelles"),
    ("Protection sociale &amp; inclusion", "Protection sociale, enfance &amp; inclusion"),
    ("Protection sociale & inclusion", "Protection sociale, enfance & inclusion"),
    ("Water, Energy &amp; Connectivity", "Water, Sanitation, Energy &amp; Connectivity"),
    ("Health &amp; Prevention", "Health, Nutrition &amp; Prevention"),
    ("Environment &amp; Natural Resources", "Environment, Climate &amp; Natural Resources"),
    ("Social Protection &amp; Inclusion", "Social Protection, Children &amp; Inclusion"),
    # 29/09/2026, second temps : intitulés alignés sur les activités (07 WASH, 08 infrastructures, 09 éducation, 17 connectivité)
    ("Eau, assainissement, énergie &amp; connectivité", "Eau, assainissement &amp; hygiène"),
    ("Eau, assainissement, énergie & connectivité", "Eau, assainissement & hygiène"),
    ("Eau, assainissement, &eacute;nergie &amp; connectivit&eacute;", "Eau, assainissement &amp; hygi&egrave;ne"),
    ("Désenclavement &amp; urbanisation", "Énergie, routes &amp; urbanisme"),
    ("Désenclavement & urbanisation", "Énergie, routes & urbanisme"),
    ("D&eacute;senclavement &amp; urbanisation", "&Eacute;nergie, routes &amp; urbanisme"),
    ("Jeunesse &amp; réussite", "Éducation, jeunesse &amp; formation"),
    ("Jeunesse & réussite", "Éducation, jeunesse & formation"),
    ("Jeunesse &amp; r&eacute;ussite", "&Eacute;ducation, jeunesse &amp; formation"),
    ("Transformation numérique &amp; services", "Connectivité &amp; services numériques"),
    ("Transformation numérique & services", "Connectivité & services numériques"),
    ("Eau, &eacute;nergie &amp; connectivit&eacute;", "Eau, assainissement &amp; hygi&egrave;ne"),
    ("Transformation num&eacute;rique &amp; services", "Connectivit&eacute; &amp; services num&eacute;riques"),
    ("Water, Sanitation, Energy &amp; Connectivity", "Water, Sanitation &amp; Hygiene"),
    ("Road Access &amp; Urban Growth", "Energy, Roads &amp; Urban Planning"),
    ("Youth &amp; Achievement", "Education, Youth &amp; Training"),
    ("Digital Transformation &amp; Services", "Connectivity &amp; Digital Services"),
]
COMPTES_29_09 = [
    # vingt thématiques, cinq à pourvoir (les quatre d'avant + Urgences & risques)
    ("quatre de ses dix-neuf th&eacute;matiques", "cinq de ses vingt th&eacute;matiques"),
    ("Quatre des dix-neuf thématiques", "Cinq des vingt thématiques"),
    ("<p>Quatre thématiques attendent un coordonnateur", "<p>Cinq thématiques attendent un coordonnateur"),
    ("<p>Dix-neuf thématiques, et quatre attendent encore leur coordonnateur.</p>", "<p>Vingt thématiques, et cinq attendent encore leur coordonnateur.</p>"),
    ("pourvoir les quatre thématiques encore sans coordonnateur", "pourvoir les cinq thématiques encore sans coordonnateur"),
    ("Dix-neuf th&eacute;matiques, dont quatre sans coordonnateur.", "Vingt th&eacute;matiques, dont cinq sans coordonnateur."),
    ("Quatre th&eacute;matiques &agrave; pourvoir</span>", "Cinq th&eacute;matiques &agrave; pourvoir</span>"),
    ("<p>Quatre thématiques et une cellule cherchent", "<p>Cinq thématiques et une cellule cherchent"),
    ("où vous seriez le plus utile. Quatre attendent un coordonnateur.", "où vous seriez le plus utile. Cinq attendent un coordonnateur."),
    ('aria-label="4 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">4</span>',
     'aria-label="5 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">5</span>'),
    ("Thirteen of ADEB LONODJI&rsquo;s nineteen themes still have no coordinator.", "Five of ADEB LONODJI&rsquo;s twenty themes still have no coordinator."),
    ("<h2>Six coordinators out of nineteen</h2>", "<h2>Fifteen coordinators out of twenty</h2>"),
    ("thirteen of the nineteen themes have no coordinator today", "five of the twenty themes have no coordinator today"),
    # QA de cohérence du 29/09/2026 : chiffres figés de l'ancien site
    ("le nombre de th&eacute;matiques qui ont un coordonnateur&nbsp;: deux sur dix-neuf.", "le nombre de th&eacute;matiques qui ont un coordonnateur&nbsp;: quinze sur vingt au 29 septembre 2026."),
    ("<p>Dix-neuf fiches, une par thématique&nbsp;:", "<p>Une fiche par thématique (la vingtième, Urgences &amp; risques, créée le 29 septembre 2026, attend encore ses problématiques)&nbsp;:"),
    # 30/09/2026 : Entrepreneuriat & finance inclusive pourvue — seize pourvues, quatre à pourvoir
    ("cinq de ses vingt th&eacute;matiques", "quatre de ses vingt th&eacute;matiques"),
    ("Cinq des vingt thématiques", "Quatre des vingt thématiques"),
    ("<p>Cinq thématiques attendent un coordonnateur", "<p>Quatre thématiques attendent un coordonnateur"),
    ("<p>Vingt thématiques, et cinq attendent encore leur coordonnateur.</p>", "<p>Vingt thématiques, et quatre attendent encore leur coordonnateur.</p>"),
    ("pourvoir les cinq thématiques encore sans coordonnateur", "pourvoir les quatre thématiques encore sans coordonnateur"),
    ("Vingt th&eacute;matiques, dont cinq sans coordonnateur.", "Vingt th&eacute;matiques, dont quatre sans coordonnateur."),
    ("Cinq th&eacute;matiques &agrave; pourvoir</span>", "Quatre th&eacute;matiques &agrave; pourvoir</span>"),
    ("<p>Cinq thématiques et une cellule cherchent", "<p>Quatre thématiques et une cellule cherchent"),
    ("où vous seriez le plus utile. Cinq attendent un coordonnateur.", "où vous seriez le plus utile. Quatre attendent un coordonnateur."),
    ('aria-label="5 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">5</span>',
     'aria-label="4 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">4</span>'),
    ('<a class="bento-tile" href="#entrepreneuriat-finance-inclusive" aria-label="', '<a class="bento-tile" href="#environnement-ressources" aria-label="'),
    ('aria-label="15 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">15</span>',
     'aria-label="16 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">16</span>'),
    ("Five of ADEB LONODJI&rsquo;s twenty themes still have no coordinator.", "Four of ADEB LONODJI&rsquo;s twenty themes still have no coordinator."),
    ("<h2>Fifteen coordinators out of twenty</h2>", "<h2>Sixteen coordinators out of twenty</h2>"),
    ("five of the twenty themes have no coordinator today", "four of the twenty themes have no coordinator today"),
]
# Message du kit de mobilisation (à copier-coller) : resté à « dont 13 » depuis l'ancien site.
COMPTES_29_09.append(("dont 13 cherchent encore un coordonnateur", "dont 4 cherchent encore un coordonnateur"))

# ----------------------------------------------------------------------------
# 30/09/2026 : comptes courants. Les remplacements ci-dessus et corrections_*.py amènent les phrases qui comptent
# les coordinations à un état de référence (COMPTES_BASE : 4 thématiques à pourvoir, 16 pourvues, 1 cellule à
# pourvoir). Une dernière passe (comptes_courants, fin de lire_source) les récrit avec les comptes réels, lus dans
# poles.html après les nominations : une nomination n'a plus besoin que de sa ligne dans NOMINATIONS.
COMPTES_BASE = (4, 16, 1)
COMPTES_COURANTS: tuple[int, int, int, int] | None = None   # (à pourvoir, pourvues, cellules à pourvoir, total), fixé dans main()
COMPTES_VUS: set[int] = set()
_FR = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize",
       "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"]
_EN = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
       "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"]
def _maj(t: str) -> str:
    return t[:1].upper() + t[1:]


_TOTAL_FR = {20: "vingt", 21: "vingt et une", 22: "vingt-deux", 23: "vingt-trois", 24: "vingt-quatre"}
_TOTAL_EN = {20: "twenty", 21: "twenty-one", 22: "twenty-two", 23: "twenty-three", 24: "twenty-four"}


def phrases_comptes(o: int, p: int, c: int, t: int = 20) -> list[str]:
    """Phrases (texte source, entités comprises) qui dépendent des comptes : o thématiques à pourvoir,
    p pourvues, c cellules à pourvoir, t thématiques en tout. Même ordre quels que soient les comptes."""
    pl = o > 1
    tf, te = _TOTAL_FR.get(t, str(t)), _TOTAL_EN.get(t, str(t))
    cel = "" if not c else (" et une cellule" if c == 1 else f" et {_FR[c]} cellules")
    return [
        # français
        f"dont {_FR[p]} {'ont' if p > 1 else 'a'} déjà leur coordonnateur",                                   # mission
        f"pourvoir {f'les {_FR[o]} thématiques' if pl else 'la thématique'} encore sans coordonnateur",        # mission
        f"{_maj(_FR[o])} des {tf} thématiques d&rsquo;ADEB LONODJI n&rsquo;{'ont' if pl else 'a'} pas encore de coordonnat",
        f"{_maj(_FR[o])} des {tf} thématiques d&rsquo;ADEB LONODJI {'cherchent' if pl else 'cherche'} encore un coordonnateur",
        f"<p>{_maj(_FR[o])} thématique{'s' if pl else ''}{cel} {'cherchent' if o + c > 1 else 'cherche'} des coordonnateurs",
        f"dont {o} {'cherchent' if pl else 'cherche'} encore un coordonnateur",                                # kit, message à copier
        f"pas encore de coordonnateur pour {_FR[o]} de ses {tf} th&eacute;matiques",
        # anglais
        f"{_maj(_EN[o])} of the {te} themes {'are' if pl else 'is'} still looking for a coordinator.",
        f"{_maj(_EN[o])} of ADEB LONODJI&rsquo;s {te} themes still {'have' if pl else 'has'} no coordinator.",
        f"themes, {p} with a coordinator so far",
        f"{_maj(_EN[p])} themes out of {te} have a coordinator",
        f"{_EN[o]} of the {te} themes {'have' if pl else 'has'} no coordinator today",
        # 01/10/2026 : outil « Trouver ma thématique » (chapeau, pastille, description), restés au compte de référence
        f"<p>{_maj(_FR[o])} thématique{'s' if pl else ''} {'attendent' if pl else 'attend'} un coordonnateur",
        f"{_maj(_FR[o])} th&eacute;matique{'s' if pl else ''} &agrave; pourvoir</span>",
        f"où vous seriez le plus utile. {_maj(_FR[o])} {'attendent' if pl else 'attend'} un coordonnateur.",
        f"th&eacute;matiques, dont {_FR[o]} sans coordonnateur.",
    ]


def comptes_courants(html: str) -> str:
    if COMPTES_COURANTS is None:
        return html
    t = COMPTES_COURANTS[3]   # le total est déjà écrit en toutes lettres dans la source (COMPTES_RE_30_09)
    for i, (base, cour) in enumerate(zip(phrases_comptes(*COMPTES_BASE, t), phrases_comptes(*COMPTES_COURANTS))):
        if base in html:
            COMPTES_VUS.add(i)
            html = html.replace(base, cour)
    return html


# « dix-neuf thématiques » et variantes, hors articles (regex, casse conservée)
COMPTES_RE_29_09 = [
    (r"\bdix-neuf(\s+th(?:é|&eacute;)matiques)", r"vingt\1"),
    (r"\bDix-neuf(\s+th(?:é|&eacute;)matiques)", r"Vingt\1"),
    (r"\b19(\s+th(?:é|&eacute;)matiques)", r"20\1"),
    (r"\bdix-neuf(\s+coordinations)", r"vingt\1"),
    (r"\bnineteen(\s+themes)", r"twenty\1"),
    (r"\bNineteen(\s+themes)", r"Twenty\1"),
]
NOTES_PERIMETRE_29_09 = [
    # (titre de la carte après renommage, note ajoutée à la fin de sa description) — poles.html
    ("Eau, assainissement &amp; hygiène",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique devient <strong>Eau, assainissement &amp; hygiène</strong>. L&rsquo;énergie rejoint la thématique 08, Énergie, routes &amp; urbanisme, et la connexion internet la thématique 17, Connectivité &amp; services numériques."),
    ("Énergie, routes &amp; urbanisme",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique, jusqu&rsquo;ici « Désenclavement &amp; urbanisation », réunit désormais les infrastructures&nbsp;: l&rsquo;<strong>énergie</strong> (électricité, solaire, venue de la thématique 07), les routes, les ponts et les pistes, et l&rsquo;urbanisme de Bédjondo."),
    ("Éducation, jeunesse &amp; formation",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique, jusqu&rsquo;ici « Jeunesse &amp; réussite », prend le nom de ce qu&rsquo;elle porte&nbsp;: l&rsquo;<strong>éducation</strong> — l&rsquo;école, le lycée, la formation professionnelle et les plaidoyers qui les concernent — et la jeunesse. Sa coordination ne change pas."),
    ("Connectivité &amp; services numériques",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique, jusqu&rsquo;ici « Transformation numérique &amp; services », reprend la <strong>connectivité</strong> — réseau mobile, haut débit, espace numérique — venue de la thématique 07. Sa coordination ne change pas."),
    ("Santé, nutrition &amp; prévention",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique s&rsquo;élargit à la <strong>nutrition</strong> — dépistage de la malnutrition des jeunes enfants, alimentation des femmes enceintes et allaitantes, lien avec les centres de santé et la thématique Agriculture, élevage &amp; sécurité alimentaire."),
    ("Environnement, climat &amp; ressources naturelles",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique s&rsquo;élargit à l&rsquo;<strong>adaptation au changement climatique</strong> — pratiques agricoles face aux pluies irrégulières, reboisement, protection des berges ; la préparation aux catastrophes relève de la thématique 20, Urgences &amp; risques."),
    ("Protection sociale, enfance &amp; inclusion",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique s&rsquo;élargit à la <strong>protection de l&rsquo;enfance</strong> — enregistrement des naissances, enfants hors de l&rsquo;école, mariages précoces, en lien avec la politique de protection de l&rsquo;association ; l&rsquo;aide d&rsquo;urgence en cas de catastrophe ou d&rsquo;épidémie passe à la thématique 20, Urgences &amp; risques."),
]
URGENCES_CARTE = """
        <article class="pole-card" id="urgences-risques">
          <div class="pole-head-row">
            <span class="pole-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5"/><path d="M12 17.5h.01"/></svg></span>
            <span class="pole-num">THÉMATIQUE 20</span>
          </div>
          <span class="pole-status pole-status--vacant">À pourvoir</span>
          <h3>Urgences &amp; risques</h3>
          <p class="coord">Coordonnateur&nbsp;: à pourvoir</p>
          <p>Préparer le pays bedjond aux crises plutôt que les subir&nbsp;: inondations de la saison des pluies, épidémies, sécheresse, feux de brousse, arrivée de familles déplacées. Pistes envisagées&nbsp;: cartographier avec les villages les zones inondables et les points d&rsquo;eau exposés&nbsp;; un plan de contingence simple par canton — qui prévenir, où se mettre à l&rsquo;abri, quelles réserves&nbsp;; un réseau d&rsquo;alerte par WhatsApp et par la radio communautaire, qui relaie les alertes officielles&nbsp;; et, quand la crise est là, informer, orienter et recenser les besoins pour les services de l&rsquo;État, la Croix-Rouge du Tchad et les agences humanitaires, plutôt que les doubler. L&rsquo;association ne collecte rien avant d&rsquo;avoir un compte à son nom&nbsp;: une aide d&rsquo;urgence ne passerait que par des circuits vérifiables et publiés. <strong>Thématique créée le 29 septembre 2026</strong>&nbsp;; elle reprend l&rsquo;aide d&rsquo;urgence jusqu&rsquo;ici rattachée à Protection sociale, enfance &amp; inclusion. Rien n&rsquo;est encore engagé.</p>
          <div class="pole-tags"><span class="tag">Urgences</span><span class="tag">Inondations</span><span class="tag">Épidémies</span><span class="tag">Alerte</span></div>
          <div class="pole-odd"><span class="odd-legend">ODD</span><a class="odd-chip" href="odd.html#odd-1" style="--odd-accent:#E5243B;--odd-ink:#ffffff" title="ODD 1 &mdash; Pas de pauvret&eacute; | cible 1.5 &mdash; r&eacute;silience des plus pauvres face aux catastrophes"><span class="odd-num">1</span><span class="odd-name">Pauvret&eacute;</span><span class="odd-cible">1.5</span></a><a class="odd-chip" href="odd.html#odd-11" style="--odd-accent:#FD9D24;--odd-ink:#10181f" title="ODD 11 &mdash; Villes et communaut&eacute;s durables | cible 11.5 &mdash; r&eacute;duire les d&eacute;c&egrave;s et les pertes dus aux catastrophes"><span class="odd-num">11</span><span class="odd-name">Villes</span><span class="odd-cible">11.5</span></a><a class="odd-chip" href="odd.html#odd-13" style="--odd-accent:#3F7E44;--odd-ink:#ffffff" title="ODD 13 &mdash; Lutte contre le changement climatique | cible 13.1 &mdash; r&eacute;silience face aux al&eacute;as climatiques"><span class="odd-num">13</span><span class="odd-name">Climat</span><span class="odd-cible">13.1</span></a></div>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="besoins.html">Signaler un besoin, localité par localité &rarr;</a>
          <a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=20">Rejoindre cette th&eacute;matique &rarr;</a>
          </div>
        </article>
"""
URGENCES_EN = """
        <article class="pole-card">
          <div class="pole-head-row"><span class="pole-num">THEME 20</span></div>
          <span class="pole-status pole-status--vacant">Open</span>
          <h3>Emergencies &amp; Risks</h3>
          <p class="coord">Coordinator: to be appointed</p>
          <p>Preparing the Bedjond country for crises rather than suffering them: rainy-season floods, epidemics, drought, bush fires, displaced families. Ideas under consideration: mapping flood-prone areas with the villages, a simple contingency plan per canton, an alert network over WhatsApp and community radio, and, when a crisis hits, informing, guiding and recording needs for the State services, the Chad Red Cross and humanitarian agencies rather than duplicating them. Created on 29 September 2026; nothing is committed yet, and no money is collected before the association has an account in its name.</p>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="../poles.html#urgences-risques">Full description <span>(in French)</span> &rarr;</a>
          </div>
        </article>"""
URGENCES_JS = """  {
    "id": "urgences-risques",
    "num": "20",
    "key": "20",
    "pole": "Pôle II · Thématique 20",
    "name": "Urgences & risques",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Préparer le pays bedjond aux crises : inondations, épidémies, sécheresse ; cartographie des risques, plan de contingence par canton, réseau d’alerte, relais avec l’État et les agences humanitaires.",
    "page": [
      "besoins.html",
      "Carte des besoins"
    ],
    "suivi": false,
    "tier": 3
  },
"""


def structure_29_09(html: str, path: Path) -> str:
    """Applique les décisions du 29/09/2026 à un fichier de l'ancien site (hors articles)."""
    if "articles" in path.parts:
        return html
    for old, new in RENOMMAGES_29_09 + COMPTES_29_09:
        html = html.replace(old, new)
    if path.name != "actualites.html":  # les résumés d'articles, datés, restent tels qu'écrits
        for rx, rep in COMPTES_RE_29_09:
            html = re.sub(rx, rep, html)
    if path.name == "poles.html":
        for titre, note in NOTES_PERIMETRE_29_09:
            i = html.find(f"<h3>{titre}</h3>")
            if i < 0:
                continue
            j = html.find("<p>", i)
            k = html.find("</p>", j)
            if j > 0 and k > 0:
                html = html[:k] + note + html[k:]
        # la carte, après celle de Protection sociale (fin du pôle II)
        i = html.find('<article class="pole-card" id="solidarite-inclusion">')
        k = html.find("</article>", i)
        if i > 0 and k > 0 and 'id="urgences-risques"' not in html:
            html = html[:k + len("</article>")] + "\n" + URGENCES_CARTE.rstrip() + html[k + len("</article>"):]
        # la ligne du tableau des coordinations
        m = re.search(r'<a class="coord-row" href="poles\.html#solidarite-inclusion">.*?</a>', html)
        if m and "poles.html#urgences-risques" not in html[m.end():m.end() + 400]:
            ligne = ('\n        <a class="coord-row" href="poles.html#urgences-risques"><span class="coord-etat">&Agrave; pourvoir</span><span class="coord-nom">Urgences &amp; risques</span>'
                     '<span class="coord-pole">Développement humain &amp; moyens d’existence</span><span class="coord-qui coord-qui--vide">à pourvoir</span></a>')
            html = html[:m.end()] + ligne + html[m.end():]
    if path.name == "contact.html":
        html = html.replace("<option>12. Protection sociale, enfance &amp; inclusion</option>\n",
                            "<option>12. Protection sociale, enfance &amp; inclusion</option>\n                  <option>20. Urgences &amp; risques</option>\n")
    if path.name == "themes.html" and "THEME 20" not in html:
        i = html.find('<span class="pole-num">THEME 12</span>')
        k = html.find("</article>", i)
        if i > 0 and k > 0:
            html = html[:k + len("</article>")] + URGENCES_EN + html[k + len("</article>"):]
    if path.name == "trouver.js" and '"id": "urgences-risques"' not in html:
        html = html.replace("aide d’urgence en cas de catastrophe ou d’épidémie.", "protection de l’enfance (naissances, école, mariages précoces).")
        i = html.find('    "id": "gouvernance-plaidoyer",')
        i = html.rfind("  {", 0, i)
        if i > 0:
            html = html[:i] + URGENCES_JS + html[i:]
        for cle in ('"social"', '"sante"', '"envi"'):
            j = html.find(f"  {cle}: {{")
            s_ = html.find('"s": [', j)
            if j > 0 and s_ > 0:
                html = html[:s_ + len('"s": [')] + '\n      "urgences-risques",' + html[s_ + len('"s": ['):]
    return html



# ----------------------------------------------------------------------------
# 30/09/2026 : l'énergie devient une thématique à part, la 21 (pôle II) ; la 08 devient « Routes & urbanisme ».
# Précise la décision du 29/09/2026 (registre 2026-14 et 2026-29). Appliqué après structure_29_09 et corrections_*.py,
# avant comptes_courants ; les notes datées du 29/09 gardent leur texte d'alors.
ECLAIR = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
          'stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>')
ENERGIE_TEXTE = ("L&rsquo;accès à l&rsquo;énergie dans le pays bedjond&nbsp;: électricité par le réseau, par des mini-réseaux "
                 "ou par le solaire, éclairage public, électrification des écoles, des centres de santé et de la mairie — notre "
                 "diagnostic ne connaît aujourd&rsquo;hui aucun équipement public électrifié à Bédjondo. La thématique porte le "
                 "plaidoyer <a href=\"articles/2026-09-16-plaidoyer-electricite-bedjondo.html\">«&nbsp;De la lumière pour "
                 "Bédjondo&nbsp;»</a> et suit les programmes de l&rsquo;État et des bailleurs qui financent l&rsquo;électrification. "
                 "Avec la thématique Environnement, climat &amp; ressources naturelles, elle suit aussi ce que le "
                 "<a href=\"https://lonodji.org/territoire/sous-sol\">sous-sol</a> pourrait un jour apporter. "
                 "<strong>Thématique créée le 30 septembre 2026</strong>&nbsp;; elle reprend l&rsquo;énergie, rattachée depuis le "
                 "29 septembre à la thématique 08, qui devient Routes &amp; urbanisme. Rien n&rsquo;est encore engagé.")
ENERGIE_CARTE = f"""
        <article class="pole-card" id="energie">
          <div class="pole-head-row">
            <span class="pole-icon">{ECLAIR}</span>
            <span class="pole-num">THÉMATIQUE 21</span>
          </div>
          <span class="pole-status pole-status--vacant">À pourvoir</span>
          <h3>Énergie</h3>
          <p class="coord">Coordonnateur&nbsp;: à pourvoir</p>
          <p>{ENERGIE_TEXTE}</p>
          <div class="pole-tags"><span class="tag">Électricité</span><span class="tag">Solaire</span><span class="tag">Éclairage public</span><span class="tag">Mini-réseaux</span></div>
          <div class="pole-odd"><span class="odd-legend">ODD</span>@@CHIP_7@@</div>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="suivi.html#energie">Suivi : 1 problématique &middot; 1 plaidoyer &rarr;</a>
          <a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=21">Rejoindre cette th&eacute;matique &rarr;</a>
          </div>
        </article>
"""
ENERGIE_EN = """
        <article class="pole-card">
          <div class="pole-head-row"><span class="pole-num">THEME 21</span></div>
          <span class="pole-status pole-status--vacant">Open</span>
          <h3>Energy</h3>
          <p class="coord">Coordinator: to be appointed</p>
          <p>Access to energy in the Bedjond country: grid, mini-grid and solar electricity, public lighting, power for schools, health centres and the town hall &mdash; our diagnosis knows of no electrified public facility in B&eacute;djondo today. The theme carries the electricity advocacy brief and follows the State and donor programmes that fund electrification. Created on 30 September 2026; it takes over energy, attached since 29 September to theme 08, which becomes Roads &amp; Urban Planning. Nothing is committed yet.</p>
          <div class="pole-odd"><span class="odd-legend">SDG</span>@@SDG_7@@</div>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="../poles.html#energie">Full description <span>(in French)</span> &rarr;</a>
          </div>
        </article>"""
ENERGIE_JS = """  {
    "id": "energie",
    "num": "21",
    "key": "21",
    "pole": "Pôle II · Thématique 21",
    "name": "Énergie",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "L’accès à l’énergie dans le pays bedjond : électricité par le réseau, les mini-réseaux ou le solaire, éclairage public, électrification des écoles, des centres de santé et de la mairie.",
    "page": [
      "articles/2026-09-16-plaidoyer-electricite-bedjondo.html",
      "Plaidoyer électricité"
    ],
    "suivi": true,
    "tier": 1
  },
"""
ENERGIE_SUIVI = (f'<article class="pole-card" id="energie"><div class="pole-head-row"><span class="pole-icon">{ECLAIR}</span>'
                 '<span class="pole-num">THÉMATIQUE 21</span></div><span class="pole-status pole-status--vacant">À pourvoir</span>'
                 '<h3><a href="poles.html#energie">Énergie</a></h3><p class="kanban-card-meta">1 problématique reliée &mdash; '
                 'Partiel&nbsp;: 1 &mdash; 1 plaidoyer actif</p><div class="pole-hub-links">'
                 '<a class="pole-hub-link" href="problematiques.html#prob-10">Aucun équipement public électrifié connu &rarr;</a>'
                 '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-electricite">&laquo;&nbsp;De la lumière pour Bédjondo&nbsp;&raquo; &rarr;</a>'
                 '<a class="pole-hub-link pole-hub-link--join" href="poles.html#energie">Voir la fiche thématique &rarr;</a></div></article>')
NOTE_08_30_09 = (" <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> l&rsquo;énergie devient une thématique à part entière, "
                 "la 21, Énergie&nbsp;; la thématique 08, qui prend le nom de Routes &amp; urbanisme, garde les routes, les ponts, "
                 "les pistes et l&rsquo;urbanisme de Bédjondo.")
NOTE_08_30_09_EN = (" <strong>Update, 30 September 2026:</strong> energy becomes a theme of its own, theme 21, Energy; theme 08, "
                    "renamed Roads &amp; Urban Planning, keeps roads, bridges, tracks and the planning of B&eacute;djondo.")
SDG_7_EN = ('<a class="odd-chip" href="#sdg-7" style="--odd-accent:#FCC30B;--odd-ink:#10181f" title="SDG 7 &mdash; Affordable and Clean '
            'Energy | target 7.1 &mdash; access to reliable energy services &middot; target 7.2 &mdash; share of renewable energy">'
            '<span class="odd-num">7</span><span class="odd-name">Energy</span><span class="odd-cible">7.1&thinsp;/&thinsp;7.2</span></a>')
# Textes datés du 29/09 qui citent l'ancien nom : conservés tels quels.
_DATES_29_09 = ["L&rsquo;énergie rejoint la thématique 08, Énergie, routes &amp; urbanisme",
                "Energy moves to theme 08, Energy, Roads &amp; Urban Planning"]
# Comptes : vingt thématiques → vingt et une (hors articles, journal des actualités et journal des corrections).
COMPTES_RE_30_09 = [
    (r"\bvingt(\s+th(?:é|&eacute;)matiques)", r"vingt et une\1"),
    (r"\bVingt(\s+th(?:é|&eacute;)matiques)", r"Vingt et une\1"),
    (r"\b20(\s+th(?:é|&eacute;)matiques)", r"21\1"),
    (r"\bvingt(\s+coordinations)", r"vingt et une\1"),
    (r"\btwenty(\s+themes)", r"twenty-one\1"),
    (r"\bTwenty(\s+themes)", r"Twenty-one\1"),
    (r"\b20(\s+themes)", r"21\1"),
    (r"themes out of twenty\b", "themes out of twenty-one"),
    (r'<span class="bento-num">20</span><span class="bento-label">themes', '<span class="bento-num">21</span><span class="bento-label">themes'),
]
_CHIP_7 = None


def structure_30_09(html: str, path: Path) -> str:
    global _CHIP_7
    if "articles" in path.parts:
        return html
    if _CHIP_7 is None:
        spec = importlib.util.spec_from_file_location("corrections_fr_chips", Path(__file__).with_name("corrections_fr.py"))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        _CHIP_7 = mod.CHIP_7
    for i, t in enumerate(_DATES_29_09):
        html = html.replace(t, f"@@DATE{i}@@")
    # 1. ce qui concerne l'électricité passe à la 21
    for old, new in [
        ('<a class="plea-theme" href="poles.html#desenclavement-urbanisation">Énergie</a>', '<a class="plea-theme" href="poles.html#energie">Énergie</a>'),
        ('Électricité <a class="prob-theme-lien" href="poles.html#desenclavement-urbanisation">&rarr; Énergie, routes & urbanisme</a>',
         'Électricité <a class="prob-theme-lien" href="poles.html#energie">&rarr; Énergie</a>'),
        ('<a class="prob-theme-lien" href="poles.html#desenclavement-urbanisation">&rarr; Énergie, routes & urbanisme</a></th><td>Équipements publics électrifiés',
         '<a class="prob-theme-lien" href="poles.html#energie">&rarr; Énergie</a></th><td>Équipements publics électrifiés'),
        ('(<a href="articles/2026-09-16-plaidoyer-electricite-bedjondo.html">&eacute;lectricit&eacute;</a>) <a class="prob-theme-lien" href="poles.html#desenclavement-urbanisation">→ Énergie, routes & urbanisme</a>',
         '(<a href="articles/2026-09-16-plaidoyer-electricite-bedjondo.html">&eacute;lectricit&eacute;</a>) <a class="prob-theme-lien" href="poles.html#energie">→ Énergie</a>'),
        ('mairie (&eacute;lectricit&eacute;)</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: National</div><div class="kanban-card-theme">→ Énergie, routes & urbanisme</div>',
         'mairie (&eacute;lectricit&eacute;)</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: National</div><div class="kanban-card-theme">→ Énergie</div>'),
        ('énergie conventionnelle portée par la <a href="poles.html#desenclavement-urbanisation">thématique Énergie, routes &amp; urbanisme</a>',
         'énergie conventionnelle portée par la <a href="poles.html#energie">thématique Énergie</a>'),
        ('l&rsquo;énergie solaire portée par la thématique <a href="#desenclavement-urbanisation">Énergie, routes &amp; urbanisme</a>',
         'l&rsquo;énergie solaire portée par la thématique <a href="#energie">Énergie</a>'),
        # renvois « énergie » des cartes 07 et 17 (celui de la carte 09, qui parle des routes, garde la 08)
        ('<a class="pole-hub-link" href="poles.html#desenclavement-urbanisation">Énergie, routes &amp; urbanisme &rarr;</a>\n          <a class="pole-hub-link" href="suivi.html#eau-energie-connectivite">',
         '<a class="pole-hub-link" href="poles.html#energie">Énergie &rarr;</a>\n          <a class="pole-hub-link" href="suivi.html#eau-energie-connectivite">'),
        ('<a class="pole-hub-link" href="poles.html#desenclavement-urbanisation">Énergie, routes &amp; urbanisme &rarr;</a>\n          <a class="pole-hub-link" href="suivi.html#transformation-numerique-services">',
         '<a class="pole-hub-link" href="poles.html#energie">Énergie &rarr;</a>\n          <a class="pole-hub-link" href="suivi.html#transformation-numerique-services">'),
        ('<a href="poles.html#desenclavement-urbanisation">08 &middot; &Eacute;nergie, routes &amp; urbanisme <span class="odd-cible">7.1&thinsp;/&thinsp;7.2</span></a>',
         '<a href="poles.html#energie">21 &middot; &Eacute;nergie <span class="odd-cible">7.1&thinsp;/&thinsp;7.2</span></a>'),
        ('<a href="#theme-list">07 &middot; Water, Sanitation &amp; Hygiene <span class="odd-cible">7.1&thinsp;/&thinsp;7.2</span></a>',
         '<a href="#theme-list">21 &middot; Energy <span class="odd-cible">7.1&thinsp;/&thinsp;7.2</span></a>'),
    ]:
        html = html.replace(old, new)
    html = html.replace("P&ocirc;le II &middot; 10 th&eacute;matiques", "P&ocirc;le II &middot; 11 th&eacute;matiques")
    # 2. la 08 : étiquettes, ODD 7, suivi, note datée
    html = html.replace('<span class="tag">Routes</span><span class="tag">Électricité</span><span class="tag">Solaire</span><span class="tag">Plan de ville</span></div>',
                        '<span class="tag">Routes</span><span class="tag">Ponts</span><span class="tag">Plan de ville</span></div>')
    html = html.replace('<span class="odd-cible">11.3&thinsp;/&thinsp;11.6</span></a>' + _CHIP_7 + "</div>",
                        '<span class="odd-cible">11.3&thinsp;/&thinsp;11.6</span></a></div>')
    html = html.replace('<a class="pole-hub-link" href="suivi.html#desenclavement-urbanisation">Suivi : 4 problématiques &middot; 2 plaidoyers &rarr;</a>',
                        '<a class="pole-hub-link" href="suivi.html#desenclavement-urbanisation">Suivi : 3 problématiques &middot; 1 plaidoyer &rarr;</a>')
    if path.name == "suivi.html":
        html = html.replace('<p class="kanban-card-meta">4 problématiques reliées &mdash; Documenté&nbsp;: 1 &middot; Partiel&nbsp;: 2 &middot; Ailleurs&nbsp;: 1 &mdash; 2 plaidoyers actifs</p>'
                            '<div class="pole-hub-links"><a class="pole-hub-link" href="problematiques.html#prob-10">Aucun équipement public électrifié connu &rarr;</a>',
                            '<p class="kanban-card-meta">3 problématiques reliées &mdash; Documenté&nbsp;: 1 &middot; Partiel&nbsp;: 1 &middot; Ailleurs&nbsp;: 1 &mdash; 1 plaidoyer actif</p>'
                            '<div class="pole-hub-links">')
        html = html.replace('<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-electricite">&laquo;&nbsp;De la lumière pour Bédjondo&nbsp;&raquo; &rarr;</a><a class="pole-hub-link" href="plaidoyers.html#plaidoyer-routes">',
                            '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-routes">')
        html = html.replace('<p>Ces deux thématiques ont des problématiques documentées', '<p>Ces trois thématiques ont des problématiques documentées')
        html = html.replace('<a href="poles.html#desenclavement-urbanisation">Énergie, routes &amp; urbanisme</a>. Il ne leur manque',
                            '<a href="poles.html#desenclavement-urbanisation">Routes &amp; urbanisme</a> &middot; <a href="poles.html#energie">Énergie</a>. Il ne leur manque')
        i = html.find('<article class="pole-card" id="solidarite-inclusion">')
        k = html.find("</article>", i)
        if i > 0 and k > 0 and 'id="energie"' not in html:
            html = html[:k + len("</article>")] + ENERGIE_SUIVI + html[k + len("</article>"):]
    # 3. le nouveau nom de la 08
    for old, new in [("Énergie, routes &amp; urbanisme", "Routes &amp; urbanisme"), ("Énergie, routes & urbanisme", "Routes & urbanisme"),
                     ("&Eacute;nergie, routes &amp; urbanisme", "Routes &amp; urbanisme"), ("Energy, Roads &amp; Urban Planning", "Roads &amp; Urban Planning"),
                     ("Energy, Roads & Urban Planning", "Roads & Urban Planning")]:
        html = html.replace(old, new)
    for i, t in enumerate(_DATES_29_09):
        html = html.replace(f"@@DATE{i}@@", t)
    # 4. la 21 : carte, ligne du tableau, note sur la 08, formulaire, page anglaise, outil « trouver »
    if path.name == "poles.html":
        i = html.find("<h3>Routes &amp; urbanisme</h3>")
        j = html.find("<p>", html.find('<p class="coord">', i) + 1) if i > 0 else -1
        k = html.find("</p>", j)
        if j > 0 and k > 0:
            html = html[:k] + NOTE_08_30_09 + html[k:]
        i = html.find('<article class="pole-card" id="urgences-risques">')
        k = html.find("</article>", i)
        if i > 0 and k > 0 and 'id="energie"' not in html:
            html = html[:k + len("</article>")] + "\n" + ENERGIE_CARTE.replace("@@CHIP_7@@", _CHIP_7).rstrip() + html[k + len("</article>"):]
        m = re.search(r'<a class="coord-row" href="poles\.html#urgences-risques">.*?</a>', html)
        if m and "poles.html#energie" not in html[m.end():m.end() + 400]:
            ligne = ('\n        <a class="coord-row" href="poles.html#energie"><span class="coord-etat">&Agrave; pourvoir</span><span class="coord-nom">Énergie</span>'
                     '<span class="coord-pole">Développement humain &amp; moyens d’existence</span><span class="coord-qui coord-qui--vide">à pourvoir</span></a>')
            html = html[:m.end()] + ligne + html[m.end():]
    if path.name == "contact.html":
        html = re.sub(r"(<option>20\. Urgences &amp; risques</option>\n)(\s*)", lambda m: m.group(1) + m.group(2) + "<option>21. Énergie</option>\n" + m.group(2), html)
    if path.name == "themes.html":
        html = html.replace(SDG_7_EN, "", 1) if html.count(SDG_7_EN) == 1 else html
        i = html.find("<h3>Roads &amp; Urban Planning</h3>")
        j = html.find("<p>", html.find('<p class="coord">', i) + 1) if i > 0 else -1
        k = html.find("</p>", j)
        if j > 0 and k > 0:
            html = html[:k] + NOTE_08_30_09_EN + html[k:]
        if "THEME 21" not in html:
            i = html.find('<span class="pole-num">THEME 20</span>')
            k = html.find("</article>", i)
            if i > 0 and k > 0:
                html = html[:k + len("</article>")] + ENERGIE_EN.replace("@@SDG_7@@", SDG_7_EN) + html[k + len("</article>"):]
    if path.name == "trouver.js" and '"id": "energie"' not in html:
        i = html.find('    "id": "gouvernance-plaidoyer",')
        i = html.rfind("  {", 0, i)
        if i > 0:
            html = html[:i] + ENERGIE_JS + html[i:]
        for cle, cle_liste in (('"envi"', '"p": ['), ('"urba"', '"s": [')):
            j = html.find(f"  {cle}: {{")
            s_ = html.find(cle_liste, j)
            if j > 0 and s_ > 0:
                html = html[:s_ + len(cle_liste)] + '\n      "energie",' + html[s_ + len(cle_liste):]
        j = html.find('"terrain": {')
        s_ = html.find('"ids": [', j)
        if j > 0 and s_ > 0:
            html = html[:s_ + len('"ids": [')] + '\n      "energie",' + html[s_ + len('"ids": ['):]
    # 5. comptes : vingt et une thématiques (les journaux datés restent tels qu'écrits ; sur la page de redevabilité,
    #    seules les deux phrases de règles en vigueur changent)
    if path.name == "redevabilite.html":
        html = re.sub(r"(Les noms de nos |Deux de nos )vingt(\s+th(?:é|&eacute;)matiques)", r"\1vingt et une\2", html)
    if path.name not in ("actualites.html", "redevabilite.html"):
        for rx, rep in COMPTES_RE_30_09:
            html = re.sub(rx, rep, html)
    return html

# ----------------------------------------------------------------------------
# 01/10/2026 : le bureau exécutif adopte les huit propositions d'organisation (registre 2026-31,
# /association/propositions-organisation). Ici, ce qui touche la source : le pôle II, Développement humain & moyens
# d'existence, est scindé en deux — le pôle II, Services essentiels (07, 09, 10, 11, 12), et un pôle V, Économie,
# territoire & risques (04, 05, 06, 08, 20, 21) ; aucune thématique n'est renumérotée. Les articles, le journal des
# actualités et le journal des corrections, datés, gardent leur texte ; la charte d'identité (barre des quatre pôles)
# reçoit une note. Appliqué après structure_30_09, avant comptes_courants.
P2_FR, P5_FR, P6_FR = "Services essentiels", "Économie &amp; ressources naturelles", "Infrastructures, territoire &amp; risques"
P2_EN, P5_EN, P6_EN = "Essential Services", "Economy &amp; Natural Resources", "Infrastructure, Territory &amp; Risks"
ANCIEN_P2 = ("Développement humain &amp; moyens d’existence", "Développement humain &amp; moyens d&rsquo;existence",
             "D&eacute;veloppement humain &amp; moyens d&rsquo;existence", "D&eacute;veloppement humain &amp; moyens d’existence")
VERS_P5 = ["agriculture-elevage-securite-alimentaire", "entrepreneuriat-finance-inclusive", "environnement-ressources",
           "desenclavement-urbanisation", "urgences-risques", "energie"]
NUMS_P5 = ["04", "05", "06", "08", "20", "21"]
# Le même jour (registre 2026-35), le pôle V est à son tour partagé : le pôle VI reçoit 08, 20 et 21.
VERS_P6 = ["desenclavement-urbanisation", "urgences-risques", "energie"]
NUMS_P6 = ["08", "20", "21"]
NOTE_P5_FR = (f" <strong>Mise à jour du 1er octobre 2026&nbsp;:</strong> la thématique passe au nouveau pôle V, {P5_FR}, "
              "issu du partage du pôle Développement humain &amp; moyens d&rsquo;existence&nbsp;; son numéro ne change pas.")
NOTE_P6_FR = (f" <strong>Mise à jour du 1er octobre 2026&nbsp;:</strong> la thématique passe au nouveau pôle VI, {P6_FR}, "
              "issu du partage du pôle Développement humain &amp; moyens d&rsquo;existence&nbsp;; son numéro ne change pas.")
NOTE_P5_EN = (f" <strong>Update, 1 October 2026:</strong> the theme moves to the new Pillar V, {P5_EN}, "
              "split from the Human Development &amp; Livelihoods pillar; its number does not change.")
NOTE_P6_EN = (f" <strong>Update, 1 October 2026:</strong> the theme moves to the new Pillar VI, {P6_EN}, "
              "split from the Human Development &amp; Livelihoods pillar; its number does not change.")
PROSE_P5_EN = ('<p class="prose-note">Earning a living from the land and its resources: farming, livestock, business and the '
               'environment in B&eacute;djondo. Pillar Vice-President (elected): post open &mdash; <a href="contact.html">write to us</a>.</p>')
PROSE_P6_EN = ('<p class="prose-note">What holds the town together, and what threatens it: roads, energy, emergencies and risks in '
               'B&eacute;djondo. Pillar Vice-President (elected): post open &mdash; <a href="contact.html">write to us</a>.</p>')
NOTE_IDENTITE_01_10 = ('<p class="prose-note"><strong>Mise à jour du 1er octobre 2026&nbsp;:</strong> l&rsquo;association compte '
                       f'désormais six pôles&nbsp;; le pôle II s&rsquo;appelle Services essentiels, et les pôles V, {P5_FR}, et VI, '
                       f'{P6_FR}, n&rsquo;ont pas encore de couleur propre dans la charte.</p>')
COMPTES_RE_01_10 = [
    (r"\bquatre(\s+|&nbsp;)p(ô|&ocirc;)les", r"six\1p\2les"),
    (r"\bQuatre(\s+|&nbsp;)p(ô|&ocirc;)les", r"Six\1p\2les"),
    (r"\b4(\s+|&nbsp;)p(ô|&ocirc;)les", r"6\1p\2les"),
    (r"\bfour(\s+)(pillars|poles)", r"six\1\2"),
    (r"\bFour(\s+)(pillars|poles)", r"Six\1\2"),
    (r"\b4(\s+)(pillars|poles)", r"6\1\2"),
]
# phrases datées ou qui décrivent la charte : protégées des remplacements ci-dessus
_GARDES_01_10 = ["barre des quatre p", "portés à quatre pôles", "quatre pôles et dix-neuf", "quatre pôles et dix-huit",
                 "quatre p&ocirc;les et dix-huit", "quatre pôles et vingt thématiques"]


def _articles(sec: str):
    """(début, fin, texte) de chaque <article>…</article> de la section (non imbriqués)."""
    out, i = [], 0
    while True:
        a = sec.find("<article", i)
        if a < 0:
            return out
        b = sec.find("</article>", a) + len("</article>")
        out.append((a, b, sec[a:b]))
        i = b


def _sans(sec: str, garder) -> str:
    """La section sans les cartes que garder() refuse (et sans l'espace qui les précède)."""
    for a, b, art in reversed(_articles(sec)):
        if not garder(art):
            debut = a
            while debut > 0 and sec[debut - 1] in " \n":
                debut -= 1
            sec = sec[:debut] + sec[b:]
    return sec


def _noter(art: str, note: str) -> str:
    """Ajoute la note à la fin de la description de la carte (premier <p> après la coordination)."""
    if "1er octobre 2026" in art or "1 October 2026" in art:
        return art
    c = art.find('<p class="coord">')
    j = art.find("<p>", c + 1 if c >= 0 else 0)
    k = art.find("</p>", j)
    return art[:k] + note + art[k:] if j > 0 and k > 0 else art


def _cibles_du_pole(sec: str) -> str:
    """Le résumé des cibles ODD d'un pôle (pole-odd-sum) ne garde que les cibles de ses propres cartes."""
    cibles = set()
    for m in re.finditer(r'<span class="odd-cible">(.*?)</span>', sec):
        cibles |= {c.strip() for c in re.split(r"&thinsp;/&thinsp;|/", m.group(1))}
    def garder(m):
        return m.group(0) if m.group(2).strip() in cibles else ""
    return re.sub(r'(<a class="odd-dot odd-dot--cible"[^>]*><span class="sr-only">[^<]*</span>)([^<]*)</a>', garder, sec)


def scinder_pole_2(html: str, debut_sec: int, est_v, tete, note: str, avant: str) -> str:
    fin_sec = html.find("</section>", debut_sec) + len("</section>")
    sec = html[debut_sec:fin_sec]
    p2 = _sans(sec, lambda a: not est_v(a))
    p5 = _sans(sec, est_v)
    for a, b, art in reversed(_articles(p5)):
        p5 = p5[:a] + _noter(art, note) + p5[b:]
    p2, p5 = _cibles_du_pole(p2), _cibles_du_pole(tete(p5))
    html = html[:debut_sec] + p2 + html[fin_sec:]
    k = html.find(avant)          # le pôle V se place avant la section qui contient ce repère (les cellules)
    if k < 0:
        print(f"structure_01_10 : repère introuvable pour le pôle V ({avant[:40]})")
        return html
    k = html.rfind("<section", 0, k + len("<section"))
    return html[:k] + p5 + "\n\n  " + html[k:]


def structure_01_10(html: str, path: Path) -> str:
    if "articles" in path.parts:
        return html
    nom = path.name
    est_en = "en" in path.parts
    # 1. le pôle II scindé, là où les pôles ont leurs sections (cartes avec identifiant, ou numéro en anglais)
    if nom in ("poles.html", "suivi.html") and 'id="pole-5"' not in html:
        m = re.search(r'<section class="[^"]*pole-group[^"]*" id="pole-2"', html)
        if m:
            def tete_fr(sec):
                sec = sec.replace('id="pole-2"', 'id="pole-5"').replace('data-group="2"', 'data-group="5"')
                sec = sec.replace('<div class="eyebrow">Pôle II</div>', '<div class="eyebrow">Pôle V</div>')
                for a in ANCIEN_P2:
                    sec = sec.replace(f"<h2>{a}</h2>", f"<h2>{P5_FR}</h2>")
                return sec
            html = scinder_pole_2(html, m.start(), lambda a: any(f'id="{i}"' in a for i in VERS_P5), tete_fr, NOTE_P5_FR,
                                  'id="cellules"' if nom == "poles.html" else '<section id="priorites">')
    if nom in ("poles.html", "suivi.html") and 'id="pole-5"' in html and 'id="pole-6"' not in html:
        m = re.search(r'<section class="[^"]*pole-group[^"]*" id="pole-5"', html)
        if m:
            def tete_vi(sec):
                sec = sec.replace('id="pole-5"', 'id="pole-6"').replace('data-group="5"', 'data-group="6"')
                sec = sec.replace('<div class="eyebrow">Pôle V</div>', '<div class="eyebrow">Pôle VI</div>')
                sec = sec.replace(f"<h2>{P5_FR}</h2>", f"<h2>{P6_FR}</h2>")
                return sec.replace(NOTE_P5_FR, NOTE_P6_FR)
            html = scinder_pole_2(html, m.start(), lambda a: any(f'id="{i}"' in a for i in VERS_P6), tete_vi, NOTE_P6_FR,
                                  'id="cellules"' if nom == "poles.html" else '<section id="priorites">')
    if nom == "themes.html" and est_en and "Pillar V<" not in html:
        i = html.find('<div class="eyebrow">Pillar II</div>')
        d = html.rfind("<section", 0, i)
        if i > 0:
            def tete_en(sec):
                sec = sec.replace('<div class="eyebrow">Pillar II</div>', '<div class="eyebrow">Pillar V</div>')
                sec = re.sub(r'<p class="prose-note">Everyday life and the future:.*?</p>', PROSE_P5_EN, sec, count=1, flags=re.S)
                return sec.replace("<h2>Human Development &amp; Livelihoods</h2>", f"<h2>{P5_EN}</h2>")
            html = scinder_pole_2(html, d, lambda a: any(f'<span class="pole-num">THEME {n}</span>' in a for n in NUMS_P5),
                                  tete_en, NOTE_P5_EN, "<h2>Support to every theme</h2>")
    if nom == "themes.html" and est_en and "Pillar V<" in html and "Pillar VI<" not in html:
        i = html.find('<div class="eyebrow">Pillar V</div>')
        d = html.rfind("<section", 0, i)
        if i > 0:
            def tete_en6(sec):
                sec = sec.replace('<div class="eyebrow">Pillar V</div>', '<div class="eyebrow">Pillar VI</div>')
                sec = sec.replace(PROSE_P5_EN, PROSE_P6_EN, 1)
                sec = sec.replace(f"<h2>{P5_EN}</h2>", f"<h2>{P6_EN}</h2>")
                return sec.replace(NOTE_P5_EN, NOTE_P6_EN)
            html = scinder_pole_2(html, d, lambda a: any(f'<span class="pole-num">THEME {n}</span>' in a for n in NUMS_P6),
                                  tete_en6, NOTE_P6_EN, "<h2>Support to every theme</h2>")
    # 2. le pôle de chaque thématique déplacée, puis le nouveau nom du pôle II
    for anc in VERS_P5:
        html = re.sub(rf'(<a class="coord-row" href="poles\.html#{anc}">(?:(?!</a>).)*?<span class="coord-pole">)[^<]*(</span>)',
                      rf"\g<1>{P6_FR if anc in VERS_P6 else P5_FR}\2", html, flags=re.S)
    html = re.sub(r'"pole": "Pôle II · Thématique (04|05|06)"', r'"pole": "Pôle V · Thématique \1"', html)
    html = re.sub(r'"pole": "Pôle II · Thématique (08|20|21)"', r'"pole": "Pôle VI · Thématique \1"', html)
    if nom == "mission.html":
        html = html.replace('<a href="poles.html#pole-2">Pôle II &mdash; Développement humain &amp; moyens d’existence</a>, le plus vaste des quatre,',
                            f'<a href="poles.html#pole-2">Pôle II &mdash; {P2_FR}</a>, du <a href="poles.html#pole-5">Pôle V &mdash; {P5_FR}</a> et du '
                            f'<a href="poles.html#pole-6">Pôle VI &mdash; {P6_FR}</a>, '
                            'nés le 1er octobre 2026 du partage de l&rsquo;ancien pôle Développement humain &amp; moyens d&rsquo;existence,')
        html = html.replace("thématiques dans les semaines qui suivent.", "thématiques dans les semaines qui suivent, puis à six pôles et vingt-deux thématiques le 1er octobre 2026.", 1)
    if nom == "contact.html":
        html = html.replace("P&ocirc;le II &middot; 11 th&eacute;matiques</span>\n          <h3>D&eacute;veloppement humain &amp; moyens d&rsquo;existence</h3>\n          <p>Agriculture, eau, sant&eacute;, jeunesse, femmes et inclusion.</p>",
                            "P&ocirc;le II &middot; 6 th&eacute;matiques</span>\n          <h3>Services essentiels</h3>\n          <p>Eau, &eacute;cole, sant&eacute;, femmes, enfance, protection sociale, sport et loisirs.</p>")
        i = html.find('<a class="pole-card action-tile" href="poles.html#pole-4">')
        k = html.find("</a>", i) + len("</a>")
        if i > 0 and "poles.html#pole-5" not in html:
            tuile = ('\n        <a class="pole-card action-tile" href="poles.html#pole-5">\n          <span class="action-icon"><svg viewBox="0 0 24 24" fill="none" '
                     'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><path d="M5 20V10l4-3 4 3v10"/>'
                     '<path d="M13 20v-6h6v6"/><path d="M9 13v2"/></svg></span>\n          <span class="pole-num">P&ocirc;le V &middot; 3 th&eacute;matiques</span>\n'
                     '          <h3>&Eacute;conomie &amp; ressources naturelles</h3>\n          <p>Agriculture, &eacute;levage, entreprises, environnement et ressources naturelles.</p>\n        </a>'
                     '\n        <a class="pole-card action-tile" href="poles.html#pole-6">\n          <span class="action-icon"><svg viewBox="0 0 24 24" fill="none" '
                     'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19h16"/><path d="M6 19 10 5h4l4 14"/>'
                     '<path d="M12 9v2"/><path d="M12 14v2"/></svg></span>\n          <span class="pole-num">P&ocirc;le VI &middot; 3 th&eacute;matiques</span>\n'
                     '          <h3>Infrastructures, territoire &amp; risques</h3>\n          <p>Routes et urbanisme, &eacute;nergie, urgences et risques.</p>\n        </a>')
            html = html[:k] + tuile + html[k:]
        html = html.replace("Direction d’un pôle — rang de chef de projet", "Vice-présidence d’un pôle — fonction élue")
        html = html.replace("<option>Direction du pôle II — Développement humain &amp; moyens d’existence</option>",
                            f"<option>Direction du pôle II — {P2_FR}</option>")
        html = html.replace("<option>Direction du pôle IV — Numérique &amp; innovation</option>\n",
                            f"<option>Direction du pôle IV — Numérique &amp; innovation</option>\n                  <option>Direction du pôle V — {P5_FR}</option>\n"
                            f"                  <option>Direction du pôle VI — {P6_FR}</option>\n", 1)
        html = html.replace("<option>Direction du pôle ", "<option>Vice-présidence du pôle ")
        html = html.replace("<label for=\"pole\">Thématique, ou direction d’un pôle</label>", "<label for=\"pole\">Thématique, ou vice-présidence d’un pôle</label>")
        # 01/10/2026 : les vice-présidences sont élues ; le formulaire ne parle plus de « diriger un pôle »
        for _a, _b in (("la coordonner, ou diriger un pôle</option>", "la coordonner, ou se présenter à une vice-présidence de pôle</option>"),
                       ("<legend>Si vous voulez rejoindre une thématique ou diriger un pôle</legend>",
                        "<legend>Si vous voulez rejoindre une thématique ou vous présenter à une vice-présidence</legend>"),
                       ("cette thématique, ou pour diriger ce pôle</label>", "cette thématique, ou à la vice-présidence de ce pôle</label>")):
            html = html.replace(_a, _b)
        # listes de thématiques : un groupe « Pôle V » après le pôle IV
        def groupes(m):
            bloc, ind = m.group(0), m.group(1)
            opts = re.findall(r"\s*<option>(?:04|05|06|08|20|21)\. [^<]*</option>", bloc)
            for o in opts:
                bloc = bloc.replace(o, "", 1)
            return bloc, ind, opts
        for m in list(re.finditer(r'(\s*)<optgroup label="Pôle II — Développement humain &amp; moyens d’existence">.*?</optgroup>', html, flags=re.S))[::-1]:
            bloc, ind, opts = groupes(m)
            bloc = bloc.replace("Développement humain &amp; moyens d’existence", P2_FR)
            html = html[:m.start()] + bloc + html[m.end():]
            j = html.find('<optgroup label="Pôle IV', m.start())
            j = html.find("</optgroup>", j) + len("</optgroup>")
            o5 = [o for o in opts if re.search(r"<option>(04|05|06)\.", o)]
            o6 = [o for o in opts if o not in o5]
            html = (html[:j] + f'{ind}<optgroup label="Pôle V — {P5_FR}">' + "".join(o5) + f"{ind}</optgroup>"
                    + f'{ind}<optgroup label="Pôle VI — {P6_FR}">' + "".join(o6) + f"{ind}</optgroup>" + html[j:])
    for a in ANCIEN_P2:
        html = html.replace(f"<h2>{a}</h2>", f"<h2>{P2_FR}</h2>")
        html = html.replace(f'<span class="coord-pole">{a}</span>', f'<span class="coord-pole">{P2_FR}</span>')
        html = html.replace(f"Pôle II &mdash; {a}</button>", f"Pôle II &mdash; {P2_FR}</button>")
        html = html.replace(f'<a href="#pole-2">{a}</a>', f'<a href="#pole-2">{P2_FR}</a>')
    if nom == "poles.html" and 'data-filter="5"' not in html:
        html = html.replace('aria-controls="pole-1 pole-2 pole-3 pole-4 cellules"', 'aria-controls="pole-1 pole-2 pole-3 pole-4 pole-5 pole-6 cellules"')
        i = html.find('data-filter="4" aria-controls="pole-4">')
        k = html.find("</button>", i) + len("</button>")
        if i > 0:
            html = (html[:k] + f'\n      <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="5" aria-controls="pole-5">Pôle V &mdash; {P5_FR}</button>'
                    f'\n      <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="6" aria-controls="pole-6">Pôle VI &mdash; {P6_FR}</button>' + html[k:])
        i = html.find('<li><a href="#pole-4">')
        k = html.find("</li>", i) + len("</li>")
        if i > 0:
            html = html[:k] + f'<li><a href="#pole-5">{P5_FR}</a></li><li><a href="#pole-6">{P6_FR}</a></li>' + html[k:]
    if est_en:
        html = re.sub(r'<p class="prose-note">Everyday life and the future: feeding, treating, teaching, connecting and doing business in B&eacute;djondo\.',
                      '<p class="prose-note">Essential services: water and sanitation, school, health, women and social protection in B&eacute;djondo.', html)
        html = html.replace("Pillar Lead (programme-manager level):", "Pillar Vice-President (elected):")
        html = html.replace("lead one of the pillars still without a Pillar Lead (programme-manager level; posts created on 28 September 2026, see the themes page),",
                            "stand for election as Vice-President of one of the pillars still without one (see the themes page),")
        html = html.replace("<h3>II &mdash; Human Development &amp; Livelihoods</h3>", f"<h3>II &mdash; {P2_EN} &middot; V &mdash; {P5_EN} &middot; VI &mdash; {P6_EN}</h3>")
        html = html.replace("Human Development &amp; Livelihoods; Governance", f"{P2_EN}; Governance")
        html = html.replace("Digital &amp; Innovation), twenty-one themes", f"Digital &amp; Innovation; {P5_EN}; {P6_EN}), twenty-one themes")
        html = html.replace("<h3>II — Human Development &amp; Livelihoods</h3>", f"<h3>II — {P2_EN} · V — {P5_EN} · VI — {P6_EN}</h3>")
        html = html.replace("<h2>Human Development &amp; Livelihoods</h2>", f"<h2>{P2_EN}</h2>")
    # 3. comptes : quatre pôles → cinq (hors textes datés et charte)
    if nom == "redevabilite.html":
        html = html.replace("vingt et une depuis le 30 septembre) r&eacute;parties en quatre p&ocirc;les,",
                            "vingt et une depuis le 30 septembre, vingt-deux depuis le 1er octobre 2026) r&eacute;parties en quatre p&ocirc;les (six depuis le 1er octobre 2026),")
    elif nom == "identite-visuelle.html":
        if NOTE_IDENTITE_01_10 not in html:
            html = html.replace("<h3>Les quatre p&ocirc;les</h3>", "<h3>Les quatre p&ocirc;les</h3>\n" + NOTE_IDENTITE_01_10, 1)
        html = html.replace("P&ocirc;le II, D&eacute;veloppement humain &middot;", "P&ocirc;le II, Services essentiels (D&eacute;veloppement humain jusqu&rsquo;au 1er octobre 2026) &middot;")
    elif nom != "actualites.html":
        for i, g in enumerate(_GARDES_01_10):
            html = html.replace(g, f"@@G{i}@@")
        for rx, rep_ in COMPTES_RE_01_10:
            html = re.sub(rx, rep_, html)
        for i, g in enumerate(_GARDES_01_10):
            html = html.replace(f"@@G{i}@@", g)
    return html


# ----------------------------------------------------------------------------
# 01/10/2026, après-midi (registre 2026-35) : des nombres pairs — six pôles (le pôle V partagé, voir structure_01_10)
# et vingt-deux thématiques : la 22, Sport, arts & loisirs, rejoint le pôle II, Services essentiels. Aucune thématique
# n'est supprimée ni renumérotée. Appliqué après structure_01_10, avant comptes_courants.
SPORT_ID = "sport-arts-loisirs"
BALLON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
          'stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a14 14 0 0 1 0 18"/>'
          '<path d="M12 3a14 14 0 0 0 0 18"/><path d="M3 12h18"/></svg>')
SPORT_TEXTE = ("Le sport, la musique, la danse, le théâtre et les fêtes qui font vivre Bédjondo et ses quartiers&nbsp;: terrains "
               "et équipes de jeunes, troupes et artistes, lieux où se retrouvent toutes les générations. La thématique commence "
               "par recenser ce qui existe — clubs, associations, terrains, salles, festivals — avant de proposer quoi que ce soit, "
               "avec <a href=\"poles.html#jeunesse-reussite\">Éducation, jeunesse &amp; formation</a>, "
               "<a href=\"poles.html#culture-patrimoine-vivant\">Culture &amp; patrimoine vivant</a> pour les arts traditionnels, "
               "et le projet de <a href=\"complexe-sportif.html\">complexe sportif</a> annoncé par l&rsquo;association. "
               "<strong>Thématique créée le 1er octobre 2026</strong>&nbsp;; rien n&rsquo;est encore engagé.")
CHIP_3_4 = ('<a class="odd-chip" href="odd.html#odd-3" style="--odd-accent:#4C9F38;--odd-ink:#10181f" title="ODD 3 &mdash; Bonne '
            'sant&eacute; et bien-&ecirc;tre | cible 3.4 &mdash; sant&eacute; mentale et bien-&ecirc;tre"><span class="odd-num">3</span>'
            '<span class="odd-name">Sant&eacute;</span><span class="odd-cible">3.4</span></a>')
CHIP_11_7 = ('<a class="odd-chip" href="odd.html#odd-11" style="--odd-accent:#FD9D24;--odd-ink:#10181f" title="ODD 11 &mdash; Villes '
             'et communaut&eacute;s durables | cible 11.7 &mdash; espaces publics s&ucirc;rs et ouverts &agrave; tous"><span class="odd-num">11</span>'
             '<span class="odd-name">Villes durables</span><span class="odd-cible">11.7</span></a>')
SPORT_CARTE = f"""
        <article class="pole-card" id="{SPORT_ID}">
          <div class="pole-head-row">
            <span class="pole-icon">{BALLON}</span>
            <span class="pole-num">THÉMATIQUE 22</span>
          </div>
          <span class="pole-status pole-status--vacant">À pourvoir</span>
          <h3>Sport, arts &amp; loisirs</h3>
          <p class="coord">Coordonnateur&nbsp;: à pourvoir</p>
          <p>{SPORT_TEXTE}</p>
          <div class="pole-tags"><span class="tag">Sport</span><span class="tag">Arts</span><span class="tag">Loisirs</span><span class="tag">Jeunesse</span></div>
          <div class="pole-odd"><span class="odd-legend">ODD</span>{CHIP_3_4}{CHIP_11_7}</div>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="complexe-sportif.html">Projet de complexe sportif &rarr;</a>
          <a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=22">Rejoindre cette th&eacute;matique &rarr;</a>
          </div>
        </article>"""
SPORT_EN = f"""
        <article class="pole-card">
          <div class="pole-head-row"><span class="pole-num">THEME 22</span></div>
          <span class="pole-status pole-status--vacant">Open</span>
          <h3>Sport, Arts &amp; Leisure</h3>
          <p class="coord">Coordinator: to be appointed</p>
          <p>The sport, music, dance, theatre and festivities that bring B&eacute;djondo and its neighbourhoods to life: pitches and youth teams, troupes and artists, places where every generation meets. The theme starts by listing what exists &mdash; clubs, associations, pitches, halls, festivals &mdash; before proposing anything. Created on 1 October 2026; nothing is committed yet.</p>
          <div class="pole-odd"><span class="odd-legend">SDG</span><a class="odd-chip" href="#sdg-3" style="--odd-accent:#4C9F38;--odd-ink:#10181f" title="SDG 3 &mdash; Good Health and Well-being | target 3.4 &mdash; mental health and well-being"><span class="odd-num">3</span><span class="odd-name">Health</span><span class="odd-cible">3.4</span></a><a class="odd-chip" href="#sdg-11" style="--odd-accent:#FD9D24;--odd-ink:#10181f" title="SDG 11 &mdash; Sustainable Cities and Communities | target 11.7 &mdash; safe, inclusive public spaces"><span class="odd-num">11</span><span class="odd-name">Cities</span><span class="odd-cible">11.7</span></a></div>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="../poles.html#{SPORT_ID}">Full description <span>(in French)</span> &rarr;</a>
          </div>
        </article>"""
SPORT_JS = f"""  {{
    "id": "{SPORT_ID}",
    "num": "22",
    "key": "22",
    "pole": "Pôle II · Thématique 22",
    "name": "Sport, arts & loisirs",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Le sport, la musique, la danse, le théâtre et les fêtes qui font vivre Bédjondo et ses quartiers : terrains, équipes, troupes, lieux de rencontre.",
    "page": [
      "complexe-sportif.html",
      "Projet de complexe sportif"
    ],
    "suivi": true,
    "tier": 2
  }},
"""
SPORT_SUIVI = (f'<article class="pole-card" id="{SPORT_ID}"><div class="pole-head-row"><span class="pole-icon">{BALLON}</span>'
               '<span class="pole-num">THÉMATIQUE 22</span></div><span class="pole-status pole-status--vacant">À pourvoir</span>'
               f'<h3><a href="poles.html#{SPORT_ID}">Sport, arts &amp; loisirs</a></h3><p class="kanban-card-meta">Aucune problématique '
               'reliée pour l&rsquo;instant &mdash; thématique créée le 1er octobre 2026</p><div class="pole-hub-links">'
               f'<a class="pole-hub-link pole-hub-link--join" href="poles.html#{SPORT_ID}">Voir la fiche thématique &rarr;</a></div></article>')
COMPTES_RE_SPORT = [
    (r"\bvingt et une(\s+|&nbsp;)th(é|&eacute;)matiques", r"vingt-deux\1th\2matiques"),
    (r"\bVingt et une(\s+|&nbsp;)th(é|&eacute;)matiques", r"Vingt-deux\1th\2matiques"),
    (r"\b21(\s+|&nbsp;)th(é|&eacute;)matiques", r"22\1th\2matiques"),
    (r"\bvingt et une(\s+)coordinations", r"vingt-deux\1coordinations"),
    (r"\btwenty-one(\s+)themes", r"twenty-two\1themes"),
    (r"\bTwenty-one(\s+)themes", r"Twenty-two\1themes"),
    (r"\b21(\s+)themes", r"22\1themes"),
    (r"themes out of twenty-one\b", "themes out of twenty-two"),
    (r'<span class="bento-num">21</span><span class="bento-label">themes', '<span class="bento-num">22</span><span class="bento-label">themes'),
]


def _apres_article(html: str, ident_ou_marque: str, ajout: str) -> str:
    i = html.find(ident_ou_marque)
    k = html.find("</article>", i)
    return html[:k + len("</article>")] + ajout + html[k + len("</article>"):] if i > 0 and k > 0 else html


def structure_sport(html: str, path: Path) -> str:
    if "articles" in path.parts:
        return html
    nom = path.name
    est_en = "en" in path.parts
    if nom == "poles.html" and f'id="{SPORT_ID}"' not in html:
        html = _apres_article(html, '<article class="pole-card" id="solidarite-inclusion">', SPORT_CARTE)
        m = re.search(r'<a class="coord-row" href="poles\.html#solidarite-inclusion">.*?</a>', html, re.S)
        if m:
            html = html[:m.end()] + (f'\n        <a class="coord-row" href="poles.html#{SPORT_ID}"><span class="coord-etat">&Agrave; pourvoir</span>'
                                     f'<span class="coord-nom">Sport, arts &amp; loisirs</span><span class="coord-pole">{P2_FR}</span>'
                                     '<span class="coord-qui coord-qui--vide">à pourvoir</span></a>') + html[m.end():]
    if nom == "suivi.html" and f'id="{SPORT_ID}"' not in html:
        html = _apres_article(html, '<article class="pole-card" id="solidarite-inclusion">', SPORT_SUIVI)
    if nom == "themes.html" and est_en and "THEME 22" not in html:
        html = _apres_article(html, '<span class="pole-num">THEME 12</span>', SPORT_EN)
    if nom == "contact.html" and "<option>22." not in html:
        html = re.sub(r"(<option>12\. [^<]*</option>\n)(\s*)", lambda m: m.group(1) + m.group(2) + "<option>22. Sport, arts &amp; loisirs</option>\n" + m.group(2), html)
    if nom == "trouver.js" and f'"id": "{SPORT_ID}"' not in html:
        i = html.find('    "id": "gouvernance-plaidoyer",')
        i = html.rfind("  {", 0, i)
        if i > 0:
            html = html[:i] + SPORT_JS + html[i:]
        j = html.find('  "educ": {')
        s_ = html.find('"s": [', j)
        if j > 0 and s_ > 0:
            html = html[:s_ + len('"s": [')] + f'\n      "{SPORT_ID}",' + html[s_ + len('"s": ['):]
        j = html.find('"terrain": {')
        s_ = html.find('"ids": [', j)
        if j > 0 and s_ > 0:
            html = html[:s_ + len('"ids": [')] + f'\n      "{SPORT_ID}",' + html[s_ + len('"ids": ['):]
    if nom not in ("actualites.html", "redevabilite.html"):
        for rx, rep_ in COMPTES_RE_SPORT:
            html = re.sub(rx, rep_, html)
    elif nom == "redevabilite.html":
        html = re.sub(r"(Les noms de nos |Deux de nos )vingt et une(\s+th(?:é|&eacute;)matiques)", r"\1vingt-deux\2", html)
    return html


def ancres_en(html: str, path: Path) -> str:
    """Page anglaise des thématiques : chaque carte reçoit une ancre (#theme-04…), et les renvois de l'index des ODD
    mènent à la carte plutôt qu'en haut de la liste (1er octobre 2026)."""
    if path.name != "themes.html" or "en" not in path.parts:
        return html
    html = re.sub(r'<article class="pole-card">(\s*<div class="pole-head-row"><span class="pole-num">THEME (\d{2})</span>)',
                  r'<article class="pole-card" id="theme-\2">\1', html)
    return re.sub(r'<a href="#theme-list">(\d{2}) &middot;', r'<a href="#theme-\1">\1 &middot;', html)


# ----------------------------------------------------------------------------
# 02/10/2026 : revue des pôles face aux références ONG, ONU et World Vision.
# La thématique 12 couvre la protection de l'enfance depuis le 29 septembre : ses cibles ODD le disent
# (16.2 violences contre les enfants, 16.9 état civil, 5.3 mariages précoces), sur sa carte, dans le résumé
# du pôle II et dans l'index des ODD (FR et EN). La 09 renvoie le sport à la thématique 22 (décision 2026-35).
ODD12_FR = [("16", "16.2&thinsp;/&thinsp;16.9", "cible 16.2 &mdash; mettre fin &agrave; la maltraitance et &agrave; la violence envers les enfants &middot; cible 16.9 &mdash; identit&eacute; juridique pour tous, dont l&rsquo;&eacute;tat civil"),
            ("5", "5.3", "cible 5.3 &mdash; &eacute;liminer les mariages d&rsquo;enfants, pr&eacute;coces ou forc&eacute;s")]
ODD12_EN = [("16", "16.2&thinsp;/&thinsp;16.9", "target 16.2 &mdash; end abuse and violence against children &middot; target 16.9 &mdash; legal identity for all, including civil registration"),
            ("5", "5.3", "target 5.3 &mdash; eliminate child, early and forced marriage")]
NOTE_09_FR = (" <strong>Mise à jour du 2 octobre 2026&nbsp;:</strong> le sport, les arts et les loisirs ont leur propre thématique "
              "depuis le 1er octobre, la 22, Sport, arts &amp; loisirs (décision 2026-35) ; la 09 y garde le lien avec les jeunes.")
NOTE_09_EN = (" <strong>Update, 2 October 2026:</strong> sport, arts and leisure have had their own theme since 1 October, "
              "theme 22, Sport, Arts &amp; Leisure; theme 09 keeps the link with young people.")


def _chip_modele(html: str, odd: str, en: bool) -> str | None:
    m = re.search(r'<a class="odd-chip" href="[^"]*(?:odd|sdg)-' + odd + r'"[^>]*>.*?</a>', html, re.S)
    return m.group(0) if m else None


def _chip_cible(modele: str, cible: str, titre_cibles: str) -> str:
    chip = re.sub(r'<span class="odd-cible">.*?</span>', f'<span class="odd-cible">{cible}</span>', modele)
    return re.sub(r'title="([^"|]*)\|[^"]*"', lambda m: f'title="{m.group(1)}| {titre_cibles}"', chip)


def _ajouter_note(html: str, debut_article: str, note: str) -> str:
    i = html.find(debut_article)
    if i < 0 or note.strip()[:30] in html[i:html.find("</article>", i)]:
        return html
    c = html.find('<p class="coord">', i)
    j = html.find("<p>", c + 1)
    k = html.find("</p>", j)
    return html[:k] + note + html[k:] if 0 < j < html.find("</article>", i) and k > 0 else html


def _cible_cle(c: str) -> tuple:
    return tuple(int(x) if x.isdigit() else ord(x[0]) + 1000 for x in re.split(r"\.", c))


def _resumes_odd(html: str, en: bool) -> str:
    """Le résumé « Cibles ODD visées » de chaque pôle reprend exactement les cibles de ses cartes, triées par ODD
    puis par cible (une cible ajoutée à une carte y apparaît ; 02/10/2026)."""
    out, pos = [], 0
    for m in re.finditer(r'<div class="pole-odd-sum">.*?</div>', html, re.S):
        s0 = html.rfind("<section", 0, m.start())
        s1 = html.find("</section>", m.end())
        sec = html[s0:s1]
        cibles = {}
        for ch in re.finditer(r'<a class="odd-chip" href="([^"]*?(?:odd|sdg)-(\d+))" style="([^"]*)" title="([^"|]*)\| ([^"]*)">.*?<span class="odd-cible">(.*?)</span></a>', sec, re.S):
            href, num, style, tete, detail, cs = ch.groups()
            parts = re.split(r" &middot; | · ", detail)
            for k, c in enumerate(re.split(r"&thinsp;/&thinsp;|\s/\s|/", cs)):
                c = c.strip()
                if c and (num, c) not in cibles:
                    titre = parts[k] if k < len(parts) else parts[-1]
                    cibles[(num, c)] = (href, style, tete, titre)
        if not cibles:
            continue
        sr = "SDG {n}, target " if en else "ODD {n}, cible "
        points = "".join(
            f'<a class="odd-dot odd-dot--cible" href="{h}" style="{st}" title="{te}| {ti}"><span class="sr-only">{sr.format(n=n)}</span>{c}</a>'
            for (n, c), (h, st, te, ti) in sorted(cibles.items(), key=lambda kv: (int(kv[0][0]), _cible_cle(kv[0][1]))))
        legende = re.match(r'<div class="pole-odd-sum">(<span class="odd-legend">.*?</span>)', m.group(0), re.S)
        out.append(html[pos:m.start()] + '<div class="pole-odd-sum">' + (legende.group(1) if legende else "") + points + "</div>")
        pos = m.end()
    return "".join(out) + html[pos:]


def odd_enfance(html: str, path: Path) -> str:
    if "articles" in path.parts:
        return html
    nom, en = path.name, "en" in path.parts
    cibles = ODD12_EN if en else ODD12_FR
    if (nom == "poles.html" and not en) or (nom == "themes.html" and en):
        debut = '<article class="pole-card" id="theme-12">' if en else '<article class="pole-card" id="solidarite-inclusion">'
        i = html.find(debut)
        fin = html.find("</article>", i)
        bloc = html[i:fin]
        if i >= 0 and "16.2" not in bloc:
            d = bloc.find('<div class="pole-odd">')
            e = bloc.find("</div>", d)
            ajout = "".join(_chip_cible(_chip_modele(html, o, en), c, t) for o, c, t in cibles if _chip_modele(html, o, en))
            if d >= 0 and ajout:
                bloc = bloc[:e] + ajout + bloc[e:]
                html = html[:i] + bloc + html[fin:]
        html = _resumes_odd(html, en)
        html = _ajouter_note(html, '<article class="pole-card" id="theme-09">' if en else '<article class="pole-card" id="jeunesse-reussite">',
                             NOTE_09_EN if en else NOTE_09_FR)
    if nom == "themes.html" and en:
        # la 07 anglaise gardait les cibles de l'ancienne « Eau, énergie & connectivité » (6.1 et 9.c) : comme en
        # français, 6.1 et 6.2, la connectivité étant passée à la 17 le 29 septembre
        i = html.find('<article class="pole-card" id="theme-07">')
        fin = html.find("</article>", i)
        if i >= 0:
            bloc = html[i:fin]
            bloc = re.sub(r'<a class="odd-chip" href="#sdg-9"[^>]*>.*?</a>', "", bloc, flags=re.S)
            bloc = re.sub(r'(<a class="odd-chip" href="#sdg-6"[^>]*title=")[^"]*(">.*?<span class="odd-cible">)6\.1(</span>)',
                          r"\1SDG 6 &mdash; Clean Water and Sanitation | target 6.1 &mdash; universal access to safe drinking water &middot; target 6.2 &mdash; sanitation and hygiene\g<2>6.1&thinsp;/&thinsp;6.2\3",
                          bloc, flags=re.S)
            html = html[:i] + bloc + html[fin:]
        html = re.sub(r'<a href="#theme-07">07 &middot; [^<]*<span class="odd-cible">9\.c</span></a>', "", html)
        html = re.sub(r'(<a href="#theme-07">07 &middot; [^<]*<span class="odd-cible">)6\.1(</span>)', r"\g<1>6.1&thinsp;/&thinsp;6.2\2", html)
        html = _resumes_odd(html, True)
    if (nom == "odd.html" and not en) or (nom == "themes.html" and en):
        pre = "sdg" if en else "odd"
        lien = ('<a href="#theme-12">12 &middot; Social Protection, Children &amp; Inclusion <span class="odd-cible">{c}</span></a>' if en else
                '<a href="poles.html#solidarite-inclusion">12 &middot; Protection sociale, enfance &amp; inclusion <span class="odd-cible">{c}</span></a>')
        for o, c, _t in cibles:
            i = html.find(f'id="{pre}-{o}"')
            if i < 0:
                continue
            j = html.find('<div class="odd-row-links">', i) + len('<div class="odd-row-links">')
            k = html.find("</div>", j)
            ligne = html[j:k]
            if "12 &middot;" in ligne:
                continue
            pos = k
            for mm in re.finditer(r'<a href="[^"]*">(\d{2}) &middot;', ligne):
                if int(mm.group(1)) > 12:
                    pos = j + mm.start()
                    break
            html = html[:pos] + lien.format(c=c) + html[pos:]
    return html


# ----------------------------------------------------------------------------
# 02/10/2026 : repères internationaux sous les cibles ODD de chaque thématique (revue face aux références ONG,
# ONU et World Vision du même jour). Les titres ne changent pas avant l'élection du 22 octobre : un bailleur
# retrouve ses repères sans renommage. Par numéro : (cluster humanitaire de l'IASC, domaine ou modèle World Vision,
# pilier du plan « Tchad Connexion 2030 ») ; None = aucun équivalent.
# Données : content/reperes.json (lu aussi par lib/reperes.ts pour la page /programmes).
_REPERES = json.loads((ROOT / "content" / "reperes.json").read_text(encoding="utf-8"))
REPERES_FR = {k: (v["cluster"], v["worldVision"], v["tchadConnexion2030"]) for k, v in _REPERES["fr"].items()}
REPERES_EN = {k: (v["cluster"], v["worldVision"], v["tchadConnexion2030"]) for k, v in _REPERES["en"].items()}
REPERES_SANS = {k: (v["fr"], v["en"]) for k, v in _REPERES["sans"].items()}


def _ligne_reperes(num: str, en: bool) -> str:
    cl, wv, pnd = (REPERES_EN if en else REPERES_FR).get(num, (None, None, None))
    legende = ('<span class="odd-legend">Benchmarks</span>' if en else
               '<span class="odd-legend">Repères</span>')
    if not (cl or wv or pnd):
        fr, eng = REPERES_SANS.get(num, (_REPERES["defaut"]["fr"], _REPERES["defaut"]["en"]))
        return f'<p class="pole-reperes">{legende} <span>{eng if en else fr}</span></p>'
    noms = ("Humanitarian cluster", "World Vision", "Tchad Connexion 2030") if en else \
           ("Cluster humanitaire", "World Vision", "Tchad Connexion 2030")
    sep = ": " if en else "&nbsp;: "
    morceaux = [f"<span><strong>{n}</strong>{sep}{v}</span>" for n, v in zip(noms, (cl, wv, pnd)) if v]
    return f'<p class="pole-reperes">{legende} ' + " ".join(morceaux) + "</p>"


def reperes_internationaux(html: str, path: Path) -> str:
    nom, en = path.name, "en" in path.parts
    if not ((nom == "poles.html" and not en) or (nom == "themes.html" and en)) or 'class="pole-reperes"' in html:
        return html
    out, pos = [], 0
    for m in re.finditer(r'<article class="pole-card"[^>]*>', html):
        fin = html.find("</article>", m.end())
        num = re.search(r'<span class="pole-num">[^<]*?(\d{2})</span>', html[m.end():fin])
        d = html.find('<div class="pole-odd">', m.end(), fin)
        if not num or d < 0:
            continue
        e = html.find("</div>", d) + len("</div>")
        out.append(html[pos:e] + "\n" + _ligne_reperes(num.group(1), en))
        pos = e
    return "".join(out) + html[pos:]


def lire_source(path: Path) -> str:
    """Lit un fichier de l'ancien site en y appliquant les mises à jour de source."""
    html = path.read_text(encoding="utf-8")
    for old, new in UPDATES_SOURCE + nominations_source():
        html = html.replace(old, new)
    # note datée à la fin de la description de la carte concernée (poles.html, en/themes.html)
    for coord, note, fichiers in NOTES_COORDINATION:
        i = html.find(coord)
        if i < 0 or path.name not in fichiers:
            continue
        j = html.find("<p>", i + len(coord) - 4)
        k = html.find("</p>", j)
        if j > 0 and k > 0:
            html = html[:k] + note + html[k:]
    html = reperes_internationaux(odd_enfance(ancres_en(structure_sport(structure_01_10(structure_30_09(corrections_revue(structure_29_09(html, path), path), path), path), path), path), path), path)
    if path.name == "kit-mobilisation.html":
        html = kit_liens(html)
    html = numero_en_icone(html, path)
    if "articles" not in path.parts and path.name not in ("actualites.html", "en--news.html", "news.html"):
        html = nomenclature(html, path)   # jamais dans les articles datés ni dans leurs résumés (actualites.html)
    return html if "articles" in path.parts else comptes_courants(html)


def _variantes(nom: str) -> list[str]:
    """Les écritures HTML d'un même intitulé : & / &amp;, ’ / &rsquo; / '."""
    out = {nom}
    for a, b in (("&", "&amp;"), ("’", "&rsquo;"), ("’", "'"), ("É", "&Eacute;"), ("é", "&eacute;")):
        out |= {v.replace(a, b) for v in list(out)}
    return sorted(out, key=len, reverse=True)


def nomenclature(html: str, path: Path) -> str:
    """5/10/2026 : les intitulés des thématiques suivent la nomenclature des bailleurs (content/nomenclature.json) :
    secteurs CAD de l'OCDE, clusters, ODD. Les anciens noms sont remplacés dans les pages (jamais dans les articles
    datés du journal) ; les numéros et les adresses ne bougent pas. « Énergie » / « Energy », mots courants, ne sont
    remplacés que comme intitulés (balise, numéro ou puce devant)."""
    data = json.loads((ROOT / "content" / "nomenclature.json").read_text(encoding="utf-8"))
    en = path.parts[:1] == ("en",) or "/en/" in str(path)
    for t in data["thematiques"]:
        ancien, nouveau = (t["ancienEn"], t["en"]) if en else (t["ancien"], t["fr"])
        if en and t["num"] == "21" or not en and t["num"] == "21":
            for v in _variantes(ancien):
                pre = r"(>|→ |&rarr; |thématique |theme |" + t["num"] + r"\. |" + t["num"] + r" &middot; |" + t["num"] + r" · )"
                html = re.sub(pre + re.escape(v) + r"(?=<| →| &rarr;| &middot;| ·| <span|\.|,)", lambda m, n=nouveau: m.group(1) + n, html)
            continue
        for v in _variantes(ancien):
            html = html.replace(v, nouveau.replace("&", "&amp;") if "&amp;" in v else nouveau)
    return html


ICONE_APPEL = ('<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
               'stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path></svg>')


def numero_en_icone(html: str, path: Path) -> str:
    """Le numéro du président ne s'affiche plus en clair (demande du 2 octobre 2026, étendue le 3 octobre) : un lien
    d'appel avec l'icône du téléphone le remplace ; « WhatsApp au … » devient un lien WhatsApp. Le lien tel: reste."""
    import importlib.util as _iu
    spec = _iu.spec_from_file_location("org", Path(__file__).with_name("org.py")); org = _iu.module_from_spec(spec); spec.loader.exec_module(org)
    chiffres = re.sub(r"\D", "", org.TELEPHONE)
    sep = r"(?:\s|&nbsp;|&#160;|\u00a0|\u202f|\.|-)?"
    esp = r"(?:\s|&nbsp;|&#160;|\u00a0)"
    num = r"\+?" + sep.join(chiffres[:3]) + sep + sep.join(chiffres[3:])
    en = path.parts[:1] == ("en",) or "/en/" in str(path)
    libelle, aria = ("call", "Call the association") if en else ("appeler", "Appeler l’association")
    wa = org.WHATSAPP
    tel = r'<a href="(tel:[^"]+)">(?:<strong>)?' + num + r'(?:</strong>)?</a>'
    appel = lambda m: f'<a class="lien-appel" href="{m.group(1)}" aria-label="{aria}" title="{aria}">{ICONE_APPEL}<span>{libelle}</span></a>'
    # « par WhatsApp au <numéro> » : le lien WhatsApp suffit
    html = re.sub(r"(par|ou)" + esp + "WhatsApp" + esp + "au" + esp + tel, lambda m: f'{m.group(1)} <a href="{wa}" rel="noopener" target="_blank">WhatsApp</a>', html)
    # « … au <numéro> » : deux-points et lien d'appel
    html = re.sub(esp + "au" + esp + tel, lambda m: "&nbsp;: " + appel(m), html)
    html = re.sub(tel, appel, html)
    # texte d'un lien WhatsApp ou étiquette qui portait le numéro
    html = re.sub(r"(WhatsApp)" + esp + "au" + esp + num, r"\1", html)
    html = re.sub(r"(WhatsApp)" + esp + "?:" + esp + num + esp, r"\1 ", html)
    return html


def kit_liens(html: str) -> str:
    """Kit de mobilisation : chaque message à copier finissait par « {url} », que remplissait un script de l'ancien
    site (absent ici) : on écrit l'adresse absolue de la page visée (attribut data-kit-url), pour qu'un message
    copié sur WhatsApp ou Facebook porte un vrai lien (1er octobre 2026)."""
    def rep(m):
        cible = rewrite_href(m.group(2), "")
        return m.group(1) + m.group(3).replace("{url}", "https://lonodji.org" + ("" if cible == "/" else cible))
    return re.sub(r'(<textarea[^>]*data-kit-url="([^"]*)"[^>]*>)(.*?)(?=</textarea>)', rep, html, flags=re.S)


# ---------------------------------------------------------------------------
# Revue du 29 septembre 2026 : corrections exactes, rangées par fichier source dans
# scripts/corrections_fr.py et scripts/corrections_en.py (CORRECTIONS = {"mission.html": [(ancien, nouveau), …]}).
# Chaque remplacement qui ne trouve plus son texte est signalé à l'import, pour ne rien perdre en silence.
def _charger_corrections() -> dict:
    import importlib.util
    tout: dict = {}
    # corrections_fr, corrections_en, puis les relectures suivantes (corrections_revue_*.py), dans l'ordre des noms
    autres = sorted(f.stem for f in Path(__file__).parent.glob("corrections_revue_*.py"))
    for nom in ["corrections_fr", "corrections_en"] + autres:
        f = Path(__file__).with_name(nom + ".py")
        if not f.exists():
            continue
        spec = importlib.util.spec_from_file_location(nom, f)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for cle, paires in getattr(mod, "CORRECTIONS", {}).items():
            tout.setdefault(cle, []).extend(paires)
    return tout


_CORRECTIONS = None
CORRECTIONS_MANQUEES: list = []


_LIEN = re.compile(r'(<a\b[^>]*\bhref="([^"]+)"[^>]*>)(.*?)(</a>)', re.S)


def fleches_coherentes(html: str) -> str:
    """Une seule convention de flèches : → page du site, ↗ autre site, ↓ téléchargement (PDF, ZIP)."""
    def rep(m):
        ouvre, href, texte, ferme = m.groups()
        h = href.lower().split("#")[0].split("?")[0]
        if h.endswith((".pdf", ".zip")):
            texte = texte.replace("&rarr;", "&darr;").replace("→", "↓").replace("&nearr;", "&darr;").replace("↗", "↓")
        elif href.startswith(("http://", "https://")) and "lonodji.org" not in href:
            texte = texte.replace("&rarr;", "&nearr;").replace("→", "↗")
        else:
            texte = texte.replace("&nearr;", "&rarr;").replace("↗", "→")
        return ouvre + texte + ferme
    return _LIEN.sub(rep, html)


def corrections_revue(html: str, path: Path) -> str:
    global _CORRECTIONS
    if _CORRECTIONS is None:
        _CORRECTIONS = _charger_corrections()
    try:
        cle = path.relative_to(LEGACY).as_posix()
    except (ValueError, NameError):
        cle = path.name
    html = fleches_coherentes(html)
    for ancien, nouveau in _CORRECTIONS.get(cle, []):
        if ancien in html:
            html = html.replace(ancien, nouveau)
        elif nouveau not in html:
            CORRECTIONS_MANQUEES.append((cle, ancien[:70]))
    return html


def apply_updates(html: str) -> str:
    for old, new in UPDATES:
        html = html.replace(old, new)
    return html


# ----------------------------------------------------------------------------
# Scripts interactifs : rendus ré-initialisables et liens réécrits
# ----------------------------------------------------------------------------

def adapt_script(name: str, init_name: str, find: str = "", replace: str = "", root_sel: str = ""):
    src = LEGACY / name
    if not src.exists():
        return
    js = lire_source(src)
    head = js.find("(function () {")
    tail = js.rfind("})();")
    if head < 0 or tail < 0:
        raise SystemExit(f"{name} : enveloppe IIFE introuvable")
    body = js[head + len("(function () {"):tail]
    if find:
        body = body.replace(find, replace)
    # liens de l'ancien site dans les chaînes JavaScript
    def repl(m):
        target = m.group(1)
        return "'" + rewrite_href(target, "") if m.group(0).startswith("'") else '"' + rewrite_href(target, "")
    # d'abord les préfixes ouverts (« poles.html# » + id, « contact.html?theme= » + clé), puis les liens complets
    body = re.sub(r"'([a-z0-9-]+)\.html\?theme='", lambda m: "'" + rewrite_href(m.group(1) + ".html", "").split("#")[0] + "?theme='", body)
    body = re.sub(r"'([a-z0-9-]+)\.html#'", lambda m: "'" + rewrite_href(m.group(1) + ".html", "").split("#")[0] + "#'", body)
    body = re.sub(r"'([a-z0-9-]+\.html(?:[#?][^']*)?)'", lambda m: "'" + rewrite_href(m.group(1), "") + "'", body)
    body = re.sub(r'"([a-z0-9-]+\.html(?:[#?][^"]*)?)"', lambda m: '"' + rewrite_href(m.group(1), "") + '"', body)
    # l'init d'origine s'exécute au chargement ; DOMContentLoaded est déjà passé quand Next l'injecte
    body = body.replace("if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', init);\n  } else {\n    init();\n  }", "init();")
    guard = ""
    if root_sel:
        guard = ("\n  var __root = document.querySelector(" + json.dumps(root_sel) + ");"
                 "\n  if (!__root || __root.__inited) return;\n  __root.__inited = true;")
    m = re.match(r"(\s*'use strict';)", body)
    if m:
        body = m.group(1) + guard + body[m.end():]
    else:
        body = guard + body
    out = js[:head] + "window." + init_name + " = function () {" + body + "};\nwindow." + init_name + "();\n"
    (PUBLIC / name).write_text(out, encoding="utf-8")


# ----------------------------------------------------------------------------
# Programme principal
# ----------------------------------------------------------------------------

def main():
    (CONTENT / "pages").mkdir(parents=True, exist_ok=True)
    (CONTENT / "articles").mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(exist_ok=True)
    all_forms = {}
    index = {"pages": [], "articles": []}
    # comptes réels (après les nominations), pour comptes_courants()
    global COMPTES_COURANTS
    s0 = structure(BeautifulSoup(lire_source(LEGACY / "poles.html"), "lxml"))
    them0 = [t for pole in s0["poles"] for t in pole["items"]]
    COMPTES_COURANTS = (sum(1 for t in them0 if not t["filled"]), sum(1 for t in them0 if t["filled"]),
                        sum(1 for t in s0["cellules"]["items"] if not t["filled"]), len(them0))
    if COMPTES_COURANTS[0] == 0:
        print("comptes : toutes les thématiques sont pourvues — les phrases d'appel à coordonner sont à réécrire à la main")
        COMPTES_COURANTS = None

    # Pages de fond
    for name in DOSSIERS + HUB_PAGES:
        p = LEGACY / f"{name}.html"
        if not p.exists():
            print("absent :", p)
            continue
        data, forms = parse_page(p)
        data["slug"] = name
        data["route"] = HUB_ROUTES.get(name, ROUTES_DOSSIERS.get(name, "/dossiers/" + name)).split("#")[0]
        data["kind"] = "hub" if name in HUB_PAGES else "dossier"
        all_forms.update(forms)
        (CONTENT / "pages" / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        index["pages"].append({k: data[k] for k in ("slug", "route", "kind", "title", "eyebrow", "lede", "description", "parent", "words", "hasMap")})
    # Pages anglaises
    for name in EN_PAGES:
        p = LEGACY / "en" / f"{name}.html"
        if not p.exists():
            continue
        data, forms = parse_page(p)
        data["slug"] = "en/" + name
        data["route"] = "/en/" + name
        data["kind"] = "en"
        all_forms.update(forms)
        (CONTENT / "pages" / f"en--{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        index["pages"].append({k: data[k] for k in ("slug", "route", "kind", "title", "eyebrow", "lede", "description", "parent", "words", "hasMap")})

    # Articles
    news_soup = BeautifulSoup(lire_source(LEGACY / "actualites.html"), "lxml")
    cats, by_slug = journal_categories(news_soup)
    for p in sorted((LEGACY / "articles").glob("*.html")):
        data, forms = parse_page(p)
        slug = p.stem
        data["slug"] = slug
        data["route"] = "/journal/" + slug
        extra = by_slug.get(slug, {})
        data["category"] = extra.get("category", "")
        data["summary"] = extra.get("summary", data.get("description", ""))
        if not data.get("tag"):
            data["tag"] = extra.get("tag", "")
        all_forms.update(forms)
        (CONTENT / "articles" / f"{slug}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        index["articles"].append({k: data.get(k, "") for k in ("slug", "route", "title", "date", "dateLabel", "tag", "category", "summary", "readTime", "words", "byline", "pills")})
    # Articles écrits dans l'espace de rédaction (scripts/publier-article.py) : conservés tels quels
    for f in sorted((CONTENT / "articles").glob("*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if d.get("source") == "redaction" and d.get("slug") not in {a["slug"] for a in index["articles"]}:
            index["articles"].append({k: d.get(k, "") for k in ("slug", "route", "title", "date", "dateLabel", "tag", "category", "summary", "readTime", "words", "byline", "pills")})
    for a in index["articles"]:  # l'étiquette suit le nom actuel de la rubrique ; le texte daté de l'article ne change pas
        for o, n in RENOMMAGES_29_09 + [("Énergie, routes & urbanisme", "Routes & urbanisme")]:
            if a.get("tag") == o:
                a["tag"] = n
    index["articles"].sort(key=lambda a: a["date"], reverse=True)
    index["journalCategories"] = cats

    # Données structurées
    poles_soup = BeautifulSoup(lire_source(LEGACY / "poles.html"), "lxml")
    index["structure"] = structure(poles_soup)
    plea_soup = BeautifulSoup(lire_source(LEGACY / "plaidoyers.html"), "lxml")
    index["plaidoyers"] = plaidoyers(plea_soup)
    docs_soup = BeautifulSoup(lire_source(LEGACY / "documents.html"), "lxml")
    index["documents"] = documents(docs_soup)
    mission_soup = BeautifulSoup(lire_source(LEGACY / "mission.html"), "lxml")
    index["history"] = history(mission_soup)
    index["generatedFrom"] = {"legacyVersion": "2026-09-24", "files": len(list(LEGACY.rglob("*"))) }

    (CONTENT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")

    # Formulaires (le formulaire de pied de page vit hors <main> : déclaré ici)
    footer_form = BeautifulSoup('<form name="lettre-info-pied"><input type="hidden" name="_honey"><input type="email" name="email"><input type="checkbox" name="consentement"></form>', "lxml").find("form")
    all_forms.setdefault("lettre-info-pied", footer_form)
    # Formulaires des pages conçues hors de l'ancien site (app/diaspora) : mêmes noms de champs que dans la page.
    for name, html in FORMULAIRES_SITE.items():
        all_forms.setdefault(name, BeautifulSoup(html, "lxml").find("form"))
    (PUBLIC / "__forms.html").write_text(forms_html(all_forms), encoding="utf-8")

    # Ressources (pas public/og ni og-image.png : ce sont scripts/build-og.py qui les génère)
    # public/{documents,identite,kit,app} sont remplacés à l'identique par ceux de l'ancien site :
    # ne rien y ajouter à la main (les fichiers propres au site vont dans public/og, public/carte,
    # public/odeb, public/icones…).
    for d in ("documents", "identite", "kit", "app"):
        src = LEGACY / d
        if src.exists():
            dst = PUBLIC / d
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
    for f in ("favicon.svg",):
        if (LEGACY / f).exists():
            shutil.copy2(LEGACY / f, PUBLIC / f)
    # Deux PDF de l'ancien site ne se publient jamais tels quels (adresse personnelle, collecte suspendue) :
    # ils sont corrigés ici, aussitôt recopiés, pour qu'aucun import ne remette l'original en ligne.
    import subprocess
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-kit-adhesion.py"), str(LEGACY)], check=True)
    adapt_script("geo.js", "__initGeo", "var figures = document.querySelectorAll('[data-geo]');",
                 "var figures = document.querySelectorAll('[data-geo]:not([data-geo-pret])');")
    # 30/09/2026 : la liste ne montre que les cellules à pourvoir (une seule aujourd'hui) — le titre suit leur nombre.
    adapt_script("trouver.js", "__initTrouver",
                 "'<div class=\"tm-group\"><h3>Et deux cellules qui appuient toutes les thématiques</h3>",
                 "'<div class=\"tm-group\"><h3>' + (cells.length > 1 ? 'Et ' + cells.length + ' cellules transversales à pourvoir' : 'Et une cellule transversale à pourvoir') + '</h3>",
                 root_sel="[data-tm]")
    adapt_script("genealogie.js", "__initGenealogie", root_sel="#gn-outil")
    print(f"pages : {len(index['pages'])} · articles : {len(index['articles'])} · formulaires : {len(all_forms)} · "
          f"thématiques : {sum(len(p['items']) for p in index['structure']['poles'])} · plaidoyers : {len(index['plaidoyers'])} · documents : {len(index['documents'])}")
    if COMPTES_COURANTS is not None:
        for i, phrase in enumerate(phrases_comptes(*COMPTES_BASE, COMPTES_COURANTS[3])):
            if i not in COMPTES_VUS:
                print(f"correction sans effet : comptes courants · « {phrase[:60]}… »")
        print(f"comptes courants : {COMPTES_COURANTS[3]} thématiques, {COMPTES_COURANTS[1]} pourvues, {COMPTES_COURANTS[0]} à pourvoir, {COMPTES_COURANTS[2]} cellule(s) à pourvoir")
    for cle, debut in sorted(set(CORRECTIONS_MANQUEES)):
        print(f"correction sans effet : {cle} · « {debut}… »")


if __name__ == "__main__":
    main()
