// Pages de renvoi pour les redirections de next.config.mjs (GitHub Pages ne sait pas rediriger côté serveur).
import fs from "node:fs";
import path from "node:path";
import cfg from "../../next.config.mjs";

const out = path.resolve("out");
const echappe = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
let faites = 0;
const ignorees = [];
for (const r of await cfg.redirects()) {
  if (r.has || r.missing || /[:*()]/.test(r.source) || /\.[a-z0-9]+$/i.test(r.source)) { ignorees.push(r.source); continue; }
  const dossier = path.join(out, r.source.replace(/^\/+/, ""));
  const fichier = path.join(dossier, "index.html");
  if (fs.existsSync(fichier)) { ignorees.push(r.source); continue; }
  fs.mkdirSync(dossier, { recursive: true });
  const d = r.destination;
  fs.writeFileSync(fichier, `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Redirection</title><meta name="robots" content="noindex"><link rel="canonical" href="https://lonodji.org${echappe(d.split("#")[0])}"><meta http-equiv="refresh" content="0; url=${echappe(d)}"><script>location.replace(${JSON.stringify(d)})</script></head><body><a href="${echappe(d)}">Continuer</a></body></html>`);
  faites++;
}
console.log(`Redirections : ${faites} pages de renvoi, ${ignorees.length} ignorées (motifs ou fichiers existants).`);
