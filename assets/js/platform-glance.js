/* Platform story: 4-beat animated product demo.
   Each beat: headline types in → composition rises → inner elements animate → beat flies out. */
(function () {
  var section = document.querySelector("[data-platform]");
  if (!section) return;

  var outer = document.getElementById("psStage");
  var stage = document.getElementById("psScale");
  if (!outer || !stage) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (sel) { return section.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(section.querySelectorAll(sel)); };

  /* ---------- Scale the 1120×540 stage to viewport ---------- */
  function fit() {
    var w = outer.clientWidth;
    var s = Math.min(1, w / 1120);
    outer.style.setProperty("--pss", s);
    outer.style.setProperty("--psh", Math.max(560, Math.round(540 * s) + 60));
    stage.style.setProperty("--pss", s);
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- Word-split each headline ---------- */
  ["ps-h1", "ps-h2", "ps-h3", "ps-h4", "ps-h5"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.querySelectorAll(".ps-line").forEach(function (line) {
      var words = line.textContent.split(" ");
      line.innerHTML = words.map(function (w) {
        return '<span class="ps-w">' + w + "</span>";
      }).join(" ");
    });
  });

  /* ---------- Sequence helpers ---------- */
  var timers = [];
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }

  function typeIn(id, start, step) {
    step = step || 110;
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("is-out");
    var words = el.querySelectorAll(".ps-w");
    words.forEach(function (w, i) {
      at(start + i * step, function () { w.classList.add("is-in"); });
    });
  }
  function flyOut(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("is-out");
  }
  function reset(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("is-out");
    el.querySelectorAll(".ps-w").forEach(function (w) { w.classList.remove("is-in"); });
  }

  function resetAll() {
    ["ps-h1", "ps-h2", "ps-h3", "ps-h4", "ps-h5"].forEach(reset);
    $$(".ps-comp").forEach(function (c) { c.classList.remove("is-in", "is-out"); });
    $$(".ps-tasks li").forEach(function (li) { li.classList.remove("is-done"); });
    $$(".ps-auto__list li").forEach(function (li) { li.classList.remove("is-done"); });
    $$(".ps-trust__ledger li").forEach(function (li) { li.classList.remove("is-done"); });
    $$("[data-tag]").forEach(function (t) { t.classList.remove("is-done"); t.textContent = "Automated"; });
    var fill = $("[data-fill]"); if (fill) fill.style.width = "0%";
    var step = $("[data-step]"); if (step) step.textContent = "4";
    var pct  = $("[data-pct]");  if (pct)  pct.textContent  = "40";
    var bal  = document.getElementById("ps-bal");
    if (bal) { bal.textContent = "Balancing…"; bal.classList.remove("ps-pill--navy"); bal.classList.add("ps-pill"); }
    var toast = document.getElementById("ps-toast");
    if (toast) toast.classList.remove("is-in");
    $$(".ps-devices li").forEach(function (d) { d.classList.remove("is-in"); });
    $$(".ps-features li").forEach(function (f) { f.classList.remove("is-in"); });
    $$(".ps-msg").forEach(function (m) { m.classList.remove("is-in"); });
  }

  /* ---------- The four-beat loop ---------- */
  function play() {
    clear();
    resetAll();

    /* BEAT 1 — matter dashboard */
    typeIn("ps-h1", 150, 130);
    at(400, function () { document.getElementById("ps-comp1").classList.add("is-in"); });
    at(1400, function () {
      $$(".ps-tasks li").forEach(function (li, i) {
        at(i * 350, function () {
          if (i < 3) li.classList.add("is-done");
        });
      });
      var fill = $("[data-fill]"); if (fill) fill.style.width = "60%";
      var step = $("[data-step]"); if (step) step.textContent = "6";
      var pct  = $("[data-pct]");  if (pct)  pct.textContent  = "60";
    });

    /* BEAT 2 — workflow automation */
    at(5300, function () { flyOut("ps-h1"); document.getElementById("ps-comp1").classList.add("is-out"); });
    typeIn("ps-h2", 6100, 110);
    at(6500, function () { document.getElementById("ps-comp2").classList.add("is-in"); });
    at(7100, function () {
      $$(".ps-auto__list li").forEach(function (li, i) {
        at(i * 350, function () {
          li.classList.add("is-done");
          var tag = li.querySelector("[data-tag]");
          if (tag) tag.classList.add("is-done");
        });
      });
    });

    /* BEAT 3 — trust reconciliation */
    at(10800, function () { flyOut("ps-h2"); document.getElementById("ps-comp2").classList.add("is-out"); });
    typeIn("ps-h3", 11600, 120);
    at(12000, function () { document.getElementById("ps-comp3").classList.add("is-in"); });
    at(12700, function () {
      $$(".ps-trust__ledger li").forEach(function (li, i) {
        at(i * 350, function () { li.classList.add("is-done"); });
      });
    });
    at(14000, function () {
      var bal = document.getElementById("ps-bal");
      if (bal) { bal.textContent = "Balanced ✓"; bal.classList.add("ps-pill--navy"); }
    });

    /* BEAT 4 — mobile + devices */
    at(15800, function () { flyOut("ps-h3"); document.getElementById("ps-comp3").classList.add("is-out"); });
    typeIn("ps-h4", 16600, 120);
    at(17000, function () { document.getElementById("ps-comp4").classList.add("is-in"); });
    at(17600, function () {
      var toast = document.getElementById("ps-toast");
      if (toast) toast.classList.add("is-in");
    });
    at(18200, function () {
      $$(".ps-features li").forEach(function (f, i) {
        at(i * 160, function () { f.classList.add("is-in"); });
      });
    });
    at(19000, function () {
      $$(".ps-devices li").forEach(function (d, i) {
        at(i * 200, function () { d.classList.add("is-in"); });
      });
    });

    /* BEAT 5 — secure messaging */
    at(22300, function () { flyOut("ps-h4"); document.getElementById("ps-comp4").classList.add("is-out"); });
    typeIn("ps-h5", 23100, 120);
    at(23500, function () { document.getElementById("ps-comp5").classList.add("is-in"); });
    at(24200, function () {
      var m1 = document.querySelector('[data-msg="1"]');
      if (m1) m1.classList.add("is-in");
    });
    at(25400, function () {
      var m2 = document.querySelector('[data-msg="2"]');
      if (m2) m2.classList.add("is-in");
    });

    /* Loop */
    at(28000, function () { flyOut("ps-h5"); document.getElementById("ps-comp5").classList.add("is-out"); });
    at(29000, play);
  }

  /* ---------- Static (reduced-motion / paused) state ---------- */
  function showStatic() {
    clear();
    resetAll();
    document.getElementById("ps-h1").querySelectorAll(".ps-w").forEach(function (w) { w.classList.add("is-in"); });
    document.getElementById("ps-comp1").classList.add("is-in");
    $$(".ps-tasks li").forEach(function (li, i) { if (i < 3) li.classList.add("is-done"); });
    var fill = $("[data-fill]"); if (fill) fill.style.width = "60%";
    var step = $("[data-step]"); if (step) step.textContent = "6";
    var pct  = $("[data-pct]");  if (pct)  pct.textContent  = "60";
  }

  /* ---------- Pause when offscreen / tab hidden (saves CPU) ---------- */
  document.addEventListener("visibilitychange", function () {
    if (reduce) return;
    document.hidden ? showStatic() : play();
  });

  if (reduce) {
    showStatic();
  } else {
    play();
  }
})();
