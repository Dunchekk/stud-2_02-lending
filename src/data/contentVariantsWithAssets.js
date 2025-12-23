import rawContentVariants from "./contentVariants.json";

const ASSET_URLS = {
  "./src/assets/imgs/lend/Group 5.png": new URL("../assets/imgs/lend/Group 5.png", import.meta.url).href,
  "./src/assets/imgs/lend/family.png": new URL("../assets/imgs/lend/family.png", import.meta.url).href,
  "./src/assets/imgs/lend/forest.png": new URL("../assets/imgs/lend/forest.png", import.meta.url).href,
  "./src/assets/imgs/lend/lal.png": new URL("../assets/imgs/lend/lal.png", import.meta.url).href,
  "./src/assets/imgs/lend/stst.svg": new URL("../assets/imgs/lend/stst.svg", import.meta.url).href,
  "./src/assets/imgs/lend/water.png": new URL("../assets/imgs/lend/water.png", import.meta.url).href,
  "./src/assets/imgs/lend/woman.png": new URL("../assets/imgs/lend/woman.png", import.meta.url).href,

  "./src/assets/imgs/avvv/man-mid.jpg": new URL("../assets/imgs/avvv/man-mid.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/man-old2.jpg": new URL("../assets/imgs/avvv/man-old2.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/man-old3.jpg": new URL("../assets/imgs/avvv/man-old3.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/man-old9.jpg": new URL("../assets/imgs/avvv/man-old9.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/man-yan.jpg": new URL("../assets/imgs/avvv/man-yan.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/man-yom.jpg": new URL("../assets/imgs/avvv/man-yom.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/man1.jpg": new URL("../assets/imgs/avvv/man1.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-mid2.jpg": new URL("../assets/imgs/avvv/wom-mid2.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-old.jpg": new URL("../assets/imgs/avvv/wom-old.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-old4.jpg": new URL("../assets/imgs/avvv/wom-old4.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-old6.jpg": new URL("../assets/imgs/avvv/wom-old6.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-old7.jpg": new URL("../assets/imgs/avvv/wom-old7.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-yan.jpg": new URL("../assets/imgs/avvv/wom-yan.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-yang.jpg": new URL("../assets/imgs/avvv/wom-yang.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-yang2.jpg": new URL("../assets/imgs/avvv/wom-yang2.jpg", import.meta.url).href,
  "./src/assets/imgs/avvv/wom-yang3.jpg": new URL("../assets/imgs/avvv/wom-yang3.jpg", import.meta.url).href,
};

function resolveAssetUrl(value) {
  if (typeof value !== "string") return value;
  return ASSET_URLS[value] ?? value;
}

function applyAssetUrls(value) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = applyAssetUrls(value[i]);
    return value;
  }

  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) value[k] = applyAssetUrls(v);
    return value;
  }

  return resolveAssetUrl(value);
}

export default applyAssetUrls(JSON.parse(JSON.stringify(rawContentVariants)));
