import { TELEPHONE_HREF } from "@/lib/contact";

/* Lien d'appel sans le numéro en clair (demande du 2 octobre 2026, étendue aux textes le 3 octobre) : l'icône du
   téléphone et un mot (« appeler », « par téléphone »…) ; le lien tel: compose le numéro du président. */
export default function Appel({ texte = "appeler", en = false }: { texte?: string; en?: boolean }) {
  const aria = en ? "Call the association" : "Appeler l’association";
  return (
    <a className="lien-appel" href={TELEPHONE_HREF} aria-label={aria} title={aria}>
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
      <span>{texte}</span>
    </a>
  );
}
