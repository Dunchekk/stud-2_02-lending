// Файл инициализирует текстовый слой и экспортирует точку подключения в main.js.

// Создает DOM-элемент с атрибутами и дочерними узлами.
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "dataset" && v && typeof v === "object")
      Object.assign(node.dataset, v);
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2), v);
    else if (k === "style" && typeof v === "object")
      Object.assign(node.style, v);
    else if (v === true) node.setAttribute(k, "");
    else if (v === false || v == null) continue;
    else node.setAttribute(k, String(v));
  }

  for (const ch of children) node.append(ch);
  return node;
}

// Возвращает текстовый узел (используется чаще, чем document.createTextNode).
function text(t) {
  return document.createTextNode(t ?? "");
}

/**
 * Твой формат:
 * {
 *   "tab-type": { "title": "...", "tabContent": { "1": "<html...>", "2": "<html...>" } },
 *   ...
 * }
 *
 * Опционально можно добавить root.order: ["tab-type","tab-pre",...]
 */
function normalize(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("mountTextLayer: data must be an object");
  }

  const order = Array.isArray(raw.order) ? raw.order : null;

  const tabIds = order
    ? order.filter((id) => raw[id] && typeof raw[id] === "object")
    : Object.keys(raw).filter(
        (k) => k.startsWith("tab-") && raw[k] && typeof raw[k] === "object"
      );

  const tabs = tabIds.map((id) => {
    const tab = raw[id] || {};
    const label = tab.title ?? id;

    const tabContent = tab.tabContent || {};
    const pageNums = Object.keys(tabContent)
      .map((k) => Number(k))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    const pages = pageNums.map((n) => String(tabContent[String(n)] ?? ""));

    return { id, label, pages };
  });

  if (tabs.length === 0) {
    throw new Error(
      "mountTextLayer: no tabs found (expected keys like tab-...)"
    );
  }

  return { tabs };
}

// Оборачивает HTML строки в контейнер, чтобы CSS работал последовательно.
function renderHtmlPage(htmlString) {
  const wrap = document.createElement("div");
  wrap.className = "tl__html";
  wrap.innerHTML = htmlString || "";
  return wrap;
}

const THEME_OPTIONS = [
  { id: "green", label: "Зеленый текстовый слой" },
  { id: "black", label: "Черный текстовый слой" },
  { id: "red", label: "Красный текстовый слой" },
];

const DEFAULT_THEME = "red";

// Основной экспорт: монтирует текстовый слой и возвращает небольшой API.
export function mountTextLayer({
  mountTo = document.body,
  data,
  initialTabId,
  initialTabIndex = 0,
  initialPageIndex = 0,
  zIndex = 1,
} = {}) {
  if (!mountTo) throw new Error("mountTextLayer: mountTo is required");

  const model = normalize(data);

  const state = {
    tabIndex: 0,
    pageIndex: 0,
    theme: DEFAULT_THEME,
  };

  const resolvedInitialTabId =
    initialTabId === undefined ? "tab-pre" : initialTabId;

  // initial tab selection
  if (resolvedInitialTabId) {
    const idx = model.tabs.findIndex((t) => t.id === resolvedInitialTabId);
    state.tabIndex = idx >= 0 ? idx : 0;
  } else {
    state.tabIndex = Math.max(
      0,
      Math.min(initialTabIndex, model.tabs.length - 1)
    );
  }
  state.pageIndex = Math.max(0, initialPageIndex);

  // Root
  const root = el("section", {
    class: "tl",
    "aria-label": "Text layer",
    style: { zIndex: String(zIndex) },
  });

  // Left: TOC
  const left = el("aside", { class: "tl__left" });
  const toc = el("nav", { class: "tl__toc", "aria-label": "Оглавление" });
  const themeControls = el("div", {
    class: "tl__themes",
    role: "group",
    "aria-label": "Темы текстового слоя",
  });
  const themeButtons = THEME_OPTIONS.map((theme) =>
    el(
      "button",
      {
        class: "tl__themeBtn",
        type: "button",
        dataset: { theme: theme.id },
        "aria-label": theme.label,
      },
      []
    )
  );
  themeControls.append(...themeButtons);
  left.append(toc, themeControls);

  // Right: content + pager
  const right = el("main", { class: "tl__right" });
  const content = el("div", { class: "tl__content" });

  const pager = el("div", { class: "tl__pager" });
  const btnPrev = el(
    "button",
    { class: "tl__pagerBtn", type: "button", dataset: { action: "prev" } },
    [text("←")]
  );
  const counter = el("div", { class: "tl__pagerCounter" }, [text("1/1")]);
  const btnNext = el(
    "button",
    { class: "tl__pagerBtn", type: "button", dataset: { action: "next" } },
    [text("→")]
  );

  pager.append(btnPrev, counter, btnNext);
  right.append(content, pager);

  root.append(left, right);
  mountTo.append(root);

  function updateThemeButtons() {
    themeButtons.forEach((btn) => {
      const isActive = btn.dataset.theme === state.theme;
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyTheme(themeId) {
    const fallback = THEME_OPTIONS.some((opt) => opt.id === themeId)
      ? themeId
      : DEFAULT_THEME;
    state.theme = fallback;
    root.dataset.theme = fallback;
    if (document.body) {
      document.body.dataset.tlTheme = fallback;
    }
    if (document.documentElement) {
      document.documentElement.dataset.tlTheme = fallback;
    }
    updateThemeButtons();
  }

  // Возвращает текущий активный таб, чтобы не повторять доступ к model.tabs.
  function getActiveTab() {
    return model.tabs[state.tabIndex] || model.tabs[0];
  }

  // Следит, чтобы индекс страницы попадал в диапазон доступных страниц.
  function clampPageIndex() {
    const tab = getActiveTab();
    const total = tab?.pages?.length ?? 0;

    if (total <= 0) state.pageIndex = 0;
    else state.pageIndex = Math.max(0, Math.min(state.pageIndex, total - 1));

    return total;
  }

  // Перерисовывает список табов и выделяет активный.
  function renderToc() {
    toc.innerHTML = "";

    model.tabs.forEach((t, i) => {
      const item = el(
        "button",
        {
          class: `tl__tocItem${i === state.tabIndex ? " is-active" : ""}`,
          type: "button",
          dataset: { idx: String(i), tab: t.id },
        },
        [text(t.label)]
      );
      toc.append(item);
      if (i === 0) toc.append(document.createElement("br"));
    });
  }

  // Отрисовывает содержимое активного таба и состояние пагинатора.
  function renderContent() {
    const tab = getActiveTab();
    const total = clampPageIndex();

    content.innerHTML = "";

    if (!tab || total === 0) {
      content.append(el("p", { class: "tl__empty" }, [text("Нет контента")]));
    } else {
      const html = tab.pages[state.pageIndex];
      content.append(renderHtmlPage(html));
    }

    const current = total === 0 ? 1 : state.pageIndex + 1;
    counter.textContent = `${current}/${Math.max(1, total)}`;

    const hasPrevTab = state.tabIndex > 0;
    const hasNextTab = state.tabIndex < model.tabs.length - 1;
    const hasPrevPage = state.pageIndex > 0;
    const hasNextPage = total > 0 ? state.pageIndex < total - 1 : false;

    const canGoPrev = hasPrevPage || hasPrevTab;
    const canGoNext = hasNextPage || hasNextTab;

    btnPrev.disabled = !canGoPrev;
    btnNext.disabled = !canGoNext;
  }

  // Переключает таб по индексу и опционально указывает стартовую страницу.
  function setTabByIndex(idx, pageIdx = 0) {
    const next = Math.max(0, Math.min(idx, model.tabs.length - 1));
    const changed = next !== state.tabIndex;
    state.tabIndex = next;
    state.pageIndex = pageIdx;
    if (changed) renderToc();
    renderContent();
  }

  // То же самое, но по id таба из исходных данных.
  function setTabById(tabId) {
    const idx = model.tabs.findIndex((t) => t.id === tabId);
    if (idx >= 0) setTabByIndex(idx);
  }

  // Меняет текущую страницу внутри активного таба.
  function setPage(idx) {
    state.pageIndex = idx;
    renderContent();
  }

  // Переходит к следующей странице, а на конце таба переключает следующий таб.
  function goToNext() {
    const tab = getActiveTab();
    const total = tab?.pages?.length ?? 0;

    if (total > 0 && state.pageIndex < total - 1) {
      setPage(state.pageIndex + 1);
      return;
    }

    if (state.tabIndex < model.tabs.length - 1) {
      setTabByIndex(state.tabIndex + 1, 0);
    }
  }

  // Аналогично листает назад, прыгая в предыдущий таб при необходимости.
  function goToPrev() {
    if (state.pageIndex > 0) {
      setPage(state.pageIndex - 1);
      return;
    }

    if (state.tabIndex > 0) {
      const prevIdx = state.tabIndex - 1;
      const prevTab = model.tabs[prevIdx];
      const prevTotal = prevTab?.pages?.length ?? 0;
      const prevPage = prevTotal > 0 ? prevTotal - 1 : 0;
      setTabByIndex(prevIdx, prevPage);
    }
  }

  // TOC click (delegation)
  toc.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-idx]");
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    if (Number.isFinite(idx)) setTabByIndex(idx);
  });

  // Pager click (delegation)
  pager.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const a = btn.dataset.action;
    if (a === "prev") goToPrev();
    if (a === "next") goToNext();
  });

  themeControls.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-theme]");
    if (!btn) return;
    applyTheme(btn.dataset.theme);
  });

  /**
   * Внутренние “прыжки” по тексту.
   * Если в HTML страницы есть любой элемент с data-tab="tab-type" — переключим таб.
   * Пример:
   * <button class="tl__jump" data-tab="tab-type">Жанр лендинга</button>
   */
  root.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-tab]");
    if (!jump) return;
    const tabId = jump.dataset.tab;
    if (tabId) setTabById(tabId);
  });

  // First render
  applyTheme(state.theme);
  renderToc();
  renderContent();

  return {
    root,
    setTabById,
    setTabByIndex,
    setPage,
    getState: () => ({ ...state }),
    destroy: () => root.remove(),
  };
}
