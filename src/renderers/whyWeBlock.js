/**
 * why-we-block — максимально буквальная сборка под твой HTML.
 * Важно: классы ставятся через setAttribute, чтобы сохранить пробелы (как в index.html).
 *
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderWhyWeBlock(section) {
  const c = section.content ?? {};
  const leftItems = Array.isArray(c.left) ? c.left : [];
  const rightItems = Array.isArray(c.right) ? c.right : [];

  // <div class="ll__why-we-block ll__container">
  const root = document.createElement("div");
  root.setAttribute("class", "ll__why-we-block ll__container");

  // <div class="ll__title-container">
  const titleContainer = document.createElement("div");
  titleContainer.setAttribute("class", "ll__title-container");

  // <h2>...</h2>
  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  // <p>...</p>
  const desc = document.createElement("p");
  desc.textContent = c.description ?? "";

  titleContainer.append(h2, desc);

  // <div class="ll__why-we-block__container">
  const container = document.createElement("div");
  container.setAttribute("class", "ll__why-we-block__container");

  // LEFT: <div class="ll__why-we-block__left "> (с пробелом в конце как в HTML)
  const left = document.createElement("div");
  left.setAttribute("class", "ll__why-we-block__left ");

  const leftTitle = document.createElement("h4");
  leftTitle.textContent = c.leftTitle ?? "—";
  left.appendChild(leftTitle);

  // LEFT items
  leftItems.forEach((it, idx) => {
    const part = document.createElement("div");

    // В твоём HTML у ПЕРВОГО элемента двойной пробел перед glass:contentReference[oaicite:4]{index=4}
    // дальше — один пробел:contentReference[oaicite:5]{index=5}
    const leftClass =
      idx === 0
        ? "ll__why-we-block__left-unfilled-part  glass glass--strong is-liquid"
        : "ll__why-we-block__left-unfilled-part glass glass--strong is-liquid";
    part.setAttribute("class", leftClass);

    const mark = document.createElement("h3");
    mark.textContent = "×";

    const sub = document.createElement("div");
    sub.setAttribute("class", "ll__why-we-block__sub-text-container");

    const miniTitle = document.createElement("h4");
    miniTitle.textContent = it.title ?? "—";

    const miniText = document.createElement("p");
    miniText.textContent = it.text ?? "";

    sub.append(miniTitle, miniText);
    part.append(mark, sub);
    left.appendChild(part);
  });

  // RIGHT: <div class="ll__why-we-block__right">
  const right = document.createElement("div");
  right.setAttribute("class", "ll__why-we-block__right");

  const rightTitle = document.createElement("h4");
  rightTitle.textContent = c.rightTitle ?? "—";
  right.appendChild(rightTitle);

  // RIGHT items (без glass-классов на right-filled-part как в HTML):contentReference[oaicite:6]{index=6}
  rightItems.forEach((it) => {
    const part = document.createElement("div");
    part.setAttribute("class", "ll__why-we-block__right-filled-part");

    const mark = document.createElement("h3");
    mark.textContent = "✓";

    const sub = document.createElement("div");
    sub.setAttribute("class", "ll__why-we-block__sub-text-container");

    const miniTitle = document.createElement("h4");
    miniTitle.textContent = it.title ?? "—";

    const miniText = document.createElement("p");
    miniText.textContent = it.text ?? "";

    sub.append(miniTitle, miniText);
    part.append(mark, sub);
    right.appendChild(part);
  });

  container.append(left, right);
  root.append(titleContainer, container);

  return root;
}
