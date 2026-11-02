/* Capabilities bento controller.
   - Reveals tiles in a staggered sequence when the grid enters view.
   - Counts up any [data-count-to] number inside the section.
   - Slider glide is CSS-driven; firing .is-ready triggers it.
   Honours prefers-reduced-motion: final state is shown immediately. */
(function () {
  var section = document.querySelector("[data-capabilities]");
  if (!section) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  section.classList.add("js");

  var counters = section.querySelectorAll("[data-count-to]");

  function countUp(el, target, duration, decimals) {
    if (reduce) {
      el.textContent = decimals ? target.toFixed(decimals) : String(target);
      return;
    }
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : String(Math.round(value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function playCounters() {
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
      countUp(el, target, 1400, decimals);
    });
  }

  function reveal() {
    section.classList.add("is-ready");
    setTimeout(playCounters, 300);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(section);
  } else {
    reveal();
  }

  /* ---- Scroll parallax on the growth chart ---- */
  var chart = section.querySelector("[data-cap-chart]");
  if (chart && !reduce) {
    var ticking = false;
    function updateParallax() {
      var rect = chart.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // -1 (chart above viewport) to 1 (chart below viewport)
      var relative = ((rect.top + rect.height / 2) / vh - 0.5) * 2;
      var y = -relative * 14; // 14 px of travel
      chart.style.transform = "translateY(" + y.toFixed(2) + "px)";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateParallax();
  }
})();
