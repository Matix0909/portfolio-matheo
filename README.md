# Portfolio — Mathéo Guéant

Site vitrine statique (HTML / CSS / JS pur, aucune dépendance, aucun build) prêt à être publié gratuitement.


## Structure

```
portfolio-matheo/
├── index.html          → page unique du site
├── css/
│   └── style.css       → tous les styles (thème clair/sombre inclus)
├── js/
│   └── main.js         → fond étoilé animé, thème, menu mobile, animations au scroll
├── assets/
│   ├── favicon.svg      → logo/icône utilisée dans l'onglet + l'en-tête
│   └── img/             → dossier libre pour tes futures images (og-cover.png, etc.)
└── README.md
```

## Personnaliser

- **Coordonnées / liens** : dans `index.html`, section `#contact`, remplace l'email et les `href="#"` de LinkedIn et GitHub par tes vrais liens.
- **Projets** : chaque `.project` dans la section `#projets` — modifie le titre, la stack et la description.
- **Compétences** : chaque `<li data-progress="85">` — le nombre pilote la longueur de la barre (0 à 100).
- **Couleurs** : tout se règle en haut de `css/style.css`, dans `:root { --signal: ... }` etc.
- **Logo** : `assets/favicon.svg` est un simple monogramme vectoriel neutre (cercle + nœuds réseau). Modifiable dans n'importe quel éditeur SVG, ou remplaçable par ton propre logo (garde le nom de fichier ou mets à jour les `<link rel="icon">` et `<img>` dans `index.html`).

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
