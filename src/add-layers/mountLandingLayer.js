// ./add-layers/mountLandingLayer.js
export function mountLandingLayer({
  mountTo,
  id = "landing-layer",
  className = "landing-layer",
  zIndex = 0,
  theme = "blue",
} = {}) {
  if (!mountTo) throw new Error("mountLandingLayer: mountTo is required");

  const existing = mountTo.querySelector(`#${CSS.escape(id)}`);
  if (existing) return existing;

  const landingLayer = document.createElement("div");
  landingLayer.id = id;
  landingLayer.className = className;
  landingLayer.style.position = "relative";
  landingLayer.style.zIndex = String(zIndex);

  const pixiEl = document.createElement("ll-pixi-gradient");
  pixiEl.className = "ll-pixi-bg";
  pixiEl.dataset.theme = theme;

  // pixi фон должен быть самым первым
  landingLayer.appendChild(pixiEl);

  // вставить ПОСЛЕ text-layer, если он есть
  const textLayer = mountTo.querySelector("#text-layer");
  if (textLayer && textLayer.parentNode === mountTo) {
    if (textLayer.nextSibling) {
      mountTo.insertBefore(landingLayer, textLayer.nextSibling);
    } else {
      mountTo.appendChild(landingLayer);
    }
  } else {
    mountTo.appendChild(landingLayer);
  }

  return landingLayer;
}
