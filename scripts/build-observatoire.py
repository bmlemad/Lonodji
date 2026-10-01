#!/usr/bin/env python3
"""Observatoire du Mandoul Occidental (content/observatoire.json, page /observatoire).

Agrège, unité par unité, ce que le site sait déjà : localités et équipements
connus des données ouvertes (public/carte/donnees.json), couverture des
localités par un équipement à moins de 10 km et localités citées sur le site
(content/villages.json), pages du site par unité ; puis le diagnostic
territorial par domaine (content/pages/problematiques.json : 34 problématiques,
état de la connaissance, échelon de décision), les plaidoyers (content/index.json)
et les compteurs de besoins (content/indicateurs.json). Aucun chiffre n'est
estimé : ce qui manque est écrit comme manquant.

    python3 scripts/build-observatoire.py      (après build-carte, build-villages, build-indicateurs)
"""
from __future__ import annotations

import datetime as dt
import json
import re
from collections import Counter, OrderedDict
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = CONTENT / "observatoire.json"

FAMILLES = OrderedDict([("ecole", "écoles"), ("sante", "santé"), ("eau", "eau"), ("marche", "marchés"), ("telecom", "télécoms"), ("administration", "administration"), ("culte", "lieux de culte")])
ORDRE_GROUPES = ["coeur", "sud", "signale", "diaspora"]


def plain(html: str) -> str:
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", html))).strip()


def unites() -> list[dict]:
    carte = json.loads((ROOT / "public" / "carte" / "donnees.json").read_text("utf8"))
    villages = json.loads((CONTENT / "villages.json").read_text("utf8"))
    equip_par_unite: dict[str, Counter] = {}
    for e in carte["equipements"]:
        equip_par_unite.setdefault(e["unite"], Counter())[e["famille"]] += 1
    par_unite: dict[str, list] = {}
    for v in villages["villages"]:
        par_unite.setdefault(v["unite"], []).append(v)
    out = []
    for u in carte["unites"]:
        vs = par_unite.get(u["id"], [])
        fam = equip_par_unite.get(u["id"], Counter())
        uj = villages["unites"].get(u["id"], {})
        out.append({
            "id": u["id"], "nom": u["nom"], "groupe": u["groupe"], "dep": u.get("dep", ""), "prov": u.get("prov", ""),
            "kmBedjondo": uj.get("kmBedjondo", 0),
            "localites": carte["comptes"][u["id"]]["villages"],
            "nommees": carte["comptes"][u["id"]]["nommes"],
            "equipements": {"total": sum(fam.values()), "familles": {k: fam.get(k, 0) for k in FAMILLES}},
            "couvertes": sum(1 for v in vs if v["equipements"]),
            "citees": sum(1 for v in vs if v["mentions"]),
            "pages": uj.get("liensTotal", len(uj.get("liens", []))),
            "plaidoyers": sum(1 for l in uj.get("liens", []) if l.get("type") == "plaidoyer"),
            "route": f"/villages/{u['id']}",
        })
    out.sort(key=lambda x: (ORDRE_GROUPES.index(x["groupe"]) if x["groupe"] in ORDRE_GROUPES else 9, x["kmBedjondo"]))
    return out


def diagnostic() -> dict:
    page = json.loads((CONTENT / "pages" / "problematiques.json").read_text("utf8"))
    html = next(s["html"] for s in page["sections"] if s["id"] == "trente-quatre-problematiques-par-domaine")
    domaines: "OrderedDict[str, dict]" = OrderedDict()
    courant = None
    for m in re.finditer(r'<tr id="(prob-\d+)">(.*?)</tr>', html, re.S):
        pid, corps = m.group(1), m.group(2)
        th = re.search(r'<th[^>]*scope="rowgroup"[^>]*>(.*?)</th>', corps, re.S)
        if th:
            courant = plain(th.group(1))
            domaines[courant] = {"nom": courant, "ancre": pid, "total": 0, "documente": 0, "partiel": 0, "ailleurs": 0, "inconnu": 0, "decideurs": Counter(), "thematiques": Counter(), "problemes": []}
        tds = re.findall(r"<td[^>]*>(.*?)</td>", corps, re.S)
        if not courant or len(tds) < 3:
            continue
        texte = plain(re.sub(r'<a class="prob-theme-lien".*?</a>', "", tds[0], flags=re.S))
        statut = plain(tds[1])
        decideur = plain(tds[2])
        them = re.search(r'<a class="prob-theme-lien" href="/programmes#([a-z0-9-]+)">→\s*(.*?)</a>', tds[0], re.S)
        d = domaines[courant]
        d["total"] += 1
        cle = {"Documenté": "documente", "Partiel": "partiel", "Ailleurs": "ailleurs", "Inconnu": "inconnu"}.get(statut)
        if cle:
            d[cle] += 1
        d["decideurs"][decideur] += 1
        if them:
            d["thematiques"][them.group(1)] += 1
        d["problemes"].append({"id": pid, "texte": texte, "statut": statut, "decideur": decideur, "thematique": them.group(1) if them else None})
    for d in domaines.values():
        d["decideurs"] = dict(d["decideurs"])
        d["thematiques"] = dict(d["thematiques"])
    total = sum(d["total"] for d in domaines.values())
    return {
        "total": total,
        "statuts": {k: sum(d[k] for d in domaines.values()) for k in ("documente", "partiel", "ailleurs", "inconnu")},
        "decideurs": dict(sum((Counter(d["decideurs"]) for d in domaines.values()), Counter())),
        "domaines": list(domaines.values()),
    }


def main() -> None:
    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    ind = json.loads((CONTENT / "indicateurs.json").read_text("utf8"))
    us = unites()
    diag = diagnostic()
    familles_total = Counter()
    for u in us:
        for k, n in u["equipements"]["familles"].items():
            familles_total[k] += n
    data = {
        "genere": dt.date.today().isoformat(),
        "sources": {"carte": ind["contenu"]["carte"]["genere"], "villages": json.loads((CONTENT / "villages.json").read_text("utf8"))["genere"], "releve": ind["formulaires"]["date"]},
        "familles": {k: {"libelle": v, "total": familles_total.get(k, 0)} for k, v in FAMILLES.items()},
        "totaux": {
            "unites": len(us), "localites": sum(u["localites"] for u in us), "nommees": sum(u["nommees"] for u in us),
            "equipements": sum(u["equipements"]["total"] for u in us), "couvertes": sum(u["couvertes"] for u in us), "citees": sum(u["citees"] for u in us),
        },
        "unites": us,
        "diagnostic": diag,
        "plaidoyers": [{k: p.get(k, "") for k in ("id", "title", "theme", "status", "recipients", "published", "sent", "answer", "href")} for p in idx["plaidoyers"]],
        "besoins": {
            "signales": ind["formulaires"]["comptes"].get("signalement-besoin", {}).get("envois", 0),
            "resolus": ind["bureau"].get("besoinsResolus"),
            "note": ind["bureau"].get("note", ""),
        },
        "engagements": ind["contenu"]["engagements"],
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"content/observatoire.json : {len(us)} unités, {data['totaux']['equipements']} équipements, {data['totaux']['couvertes']}/{data['totaux']['nommees']} localités couvertes, "
          f"{diag['total']} problématiques dans {len(diag['domaines'])} domaines ({diag['statuts']})")


if __name__ == "__main__":
    main()
