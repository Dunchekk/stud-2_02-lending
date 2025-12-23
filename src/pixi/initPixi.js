// src/pixi/initPixi.js
import * as PIXI from "pixi.js";

/**
 * Define <dunchek-gradient> custom element.
 * Uses PixiJS 6.2.0.
 */
export function defineDunchekGradientElement() {
  if (customElements.get("dunchek-gradient")) return;

  class DunchekGradientElement extends HTMLElement {
    static get observedAttributes() {
      return [
        "color1",
        "color2",
        "color3",
        "color4",
        "color5",
        "seed",
        "displacement",
        "noretina",
        "bgcolor",
      ];
    }

    constructor() {
      super();

      /** @type {PIXI.Application | null} */
      this._app = null;

      /** @type {PIXI.Sprite | null} */
      this._gradientSprite = null;

      /** @type {PIXI.Sprite | null} */
      this._dispSprite = null;

      /** @type {PIXI.filters.DisplacementFilter | null} */
      this._dispFilter = null;
      this._scene = null;
      this._hud = null;

      // canvases for texture generation
      this._gradCanvas = document.createElement("canvas");
      this._gradCanvas.width = 512;
      this._gradCanvas.height = 512;

      this._noiseCanvas = document.createElement("canvas");
      this._noiseCanvas.width = 512;
      this._noiseCanvas.height = 512;

      this._applyPointerXY = (x, y) => {
        const w = Math.max(1, window.innerWidth);
        const h = Math.max(1, window.innerHeight);

        const nx = Math.min(1, Math.max(0, x / w));
        const ny = Math.min(1, Math.max(0, y / h));

        // Y -> seed target [-1..1]
        this._seedTarget = -1 + ny * 2;

        // X -> displacement target [0..5]
        this._dispTarget = 0.8 + nx * 4.2; // 1..5

        this._dispNy = ny;
      };

      this._onPointerMove = (e) => {
        this._applyPointerXY(e.clientX, e.clientY);
      };

      this._onTouchStart = (e) => {
        const t = e.touches?.[0];
        if (!t) return;
        this._applyPointerXY(t.clientX, t.clientY);
      };

      this._onTouchMove = (e) => {
        const t = e.touches?.[0];
        if (!t) return;
        this._applyPointerXY(t.clientX, t.clientY);
      };

      this._onResize = () => {
        this._layoutToScreen();
        this._layoutOverlayToScreen();
      };

      this._dispCurrent = 0;
      this._dispTarget = 0;

      this._seedCurrent = this._readNumberAttr("seed", 0);
      this._seedTarget = this._seedCurrent;

      this._lastRebuildAt = 0;
      this._rebuildIntervalMs = 30; // ~14 FPS rebuild cap; raise for less CPU

      this._maskCanvas = document.createElement("canvas");
      this._maskCanvas.width = 512;
      this._maskCanvas.height = 512;
      this._maskSprite = null;

      this._overlayCanvas = document.createElement("canvas");
      this._overlayCanvas.width = 512;
      this._overlayCanvas.height = 512;
      this._overlaySprite = null;

      // --- displacement Y shift (safe) ---
      this._dispShiftY = 0;
      this._dispShiftYTarget = 0;
      this._dispShiftSmooth = 0.07;
      this._dispNy = 0.5;
      this._dispOverscanY = 3.5;
      this._dispShiftMax = 0;
      this._dispShiftAmount = 0.8;
      this._dispBaseX = 0;
      this._dispBaseY = 0;
      this._dispTextureMaxSize = 2000;
      this._bgColorHex = this._readColorAttr("bgcolor", "#000000");
    }

    connectedCallback() {
      this.style.display = "block";
      if (!this.style.height) this.style.height = "100vh";
      const isCoarsePointer =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;

      const noretina = this.getAttribute("noretina") === "true";
      const resolution = noretina
        ? 1
        : Math.max(1, window.devicePixelRatio || 1);

      this._app = new PIXI.Application({
        resizeTo: window,
        antialias: true,
        backgroundAlpha: 0,
        autoDensity: false,
        resolution,
        powerPreference: "high-performance",
      });

      this._app.view.style.width = "100%";
      this._app.view.style.height = "100%";
      this._app.view.style.display = "block";

      this.appendChild(this._app.view);

      this._scene = new PIXI.Container();
      this._hud = new PIXI.Container();
      this._app.stage.addChild(this._scene);
      this._app.stage.addChild(this._hud);

      // фон СРАЗУ, и добавляем первым
      this._bg = new PIXI.Graphics();
      this._bg.beginFill(this._bgColorHex, 1);
      this._bg.drawRect(
        0,
        0,
        this._app.renderer.width,
        this._app.renderer.height
      );
      this._bg.endFill();
      this._scene.addChild(this._bg);

      const seed = this._readNumberAttr("seed", 0);
      const disp = this._readNumberAttr("displacement", 0);

      this._seedCurrent = seed;
      this._seedTarget = seed;

      // начальные значения для сглаживания displacement
      this._dispCurrent = disp;
      this._dispTarget = disp;

      this._buildGradient(seed);
      this._buildDisplacement(seed);

      this._dispFilter = new PIXI.filters.DisplacementFilter(this._dispSprite);
      this._setDisplacementStrength(disp);
      this._gradientSprite.filters = [this._dispFilter];

      this._scene.addChild(this._gradientSprite);
      this._scene.addChild(this._dispSprite);

      this._buildEdgeMask();

      this._buildOverlayTexture();
      this._overlaySprite.alpha = 0.18;
      this._overlaySprite.blendMode = PIXI.BLEND_MODES.NORMAL;
      this._hud.addChild(this._overlaySprite);
      this._layoutOverlayToScreen();

      // ВАЖНО: убираем “плыть” displacement (никаких x/y += ...)
      // Вместо этого — лёгкий ticker только для сглаживания силы
      this._app.ticker.add(() => {
        // displacement smoothing как было
        const dispSmoothing = 0.1;
        this._dispCurrent +=
          (this._dispTarget - this._dispCurrent) * dispSmoothing;
        this._setDisplacementStrength(this._dispCurrent);

        if (this._dispSprite) {
          const ySigned = (this._dispNy - 0.5) * 2;
          this._dispShiftYTarget =
            ySigned * this._dispShiftMax * this._dispShiftAmount;

          this._dispShiftY +=
            (this._dispShiftYTarget - this._dispShiftY) * this._dispShiftSmooth;

          const clampedShift = Math.max(
            -this._dispShiftMax,
            Math.min(this._dispShiftMax, this._dispShiftY)
          );

          this._dispSprite.x = this._dispBaseX;
          this._dispSprite.y = this._dispBaseY + clampedShift;
        }

        // seed smoothing: справа (nx→1) делаем плавнее
        const nx = Math.max(0, Math.min(1, this._dispTarget / 5)); // т.к. dispTarget = nx*5
        const seedSmoothing = 0.12 + (0.03 - 0.12) * nx; // 0.12 слева → 0.03 справа
        this._seedCurrent +=
          (this._seedTarget - this._seedCurrent) * seedSmoothing;

        // пересборка градиента не чаще N мс
        const now = performance.now();
        if (now - this._lastRebuildAt >= this._rebuildIntervalMs) {
          this._lastRebuildAt = now;

          // перестраиваем ТОЛЬКО градиент (быстрее)
          this._buildGradient(this._seedCurrent, { replaceTexture: true });

          // displacement НЕ трогаем каждый раз — иначе снова рывки
          // this._buildDisplacement(this._seedCurrent, { replaceTexture: true });

          this._layoutToScreen();
        }
      });

      window.addEventListener("pointermove", this._onPointerMove, {
        passive: true,
      });
      if (isCoarsePointer) {
        window.addEventListener("touchstart", this._onTouchStart, {
          passive: true,
        });
        window.addEventListener("touchmove", this._onTouchMove, {
          passive: true,
        });
      }
      window.addEventListener("resize", this._onResize, { passive: true });

      this._layoutToScreen();
      this._layoutOverlayToScreen();
    }

    disconnectedCallback() {
      window.removeEventListener("pointermove", this._onPointerMove);
      window.removeEventListener("touchstart", this._onTouchStart);
      window.removeEventListener("touchmove", this._onTouchMove);
      window.removeEventListener("resize", this._onResize);

      if (this._app) {
        // destroy(true) also removes children textures etc; be conservative
        this._app.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
        this._app = null;
      }

      this._gradientSprite = null;
      this._dispSprite = null;
      this._dispFilter = null;
      this._scene = null;
      this._hud = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      if (!this._app) return;

      if (name === "displacement") {
        this._setDisplacementStrength(this._readNumberAttr("displacement", 0));
        return;
      }

      if (name === "seed") {
        const seed = this._readNumberAttr("seed", 0);

        // seed больше НЕ перестраивает текстуры напрямую
        // он лишь задаёт цель для плавного догоняния в ticker
        this._seedTarget = seed;

        return;
      }

      if (name === "bgcolor") {
        this._bgColorHex = this._readColorAttr("bgcolor", "#000000");
        this._layoutToScreen();
        return;
      }

      if (name.startsWith("color")) {
        const seed = this._readNumberAttr("seed", 0);
        // this._buildGradient(seed, { replaceTexture: true });
      }
    }

    // ----------------------------
    // Core behavior
    // ----------------------------

    _onPointerMove(e) {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);

      const nx = Math.min(1, Math.max(0, e.clientX / w));
      const ny = Math.min(1, Math.max(0, e.clientY / h));

      // Y -> seed target [-1..1]
      const seedFromY = -1 + ny * 2; // как было

      // зона фиксации внизу
      const lockStart = 0.9; // с 78% вниз начинаем "держать кучку"
      const lockEnd = 1.0; // у самого низа фиксируем полностью
      const lock = smoothstep(lockStart, lockEnd, ny);

      // seed, который соответствует твоей "кучке" внизу
      // обычно это почти максимум (ny≈1 => seed≈+1), но можно подстроить
      const bottomSeed = 1.0;

      this._seedTarget = lerp(seedFromY, bottomSeed, lock);

      // X -> displacement target [0..5]
      this._dispTarget = 0.8 + nx * 4.2; // 1..5

      // важно: НЕ setAttribute("seed")
      this._dispNy = ny;
    }

    _layoutToScreen() {
      if (!this._app || !this._gradientSprite) return;

      const w = this._app.renderer.width;
      const h = this._app.renderer.height;

      // Gradient: cover-fit
      const gW = this._gradientSprite.texture.width || 1;
      const gH = this._gradientSprite.texture.height || 1;
      const gScale = Math.max(w / gW, h / gH);

      const overscan = 1; // 1.1..1.4
      this._gradientSprite.scale.set(gScale * overscan);

      this._gradientSprite.x = (w - gW * gScale) / 2;
      this._gradientSprite.y = (h - gH * gScale) / 2;

      // Displacement: exactly full-screen (one block)
      if (this._dispSprite) {
        const dW = this._dispSprite.texture.width || 1;
        const dH = this._dispSprite.texture.height || 1;

        const dScaleX = w / dW;
        const dScaleY = (h * this._dispOverscanY) / dH;

        this._dispSprite.scale.set(dScaleX, dScaleY);

        const scaledH = dH * dScaleY;
        const extra = Math.max(0, scaledH - h);

        this._dispBaseX = 0;
        this._dispBaseY = -extra / 2;
        this._dispShiftMax = extra / 2;
      }

      if (this._bg) {
        this._bg.clear();
        this._bg.beginFill(this._bgColorHex, 1);
        this._bg.drawRect(0, 0, w, h);
        this._bg.endFill();
      }

      if (this._maskSprite) {
        const mW = this._maskSprite.texture.width || 1;
        const mH = this._maskSprite.texture.height || 1;
        const mScale = Math.max(w / mW, h / mH);
        this._maskSprite.scale.set(mScale);
        this._maskSprite.position.set(
          (w - mW * mScale) / 2,
          (h - mH * mScale) / 2
        );
      }
    }

    _layoutOverlayToScreen() {
      if (!this._app || !this._overlaySprite) return;
      const w = this._app.renderer.width;
      const h = this._app.renderer.height;
      this._overlaySprite.position.set(0, 0);
      this._overlaySprite.width = w;
      this._overlaySprite.height = h;
      this._overlaySprite.roundPixels = true;
    }

    _setDisplacementStrength(displacement_0_5) {
      if (!this._dispFilter) return;

      const d = Math.max(0, Math.min(5, displacement_0_5)) / 5; // 0..1

      // Нелинейность: усиливает верхний диапазон
      const shaped = Math.pow(d, 1.01);

      const maxX = 1800;
      const maxY = 500;

      this._dispFilter.scale.set(shaped * maxX, shaped * maxY);
    }

    // ----------------------------
    // Texture building
    // ----------------------------

    _buildGradient(seed, opts = {}) {
      if (!this._app) return;

      const c1 = this.getAttribute("color1") || "#0e1c3f";
      const c2 = this.getAttribute("color2") || "#23418a";
      const c3 = this.getAttribute("color3") || "#aadfd9";
      const c4 = this.getAttribute("color4") || "#e64f0f";
      const c5 = this.getAttribute("color5") || "#000000";

      const ctx = this._gradCanvas.getContext("2d", {
        willReadFrequently: false,
      });
      const W = this._gradCanvas.width;
      const H = this._gradCanvas.height;

      // seed in [-1..1] -> t in [0..1]
      const t = (seed + 1) / 2;

      // 1) Направление градиента (делаем заметный поворот)
      const angle = seed * (Math.PI / 5); // ±5°

      const len = Math.sqrt(W * W + H * H);
      const cx = W / 2;
      const cy = H / 2;

      const nx = Math.cos(angle);
      const ny = Math.sin(angle);

      // 2) Небольшой сдвиг линии градиента (перпендикулярно направлению)
      const px = -ny;
      const py = nx;
      const offsetAmt = (t - 0.5) * (len * 0.24); // -12%..+12% диагонали
      const ox = px * offsetAmt;
      const oy = py * offsetAmt;

      const half = len * 0.55;
      const x0 = cx - nx * half + ox;
      const y0 = cy - ny * half + oy;
      const x1 = cx + nx * half + ox;
      const y1 = cy + ny * half + oy;

      const g = ctx.createLinearGradient(x0, y0, x1, y1);

      // 3) “Чуть” сдвигаем цветовые стопы (но заметнее, чем было)
      const wobble = 0.2; // стабильнее, меньше дерганий

      // c5 занимает большой хвост справа: ~30% (0.70..1.00)
      let s1 = 0.05 + wobble * (t - 0.5) * 0.6;
      let s2 = 0.24 + wobble * (0.5 - t) * 0.7;
      let s3 = 0.5 + wobble * (t - 0.5) * 0.8;

      // узкий переход к краевому цвету
      let s4 = 0.7 + wobble * (t - 0.5) * 0.35;

      // край
      let s5 = 1.0;

      // гарантируем порядок
      s1 = clamp01(s1);
      s2 = Math.max(s1 + 0.001, clamp01(s2));
      s3 = Math.max(s2 + 0.001, clamp01(s3));
      s4 = Math.max(s3 + 0.001, clamp01(s4));
      s5 = Math.max(s4 + 0.001, clamp01(s5));

      g.addColorStop(s1, c1);
      g.addColorStop(s2, c2);
      g.addColorStop(s3, c3);
      g.addColorStop(s4, c4);
      g.addColorStop(s5, c5);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // grain вынесен в overlay (статичный), чтобы не "дрожал" при повороте/пересборке

      // ВАЖНО: в Pixi 6 canvas-текстуру нужно обновлять через baseTexture.update()
      if (!this._gradientSprite) {
        const base = PIXI.BaseTexture.from(this._gradCanvas);
        const tex = new PIXI.Texture(base);
        this._gradientSprite = new PIXI.Sprite(tex);
        this._gradientSprite.anchor.set(0, 0);
      } else {
        this._gradientSprite.texture.baseTexture.update();
      }
    }

    _buildEdgeMask() {
      const c = this._maskCanvas;
      const ctx = c.getContext("2d");
      const W = c.width,
        H = c.height;

      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        W * 0.18,
        W / 2,
        H / 2,
        W * 0.58
      );
      g.addColorStop(0.0, "rgba(255,255,255,1)"); //-------------------------------
      g.addColorStop(0.5, "rgba(255,255,255,1)");
      g.addColorStop(1.0, "rgba(255,255,255,0)");

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (!this._maskSprite) {
        const base = PIXI.BaseTexture.from(c);
        const tex = new PIXI.Texture(base);
        this._maskSprite = new PIXI.Sprite(tex);
        this._maskSprite.anchor.set(0, 0);

        this._gradientSprite.mask = this._maskSprite;
        if (this._scene) {
          this._scene.addChild(this._maskSprite);
        } else {
          this._app.stage.addChild(this._maskSprite);
        }
      } else {
        this._maskSprite.texture.baseTexture.update();
      }
    }

    _buildOverlayTexture() {
      const c = this._overlayCanvas;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      const W = c.width;
      const H = c.height;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.01)";
      ctx.fillRect(0, 0, W, H);
      addGrain(ctx, W, H, seededRng(1337));

      if (!this._overlaySprite) {
        const base = PIXI.BaseTexture.from(c);
        base.wrapMode = PIXI.WRAP_MODES.CLAMP;
        base.scaleMode = PIXI.SCALE_MODES.LINEAR;
        const tex = new PIXI.Texture(base);
        this._overlaySprite = new PIXI.Sprite(tex);
        this._overlaySprite.anchor.set(0, 0);
      } else {
        this._overlaySprite.texture.baseTexture.update();
      }
    }

    _buildDisplacement(seed, opts = {}) {
      if (!this._app) return;

      // Генерим displacement под размер экрана, но с ограничением, чтобы не лагало
      const rw = this._app.renderer.width;
      const rh = this._app.renderer.height;

      const maxSize = this._dispTextureMaxSize || 1400;
      const scale = Math.min(1, maxSize / Math.max(rw, rh));

      const W = Math.max(256, Math.floor(rw * scale));
      const H = Math.max(256, Math.floor(rh * scale));

      // если размер поменялся — пересоздаём canvas
      if (this._noiseCanvas.width !== W || this._noiseCanvas.height !== H) {
        this._noiseCanvas.width = W;
        this._noiseCanvas.height = H;
      }

      const ctx = this._noiseCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      const rng = seededRng(50000 + Math.floor((seed + 1) * 100000));
      const img = ctx.createImageData(W, H);

      // Частоты можно сделать ниже, чтобы блоки были крупнее
      const t = (seed + 1) / 2; // 0..1
      const f1 = 0.8 + 1.2 * t; // 0.8..2.0
      const f2 = 0.8 + 1.2 * (1 - t); // 0.8..2.0
      const phase = rng() * Math.PI * 2;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;

          const texScale = 1; // 1.5..5 (больше = мельче)
          const nx = (x / W) * texScale;
          const ny = (y / H) * texScale;

          const v1 = Math.sin((nx * f1 + ny * 0.7 * f1) * Math.PI * 2 + phase);
          const v2 = Math.cos(
            (ny * f2 - nx * 0.6 * f2) * Math.PI * 2 - phase * 0.7
          );

          const v = (v1 * 0.9 + v2 * 0.1) * 0.5 + 0.5;

          const r = clamp01(v + (rng() - 0.5) * 0.12);
          const g = clamp01(1 - v + (rng() - 0.5) * 0.12);

          img.data[i + 0] = (r * 255) | 0;
          img.data[i + 1] = (g * 255) | 0;
          img.data[i + 2] = 128;
          img.data[i + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);

      if (!this._dispSprite) {
        const base = PIXI.BaseTexture.from(this._noiseCanvas);

        // IMPORTANT: никакого REPEAT -> один блок
        base.wrapMode = PIXI.WRAP_MODES.CLAMP;

        // сглаживание при растяжении
        base.scaleMode = PIXI.SCALE_MODES.LINEAR;

        const tex = new PIXI.Texture(base);
        this._dispSprite = new PIXI.Sprite(tex);
        this._dispSprite.anchor.set(0, 0);
        this._dispSprite.alpha = 0;
      } else {
        const base = this._dispSprite.texture.baseTexture;
        base.wrapMode = PIXI.WRAP_MODES.CLAMP;
        base.scaleMode = PIXI.SCALE_MODES.LINEAR;
        base.update();
      }
    }

    // ----------------------------
    // Helpers
    // ----------------------------

    _readNumberAttr(name, fallback) {
      const v = Number(this.getAttribute(name));
      return Number.isFinite(v) ? v : fallback;
    }

    _readColorAttr(name, fallback) {
      const attr = this.getAttribute(name);
      const fallbackColor = typeof fallback === "string" ? fallback : "#000000";
      const candidate =
        typeof attr === "string" && attr.trim().length > 0
          ? attr.trim()
          : fallbackColor;
      return this._parseHexColor(candidate, fallbackColor);
    }

    _parseHexColor(value, fallback) {
      const base = typeof fallback === "string" ? fallback : "#000000";
      const normalized = typeof value === "string" ? value : base;
      try {
        return PIXI.utils.string2hex(normalized);
      } catch (err) {
        try {
          return PIXI.utils.string2hex(base);
        } catch {
          return 0x000000;
        }
      }
    }
  }

  customElements.define("dunchek-gradient", DunchekGradientElement);
}

// ---------- util functions ----------
function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function seededRng(seed) {
  // Mulberry32
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function addGrain(ctx, w, h, rng) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  // very subtle noise
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * 8; // [-4..4]
    d[i + 0] = Math.max(0, Math.min(255, d[i + 0] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
