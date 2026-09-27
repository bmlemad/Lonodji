const values = [
  ["01", "Courage", "Oser agir, prendre des responsabilités et avancer avec détermination."],
  ["02", "Discipline", "Transformer les intentions en actions concrètes, régulières et durables."],
  ["03", "Héritage", "Transmettre des valeurs, des compétences et une vision aux générations futures."],
];

const programmes = [
  ["01", "Transmission", "Créer des espaces où les savoirs, les expériences et les valeurs circulent.", "Programme"],
  ["02", "Engagement", "Rassembler les énergies autour d’initiatives utiles et structurées.", "Programme"],
  ["03", "Communauté", "Faire grandir un réseau solidaire, ouvert et tourné vers l’avenir.", "Programme"],
];

const engagement = [
  ["01", "Nous rejoindre", "Participer à la dynamique collective et contribuer selon ses possibilités."],
  ["02", "Proposer une initiative", "Partager une idée, un projet ou un besoin à étudier avec la communauté."],
  ["03", "Devenir partenaire", "Explorer une collaboration autour d’actions et de ressources utiles."],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <main id="main-content">
        <nav className="nav" aria-label="Navigation principale">
          <a className="brand" href="#top" aria-label="ADEB Lonodji — accueil">
            <span className="brand-mark" aria-hidden="true">A</span>
            <span>ADEB <b>LONODJI</b></span>
          </a>
          <div className="links">
            <a href="/mission">Mission</a>
            <a href="/programmes">Programmes</a>
            <a href="/impact">Impact</a>
            <a href="/participer">Participer</a>
            <a href="/transparence">Transparence</a>
          </div>
          <a className="nav-cta" href="#participer">Nous rejoindre</a>
        </nav>

        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="orb orb-a" aria-hidden="true" />
          <div className="orb orb-b" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">Association • Engagement • Transmission</p>
            <h1 id="hero-title">Construire aujourd’hui.<br /><em>Transmettre demain.</em></h1>
            <p className="hero-text">
              ADEB Lonodji veut transformer les valeurs en actions, les expériences en transmission
              et les liens en force collective.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#mission">Découvrir notre mission <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#programmes">Voir les programmes <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="hero-card" aria-hidden="true">
            <div className="glass-card">
              <span className="card-kicker">Notre cap</span>
              <strong>Une génération qui agit, apprend et transmet.</strong>
              <div className="mini-line" />
              <span className="card-note">Courage · Discipline · Héritage</span>
            </div>
          </div>
        </section>

        <section id="mission" className="intro section" aria-labelledby="mission-title">
          <div>
            <p className="eyebrow">01 — Notre mission</p>
            <h2 id="mission-title">Donner du sens à l’action collective.</h2>
          </div>
          <p className="lead">
            Nous croyons qu’une communauté devient plus forte lorsque chacun peut contribuer,
            apprendre et transmettre. ADEB cherche à créer ce cadre par des initiatives utiles,
            une culture de l’engagement et une attention constante à la transmission.
          </p>
        </section>

        <section id="programmes" className="programmes section" aria-labelledby="programmes-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">02 — Nos programmes</p>
              <h2 id="programmes-title">Trois axes.<br /><em>Une même direction.</em></h2>
            </div>
            <p>
              Les programmes structurent l’action autour de trois dimensions complémentaires.
              Leur contenu, leurs projets et leurs résultats pourront être documentés au fil du développement de l’association.
            </p>
          </div>
          <div className="program-grid">
            {programmes.map(([n, title, description, label]) => (
              <article className="program-card" key={n}>
                <div className="card-top"><span>{n}</span><small>{label}</small></div>
                <div className="program-body">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section id="impact" className="impact section" aria-labelledby="impact-title">
          <div className="impact-intro">
            <p className="eyebrow">03 — Notre impact</p>
            <h2 id="impact-title">Mesurer ce qui<br /><em>devient réel.</em></h2>
            <p>
              La crédibilité d’une organisation se construit aussi par la preuve. Cette rubrique
              est conçue pour accueillir des résultats vérifiés, des projets documentés et des témoignages authentifiés.
            </p>
          </div>
          <div className="impact-grid">
            <article>
              <span className="impact-index">A</span>
              <h3>Résultats</h3>
              <p>Données et indicateurs publiés lorsque des résultats vérifiables seront disponibles.</p>
              <span className="status">Données à venir</span>
            </article>
            <article>
              <span className="impact-index">B</span>
              <h3>Projets</h3>
              <p>Présentation des initiatives, de leur objectif, de leur avancement et de leurs enseignements.</p>
              <span className="status">À documenter</span>
            </article>
            <article>
              <span className="impact-index">C</span>
              <h3>Témoignages</h3>
              <p>Paroles de participants et de partenaires, publiées avec leur accord et leur contexte.</p>
              <span className="status">À documenter</span>
            </article>
          </div>
        </section>

        <section id="territoire" className="territory section" aria-labelledby="territory-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">04 — Territoire</p>
              <h2 id="territory-title">Comprendre le terrain.<br /><em>Agir avec précision.</em></h2>
            </div>
            <p>
              Un futur espace pour documenter les besoins, les projets et les ressources du Mandoul Occidental,
              avec des données sourcées et une cartographie progressive du territoire.
            </p>
          </div>
          <div className="territory-grid">
            <article className="territory-feature">
              <span className="module-tag">Observatoire</span>
              <h3>Mandoul Occidental</h3>
              <p>Population, santé, éducation, eau, agriculture, infrastructures et numérique : les indicateurs seront publiés avec leur source et leur date.</p>
              <span className="status">Module en préparation</span>
            </article>
            <article className="territory-map">
              <div className="map-grid" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <span className="map-label">Cartographie territoriale</span>
              <strong>Carte interactive</strong>
              <small>Villages · services · projets · besoins</small>
            </article>
          </div>
        </section>

        <section id="patrimoine" className="heritage section" aria-labelledby="heritage-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">05 — Patrimoine</p>
              <h2 id="heritage-title">Préserver ce qui<br /><em>doit se transmettre.</em></h2>
            </div>
            <p>
              La future mémoire numérique rassemblera des contenus documentés : archives, récits,
              travaux de recherche, ressources linguistiques et témoignages, dans le respect des droits et des personnes.
            </p>
          </div>
          <div className="heritage-grid">
            <article><span>01</span><h3>Bibliothèque</h3><p>Livres, études, rapports et publications accessibles selon leurs droits de diffusion.</p></article>
            <article><span>02</span><h3>Mémoire vivante</h3><p>Récits, histoire locale, témoignages oraux et grandes figures, avec contexte et sources.</p></article>
            <article><span>03</span><h3>Nangnda</h3><p>Un espace linguistique pouvant accueillir lexique, audio et ressources pédagogiques validées.</p></article>
          </div>
        </section>

        <section id="valeurs" className="values section" aria-labelledby="values-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">06 — Nos fondations</p>
              <h2 id="values-title">Des principes<br /><em>en mouvement.</em></h2>
            </div>
            <p>Des principes simples pour guider les décisions, les projets et la manière de travailler ensemble.</p>
          </div>
          <div className="value-grid">
            {values.map(([n, title, description]) => (
              <article className="value-card" key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto" aria-labelledby="manifesto-title">
          <div className="manifesto-inner">
            <p className="eyebrow">07 — Notre signature</p>
            <h2 id="manifesto-title">Courage.<br />Discipline.<br /><em>Héritage.</em></h2>
            <p>Parce que ce que nous construisons aujourd’hui doit pouvoir servir demain.</p>
          </div>
        </section>

        <section id="participer" className="participate section" aria-labelledby="participate-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">08 — Participer</p>
              <h2 id="participate-title">Une place pour<br /><em>chaque contribution.</em></h2>
            </div>
            <p>
              L’engagement peut prendre plusieurs formes. Les parcours ci-dessous sont prêts à accueillir
              les modalités réelles de participation dès qu’elles seront confirmées.
            </p>
          </div>
          <div className="engagement-list">
            {engagement.map(([n, title, description]) => (
              <article key={n}>
                <span>{n}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <b aria-hidden="true">↗</b>
              </article>
            ))}
          </div>
        </section>

        <section id="transparence" className="trust section" aria-labelledby="trust-title">
          <div>
            <p className="eyebrow">09 — Transparence</p>
            <h2 id="trust-title">Une organisation qui<br /><em>documente ses engagements.</em></h2>
          </div>
          <div className="trust-card">
            <span className="trust-mark" aria-hidden="true">◎</span>
            <h3>Rapports & ressources</h3>
            <p>
              Les rapports, documents institutionnels, informations de gouvernance et éléments
              de financement seront publiés ici lorsqu’ils seront disponibles et validés.
            </p>
            <span className="status dark">Espace en préparation</span>
          </div>
        </section>

        <section id="contact" className="contact section" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">10 — Contact</p>
            <h2 id="contact-title">Construire la suite<br /><em>ensemble.</em></h2>
          </div>
          <div className="contact-card">
            <p>
              Vous souhaitez contribuer, proposer une initiative ou préparer une collaboration ?
              Les coordonnées officielles pourront être ajoutées ici dès validation.
            </p>
            <a className="button primary" href="#participer">Voir les parcours <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <footer>
          <span>© ADEB Lonodji</span>
          <span>Courage · Discipline · Héritage</span>
          <a href="#top">Retour en haut ↑</a>
        </footer>
      </main>
    </>
  );
}
