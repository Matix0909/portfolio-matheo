(function () {
  var btn = document.getElementById('copyMail');
  if (btn) btn.addEventListener('click', function () {
    var mail = 'gueantmatheo0@gmail.com', label = btn.querySelector('span');
    var done = function () {
      btn.classList.add('ok'); label.textContent = 'Copié !';
      setTimeout(function () { btn.classList.remove('ok'); label.textContent = 'Copier'; }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(mail).then(done, fallback);
    } else fallback();
    function fallback() {
      var t = document.createElement('textarea'); t.value = mail; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(t); done();
    }
  });
  // Compétences : les barres se remplissent quand la section arrive à l'écran
  var skills = document.querySelector('.skills');
  if (skills) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { skills.classList.add('in'); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(skills);
    } else skills.classList.add('in');
  }

  // Halo qui suit la souris sur les cartes
  document.querySelectorAll('.project, .skill').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
