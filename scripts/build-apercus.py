#!/usr/bin/env python3
"""Aperçus légers des grandes images que les pages montrent en vignette.

Les pages Presse et Kit de mobilisation, la couverture du magazine et les affiches de villages affichaient en vignette les fichiers à télécharger eux-mêmes
(PNG de 150 à 750 Ko chacun : près de 5 Mo pour la page Presse). Ce script écrit, pour chaque image
de plus de 60 Ko de public/kit, public/partage, public/odeb/identite, des couvertures du magazine et des affiches, une copie WebP réduite dans
public/apercus/ (même chemin, « / » remplacé par « -- »). Le lien de téléchargement garde l'original ;
seule la vignette change (lib/apercu.ts). Relancer après build-kit-visuels, build-postes ou un changement
de logo ; un aperçu n'est réécrit que si sa source est plus récente.

    python3 scripts/build-apercus.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "apercus"
SOURCES = ["kit/*.png", "partage/*.png", "odeb/identite/*.png", "magazine/*-couverture.jpg", "carte/affiches/*.jpg", "identite/*.png"]
SEUIL = 60 * 1024
COTE = 720  # px, côté le plus long : net sur écran 2x pour une vignette de 360 px


def nom(rel: str) -> str:
    return rel.replace("/", "--").rsplit(".", 1)[0] + ".webp"


def main() -> None:
    OUT.mkdir(exist_ok=True)
    faits = gardes = 0
    avant = apres = 0
    for motif in SOURCES:
        for src in sorted(PUBLIC.glob(motif)):
            if src.stat().st_size < SEUIL:
                continue
            dst = OUT / nom(src.relative_to(PUBLIC).as_posix())
            avant += src.stat().st_size
            if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
                gardes += 1
                apres += dst.stat().st_size
                continue
            im = Image.open(src)
            im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
            im.thumbnail((COTE, COTE), Image.LANCZOS)
            im.save(dst, "WEBP", quality=82, method=6)
            apres += dst.stat().st_size
            faits += 1
    print(f"aperçus : {faits} écrits, {gardes} inchangés — {avant // 1024} Ko d'originaux, {apres // 1024} Ko d'aperçus")


if __name__ == "__main__":
    main()
