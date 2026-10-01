#!/usr/bin/env python3
"""Campagne « Postes ouverts » (décisions du 1er octobre 2026) : un visuel carré par poste dans public/partage/postes/
et le message WhatsApp de chacun dans content/brouillons/postes-ouverts-whatsapp.md (hors dépôt).

Les postes sont calculés comme sur la page Participer (lib/postes.ts) : un adjoint pour chacune des sept thématiques
prioritaires (PRIORITAIRES, lib/organisation.ts), un titulaire pour chaque priorité sans coordonnateur, une
vice-présidence pour chaque pôle qui n'en a pas. Un poste pourvu disparaît au prochain lancement ; son visuel est retiré.

    python3 scripts/build-postes.py
"""
from __future__ import annotations

import importlib.util
import json
import re
from datetime import date
from pathlib import Path

from org import TELEPHONE  # seule source : lib/contact.ts

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location("build_visuels", ROOT / "scripts" / "build-visuels.py")
_v = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(_v)

OUT = ROOT / "public" / "partage" / "postes"
BROUILLON = ROOT / "content" / "brouillons" / "postes-ouverts-whatsapp.md"
SITE = "https://lonodji.org"


def prioritaires() -> list[str]:
    src = (ROOT / "lib" / "organisation.ts").read_text("utf8")
    bloc = src.split("export const PRIORITAIRES", 1)[1].split("= [", 1)[1].split("\n];", 1)[0]
    return re.findall(r'\{\s*id:\s*"([^"]+)"', bloc)


def postes() -> list[dict]:
    idx = json.loads((ROOT / "content" / "index.json").read_text("utf8"))
    themes = {t["id"]: (t, p) for p in idx["structure"]["poles"] for t in p["items"]}
    out = []
    for genre in ("titulaire", "adjoint"):
        for tid in prioritaires():
            if tid not in themes:
                continue
            t, p = themes[tid]
            if genre == "titulaire" and t["filled"]:
                continue
            q = f"/participer?theme={t['number']}&{'coordo' if genre == 'titulaire' else 'adjoint'}=1"
            role = "un coordonnateur ou une coordonnatrice" if genre == "titulaire" else "un adjoint ou une adjointe"
            out.append({
                "cle": f"{genre}-{t['number']}", "genre": genre,
                "eyebrow": f"Poste ouvert · thématique prioritaire {t['number']}",
                "role": "Coordonnateur ou coordonnatrice" if genre == "titulaire" else "Adjoint ou adjointe",
                "nom": t["name"], "pole": f"Pôle {p['roman']} · {p['name']}",
                "fiche": f"/missions/fiche-mission-coordination-{t['id']}.pdf",
                "message": f"ADEB LONODJI cherche {role} pour la thématique prioritaire « {t['number']}. {t['name']} » (pôle {p['roman']}). Bénévole, au Tchad ou dans la diaspora. La fiche de mission et le formulaire : {SITE}{q}#contact — ou par WhatsApp au {TELEPHONE}.",
            })
    for p in idx["structure"]["poles"]:
        d = p.get("direction")
        if not d or d.get("filled"):
            continue
        q = f"/participer?direction={p['roman']}&coordo=1"
        out.append({
            "cle": f"vice-presidence-{p['roman']}", "genre": "vice-presidence",
            "eyebrow": "Poste ouvert · élection", "role": f"Vice-présidence du pôle {p['roman']}",
            "nom": p["name"], "pole": f"Pôle {p['roman']} · vice-présidence déléguée, élue",
            "fiche": f"/missions/fiche-mission-direction-{p['id']}.pdf",
            "message": f"ADEB LONODJI élira la vice-présidente ou le vice-président délégué du pôle {p['roman']}, « {p['name']} ». Candidatures ouvertes, au Tchad comme dans la diaspora. La fiche de mission et le formulaire : {SITE}{q}#contact — ou par WhatsApp au {TELEPHONE}.",
        })
    return out


def main() -> None:
    from playwright.sync_api import sync_playwright

    liste = postes()
    OUT.mkdir(parents=True, exist_ok=True)
    fonts = _v.font_faces()
    mois = f"{_v.MOIS[date.today().month - 1]} {date.today().year}"
    tmp = ROOT / ".next" / "postes-tmp.html"
    gardes = set()
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        page = b.new_page(viewport={"width": 1080, "height": 1080}, device_scale_factor=1)
        for p in liste:
            titre = f"{_v.esc(p['role'])}<br><em>{_v.esc(p['nom'])}</em>"
            brut = len(p["role"]) + len(p["nom"])
            size = 72 if brut < 50 else 64 if brut < 66 else 56
            lignes = [p["pole"], "Bénévole · au Tchad ou dans la diaspora", "Fiche de mission et candidature en ligne"]
            html = _v.TEMPLATE.format(mois=mois, fonts=fonts, logo=_v.LOGO, eyebrow=_v.esc(p["eyebrow"]), titre=titre,
                                      lignes="".join(f"<li>{_v.esc(l)}</li>" for l in lignes), url="lonodji.org/participer",
                                      size=size, classe="", odeb="")
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")
            page.wait_for_timeout(150)
            png = OUT / f"poste-{p['cle']}.png"
            page.screenshot(path=str(png), type="png")
            _v.alleger(png)
            gardes.add(png.name)
        b.close()
    tmp.unlink(missing_ok=True)
    for vieux in OUT.glob("poste-*.png"):
        if vieux.name not in gardes:
            vieux.unlink()

    noms = {"titulaire": "Coordination à pourvoir", "adjoint": "Adjoints et adjointes", "vice-presidence": "Vice-présidences (élection)"}
    md = [f"# Postes ouverts — messages WhatsApp ({len(liste)} postes, {date.today().strftime('%d/%m/%Y')})", "",
          "Un message par poste, à envoyer avec son visuel (lonodji.org/partage/postes/…) dans les groupes WhatsApp de la",
          "diaspora et de Bédjondo. Le lien ouvre le formulaire déjà rempli pour ce poste. Généré par scripts/build-postes.py.", ""]
    for genre, titre in noms.items():
        bloc = [p for p in liste if p["genre"] == genre]
        if not bloc:
            continue
        md += [f"## {titre}", ""]
        for p in bloc:
            md += [f"### {p['role']} — {p['nom']}", "", f"Visuel : {SITE}/partage/postes/poste-{p['cle']}.png  ", f"Fiche de mission : {SITE}{p['fiche']}", "", p["message"], ""]
    BROUILLON.parent.mkdir(parents=True, exist_ok=True)
    BROUILLON.write_text("\n".join(md), encoding="utf-8")
    print(f"{len(liste)} postes → public/partage/postes/ et {BROUILLON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
