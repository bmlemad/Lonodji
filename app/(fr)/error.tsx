"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="not-found">
      <p className="eyebrow">Erreur temporaire</p>
      <h1>Un instant, puis réessayez.</h1>
      <p>Une erreur inattendue est survenue. Vous pouvez relancer la page sans perdre votre navigation.</p>
      <button className="button primary" type="button" onClick={() => reset()}>
        Réessayer <span aria-hidden="true">→</span>
      </button>
    </main>
  );
}
