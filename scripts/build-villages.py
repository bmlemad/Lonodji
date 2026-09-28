#!/usr/bin/env python3
"""Fiches des villages : content/villages.json, à partir des données de la carte.

Pour chaque localité nommée (public/carte/donnees.json, produit par build-carte.py) :
position, unité, distance à Bédjondo, équipements connus à moins de 10 km,
localités voisines, pages du site qui la citent (index de recherche). Les
unités reçoivent leur notice, leurs comptes et leurs liens. Rien n'est inventé :
ce que les données ignorent est écrit comme tel par les pages.

    python3 scripts/build-carte.py && python3 scripts/build-search-index.py && python3 scripts/build-villages.py
"""
from __future__ import annotations

import json
import math
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CARTE = ROOT / "public" / "carte" / "donnees.json"
INDEX = ROOT / "public" / "search-index.json"
OUT = ROOT / "content" / "villages.json"
RAYON_EQUIPEMENTS_KM = 10.0
MAX_EQUIPEMENTS = 8
MAX_VOISINS = 6
MAX_MENTIONS = 6
NOMS_TROP_COURTS = 4  # en dessous, on ne cherche pas de mention : trop d'homonymes


def km(a, b) -> float:
    lon1, lat1, lon2, lat2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 6371.0 * 2 * math.asin(math.sqrt(h))


def nom_propre(n: str) -> str:
    """Retire les écritures non latines (OSM porte parfois le nom en arabe à la suite)."""
    n = re.sub(r"[^\u0000-\u024F\u1E00-\u1EFF]", "", n)
    return re.sub(r"\s+", " ", n).strip(" -–")


def sans_accents(t: str) -> str:
    t = unicodedata.normalize("NFKD", t)
    return "".join(ch for ch in t if not unicodedata.combining(ch)).lower()


def main() -> None:
    carte = json.loads(CARTE.read_text("utf8"))
    index = json.loads(INDEX.read_text("utf8"))
    unites = {u["id"]: u for u in carte["unites"]}
    villages = [v for v in carte["villages"] if v[2] and v[7]]
    for v in villages:
        v[2] = nom_propre(v[2]) or v[2]

    # Bédjondo, la ville : la localité de ce nom dans son unité, sinon le centre de l'unité
    ville = next((v for v in villages if v[4] == "bedjondo" and sans_accents(v[2]) == "bedjondo"), None)
    bedjondo = (ville[0], ville[1]) if ville else tuple(unites["bedjondo"]["centre"])

    # textes du site, sans accents, pour repérer les mentions
    textes = []
    for e in index:
        if e.get("k") in ("Document PDF", "Document à venir", "Thématique"):
            continue
        textes.append((e, sans_accents(f"{e.get('t', '')} {e.get('d', '')} {e.get('x', '')}")))

    fiches = []
    for v in villages:
        lon, lat, nom, typ, uid, _osm, _pop, slug = v[:8]
        pos = (lon, lat)
        eq = []
        for e in carte["equipements"]:
            d = km(pos, e["coords"])
            if d <= RAYON_EQUIPEMENTS_KM:
                eq.append({"famille": e["famille"], "nom": e["nom"], "unite": e["unite"], "km": round(d, 1), "detail": {k: v2 for k, v2 in (e.get("detail") or {}).items() if v2}})
        eq.sort(key=lambda e: e["km"])
        voisins = []
        for w in villages:
            if w is v:
                continue
            d = km(pos, (w[0], w[1]))
            if d <= 15:
                voisins.append((d, w))
        voisins.sort(key=lambda t: t[0])
        voisins = [{"nom": w[2], "unite": w[4], "slug": w[7], "km": round(d, 1)} for d, w in voisins[:MAX_VOISINS]]
        mentions = []
        if len(nom) >= NOMS_TROP_COURTS:
            motif = re.compile(r"(?<![a-z0-9])" + re.escape(sans_accents(nom)) + r"(?![a-z0-9])")
            for e, t in textes:
                if motif.search(t):
                    mentions.append({"titre": e["t"], "route": e["r"], "type": e.get("k", "Page")})
            ordre = {"Dossier": 0, "Plaidoyer": 1, "Page": 2, "Article": 3, "In English": 4}
            mentions.sort(key=lambda m: ordre.get(m["type"], 9))
            mentions = mentions[:MAX_MENTIONS]
        fiches.append({
            "slug": slug, "nom": nom, "type": typ, "unite": uid, "lon": lon, "lat": lat,
            "kmBedjondo": round(km(pos, bedjondo), 1),
            "equipements": eq[:MAX_EQUIPEMENTS], "voisins": voisins, "mentions": mentions,
        })

    unites_out = {}
    for uid, u in unites.items():
        unites_out[uid] = {
            "id": uid, "nom": u["nom"], "groupe": u["groupe"], "dep": u.get("dep", ""), "prov": u.get("prov", ""),
            "notice": u.get("notice", ""), "approx": u.get("approx", False), "origine": u.get("origine", ""),
            "centre": u["centre"], "comptes": carte["comptes"][uid], "liens": carte["liens"].get(uid, []),
            "kmBedjondo": round(km(tuple(u["centre"]), bedjondo), 1),
        }
    data = {"genere": carte["genere"], "sources": carte["sources"], "bedjondo": list(bedjondo), "unites": unites_out, "villages": fiches}
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", "utf8")
    avec_eq = sum(1 for f in fiches if f["equipements"])
    avec_mentions = sum(1 for f in fiches if f["mentions"])
    print(f"{OUT.relative_to(ROOT)} : {len(fiches)} fiches, {avec_eq} avec un équipement à moins de {RAYON_EQUIPEMENTS_KM:.0f} km, "
          f"{avec_mentions} citées sur le site, {OUT.stat().st_size // 1024} Ko")


if __name__ == "__main__":
    main()
