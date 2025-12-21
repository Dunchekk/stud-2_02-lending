/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderWhatIsItBlock(section) {
  const c = section.content ?? {};
  const sections = Array.isArray(c.sections) ? c.sections : [];

  const root = document.createElement("div");
  root.className = "ll__what-is-it-block ll__container";

  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__title-container";

  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  titleContainer.append(h2, p);

  const container = document.createElement("div");
  container.className = "ll__what-is-it-block__sections-container";

  // Контракт: 3 секции
  for (let i = 0; i < 3; i += 1) {
    const s = sections[i] ?? {};

    const sectionEl = document.createElement("div");
    sectionEl.className = "ll__what-is-it-block-section";

    const bubble = document.createElement("div");
    bubble.className =
      "ll__what-is-it-block-bubble glass glass--strong is-liquid";

    const h3 = document.createElement("h3");
    h3.textContent = s.heading ?? "—";

    const bubbleP = document.createElement("p");
    bubbleP.textContent = s.text ?? "";

    bubble.append(h3, bubbleP);

    const numeric = document.createElement("div");
    numeric.className = "ll__what-is-it-block__numeric-container";

    const num = document.createElement("h2");
    num.textContent = `${i + 1}.`;

    const btn = document.createElement("button");
    btn.className = "ll__unfilled-button";
    btn.type = "button";
    btn.textContent = s.buttonText ?? "Узнать больше";

    numeric.append(num, btn);

    // Вторая секция — numeric слева, bubble справа (как в HTML)
    if (i === 1) {
      sectionEl.append(numeric, bubble);
    } else {
      sectionEl.append(bubble, numeric);
    }

    container.appendChild(sectionEl);
  }

  root.append(titleContainer, container);
  return root;
}
