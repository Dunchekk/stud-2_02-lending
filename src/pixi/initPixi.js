// ./add-layers/initPixi.js
import { Application, Mesh, MeshGeometry, Shader } from "pixi.js";

let lastInstance = null;

export function getPixiGradient() {
  return lastInstance;
}

export function definePixiGradientElement() {
  if (customElements.get("ll-pixi-gradient")) return;

  class LLPixiGradientElement extends HTMLElement {
    constructor() {
      super();

      this._app = null;
      this._mesh = null;
      this._shader = null;
      this._raf = null;

      this._mouseTarget = { x: 0.5, y: 0.5 };
      this._mouse = { x: 0.5, y: 0.5 };
      this._time = 0;

      this._onPointerMove = this._onPointerMove.bind(this);
      this._onResize = this._onResize.bind(this);
      this.setTheme = this.setTheme.bind(this);
    }

    connectedCallback() {
      this._initPixi();

      window.addEventListener("pointermove", this._onPointerMove, {
        passive: true,
      });
      window.addEventListener("resize", this._onResize, { passive: true });

      const t = (
        this.dataset.theme ||
        this.getAttribute("data-theme") ||
        "blue"
      ).trim();
      this.setTheme(t);

      lastInstance = this;
    }

    disconnectedCallback() {
      window.removeEventListener("pointermove", this._onPointerMove);
      window.removeEventListener("resize", this._onResize);

      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;

      if (this._app) this._app.destroy(true);
      this._app = null;
      this._mesh = null;
      this._shader = null;

      if (lastInstance === this) lastInstance = null;
    }

    async _initPixi() {
      const width = Math.max(1, this.clientWidth || window.innerWidth);
      const height = Math.max(1, this.clientHeight || window.innerHeight);

      this._app = new Application();
      await this._app.init({
        width,
        height,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        powerPreference: "high-performance",
      });

      this.appendChild(this._app.canvas);
      this._app.canvas.style.width = "100%";
      this._app.canvas.style.height = "100%";
      this._app.canvas.style.display = "block";

      this._buildScene();
      this._onResize();
      this._start();
    }

    _buildScene() {
      const w = this._app.renderer.width;
      const h = this._app.renderer.height;

      // Квад в локальных координатах меша (центр в 0,0)
      const positions = new Float32Array([
        -w / 2,
        -h / 2,
        w / 2,
        -h / 2,
        w / 2,
        h / 2,
        -w / 2,
        h / 2,
      ]);

      const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

      const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);

      const geometry = new MeshGeometry({ positions, uvs, indices });

      // Вершинный шейдер под Pixi v8 (с матрицами сцены)
      const vertex = `
        in vec2 aPosition;
        in vec2 aUV;
        out vec2 vUV;

        uniform mat3 uProjectionMatrix;
        uniform mat3 uWorldTransformMatrix;
        uniform mat3 uTransformMatrix;

        void main() {
          mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
          vec3 pos = mvp * vec3(aPosition, 1.0);
          gl_Position = vec4(pos.xy, 0.0, 1.0);
          vUV = aUV;
        }
      `;

      // Фрагмент: 5 опорных точек + 5 цветов, mouse parallax по Y, blur по X
      const fragment = `
        precision highp float;

        in vec2 vUV;

        uniform vec2  uResolution;
        uniform vec2  uMouse; // 0..1
        uniform float uTime;
        uniform float uBlur;

        uniform vec2 uP0;
        uniform vec2 uP1;
        uniform vec2 uP2;
        uniform vec2 uP3;
        uniform vec2 uP4;

        uniform vec3 uC0;
        uniform vec3 uC1;
        uniform vec3 uC2;
        uniform vec3 uC3;
        uniform vec3 uC4;

        float hash(vec2 p){
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 34.345);
          return fract(p.x * p.y);
        }

        float blob(vec2 uv, vec2 p, float k, float blur){
          float d = distance(uv, p);
          float expo = mix(2.2, 1.1, blur);
          return exp(-pow(d * k, expo));
        }

        void main() {
          vec2 uv = vUV;

          float depth = smoothstep(0.0, 1.0, uv.y);
          vec2 m = uMouse - vec2(0.5);
          vec2 parallax = m * (0.06 + 0.18 * depth);

          vec2 drift = vec2(
            sin(uTime * 0.12) * 0.015,
            cos(uTime * 0.10) * 0.015
          );

          float kBase = mix(3.2, 2.2, uBlur);

          vec2 p0 = uP0 + parallax + drift;
          vec2 p1 = uP1 + parallax + drift;
          vec2 p2 = uP2 + parallax + drift;
          vec2 p3 = uP3 + parallax + drift;
          vec2 p4 = uP4 + parallax + drift;

          float w0 = blob(uv, p0, kBase, uBlur);
          float w1 = blob(uv, p1, kBase, uBlur);
          float w2 = blob(uv, p2, kBase, uBlur);
          float w3 = blob(uv, p3, kBase, uBlur);
          float w4 = blob(uv, p4, kBase, uBlur);

          float wSum = max(w0 + w1 + w2 + w3 + w4, 1e-4);

          vec3 col = (uC0*w0 + uC1*w1 + uC2*w2 + uC3*w3 + uC4*w4) / wSum;

          float n = hash(uv * (uResolution / 2.0) + uTime * 0.02);
          col += (n - 0.5) * 0.025;

          vec2 c = uv - 0.5;
          float vign = 1.0 - smoothstep(0.35, 0.85, dot(c, c));
          col *= mix(0.92, 1.05, vign);

          gl_FragColor = vec4(col, 1.0);
        }
      `;

      // ресурсы/униформы v8 (группа любая; назвал "g")
      this._shader = Shader.from({
        gl: { vertex, fragment },
        resources: {
          g: {
            uResolution: { value: [w, h], type: "vec2<f32>" },
            uMouse: { value: [0.5, 0.5], type: "vec2<f32>" },
            uTime: { value: 0, type: "f32" },
            uBlur: { value: 0.6, type: "f32" },

            uP0: { value: [0.2, 0.2], type: "vec2<f32>" },
            uP1: { value: [0.8, 0.18], type: "vec2<f32>" },
            uP2: { value: [0.55, 0.55], type: "vec2<f32>" },
            uP3: { value: [0.18, 0.82], type: "vec2<f32>" },
            uP4: { value: [0.82, 0.8], type: "vec2<f32>" },

            // дефолт — заменим setTheme()
            uC0: { value: [0.18, 0.34, 0.43], type: "vec3<f32>" },
            uC1: { value: [0.46, 0.49, 0.67], type: "vec3<f32>" },
            uC2: { value: [0.45, 0.69, 0.85], type: "vec3<f32>" },
            uC3: { value: [0.53, 0.8, 0.78], type: "vec3<f32>" },
            uC4: { value: [0.4, 0.6, 0.63], type: "vec3<f32>" },
          },
        },
      });

      this._mesh = new Mesh({ geometry, shader: this._shader });
      // центрируем меш в экран
      this._mesh.position.set(w / 2, h / 2);

      this._app.stage.addChild(this._mesh);
    }

    _start() {
      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        if (!this._shader) return;

        const g = this._shader.resources.g;

        // мягкая интерполяция мыши
        const lerp = 0.08;
        this._mouse.x += (this._mouseTarget.x - this._mouse.x) * lerp;
        this._mouse.y += (this._mouseTarget.y - this._mouse.y) * lerp;

        // blur растёт от горизонтального отклонения
        const xAmp = Math.min(1, Math.abs(this._mouse.x - 0.5) * 2);
        const blur = 0.35 + 0.55 * xAmp;

        this._time += 1 / 60;

        g.uMouse.value = [this._mouse.x, this._mouse.y];
        g.uTime.value = this._time;
        g.uBlur.value = blur;
      };

      tick();
    }

    _onPointerMove(e) {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      this._mouseTarget.x = Math.min(1, Math.max(0, e.clientX / w));
      this._mouseTarget.y = Math.min(1, Math.max(0, e.clientY / h));
    }

    _onResize() {
      if (!this._app || !this._shader || !this._mesh) return;

      const width = Math.max(1, this.clientWidth || window.innerWidth);
      const height = Math.max(1, this.clientHeight || window.innerHeight);

      this._app.renderer.resize(width, height);

      // обновить геометрию квадра под новый экран
      const geom = this._mesh.geometry;
      geom.positions = new Float32Array([
        -width / 2,
        -height / 2,
        width / 2,
        -height / 2,
        width / 2,
        height / 2,
        -width / 2,
        height / 2,
      ]);

      this._mesh.position.set(width / 2, height / 2);

      // обновить resolution uniform
      this._shader.resources.g.uResolution.value = [width, height];
    }

    setTheme(themeName) {
      if (!this._shader) return;

      const theme = getThemeFromCSS(themeName);
      if (!theme) return;

      const g = this._shader.resources.g;

      // 5 цветов
      g.uC0.value = theme.colors[0];
      g.uC1.value = theme.colors[1];
      g.uC2.value = theme.colors[2];
      g.uC3.value = theme.colors[3];
      g.uC4.value = theme.colors[4];

      this.dataset.theme = themeName;
    }
  }

  customElements.define("ll-pixi-gradient", LLPixiGradientElement);
}

function getThemeFromCSS(themeName) {
  const styles = getComputedStyle(document.documentElement);

  const THEMES = {
    blue: [
      "--ll-color-blue-1",
      "--ll-color-blue-2",
      "--ll-color-blue-3",
      "--ll-color-blue-4",
      "--ll-color-blue-5",
    ],
    purp: [
      "--ll-color-purp-1",
      "--ll-color-purp-2",
      "--ll-color-purp-3",
      "--ll-color-purp-4",
      "--ll-color-purp-5",
    ],
    pink: [
      "--ll-color-pink-1",
      "--ll-color-pink-2",
      "--ll-color-pink-3",
      "--ll-color-pink-4",
      "--ll-color-pink-5",
    ],
  };

  const keys = THEMES[themeName];
  if (!keys) return null;

  const colors = keys
    .map((k) => styles.getPropertyValue(k).trim())
    .map(hexToRGB01);
  if (colors.some((c) => !c)) return null;

  return { name: themeName, colors };
}

function hexToRGB01(hex) {
  const h = (hex || "").replace("#", "").trim();
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return [r / 255, g / 255, b / 255];
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return [r / 255, g / 255, b / 255];
  }
  return null;
}
