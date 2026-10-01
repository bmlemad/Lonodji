import fs from "node:fs";
import path from "node:path";

/* Vignette légère d'une grande image (public/apercus/, écrite par scripts/build-apercus.py) : la page montre
   l'aperçu WebP, le lien de téléchargement garde l'original. Sans aperçu, l'image d'origine. */
const DOSSIER = path.join(process.cwd(), "public", "apercus");
export function apercu(src: string): string {
  if (!/^\/[^?#]+\.(png|jpe?g)$/i.test(src)) return src;
  const nom = src.slice(1).replace(/\//g, "--").replace(/\.(png|jpe?g)$/i, ".webp");
  return fs.existsSync(path.join(DOSSIER, nom)) ? `/apercus/${nom}` : src;
}

/* Même chose dans un HTML repris (pages de l'ancien site) : chaque <img src="/….png|jpg"> qui a son aperçu. */
export function apercusHtml(html: string): string {
  return html.replace(/<img\b[^>]*?\bsrc="(\/[^"]+\.(?:png|jpe?g))"[^>]*>/gi, (img: string, src: string) => {
    const leger = apercu(src);
    if (leger === src) return img;
    const nouvelle = img.replace(`src="${src}"`, `src="${leger}"`);
    // visuel du kit à partager : l'aperçu se voit, l'original (PNG 1080 px) se télécharge — WhatsApp traite le WebP en autocollant
    return src.startsWith("/kit/") ? `${nouvelle}<a class="kit-dl" href="${src}" download>Télécharger le visuel (PNG) <span aria-hidden="true">↓</span></a>` : nouvelle;
  });
}
