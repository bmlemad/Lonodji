"""Carte du territoire (/carte) : assemble public/carte/donnees.json.

Sources (toutes ouvertes, citées sur la page) :
  - limites administratives : GADM 4.1, niveau 3 (sous-préfectures), usage non commercial
    https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_TCD_3.json.zip
  - localités et équipements : OpenStreetMap (ODbL), exports HOT via HDX
    populated_places, education_facilities, health_facilities, points_of_interest,
    cultural_places, financial_services (https://data.humdata.org/organization/hot)
  - les 14 unités du pays bedjond (nom, groupe, notice) : content/pages/bedjondo.json
    (données de la carte du dossier Bédjondo, script data-geo-donnees)
  - liens vers le site : content/index.json et content/articles (mentions des unités)

    python3 scripts/build-carte.py            # télécharge les sources manquantes dans .cache/carte/

Sortie : public/carte/donnees.json (unités avec contours, villages OSM par unité,
équipements OSM, liens du site par unité, comptages, sources et dates).
"""
from __future__ import annotations

import io
import json
import re
import sys
import urllib.request
import zipfile
from datetime import date
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".cache" / "carte"
OUT = ROOT / "public" / "carte" / "donnees.json"
CONTENT = ROOT / "content"

GADM_URL = "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_TCD_3.json.zip"
HOT = "https://production-raw-data-api.s3.amazonaws.com/ISO3/TCD/{n}/hotosm_tcd_{n}_osm_geojson.zip"
HOT_SETS = ["populated_places", "education_facilities", "health_facilities", "points_of_interest", "cultural_places", "financial_services"]

# Traduction des étiquettes OSM en familles d'équipements affichées
FAMILLES = [
    ("ecole", lambda t: t.get("amenity") in ("school", "college", "university", "kindergarten")),
    ("sante", lambda t: t.get("amenity") in ("hospital", "clinic", "doctors", "pharmacy", "dentist") or bool(t.get("healthcare"))),
    ("eau", lambda t: t.get("man_made") in ("water_well", "water_tower", "water_works") or t.get("amenity") in ("drinking_water", "water_point")),
    ("marche", lambda t: t.get("amenity") == "marketplace" or t.get("shop") in ("supermarket", "general")),
    ("culte", lambda t: t.get("amenity") == "place_of_worship"),
    ("energie", lambda t: t.get("power") in ("plant", "substation", "generator") or t.get("amenity") == "fuel"),
    ("telecom", lambda t: t.get("man_made") in ("mast", "tower", "communications_tower") or bool(t.get("telecom") or t.get("communication:mobile_phone"))),
    ("administration", lambda t: t.get("amenity") in ("townhall", "police", "community_centre", "courthouse", "post_office") or t.get("office") in ("government", "administrative")),
    ("finance", lambda t: t.get("amenity") in ("bank", "atm", "money_transfer", "mobile_money_agent")),
]


def telecharger(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        return dest
    print("téléchargement", url)
    req = urllib.request.Request(url, headers={"User-Agent": "ADEB-LONODJI build-carte (lonodji.org)"})
    with urllib.request.urlopen(req, timeout=300) as r:
        dest.write_bytes(r.read())
    return dest


def geojson_depuis_zip(zpath: Path) -> dict:
    with zipfile.ZipFile(zpath) as z:
        name = next(n for n in z.namelist() if n.endswith(".geojson") or n.endswith(".json"))
        return json.loads(z.read(name).decode("utf-8"))


# ---------- géométrie (sans dépendance) ----------

def dans_anneau(x: float, y: float, anneau: list) -> bool:
    inside = False
    n = len(anneau)
    j = n - 1
    for i in range(n):
        xi, yi = anneau[i][0], anneau[i][1]
        xj, yj = anneau[j][0], anneau[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi:
            inside = not inside
        j = i
    return inside


def dans_geometrie(x: float, y: float, geom: dict) -> bool:
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        if dans_anneau(x, y, poly[0]) and not any(dans_anneau(x, y, trou) for trou in poly[1:]):
            return True
    return False


def boite(geom: dict) -> list:
    xs, ys = [], []
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        for p in poly[0]:
            xs.append(p[0]); ys.append(p[1])
    return [min(xs), min(ys), max(xs), max(ys)]


def centre_geom(geom: dict) -> list:
    t = geom["type"]
    c = geom["coordinates"]
    if t == "Point":
        return [round(c[0], 5), round(c[1], 5)]
    b = boite(geom) if t in ("Polygon", "MultiPolygon") else None
    if b:
        return [round((b[0] + b[2]) / 2, 5), round((b[1] + b[3]) / 2, 5)]
    if t == "LineString":
        return [round(sum(p[0] for p in c) / len(c), 5), round(sum(p[1] for p in c) / len(c), 5)]
    return [round(c[0][0][0], 5), round(c[0][0][1], 5)]


def arrondir(geom: dict, nd: int = 4) -> dict:
    def r(coords):
        if isinstance(coords[0], (int, float)):
            return [round(coords[0], nd), round(coords[1], nd)]
        return [r(c) for c in coords]
    return {"type": geom["type"], "coordinates": r(geom["coordinates"])}


# ---------- contenu du site ----------

def unites_legacy() -> dict:
    d = json.loads((CONTENT / "pages" / "bedjondo.json").read_text(encoding="utf-8"))
    for s in d["sections"]:
        m = re.search(r'<script data-geo-donnees="" type="application/json">(.*?)</script>', s["html"], re.S)
        if m:
            return json.loads(m.group(1))
    raise SystemExit("données de la carte introuvables dans content/pages/bedjondo.json")


def texte_de(html: str) -> str:
    return unescape(re.sub(r"<[^>]+>", " ", html))


def liens_par_unite(unites: dict) -> dict:
    idx = json.loads((CONTENT / "index.json").read_text(encoding="utf-8"))
    corpus = []  # (type, titre, route, texte)
    for p in idx["pages"]:
        if p["kind"] != "dossier":
            continue
        d = json.loads((CONTENT / "pages" / f"{p['slug']}.json").read_text(encoding="utf-8"))
        corpus.append(("dossier", p["title"], p["route"], texte_de(" ".join(s["html"] for s in d["sections"]))))
    for a in idx["articles"]:
        d = json.loads((CONTENT / "articles" / f"{a['slug']}.json").read_text(encoding="utf-8"))
        corpus.append(("article", a["title"], a["route"], texte_de(" ".join(s["html"] for s in d["sections"]))))
    plaid = [("plaidoyer", p["title"], p["href"], p.get("demand", "") + " " + p.get("recipients", "")) for p in idx["plaidoyers"]]
    liens = {}
    for uid, u in unites.items():
        nom = unescape(u["nom"])
        variantes = {nom, nom.replace("é", "e").replace("ï", "i"), u.get("gadm", "")}
        motif = re.compile(r"\b(" + "|".join(re.escape(v) for v in variantes if v) + r")\b", re.I)
        trouves = []
        if uid == "bedjondo":
            trouves = [{"type": "plaidoyer", "titre": t, "route": r} for _, t, r, _ in plaid]
            trouves += [{"type": "dossier", "titre": "Bédjondo, notre ville", "route": "/dossiers/bedjondo"}, {"type": "dossier", "titre": "Carte des besoins", "route": "/dossiers/besoins"}]
        else:
            for typ, titre, route, texte in corpus + plaid:
                if motif.search(texte) or motif.search(titre):
                    trouves.append({"type": typ, "titre": titre, "route": route})
        # dédoublonner, dossiers d'abord, 8 au plus
        vus, propres = set(), []
        for t in sorted(trouves, key=lambda x: {"dossier": 0, "plaidoyer": 1, "article": 2}[x["type"]]):
            if t["route"] not in vus:
                vus.add(t["route"]); propres.append(t)
        liens[uid] = propres[:8]
    return liens


# ---------- assemblage ----------

def slug_nom(nom: str) -> str:
    """« N’Djaména Ndé » → « ndjamena-nde » ; les caractères hors latin (arabe) sont ignorés."""
    import unicodedata
    t = unicodedata.normalize("NFKD", nom)
    t = "".join(ch for ch in t if not unicodedata.combining(ch))
    t = re.sub(r"[’'`]", "", t.lower())
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t


def main() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    gadm = geojson_depuis_zip(telecharger(GADM_URL, CACHE / "gadm41_TCD_3.json.zip"))
    legacy = unites_legacy()
    unites = []
    par_gadm = {f["properties"]["NAME_3"]: f for f in gadm["features"]}
    for uid, u in legacy.items():
        f = par_gadm.get(u["gadm"])
        if not f:
            print("unité sans contour GADM :", uid, u["gadm"]); continue
        geom = arrondir(f["geometry"])
        unites.append({
            "id": uid, "nom": unescape(u["nom"]), "groupe": u["groupe"], "dep": u["dep"], "prov": u["prov"],
            "notice": unescape(u["notice"]), "approx": bool(u.get("approx")), "origine": u.get("origine", ""),
            "gadm": {"nom": f["properties"]["NAME_3"], "type": f["properties"]["ENGTYPE_3"], "departement": f["properties"]["NAME_2"], "province": f["properties"]["NAME_1"]},
            "geometrie": geom, "boite": [round(v, 4) for v in boite(geom)], "centre": centre_geom(geom),
        })
    ordre = {"coeur": 0, "sud": 1, "signale": 2, "diaspora": 3}
    unites.sort(key=lambda u: (ordre.get(u["groupe"], 9), u["nom"]))

    def unite_de(x: float, y: float) -> str:
        for u in unites:
            b = u["boite"]
            if b[0] <= x <= b[2] and b[1] <= y <= b[3] and dans_geometrie(x, y, u["geometrie"]):
                return u["id"]
        return ""

    # localités
    villages = []
    pp = geojson_depuis_zip(telecharger(HOT.format(n="populated_places"), CACHE / "populated_places.zip"))
    vus = set()
    for ft in pp["features"]:
        t = ft.get("properties") or {}
        place = t.get("place")
        if place not in ("city", "town", "village", "hamlet"):
            continue
        c = centre_geom(ft["geometry"])
        uid = unite_de(c[0], c[1])
        if not uid:
            continue
        nom = (t.get("name") or t.get("name:fr") or "").strip()
        cle = (nom.lower(), round(c[0], 3), round(c[1], 3))
        if nom and cle in vus:
            continue
        vus.add(cle)
        villages.append([c[0], c[1], nom, place, uid, t.get("osm_id") or t.get("@id") or "", t.get("population") or ""])
    villages.sort(key=lambda v: (v[4], v[2]))
    # identifiant lisible par localité nommée, unique dans son unité (fiches /villages/<unité>/<slug>)
    vus_slug = set()
    for v in villages:
        base = slug_nom(v[2]) if v[2] else ""
        s = base
        n = 2
        while base and (v[4], s) in vus_slug:
            s = f"{base}-{n}"; n += 1
        if base:
            vus_slug.add((v[4], s))
        v.append(s)

    # équipements
    equipements = []
    for n in HOT_SETS[1:]:
        gj = geojson_depuis_zip(telecharger(HOT.format(n=n), CACHE / f"{n}.zip"))
        for ft in gj["features"]:
            t = ft.get("properties") or {}
            c = centre_geom(ft["geometry"])
            uid = unite_de(c[0], c[1])
            if not uid:
                continue
            fam = next((f for f, test in FAMILLES if test(t)), "")
            if not fam:
                continue
            equipements.append({
                "famille": fam, "nom": (t.get("name") or t.get("name:fr") or "").strip(), "coords": c, "unite": uid,
                "osm": t.get("osm_id") or t.get("@id") or "", "jeu": n,
                "detail": {k: v for k, v in t.items() if k in ("amenity", "healthcare", "man_made", "operator", "operator:type", "capacity", "power", "shop", "religion", "isced:level", "school:type", "source", "water_source", "pump")},
            })
    vus_eq = set()
    propres = []
    for e in sorted(equipements, key=lambda e: (e["unite"], e["famille"], e["nom"])):
        cle = (e["famille"], e["nom"].lower(), round(e["coords"][0], 4), round(e["coords"][1], 4))
        if cle in vus_eq:
            continue
        vus_eq.add(cle); propres.append(e)
    equipements = propres

    liens = liens_par_unite(legacy)
    comptes = {}
    for u in unites:
        comptes[u["id"]] = {
            "villages": sum(1 for v in villages if v[4] == u["id"]),
            "nommes": sum(1 for v in villages if v[4] == u["id"] and v[2]),
            "equipements": sum(1 for e in equipements if e["unite"] == u["id"]),
        }
    familles = {}
    for e in equipements:
        familles[e["famille"]] = familles.get(e["famille"], 0) + 1

    donnees = {
        "genere": date.today().isoformat(),
        "sources": {
            "limites": "GADM 4.1 (2022), niveau 3 — usage non commercial, gadm.org",
            "localites": "OpenStreetMap (ODbL), export HOT « Populated Places of Chad » via HDX, 6 septembre 2026",
            "equipements": "OpenStreetMap (ODbL), exports HOT via HDX (écoles, santé, points d’intérêt, lieux culturels, services financiers), 6 septembre 2026",
            "unites": "ADEB LONODJI, dossier « Bédjondo » : 14 unités du pays bedjond, notices et groupes",
        },
        "unites": unites,
        "comptes": comptes,
        "familles": familles,
        "villages": villages,
        "equipements": equipements,
        "liens": liens,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(donnees, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    ko = OUT.stat().st_size // 1024
    print(f"{len(unites)} unités, {len(villages)} localités ({sum(1 for v in villages if v[2])} nommées), {len(equipements)} équipements {familles} → {OUT.relative_to(ROOT)} ({ko} Ko)")
    for u in unites:
        print(f"  {u['nom']:<12} {u['groupe']:<9} villages {comptes[u['id']]['villages']:>4}  équipements {comptes[u['id']]['equipements']:>3}  liens {len(liens[u['id']])}")


if __name__ == "__main__":
    main()
