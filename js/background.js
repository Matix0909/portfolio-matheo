(function () {
  // Fond "circuit imprimé" en 4 couches de profondeur.
  // Chaque couche est un maillage de traces avec des impulsions lumineuses ;
  // plus la couche est proche, plus les nœuds sont gros, flous et rapides.
  // Les couches défilent à des vitesses différentes (parallaxe au scroll + souris)
  // et se répètent à l'infini : le fond couvre toute la page, de haut en bas.
  var canvas = document.getElementById('netbg');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var root = document.documentElement;
  var lightMQ = window.matchMedia('(prefers-color-scheme: light)');
  var TAU = Math.PI * 2;
  var w, h, dpr;
  var sy = window.pageYOffset || 0;
  var mx = 0, my = 0, tmx = 0, tmy = 0, last = 0;
  var layers = [];

  var COLORS = {
    signal: '95,211,163',
    amber: '224,166,73',
    violet: '139,127,232',
    inkD: '238,242,246',
    inkL: '21,32,43'
  };

  // cell : taille de maille · par : parallaxe au scroll · drift : dérive (px/s)
  // line/lw : opacité/épaisseur des traces · nr/na : rayon/opacité des nœuds
  // halo/ha : rayon/opacité du halo des nœuds · hs : rayon du halo des impulsions
  // tail : longueur de traînée · sp : vitesse · keep : densité des traces
  // pf : quantité d'impulsions · on : proportion de nœuds actifs
  var LAYERS = [
    { cell: 84,  par: 0.05, drift: 3,  line: 0.05, lw: 0.6, nr: 0.9, na: 0.22, halo: 0,  ha: 0,    hs: 9,  tail: 14, sp: 0.5, keep: 0.55, pf: 0.05, on: 0.5 },
    { cell: 130, par: 0.16, drift: 6,  line: 0.09, lw: 1,   nr: 1.8, na: 0.34, halo: 16, ha: 0.30, hs: 17, tail: 32, sp: 0.9, keep: 0.50, pf: 0.07, on: 0.5 },
    { cell: 230, par: 0.42, drift: 11, line: 0.13, lw: 1.8, nr: 3.4, na: 0.48, halo: 40, ha: 0.55, hs: 36, tail: 76, sp: 1.5, keep: 0.42, pf: 0.10, on: 0.6 },
    { cell: 380, par: 0.80, drift: 16, line: 0,    lw: 0,   nr: 0,   na: 0,    halo: 90, ha: 0.16, hs: 0,  tail: 0,  sp: 0,   keep: 0,    pf: 0,    on: 0.45 }
  ];

  var sprites = {};
  Object.keys(COLORS).forEach(function (k) { sprites[k] = makeSprite(COLORS[k]); });

  function makeSprite(rgb) {
    var s = document.createElement('canvas');
    s.width = s.height = 64;
    var g = s.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(' + rgb + ',1)');
    grad.addColorStop(0.18, 'rgba(' + rgb + ',0.55)');
    grad.addColorStop(0.5, 'rgba(' + rgb + ',0.14)');
    grad.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return s;
  }

  function pickHue() {
    var r = Math.random();
    return r < 0.5 ? 'signal' : (r < 0.78 ? 'violet' : 'amber');
  }
  function pulseHue() {
    var r = Math.random();
    return r < 0.72 ? 'signal' : (r < 0.86 ? 'amber' : 'violet');
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addEdge(L, a, b) {
    var A = L.nodes[a], B = L.nodes[b];
    var dx = B.x - A.x, dy = B.y - A.y;
    if (dy < -L.tileH / 2) dy += L.tileH;
    L.edges.push({ a: a, b: b, len: Math.sqrt(dx * dx + dy * dy) || 1, ax: 0, ay: 0, bx: 0, by: 0 });
  }

  function spawn(L, startRandom) {
    L.pulses.push({
      e: L.edges[(Math.random() * L.edges.length) | 0],
      t: startRandom ? Math.random() : 0,
      v: (0.4 + Math.random() * 0.5) * L.sp,
      hue: pulseHue()
    });
  }

  function build() {
    var k = w < 760 ? 0.72 : 1;
    layers = LAYERS.map(function (cfg) {
      var L = {}, key;
      for (key in cfg) L[key] = cfg[key];
      L.cell = cfg.cell * k;
      L.halo = cfg.halo * k;
      var cols = Math.ceil(w / L.cell) + 3;
      var rows = Math.ceil((h + 2 * L.cell) / L.cell) + 1;
      L.tileH = rows * L.cell;
      L.nodes = [];
      L.edges = [];
      L.pulses = [];

      var grid = [], jit = L.cell * 0.32, gx, gy;
      for (gy = 0; gy < rows; gy++) {
        grid[gy] = [];
        for (gx = 0; gx < cols; gx++) {
          grid[gy][gx] = L.nodes.length;
          L.nodes.push({
            x: (gx - 1) * L.cell + (Math.random() - 0.5) * jit,
            y: gy * L.cell + (Math.random() - 0.5) * jit,
            on: Math.random() < L.on,
            ph: Math.random() * TAU,
            tw: 0.5 + Math.random() * 1.3,
            hue: pickHue()
          });
        }
      }

      if (L.keep) {
        for (gy = 0; gy < rows; gy++) {
          for (gx = 0; gx < cols; gx++) {
            var a = grid[gy][gx];
            if (gx < cols - 1 && Math.random() < L.keep) addEdge(L, a, grid[gy][gx + 1]);
            // la dernière rangée se raccorde à la première : la couche boucle sans coupure
            if (Math.random() < L.keep) addEdge(L, a, grid[(gy + 1) % rows][gx]);
          }
        }
      }

      L.pos = new Float32Array(L.nodes.length * 2);
      if (L.pf && L.edges.length) {
        var count = Math.max(5, Math.round(L.edges.length * L.pf));
        for (var i = 0; i < count; i++) spawn(L, true);
      }
      return L;
    });
  }

  function draw(now, dt) {
    var theme = root.getAttribute('data-theme');
    var light = theme === 'light' || (theme !== 'dark' && lightMQ.matches);
    var ink = light ? COLORS.inkL : COLORS.inkD;

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

    for (var li = 0; li < layers.length; li++) {
      var L = layers[li], nodes = L.nodes, edges = L.edges, P = L.pos;
      var i, e, n, ax, ay, bx, by;
      var off = sy * L.par + now * 0.001 * L.drift;
      var ox = mx * L.par * 60, oy = my * L.par * 40;
      var half = L.tileH / 2;

      // position écran de chaque nœud (répétition verticale infinie)
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        P[2 * i] = n.x + ox;
        P[2 * i + 1] = (((n.y - off) % L.tileH) + L.tileH) % L.tileH - L.cell + oy;
      }

      // traces
      if (L.line) {
        ctx.lineWidth = L.lw;
        ctx.strokeStyle = 'rgba(' + ink + ',' + L.line + ')';
        ctx.beginPath();
        for (i = 0; i < edges.length; i++) {
          e = edges[i];
          ax = P[2 * e.a]; ay = P[2 * e.a + 1];
          bx = P[2 * e.b]; by = P[2 * e.b + 1];
          if (by - ay > half) by -= L.tileH;
          else if (by - ay < -half) by += L.tileH;
          e.ax = ax; e.ay = ay; e.bx = bx; e.by = by;
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
        }
        ctx.stroke();
      }

      // nœuds : petits points au loin, grosses "étoiles" à halo et scintillement au premier plan
      var pad = L.halo + 8;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (!n.on) continue;
        var x = P[2 * i], y = P[2 * i + 1];
        if (x < -pad || x > w + pad || y < -pad || y > h + pad) continue;
        var tw = 0.65 + 0.35 * Math.sin(now * 0.001 * n.tw + n.ph);
        if (L.halo) {
          ctx.globalAlpha = L.ha * tw;
          ctx.drawImage(sprites[n.hue], x - L.halo, y - L.halo, L.halo * 2, L.halo * 2);
        }
        if (L.nr) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(' + ink + ',' + (L.na * tw).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(x, y, L.nr, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // impulsions lumineuses
      for (i = L.pulses.length - 1; i >= 0; i--) {
        var p = L.pulses[i];
        e = p.e;
        p.t += p.v * dt / e.len;
        if (p.t >= 1) { L.pulses.splice(i, 1); spawn(L, false); continue; }
        var fade = Math.sin(p.t * Math.PI);
        var px = e.ax + (e.bx - e.ax) * p.t;
        var py = e.ay + (e.by - e.ay) * p.t;
        var tt = Math.max(0, p.t - L.tail / e.len);
        var tx = e.ax + (e.bx - e.ax) * tt;
        var ty = e.ay + (e.by - e.ay) * tt;

        ctx.strokeStyle = 'rgba(' + COLORS[p.hue] + ',' + (0.4 * fade).toFixed(3) + ')';
        ctx.lineWidth = L.lw + 0.8;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.globalAlpha = 0.2 + 0.8 * fade;
        ctx.drawImage(sprites[p.hue], px - L.hs, py - L.hs, L.hs * 2, L.hs * 2);
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function frame(now) {
    var dt = last ? Math.min(3, (now - last) / 16.667) : 1;
    last = now;
    mx += (tmx - mx) * 0.05 * dt;
    my += (tmy - my) * 0.05 * dt;
    draw(now, dt);
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', function () {
    sy = window.pageYOffset || 0;
    root.style.setProperty('--sy', sy);
  }, { passive: true });

  window.addEventListener('pointermove', function (ev) {
    if (ev.pointerType === 'touch') return;
    tmx = (ev.clientX / w - 0.5) * 2;
    tmy = (ev.clientY / h - 0.5) * 2;
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      build();
    }, 200);
  });

  root.style.setProperty('--sy', sy);
  resize();
  build();
  requestAnimationFrame(frame);
})();
