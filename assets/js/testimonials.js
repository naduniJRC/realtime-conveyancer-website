/* Testimonials carousel: 3D focus carousel with autoplay, face navigation,
   swipe, keyboard, word-by-word quote reveal and a full-review dialog. */
(function () {
  var root = document.getElementById('testimonials');
  if (!root) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 7000;
  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));
  var faces = Array.prototype.slice.call(root.querySelectorAll('[data-face]'));
  var track = root.querySelector('[data-track]');
  var stage = root.querySelector('[data-stage]');
  var status = root.querySelector('[data-status]');
  var n = cards.length, active = 0, timer = null, visible = false, paused = false, dialogOpen = false;
  root.style.setProperty('--rct-duration', DURATION + 'ms');

  // Wrap each word of every quote so it can fade in one after another
  root.querySelectorAll('[data-words]').forEach(function (p) {
    var words = p.textContent.split(' ');
    p.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'rct-w';
      s.style.setProperty('--i', Math.min(i, 60));
      s.textContent = w;
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
    });
  });

  function layout() {
    cards.forEach(function (c, i) {
      var rel = ((i - active) % n + n) % n;
      if (rel > n / 2) rel -= n;
      c.dataset.pos = Math.abs(rel) <= 2 ? String(rel) : 'far';
      c.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
      c.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = rel === 0 ? 0 : -1; });
      c.classList.remove('is-revealed');
    });
    faces.forEach(function (f, i) { f.setAttribute('aria-current', String(i === active)); });
    var f = faces[active];
    if (f && f.parentElement.scrollWidth > f.parentElement.clientWidth) {
      f.parentElement.scrollTo({ left: f.offsetLeft - f.parentElement.clientWidth / 2 + f.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
    track.style.setProperty('--track-h', (cards[active].offsetHeight + 40) + 'px');
    var current = cards[active];
    if (reduced) current.classList.add('is-revealed');
    else setTimeout(function () { current.classList.add('is-revealed'); }, 250);
    status.textContent = 'Review ' + (active + 1) + ' of ' + n;
  }

  function go(i) { active = (i + n) % n; layout(); schedule(); }

  function schedule() {
    clearTimeout(timer);
    root.classList.remove('is-timing');
    if (reduced || paused || !visible || dialogOpen) return;
    void root.offsetWidth;
    root.classList.add('is-timing');
    timer = setTimeout(function () { go(active + 1); }, DURATION);
  }
  function pause() { paused = true; root.classList.add('is-paused'); clearTimeout(timer); }
  function resume() { paused = false; root.classList.remove('is-paused'); schedule(); }

  root.querySelector('[data-prev]').addEventListener('click', function () { go(active - 1); });
  root.querySelector('[data-next]').addEventListener('click', function () { go(active + 1); });
  faces.forEach(function (f, i) { f.addEventListener('click', function () { go(i); }); });
  cards.forEach(function (c, i) {
    c.addEventListener('click', function () { if (i !== active) go(i); });
  });

  // Swipe / drag
  var startX = null;
  stage.addEventListener('pointerdown', function (e) { startX = e.clientX; });
  stage.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  });

  // Keyboard
  root.addEventListener('keydown', function (e) {
    if (dialogOpen) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  });

  // Pause while reading or interacting
  [stage, root.querySelector('.rct-controls')].forEach(function (el) {
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
  });
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) resume(); });

  // Full review dialog
  root.querySelectorAll('[data-open-review]').forEach(function (btn) {
    var dlg = document.getElementById('rct-review-' + btn.dataset.openReview);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    btn.addEventListener('click', function () { dialogOpen = true; clearTimeout(timer); dlg.showModal(); });
    dlg.addEventListener('close', function () { dialogOpen = false; btn.focus(); schedule(); });
    dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  window.addEventListener('resize', function () { track.style.setProperty('--track-h', (cards[active].offsetHeight + 40) + 'px'); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) schedule(); else clearTimeout(timer);
    }, { threshold: 0.3 }).observe(root);
  } else { visible = true; }

  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); });
})();
