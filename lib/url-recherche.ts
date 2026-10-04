/* Conserver les filtres dans l'adresse sans recharger ni ajouter une entrée par
   lettre saisie. Le retour depuis une fiche retrouve ainsi la même recherche. */
export function mettreAJourFiltres(champs: Record<string, string>) {
  const url = new URL(window.location.href);
  for (const [nom, valeur] of Object.entries(champs)) {
    if (valeur) url.searchParams.set(nom, valeur);
    else url.searchParams.delete(nom);
  }
  window.history.replaceState(null, "", url.toString());
}
