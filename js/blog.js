(function () {
  var $ = function (id) { return document.getElementById(id); };
  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function fmt(d) { var p = String(d || '').split('-'); return p.length === 3 ? (+p[2]) + ' ' + MOIS[+p[1] - 1] + ' ' + p[0] : d; }
  function words(html) { var t = String(html || '').replace(/<[^>]+>/g, ' ').trim(); return t ? t.split(/\s+/).length : 0; }
  function read(a) { return Math.max(1, Math.round(words(a.contenu) / 200)) + ' min'; }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  var posts = ARTICLES.filter(function (a) { return a && !a.brouillon; })
    .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

  var cat = 'Tous', query = '';

  function cover(a) {
    return '<div class="post-cover">' + (a.image
      ? '<img src="' + a.image + '" alt="" loading="lazy">'
      : '<div class="ph">// ' + (a.categorie || 'blog').toLowerCase() + '</div>') + '</div>';
  }

  function renderFilters() {
    var counts = { 'Tous': posts.length };
    posts.forEach(function (a) { var c = a.categorie || 'Divers'; counts[c] = (counts[c] || 0) + 1; });
    $('filters').innerHTML = Object.keys(counts).map(function (c) {
      return '<button class="chip' + (c === cat ? ' active' : '') + '" data-cat="' + c + '">' + c + '<span class="n">' + counts[c] + '</span></button>';
    }).join('');
    $('filters').querySelectorAll('.chip').forEach(function (b) {
      b.onclick = function () { cat = b.dataset.cat; renderFilters(); renderList(); };
    });
  }

  function renderList() {
    var q = norm(query);
    var list = posts.filter(function (a) {
      if (cat !== 'Tous' && (a.categorie || 'Divers') !== cat) return false;
      if (!q) return true;
      return norm(a.titre + ' ' + a.resume + ' ' + (a.tags || []).join(' ') + ' ' + a.categorie).indexOf(q) !== -1;
    });
    if (!posts.length) { $('posts').innerHTML = '<div class="empty"><span class="mono">// blog</span>Aucun article pour le moment.</div>'; return; }
    if (!list.length) { $('posts').innerHTML = '<div class="empty"><span class="mono">// 0 résultat</span>Aucun article ne correspond à ta recherche.</div>'; return; }
    $('posts').innerHTML = list.map(function (a, i) {
      var feat = i === 0 && cat === 'Tous' && !q;
      return '<a class="post-card' + (feat ? ' featured' : '') + '" href="#' + a.id + '">' + cover(a) +
        '<div class="post-body"><div class="post-meta"><span class="cat">' + (a.categorie || 'Divers') + '</span><span>' + fmt(a.date) + '</span><span>· ' + read(a) + '</span></div>' +
        '<h2>' + a.titre + '</h2><p>' + (a.resume || '') + '</p><span class="post-more">Lire l\'article →</span></div></a>';
    }).join('');
  }

  function renderPost(a) {
    var i = posts.indexOf(a);
    var newer = posts[i - 1], older = posts[i + 1];
    var nav = '<div class="post-nav">' +
      (older ? '<a href="#' + older.id + '"><span class="lbl">← Article précédent</span><span class="t">' + older.titre + '</span></a>' : '') +
      (newer ? '<a class="next" href="#' + newer.id + '"><span class="lbl">Article suivant →</span><span class="t">' + newer.titre + '</span></a>' : '') +
      '</div>';
    $('view-post').innerHTML =
      '<a class="back" href="#">← Tous les articles</a>' +
      '<div class="post-meta"><span class="cat">' + (a.categorie || 'Divers') + '</span><span>' + fmt(a.date) + '</span><span>· ' + read(a) + ' de lecture</span></div>' +
      '<h1>' + a.titre + '</h1>' + (a.resume ? '<p class="lead">' + a.resume + '</p>' : '') +
      (a.tags && a.tags.length ? '<ul class="tags">' + a.tags.map(function (t) { return '<li>#' + t + '</li>'; }).join('') + '</ul>' : '') +
      (a.image ? '<div class="cover"><img src="' + a.image + '" alt=""></div>' : '') +
      '<div class="prose">' + a.contenu + '</div>' + nav;
    $('view-post').querySelectorAll('.prose img').forEach(function (img) {
      img.onclick = function () { var lb = $('lightbox'); lb.querySelector('img').src = img.src; lb.classList.add('open'); };
    });
    document.title = a.titre + ' — Blog — Mathéo Guéant';
  }

  function route() {
    var id = decodeURIComponent(location.hash.slice(1));
    var a = posts.filter(function (p) { return p.id === id; })[0];
    $('view-list').hidden = !!a;
    $('view-post').hidden = !a;
    if (a) { renderPost(a); window.scrollTo(0, 0); }
    else document.title = 'Blog — Mathéo Guéant';
  }

  $('search').addEventListener('input', function (e) { query = e.target.value; renderList(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('lightbox').classList.remove('open'); });
  window.addEventListener('hashchange', route);

  renderFilters();
  renderList();
  route();
})();
