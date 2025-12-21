/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderBubblesBlock(section) {
  const c = section.content ?? {};
  const testimonials = Array.isArray(c.testimonials) ? c.testimonials : [];

  const root = document.createElement("div");
  root.className = "ll__bubbles-block ll__container";

  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__title-container";

  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  titleContainer.append(h2, p);

  const three = document.createElement("div");
  three.className = "ll__bubbles-block__three-blocks-container";

  // 3 или 6
  const total = testimonials.length;
  const itemsPerGroup = total >= 6 ? 2 : 1;

  // Паттерн внешних классов пузырей, как у тебя в HTML:
  // 1 glass, 2 white, 3 white, 4 glass, 5 glass, 6 white
  const styleByIndex = [
    "glass glass--strong is-liquid", // 1
    "ll__white-container", // 2
    "ll__white-container", // 3
    "glass glass--strong is-liquid", // 4
    "glass glass--strong is-liquid", // 5
    "ll__white-container", // 6
  ];

  const makeBubble = (t, idx1based) => {
    const bubble = document.createElement("div");
    bubble.className = `ll__bubbles-block__bubble bubble${idx1based} ${
      styleByIndex[idx1based - 1]
    }`;

    const person = document.createElement("div");
    person.className = "ll__bubbles-block__person";

    const img = document.createElement("img");
    img.src = t.imgSrc ?? "";
    img.alt = t.imgAlt ?? "";

    const info = document.createElement("div");
    info.className = "ll__bubbles-block__person__info";

    const h4 = document.createElement("h4");
    h4.textContent = t.title ?? "—"; // например "Антон, 35 лет"

    const mini = document.createElement("p");
    mini.textContent = t.subtitle ?? ""; // например "Директор большой компании"

    info.append(h4, mini);
    person.append(img, info);

    const quote = document.createElement("p");
    quote.textContent = t.text ?? "";

    bubble.append(person, quote);
    return bubble;
  };

  // 3 группы
  for (let g = 0; g < 3; g += 1) {
    const group = document.createElement("div");
    group.className = "ll__bubbles-block__two-blocks";

    const start = g * itemsPerGroup;
    const slice = testimonials.slice(start, start + itemsPerGroup);

    slice.forEach((t, i) => {
      const idx1based = start + i + 1; // 1..6
      group.appendChild(makeBubble(t, idx1based));
    });

    three.appendChild(group);
  }

  root.append(titleContainer, three);
  return root;
}
