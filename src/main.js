// main.js

// 0) стили
import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/layers.css";
import "./styles/blocks.css";
import "./styles/cursor.css";
import "./styles/manifesto.css";
import "./styles/glass.css";
import "./styles/adaptiveStat.css";

// 1) данные и монтирование
import page from "./data/page.json";
import textData from "./data/textLayer.json";

import { mountSections } from "./engine/mount.js";
import { createInfiniteLoader } from "./engine/scroll/infiniteLoader.js";

import { mountLandingLayer } from "./add-layers/mountLendingLayer.js";
import { mountTextLayer } from "./add-layers/mountTextLayer.js";

import { createThemeSwapper } from "./app/themeSwapper.js";
import { initQuestionOpenner } from "./app/questionOpenner.js";
import { mountFixedThemeToggle } from "./app/mountFixedThemeToggle.js";
import { initHeroSectionNav } from "./app/heroSectionNav.js";

import { initPopupMode } from "./app/popupMode.js";

// 2) утилиты
function ensureFeed(app) {
  let feed = document.getElementById("feed");
  if (feed) return feed;

  feed = document.createElement("main");
  feed.id = "feed";
  feed.className = "ll__feed";
  app.appendChild(feed);
  return feed;
}

// 3) фикс перезагрузки: всегда начинать с hero
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// 4) базовый DOM
const app = document.getElementById("app");
const feed = ensureFeed(app);

// 7) текстовый слой поверх
mountTextLayer({
  mountTo: app,
  data: textData,
  zIndex: 0,
});

// 6) фоновые слои (pixi/градиент) — под контентом
const landingLayer = mountLandingLayer({
  mountTo: app,
  zIndex: 1,
  attrs: { noretina: "true" },
});

// 8) тема/вопросы/тогглы — после слоёв
const themeSwapper = createThemeSwapper({ landingLayer });
themeSwapper.bindToggleButtons();
themeSwapper.exposeThemeApi();

initQuestionOpenner();
mountFixedThemeToggle({ mountTo: document.body });

// 8) основной лендинг (строго по структуре из page.json)
console.log("[engine] mounting sections:", page?.sections?.length);
mountSections(feed, page.sections);
initHeroSectionNav();

// 9) бесконечная догрузка — после mountSections
const infinite = createInfiniteLoader({
  feed: document.getElementById("feed"),
  batchSize: 6,
  nearBottomPx: 900,
  excludeTypes: ["hero-block"],
  protectHero: true,
  minDistance: 2,
  bufferAbove: 5,
  bufferBelow: 12,
});
infinite.enable();

// 11) на всякий — если app скроллится как контейнер (обычно не нужно)
// оставляю аккуратно, без дублей
if (app && app.scrollTop) app.scrollTop = 0;

// …твой текущий импорт стилей/инициализаций…

// ... твои импорты стилей/монтирование слоёв ...

initPopupMode({
  textLayerSelector: "section.tl",
  landingPartsSelectors: [
    "dunchek-gradient.c-PixiIntro-gradient",
    "#feed",
    "button[data-theme-toggle].ll__theme-toggle--floating",
  ],
  textsScopeSelector: "#feed",
});

import { mountGoTouchGrassLayer } from "./add-layers/mountGoTouchGrassLayer.js";

mountGoTouchGrassLayer(); // по умолчанию монтирует в body
