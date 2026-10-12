/**
 * DIY alternatives for cosmetic damage, keyed by the exact partName from
 * partsCatalog.js. Links are plain Amazon.in *search* URLs — never
 * fabricated product pages.
 */
const DIY_PRODUCTS = {
  "Headlamp – Foggy/Cracked Lens": [
    {
      name: "Headlight Restoration Kit",
      blurb:
        "Buffs out yellowing and light fogging on the plastic lens so headlights look (and shine) clear again. Won't help an actually cracked lens.",
      priceRange: "₹350 – ₹700",
      amazonQuery: "headlight restoration kit car",
    },
  ],
  "Door – Minor Dent (Single Panel)": [
    {
      name: "Paintless Dent Repair (PDR) Puller Kit",
      blurb:
        "A glue-pull kit for shallow dings where the paint hasn't cracked — pulls the panel back out without filler or repainting.",
      priceRange: "₹900 – ₹1,800",
      amazonQuery: "paintless dent repair puller kit car",
    },
  ],
  "Fender – Minor Dent/Scratch": [
    {
      name: "Dent Puller Kit + Touch-Up Paint",
      blurb:
        "Pair a suction/glue dent puller with a colour-matched touch-up pen for the scratch that usually comes with a fender ding.",
      priceRange: "₹800 – ₹1,600",
      amazonQuery: "car dent puller kit touch up paint",
    },
  ],
  "Alloy Wheel – Scratch/Rash": [
    {
      name: "Alloy Wheel Touch-Up Paint",
      blurb:
        "Colour-matched paint for kerb rash on the rim edge — cosmetic only, sold by wheel finish (silver, gunmetal, diamond-cut, etc).",
      priceRange: "₹300 – ₹600",
      amazonQuery: "alloy wheel touch up paint",
    },
  ],
  "Bumper – Scratch/Paint Chip": [
    {
      name: "Scratch & Swirl Remover Compound",
      blurb: "Rubbing compound for clear-coat-only scratches you can't catch a fingernail on.",
      priceRange: "₹300 – ₹550",
      amazonQuery: "scratch swirl remover compound car",
    },
    {
      name: "Touch-Up Paint Pen (Colour Matched)",
      blurb: "For chips that go past the clear coat — matched to your car's paint code.",
      priceRange: "₹350 – ₹700",
      amazonQuery: "car touch up paint pen colour matched",
    },
  ],
};

function amazonSearchUrl(query) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
}

export function getDiySuggestions(partNames = []) {
  return partNames
    .filter((name) => DIY_PRODUCTS[name])
    .map((name) => ({
      partName: name,
      products: DIY_PRODUCTS[name].map((p) => ({
        name: p.name,
        blurb: p.blurb,
        priceRange: p.priceRange,
        url: amazonSearchUrl(p.amazonQuery),
      })),
    }));
}
