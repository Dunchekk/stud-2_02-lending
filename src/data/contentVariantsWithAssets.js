import rawContentVariants from "./contentVariants.json";

const AVVV = {
  "man-mid.jpg": new URL("../assets/imgs/avvv/man-mid.jpg", import.meta.url).href,
  "man-old2.jpg": new URL("../assets/imgs/avvv/man-old2.jpg", import.meta.url).href,
  "man-old3.jpg": new URL("../assets/imgs/avvv/man-old3.jpg", import.meta.url).href,
  "man-old9.jpg": new URL("../assets/imgs/avvv/man-old9.jpg", import.meta.url).href,
  "man-yan.jpg": new URL("../assets/imgs/avvv/man-yan.jpg", import.meta.url).href,
  "man-yom.jpg": new URL("../assets/imgs/avvv/man-yom.jpg", import.meta.url).href,
  "man1.jpg": new URL("../assets/imgs/avvv/man1.jpg", import.meta.url).href,
  "wom-mid2.jpg": new URL("../assets/imgs/avvv/wom-mid2.jpg", import.meta.url).href,
  "wom-old.jpg": new URL("../assets/imgs/avvv/wom-old.jpg", import.meta.url).href,
  "wom-old4.jpg": new URL("../assets/imgs/avvv/wom-old4.jpg", import.meta.url).href,
  "wom-old6.jpg": new URL("../assets/imgs/avvv/wom-old6.jpg", import.meta.url).href,
  "wom-old7.jpg": new URL("../assets/imgs/avvv/wom-old7.jpg", import.meta.url).href,
  "wom-yan.jpg": new URL("../assets/imgs/avvv/wom-yan.jpg", import.meta.url).href,
  "wom-yang.jpg": new URL("../assets/imgs/avvv/wom-yang.jpg", import.meta.url).href,
  "wom-yang2.jpg": new URL("../assets/imgs/avvv/wom-yang2.jpg", import.meta.url).href,
  "wom-yang3.jpg": new URL("../assets/imgs/avvv/wom-yang3.jpg", import.meta.url).href,
};

function resolveAvvvImgSrc(imgSrc) {
  if (typeof imgSrc !== "string") return imgSrc;

  const match = imgSrc.match(/\/avvv\/([^/]+)$/);
  if (!match) return imgSrc;

  return AVVV[match[1]] ?? imgSrc;
}

function withAssets(contentVariants) {
  const bubblesBlock = contentVariants?.["bubbles-block"];
  if (!bubblesBlock) return contentVariants;

  for (const variant of Object.values(bubblesBlock)) {
    if (!variant?.testimonials) continue;
    for (const t of variant.testimonials) {
      t.imgSrc = resolveAvvvImgSrc(t.imgSrc);
    }
  }

  return contentVariants;
}

export default withAssets(JSON.parse(JSON.stringify(rawContentVariants)));
