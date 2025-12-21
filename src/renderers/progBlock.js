/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderProgBlock(section) {
  const c = section.content ?? {};
  const info1 = Array.isArray(c.info1) ? c.info1 : [];
  const info2 = Array.isArray(c.info2) ? c.info2 : [];

  const root = document.createElement("div");
  root.className = "ll__prog-block ll__container";

  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__title-container";

  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  titleContainer.append(h2, p);

  const mainShape = document.createElement("div");
  mainShape.className =
    "ll__prog-block__main-shape glass glass--soft is-liquid";

  const mainContainer = document.createElement("div");
  mainContainer.className = "ll__prog-block__main-container";

  const innerTitle = document.createElement("div");
  innerTitle.className = "ll__prog-block__title-container";

  const h3 = document.createElement("h3");
  h3.textContent = c.cardTitle ?? "—";

  const cp = document.createElement("p");
  cp.textContent = c.cardText ?? "";

  innerTitle.append(h3, cp);

  const infoContainer = document.createElement("div");
  infoContainer.className = "ll__prog-block__info-container";

  const col1 = document.createElement("div");
  col1.className = "ll__p-b__info1";

  info1.forEach((line) => {
    const pp = document.createElement("p");
    pp.textContent = String(line ?? "");
    col1.appendChild(pp);
  });

  const col2 = document.createElement("div");
  col2.className = "ll__p-b__info2";

  info2.forEach((line) => {
    const pp = document.createElement("p");
    pp.textContent = String(line ?? "");
    col2.appendChild(pp);
  });

  infoContainer.append(col1, col2);
  mainContainer.append(innerTitle, infoContainer);
  mainShape.appendChild(mainContainer);

  root.append(titleContainer, mainShape);
  return root;
}
