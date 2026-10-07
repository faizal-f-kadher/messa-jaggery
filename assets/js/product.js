/* Product page: product.html?p=round | cube | liquid | powder | candy */
(function () {
  "use strict";
  var M = window.MESSA;
  var page = document.querySelector("[data-product-page]");
  if (!page) return;
  var q = function (s) { return document.querySelector(s); };

  var id = new URLSearchParams(window.location.search).get("p");
  var p = M.findProduct(id);
  if (!p) {
    // Unknown or missing id: send people to the range rather than a blank page
    window.location.replace("index.html#products");
    return;
  }

  document.title = p.name + " — Messa Marayoor Jaggery";
  var desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", p.detail);

  q("[data-p-ml]").textContent = p.ml;
  q("[data-p-name]").textContent = p.name;
  q("[data-p-detail]").textContent = p.detail;
  q("[data-p-price]").textContent = M.priceNote;
  q("[data-p-ingredient]").textContent = p.ingredient;

  /* Gallery */
  var main = q("[data-p-main]");
  var thumbs = q("[data-p-thumbs]");
  function show(i) {
    main.src = p.images[i].src;
    main.alt = p.images[i].alt;
    Array.prototype.forEach.call(thumbs.children, function (b, n) {
      b.setAttribute("aria-pressed", String(n === i));
      b.classList.toggle("outline", n === i);
    });
  }
  if (p.images.length > 1) {
    thumbs.innerHTML = p.images.map(function (img, i) {
      return '<button type="button" class="h-20 w-20 overflow-hidden bg-cream outline-2 outline-offset-2 outline-ink" aria-label="Show image ' + (i + 1) + '" data-thumb="' + i + '">' +
        '<img src="' + img.src + '" alt="" class="h-full w-full object-cover"></button>';
    }).join("");
    thumbs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-thumb]");
      if (b) show(Number(b.getAttribute("data-thumb")));
    });
  }
  show(0);

  /* Pack sizes */
  var sizes = q("[data-p-sizes]");
  sizes.innerHTML = M.packSizes.map(function (s, i) {
    return '<label class="size-option relative"><input type="radio" name="size" value="' + s + '"' + (i === 0 ? " checked" : "") + '><span>' + s + "</span></label>";
  }).join("");

  /* Quantity */
  var qty = q("[data-p-qty]");
  function clampQty() {
    var n = parseInt(qty.value, 10);
    qty.value = isNaN(n) ? 1 : Math.min(999, Math.max(1, n));
  }
  q("[data-p-dec]").addEventListener("click", function () { qty.value = Number(qty.value) - 1; clampQty(); updateWa(); });
  q("[data-p-inc]").addEventListener("click", function () { qty.value = Number(qty.value) + 1; clampQty(); updateWa(); });
  qty.addEventListener("change", function () { clampQty(); updateWa(); });

  /* WhatsApp link reflects the current choice */
  var form = q("[data-p-form]");
  var wa = q("[data-p-wa]");
  function currentSize() { return form.elements.size.value || M.packSizes[0]; }
  function updateWa() {
    var text = "Hello Messa, I'd like a quote for " + p.name + " — " + currentSize() + " × " + qty.value + ".";
    wa.href = "https://wa.me/" + M.phoneIntl + "?text=" + encodeURIComponent(text);
  }
  sizes.addEventListener("change", updateWa);
  updateWa();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clampQty();
    // Go to the quote form on the home page, pre-filled with this product, size and quantity
    window.location.href = "index.html?product=" + encodeURIComponent(p.id) + "&size=" + encodeURIComponent(currentSize()) + "&qty=" + encodeURIComponent(qty.value) + "#wholesale";
  });

  /* Other forms */
  q("[data-p-others]").innerHTML = M.products.filter(function (o) { return o.id !== p.id; }).map(function (o) {
    return '<li><a class="group block" href="product.html?p=' + o.id + '">' +
      '<span class="block aspect-square overflow-hidden bg-cream"><img src="' + o.images[0].src + '" alt="" class="h-full w-full object-cover" loading="lazy"></span>' +
      '<span class="mt-3 block font-display text-lg font-semibold group-hover:text-amber">' + o.name + "</span>" +
      '<span class="block text-sm text-muted">' + o.short + "</span></a></li>";
  }).join("");
})();
