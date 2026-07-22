/* ============================================================
   goldmath — explained.  Scroll-driven narrative.
   No network, no libraries. Everything degrades to a static,
   legible page if JS is off or reduced-motion is set (the CSS
   already renders every final state under prefers-reduced-motion).
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Reveal-on-scroll -------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function showAll() {
    reveals.forEach(function (el) { el.classList.add("in"); });
    var stack = document.getElementById("stackList");
    if (stack) stack.classList.add("in");
  }

  if (reduce || !("IntersectionObserver" in window)) {
    // reduced motion or old browser: reveal everything immediately
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { io.observe(el); });

    // The layer stack lives inside a reveal; grow its fills when it enters.
    var stack = document.getElementById("stackList");
    if (stack) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stack.classList.add("in");
            io2.unobserve(stack);
          }
        });
      }, { threshold: 0.25 });
      io2.observe(stack);
    }
  }

  /* ---- 2. Progress rail ---------------------------------------------- */
  var fill = document.getElementById("railFill");
  if (fill) {
    var ticking = false;
    function updateRail() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop || window.pageYOffset) / max * 100 : 0;
      if (pct < 0) pct = 0; if (pct > 100) pct = 100;
      fill.style.width = pct.toFixed(2) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(updateRail); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", updateRail, { passive: true });
    updateRail();
  }
})();
