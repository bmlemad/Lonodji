#!/usr/bin/env python3
"""Lettres d'envoi des plaidoyers : une lettre par destinataire, à signer par le président et le
secrétaire général, et un bordereau de suivi par dossier. Les destinataires et l'état de chaque envoi
sont dans content/transmissions.json (affiché sur /actions) ; le résumé de la demande, le titre, la date
et le PDF joint viennent de content/index.json. Rien n'est inventé : la date et le numéro de la lettre
restent à remplir à la main, le jour de la signature.

Les lettres ne sont pas publiées sur le site (elles portent des blancs à remplir) : elles vont dans
content/brouillons/envois/ (hors dépôt).

    python3 scripts/build-lettres-envoi.py
"""
from __future__ import annotations

import base64
import html as h
import importlib.util
import json
import subprocess
from pathlib import Path

from org import TELEPHONE  # seule source : lib/contact.ts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "brouillons" / "envois"
SITE = "https://lonodji.org"
LOGO = ROOT / "public" / "odeb" / "identite" / "adeb-lonodji-logo-horizontal-clair-superposable.png"
# Bureau exécutif, tel que publié sur la page Mission
PRESIDENT = "Adoumbé Maoura"
SECRETAIRE = "Salomon Ngarbaye"


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


CSS = """
@page{size:A4;margin:18mm 20mm 18mm}
*{box-sizing:border-box}
html,body{margin:0;color:#10241e;font-family:'DM Sans',system-ui,sans-serif;font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.lettre,.bordereau{page-break-after:always}
.lettre:last-child,.bordereau:last-child{page-break-after:auto}
.tete{display:flex;justify-content:space-between;align-items:flex-start;gap:8mm;padding-bottom:3mm;border-bottom:1px solid #d5ddd6}
.tete img{height:15mm;width:auto}
.tete .meta{text-align:right;font-size:8pt;color:#526159;line-height:1.5}
.ref{display:flex;justify-content:space-between;margin:7mm 0 6mm;font-size:10pt}
.dest{margin:0 0 7mm 88mm;font-size:10.5pt;line-height:1.45}
.dest b{display:block}
.objet{margin:0 0 5mm}
.objet b{font-weight:700}
p{margin:0 0 3mm;text-align:justify}
.demande{margin:0 0 3mm;padding:2.5mm 4mm;border-left:2px solid #b6cf45;background:#f7f9f4;font-size:10pt;text-align:left}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:12mm;margin-top:9mm;text-align:center;font-size:10pt}
.sign div{min-height:30mm}
.sign b{display:block;margin-top:22mm}
.copie{margin-top:7mm;font-size:8.5pt;color:#3d4c46}
h1{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:18pt;margin:6mm 0 2mm}
.sous{color:#526159;margin:0 0 5mm}
table{width:100%;border-collapse:collapse;font-size:8.8pt}
th{text-align:left;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:#173b2d;border-bottom:1.5px solid #173b2d;padding:2mm 1.5mm}
td{border-bottom:1px solid #d5ddd6;padding:3.2mm 1.5mm;vertical-align:top}
td.vide{color:#9aa59f}
.note{font-size:8.5pt;color:#526159;margin-top:4mm}
"""


def esc(t: str) -> str:
    return h.escape(t, quote=False)


def pages_pdf(chemin: Path) -> int | None:
    try:
        sortie = subprocess.run(["pdfinfo", str(chemin)], capture_output=True, text=True, check=True).stdout
    except (OSError, subprocess.CalledProcessError):
        return None
    for ligne in sortie.splitlines():
        if ligne.startswith("Pages:"):
            return int(ligne.split()[1])
    return None


def formules(d: dict) -> tuple[str, str, str]:
    """(bloc d'adresse, appel, formule de politesse) selon le destinataire."""
    if d["type"] == "ministre":
        bloc = f"<b>À l’attention du Ministre</b>{esc(d['nom'])}<br>N’Djamena"
        return bloc, "Excellence,", "Veuillez agréer, Excellence, l’assurance de notre très haute considération."
    if d["type"] == "maire":
        bloc = f"<b>À l’attention de {esc(d['attention'])}</b>{esc(d['nom'])}<br>Bédjondo, Mandoul Occidental"
        appel = "Monsieur le Maire, Mesdames et Messieurs les conseillers," if "conseillers" in d["attention"] else "Monsieur le Maire,"
        return bloc, appel, f"Veuillez agréer, {appel[:-1]}, l’expression de notre haute considération."
    bloc = f"<b>À l’attention de {esc(d.get('attention', 'la Direction générale'))}</b>{esc(d['nom'])}"
    return bloc, "Madame, Monsieur,", "Veuillez agréer, Madame, Monsieur, l’expression de nos salutations distinguées."


def lettre(p: dict, d: dict, copie: str, logo: str, pj: int | None) -> str:
    bloc, appel, politesse = formules(d)
    url = SITE + p["href"]
    pages = f" ({pj} pages)" if pj else ""
    return f"""<section class="lettre">
<div class="tete"><img src="{logo}" alt="ADEB LONODJI"><div class="meta">Association de Développement et d’Entraide de Bédjondo<br>Mandoul Occidental · Tchad<br>lonodji.org · {esc(TELEPHONE)}</div></div>
<div class="ref"><span>N° ……… / ADEB-LONODJI / BE / 2026</span><span>N’Djamena, le ……………………… 2026</span></div>
<div class="dest">{bloc}</div>
<p class="objet"><b>Objet :</b> transmission du plaidoyer « {esc(p['title'])} »<br><b>P. J. :</b> le plaidoyer, publié le {esc(p['published'])}{pages}</p>
<p>{appel}</p>
<p>ADEB LONODJI, Association de Développement et d’Entraide de Bédjondo, rassemble Bédjondo, chef-lieu du Mandoul Occidental, et sa diaspora, au service de tous les habitants de la ville et de ses cantons.</p>
<p>Nous avons l’honneur de vous transmettre, ci-joint, notre plaidoyer « {esc(p['title'])} ». Il expose, sources à l’appui, la situation de Bédjondo, ce que nous demandons et ce que l’association s’engage elle-même à faire. En résumé, nous demandons :</p>
<p class="demande">{esc(p['demand'])}</p>
<p>Nous sollicitons une réponse écrite, ou un entretien avec vos services, afin d’examiner les suites qui peuvent y être données. Le dossier et son suivi sont publics : {esc(url)}. Nous y indiquerons la date de cet envoi et celle de votre réponse.</p>
<p>{politesse}</p>
<div class="sign"><div>Le Secrétaire général<b>{SECRETAIRE}</b></div><div>Le Président<b>{PRESIDENT}</b></div></div>
<p class="copie"><b>Copie :</b> {esc(copie)}</p>
</section>"""


def bordereau(p: dict, t: dict, logo: str) -> str:
    lignes = "".join(f"<tr><td>{i}</td><td>{esc(d['nom'])}</td><td class='vide'>remise / courrier / courriel</td><td class='vide'>…… / …… / 2026</td><td class='vide'>oui · non</td><td class='vide'></td></tr>"
                     for i, d in enumerate(t["destinataires"], 1))
    reste = "".join(f"<li>{esc(x)}</li>" for x in t.get("a_identifier", []))
    reste = f"<p class='note'><b>Destinataires à identifier avant envoi :</b></p><ul class='note'>{reste}</ul>" if reste else ""
    return f"""<section class="bordereau">
<div class="tete"><img src="{logo}" alt="ADEB LONODJI"><div class="meta">Bordereau de suivi · à conserver avec les accusés de réception<br>lonodji.org/actions</div></div>
<h1>{esc(p['title'])}</h1>
<p class="sous">Plaidoyer publié le {esc(p['published'])} · {len(t['destinataires'])} lettres d’envoi à signer par le président et le secrétaire général.</p>
<table><thead><tr><th>N°</th><th>Destinataire</th><th>Mode d’envoi</th><th>Date d’envoi</th><th>Accusé reçu</th><th>Réponse (date, résumé)</th></tr></thead><tbody>{lignes}</tbody></table>
{reste}
<p class="note">Chaque date d’envoi, accusé et réponse est à reporter dans content/transmissions.json : la page Plaidoyers & engagements l’affiche aussitôt.</p>
</section>"""


def main() -> None:
    from playwright.sync_api import sync_playwright

    og = charger("build_og", ROOT / "scripts" / "build-og.py")
    idx = json.loads((ROOT / "content" / "index.json").read_text(encoding="utf-8"))
    tr = json.loads((ROOT / "content" / "transmissions.json").read_text(encoding="utf-8"))
    plaidoyers = {p["id"]: p for p in idx["plaidoyers"]}
    logo = "data:image/png;base64," + base64.b64encode(LOGO.read_bytes()).decode()
    fonts = og.font_faces()
    OUT.mkdir(parents=True, exist_ok=True)
    page = lambda corps: f'<!doctype html><html lang="fr"><meta charset="utf-8"><style>{fonts}{CSS}</style><body>{corps}</body></html>'
    tout, n = [], 0
    tmp = ROOT / ".next" / "lettres-envoi-tmp.html"   # page chargée depuis un fichier : les polices file:// s'y chargent

    def charger_page(pg, corps: str) -> None:
        tmp.write_text(page(corps), encoding="utf-8")
        pg.goto(tmp.as_uri(), wait_until="load")
        pg.evaluate("document.fonts.ready")

    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        for pid, t in tr.items():
            if pid.startswith("_"):
                continue
            p = plaidoyers[pid]
            pj = pages_pdf(ROOT / "public" / p["pdf"].lstrip("/")) if p.get("pdf") else None
            corps = bordereau(p, t, logo) + "".join(lettre(p, d, t["copie"], logo, pj) for d in t["destinataires"])
            tout.append(corps)
            n += len(t["destinataires"])
            charger_page(pg, corps)
            pg.pdf(path=str(OUT / f"lettres-envoi-{pid}.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
        charger_page(pg, "".join(tout))
        pg.pdf(path=str(OUT / "lettres-envoi-plaidoyers-adeb-lonodji.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
        b.close()
    tmp.unlink(missing_ok=True)
    print(f"{n} lettres d’envoi et {len(tout)} bordereaux → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
