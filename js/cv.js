function openLightbox(src, alt, isDoc) {
  var lb = document.getElementById('lightbox');
  var img = lb.querySelector('img');
  img.src = src; img.alt = alt;
  lb.classList.toggle('doc', !!isDoc);
  lb.classList.add('open');
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('open');
});
