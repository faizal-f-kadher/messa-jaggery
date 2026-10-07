/* Messa — shared behaviour for every page. Plain JS, no framework. */
(function () {
  "use strict";

  var M = window.MESSA;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Header: hide on scroll down, show on scroll up ---------- */
  var header = $("[data-header]");
  var lastY = window.scrollY;
  // On the home page the header sits transparently over the hero until the hero scrolls away
  var overlayHero = header && header.hasAttribute("data-header-overlay") ? $("#top") : null;
  function updateOverlay() {
    if (!overlayHero) return;
    var solid = root.classList.contains("menu-open") || overlayHero.getBoundingClientRect().bottom < header.offsetHeight + 8;
    header.classList.toggle("is-overlay", !solid);
  }
  function onScrollHeader() {
    var y = window.scrollY;
    var locked = root.classList.contains("menu-open");
    if (header && !locked) header.classList.toggle("is-hidden", y > lastY && y > 160);
    lastY = y;
    updateOverlay();
  }
  updateOverlay();

  /* ---------- Mobile menu ---------- */
  var menu = $("[data-menu]");
  var menuToggle = $("[data-menu-toggle]");
  function setMenu(open) {
    if (!menu || !menuToggle) return;
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    root.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "Close" : "Menu";
    if (open && header) header.classList.remove("is-hidden");
    updateOverlay();
  }
  if (menuToggle) menuToggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
  $$("[data-menu-link]").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  window.addEventListener("resize", function () { if (window.innerWidth >= 1024) setMenu(false); });

  /* ---------- Parallax: background layers move at 50% of the scroll relative to content ---------- */
  var frames = $$("[data-parallax]");
  var floats = $$("[data-float]");
  var ticking = false;
  function updateParallax() {
    ticking = false;
    if (reduceMotion) return;
    var vh = window.innerHeight;
    var mobile = window.innerWidth < 768;
    frames.forEach(function (frame) {
      var layer = $("[data-parallax-layer]", frame);
      if (!layer) return;
      var r = frame.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var speed = parseFloat(frame.getAttribute("data-parallax")) || 0.5;
      // -1 when the frame enters at the bottom, +1 when it leaves at the top
      var progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      progress = Math.max(-1, Math.min(1, progress));
      // The layer overhangs the frame by 12% top and bottom; speed 0.5 uses all of it.
      var maxTravel = r.height * 0.12 * (speed / 0.5) * (mobile ? 0.6 : 1);
      layer.style.transform = "translate3d(0," + (progress * maxTravel).toFixed(1) + "px,0)";
    });
    // Foreground pieces (cut-outs, seals, inset photos) travel faster than the
    // 50% background, which is what creates the layered depth.
    floats.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var px = parseFloat(el.getAttribute("data-float")) || 0;
      var progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      progress = Math.max(-1, Math.min(1, progress));
      el.style.transform = "translate3d(0," + (progress * px * (mobile ? 0.6 : 1)).toFixed(1) + "px,0)";
    });
  }
  // Hero depth: each layer moves at its own rate on scroll (farther = slower), and shifts a little with the mouse
  var heroStage = $("[data-hero-stage]");
  var depthLayers = heroStage ? $$("[data-depth]", heroStage) : [];
  var DEPTH = { sky: { scroll: 0.5, mouse: 6 }, words: { scroll: 0.6, mouse: 11 }, mist: { scroll: 0.46, mouse: 15 }, front: { scroll: 0.4, mouse: 20 } };
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var heroRaf = null;
  function renderHero() {
    heroRaf = null;
    if (!heroStage || reduceMotion) return;
    var y = window.scrollY, h = heroStage.parentElement.offsetHeight;
    if (y > h * 1.1) return;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    depthLayers.forEach(function (el) {
      var d = DEPTH[el.getAttribute("data-depth")];
      el.style.translate = (-mouse.x * d.mouse).toFixed(2) + "px " + (y * d.scroll - mouse.y * d.mouse * 0.6).toFixed(2) + "px";
    });
    if (Math.abs(mouse.tx - mouse.x) > 0.002 || Math.abs(mouse.ty - mouse.y) > 0.002) heroRaf = requestAnimationFrame(renderHero);
  }
  function updateHero() { if (!heroRaf) heroRaf = requestAnimationFrame(renderHero); }
  if (heroStage && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    heroStage.parentElement.addEventListener("pointermove", function (e) {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
      updateHero();
    });
    heroStage.parentElement.addEventListener("pointerleave", function () { mouse.tx = 0; mouse.ty = 0; updateHero(); });
  }
  function onScroll() {
    onScrollHeader();
    updateHero();
    if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateParallax();

  /* ---------- Reveal once ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Process: sticky visual follows the active step (desktop) ---------- */
  var steps = $$("[data-process-step]");
  var visual = $("[data-process-visual]");
  if (steps.length && visual && "IntersectionObserver" in window) {
    var imgs = $$(".process-img", visual);
    var label = $("[data-process-label]", visual);
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = Number(e.target.getAttribute("data-process-step"));
        steps.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
        imgs.forEach(function (img, n) { img.classList.toggle("is-active", n === i); });
        if (label) label.textContent = "Step " + (i + 1) + " of " + steps.length;
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { stepIO.observe(s); });
  }

  /* ---------- Reviews: a continuous, smooth glide (no timer), looping endlessly ----------
     The cards are duplicated once so the row can wrap around without a jump. Visitors can still swipe,
     drag or use the arrows; the glide pauses while they do, on hover/focus, off-screen, or with Pause. */
  var reviews = $("[data-reviews]");
  if (reviews) {
    var track = $("[data-reviews-track]", reviews);
    var prev = $("[data-reviews-prev]", reviews);
    var next = $("[data-reviews-next]", reviews);
    var toggle = $("[data-reviews-toggle]", reviews);
    var flow = $("[data-flow]", reviews);

    // Extra review cards from data.js, before the "Share a review" card
    var invite = $("[data-review-invite]", track);
    var monoColours = ["bg-leaf", "bg-amber", "bg-brown"];
    (M.moreReviews || []).forEach(function (r, i) {
      var li = document.createElement("li");
      li.className = "review-card flex shrink-0";
      var fig = document.createElement("figure");
      fig.className = "flex w-full flex-col rounded-[2px] border bg-white p-5 sm:p-6 md:p-8 " + (r.sample ? "border-dashed border-line-strong" : "border-line");
      fig.innerHTML =
        '<div class="flex items-start justify-between gap-4">' +
          '<span class="font-display text-6xl leading-[0.6] text-amber" aria-hidden="true">“</span>' +
          '<span class="flex flex-wrap justify-end gap-1.5">' +
            (r.sample ? '<span class="rounded-[2px] border border-amber px-2 py-0.5 text-[0.75rem] font-medium text-amber">Sample</span>' : "") +
            '<span class="rounded-[2px] bg-cream px-2.5 py-1 text-[0.75rem] font-medium" data-tag></span>' +
          "</span>" +
        "</div>" +
        '<blockquote class="mt-5 flex-1 font-display text-[1.1875rem] font-semibold leading-snug text-brown sm:text-[1.3125rem] md:mt-6 md:text-[1.375rem]" data-text></blockquote>' +
        '<figcaption class="mt-8 flex items-center gap-3 border-t border-line pt-5">' +
          '<span class="grid h-11 w-11 place-items-center font-display text-lg font-semibold text-white ' + monoColours[i % 3] + '" aria-hidden="true" data-initial></span>' +
          '<span><span class="block font-medium" data-name></span><span class="block text-sm text-muted" data-place></span></span>' +
        "</figcaption>";
      $("[data-tag]", fig).textContent = r.tag || "Review";
      $("[data-text]", fig).textContent = r.text;
      $("[data-name]", fig).textContent = r.name;
      $("[data-place]", fig).textContent = r.place || "Customer review";
      $("[data-initial]", fig).textContent = (r.name || "?").trim().charAt(0).toUpperCase();
      li.appendChild(fig);
      track.insertBefore(li, invite);
    });

    // Duplicate the whole set once for a seamless loop (copies are hidden from screen readers and keyboard)
    var originals = $$(".review-card", track);
    originals.forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.inert = true;
      c.classList.add("is-clone");
      track.appendChild(c);
    });
    // The row moves with a GPU transform (sub-pixel smooth), not scrollLeft (which snaps to whole pixels)
    var loopWidth = 0;
    function measure() {
      var first = originals[0], firstClone = $(".is-clone", track);
      loopWidth = firstClone && first ? firstClone.offsetLeft - first.offsetLeft : 0;
    }
    function step() {
      var c = originals[0];
      return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 16) : 300;
    }
    function wrap(x) { return loopWidth > 0 ? ((x % loopWidth) + loopWidth) % loopWidth : x; }

    var SPEED = window.innerWidth < 768 ? 26 : 36;      // px per second — slow enough to read comfortably
    var pos = 0, last = 0, anim = null;
    var userPaused = reduceMotion;
    var hovering = false, focusedIn = false, holding = false, onScreen = false, resumeAt = 0;
    function running() { return !userPaused && !hovering && !focusedIn && !holding && !anim && onScreen && !document.hidden && performance.now() >= resumeAt; }
    function render() {
      var x = wrap(pos);
      track.style.transform = "translate3d(" + (-x).toFixed(2) + "px,0,0)";
      if (flow && !reduceMotion) flow.style.transform = "translate3d(" + (-(x * 0.15) % 240).toFixed(2) + "px,0,0)";
    }
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function frame(t) {
      requestAnimationFrame(frame);
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (anim) {
        var k = Math.min(1, (t - anim.start) / anim.dur);
        pos = anim.from + (anim.to - anim.from) * ease(k);
        if (k >= 1) { anim = null; pos = wrap(pos); }
        render();
        return;
      }
      if (running()) { pos = wrap(pos + SPEED * dt); render(); }
    }

    function glideBy(dist) {
      measure();
      anim = { from: pos, to: pos + dist, start: performance.now(), dur: reduceMotion ? 1 : 650 };
      resumeAt = performance.now() + 3000;
    }
    prev.addEventListener("click", function () { glideBy(-step()); });
    next.addEventListener("click", function () { glideBy(step()); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); glideBy(step()); }
      if (e.key === "ArrowLeft") { e.preventDefault(); glideBy(-step()); }
    });

    function setToggle() {
      toggle.textContent = userPaused ? "Play" : "Pause";
      toggle.setAttribute("aria-pressed", String(userPaused));
      toggle.setAttribute("aria-label", userPaused ? "Play moving reviews" : "Pause moving reviews");
    }
    toggle.addEventListener("click", function () { userPaused = !userPaused; resumeAt = 0; setToggle(); });

    var viewport = track.parentElement;
    viewport.addEventListener("mouseenter", function () { hovering = true; });
    viewport.addEventListener("mouseleave", function () { hovering = false; });
    track.addEventListener("focusin", function (e) {
      focusedIn = true;
      // Bring a focused card (e.g. "Share a review") fully into view
      var card = e.target.closest(".review-card");
      if (card && originals[0]) { pos = card.offsetLeft - originals[0].offsetLeft; render(); }
    });
    track.addEventListener("focusout", function () { focusedIn = false; });

    // Swipe (touch) and drag (mouse); vertical page scrolling still works on phones (touch-action: pan-y)
    var down = false, dragging = false, startX = 0, startY = 0, startPos = 0, moved = false;
    viewport.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      down = true; dragging = false; moved = false; startX = e.clientX; startY = e.clientY; startPos = pos; anim = null;
      holding = true;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { dragging = true; track.classList.add("is-dragging"); }
        else if (Math.abs(dy) > 10) { down = false; holding = false; return; }   // it's a vertical page scroll
      }
      if (dragging) { moved = true; pos = startPos - dx; render(); }
    });
    function endDrag() {
      if (!down) return;
      down = false; dragging = false; holding = false;
      track.classList.remove("is-dragging");
      pos = wrap(pos);
      resumeAt = performance.now() + 2500;
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    // A drag shouldn't also count as a click on the "Share a review" button
    track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    viewport.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); anim = null; pos = wrap(pos + e.deltaX); render(); resumeAt = performance.now() + 2500;
    }, { passive: false });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; }, { threshold: 0.15 }).observe(viewport);
    } else { onScreen = true; }
    window.addEventListener("resize", function () { SPEED = window.innerWidth < 768 ? 26 : 36; measure(); render(); });
    window.addEventListener("load", measure);
    measure();
    setToggle();
    render();
    requestAnimationFrame(frame);

    if (flow) {
      if ("IntersectionObserver" in window && !reduceMotion) {
        var fio = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { flow.classList.add("is-drawn"); fio.disconnect(); }
        }, { threshold: 0.3 });
        fio.observe(flow);
      } else {
        flow.classList.add("is-drawn");
      }
    }
  }

  /* ---------- Get a quote: pre-fill the enquiry form with the chosen product ---------- */
  function prefillQuote(id, note) {
    var p = M.findProduct(id);
    var sel = $("#f-product"), msg = $("#f-msg");
    if (p && sel) sel.value = p.name;
    if (note && msg && !msg.value) msg.value = note;
    var name = $("#f-name");
    if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 600);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-quote]");
    if (t) prefillQuote(t.getAttribute("data-quote"));
  });
  // Arriving from a product page: index.html?product=powder&size=1%20kg&qty=2#wholesale
  var qp = new URLSearchParams(window.location.search);
  if (qp.get("product")) {
    var note = qp.get("size") ? "Pack size: " + qp.get("size") + (qp.get("qty") ? ", quantity: " + qp.get("qty") : "") : "";
    prefillQuote(qp.get("product"), note);
  }

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Wholesale enquiry ---------- */
  var form = $("[data-enquiry-form]");
  var success = $("[data-enquiry-success]");
  if (form && success) {
    var validators = {
      name: function (v) { return v.trim().length > 1; },
      phone: function (v) { return v.replace(/[^\d]/g, "").length >= 10; },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      country: function (v) { return v.trim().length > 1; },
    };
    function check(name) {
      var input = form.elements[name];
      var ok = validators[name](input.value);
      var err = $('[data-error-for="' + name + '"]', form);
      input.setAttribute("aria-invalid", String(!ok));
      if (err) {
        err.classList.toggle("hidden", ok);
        err.id = "err-" + name;
        if (!ok) input.setAttribute("aria-describedby", err.id); else input.removeAttribute("aria-describedby");
      }
      return ok;
    }
    Object.keys(validators).forEach(function (name) {
      form.elements[name].addEventListener("blur", function () { if (this.value) check(name); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(validators).forEach(function (name) {
        if (!check(name) && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) { firstBad.focus(); return; }

      var d = new FormData(form);
      var lines = [
        "Wholesale enquiry — Messa Marayoor Jaggery",
        "Name: " + d.get("name"),
        "Phone: " + d.get("phone"),
        d.get("email") ? "Email: " + d.get("email") : "",
        d.get("company") ? "Company: " + d.get("company") : "",
        "Country: " + d.get("country"),
        "Product: " + d.get("product"),
        d.get("quantity") ? "Quantity: " + d.get("quantity") : "",
        d.get("message") ? "Message: " + d.get("message") : "",
      ].filter(Boolean).join("\n");
      var text = encodeURIComponent(lines);

      $("[data-success-name]", success).textContent = ", " + String(d.get("name")).trim().split(" ")[0];
      $("[data-success-wa]", success).href = "https://wa.me/" + M.phoneIntl + "?text=" + text;
      $("[data-success-mail]", success).href =
        "mailto:" + M.email + "?subject=" + encodeURIComponent("Wholesale enquiry from " + d.get("name")) + "&body=" + text;

      form.classList.add("hidden");
      success.classList.remove("hidden");
      success.focus();
    });

    var reset = $("[data-enquiry-reset]", success);
    if (reset) reset.addEventListener("click", function () {
      success.classList.add("hidden");
      form.classList.remove("hidden");
      form.elements.name.focus();
    });
  }

})();
