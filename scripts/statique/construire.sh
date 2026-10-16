#!/usr/bin/env bash
# Export statique de lonodji.org.
#   CIBLE=ovh   (défaut) : hébergement web OVH — formulaires et espace de rédaction servis par serveur/ovh/*.php,
#                          redirections et en-têtes dans out/.htaccess (scripts/statique/htaccess.mjs).
#   CIBLE=pages          : copie de secours GitHub Pages — pages de renvoi HTML (redirections.mjs), CNAME ;
#                          pas de formulaires ni d'espace de rédaction.
# Modifie l'arbre de travail du runner seulement : ne jamais lancer en local sur une copie qu'on va pousser.
set -euo pipefail
cd "$(dirname "$0")/../.."
CIBLE="${CIBLE:-ovh}"

rm -rf app/api
for f in $(grep -rl "generateStaticParams" app); do
  if grep -q "dynamicParams" "$f"; then sed -i 's/export const dynamicParams = true/export const dynamicParams = false/' "$f"
  else sed -i '1i export const dynamicParams = false;' "$f"; fi
done
for f in app/manifest.ts app/robots.ts app/sitemap.ts; do
  grep -q "force-static" "$f" || sed -i '1i export const dynamic = "force-static";' "$f"
done
python3 - <<'PY'
s = open("next.config.mjs").read()
s = s.replace("const nextConfig = {", "const nextConfig = {\n  output: 'export',\n  trailingSlash: true,\n  images: { unoptimized: true },", 1)
open("next.config.mjs", "w").write(s)
PY

if [ "$CIBLE" = ovh ]; then
  export NEXT_PUBLIC_FORMULAIRES_URL=/formulaires.php
fi
npx next build

if [ "$CIBLE" = ovh ]; then
  cp serveur/ovh/formulaires.php serveur/ovh/redaction.php serveur/ovh/.user.ini serveur/ovh/.ovhconfig out/
  node scripts/statique/htaccess.mjs
else
  node scripts/statique/redirections.mjs
  echo lonodji.org > out/CNAME
fi
touch out/.nojekyll
echo "Export statique ($CIBLE) : $(find out -name '*.html' | wc -l) pages HTML, $(du -sh out | cut -f1)."
