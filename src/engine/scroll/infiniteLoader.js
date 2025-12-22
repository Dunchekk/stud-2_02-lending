import blockTypes from "../../data/blockTypes.json";
import { resolveSection } from "./../resolveSection.js";
import { renderSection } from "../../renderers/index.js";

export function createInfiniteLoader(opts) {
  const {
    feed,
    batchSize = 6,

    // Сколько секций держим вокруг viewport
    bufferAbove = 3, // ты просил: чтобы сверху оставалось несколько секций
    bufferBelow = 12, // запас снизу, чтобы не мелькало при докрутке

    // Порог догрузки
    nearBottomPx = 900,

    // Не генерировать эти типы
    excludeTypes = ["hero-block"],

    // Защитить hero от удаления
    protectHero = true,

    // Не ставить одинаковый type ближе чем через 2 секции
    minDistance = 2,
  } = opts ?? {};

  if (!(feed instanceof HTMLElement)) {
    throw new Error("createInfiniteLoader: feed must be HTMLElement");
  }

  const allTypes = Object.keys(blockTypes);
  const eligibleTypes = allTypes.filter((t) => !excludeTypes.includes(t));
  if (!eligibleTypes.length) {
    throw new Error("createInfiniteLoader: no eligible types to generate");
  }

  let appendedBatches = 0;
  let isEnabled = false;
  let rafPending = false;

  const recentTypes = [];
  const lastVariantByType = new Map();

  hydrateRecentTypesFromDom();

  function hydrateRecentTypesFromDom() {
    const nodes = getSectionNodes();
    const tail = nodes.slice(-minDistance);
    for (const el of tail) {
      const t = el?.dataset?.sectionType;
      if (t) recentTypes.push(t);
    }
    while (recentTypes.length > minDistance) recentTypes.shift();
  }

  function getSectionNodes() {
    return Array.from(feed.children);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function canUseType(type) {
    return !recentTypes.includes(type);
  }

  function pickType() {
    const MAX_TRIES = 50;
    for (let i = 0; i < MAX_TRIES; i += 1) {
      const t = pickRandom(eligibleTypes);
      if (canUseType(t)) return t;
    }
    // fallback (если типов мало)
    return pickRandom(eligibleTypes);
  }

  function pickVariantForType(type) {
    const def = blockTypes[type];
    const variants = Array.isArray(def?.variants) ? def.variants : [];
    if (!variants.length) return undefined;

    // первый добавленный батч: любой кроме первого варианта, если возможно
    const excludeFirstVariant = appendedBatches === 0;
    let pool = variants.slice();
    if (excludeFirstVariant && pool.length > 1) pool = pool.slice(1);

    // один и тот же variant для одного типа не может идти подряд
    const lastVar = lastVariantByType.get(type);
    if (pool.length > 1 && lastVar != null) {
      const filtered = pool.filter((v) => v !== lastVar);
      if (filtered.length) pool = filtered;
    }

    const chosen = pickRandom(pool);
    lastVariantByType.set(type, chosen);
    return chosen;
  }

  function pushRecentType(type) {
    recentTypes.push(type);
    while (recentTypes.length > minDistance) recentTypes.shift();
  }

  function makeSectionSpec(type) {
    return { type, variant: pickVariantForType(type), props: {} };
  }

  function appendBatch() {
    const frag = document.createDocumentFragment();

    for (let i = 0; i < batchSize; i += 1) {
      const type = pickType();
      const spec = makeSectionSpec(type);

      const resolved = resolveSection(spec);
      const node = renderSection(resolved);

      frag.appendChild(node);
      pushRecentType(type);
    }

    feed.appendChild(frag);
    appendedBatches += 1;

    // ВАЖНО: тримим "умно", относительно viewport и с якорем
    trimTopSmart();
  }

  function isNearBottom() {
    const scroller = document.scrollingElement || document.documentElement;
    const remaining =
      scroller.scrollHeight - (scroller.scrollTop + window.innerHeight);
    return remaining < nearBottomPx;
  }

  // ---- SMART TRIM ----

  function findFirstVisibleIndex(nodes) {
    const topLine = 0; // можно сделать 1–8px, но 0 ок
    for (let i = 0; i < nodes.length; i += 1) {
      const r = nodes[i].getBoundingClientRect();
      // элемент "не полностью выше экрана"
      if (r.bottom > topLine) return i;
    }
    return Math.max(0, nodes.length - 1);
  }

  function trimTopSmart() {
    const nodes = getSectionNodes();
    if (nodes.length === 0) return;

    const firstVisible = findFirstVisibleIndex(nodes);

    // сколько хотим держать вокруг текущей позиции
    const desiredMin = Math.max(0, firstVisible - bufferAbove);
    const desiredMax = Math.min(nodes.length, firstVisible + bufferBelow);

    // если DOM ещё не разросся — не трогаем
    // Трим имеет смысл, когда сверху есть что резать (больше чем bufferAbove)
    if (desiredMin <= 0) return;

    // если hero защищаем, не удаляем его (обычно он nodes[0])
    let cutFrom = 0;
    if (protectHero && nodes[0]?.dataset?.sectionType === "hero-block") {
      cutFrom = 1;
    }

    const cutTo = desiredMin; // удаляем [cutFrom, cutTo)
    if (cutTo <= cutFrom) return;

    // Якорь: берем элемент, который останется и находится близко к верху viewport
    // Лучше всего сам firstVisible (он точно должен остаться)
    const anchor = nodes[firstVisible];
    if (!anchor || !anchor.isConnected) return;

    const anchorTopBefore = anchor.getBoundingClientRect().top;

    // Удаляем далеко сверху
    for (let i = cutFrom; i < cutTo; i += 1) {
      nodes[i].remove();
    }

    // Компенсация не по сумме высот, а по якорю (самый незаметный способ)
    const anchorTopAfter = anchor.getBoundingClientRect().top;
    const delta = anchorTopAfter - anchorTopBefore;

    // Возвращаем anchor на прежнее место в viewport
    // (если delta > 0, якорь "опустился" — надо проскроллить вниз; если delta < 0 — вверх)
    window.scrollBy(0, delta);

    // Дополнительно можно подрезать "снизу", если DOM стал огромным
    // Но обычно bufferBelow достаточно.
    trimBottomIfNeeded(desiredMax);
  }

  function trimBottomIfNeeded(desiredMax) {
    // Удаляем лишнее снизу, если по какой-то причине сильно разрослось
    const nodes = getSectionNodes();
    const maxKeep = (bufferAbove + bufferBelow + 6) * 2; // безопасный потолок
    if (nodes.length <= maxKeep) return;

    // оставим до desiredMax + небольшой хвост
    const keepTo = Math.min(nodes.length, desiredMax + 6);
    for (let i = nodes.length - 1; i >= keepTo; i -= 1) {
      nodes[i].remove();
    }
  }

  // ---- EVENTS ----

  function onScroll() {
    if (!isEnabled) return;
    if (rafPending) return;
    rafPending = true;

    requestAnimationFrame(() => {
      rafPending = false;
      if (isNearBottom()) appendBatch();
    });
  }

  function enable() {
    if (isEnabled) return;
    isEnabled = true;
    window.addEventListener("scroll", onScroll, { passive: true });

    // если страница короткая — заполнить
    if (isNearBottom()) appendBatch();
  }

  function disable() {
    if (!isEnabled) return;
    isEnabled = false;
    window.removeEventListener("scroll", onScroll);
  }

  return {
    enable,
    disable,
    appendBatch,
  };
}
