/**
 * Mounts fixed theme toggle button identical to the hero "~" button.
 * Keeps it always available even if hero gets trimmed out.
 *
 * @param {object} opts
 * @param {HTMLElement} [opts.mountTo=document.body]
 * @param {string} [opts.positionClass="ll__theme-toggle-button ll__theme-toggle--floating"]
 */
export function mountFixedThemeToggle(opts = {}) {
  const {
    mountTo = document.body,
    positionClass = "ll__theme-toggle-button ll__theme-toggle--floating",
  } = opts;

  if (!(mountTo instanceof HTMLElement)) {
    throw new Error("mountFixedThemeToggle: mountTo must be HTMLElement");
  }

  const btn = document.createElement("button");
  btn.type = "button";

  // EXACT attributes from your HTML hero button
  btn.setAttribute("data-theme-toggle", "");
  btn.setAttribute("aria-label", "Сменить тему");

  // EXACT classes from your HTML hero button + one positioning class
  btn.setAttribute(
    "class",
    `ll__filled-button glass glass--pill is-liquid ${positionClass}`
  );

  // EXACT text content
  btn.textContent = "~";

  mountTo.appendChild(btn);

  return {
    el: btn,
    destroy() {
      btn.remove();
    },
  };
}
