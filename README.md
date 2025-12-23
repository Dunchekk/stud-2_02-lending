# Landing (Vite + Pixi.js)

Одностраничный лендинг с бесконечной лентой секций (`feed`), фиксированным интро‑градиентом (Pixi.js) и отдельным текстовым слоем (`textLayer`) поверх контента.

## Быстрый старт

```bash
npm i
npm run dev
```

Сборка в статик (в папку `docs/`, удобно для GitHub Pages):

```bash
npm run build
npm run preview
```

## Как устроено (кратко)

- **Feed (лента секций)** — это `#feed` внутри `#app`. Он скроллится как обычная страница.
- **Gradient layer** — кастомный элемент `<dunchek-gradient>` (Pixi.js), монтируется в `document.body`, всегда “под” контентом и не скроллится вместе с лентой.
- **Text layer** — `section.tl` поверх всего, не скроллится целиком; на мобилках скроллится только центральный контент внутри него (стрелки/навигация остаются видимыми).
- **Infinite loader** — докидывает секции внизу и умно подрезает сверху так, чтобы скролл не “прыгал”.
- **Go‑touch‑grass layer** — отдельный фиксированный оверлей со “всплывающими” картинками, которые можно кликать/закрывать.
- **Темы / режимы** — `themeSwapper` + `popupMode` управляют темами, состояниями и отдельными интерактивными режимами (в т.ч. “erase”).

Точка входа и порядок монтирования: `src/main.js`.

## Где что лежит

### Данные

- `src/data/page.json` — структура секций (какие блоки идут и в каком порядке).
- `src/data/blockTypes.json` — список типов блоков и их варианты (для бесконечной генерации).
- `src/data/contentVariants.json` — контент‑варианты для блоков (тексты/картинки).
- `src/data/textLayer.json` — контент и логика текстового слоя.

### Рендер секций

- `src/engine/mount.js` — монтирует секции по спецификациям.
- `src/engine/resolveSection.js` — нормализует/резолвит `spec -> section`.
- `src/renderers/*` — рендеры конкретных блоков по `type` (реестр: `src/renderers/index.js`).
- `src/engine/scroll/infiniteLoader.js` — бесконечная лента + smart trim.

### Слои (поверх/под лентой)

- `src/add-layers/mountLendingLayer.js` — монтирует `<dunchek-gradient>` (Pixi.js).
- `src/pixi/initPixi.js` — определение кастомного элемента и обработка pointer/touch событий.
- `src/add-layers/mountTextLayer.js` — текстовый слой поверх `feed`.
- `src/add-layers/mountGoTouchGrassLayer.js` — слой с “плавающими” картинками.

### Стили

Подключаются в `src/main.js` (важно: адаптив подключается последним).

- `src/styles/global.css` — базовая разметка, переменные, общие стили.
- `src/styles/blocks.css` — стили секций ленты (`feed`).
- `src/styles/layers.css` — стили слоёв (go‑touch‑grass и др.).
- `src/styles/cursor.css` — курсор/erase‑режим.
- `src/styles/adaptiveStat.css` — все медиа‑запросы/адаптивы (подключён последним).

### Ассеты

- `src/assets/fonts/*` — шрифты.
- `src/assets/imgs/lend/*` — картинки лендинга.
- `src/assets/imgs/go_touch_grass/*` — картинки для go‑touch‑grass слоя (подтягиваются через `import.meta.glob`).
- `public/fav.jpg` — favicon (подключён в `index.html`).

## Схемка папок

```
.
├─ index.html
├─ vite.config.js            # сборка в docs/, base "./"
├─ public/
│  └─ fav.jpg
├─ docs/                     # output vite build (production)
└─ src/
   ├─ main.js                # точка входа: стили + монтирование слоёв/ленты
   ├─ data/                  # контент и структура
   ├─ renderers/             # рендеры секций (по type)
   ├─ engine/                # монтирование + infinite scroll
   ├─ add-layers/            # фиксированные слои (gradient/text/go-touch-grass)
   ├─ pixi/                  # Pixi.js / custom element
   ├─ styles/                # CSS (включая адаптив)
   └─ assets/                # исходные изображения/шрифты
```

## Технические особенности

- **Pixi.js как “фон”**: градиент — отдельный WebGL слой, не зависит от DOM‑скролла.
- **Mobile‑friendly units**: в адаптиве используются `dvw/dvh` там, где важно поведение на мобилках.
- **Data‑driven**: порядок секций и вариативность задаются JSON‑данными, а рендер — через реестр рендереров.
- **Smart trim**: верхние секции удаляются с компенсацией скролла по “якорю”, чтобы не было резких скачков.

