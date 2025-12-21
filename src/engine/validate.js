// (опционально: проверка слотов в dev)

import blockTypes from "../data/blockTypes.json";
import { hasRenderer } from "../renderers/index.js";

/**
 * @param {{type:string, variant?:string, props?:Record<string,any>}} raw
 */
export function validateSectionSpec(raw) {
  if (!raw || typeof raw !== "object")
    throw new Error("Section spec must be object");
  if (!raw.type || typeof raw.type !== "string")
    throw new Error("Section spec must have string 'type'");

  if (!blockTypes[raw.type]) {
    throw new Error(`blockTypes: unknown type "${raw.type}"`);
  }
  // вместо throw:
  if (!hasRenderer(raw.type)) {
    console.warn(`renderers: no renderer for type "${raw.type}"`);
  }

  if (raw.variant != null && typeof raw.variant !== "string") {
    throw new Error("Section 'variant' must be string if provided");
  }
  if (
    raw.props != null &&
    (typeof raw.props !== "object" || Array.isArray(raw.props))
  ) {
    throw new Error("Section 'props' must be object if provided");
  }
}
