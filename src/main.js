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

import page from "./data/page.json";
import { mountSections } from "./engine/mount.js";

const feed = ensureFeed(app);

console.log("[engine] mounting sections:", page?.sections?.length);

mountSections(feed, page.sections);

function ensureFeed(app) {
  let feed = document.getElementById("feed");
  if (feed) return feed;

  feed = document.createElement("main");
  feed.id = "feed";
  feed.className = "ll__feed";
  app.appendChild(feed);
  return feed;
}
