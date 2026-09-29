(function () {
  var $ = function (id) { return document.getElementById(id); };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); };

  var ICONS = {
    reseau: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-3h14v3"/></svg>',
    systeme: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></svg>',
    virtualisation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
    bdd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
    securite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    autre: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>'
  };
  var DOM = {
    reseau:         { nom: 'Réseau',         c: '95,211,163' },
    systeme:        { nom: 'Système',        c: '139,127,232' },
    virtualisation: { nom: 'Virtualisation', c: '96,165,250' },
    securite:       { nom: 'Sécurité',       c: '224,166,73' },
    bdd:            { nom: 'Base de données', c: '244,114,182' },
    autre:          { nom: 'Autre',          c: '148,163,184' }
  };
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg>';

  function dom(p) { return DOM[p.domaine] || DOM.autre; }

  /* Visuel réseau généré à partir de l'id (toujours le même pour un projet) */
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }
  function art(p) {
    var r = seed(p.id || p.titre), W = 400, H = 200, pts = [], s = '';
    var cols = 8, rows = 4;
    for (var y = 0; y <= rows; y++) for (var x = 0; x <= cols; x++)
      pts.push({ x: x * W / cols + (r() - 0.5) * 30, y: y * H / rows + (r() - 0.5) * 26, on: r() < 0.3 });
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      if ((i + 1) % (cols + 1) && r() < 0.6) { var b = pts[i + 1]; s += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" style="stroke:rgba(var(--c),' + (a.on ? 0.55 : 0.16) + ')" stroke-width="' + (a.on ? 1.4 : 1) + '"/>'; }
      if (i + cols + 1 < pts.length && r() < 0.5) { var d = pts[i + cols + 1]; s += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + d.x + '" y2="' + d.y + '" style="stroke:rgba(var(--c),' + (a.on ? 0.5 : 0.14) + ')" stroke-width="1"/>'; }
    }
    pts.forEach(function (n) {
      s += n.on
        ? '<circle cx="' + n.x + '" cy="' + n.y + '" r="9" style="fill:rgba(var(--c),0.14)"/><circle cx="' + n.x + '" cy="' + n.y + '" r="3.2" style="fill:rgb(var(--c))"/>'
        : '<circle cx="' + n.x + '" cy="' + n.y + '" r="1.6" style="fill:rgba(var(--c),0.35)"/>';
    });
    var gx = 60 + r() * 280, gy = 30 + r() * 100;
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><radialGradient id="g-' + p.id + '"><stop offset="0" style="stop-color:rgba(var(--c),0.35)"/><stop offset="1" style="stop-color:rgba(var(--c),0)"/></radialGradient></defs>' +
      '<circle cx="' + gx + '" cy="' + gy + '" r="170" fill="url(#g-' + p.id + ')"/>' + s + '</svg>';
  }
  function cover(p) {
    var d = dom(p);
    return '<div class="cover">' + (has(p.image) ? '<img src="' + p.image + '" alt="" loading="lazy">' : art(p)) +
      '<span class="status' + (p.statut === 'En cours' ? ' wip' : '') + '">' + (p.statut || 'Terminé') + '</span>' +
      '<span class="icon">' + (ICONS[p.domaine] || ICONS.autre) + '</span></div>';
  }
  function stack(p) { return has(p.stack) ? '<ul class="stack">' + p.stack.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : ''; }

  var filtre = 'tous';

  /* Stats */
  var techs = {}; PROJETS.forEach(function (p) { (p.stack || []).forEach(function (t) { techs[t] = 1; }); });
  var doms = {}; PROJETS.forEach(function (p) { doms[p.domaine || 'autre'] = 1; });
  $('stats').innerHTML =
    '<div><span class="num">' + PROJETS.length + '</span><span class="lbl">projets</span></div>' +
    '<div><span class="num">' + Object.keys(techs).length + '</span><span class="lbl">technologies</span></div>' +
    '<div><span class="num">' + Object.keys(doms).length + '</span><span class="lbl">domaines</span></div>' +
    '<div><span class="num">' + PROJETS.filter(function (p) { return p.statut === 'En cours'; }).length + '</span><span class="lbl">en cours</span></div>';

  function renderFilters() {
    var counts = { tous: PROJETS.length };
    PROJETS.forEach(function (p) { var k = DOM[p.domaine] ? p.domaine : 'autre'; counts[k] = (counts[k] || 0) + 1; });
    $('filters').innerHTML = Object.keys(counts).map(function (k) {
      return '<button class="chip' + (k === filtre ? ' active' : '') + '" data-k="' + k + '">' + (k === 'tous' ? 'Tous' : DOM[k].nom) + '<span class="n">' + counts[k] + '</span></button>';
    }).join('');
    $('filters').querySelectorAll('.chip').forEach(function (b) { b.onclick = function () { filtre = b.dataset.k; renderFilters(); renderGrid(); }; });
  }

  function renderGrid() {
    var list = PROJETS.filter(function (p) { return filtre === 'tous' || (DOM[p.domaine] ? p.domaine : 'autre') === filtre; });
    if (!list.length) { $('grid').innerHTML = '<div class="empty">Aucun projet dans cette catégorie pour le moment.</div>'; return; }
    /* Nombre de cartes "vedette" en grand pour remplir la grille sans trou */
    var bigLeft = filtre === 'tous' ? (3 - list.length % 3) % 3 : 0;
    $('grid').innerHTML = list.map(function (p, i) {
      var d = dom(p);
      var big = p.vedette && bigLeft > 0 && !!(bigLeft--);
      return '<a class="card' + (big ? ' big' : '') + '" href="#' + p.id + '" style="--c:' + d.c + ';animation-delay:' + (i * 70) + 'ms">' +
        cover(p) + '<div class="card-body"><span class="kicker">' + d.nom + (has(p.annee) ? ' · ' + p.annee : '') + '</span>' +
        '<h2>' + p.titre + '</h2><p>' + (p.resume || '') + '</p>' + stack(p) +
        '<span class="more">Voir le projet <span>→</span></span></div></a>';
    }).join('');
  }

  function renderDetail(p) {
    var d = dom(p), i = PROJETS.indexOf(p), prev = PROJETS[i - 1], next = PROJETS[i + 1];
    var meta = [['Contexte', p.contexte], ['Année', p.annee], ['Durée', p.duree], ['Rôle', p.role]].filter(function (m) { return has(m[1]); });
    var main = '', side = '';
    if (has(p.objectif)) main += '<div class="panel"><h2>Objectif</h2><p>' + p.objectif + '</p></div>';
    if (has(p.etapes)) main += '<div class="panel"><h2>Réalisation</h2><ol class="steps">' + p.etapes.map(function (e) {
      return '<li>' + (e.titre ? '<strong>' + e.titre + '</strong>' : '') + (e.texte || '') + '</li>'; }).join('') + '</ol></div>';
    if (has(p.images)) main += '<div class="panel"><h2>Captures</h2><div class="gallery">' + p.images.map(function (im) {
      return '<figure><img src="' + im.src + '" alt="' + (im.legende || '') + '" loading="lazy">' + (im.legende ? '<figcaption>' + im.legende + '</figcaption>' : '') + '</figure>'; }).join('') + '</div></div>';
    if (has(p.resultats)) side += '<div class="panel"><h2>Résultats</h2><ul class="checks">' + p.resultats.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    if (has(p.competences)) side += '<div class="panel"><h2>Compétences BTS</h2><ul class="skills-list">' + p.competences.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    if (has(p.documents)) side += '<div class="panel"><h2>Documents</h2><ul class="docs">' + p.documents.map(function (x) { return '<li><a href="' + x.lien + '" target="_blank" rel="noopener">' + DOC + x.nom + '</a></li>'; }).join('') + '</ul></div>';

    $('view-detail').innerHTML =
      '<a class="back" href="#">← Tous les projets</a>' +
      '<div class="d-hero" style="--c:' + d.c + '">' + cover(p) +
      '<div class="d-head"><span class="kicker" style="color:rgb(' + d.c + ')">' + d.nom + '</span><h1>' + p.titre + '</h1>' +
      (has(p.resume) ? '<p class="lead">' + p.resume + '</p>' : '') + stack(p) + '</div></div>' +
      (meta.length ? '<div class="meta">' + meta.map(function (m) { return '<div><span class="lbl">' + m[0] + '</span><span class="val">' + m[1] + '</span></div>'; }).join('') + '</div>' : '<div style="height:22px"></div>') +
      (main || side ? '<div class="d-grid" style="--c:' + d.c + ';' + (side ? '' : 'grid-template-columns:1fr') + '"><div>' + main + '</div>' + (side ? '<aside>' + side + '</aside>' : '') + '</div>' : '') +
      '<div class="pn">' +
      (prev ? '<a href="#' + prev.id + '"><span class="lbl">← Projet précédent</span><span class="t">' + prev.titre + '</span></a>' : '') +
      (next ? '<a class="next" href="#' + next.id + '"><span class="lbl">Projet suivant →</span><span class="t">' + next.titre + '</span></a>' : '') +
      '</div>';
    $('view-detail').querySelectorAll('.gallery img').forEach(function (img) {
      img.onclick = function () { var lb = $('lightbox'); lb.querySelector('img').src = img.src; lb.classList.add('open'); };
    });
    document.title = p.titre + ' — Projets — Mathéo Guéant';
  }

  function route() {
    var id = decodeURIComponent(location.hash.slice(1));
    var p = PROJETS.filter(function (x) { return x.id === id; })[0];
    $('view-list').hidden = !!p;
    $('view-detail').hidden = !p;
    if (p) { renderDetail(p); window.scrollTo(0, 0); }
    else document.title = 'Projets — Mathéo Guéant';
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('lightbox').classList.remove('open'); });
  window.addEventListener('hashchange', route);
  renderFilters();
  renderGrid();
  route();
})();
