/**
 * big-blur-content-block renderer
 * Supports two DOM patterns:
 *  - image-plain: right-part wrapper + img (верхний вариант из HTML)
 *  - image-filled: direct img.right-part-filled (нижний вариант из HTML)
 *
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderBigBlurContentBlock(section) {
  const c = section.content ?? {};
  const props = section.props ?? {};

  const root = document.createElement("div");
  root.className = "ll__big-blur-content-block ll__container";

  // h2
  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  // blur container
  const blur = document.createElement("div");
  blur.className =
    "ll__big-blur-content-block__blur-container glass glass--strong is-liquid";

  // left part
  const leftPart = document.createElement("div");
  leftPart.className = "ll__big-blur-content-block__blur-left-part";

  const leftTitleContainer = document.createElement("div");
  leftTitleContainer.className =
    "ll__big-blur-content-block__blur-left-part__title-container";

  const titles = document.createElement("div");
  titles.className = "ll__big-blur-content-block__titles";

  const h3 = document.createElement("h3");
  h3.textContent = c.cardTitle ?? "—";

  const p = document.createElement("p");
  p.textContent = c.cardText ?? "";

  titles.append(h3, p);

  const cta = document.createElement("button");
  cta.className = "ll__unfilled-button";
  cta.type = "button";
  cta.textContent = c.ctaText ?? "Узнать больше";

  leftTitleContainer.append(titles, cta);

  const q = document.createElement("button");
  q.className = "ll__unfilled-button ll__big-blur-content-block_question";
  q.type = "button";
  q.textContent = "?";

  leftPart.append(leftTitleContainer, q);

  blur.appendChild(leftPart);

  // right part (IMAGE)
  const imgSrc = c.imageSrc ?? "";

  if (props.rightPartStyle === "image-filled") {
    // === ТОЧЬ-В-ТОЧЬ как у тебя во 2-м варианте ===
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className =
      "ll__big-blur-content-block__blur-container__right-part-filled";
    // намеренно не ставлю alt, чтобы повторить исходник 1:1
    // (в верхнем варианте alt есть, но во втором — нет)
    blur.appendChild(img);
  } else {
    // === верхний вариант (с оберткой right-part) ===
    const rightPart = document.createElement("div");
    rightPart.className =
      "ll__big-blur-content-block__blur-container__right-part";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = c.imageAlt ?? "";

    rightPart.appendChild(img);
    blur.appendChild(rightPart);
  }

  root.append(h2, blur);
  return root;
}
