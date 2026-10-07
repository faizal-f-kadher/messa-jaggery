/* Shared site data. Anything marked TO CONFIRM is a placeholder for the client. */
window.MESSA = {
  phoneDisplay: "+91 83018 13596",
  phoneIntl: "918301813596",
  email: "messamarayoorjaggery@gmail.com",

  // TO CONFIRM: real pack sizes and prices. Until then orders are priced on request.
  packSizes: ["500 g", "1 kg", "Bulk"],
  priceNote: "Price on request",

  products: [
    {
      id: "round",
      name: "Round Jaggery",
      ml: "ഉരുള ശർക്കര",
      short: "Traditionally prepared, handmade jaggery.",
      detail:
        "Round Marayoor jaggery with the GI tag for authenticity and quality, handmade with care to bring you the finest taste.",
      ingredient: "100% natural sugarcane juice",
      images: [
        { src: "assets/img/round-1.jpg", alt: "Close-up of handmade round Marayoor jaggery" },
        { src: "assets/img/round-2.jpg", alt: "Round jaggery on a woven tray" },
      ],
    },
    {
      id: "cube",
      name: "Cube Jaggery",
      ml: "ക്യൂബ് ശർക്കര",
      short: "A healthy sweetener made from concentrated sugarcane juice.",
      detail:
        "Our speciality: handmade Marayoor cube jaggery, with a texture and taste of its own, made using traditional methods.",
      ingredient: "100% natural sugarcane juice",
      images: [
        { src: "assets/img/cube-1.jpg", alt: "Rows of freshly set cube jaggery" },
        { src: "assets/img/cube-2.jpg", alt: "Close-up of cube jaggery" },
      ],
    },
    {
      id: "liquid",
      name: "Liquid Jaggery",
      ml: "ദ്രാവക ശർക്കര",
      short: "Pure and natural, with no preservatives or additives.",
      detail:
        "Our liquid Marayoor jaggery is made with pure, natural ingredients and is free of preservatives and additives.",
      ingredient: "Marayoor jaggery from 100% sugarcane juice",
      images: [
        { src: "assets/img/liquid-1.jpg", alt: "Two bottles of Messa liquid jaggery" },
        { src: "assets/img/liquid-2.png", alt: "Messa liquid jaggery bottles" },
      ],
    },
    {
      id: "powder",
      name: "Powder Jaggery",
      ml: "ശർക്കര പൊടി",
      short: "Organic Marayoor jaggery powder.",
      detail:
        "Rich, dry and easy to spoon. A healthy substitute for sugar in tea, baking and everyday cooking.",
      ingredient: "100% natural sugarcane juice",
      images: [
        { src: "assets/img/powder-1.jpg", alt: "Jars of Messa Marayoor jaggery powder" },
        { src: "assets/img/powder-2.jpg", alt: "Jaggery powder on a wooden spoon" },
        { src: "assets/img/powder-3.jpg", alt: "Jaggery powder in a white bowl" },
      ],
    },
    {
      id: "candy",
      name: "Candy Jaggery",
      ml: "മിഠായി ശർക്കര",
      short: "Marayoor jaggery with cardamom, pepper and ginger.",
      detail:
        "Made with Marayoor jaggery and natural spices — cardamom, pepper and ginger. Traditionally enjoyed after meals and for a soothing throat.",
      ingredient: "Marayoor jaggery, cardamom, pepper, ginger",
      // TO CONFIRM: replace with a proper product photo of candy jaggery.
      images: [{ src: "assets/img/candy-1.jpg", alt: "Candy jaggery pieces in a glass bowl" }],
    },
  ],
};

/* Review slots shown after the three real reviews in the carousel.
   These are SAMPLES for layout only — each card is tagged "Sample" on the site.
   Replace each one with a real customer review (text, first name, place, tag) and set sample: false,
   or delete the entries you don't fill. Never publish invented reviews as real ones. */
window.MESSA.moreReviews = [
  { sample: true, name: "Customer name", place: "Kochi",      tag: "Round jaggery",  text: "Sample: a review about using Messa round jaggery in payasam or Onam sweets goes here." },
  { sample: true, name: "Customer name", place: "Bengaluru",  tag: "Powder jaggery", text: "Sample: a review about switching from white sugar to jaggery powder in morning coffee goes here." },
  { sample: true, name: "Customer name", place: "Chennai",    tag: "Liquid jaggery", text: "Sample: a review about liquid jaggery on dosa, pancakes or in drinks goes here." },
  { sample: true, name: "Customer name", place: "Thrissur",   tag: "Cube jaggery",   text: "Sample: a review about the texture and taste of the cube jaggery goes here." },
  { sample: true, name: "Customer name", place: "Mumbai",     tag: "Candy jaggery",  text: "Sample: a review about the spiced candy jaggery after meals or for a sore throat goes here." },
  { sample: true, name: "Customer name", place: "Hyderabad",  tag: "Packaging",      text: "Sample: a review about the packaging and how the order arrived goes here." },
  { sample: true, name: "Customer name", place: "Kottayam",   tag: "In baking",      text: "Sample: a review about baking cakes or cookies with Marayoor jaggery goes here." },
  { sample: true, name: "Customer name", place: "Pune",       tag: "Repeat order",   text: "Sample: a review from a customer who orders every month goes here." },
  { sample: true, name: "Business name", place: "Delhi",      tag: "Wholesale",      text: "Sample: a review from a shop, bakery or restaurant that buys in bulk goes here." },
  { sample: true, name: "Customer name", place: "Dubai, UAE", tag: "Export",         text: "Sample: a review from a customer abroad about the GI-tagged jaggery goes here." },
];

window.MESSA.findProduct = function (id) {
  return window.MESSA.products.find((p) => p.id === id) || null;
};
