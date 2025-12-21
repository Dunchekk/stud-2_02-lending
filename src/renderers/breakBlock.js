/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderBreakBlock(section) {
  const c = section.content ?? {};

  const root = document.createElement("div");
  root.className = "ll__break-block ll__container";

  const h4 = document.createElement("h4");
  h4.textContent = c.title ?? "—";

  const p = document.createElement("p");
  p.textContent = c.description ?? "";

  root.append(h4, p);
  return root;
}
