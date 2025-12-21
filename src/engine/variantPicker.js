// (если нужен рандом без повторов)

import contentVariants from "../data/contentVariants.json";

/**
 * @param {string} type
 * @param {string | undefined} preferredVariant
 */
export function pickVariant(type, preferredVariant) {
  const variants = contentVariants?.[type];
  if (!variants)
    throw new Error(`contentVariants: no entry for type "${type}"`);

  if (preferredVariant && variants[preferredVariant]) {
    return { variant: preferredVariant, content: variants[preferredVariant] };
  }

  const keys = Object.keys(variants);
  if (keys.length === 0)
    throw new Error(`contentVariants: type "${type}" has no variants`);

  const variant = keys[Math.floor(Math.random() * keys.length)];
  return { variant, content: variants[variant] };
}
