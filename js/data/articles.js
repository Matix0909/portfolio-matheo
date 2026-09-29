/* =====================================================================
   ARTICLES DU BLOG — POUR AJOUTER UN ARTICLE, COPIE UN BLOC { ... }
   ---------------------------------------------------------------------
   id        : identifiant unique, sans espace ni accent (sert au lien)
   titre     : titre de l'article
   date      : format "AAAA-MM-JJ" (les articles sont triés tout seuls)
   categorie : ex "Veille", "Projet", "Tuto", "Stage", "Cyber"...
   resume    : 1 à 2 phrases affichées sur la carte
   image     : optionnel, ex "img/mon-image.png" (dossier /blog/img/)
   tags      : optionnel, ex ["Linux", "Réseau"]
   brouillon : mets true pour cacher l'article sans le supprimer
   contenu   : le texte de l'article en HTML, entre ` ` (backticks).
               Balises utiles : <h2> <h3> <p> <ul><li> <strong>
               <a href=""> <code> <pre><code>...</code></pre>
               <blockquote> <img src="img/x.png" alt="">
   ===================================================================== */

var ARTICLES = [
  {
    id: "bienvenue",
    titre: "Bienvenue sur mon blog",
    date: "2026-09-23",
    categorie: "Actu",
    resume: "Premier article : ce que tu trouveras ici — veille, projets BTS SIO et retours d'expérience.",
    image: "",
    tags: ["BTS SIO", "SISR"],
    brouillon: false,
    contenu: `
      <p>Bienvenue sur mon blog ! J'y publie mes articles de <strong>veille technologique</strong>, mes projets réalisés en BTS SIO option SISR et mes retours d'expérience de stage.</p>
      <h2>Ce que tu vas trouver ici</h2>
      <ul>
        <li>De la veille sur les réseaux, la cybersécurité et l'administration système</li>
        <li>Des tutos pas à pas (Windows Server, Linux, virtualisation…)</li>
        <li>Le détail de mes projets</li>
      </ul>
      <p>Bonne lecture !</p>
    `
  },

  // ---- MODÈLE : copie ce bloc (avec la virgule) pour un nouvel article ----
  {
    id: "mon-article",
    titre: "Titre de l'article",
    date: "2026-10-01",
    categorie: "Veille",
    resume: "Résumé court de l'article.",
    image: "",
    tags: [],
    brouillon: true,   // ← passe à false pour le publier
    contenu: `
      <p>Ton texte ici.</p>
    `
  },
];
/* ======================= FIN DES ARTICLES ============================ */
