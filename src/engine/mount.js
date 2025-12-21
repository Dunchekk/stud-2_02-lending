import { resolveSection } from "./resolveSection.js";
import { renderSection, hasRenderer } from "../renderers/index.js";

export function mountSections(feed, specs) {
  if (!(feed instanceof HTMLElement)) {
    throw new Error("mountSections: feed must be HTMLElement");
  }
  if (!Array.isArray(specs)) {
    throw new Error("mountSections: specs must be an array");
  }

  const frag = document.createDocumentFragment();
  const nodes = [];

  // === ВОТ ТУТ ===
  const missing = new Set();

  for (const spec of specs) {
    if (!hasRenderer(spec.type)) {
      missing.add(spec.type);
      console.warn(`[mount] skipped (no renderer): ${spec.type}`);
      continue;
    }

    const resolved = resolveSection(spec);
    const node = renderSection(resolved);
    frag.appendChild(node);
    nodes.push(node);
  }

  feed.appendChild(frag);

  // === И ВОТ ТУТ, В КОНЦЕ ФУНКЦИИ ===
  if (missing.size) {
    console.log("[mount] missing renderers:", [...missing]);
  } else {
    console.log("[mount] all section types rendered");
  }

  return nodes;
}
