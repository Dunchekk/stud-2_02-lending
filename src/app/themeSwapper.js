const GRADIENT_THEMES = [
  {
    id: "aurora",
    label: "Aurora",
    colors: {
      color1: "#0e1c3f",
      color2: "#23418a",
      color3: "#aadfd9",
      color4: "#e64f0f",
      color5: "#000000",
      bgcolor: "#050505",
    },
  },
  {
    id: "ember",
    label: "Ember",
    colors: {
      color1: "#AC619F",
      color2: "#AB4571",
      color3: "#FF7994",
      color4: "#ff2a54ff",
      color5: "#FFA7F0",
      bgcolor: "#49041b",
    },
  },
  {
    id: "lagoon",
    label: "Lagoon",
    colors: {
      color1: "#8C00FF",
      color2: "#8C00FF",
      color3: "#8a00b8ff",
      color4: "#2e0054",
      color5: "#8C00FF",
      bgcolor: "#010811",
    },
  },
  {
    id: "lagoon2",
    label: "Lagoon",
    colors: {
      color1: "#3700FF",
      color2: "#4100D9",
      color3: "#00AEFF",
      color4: "#3700FF",
      color5: "#0B1865",
      bgcolor: "#010811",
    },
  },
  {
    id: "lagoon3",
    label: "Lagoon",
    colors: {
      color1: "#FDFF79",
      color2: "#FDFF79",
      color3: "#FF8000",
      color4: "#FF8000",
      color5: "#FDFF79",
      bgcolor: "#a83b00",
    },
  },
];

const TOGGLE_BUTTON_SELECTOR = "[data-theme-toggle]";
const HERO_SECTION_SELECTOR = "[data-hero-section]";
const FLOATING_TOGGLE_CLASS = "ll__theme-toggle--floating";
const FLOATING_VISIBLE_CLASS = "is-visible";
const FLOATING_SHOWN_CLASS = "is-floating-shown";
const FLOATING_EXITING_CLASS = "is-floating-exiting";

export function createThemeSwapper({
  landingLayer,
  defaultThemeId = GRADIENT_THEMES[2]?.id,
} = {}) {
  if (!landingLayer) {
    throw new Error("createThemeSwapper: landingLayer is required");
  }

  const themeMap = new Map(GRADIENT_THEMES.map((theme) => [theme.id, theme]));
  let activeThemeId = defaultThemeId || GRADIENT_THEMES[0].id;

  const api = {
    applyTheme(themeId = activeThemeId, overrides = {}) {
      const theme = themeMap.get(themeId) || themeMap.get(activeThemeId);
      const selected = theme || GRADIENT_THEMES[0];
      const sanitized = sanitizeColors(overrides);
      landingLayer.setAttributes({ ...selected.colors, ...sanitized });
      activeThemeId = selected.id;
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
      landingLayer.setAttributes(clean);
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

  api.applyTheme(activeThemeId);

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
  const buttons = Array.from(document.querySelectorAll(toggleSelector));
  if (!buttons.length) return () => {};

  const handleClick = (event) => {
    event.preventDefault();
    api.cycleTheme();
  };

  buttons.forEach((button) => {
    button.addEventListener("click", handleClick);
  });

  const floatingButtons = buttons.filter((button) =>
    button.classList.contains(floatingClass)
  );
  let observerCleanup = null;

  const updateFloatingVisibility = (heroGone) => {
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

  if (floatingButtons.length && typeof window !== "undefined") {
    const heroSection = document.querySelector(heroSelector);
    if (heroSection && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const heroGone = entry.intersectionRatio === 0;
            updateFloatingVisibility(heroGone);
          });
        },
        {
          threshold: 0,
        }
      );
      observer.observe(heroSection);
      observerCleanup = () => observer.disconnect();
    } else {
      updateFloatingVisibility(true);
    }
  }

  return () => {
    buttons.forEach((button) => {
      button.removeEventListener("click", handleClick);
    });
    if (typeof observerCleanup === "function") observerCleanup();
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
