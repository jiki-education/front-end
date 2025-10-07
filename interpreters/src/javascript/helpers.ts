import type { Location } from "../shared/location";
import { JikiObject, JSBoolean, JSNull, JSUndefined, JSNumber, JSString } from "./jikiObjects";
import type { Executor } from "./executor";

export function formatJSObject(value?: any): string {
  if (value === undefined) {
    return "";
  }

  if (value instanceof JikiObject) {
    return value.toString();
  }

  return JSON.stringify(value);
}

export function codeTag(code: string | JikiObject, location: Location): string {
  let parsedCode: string;
  if (code instanceof JikiObject) {
    parsedCode = code.toString();
  } else {
    parsedCode = code;
  }

  const from = location.absolute.begin;
  const to = location.absolute.end;
  return `<code data-hl-from="${from}" data-hl-to="${to}">${parsedCode}</code>`;
}

/**
 * JavaScript truthiness rules with language feature guard
 * Returns false for: false, null, undefined, 0, -0, 0n, NaN, ""
 * Returns true for all other values
 *
 * Throws TruthinessDisabled error if allowTruthiness is false and value is not a boolean
 */
export function isTruthy(executor: Executor, obj: JikiObject, location: Location): boolean {
  // Check if truthiness is disabled and we have a non-boolean
  if (!executor.languageFeatures.allowTruthiness && !(obj instanceof JSBoolean)) {
    executor.error("TruthinessDisabled", location, {
      value: obj.type,
    });
  }

  // JavaScript falsy values
  if (obj instanceof JSBoolean) {
    return obj.value;
  }
  if (obj instanceof JSNull || obj instanceof JSUndefined) {
    return false;
  }
  if (obj instanceof JSNumber) {
    // 0, -0, and NaN are falsy
    return obj.value !== 0 && !Number.isNaN(obj.value);
  }
  if (obj instanceof JSString) {
    return obj.value.length > 0;
  }

  // Arrays and objects are always truthy (even empty ones in JavaScript)
  // This is different from Python where empty arrays are falsy
  return true;
}
