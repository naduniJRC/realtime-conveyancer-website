/* Features at a glance: scroll-reveal stagger when the grid enters view. */
(function () {
  var section = document.querySelector("[data-features]");
  if (!section) return;
  section.classList.add("js");

  function reveal() { section.classList.add("is-ready"); }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { reveal(); io.disconnect(); }
      });
    }, { threshold: 0.2 });
    io.observe(section);
  } else {
    reveal();
  }
})();
