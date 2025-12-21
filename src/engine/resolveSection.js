// (type+variant+overrides → props)

import { pickVariant } from "./variantPicker.js";
import { validateSectionSpec } from "./validate.js";

let seq = 0;

/**
 * @param {{type:string, variant?:string, props?:Record<string,any>}} spec
 */
export function resolveSection(spec) {
  validateSectionSpec(spec);

  const { variant, content } = pickVariant(spec.type, spec.variant);

  seq += 1;
  const id = `${spec.type}__${variant}__${Date.now()}__${seq}`;

  return {
    id,
    type: spec.type,
    variant,
    content,
    props: spec.props ?? {},
  };
}
