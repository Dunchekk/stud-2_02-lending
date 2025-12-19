// src/add-layers/mountLanding.js
import { defineMonopoGradientElement } from "../pixi/initPixi.js";

export function mountLandingLayer({ mountTo, zIndex = 0, attrs = {} } = {}) {
  if (!mountTo) throw new Error("mountLandingLayer: mountTo is required");

  defineMonopoGradientElement();

  const el = document.createElement("monopo-gradient");
  el.className = "c-PixiIntro-gradient";

  // default attrs close to your monopo example
  const defaults = {
    color1: "#16254b",
    color2: "#23418a",
    color3: "#aadfd9",
    color4: "#e64f0f",
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

  return {
    el,
    destroy() {
      el.remove();
    },
  };
}
