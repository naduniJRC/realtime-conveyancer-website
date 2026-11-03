/* Hero: full-bleed slideshow controller
   - 4 slides, auto-advance every 7s
   - Per-slide theme (dark / light / pink) via class on .hero
   - Per-slide copy (tag, bold line, italic line, lede, CTA label + href)
   - Line-mask reveal choreographed in CSS via .is-ready / .is-leaving on .hero__content
   - Pause on tab hidden, hover, interaction
*/
(function () {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const content  = hero.querySelector("[data-hero-content]");
  const stage    = hero.querySelector(".hero__stage");
  const slides   = hero.querySelectorAll(".hero__slide");
  const dots     = hero.querySelectorAll(".hero__dot");
  const navItems = hero.querySelectorAll(".hero__nav li");
  const navBars  = hero.querySelectorAll(".hero__nav-bar");

  const headBold   = hero.querySelector("[data-hero-head]");
  const headItalic = hero.querySelector("[data-hero-head-italic]");
  const lede       = hero.querySelector("[data-hero-sub]");
  const cta        = hero.querySelector("[data-hero-cta]");
  const ctaLabel   = hero.querySelector("[data-hero-cta-label]");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Slide content (single source of truth)
         Theme kept dark on every slide — same left-side scrim across all 4 images. */
  const SLIDES = [
    {
      // "Smiling Australian Conveyancer in Sunlit Office-1" — focused, in control
      theme: "",
      head:  "A clearer view",
      italic:"of every matter.",
      lede:  "Keep your matters organised and progress easy to follow — so you can see what needs attention and move through your day with confidence.",
      cta:   "Book a demo",
      href:  "/book-a-demo/"
    },
    {
      // "Sunlit conveyancing teamwork at the oak table-2" — team collaboration
      theme: "",
      head:  "Less admin.",
      italic:"More time for your expertise.",
      lede:  "Automate repetitive tasks and reduce re-work, giving your team more time to focus on the conveyancing work that needs their knowledge and care.",
      cta:   "Book a demo",
      href:  "/book-a-demo/"
    },
    {
      // "Australian conveyancing settlement review-3" — financial detail / trust
      theme: "",
      head:  "Confidence in",
      italic:"the details that count.",
      lede:  "Bring trust accounting and settlement financial processes into your conveyancing workflow — helping your team manage the details with greater clarity.",
      cta:   "Book a demo",
      href:  "/book-a-demo/"
    },
    {
      // "Australian Conveyancer Taking a Coastal Call-4" — mobile / connected
      theme: "",
      head:  "Everyone connected,",
      italic:"wherever you work.",
      lede:  "Keep clients informed with live progress updates through Pathway to Settlement, and access Realtime on your mobile, tablet or laptop.",
      cta:   "Book a demo",
      href:  "/book-a-demo/"
    }
  ];

  const THEMES = ["is-theme-light", "is-theme-pink"];
  let current = 0;
  let autoTimer = null;
  let swapping = false;
  let swapWatchdog = null;
  const AUTO_MS = 7000;
  const EXIT_MS = 600;   // matches CSS .is-leaving transition
  const PREP_MS = 40;    // next-frame prep delay
  const WATCHDOG_MS = 1800;  // kill switch: swap must complete inside this window

  /* ---- Preload all images so swaps are instant ---- */
  function preload() {
    slides.forEach((s) => {
      const bg = s.style.backgroundImage;
      const url = bg.match(/url\(['"]?(.*?)['"]?\)/);
      if (url && url[1]) {
        const img = new Image();
        img.src = url[1];
      }
    });
  }

  /* ---- Theme swap on the hero element ---- */
  function setTheme(themeClass) {
    THEMES.forEach((t) => hero.classList.remove(t));
    if (themeClass) hero.classList.add(themeClass);
  }

  /* ---- Core: go to slide index ---- */
  function go(index, { instant = false } = {}) {
    const n = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length;
    if (n === current && !instant) return;
    if (swapping) return;

    const slide = SLIDES[n];

    // Dot state (legacy — safe no-op if no dots)
    dots.forEach((d, i) => {
      const active = i === n;
      d.classList.toggle("is-active", active);
      d.setAttribute("aria-selected", active ? "true" : "false");
    });

    // Progress bar state: previous slides are "past", current is "active"
    navItems.forEach((li, i) => {
      li.classList.toggle("is-active", i === n);
      li.classList.toggle("is-past", i < n);
    });

    // Image + theme change (happens first — scrim and image cross-fade)
    slides.forEach((s, i) => s.classList.toggle("is-active", i === n));
    setTheme(slide.theme);

    if (instant) {
      // First render — just populate text and reveal
      writeContent(slide);
      current = n;
      requestAnimationFrame(() => content.classList.add("is-ready"));
      return;
    }

    // Content choreography: exit → snap-to-default (no transition) → re-enter
    swapping = true;
    if (swapWatchdog) clearTimeout(swapWatchdog);
    // Kill switch: if any step hangs, release the lock so the slideshow keeps moving.
    swapWatchdog = setTimeout(() => { swapping = false; }, WATCHDOG_MS);

    content.classList.remove("is-ready");
    content.classList.add("is-leaving");

    setTimeout(() => {
      // 1. Freeze transitions, drop is-leaving so elements snap to default (below the mask).
      content.classList.add("is-reset");
      content.classList.remove("is-leaving");
      writeContent(slide);
      // 2. Force reflow so the snap commits before transitions re-engage.
      void content.offsetWidth;
      // 3. Re-enable transitions and trigger the entrance on the next frame.
      content.classList.remove("is-reset");
      requestAnimationFrame(() => {
        content.classList.add("is-ready");
        swapping = false;
        if (swapWatchdog) { clearTimeout(swapWatchdog); swapWatchdog = null; }
      });
    }, EXIT_MS);

    current = n;
  }

  function writeContent(slide) {
    if (headBold)   headBold.textContent   = slide.head;
    if (headItalic) headItalic.textContent = slide.italic;
    if (lede)       lede.textContent       = slide.lede;
    if (ctaLabel)   ctaLabel.textContent   = slide.cta;
    if (cta)        cta.setAttribute("href", slide.href);
  }

  /* ---- Auto-advance (self-recovers if a tick lands mid-swap) ---- */
  function startAuto() {
    stopAuto();
    // Auto-advance even when prefers-reduced-motion is set.
    // CSS already softens transitions for those users; the slideshow still progresses.
    autoTimer = setInterval(() => {
      if (document.hidden) return;
      advance();
    }, AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function advance(retry = 0) {
    if (swapping) {
      if (retry < 20) setTimeout(() => advance(retry + 1), 100);
      return;
    }
    go(current + 1);
  }

  /* ---- Interactions ---- */
  dots.forEach((d, i) => {
    d.addEventListener("click", () => {
      stopAuto();
      go(i);
      startAuto();
    });
  });
  navBars.forEach((bar, i) => {
    bar.addEventListener("click", () => {
      stopAuto();
      go(i);
      startAuto();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto(); else startAuto();
  });

  /* ---- Boot ---- */
  function boot() {
    preload();
    // Reveal frame (hero's own is-ready triggers scroll hint + dots fade-in)
    requestAnimationFrame(() => {
      hero.classList.add("is-ready");
      go(0, { instant: true });
      startAuto();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
