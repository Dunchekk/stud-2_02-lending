// src/engine/variantPicker.js

import contentVariants from "../data/contentVariants.json";

/**
 * Выбор варианта контента для секции (используется resolveSection.js)
 * @param {string} type
 * @param {string | undefined} preferredVariant
 */
export function pickVariant(type, preferredVariant) {
  const variants = contentVariants?.[type];
  if (!variants) {
    throw new Error(`contentVariants: no entry for type "${type}"`);
  }

  if (preferredVariant && variants[preferredVariant]) {
    return { variant: preferredVariant, content: variants[preferredVariant] };
  }

  const keys = Object.keys(variants);
  if (keys.length === 0) {
    throw new Error(`contentVariants: type "${type}" has no variants`);
  }

  const variant = keys[Math.floor(Math.random() * keys.length)];
  return { variant, content: variants[variant] };
}

/* -------------------------------------------------------------------------- */
/*  Новый рандом порядка секций (используется main.js до mountSections)        */
/* -------------------------------------------------------------------------- */

/**
 * Единственное исключение по вероятностям: stat-block выпадает реже.
 * Все остальные типы равновероятны.
 */
const TYPE_WEIGHTS = {
  "stat-block": 0.4,
};

/**
 * Правило: два одинаковых type не могут появляться ближе, чем через 3 других блока.
 * То есть: X ... (минимум 3 НЕ-X) ... X
 */
const MIN_DISTANCE = 3;

function isAllowed(type, lastTypes) {
  // lastTypes хранит последние MIN_DISTANCE типов
  return !lastTypes.includes(type);
}

function weightedPick(items) {
  // делаем "мешок" без приоритетов, кроме stat-block
  const bag = [];
  for (const item of items) {
    const w = TYPE_WEIGHTS[item.type] ?? 1;
    // дискретизируем вес (достаточно, чтобы stat-block был реже)
    const count = Math.max(1, Math.round(w * 10));
    for (let i = 0; i < count; i++) bag.push(item);
  }
  return bag[Math.floor(Math.random() * bag.length)];
}

/**
 * Пересобирает порядок sections, соблюдая дистанцию по одинаковым type.
 * Никаких приоритетов по типам, кроме редкости stat-block.
 *
 * @param {Array<{type:string, [key:string]:any}>} sections
 */
export function buildRandomSections(sections) {
  if (!Array.isArray(sections)) return sections;

  // hero оставляем на месте (обычно первый) — чтобы не разрушать структуру.
  // Если тебе нужно рандомить и hero-тип (кроме контента) — скажи, но это обычно не нужно.
  const heroIndex = sections.findIndex((s) => s?.type === "hero-block");

  const fixed = [];
  const pool = [];

  sections.forEach((s, idx) => {
    if (idx === heroIndex) fixed.push({ idx, section: s });
    else pool.push(s);
  });

  const result = new Array(sections.length);
  fixed.forEach(({ idx, section }) => (result[idx] = section));

  const lastTypes = [];
  let safety = 0;
  const SAFETY_LIMIT = 5000;

  for (let i = 0; i < sections.length; i++) {
    if (result[i]) continue; // место занято фиксированным (hero)

    safety++;
    if (safety > SAFETY_LIMIT) {
      // если вдруг невозможно уложиться (редко), возвращаем как было
      return sections;
    }

    const candidate = weightedPick(pool);

    if (!isAllowed(candidate.type, lastTypes)) {
      // нарушает дистанцию — пробуем заново
      i--;
      continue;
    }

    result[i] = candidate;

    lastTypes.push(candidate.type);
    if (lastTypes.length > MIN_DISTANCE) lastTypes.shift();
  }

  return result;
}
