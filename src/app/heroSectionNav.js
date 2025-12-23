const DEFAULT_FEED_SELECTOR = "#feed";
const DEFAULT_HERO_SELECTOR = "[data-hero-section]";
const DEFAULT_NAV_CONTAINER_SELECTOR = "[data-hero-nav-list]";

/**
 * Builds a live “sections list” in hero (right column).
 * - Tracks current sections in #feed (excluding hero + break-block)
 * - Renders as <div> with <span> items (no ul/ol)
 * - Click/Enter/Space scrolls smoothly to section
 *
 * @param {{
 *  feedSelector?: string,
 *  heroSelector?: string,
 *  navContainerSelector?: string,
 *  excludeTypes?: string[],
 *  scrollOffsetPx?: number
 * }} opts
 * @returns {() => void} cleanup
 */
export function initHeroSectionNav(opts = {}) {
  if (typeof document === "undefined") return () => {};

  const {
    feedSelector = DEFAULT_FEED_SELECTOR,
    heroSelector = DEFAULT_HERO_SELECTOR,
    navContainerSelector = DEFAULT_NAV_CONTAINER_SELECTOR,
    excludeTypes = ["hero-block", "break-block"],
    scrollOffsetPx,
    maxItems = 6,
  } = opts;

  const hero = document.querySelector(heroSelector);
  const navContainer = hero?.querySelector(navContainerSelector);
  const feed = document.querySelector(feedSelector);

  if (!hero || !navContainer || !feed) return () => {};

  const computeOffset = () => {
    if (Number.isFinite(scrollOffsetPx)) return scrollOffsetPx;
    try {
      const space = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--space")
      );
      return Number.isFinite(space) ? Math.round(space * 6) : 48;
    } catch {
      return 48;
    }
  };

  const getTitleForSection = (sectionEl) => {
    if (!(sectionEl instanceof HTMLElement)) return "";

    const titleEl =
      sectionEl.querySelector(".ll__title-container h2") ||
      sectionEl.querySelector(".ll__title-container h4") ||
      sectionEl.querySelector("h2") ||
      sectionEl.querySelector("h4") ||
      sectionEl.querySelector("h3");

    const text = titleEl?.textContent?.trim() || "";
    if (!text) return "";

    // Drop trailing arrows like "FAQ →"
    const arrowIdx = text.indexOf("→");
    if (arrowIdx !== -1) return text.slice(0, arrowIdx).trim() || text.trim();

    return text;
  };

  const scrollToSectionId = (sectionId) => {
    if (!sectionId) return;
    const el = document.querySelector(
      `[data-section-id="${cssEscape(sectionId)}"]`
    );
    if (!(el instanceof HTMLElement)) return;

    const top =
      el.getBoundingClientRect().top + (window.scrollY || 0) - computeOffset();

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  };

  const rebuild = () => {
    const sectionNodes = Array.from(feed.children).filter(
      (node) => node instanceof HTMLElement
    );

    const items = sectionNodes
      .map((node) => {
        const type = node.dataset?.sectionType || "";
        const id = node.dataset?.sectionId || "";
        if (!type || !id) return null;
        if (excludeTypes.includes(type)) return null;

        const title = getTitleForSection(node);
        if (!title) return null;

        return { id, type, title };
      })
      .filter(Boolean);

    navContainer.innerHTML = "";

    items.slice(0, Math.max(0, maxItems)).forEach((it, idx, arr) => {
      const span = document.createElement("span");
      span.className = "ll__hero-nav-item";
      span.textContent = `${it.title} •`;
      span.setAttribute("role", "link");
      span.setAttribute("tabindex", "0");
      span.dataset.targetSectionId = it.id;
      navContainer.appendChild(span);
      if (idx !== arr.length - 1)
        navContainer.appendChild(document.createElement("br"));
    });
  };

  const onActivate = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const item = target.closest(".ll__hero-nav-item");
    if (!item) return;
    const id = item.getAttribute("data-target-section-id");
    if (!id) return;
    event.preventDefault();
    scrollToSectionId(id);
  };

  const onKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const item = target.closest(".ll__hero-nav-item");
    if (!item) return;
    event.preventDefault();
    const id = item.getAttribute("data-target-section-id");
    if (!id) return;
    scrollToSectionId(id);
  };

  navContainer.addEventListener("click", onActivate);
  navContainer.addEventListener("keydown", onKeyDown);

  let rafPending = false;
  const scheduleRebuild = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      rebuild();
    });
  };

  const observer =
    typeof MutationObserver !== "undefined"
      ? new MutationObserver(scheduleRebuild)
      : null;

  observer?.observe(feed, { childList: true });

  // initial
  rebuild();

  return () => {
    navContainer.removeEventListener("click", onActivate);
    navContainer.removeEventListener("keydown", onKeyDown);
    observer?.disconnect();
  };
}

// https://drafts.csswg.org/cssom/#the-css.escape()-method
function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/"/g, '\\"');
}
