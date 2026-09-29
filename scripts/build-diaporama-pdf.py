#!/usr/bin/env python3
"""Version PDF de la présentation à l'assemblée (public/odeb/…-assemblee-2026.pdf),
rendue par LibreOffice avec les vraies polices du site (DM Sans, Playfair
Display, décompressées depuis .next/static/media et déclarées sous leur nom de
famille pour que la substitution ne joue pas). Lancer après
`node scripts/build-diaporama.js --assemblee` :

    python3 scripts/build-diaporama-pdf.py"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PPTX = ROOT / "public" / "odeb" / "odeb-lonodji-presentation-assemblee-2026.pptx"
WRAPPER = Path("/mnt/skills/public/pptx/scripts/office/soffice.py")


def polices() -> None:
    from fontTools.ttLib import TTFont

    dest = Path.home() / ".fonts"
    dest.mkdir(exist_ok=True)
    best: dict[str, tuple[Path, int]] = {}
    for f in sorted((ROOT / ".next" / "static" / "media").glob("*.woff2")):
        t = TTFont(f)
        nom = t["name"].getDebugName(4) or ""
        n = len(t.getBestCmap())
        cle = "DM Sans" if nom.startswith("DM Sans") else "Playfair Display" if nom.startswith("Playfair") else None
        if cle and (cle not in best or n > best[cle][1]):
            best[cle] = (f, n)
    for famille, (f, _) in best.items():
        t = TTFont(f)
        t.flavor = None
        for rec in t["name"].names:  # « DM Sans 9pt » → « DM Sans », pour que PowerPoint/LibreOffice retrouvent la famille
            if rec.nameID in (1, 4, 16):
                rec.string = famille if rec.nameID != 4 else f"{famille} Regular"
        t.save(dest / (famille.replace(" ", "") + ".ttf"))
    subprocess.run(["fc-cache", "-f"], check=False, capture_output=True)


def main() -> None:
    if not PPTX.exists():
        raise SystemExit("présentation absente : node scripts/build-diaporama.js --assemblee")
    polices()
    tmp = ROOT / ".next" / "diaporama-tmp"
    shutil.rmtree(tmp, ignore_errors=True)
    tmp.mkdir(parents=True)
    cmd = [sys.executable, str(WRAPPER)] if WRAPPER.exists() else ["soffice"]
    subprocess.run(cmd + ["--headless", "--convert-to", "pdf", "--outdir", str(tmp), str(PPTX)], check=True, capture_output=True, timeout=600)
    pdf = tmp / PPTX.with_suffix(".pdf").name
    shutil.move(str(pdf), str(PPTX.with_suffix(".pdf")))
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"{PPTX.with_suffix('.pdf').relative_to(ROOT)} ({PPTX.with_suffix('.pdf').stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
