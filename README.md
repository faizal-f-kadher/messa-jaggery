# Messa Marayoor Jaggery — website

Plain HTML, JavaScript and Tailwind CSS. No framework.

## Open it

Double-click `index.html`, or serve the folder:

```
npx serve .
```

## Edit styles

Styles are written with Tailwind classes in the HTML, plus design tokens and a few shared components in `assets/css/input.css`. After changing classes or `input.css`, rebuild:

```
npm install
npm run build      # one-off, minified
npm run dev        # rebuilds on every save
```

`assets/css/styles.css` is the built file the pages load — don't edit it by hand.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page |
| `product.html` | Product page — `product.html?p=round`, `cube`, `liquid`, `powder`, `candy` |
| `assets/js/data.js` | Products, pack sizes, phone, email — **edit content here** |
| `assets/js/main.js` | Menu, header, parallax, reveal, process steps, reviews, quote form |
| `assets/js/product.js` | Product page rendering |
| `assets/css/input.css` | Tokens (colours, fonts, spacing) and components |
| `assets/img/` | Optimised images |
| `assets/docs/` | GI and ISO 22000 certificates (PDF) |

## Hero ("text behind the hills")

Depth layers, back to front, inside one 3:2 "stage" that covers the screen like a background photo, so everything stays aligned at every size:

1. **Sky** — `assets/img/hero-sky.webp` / `-1200.webp`: the photo with the near hills removed (the gap is filled with mist), so the layers can move independently without doubled edges.
2. **Words** — MARAYOOR and JAGGERY, an inline SVG set in the photo's own coordinates (Barlow Light and ExtraBold). JAGGERY is white with a soft light-to-haze gradient so it takes on the scene's light. To go back to plain white letters, replace the `<image>` and `clipPath` inside each JAGGERY group with a `<text class="w-bold">` element. Wide screens use the mockup layout; tall phone screens use a compact centred version.
3. **Fog** — `assets/img/hero-mist.webp` / `-1200.webp`: the valley's own mist, drifting slowly in front of the words.
4. **Near hills** — `assets/img/hero-hills-front.webp` / `-1200.webp`: the ridge, hills and terraces cut out of the photo.
5. **Sun glow** — a faint warm light from the top left.

On scroll each layer moves at its own rate (farther = slower), so JAGGERY sinks into the valley behind the ridge; on desktop the layers also shift slightly with the mouse. Both switch off for visitors who choose "reduce motion".

The photo is [Misty hills and tea terraces, Kerala](https://unsplash.com/photos/a-landscape-with-trees-and-hills-VJRTZNYNE4E) by Nandhu Kumar (Unsplash Licence, free for commercial use), stored in the project. Barlow is self-hosted in `assets/fonts/` (SIL Open Font Licence).

To change the words or their position, edit the two `<svg class="hero-words …">` blocks in `index.html` (`textLength` sets each word's width). Layer speeds are in `DEPTH` in `assets/js/main.js`.

Files from earlier hero versions that are no longer used and can be deleted: `assets/img/hero-hills.webp`, `assets/img/hero-hills-1200.webp`, `assets/img/hero-scoop.webp`, `assets/img/hero-scoop.png`, `assets/fonts/antonio-latin.woff2`, `tools/save-unsplash-photos.ps1`.

## How quotes work

This is not an online shop: there is no cart or payment. Every product has a **Get a quote** button that jumps to the quote form with that product already selected (from a product page, the chosen pack size and quantity are filled in too). Sending the form builds a ready-to-send message that opens in **WhatsApp** (+91 83018 13596) or **email**, so every request reaches the client directly.

To receive form enquiries without WhatsApp or email (for example through Formspree or Netlify Forms), connect a form service in the enquiry section of `main.js`.

## Still to confirm with the client

- **10 sample review cards** in the reviews carousel (tagged "Sample" with dashed borders) — replace them with real customer reviews in `MESSA.moreReviews` in `assets/js/data.js` (set `sample: false`), or delete unused entries. Don't publish invented reviews as real.

- Prices and real pack sizes (currently "Price on request" and 500 g / 1 kg / Bulk) — `data.js`
- Wholesale minimum order quantity — `index.html`, Wholesale section
- Process step copy (harvest, crush & boil, set by hand)
- A proper candy jaggery photo and a consistent product photo set
- An SVG version of the logo (current one is a PNG)
- The exact Google Maps pin for the unit — the map and "Get directions" links currently point to central Marayoor (10.2760° N, 77.1620° E); paste the client's own Google Maps embed link into the `<iframe src>` for a precise pin

## Design rules this build follows

- White is the main surface; paper (#FAF6EF) is the one secondary tone. Dark is used only for the Process section and the footer (about a quarter of the page).
- One gradient only: a short scrim under the step label on the desktop Process image.
- Two typefaces (Gambetta, Switzer) plus Manjari for Malayalam, three weights in total.
- 2px radius on buttons and fields; no pills, shadows, blur or glass.
- Smallest text is 12px; accent colour meets WCAG AA on white.
- Parallax moves background photos at 50% speed (reduced on phones, off with "reduce motion").
