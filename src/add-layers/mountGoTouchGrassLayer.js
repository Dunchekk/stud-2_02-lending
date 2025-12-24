// src/layers/mountGoTouchGrassLayer.js

// === УДОБНЫЕ КОНСТАНТЫ (меняй тут) ===
export const GTG_CONFIG = {
  ACTIVATION_DELAY_MS: 60_000, // через сколько включать слой
  SPAWN_INTERVAL_MS: 27_000, // как часто спавнить картинку
  FLOAT_DURATION_MS: 25_000, // сколько плывёт одна картинка вверх (linear)

  MAX_WIDTH_VW: 45, // максимум ширины картинки
  MIN_WIDTH_VW: 30, // минимум ширины картинки (можно 0, если хочешь совсем рандом)

  // чтобы картинка не улетала сильно за края при translateX(-50%)
  MIN_X_PCT: 6, // левый предел в % (0..100)
  MAX_X_PCT: 94, // правый предел в % (0..100)
};

// Vite: соберёт все картинки в массив URL.
// При необходимости расширь список форматов.
const imgModules = import.meta.glob(
  "../assets/imgs/go_touch_grass/*.{png,jpg,jpeg,webp,gif}",
  { eager: true, as: "url" }
);
const GTG_IMAGES = Object.values(imgModules);

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isMobileLike() {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return (
    window.matchMedia("(max-width: 500px)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Монтирует слой поверх всего.
 * @param {{ mountTo?: HTMLElement }} [opts]
 * @returns {{ unmount: () => void }}
 */
export function mountGoTouchGrassLayer(opts = {}) {
  const mountTo = opts.mountTo ?? document.body;
  const getSpawnIntervalMs = () =>
    isMobileLike()
      ? Math.round(GTG_CONFIG.SPAWN_INTERVAL_MS / 1.5)
      : GTG_CONFIG.SPAWN_INTERVAL_MS;

  if (!GTG_IMAGES.length) {
    // намеренно не кидаю ошибку, чтобы сборка не падала.
    // Но если хочешь строго — поменяй на throw.
    console.warn(
      "[go-touch-grass] No images found in /src/assets/imgs/go-touch-grass"
    );
  }

  // Контейнер слоя
  const layer = document.createElement("div");
  layer.className = "gtg-layer";
  layer.setAttribute("aria-hidden", "true");
  mountTo.appendChild(layer);

  let activationTimerId = null;
  let spawnTimerId = null;
  let isActive = false;
  let activationAtMs = Date.now() + GTG_CONFIG.ACTIVATION_DELAY_MS;
  let nextSpawnAtMs = null;
  let isPaused = false;

  function spawnOne() {
    if (!isActive) return;
    if (!GTG_IMAGES.length) return;

    const src = pickRandom(GTG_IMAGES);

    const item = document.createElement("div");
    item.className = "gtg-item";
    item.style.setProperty(
      "--gtg-float-ms",
      `${GTG_CONFIG.FLOAT_DURATION_MS}ms`
    );

    // Размер — отдельно, чтобы легко крутить
    if (isMobileLike()) {
      const w = rand(50, 80);
      item.style.setProperty("--gtg-w", `${w}vw`);
    } else {
      const w = rand(GTG_CONFIG.MIN_WIDTH_VW, GTG_CONFIG.MAX_WIDTH_VW);
      item.style.setProperty("--gtg-w", `${w}vw`);
    }

    // X позиция
    const xPct = clamp(
      rand(GTG_CONFIG.MIN_X_PCT, GTG_CONFIG.MAX_X_PCT),
      0,
      100
    );
    item.style.left = `${xPct}%`;

    const img = document.createElement("img");
    img.className = "gtg-img";
    img.src = src;
    img.alt = "";
    img.decoding = "async";
    img.loading = "eager";
    img.draggable = false;

    // click -> плавно исчезнуть, потом удалить
    img.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (item.classList.contains("is-dismissed")) return;
      item.classList.add("is-dismissed");
      const rm = () => item.remove();
      item.addEventListener("transitionend", rm, { once: true });
      // fallback на случай, если transitionend не придёт
      window.setTimeout(rm, 450);
    });

    item.appendChild(img);
    layer.appendChild(item);

    // Когда долетела вверх — убрать из DOM
    item.addEventListener(
      "animationend",
      () => {
        // если уже в процессе клика — просто подчистим
        item.remove();
      },
      { once: true }
    );
  }

  function clearActivationTimer() {
    if (activationTimerId) window.clearTimeout(activationTimerId);
    activationTimerId = null;
  }

  function clearSpawnTimer() {
    if (spawnTimerId) window.clearTimeout(spawnTimerId);
    spawnTimerId = null;
  }

  function scheduleActivation() {
    if (isActive) return;
    clearActivationTimer();
    const remaining = activationAtMs - Date.now();
    if (remaining <= 0) {
      activate();
      return;
    }
    activationTimerId = window.setTimeout(() => {
      activationTimerId = null;
      activate();
    }, remaining);
  }

  function scheduleNextSpawn() {
    if (!isActive) return;
    clearSpawnTimer();

    const now = Date.now();
    const intervalMs = getSpawnIntervalMs();
    if (nextSpawnAtMs == null) nextSpawnAtMs = now + intervalMs;

    let remaining = nextSpawnAtMs - now;

    // Важно: когда вкладка была скрыта, таймеры могут "догнать" и выстрелить пачкой.
    // Мы не догоняем, а спавним максимум ОДНУ картинку и пересобираем расписание.
    if (remaining <= 0) {
      spawnOne();
      nextSpawnAtMs = now + intervalMs;
      remaining = intervalMs;
    }

    spawnTimerId = window.setTimeout(() => {
      spawnTimerId = null;
      spawnOne();
      nextSpawnAtMs = Date.now() + getSpawnIntervalMs();
      scheduleNextSpawn();
    }, remaining);
  }

  function activate() {
    if (isActive) return;
    isActive = true;

    // можно сразу заспавнить первую картинку
    spawnOne();
    nextSpawnAtMs = Date.now() + getSpawnIntervalMs();
    scheduleNextSpawn();
  }

  function pause() {
    if (isPaused) return;
    isPaused = true;
    clearActivationTimer();
    clearSpawnTimer();
  }

  function resume() {
    if (!isPaused) return;
    isPaused = false;

    // Не догоняем пачками — максимум один spawn в scheduleNextSpawn()
    if (isActive) scheduleNextSpawn();
    else scheduleActivation();
  }

  const onVisibility = () => {
    if (typeof document === "undefined") return;
    if (document.visibilityState === "hidden") pause();
    else resume();
  };

  if (typeof document !== "undefined" && "visibilityState" in document) {
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
  }

  // стартуем расписание (учитывая, что вкладка может быть уже скрыта)
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    pause();
  } else {
    scheduleActivation();
  }

  return {
    unmount() {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibility);
      }
      clearActivationTimer();
      clearSpawnTimer();
      layer.remove();
      activationTimerId = null;
      spawnTimerId = null;
      isActive = false;
      isPaused = false;
    },
  };
}
