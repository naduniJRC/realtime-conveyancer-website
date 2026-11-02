/* Benefits section (Option 1): expanding cards with autoplay, hover, click and arrows. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var o1 = document.getElementById('benefits');
  if (!o1) return;
  var cards = [].slice.call(o1.querySelectorAll('[data-card]'));
  var active = 0, timer = null, paused = false, visible = false, hoverT = null;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function act(i, user) {
    active = (i + cards.length) % cards.length;
    cards.forEach(function (c, n) {
      c.classList.toggle('rcb-on', n === active); c.classList.remove('rcb-timing');
      c.querySelector('.rcb-tab').setAttribute('aria-expanded', String(n === active));
    });
    sched();
  }
  function sched() {
    clearTimeout(timer);
    if (reduced || paused || !visible) return;
    void cards[active].offsetWidth; cards[active].classList.add('rcb-timing');
    timer = setTimeout(function () { act(active + 1); }, 6500);
  }
  cards.forEach(function (c, i) {
    c.querySelector('.rcb-tab').addEventListener('click', function () { act(i, true); });
    if (fine) {
      c.addEventListener('mouseenter', function () { if (i !== active) { clearTimeout(hoverT); hoverT = setTimeout(function () { act(i, true); }, 180); } });
      c.addEventListener('mouseleave', function () { clearTimeout(hoverT); });
    }
  });
  var prevBtn = o1.querySelector('[data-prev]');
  var nextBtn = o1.querySelector('[data-next]');
  if (prevBtn) prevBtn.addEventListener('click', function () { act(active - 1, true); });
  if (nextBtn) nextBtn.addEventListener('click', function () { act(active + 1, true); });
  var area = o1.querySelector('[data-cards]');
  area.addEventListener('mouseenter', function () { paused = true; o1.classList.add('rcb-paused'); clearTimeout(timer); });
  area.addEventListener('mouseleave', function () { paused = false; o1.classList.remove('rcb-paused'); sched(); });


  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? sched() : clearTimeout(timer); }, { threshold: .35 }).observe(o1);
  } else { visible = true; }
  act(0);
})();
