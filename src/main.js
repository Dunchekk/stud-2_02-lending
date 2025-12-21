import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/layers.css";
import "./styles/blocks.css";
import "./styles/cursor.css";
import "./styles/manifesto.css";
import "./styles/glass.css";
import "./styles/adaptiveStat.css";

import { mountLandingLayer } from "./add-layers/mountLendingLayer.js";
import { createThemeSwapper } from "./app/themeSwapper.js";
import { mountTextLayer } from "./add-layers/mountTextLayer.js";
import textData from "./data/textLayer.json";
import { initQuestionOpenner } from "./app/questionOpenner.js";

const app = document.getElementById("app");

const landingLayer = mountLandingLayer({
  mountTo: app,
  zIndex: 1,
  attrs: {
    noretina: "true",
  },
});

// 1) текстовый слой поверх
mountTextLayer({
  mountTo: app,
  data: textData,
  zIndex: 0,
});

const themeSwapper = createThemeSwapper({ landingLayer });
themeSwapper.bindToggleButtons();
themeSwapper.exposeThemeApi();
initQuestionOpenner();
