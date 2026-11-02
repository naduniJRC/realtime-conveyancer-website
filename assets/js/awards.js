/* Awards bento: staggered reveal when the section enters view.
   Honours prefers-reduced-motion. */
(function () {
  var section = document.querySelector("[data-awards]");
  if (!section) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.classList.add("js");

  function reveal() {
    section.classList.add("is-ready");
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(section);
  } else {
    reveal();
  }

  // Reduced motion: skip animation but still reveal immediately
  if (reduce) reveal();
})();
