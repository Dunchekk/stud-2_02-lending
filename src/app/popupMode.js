export function initPopupMode({
  // старт по клику на любую кнопку/ссылку-кнопку
  startButtonsSelector = "button, a, [role='button'], input[type='button'], input[type='submit']",

  // textLayer, который должен остаться и быть кликабельным
  textLayerSelector = "section.tl",

  // что считать “лендингом” (будем гасить и в конце display:none)
  landingPartsSelectors = [
    "dunchek-gradient.c-PixiIntro-gradient",
    "#feed",
    "button[data-theme-toggle].ll__theme-toggle--floating",
  ],

  // где искать тексты для первых кликов (в твоём случае — только #feed)
  textsScopeSelector = "#feed",

  delayBeforeTimerMs = 1000,
  timerFrom = 60,

  fadeTextsSteps = 4,
  fadeLandingSteps = 6,

  transitionMs = 420, // должно совпадать с --erase-transition
} = {}) {
  const state = {
    started: false,
    timerRunning: false,
    eraseMode: false,
    clicks: 0,
    textsOpacity: 1,
    landingOpacity: 1,

    timerEl: null,
    eraseCursorEl: null,
    intervalId: null,
    textsObserver: null,

    textLayerRoot: null,
    landingParts: [],
    textTargets: [],
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const safeInt = (v, fallback) =>
    Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
  const isCoarsePointer =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

  const totalTextSteps = safeInt(fadeTextsSteps, 4);
  const totalLandingSteps = safeInt(fadeLandingSteps, 6);

  const alphaByStep = (stepIndex1based, totalSteps) =>
    clamp01(1 - stepIndex1based / totalSteps);

  function resolveNodes() {
    const textLayer = qs(textLayerSelector);
    if (!textLayer) {
      throw new Error(
        `PopupMode: textLayer not found by selector "${textLayerSelector}"`
      );
    }
    state.textLayerRoot = textLayer;

    state.landingParts = landingPartsSelectors
      .flatMap((sel) => qsa(sel))
      .filter(Boolean);

    if (state.landingParts.length === 0) {
      throw new Error(
        "PopupMode: landingParts resolved to empty; check landingPartsSelectors"
      );
    }
  }

  function createTimerEl() {
    const el = document.createElement("div");
    el.className = "pop-timer";
    el.textContent = String(timerFrom);
    document.body.appendChild(el);
    state.timerEl = el;
  }

  function removeTimerEl() {
    if (state.timerEl) {
      state.timerEl.remove();
      state.timerEl = null;
    }
  }

  function createEraseCursor() {
    const el = document.createElement("div");
    el.className = "erase-cursor";
    document.body.appendChild(el);
    state.eraseCursorEl = el;

    const setPos = (x, y) => {
      if (!state.eraseCursorEl) return;
      state.eraseCursorEl.style.left = `${x}px`;
      state.eraseCursorEl.style.top = `${y}px`;
    };

    // Чтобы квадрат не “висел” в (0,0) до первого движения пальца/мыши
    setPos(window.innerWidth / 2, window.innerHeight / 2);

    const onMove = (e) => setPos(e.clientX, e.clientY);
    const onDown = (e) => setPos(e.clientX, e.clientY);

    window.addEventListener("pointermove", onMove, { passive: true });
    if (isCoarsePointer) {
      window.addEventListener("pointerdown", onDown, { passive: true });
    }

    el._cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      if (isCoarsePointer) window.removeEventListener("pointerdown", onDown);
    };
  }

  function removeEraseCursor() {
    const el = state.eraseCursorEl;
    if (!el) return;
    if (typeof el._cleanup === "function") el._cleanup();
    el.remove();
    state.eraseCursorEl = null;
  }

  function buildTextTargets() {
    const scope = qs(textsScopeSelector);
    if (!scope) {
      throw new Error(
        `PopupMode: textsScope not found by selector "${textsScopeSelector}"`
      );
    }

    // соберём “типографику” внутри #feed
    const candidatesSelector =
      "h1,h2,h3,h4,h5,h6,p,li,span,small,em,strong,b,i,u,blockquote,cite,code,pre,a,button,label,img";

    const candidates = qsa(candidatesSelector, scope);

    // исключим всё, что вдруг окажется в textLayer (на всякий)
    const filtered = candidates.filter(
      (el) => !state.textLayerRoot.contains(el)
    );
    filtered.forEach((el) => {
      el.classList.add("fade-texts-target");
      el.style.opacity = String(clamp01(state.textsOpacity));
    });

    state.textTargets = filtered;

    // следим за новыми секциями/блоками: докрученные элементы тоже должны быть с текущей opacity
    if (typeof MutationObserver === "undefined") return;
    if (state.textsObserver) return;

    state.textsObserver = new MutationObserver((mutations) => {
      if (!state.eraseMode) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          // Если добавили сразу текстовый элемент — обработаем его тоже
          const batch = [];
          if (node.matches?.(candidatesSelector)) batch.push(node);
          const nested = node.querySelectorAll?.(candidatesSelector);
          if (nested?.length) batch.push(...nested);

          batch.forEach((el) => {
            if (state.textLayerRoot?.contains(el)) return;
            if (!el.classList.contains("fade-texts-target")) {
              el.classList.add("fade-texts-target");
            }
            el.style.opacity = String(clamp01(state.textsOpacity));
            // чтобы следующие шаги setTextsOpacity тоже применялись
            if (!state.textTargets.includes(el)) state.textTargets.push(el);
          });
        }
      }
    });

    state.textsObserver.observe(scope, { childList: true, subtree: true });
  }

  function setTextsOpacity(alpha) {
    const a = clamp01(alpha);
    state.textsOpacity = a;
    state.textTargets.forEach((el) => {
      el.style.opacity = String(a);
    });
  }

  function setLandingOpacity(alpha) {
    const a = clamp01(alpha);
    state.landingOpacity = a;
    state.landingParts.forEach((el) => {
      el.classList.add("fade-landing-target");
      el.style.opacity = String(a);
    });
  }

  function setLandingDisplayNone() {
    state.landingParts.forEach((el) => {
      el.style.display = "none";
    });
  }

  function startTimerAfterDelay() {
    state.timerRunning = true;

    window.setTimeout(() => {
      if (!state.timerRunning) return;

      createTimerEl();
      let t = timerFrom;
      state.timerEl.textContent = String(t);

      state.intervalId = window.setInterval(() => {
        t -= 1;
        if (state.timerEl) state.timerEl.textContent = String(Math.max(0, t));

        if (t <= 0) {
          window.clearInterval(state.intervalId);
          state.intervalId = null;
          removeTimerEl();
          enterEraseMode();
        }
      }, 1000);
    }, delayBeforeTimerMs);
  }

  function enterEraseMode() {
    state.eraseMode = true;
    document.body.classList.add("is-erase-mode");
    createEraseCursor();

    // убедимся, что “лендинг” стартует видимым
    state.landingParts.forEach((el) => {
      el.style.display = ""; // если вдруг был none
      el.style.opacity = "1";
    });
    state.landingOpacity = 1;
    state.textsOpacity = 1;

    buildTextTargets();
    document.addEventListener("pointerdown", onEraseClick, true);
  }

  function exitEraseMode() {
    state.eraseMode = false;
    document.body.classList.remove("is-erase-mode");
    removeEraseCursor();
    document.removeEventListener("pointerdown", onEraseClick, true);
    if (state.textsObserver) {
      state.textsObserver.disconnect();
      state.textsObserver = null;
    }
  }

  function finalizeToTextLayer() {
    // важно: убрать из hit-testing
    setLandingDisplayNone();
    exitEraseMode();
  }

  function onEraseClick(e) {
    if (!state.eraseMode) return;

    // клики по textLayer НЕ должны тратить “стирающие” шаги
    if (state.textLayerRoot.contains(e.target)) return;

    state.clicks += 1;

    // 1) первые N: тексты в #feed 100% -> 0%
    if (state.clicks <= totalTextSteps) {
      const alpha = alphaByStep(state.clicks, totalTextSteps);
      setTextsOpacity(alpha);
      return;
    }

    // 2) следующие M: весь лендинг 100% -> 0%
    const k = state.clicks - totalTextSteps;

    if (k <= totalLandingSteps) {
      const alpha = alphaByStep(k, totalLandingSteps);
      setLandingOpacity(alpha);

      if (k === totalLandingSteps) {
        window.setTimeout(() => {
          // гарантируем 0 и только потом display:none
          setLandingOpacity(0);
          finalizeToTextLayer();
        }, transitionMs + 40);
      }
    }
  }

  function onStartButtonClick(e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    // исключение: обе кнопки смены темы (~) НЕ запускают таймер
    if (target.closest("[data-theme-toggle]")) return;

    const btn = target.closest(startButtonsSelector);
    if (!btn) return;

    if (state.started) return;
    state.started = true;

    resolveNodes();
    startTimerAfterDelay();
  }

  document.addEventListener("click", onStartButtonClick, true);

  return {
    destroy() {
      document.removeEventListener("click", onStartButtonClick, true);
      document.removeEventListener("pointerdown", onEraseClick, true);

      state.timerRunning = false;
      if (state.intervalId) window.clearInterval(state.intervalId);

      removeTimerEl();
      removeEraseCursor();
      document.body.classList.remove("is-erase-mode");
      if (state.textsObserver) {
        state.textsObserver.disconnect();
        state.textsObserver = null;
      }
    },
  };
}
