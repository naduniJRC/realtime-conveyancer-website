/* Connected section: live sync loop, clickable steps, mouse depth, reveal.
   Move to assets/js/connected.js in the project. */
(function () {
  var root = document.getElementById('connected');
  if (!root) return;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel) { return root.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

  // Pathway to Settlement steps (from the app)
  var STEPS = ['', 'Property under offer', 'Meet your conveyancer', 'Initial documents being prepared',
    'Initial documents signed', 'Sale unconditional', 'ID check ready to complete', 'ID check successful',
    'Bank account details confirmed', 'Settlement booking', 'Settlement effected'];
  // current step shown in the app for each phase (0 = start)
  var CURRENT = [4, 5, 6, 10];
  var EVENTS = [
    null,
    { dot: '#9cc8e8', tint: '#9cc8e8', soft: '#e4eff8', text: 'Initial documents signed. You’re now at step 5.' },
    { dot: '#e3a1c0', tint: '#e3a1c0', soft: '#f7e3ec', text: 'Your sale is unconditional. You’re now at step 6.' },
    { dot: '#8fd16a', tint: '#8fd16a', soft: '#e6f3dc', text: 'Settlement has been booked.' }
  ];

  var tasks = $$('[data-task]');
  var steps = $$('[data-go]');
  var dot = $('[data-dot]');
  var toast = $('[data-toast]');
  var phase = 0, loopTimer = null, arriveTimer = null, running = false;

  function setPhone(p) {
    toast.classList.remove('is-in');
    var ev = EVENTS[p];
    if (!ev) return;
    toast.style.setProperty('--toast-tint', ev.tint);
    toast.style.setProperty('--toast-soft', ev.soft);
    $('[data-toast-text]').textContent = ev.text;
    void toast.offsetWidth;
    toast.classList.add('is-in');
  }

  function goTo(p) {
    phase = p;
    tasks.forEach(function (t, i) {
      var done = p > i;
      t.classList.toggle('is-done', done);
      t.querySelector('.rcc-task-status').textContent = done ? 'Done' : 'To do';
    });
    $('[data-done]').textContent = CURRENT[p] - 1;
    $('[data-laptop-step]').textContent = CURRENT[p];
    steps.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.go) === p)); });

    clearTimeout(arriveTimer);
    if (p === 0) { setPhone(0); return; }
    if (reduced) { setPhone(p); return; }
    if (dot) {
      dot.style.setProperty('--dot', EVENTS[p].dot);
      dot.classList.remove('is-moving'); void dot.offsetWidth; dot.classList.add('is-moving');
    }
    arriveTimer = setTimeout(function () { setPhone(p); }, 1100);
  }

  function next() { goTo(phase >= 3 ? 0 : phase + 1); }
  function start() {
    if (running || reduced) return;
    running = true;
    clearInterval(loopTimer);
    loopTimer = setInterval(next, 3400);
  }
  function stop() { running = false; clearInterval(loopTimer); }

  steps.forEach(function (b) {
    b.addEventListener('click', function () {
      goTo(Number(b.dataset.go));
      if (!reduced) { stop(); start(); }
    });
  });

  // Reveal + start the loop when the section scrolls into view; pause when off-screen.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          root.classList.add('is-ready');
          if (reduced) { goTo(1); } else { start(); }
        } else { stop(); }
      });
    }, { threshold: 0.25 });
    io.observe(root);
  } else {
    root.classList.add('is-ready'); start();
  }

  // Mouse-follow depth (desktop pointers only)
  var stage = $('[data-stage]');
  var layers = $$('.rcc-depth');
  var fine = window.matchMedia('(pointer: fine)').matches;
  if (stage && fine && !reduced) {
    var raf = null;
    stage.addEventListener('mousemove', function (e) {
      if (raf) return;
      var x = e.clientX, y = e.clientY;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = stage.getBoundingClientRect();
        var nx = ((x - r.left) / r.width - 0.5) * 2;
        var ny = ((y - r.top) / r.height - 0.5) * 2;
        layers.forEach(function (l) {
          var d = parseFloat(l.dataset.depth) || 0;
          l.style.transform = 'translate3d(' + (nx * 16 * d).toFixed(1) + 'px,' + (ny * 12 * d).toFixed(1) + 'px,0)';
        });
      });
    });
    stage.addEventListener('mouseleave', function () { layers.forEach(function (l) { l.style.transform = ''; }); });
  }

  goTo(0);
})();
