import QRCode from "qrcode";

/* Code QR en SVG, calculé au build (aucun script côté client). La taille est
   laissée au CSS : on retire width/height pour ne garder que le viewBox. */
export async function qrSvg(url: string): Promise<string> {
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#10241e", light: "#ffffff" } });
  return svg.replace(/\s(width|height)="[^"]*"/g, "").replace("<svg ", '<svg role="img" aria-label="Code QR vers cette page" ');
}
