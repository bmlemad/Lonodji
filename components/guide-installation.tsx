import Link from "@/components/lien";

export default function GuideInstallation() {
  return (
    <section className="legacy lg-resume-haut" id="installer-sur-iphone" aria-labelledby="installation-iphone-title">
      <div className="prose">
        <div className="eyebrow">Sur votre iPhone</div>
        <h2 id="installation-iphone-title">Installer LONODJI en quelques gestes</h2>
        <p>La version web s’ajoute gratuitement à l’écran d’accueil. Elle ouvre le site actuel ; la publication d’une application sur l’App Store reste un projet distinct.</p>
        <ol>
          <li>Ouvrez <Link href="/">lonodji.org</Link> dans Safari.</li>
          <li>Utilisez le partage de Safari : ouvrez son menu de page puis choisissez <strong>Partager</strong>, ou touchez directement son icône de partage selon la disposition du navigateur. Le bouton de partage de LONODJI sert à transmettre une page.</li>
          <li>Dans les actions proposées, choisissez <strong>Sur l’écran d’accueil</strong>. Si cette action manque, cherchez-la dans <strong>Modifier les actions</strong>.</li>
          <li>Activez <strong>Ouvrir comme app web</strong> si cette option est proposée, puis confirmez avec <strong>Ajouter</strong>. Lancez ensuite LONODJI depuis sa nouvelle icône.</li>
        </ol>
        <p>Pour préparer une coupure, ouvrez d’abord les pages utiles avec une connexion active. Seules les pages conservées sur cet appareil pourront être relues sans réseau ; l’envoi d’un formulaire demande une connexion.</p>
        <p className="form-note">Déjà installé ? Fermez puis rouvrez LONODJI avec le réseau disponible pour charger la version actuelle. <Link href="/hors-ligne">Comprendre la lecture hors connexion</Link>.</p>
        <p className="form-note">Mode d’emploi : <a href="https://support.apple.com/fr-fr/guide/iphone/iphea86e5236/ios" target="_blank" rel="noopener noreferrer">Assistance Apple</a>.</p>
      </div>
    </section>
  );
}
