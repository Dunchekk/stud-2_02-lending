// src/layers/mountGoTouchGrassLayer.js

// === УДОБНЫЕ КОНСТАНТЫ (меняй тут) ===
export const GTG_CONFIG = {
  ACTIVATION_DELAY_MS: 60_000, // через сколько включать слой
  SPAWN_INTERVAL_MS: 27_000, // как часто спавнить картинку
  FLOAT_DURATION_MS: 25_000, // сколько плывёт одна картинка вверх (linear)

  MAX_WIDTH_VW: 50, // максимум ширины картинки
  MIN_WIDTH_VW: 35, // минимум ширины картинки (можно 0, если хочешь совсем рандом)

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

/**
 * Монтирует слой поверх всего.
 * @param {{ mountTo?: HTMLElement }} [opts]
 * @returns {{ unmount: () => void }}
 */
export function mountGoTouchGrassLayer(opts = {}) {
  const mountTo = opts.mountTo ?? document.body;

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

    // Размер (vw) — отдельно, чтобы легко крутить
    const w = rand(GTG_CONFIG.MIN_WIDTH_VW, GTG_CONFIG.MAX_WIDTH_VW);
    item.style.setProperty("--gtg-w", `${w}vw`);

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

  function activate() {
    if (isActive) return;
    isActive = true;

    // можно сразу заспавнить первую картинку
    spawnOne();

    spawnTimerId = window.setInterval(() => {
      spawnOne();
    }, GTG_CONFIG.SPAWN_INTERVAL_MS);
  }

  activationTimerId = window.setTimeout(() => {
    activate();
  }, GTG_CONFIG.ACTIVATION_DELAY_MS);

  return {
    unmount() {
      if (activationTimerId) window.clearTimeout(activationTimerId);
      if (spawnTimerId) window.clearInterval(spawnTimerId);
      layer.remove();
      activationTimerId = null;
      spawnTimerId = null;
      isActive = false;
    },
  };
}
