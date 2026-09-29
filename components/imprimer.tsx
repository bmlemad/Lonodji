"use client";

/* Bouton d'impression : la boîte de dialogue du navigateur permet aussi
   d'enregistrer la page en PDF (la feuille d'impression du site enlève les
   menus et garde le code QR et l'adresse). */
export default function BoutonImprimer({ label = "Imprimer", className = "button secondary" }: { label?: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 8V3.5h10V8" /><rect x="3.5" y="8" width="17" height="9" rx="2" /><path d="M7 13.5h10v7H7z" /></svg>
      {label}
    </button>
  );
}
