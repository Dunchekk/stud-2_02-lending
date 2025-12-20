import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/layers.css";
import "./styles/blocks.css";
import "./styles/cursor.css";
import "./styles/manifesto.css";

import { mountLandingLayer } from "./add-layers/mountLendingLayer.js";

import { mountTextLayer } from "./add-layers/mountTextLayer.js";
import textData from "./data/textLayer.json";

const app = document.getElementById("app");

// 0) pixi gradient background
mountLandingLayer({
  mountTo: app,
  zIndex: 1,
  attrs: {
    // можешь тут менять тему
    color1: "#0e1c3fff",
    color2: "#23418a",
    color3: "#aadfd9",
    color4: "#e64f0f",
    color5: "#000000ff",
    noretina: "true",
  },
});

// 1) текстовый слой поверх
mountTextLayer({
  mountTo: app,
  data: textData,
  zIndex: 0,
});
