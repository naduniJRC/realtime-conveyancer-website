/* Proof section controller + count-up helper.
   Plays once when the section crosses the viewport (threshold 0.4).
   Honours prefers-reduced-motion: shows the final state immediately. */
(function () {
  const section = document.querySelector("[data-proof]");
  if (!section) return;

  const segments = section.querySelectorAll(".proof__seg--busy");
  const tags     = section.querySelectorAll(".proof__tag");
  const prefix   = section.querySelector("[data-bar-prefix]");
  const hrs      = section.querySelector("[data-bar-hrs]");
  const counters = section.querySelectorAll("[data-count-to]");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Count-up helper ---- */
  function countUp(el, target, duration, decimals) {
    if (reduce) {
      el.textContent = decimals ? target.toFixed(decimals) : String(target);
      return;
    }
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : String(Math.round(value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Final state (shared between reduced-motion and end of animation) ---- */
  function applyFinalState() {
    segments.forEach((s) => s.classList.add("is-collapsed"));
    tags.forEach((t) => t.classList.add("is-visible"));
    section.classList.add("is-done");
    if (prefix) prefix.textContent = "With Realtime";
    if (hrs)    hrs.textContent    = "4.5 hrs";
    counters.forEach((el) => {
      const target   = parseFloat(el.getAttribute("data-count-to"));
      const decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
      el.textContent = decimals ? target.toFixed(decimals) : String(target);
    });
  }

  /* ---- The animation sequence ---- */
  function play() {
    if (reduce) { applyFinalState(); return; }

    // 1. Segments collapse one by one; each tag pops in when its segment goes
    const BASE = 600;        // delay before first segment collapses
    const STEP = 400;        // between each segment
    segments.forEach((seg, i) => {
      setTimeout(() => {
        seg.classList.add("is-collapsed");
        if (tags[i]) tags[i].classList.add("is-visible");
      }, BASE + i * STEP);
    });

    // 2. Bar label morph "8 hrs" → "4.5 hrs" just after the last segment
    const labelAt = BASE + segments.length * STEP - 100;
    setTimeout(() => {
      section.classList.add("is-swapping-label");
      setTimeout(() => {
        if (prefix) prefix.textContent = "With Realtime";
        if (hrs)    hrs.textContent    = "4.5 hrs";
        section.classList.remove("is-swapping-label");
      }, 420);
    }, labelAt);

    // 3. Phantom + payoff + heading highlights (CSS-driven via .is-done)
    setTimeout(() => {
      section.classList.add("is-done");
    }, labelAt + 300);

    // 4. Count-ups fire with the payoff
    setTimeout(() => {
      counters.forEach((el) => {
        const target   = parseFloat(el.getAttribute("data-count-to"));
        const decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
        countUp(el, target, 1400, decimals);
      });
    }, labelAt + 500);
  }

  /* ---- Trigger on scroll into view (once) ---- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(section);
  } else {
    // Fallback: just apply the final state
    applyFinalState();
  }
})();
