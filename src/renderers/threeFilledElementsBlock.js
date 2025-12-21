/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderThreeFilledElementsBlock(section) {
  const c = section.content ?? {};
  const items = Array.isArray(c.items) ? c.items : [];

  const root = document.createElement("div");
  root.className = "ll__three-filled-elements-block ll__container";

  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__title-container";

  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  titleContainer.append(h2, p);

  const blocks = document.createElement("div");
  blocks.className = "ll__three-filled-elements-block__three-blocks-container";

  for (let i = 0; i < 3; i += 1) {
    const it = items[i] ?? {};
    const block = document.createElement("div");
    block.className = "ll__three-filled-elements-block__block";

    const h3 = document.createElement("h3");
    h3.textContent = it.title ?? `—`;

    const bp = document.createElement("p");
    bp.textContent = it.text ?? "";

    block.append(h3, bp);
    blocks.appendChild(block);
  }

  root.append(titleContainer, blocks);
  return root;
}
