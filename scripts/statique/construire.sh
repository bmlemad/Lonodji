#!/usr/bin/env bash
# Export statique de secours de lonodji.org (GitHub Pages), utilisé quand l'hébergement Netlify est indisponible.
# Modifie l'arbre de travail du runner seulement : ne jamais lancer en local sur une copie qu'on va pousser.
# Limites de ce mode : pas de formulaires Netlify, pas d'espace de rédaction (/api), pas d'en-têtes HTTP de next.config.
set -euo pipefail
cd "$(dirname "$0")/../.."
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
npx next build
node scripts/statique/redirections.mjs
echo lonodji.org > out/CNAME
touch out/.nojekyll
