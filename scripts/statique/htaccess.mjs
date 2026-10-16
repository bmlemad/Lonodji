// Génère out/.htaccess pour l'hébergement OVH (Apache) à partir des redirections et des en-têtes
// déclarés dans next.config.mjs et netlify.toml : une seule source, deux hébergeurs.
import fs from "node:fs";
import path from "node:path";
import cfg from "../../next.config.mjs";

const out = path.resolve("out");
const toml = fs.readFileSync(path.resolve("netlify.toml"), "utf8");

/* ---------- redirections ---------- */
const redirections = await cfg.redirects();
const lignes301 = [];
const ignorees = [];
const regex = (s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
for (const r of redirections) {
  if (r.has || r.missing) { ignorees.push(r.source); continue; }
  const m = r.source.match(/^\/([a-z0-9/-]+)\/:slug(\.html)?$/);
  if (m && /^\/[a-z0-9/-]+\/:slug$/.test(r.destination)) {
    // /articles/:slug(.html) → /journal/:slug
    const dest = r.destination.replace(/\/:slug$/, "");
    lignes301.push(`RedirectMatch 301 ^/${regex(m[1])}/([a-z0-9-]+)${m[2] ? "\\.html" : ""}/?$ ${dest}/$1`);
    continue;
  }
  if (/[:*()]/.test(r.source)) { ignorees.push(r.source); continue; }
  const fin = /\.[a-z0-9]+$/i.test(r.source) ? "" : "/?";
  lignes301.push(`RedirectMatch 301 ^${regex(r.source)}${fin}$ ${r.destination}`);
}

/* ---------- en-têtes ---------- */
// netlify.toml : blocs [[headers]] for = "..." + valeurs
const blocs = [];
for (const m of toml.matchAll(/\[\[headers\]\]\s*\n\s*for = "([^"]+)"\s*\n\s*\[headers\.values\]\s*\n((?:\s*[A-Za-z-]+ = "[^"\n]*"\n?)+)/g)) {
  const valeurs = [...m[2].matchAll(/([A-Za-z-]+) = "([^"\n]*)"/g)].map((v) => [v[1], v[2]]);
  blocs.push({ pour: m[1], valeurs });
}
const generaux = blocs.find((b) => b.pour === "/*")?.valeurs ?? [];
// next.config.mjs : en-têtes généraux supplémentaires (COOP, etc.) absents de netlify.toml
const nextHeaders = await cfg.headers();
const nextGeneraux = nextHeaders.find((h) => h.source === "/(.*)")?.headers ?? [];
for (const h of nextGeneraux) if (!generaux.some(([k]) => k.toLowerCase() === h.key.toLowerCase())) generaux.push([h.key, h.value]);

const headerLine = ([k, v], env) => `  Header always set ${k} "${v.replace(/"/g, '\\"')}"${env ? ` env=${env}` : ""}`;

const fichiersSpecifiques = blocs.filter((b) => b.pour !== "/*" && b.pour !== "/_next/static/*");

const texte = `# Généré par scripts/statique/htaccess.mjs — ne pas modifier à la main (source : next.config.mjs, netlify.toml).
Options -Indexes -MultiViews
AddDefaultCharset utf-8
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # HTTPS et domaine nu (OVH termine le TLS en amont : X-Forwarded-Proto)
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !=https
  RewriteRule ^ https://lonodji.org%{REQUEST_URI} [R=301,L]
  RewriteCond %{HTTP_HOST} ^www\\.lonodji\\.org$ [NC]
  RewriteRule ^ https://lonodji.org%{REQUEST_URI} [R=301,L]
  # scripts serveur (voir serveur/ovh/)
  RewriteCond %{REQUEST_METHOD} =POST
  RewriteRule ^__forms\\.html$ /formulaires.php [L]
  RewriteRule ^api/redaction/?$ /redaction.php [L]
  # marqueurs pour les en-têtes par chemin
  RewriteRule ^_next/static/ - [E=IMMUABLE:1]
  RewriteRule ^(redaction|redaction\\.php|api/redaction)/?$ - [E=PRIVE:1]
  RewriteRule ^sw\\.js$ - [E=SW:1]
</IfModule>

<IfModule mod_headers.c>
  # en-têtes de sécurité (netlify.toml [[headers]] for = "/*", complétés par next.config.mjs)
${generaux.map((kv) => headerLine(kv)).join("\n")}
  # fichiers Next à empreinte : immuables
  Header always set Cache-Control "public, max-age=31536000, immutable" env=IMMUABLE
  # espace de rédaction : ni cache ni index
  Header always set Cache-Control "no-store" env=PRIVE
  Header always set X-Robots-Tag "noindex, nofollow" env=PRIVE
  Header always set Cache-Control "no-cache" env=SW
  # données sans empreinte : revalidées à chaque visite
${fichiersSpecifiques.map((b) => `  <Files "${path.basename(b.pour)}">\n${b.valeurs.map((kv) => "  " + headerLine(kv)).join("\n")}\n  </Files>`).join("\n")}
  # pages HTML : jamais mises en cache longtemps
  <FilesMatch "\\.html$">
    Header always set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/pdf "access plus 7 days"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain application/javascript application/json image/svg+xml application/manifest+json
</IfModule>

# anciennes adresses (next.config.mjs redirects)
${lignes301.join("\n")}

# fichiers privés : jamais servis
<FilesMatch "^(\\.user\\.ini|\\.ovhconfig|config\\.exemple\\.php|LISEZMOI\\.md)$">
  Require all denied
</FilesMatch>
`;

fs.writeFileSync(path.join(out, ".htaccess"), texte);
console.log(`.htaccess : ${lignes301.length} redirections, ${generaux.length} en-têtes généraux, ${fichiersSpecifiques.length} fichiers à en-têtes propres ; ignorées : ${ignorees.join(", ") || "aucune"}.`);
