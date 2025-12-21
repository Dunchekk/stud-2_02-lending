/**
 * tarifs-block — вариант с меньшими заголовками внутри карточек:
 * h2 (секция) + h3 (карточка тарифа)
 *
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderTarifsBlock(section) {
  const c = section.content ?? {};
  const tarifs = Array.isArray(c.tarifs) ? c.tarifs : [];

  const root = document.createElement("div");
  root.className = "ll__tarifs-block ll__container";

  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__title-container";

  // Заголовок секции (оставляем h2 как в исходнике)
  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  const desc = document.createElement("p");
  desc.textContent = c.description ?? "";

  titleContainer.append(h2, desc);

  const tarifsContainer = document.createElement("div");
  tarifsContainer.className = "ll__tarifs-block__tarifs-container";

  const cardClasses = [
    "ll__tarifs-block__tarif tarif1 glass glass--strong is-liquid",
    "ll__tarifs-block__tarif ll__white-container ",
    "ll__tarifs-block__tarif tarif3 glass glass--strong is-liquid",
  ];

  for (let i = 0; i < 3; i += 1) {
    const t = tarifs[i] ?? {};
    const points = Array.isArray(t.points) ? t.points : [];

    const card = document.createElement("div");
    card.className = cardClasses[i];

    const titles = document.createElement("div");
    titles.className = "ll__tarifs-block__titles";

    // Заголовок тарифа внутри карточки (делаем меньше: h3)
    const tariffTitle = document.createElement("h3");
    tariffTitle.textContent = t.title ?? "—";

    const tariffDesc = document.createElement("p");
    tariffDesc.textContent = t.description ?? "";

    titles.append(tariffTitle, tariffDesc);

    const list = document.createElement("div");
    list.className = "ll__tarifs-block__tarif-p";

    for (const line of points) {
      const lp = document.createElement("p");
      lp.textContent = String(line ?? "");
      list.appendChild(lp);
    }

    const btn = document.createElement("button");
    btn.type = "button";

    if (i === 1) {
      btn.className =
        "ll__unfilled-button ll__unfilled-button-dark  glass glass--pill is-liquid";
    } else {
      btn.className = "ll__unfilled-button";
    }

    btn.textContent = t.ctaText ?? t.price ?? "—";

    card.append(titles, list, btn);
    tarifsContainer.appendChild(card);
  }

  root.append(titleContainer, tarifsContainer);
  return root;
}
