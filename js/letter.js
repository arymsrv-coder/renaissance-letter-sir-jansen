(function () {
  var doc = document, body = doc.body;
  doc.documentElement.classList.add('js');

  var intro = doc.getElementById('intro');
  var btn = doc.getElementById('open');
  var env = btn;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function observe() {
    var els = doc.querySelectorAll('.fade');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  function reveal() {
    body.classList.remove('intro-lock');
    body.classList.add('opened');
    intro.classList.add('gone');
    window.scrollTo(0, 0);
    try { sessionStorage.setItem('jansen-opened', '1'); } catch (e) {}
    observe();
  }

  var seen = false;
  try { seen = sessionStorage.getItem('jansen-opened') === '1'; } catch (e) {}
  if (location.hash === '#letter' || seen) {
    // coming back from the gallery: skip the envelope
    reveal();
    if (location.hash === '#letter') window.scrollTo(0, 0);
    return;
  }

  btn.addEventListener('click', function () {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    body.classList.add('opening');
    if (reduce) { reveal(); return; }
    setTimeout(function () { env.classList.add('rise'); }, 650);
    setTimeout(function () { intro.classList.add('leaving'); }, 1900);
    setTimeout(reveal, 2700);
  });
})();
