/* Awards section: reveal on scroll, count-up, badge tilt and a one-off shine sweep. */
(function () {
  var root = document.getElementById('awards');
  if (!root) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = Array.prototype.slice.call(root.querySelectorAll('.rca-card'));
  var num = root.querySelector('[data-count]');

  function countUp() {
    var target = Number(num.dataset.count), start = null;
    if (reduced) { num.textContent = target; return; }
    function step(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / 900);
      num.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    num.textContent = '0';
    requestAnimationFrame(step);
  }

  function reveal() {
    root.classList.add('is-in');
    countUp();
    if (reduced) return;
    // shine each badge once, one after another, after the cards land
    cards.forEach(function (c, i) {
      setTimeout(function () { c.classList.add('is-shining'); setTimeout(function () { c.classList.remove('is-shining'); }, 1100); }, 1300 + i * 220);
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { reveal(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(root);
  } else { reveal(); }

  // 3D tilt on the badge following the mouse
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    cards.forEach(function (c) {
      var inner = c.querySelector('.rca-badge-inner');
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.setProperty('--ry', (x * 26).toFixed(1) + 'deg');
        inner.style.setProperty('--rx', (-y * 18).toFixed(1) + 'deg');
      });
      c.addEventListener('mouseleave', function () { inner.style.setProperty('--ry', '0deg'); inner.style.setProperty('--rx', '0deg'); });
    });
  }
})();
