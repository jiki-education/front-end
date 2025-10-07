import type { JikiObject } from "./jikiObjects";
import { PyBoolean, PyNone, PyNumber, PyString, PyList } from "./jikiObjects";
import type { Executor } from "./executor";
import type { Location } from "../shared/location";

/**
 * Python truthiness rules with language feature guard
 * Returns false for: False, None, 0, 0.0, "", [], {}, set()
 * Returns true for all other values
 *
 * Throws TruthinessDisabled error if allowTruthiness is false and value is not a boolean
 */
export function isTruthy(executor: Executor, obj: JikiObject, location: Location): boolean {
  // Check if truthiness is disabled and we have a non-boolean
  if (!executor.languageFeatures.allowTruthiness && !(obj instanceof PyBoolean)) {
    executor.error("TruthinessDisabled", location, {
      value: obj.type,
    });
  }

  // Python falsy values: False, None, 0, 0.0, "", [], {}, set()
  if (obj instanceof PyBoolean) {
    return obj.value;
  }
  if (obj instanceof PyNone) {
    return false;
  }
  if (obj instanceof PyNumber) {
    return obj.value !== 0;
  }
  if (obj instanceof PyString) {
    return obj.value.length > 0;
  }
  if (obj instanceof PyList) {
    return obj.value.length > 0;
  }

  // For now, we'll treat any other type as truthy
  // This will be expanded when we add dicts, sets, etc.
  return true;
}
