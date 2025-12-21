import { renderHeroBlock } from "./heroBlock.js";
import { renderWhatIsItBlock } from "./whatIsItBlock.js";
import { renderBreakBlock } from "./breakBlock.js";
import { renderBigBlurContentBlock } from "./bigBlurContentBlock.js";

import { renderThreeFilledElementsBlock } from "./threeFilledElementsBlock.js";
import { renderWhyWeBlock } from "./whyWeBlock.js";
import { renderTarifsBlock } from "./tarifsBlock.js";

import { renderBubblesBlock } from "./bubblesBlock.js";
import { renderFaqBlock } from "./faqBlock.js";
import { renderProgBlock } from "./progBlock.js";
import { renderStatBlock } from "./statBlock.js";

const registry = {
  "hero-block": renderHeroBlock,
  "what-is-it-block": renderWhatIsItBlock,
  "break-block": renderBreakBlock,
  "big-blur-content-block": renderBigBlurContentBlock,

  "three-filled-elements-block": renderThreeFilledElementsBlock,
  "why-we-block": renderWhyWeBlock,
  "tarifs-block": renderTarifsBlock,

  "bubbles-block": renderBubblesBlock,
  "faq-block": renderFaqBlock,
  "stat-block": renderStatBlock,
  "prog-block": renderProgBlock,
};

export function renderSection(section) {
  const fn = registry[section.type];
  if (!fn) {
    const el = document.createElement("section");
    el.className = "ll__unknown";
    el.textContent = `Unknown section type: ${section.type}`;
    return el;
  }
  const node = fn(section);
  node.dataset.sectionId = section.id;
  node.dataset.sectionType = section.type;
  node.dataset.sectionVariant = section.variant;
  return node;
}

export function hasRenderer(type) {
  return Boolean(registry[type]);
}
