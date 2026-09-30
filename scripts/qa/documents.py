#!/usr/bin/env python3
"""Contrôle des PDF publiés (public/**/*.pdf), sans serveur : lit leur couche texte avec pdftotext.

  - aucune adresse de messagerie personnelle (gmail, yahoo, hotmail, outlook, icloud…) : le contact public
    passe par lonodji.org/participer ; un cache blanc posé sur une adresse ne suffit pas, le texte doit disparaître ;
  - le kit d'adhésion porte l'avertissement « collecte suspendue » et le nouvel engagement, pas l'ancien ;
  - les PDF que le site régénère ne sont pas restés l'original de l'ancien site (import sans l'étape de build).

    python3 scripts/qa/documents.py        (code de sortie 1 s'il y a un problème ; lancé par npm run qa)
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MESSAGERIES = re.compile(r"[\w.+-]+@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|me|aol|proton(mail)?)\.[a-z.]+", re.I)
KIT = ROOT / "public" / "documents" / "kit-adhesion-adeb-lonodji-2026.pdf"
KIT_DOIT = ["Collecte suspendue depuis le 23 septembre 2026", "dès leur publication"]
KIT_JAMAIS = ["déclare", "avoir pris connaissance"]
# import-legacy.py recopie ces PDF de l'ancien site, puis un script les refait (entre parenthèses).
REGENERES = {
    "kit-adhesion-adeb-lonodji-2026.pdf": "build-kit-adhesion.py, lancé par l'import",
    "carnet-enquete-terrain-adeb-lonodji-2026.pdf": "build-kit-adhesion.py, lancé par l'import",
    "dossier-presentation-adeb-lonodji-2026.pdf": "build-dossier-presentation.py",
}
ANCIEN = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/lonodji") / "documents"


def texte(pdf: Path) -> str:
    r = subprocess.run(["pdftotext", "-q", str(pdf), "-"], capture_output=True, text=True)
    return re.sub(r"\s+", " ", r.stdout)


def main() -> int:
    problemes: list[str] = []
    pdfs = sorted((ROOT / "public").rglob("*.pdf"))
    for pdf in pdfs:
        t = texte(pdf)
        n = len(MESSAGERIES.findall(t))
        if n:
            # l'adresse elle-même n'est jamais affichée
            problemes.append(f"{pdf.relative_to(ROOT)} : {n} adresse(s) de messagerie personnelle dans le texte")
    if KIT.exists():
        t = texte(KIT)
        problemes += [f"kit d'adhésion : « {x} » absent" for x in KIT_DOIT if x not in t]
        problemes += [f"kit d'adhésion : ancien engagement encore présent (« {x} »)" for x in KIT_JAMAIS if x in t]
    else:
        problemes.append("kit d'adhésion introuvable")
    if ANCIEN.exists():   # l'ancien site n'est présent que sur la machine qui importe
        for nom, script in REGENERES.items():
            a, b = ANCIEN / nom, ROOT / "public" / "documents" / nom
            if a.exists() and b.exists() and a.read_bytes() == b.read_bytes():
                problemes.append(f"{nom} : c'est encore l'original de l'ancien site (lancer {script})")
    print(f"documents : {len(pdfs)} PDF lus")
    print("PROBLÈMES DOCUMENTS :", len(problemes))
    for p in problemes:
        print("  -", p)
    return 1 if problemes else 0


if __name__ == "__main__":
    sys.exit(main())
