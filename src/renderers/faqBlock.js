/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderFaqBlock(section) {
  const c = section.content ?? {};
  const leftItems = Array.isArray(c.left) ? c.left : [];
  const rightItems = Array.isArray(c.right) ? c.right : [];

  const root = document.createElement("div");
  root.className = "ll__faq-block ll__container";

  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__title-container";

  const h2 = document.createElement("h2");
  h2.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  titleContainer.append(h2, p);

  const faqContainer = document.createElement("div");
  faqContainer.className = "ll__faq-block__faq-container";

  const left = document.createElement("div");
  left.className = "ll__faq-block__left";

  const right = document.createElement("div");
  right.className = "ll__faq-block__right";

  const makeItem = (it) => {
    const qc = document.createElement("div");
    qc.className = "ll__faq-block__question-container";

    const q = document.createElement("div");
    q.className = "ll__faq-block__question";

    const plus = document.createElement("h4");
    plus.textContent = "+";

    const h5 = document.createElement("h5");
    h5.textContent = it.question ?? "—";

    q.append(plus, h5);

    const ans = document.createElement("div");
    ans.className = "ll__faq-block__answer glass glass--strong is-liquid";

    const ap = document.createElement("p");
    // чтобы поддержать <br><br> как в исходнике — используем innerHTML
    ap.innerHTML = it.answerHtml ?? "";

    ans.appendChild(ap);

    qc.append(q, ans);
    return qc;
  };

  leftItems.forEach((it) => left.appendChild(makeItem(it)));
  rightItems.forEach((it) => right.appendChild(makeItem(it)));

  faqContainer.append(left, right);
  root.append(titleContainer, faqContainer);
  return root;
}
