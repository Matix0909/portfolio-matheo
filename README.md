# Portfolio — Mathéo Guéant

Site vitrine statique (HTML / CSS / JS pur, aucune dépendance, aucun build) prêt à être publié gratuitement.


## Structure

```
portfolio-matheo/
├── index.html              → page d'accueil
├── projets/index.html      → page Projets
├── blog/index.html         → page Blog (vierge en attendant Dotclear)
├── competences-e5/        → page Compétences E5 (bloc 1, tableau de synthèse)
├── cv/index.html           → page CV & Lettre (+ PDF et images)
├── lettredemotivation/     → redirection vers /cv/#lettre
├── css/
│   ├── style.css           → styles communs (couleurs, fond, en-tête, boutons, pied de page)
│   ├── accueil.css         → styles de la page d'accueil
│   ├── projets.css         → styles de la page Projets
│   ├── blog.css            → styles de la page Blog (vierge)
│   ├── e5.css              → styles de la page Compétences E5
│   └── cv.css              → styles de la page CV
├── js/
│   ├── background.js       → fond animé "circuit imprimé" (toutes les pages)
│   ├── accueil.js          → accueil : compétences animées, copie de l'email, effets de survol
│   ├── projets.js          → affichage des projets
│   ├── cv.js               → visionneuse d'images du CV
│   └── data/
│       └── projets.js      → ⭐ LISTE DES PROJETS (à modifier pour en ajouter)
└── assets/
    └── favicon.svg         → icône du site
```

## Personnaliser

- **Ajouter un projet** : `js/data/projets.js` — copie un bloc `{ ... }` (le mode d'emploi est en haut du fichier).
- **Blog** : géré avec Dotclear ; `blog/index.html` est une page vierge en attendant.
- **Compétences** : `index.html`, section `#competences` — chaque `<li style="--p:88%">` règle la longueur de la barre ; le niveau affiché et le cercle de moyenne sont dans le HTML juste à côté.
- **Contact** : `index.html`, section `#contact`.
- **Couleurs** : en haut de `css/style.css`, dans `:root { --signal: ... }`.

## Publier gratuitement

Trois options simples, sans serveur à gérer :

### 1. GitHub Pages (recommandé)
1. Crée un dépôt GitHub (ex. `portfolio-matheo`) et pousse ce dossier dedans.
2. Dans le dépôt : **Settings → Pages → Source : Deploy from a branch**, choisis la branche `main` et le dossier `/root`.
3. Le site est en ligne sur `https://<ton-user>.github.io/portfolio-matheo/` en une à deux minutes.

### 2. Netlify
1. Va sur [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**.
2. Glisse-dépose le dossier `portfolio-matheo` complet dans la zone de dépôt.
3. Le site est en ligne immédiatement, avec une URL `*.netlify.app` (personnalisable gratuitement).

### 3. Cloudflare Pages
1. Sur [pages.cloudflare.com](https://pages.cloudflare.com), crée un projet et connecte le dépôt GitHub (ou upload direct).
2. Aucune commande de build à définir (site 100 % statique) — laisse les champs de build vides.

## Notes techniques

- Aucune dépendance externe hors la police Google Fonts (IBM Plex Sans / Mono), chargée via CDN.
- Thème clair/sombre automatique (suit les préférences système) + bouton pour forcer un thème, mémorisé dans le navigateur.
- Fond animé (étoiles scintillantes + étoiles filantes occasionnelles) en `<canvas>`, désactivé automatiquement si l'utilisateur a activé "réduire les animations" dans son système.
- Animations d'apparition au défilement (`IntersectionObserver`), menu mobile, bouton retour en haut.
- Entièrement responsive (mobile, tablette, desktop).
