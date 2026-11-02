/* Benefit ring section: auto-cycles through the benefits, and hover/tap/focus
   on a circle shows its detail in the card. */
(function () {
  var root = document.getElementById('business-benefits');
  if (!root) return;
  var DATA = [
  {
    "title": "Clear communication",
    "text": "Everyone works from the same up-to-date information. Your team, clients, agents and brokers see progress in one place instead of long email chains.",
    "bg": "#16305b",
    "fg": "#e3a1c0",
    "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5h11v8H8l-4 3z\"/><path d=\"M15 9h5v8l-3-2h-6v-2\"/></svg>"
  },
  {
    "title": "Less admin, more done",
    "text": "Automated workflows take care of repetitive tasks, cutting re-work and errors so your team gets more done in less time.",
    "bg": "#5ea535",
    "fg": "#ffffff",
    "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/></svg>"
  },
  {
    "title": "A reputation that grows",
    "text": "Clients who always know where their settlement is are clients who recommend you. Deliver an experience people talk about.",
    "bg": "#e3a1c0",
    "fg": "#16305b",
    "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z\"/></svg>"
  },
  {
    "title": "Every stakeholder connected",
    "text": "Buyers, sellers, real estate agents and finance brokers stay connected to each matter, strengthening your business network.",
    "bg": "#4f86bd",
    "fg": "#ffffff",
    "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"5\" r=\"2.5\"/><circle cx=\"5\" cy=\"18\" r=\"2.5\"/><circle cx=\"19\" cy=\"18\" r=\"2.5\"/><path d=\"M12 7.5v4M12 11.5l-5.2 4.6M12 11.5l5.2 4.6\"/></svg>"
  },
  {
    "title": "Stronger relationships",
    "text": "Fewer chasing calls and more meaningful conversations build trust with clients and the partners who refer them.",
    "bg": "#ffffff",
    "fg": "#c86a9b",
    "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z\"/></svg>"
  },
  {
    "title": "Data-driven insights",
    "text": "See what’s happening across your matters at a glance and make better decisions for your practice.",
    "bg": "#9cc8e8",
    "fg": "#16305b",
    "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/></svg>"
  }
];
  var DURATION = 4000;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ring = root.querySelector('[data-ring]');
  var bubbles = Array.prototype.slice.call(root.querySelectorAll('[data-benefit]'));
  var icon = root.querySelector('[data-card-icon]');
  var body = root.querySelector('[data-card-body]');
  var count = root.querySelector('[data-card-count]');
  var title = root.querySelector('[data-card-title]');
  var text = root.querySelector('[data-card-text]');
  var active = -1, timer = null, visible = false, paused = false;
  root.style.setProperty('--rcf-duration', DURATION + 'ms');

  function show(i) {
    if (i === active) return;
    active = (i + DATA.length) % DATA.length;
    var d = DATA[active];
    bubbles.forEach(function (b, n) {
      b.classList.toggle('is-active', n === active);
      b.setAttribute('aria-pressed', String(n === active));
    });
    ring.classList.add('has-active');
    icon.style.setProperty('--c-bg', d.bg);
    icon.style.setProperty('--c-fg', d.fg);
    icon.innerHTML = d.icon.replace('<svg ', '<svg width="28" height="28" aria-hidden="true" ');
    count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(DATA.length).padStart(2, '0');
    title.textContent = d.title;
    text.textContent = d.text;
    body.classList.remove('is-swap'); void body.offsetWidth; body.classList.add('is-swap');
  }

  function schedule() {
    clearTimeout(timer);
    root.classList.remove('is-timing');
    if (reduced || paused || !visible) return;
    void root.offsetWidth;
    root.classList.add('is-timing');
    timer = setTimeout(function () { active = active; show(active + 1); schedule(); }, DURATION);
  }

  bubbles.forEach(function (b, i) {
    b.addEventListener('mouseenter', function () { show(i); });
    b.addEventListener('focus', function () { show(i); });
    b.addEventListener('click', function () { show(i); paused = true; root.classList.add('is-paused'); clearTimeout(timer); });
  });

  // Pause while the visitor explores the circles or reads the card
  [ring, root.querySelector('.rcf-card')].forEach(function (el) {
    el.addEventListener('mouseenter', function () { paused = true; root.classList.add('is-paused'); clearTimeout(timer); });
    el.addEventListener('mouseleave', function () { paused = false; root.classList.remove('is-paused'); schedule(); });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) { root.classList.add('is-in'); schedule(); } else { clearTimeout(timer); }
    }, { threshold: 0.3 }).observe(root);
  } else { root.classList.add('is-in'); visible = true; }

  show(0);
})();
