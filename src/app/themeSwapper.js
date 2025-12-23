const GRADIENT_THEMES = [
  {
    id: "aurora",
    label: "Aurora",
    colors: {
      color1: "#21618f",
      color2: "#3a6686",
      color3: "#85bddd",
      color4: "#59b3e8",
      color5: "#2e6e9d",
      bgcolor: "#42637c",
    },
  },
  {
    id: "ember",
    label: "Ember",
    colors: {
      color1: "#55283d",
      color2: "#55283d",
      color3: "#ac527e",
      color4: "#f05c5e",
      color5: "#6e3550",
      bgcolor: "#6e3550",
    },
  },
  {
    id: "ember1",
    label: "Ember",
    colors: {
      color1: "#000000",
      color2: "#1d1628",
      color3: "#000000",
      color4: "#472d74",
      color5: "#000000",
      bgcolor: "#000000",
    },
  },

  {
    id: "lagoon3",
    label: "Lagoon",
    colors: {
      color1: "#5e4329",
      color2: "#48331f",
      color3: "#6e4a29",
      color4: "#875046",
      color5: "#352a20",
      bgcolor: "#352a20",
    },
  },
  {
    id: "lagoon2",
    label: "Lagoon",
    colors: {
      color1: "#3c3d3a",
      color2: "#464444",
      color3: "#717171",
      color4: "#a49968",
      color5: "#2f2f2f",
      bgcolor: "#23221b",
    },
  },
];

const TEXT_THEMES = [
  {
    id: "aurora",
    label: "Aurora",
    colors: {
      color5: "#3a6686",
    },
  },
  {
    id: "ember1",
    label: "Ember",
    colors: {
      color5: "#2d243d",
    },
  },
  {
    id: "ember",
    label: "Ember",
    colors: {
      color5: "#6e3550",
    },
  },
  {
    id: "lagoon3",
    label: "Lagoon",
    colors: {
      color5: "#352a20",
    },
  },
  {
    id: "lagoon2",
    label: "Lagoon",
    colors: {
      color5: "#464444",
    },
  },
];

const TOGGLE_BUTTON_SELECTOR = "[data-theme-toggle]";
const HERO_SECTION_SELECTOR = "[data-hero-section]";
const FLOATING_TOGGLE_CLASS = "ll__theme-toggle--floating";
const FLOATING_VISIBLE_CLASS = "is-visible";
const FLOATING_SHOWN_CLASS = "is-floating-shown";
const FLOATING_EXITING_CLASS = "is-floating-exiting";
const DARK_TEXT_CSS_VAR = "--ll-text-color-dark";

export function createThemeSwapper({
  landingLayer,
  defaultThemeId = GRADIENT_THEMES[0]?.id,
  transitionDurationMs = 1300,
} = {}) {
  if (!landingLayer) {
    throw new Error("createThemeSwapper: landingLayer is required");
  }

  const themeMap = new Map(GRADIENT_THEMES.map((theme) => [theme.id, theme]));
  const textThemeMap = new Map(TEXT_THEMES.map((theme) => [theme.id, theme]));
  let activeThemeId = defaultThemeId || GRADIENT_THEMES[0].id;
  let activeColors = null;
  let hasAppliedOnce = false;
  let activeAnimationRaf = null;
  let activeTextColor = null;

  const canAnimate =
    typeof requestAnimationFrame === "function" &&
    typeof performance !== "undefined" &&
    typeof performance.now === "function";

  const cancelActiveAnimation = () => {
    if (
      activeAnimationRaf !== null &&
      typeof cancelAnimationFrame !== "undefined"
    ) {
      cancelAnimationFrame(activeAnimationRaf);
    }
    activeAnimationRaf = null;
  };

  const applyTextColor = (themeId, { animate = true, durationMs } = {}) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (!root) return;

    const textTheme = textThemeMap.get(themeId);
    const target = normalizeHex(textTheme?.colors?.color5);
    if (!target) return;

    const inlineValue = normalizeHex(
      root.style.getPropertyValue(DARK_TEXT_CSS_VAR).trim()
    );
    const computedValue =
      typeof window !== "undefined" &&
      typeof window.getComputedStyle === "function"
        ? normalizeHex(
            window
              .getComputedStyle(root)
              .getPropertyValue(DARK_TEXT_CSS_VAR)
              .trim()
          )
        : null;

    const from = activeTextColor || inlineValue || computedValue || target;
    // Важно: всегда задаём значение. Плавность делаем CSS-ом через @property/transition.
    // (JS-анимация переменной оказалась нестабильной в связке с динамическим DOM.)
    void animate;
    void durationMs;
    void from;
    root.style.setProperty(DARK_TEXT_CSS_VAR, target);
    activeTextColor = target;
  };

  const api = {
    applyTheme(themeId = activeThemeId, overrides = {}, options = {}) {
      const theme = themeMap.get(themeId) || themeMap.get(activeThemeId);
      const selected = theme || GRADIENT_THEMES[0];
      const sanitized = sanitizeColors(overrides);
      const nextColors = { ...selected.colors, ...sanitized };

      const { animate = true, durationMs = transitionDurationMs } = options;

      cancelActiveAnimation();
      activeThemeId = selected.id;

      applyTextColor(activeThemeId, { animate, durationMs });

      if (
        !animate ||
        !canAnimate ||
        !hasAppliedOnce ||
        !activeColors ||
        durationMs <= 0
      ) {
        landingLayer.setAttributes(nextColors);
        activeColors = { ...nextColors };
        hasAppliedOnce = true;
        return { ...selected };
      }

      const fromColors = { ...activeColors };
      const toColors = { ...nextColors };

      activeAnimationRaf = animateColorAttributes({
        fromColors,
        toColors,
        durationMs,
        onUpdate: (colors) => {
          activeColors = colors;
          landingLayer.setAttributes(colors);
        },
        onFinish: (finalColors) => {
          activeAnimationRaf = null;
          activeColors = finalColors;
          landingLayer.setAttributes(finalColors);
        },
      });

      return { ...selected };
    },
    cycleTheme(step = 1) {
      if (!GRADIENT_THEMES.length) return null;
      const currentIndex = findThemeIndex(activeThemeId);
      const nextIndex = getLoopedIndex(currentIndex + step);
      const nextTheme = GRADIENT_THEMES[nextIndex];
      api.applyTheme(nextTheme.id);
      return { ...nextTheme };
    },
    updateActiveThemeColors(partialColors = {}) {
      const theme = themeMap.get(activeThemeId);
      if (!theme) return null;
      const clean = sanitizeColors(partialColors);
      theme.colors = { ...theme.colors, ...clean };
      cancelActiveAnimation();
      landingLayer.setAttributes(clean);
      activeColors = { ...(activeColors || {}), ...clean };
      return { ...theme.colors };
    },
    listThemes() {
      return GRADIENT_THEMES.map((theme) => ({
        id: theme.id,
        label: theme.label,
        colors: { ...theme.colors },
      }));
    },
    getActiveThemeId() {
      return activeThemeId;
    },
    bindToggleButtons(options = {}) {
      return bindThemeToggleButtons({
        api,
        ...options,
      });
    },
    exposeThemeApi(target = typeof window === "undefined" ? null : window) {
      if (!target) return;
      target.setGradientTheme = (themeId, overrides = {}) =>
        api.applyTheme(themeId, overrides);
      target.updateGradientColors = (partialColors = {}) =>
        api.updateActiveThemeColors(partialColors);
      target.listGradientThemes = () => api.listThemes();
      target.nextGradientTheme = () => api.cycleTheme();
    },
  };

  api.applyTheme(activeThemeId, {}, { animate: false });

  return api;
}

function sanitizeColors(colors = {}) {
  const result = {};
  Object.entries(colors).forEach(([key, value]) => {
    const normalized = normalizeHex(value);
    if (normalized) result[key] = normalized;
  });
  return result;
}

function normalizeHex(value) {
  if (typeof value !== "string") return null;
  let trimmed = value.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith("#")) {
    trimmed = `#${trimmed}`;
  }
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

function findThemeIndex(themeId) {
  return Math.max(
    0,
    GRADIENT_THEMES.findIndex((theme) => theme.id === themeId)
  );
}

function getLoopedIndex(index) {
  const total = GRADIENT_THEMES.length;
  if (!total) return 0;
  const normalized = ((index % total) + total) % total;
  return normalized;
}

function animateColorAttributes({
  fromColors,
  toColors,
  durationMs,
  onUpdate,
  onFinish,
} = {}) {
  const start = performance.now();
  const keys = Array.from(
    new Set([...Object.keys(fromColors || {}), ...Object.keys(toColors || {})])
  );

  const fromRgb = {};
  const toRgb = {};
  keys.forEach((key) => {
    const a = normalizeHex(fromColors?.[key]) || "#000000";
    const b = normalizeHex(toColors?.[key]) || a;
    fromRgb[key] = hexToRgb(a);
    toRgb[key] = hexToRgb(b);
  });

  const tick = (now) => {
    const t =
      durationMs > 0 ? Math.min(1, Math.max(0, (now - start) / durationMs)) : 1;
    const eased = easeInOutCubic(t);

    const next = {};
    keys.forEach((key) => {
      const a = fromRgb[key];
      const b = toRgb[key];
      const r = Math.round(lerp(a.r, b.r, eased));
      const g = Math.round(lerp(a.g, b.g, eased));
      const bl = Math.round(lerp(a.b, b.b, eased));
      next[key] = rgbToHex({ r, g, b: bl });
    });

    onUpdate?.(next);

    if (t >= 1) {
      onFinish?.(next);
      return null;
    }

    return requestAnimationFrame(tick);
  };

  return requestAnimationFrame(tick);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex) || "#000000";
  const value = normalized.slice(1);
  const n = Number.parseInt(value, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function rgbToHex({ r, g, b }) {
  const rr = clamp255(r).toString(16).padStart(2, "0");
  const gg = clamp255(g).toString(16).padStart(2, "0");
  const bb = clamp255(b).toString(16).padStart(2, "0");
  return `#${rr}${gg}${bb}`.toLowerCase();
}

function clamp255(n) {
  return Math.max(0, Math.min(255, Number.isFinite(n) ? n : 0));
}

function bindThemeToggleButtons({
  api,
  toggleSelector = TOGGLE_BUTTON_SELECTOR,
  heroSelector = HERO_SECTION_SELECTOR,
  floatingClass = FLOATING_TOGGLE_CLASS,
  visibleClass = FLOATING_VISIBLE_CLASS,
  shownClass = FLOATING_SHOWN_CLASS,
  exitingClass = FLOATING_EXITING_CLASS,
} = {}) {
  if (typeof document === "undefined") return () => {};
  const getFloatingButtons = () =>
    Array.from(document.querySelectorAll(toggleSelector)).filter((button) =>
      button.classList.contains(floatingClass)
    );

  const updateFloatingVisibility = (heroGone) => {
    const floatingButtons = getFloatingButtons();
    floatingButtons.forEach((button) => {
      if (heroGone) {
        showFloatingButton(button, {
          shownClass,
          visibleClass,
          exitingClass,
        });
      } else {
        hideFloatingButton(button, {
          shownClass,
          visibleClass,
          exitingClass,
        });
      }
    });
  };

  const handleClick = (event) => {
    const target = /** @type {HTMLElement | null} */ (event.target);
    if (!target) return;
    const toggle = target.closest?.(toggleSelector);
    if (!toggle) return;
    event.preventDefault();
    api.cycleTheme();
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = /** @type {HTMLElement | null} */ (event.target);
    if (!target) return;
    const toggle = target.closest?.(toggleSelector);
    if (!toggle) return;
    event.preventDefault();
    api.cycleTheme();
  };

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeyDown);

  let observer = null;
  let observedHero = null;
  const cleanupHeroObserver = () => {
    if (observer) observer.disconnect();
    observer = null;
    observedHero = null;
  };

  const ensureHeroObserver = () => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    const heroSection = document.querySelector(heroSelector);
    if (!heroSection) return;
    if (heroSection === observedHero) return;

    cleanupHeroObserver();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const heroGone = !entry.isIntersecting;
          updateFloatingVisibility(heroGone);
        });
      },
      { threshold: 0 }
    );

    observer.observe(heroSection);
    observedHero = heroSection;
  };

  // initial state: if hero not found yet, keep floating hidden until it appears
  updateFloatingVisibility(false);
  ensureHeroObserver();

  let mutationObserver = null;
  if (typeof MutationObserver !== "undefined") {
    mutationObserver = new MutationObserver(() => {
      // hero and/or buttons might have been mounted dynamically
      ensureHeroObserver();

      // if hero is gone from DOM (shouldn't, but can happen), fall back to shown
      if (observedHero && !document.contains(observedHero)) {
        cleanupHeroObserver();
        updateFloatingVisibility(true);
      }
    });
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  return () => {
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", handleKeyDown);
    mutationObserver?.disconnect();
    cleanupHeroObserver();
  };
}

function showFloatingButton(
  button,
  { shownClass, visibleClass, exitingClass }
) {
  button.classList.remove(exitingClass);
  button.classList.add(shownClass);
  button.classList.add(visibleClass);
}

function hideFloatingButton(
  button,
  { shownClass, visibleClass, exitingClass }
) {
  button.classList.add(exitingClass);
  button.classList.remove(shownClass);
  button.classList.remove(visibleClass);
}
