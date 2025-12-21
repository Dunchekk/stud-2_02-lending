/**
 * stat-block — 1:1 по твоему HTML
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderStatBlock(section) {
  const c = section.content ?? {};

  const root = document.createElement("div");
  root.setAttribute("class", "ll__stat-block ll__container");

  const titleContainer = document.createElement("div");
  titleContainer.setAttribute("class", "ll__title-container");

  const h4 = document.createElement("h4");
  h4.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  const btn = document.createElement("button");
  btn.setAttribute("class", "ll__filled-button glass glass--pill is-liquid");
  btn.type = "button";
  btn.textContent = c.buttonText ?? "Узнать больше";

  titleContainer.append(h4, p, btn);

  const img = document.createElement("img");
  img.setAttribute("src", c.imgSrc ?? "./src/assets/imgs/stst.svg");
  img.setAttribute("alt", c.imgAlt ?? "");

  root.append(titleContainer, img);
  return root;
}
