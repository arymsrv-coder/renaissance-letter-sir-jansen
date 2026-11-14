(function () {
  var STRIPS = 5, PHOTOS = 20;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  var strips = [], photos = [];
  for (var s = 1; s <= STRIPS; s++) {
    strips.push({ thumb: 'strips/strip-' + pad(s) + '-s.jpg', full: 'strips/strip-' + pad(s) + '.jpg',
                  label: 'Strip ' + pad(s), file: 'Sir-Jansen-strip-' + pad(s) + '.jpg' });
  }
  for (var p = 1; p <= PHOTOS; p++) {
    photos.push({ thumb: 'thumbs/p' + pad(p) + '.jpg', full: 'photos/p' + pad(p) + '.jpg',
                  label: 'Photo ' + pad(p) + ' / ' + PHOTOS, file: 'Sir-Jansen-photo-' + pad(p) + '.jpg' });
  }

  var gs = document.getElementById('grid-strips'), gp = document.getElementById('grid-photos');
  document.getElementById('count-strips').textContent = '· ' + STRIPS;
  document.getElementById('count-photos').textContent = '· ' + PHOTOS;

  strips.forEach(function (it, i) {
    var b = document.createElement('button');
    b.className = 'strip-item'; b.type = 'button';
    b.setAttribute('aria-label', 'Open ' + it.label);
    b.innerHTML = '<img loading="lazy" decoding="async" width="520" height="1760" alt="Photo strip ' + (i + 1) + ' of Sir Jansen" src="' + it.thumb + '"><span>' + it.label + '</span>';
    b.addEventListener('click', function () { open(strips, i, b); });
    gs.appendChild(b);
  });
  photos.forEach(function (it, i) {
    var b = document.createElement('button');
    b.className = 'photo-item'; b.type = 'button';
    b.setAttribute('aria-label', 'Open ' + it.label);
    b.innerHTML = '<img loading="lazy" decoding="async" width="640" height="427" alt="Sir Jansen at the seminar, photo ' + (i + 1) + '" src="' + it.thumb + '">';
    b.addEventListener('click', function () { open(photos, i, b); });
    gp.appendChild(b);
  });

  // tabs
  var tabS = document.getElementById('tab-strips'), tabP = document.getElementById('tab-photos');
  function show(which) {
    var s = which === 'strips';
    tabS.classList.toggle('on', s); tabP.classList.toggle('on', !s);
    tabS.setAttribute('aria-selected', s); tabP.setAttribute('aria-selected', !s);
    gs.hidden = !s; gp.hidden = s;
    try { history.replaceState(null, '', s ? location.pathname : '#photos'); } catch (e) {}
  }
  tabS.addEventListener('click', function () { show('strips'); });
  tabP.addEventListener('click', function () { show('photos'); });
  if (location.hash === '#photos') show('photos');

  // lightbox
  var lb = document.getElementById('lb'), img = document.getElementById('lb-img'),
      cap = document.getElementById('lb-cap'), dl = document.getElementById('lb-dl');
  var list = [], idx = 0, opener = null;

  function render() {
    var it = list[idx];
    img.src = it.full; img.alt = it.label; cap.textContent = it.label;
    dl.href = it.full; dl.setAttribute('download', it.file);
    var n = list[(idx + 1) % list.length]; new Image().src = n.full; // preload next
  }
  function open(l, i, el) {
    list = l; idx = i; opener = el; render();
    lb.hidden = false; document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  }
  function close() {
    lb.hidden = true; document.body.style.overflow = ''; img.src = '';
    if (opener) opener.focus();
  }
  function step(d) { idx = (idx + d + list.length) % list.length; render(); }

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', function () { step(-1); });
  document.getElementById('lb-next').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
})();
