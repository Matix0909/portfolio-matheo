/* ==========================================================
   Mathéo Guéant — Portfolio
   main.js — starfield background, nav, reveals
   ========================================================== */

(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('header');
  if (header) {
    var updateHeaderState = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Skill bar widths (from data-progress) ---------- */
  document.querySelectorAll('.skill li').forEach(function (li) {
    var val = li.getAttribute('data-progress');
    var bar = li.querySelector('.bar span');
    if (val && bar) { bar.style.setProperty('--w', val + '%'); bar.style.width = ''; }
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 480);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ==========================================================
     Starfield background canvas
     ========================================================== */
  var canvas = document.getElementById('stars');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var ctx = canvas.getContext('2d');
  var w, h, dpr;
  var stars = [];
  var shootingStars = [];
  var STAR_COUNT = 320;
  var lastTime = 0;

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

  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      var isBig = Math.random() < 0.12;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: isBig ? (Math.random() * 1.1 + 1.3) : (Math.random() * 1.1 + 0.4),
        baseAlpha: isBig ? (Math.random() * 0.25 + 0.7) : (Math.random() * 0.55 + 0.4),
        twinkleSpeed: Math.random() * 0.0014 + 0.0004,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.014,
        driftY: (Math.random() - 0.5) * 0.014,
        glow: isBig
      });
    }
  }

  function maybeSpawnShootingStar(time) {
    if (Math.random() < 0.005 && shootingStars.length < 3) {
      var startX = Math.random() * w * 0.7;
      var startY = Math.random() * h * 0.35;
      shootingStars.push({
        x: startX,
        y: startY,
        len: Math.random() * 90 + 70,
        speed: Math.random() * 9 + 7,
        angle: Math.PI / 5,
        life: 1
      });
    }
  }

  function step(time) {
    var dt = time - lastTime;
    lastTime = time;

    var starColor = '238,242,246';
    var signalColor = '95,211,163';

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.x += s.driftX;
      s.y += s.driftY;
      if (s.x < -5) s.x = w + 5;
      if (s.x > w + 5) s.x = -5;
      if (s.y < -5) s.y = h + 5;
      if (s.y > h + 5) s.y = -5;

      var tw = Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65;
      var alpha = s.baseAlpha * tw;
      var isAccent = i % 9 === 0;
      var color = isAccent ? signalColor : starColor;

      if (s.glow) {
        var glowR = s.r * 4.5;
        var grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        grad.addColorStop(0, 'rgba(' + color + ',' + (alpha * 0.35).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + color + ',0)');
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',' + alpha.toFixed(3) + ')';
      ctx.fill();
    }

    maybeSpawnShootingStar(time);
    for (var j = shootingStars.length - 1; j >= 0; j--) {
      var sh = shootingStars[j];
      var dx = Math.cos(sh.angle) * sh.speed;
      var dy = Math.sin(sh.angle) * sh.speed;
      sh.x += dx;
      sh.y += dy;
      sh.life -= 0.012;

      var tailX = sh.x - Math.cos(sh.angle) * sh.len;
      var tailY = sh.y - Math.sin(sh.angle) * sh.len;
      var grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, 'rgba(' + starColor + ',' + Math.max(sh.life, 0) + ')');
      grad.addColorStop(1, 'rgba(' + starColor + ',0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      if (sh.life <= 0 || sh.x > w + sh.len || sh.y > h + sh.len) {
        shootingStars.splice(j, 1);
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  initStars();
  requestAnimationFrame(step);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      initStars();
    }, 200);
  });
})();
