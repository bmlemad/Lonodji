"""Publier au journal un brouillon exporté depuis l'espace de rédaction (/redaction).

    python3 scripts/publier-article.py brouillon.md [--date AAAA-MM-JJ] [--slug mon-slug] [--retirer]

Le fichier .md porte un en-tête (titre, chapo, rubrique, statut, auteur, date)
suivi du texte en Markdown allégé — le même que l'aperçu de l'éditeur :
« ## intertitre », paragraphes séparés par une ligne vide, listes « - » ou
« 1. », « > citation », « --- », **gras**, *italique*, [texte](https://…).

Ce que fait le script :
  1. content/articles/<date>-<slug>.json au même format que les articles importés
     (une section « prose », résumé, temps de lecture, rubrique) ;
  2. content/index.json : l'article entre dans la liste (tri par date) ;
  3. public/og/journal--<slug>.jpg : image de partage aux couleurs du site ;
  4. public/search-index.json : index de recherche régénéré.
Puis : npm run build (et déploiement). --retirer supprime l'article (fichier, index, image).

L'import de l'ancien site (import-legacy.py) conserve ces articles : ils portent
"source": "redaction".
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from datetime import date as Date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]


# ---------- Markdown allégé → HTML (miroir de rendre() dans components/redaction-app.tsx) ----------

def echapper(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def en_ligne(s: str) -> str:
    s = echapper(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(^|[^*])\*(?!\*)([^*\n]+?)\*(?!\*)", r"\1<em>\2</em>", s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+|/[^)\s]*|#[^)\s]*)\)", r'<a href="\2" rel="noopener">\1</a>', s)
    return s


def rendre(corps: str) -> str:
    out: list[str] = []
    para: list[str] = []
    liste: dict | None = None
    citation: list[str] = []

    def fermer_para():
        if para:
            out.append(f"<p>{en_ligne(' '.join(para))}</p>")
            para.clear()

    def fermer_liste():
        nonlocal liste
        if liste:
            items = "".join(f"<li>{en_ligne(i)}</li>" for i in liste["items"])
            out.append(f"<{liste['type']}>{items}</{liste['type']}>")
            liste = None

    def fermer_citation():
        if citation:
            out.append(f"<blockquote><p>{en_ligne(' '.join(citation))}</p></blockquote>")
            citation.clear()

    def tout():
        fermer_para(); fermer_liste(); fermer_citation()

    for brute in corps.replace("\r", "").split("\n"):
        l = brute.rstrip()
        if not l.strip():
            tout(); continue
        m = re.match(r"^(#{2,4})\s+(.+)$", l)
        if m:
            tout(); n = len(m.group(1)); out.append(f"<h{n}>{en_ligne(m.group(2))}</h{n}>"); continue
        m = re.match(r"^[-*]\s+(.+)$", l)
        if m:
            fermer_para(); fermer_citation()
            if not liste or liste["type"] != "ul":
                fermer_liste(); liste = {"type": "ul", "items": []}
            liste["items"].append(m.group(1)); continue
        m = re.match(r"^\d+[.)]\s+(.+)$", l)
        if m:
            fermer_para(); fermer_citation()
            if not liste or liste["type"] != "ol":
                fermer_liste(); liste = {"type": "ol", "items": []}
            liste["items"].append(m.group(1)); continue
        m = re.match(r"^>\s?(.*)$", l)
        if m:
            fermer_para(); fermer_liste(); citation.append(m.group(1)); continue
        if re.match(r"^(---|\*\*\*)$", l.strip()):
            tout(); out.append("<hr>"); continue
        fermer_liste(); fermer_citation(); para.append(l.strip())
    tout()
    return "\n".join(out)


# ---------- en-tête du fichier ----------

def lire_brouillon(chemin: Path) -> tuple[dict, str]:
    texte = chemin.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", texte, re.S)
    if not m:
        raise SystemExit("En-tête introuvable : le fichier doit commencer par une ligne « --- ».")
    meta = {}
    for ligne in m.group(1).split("\n"):
        if ":" in ligne:
            k, v = ligne.split(":", 1)
            meta[k.strip().lower()] = v.strip()
    return meta, m.group(2).strip("\n")


def slugifier(s: str) -> str:
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:60].rstrip("-")


def description(s: str, maxi: int = 160) -> str:
    t = re.sub(r"\s+", " ", s).strip()
    if len(t) <= maxi:
        return t
    coupe = t[: maxi - 1]
    return re.sub(r"[,;:\s]+$", "", coupe[: coupe.rfind(" ")]) + "…"


def date_label(d: Date) -> str:
    return f"{d.day}{'er' if d.day == 1 else ''} {MOIS[d.month - 1]} {d.year}"


# ---------- index et image ----------

def charger_index() -> dict:
    return json.loads((CONTENT / "index.json").read_text(encoding="utf-8"))


def ecrire_index(idx: dict) -> None:
    idx["articles"].sort(key=lambda a: a["date"], reverse=True)
    (CONTENT / "index.json").write_text(json.dumps(idx, ensure_ascii=False, indent=1), encoding="utf-8")


def image_partage(slug: str, titre: str, chapo: str, tag: str, label_date: str) -> None:
    sys.path.insert(0, str(ROOT / "scripts"))
    try:
        import importlib
        og = importlib.import_module("build-og")
    except Exception:
        og = None
    if og is None:
        print("image de partage : scripts/build-og.py introuvable, ignorée")
        return
    try:
        og.rendre_une(f"/journal/{slug}", titre, chapo, f"Le journal · {tag} · {label_date}", "fr")
    except SystemExit as e:
        print(f"image de partage non produite ({e}) : lancer npm run build puis scripts/build-og.py /journal/{slug}")


def regenerer_recherche() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-search-index.py")], check=False)


# ---------- principal ----------

def publier(chemin: Path, date_forcee: str | None, slug_force: str | None) -> str:
    meta, corps = lire_brouillon(chemin)
    titre = meta.get("titre", "").strip()
    if not titre:
        raise SystemExit("Titre manquant dans l'en-tête.")
    if not corps.strip():
        raise SystemExit("Le texte de l'article est vide.")
    idx = charger_index()
    cats = {c["slug"]: c["label"] for c in idx["journalCategories"] if c["slug"] != "all"}
    rubrique = re.split(r"\s", meta.get("rubrique", "vie-association"))[0].strip() or "vie-association"
    if rubrique not in cats:
        raise SystemExit(f"Rubrique inconnue « {rubrique} » ; possibles : {', '.join(cats)}")
    d = Date.fromisoformat(date_forcee or meta.get("date") or Date.today().isoformat())
    slug = f"{d.isoformat()}-{slug_force or slugifier(titre)}"
    if (CONTENT / "articles" / f"{slug}.json").exists():
        raise SystemExit(f"Un article {slug} existe déjà : choisir --slug.")
    html = rendre(corps)
    mots = len(re.sub(r"<[^>]+>", " ", html).split())
    lecture = f"{max(1, round(mots / 200))} min de lecture"
    chapo = meta.get("chapo", "").strip()
    auteur = meta.get("auteur", "").strip() or "Rédaction ADEB LONODJI"
    tag = cats[rubrique]
    label = date_label(d)
    article = {
        "legacy": "",
        "source": "redaction",
        "lang": "fr",
        "documentTitle": f"{titre} — ADEB LONODJI",
        "description": description(chapo or re.sub(r"<[^>]+>", " ", html)),
        "title": titre,
        "eyebrow": tag,
        "lede": chapo,
        "pills": [lecture, f"{mots} mots"],
        "kicker": label,
        "crumbs": ["Accueil", "Actualités"],
        "parent": "Actualités",
        "date": d.isoformat(),
        "dateLabel": label,
        "readTime": lecture,
        "byline": auteur,
        "tag": tag,
        "sections": [{"id": "", "alt": False, "cls": "prose", "tag": "section", "html": html}],
        "words": mots,
        "forms": [],
        "hasMap": False,
        "scripts": [],
        "rootAttrs": {},
        "slug": slug,
        "route": f"/journal/{slug}",
        "category": rubrique,
        "summary": description(chapo or re.sub(r"<[^>]+>", " ", html), 220),
    }
    (CONTENT / "articles" / f"{slug}.json").write_text(json.dumps(article, ensure_ascii=False, indent=1), encoding="utf-8")
    idx["articles"] = [a for a in idx["articles"] if a["slug"] != slug]
    idx["articles"].append({k: article.get(k, "") for k in ("slug", "route", "title", "date", "dateLabel", "tag", "category", "summary", "readTime", "words", "byline", "pills")})
    ecrire_index(idx)
    image_partage(slug, titre, article["description"], tag, label)
    regenerer_recherche()
    print(f"article publié dans content/ : {article['route']} ({mots} mots, {tag}) — lancer npm run build")
    return slug


def retirer(slug: str) -> None:
    f = CONTENT / "articles" / f"{slug}.json"
    if not f.exists():
        raise SystemExit(f"Aucun article {slug}.")
    data = json.loads(f.read_text(encoding="utf-8"))
    if data.get("source") != "redaction":
        raise SystemExit("Seuls les articles venus de l'espace de rédaction se retirent ici.")
    f.unlink()
    idx = charger_index()
    idx["articles"] = [a for a in idx["articles"] if a["slug"] != slug]
    ecrire_index(idx)
    img = ROOT / "public" / "og" / f"journal--{slug}.jpg"
    if img.exists():
        img.unlink()
    regenerer_recherche()
    print(f"article retiré : {slug}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fichier", help="brouillon .md exporté (ou slug avec --retirer)")
    ap.add_argument("--date", help="date de publication AAAA-MM-JJ (défaut : en-tête, sinon aujourd'hui)")
    ap.add_argument("--slug", help="fin d'adresse (défaut : dérivée du titre)")
    ap.add_argument("--retirer", action="store_true", help="retirer l'article dont le slug est donné")
    a = ap.parse_args()
    if a.retirer:
        retirer(a.fichier)
    else:
        publier(Path(a.fichier), a.date, a.slug)


if __name__ == "__main__":
    main()
