// src/add-layers/mountLanding.js
import { defineDunchekGradientElement } from "../pixi/initPixi.js";

export function mountLandingLayer({ mountTo, zIndex = 1, attrs = {} } = {}) {
  if (!mountTo) throw new Error("mountLandingLayer: mountTo is required");

  defineDunchekGradientElement();

  const el = document.createElement("dunchek-gradient");
  el.className = "c-PixiIntro-gradient";

  const defaults = {
    color1: "#0e1c3f",
    color2: "#23418a",
    color3: "#aadfd9",
    color4: "#e64f0f",
    color5: "#000000",
    bgcolor: "#050505",
    displacement: "0",
    seed: "0",
    noretina: "true",
  };

  const merged = { ...defaults, ...attrs };
  for (const [k, v] of Object.entries(merged)) {
    el.setAttribute(k, String(v));
  }

  el.style.zIndex = String(zIndex);

  mountTo.appendChild(el);

  const api = {
    el,
    setAttributes(nextAttrs = {}) {
      Object.entries(nextAttrs).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        el.setAttribute(key, String(value));
      });
    },
    destroy() {
      el.remove();
    },
  };

  return api;
}
