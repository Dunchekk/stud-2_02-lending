import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/layers.css";
import "./styles/blocks.css";
import "./styles/cursor.css";
import "./styles/manifesto.css";

import { definePixiGradientElement } from "./pixi/initPixi.js";
import { mountLandingLayer } from "./add-layers/mountLandingLayer.js";

import { mountTextLayer } from "./add-layers/mountTextLayer.js";
import textData from "./data/textLayer.json";

definePixiGradientElement();

const app = document.getElementById("app");

mountTextLayer({
  mountTo: app,
  data: textData,
  zIndex: 1,
});

const landingLayer = mountLandingLayer({
  mountTo: app,
  zIndex: 2,
  theme: "blue",
});

// (опционально) тестовый блок — можешь убрать
const test = document.createElement("div");
test.textContent = "Landing layer test block";
test.style.padding = "80px 24px";
landingLayer.appendChild(test);
