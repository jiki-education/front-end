// Re-export base class
export { JikiObject } from "../../shared/jikiObject";

// Export all JS object types
export { JSNumber } from "./JSNumber";
export { JSString } from "./JSString";
export { JSBoolean } from "./JSBoolean";
export { JSNull } from "./JSNull";
export { JSUndefined } from "./JSUndefined";
export { JSArray } from "./JSArray";
export { JSDictionary } from "./JSDictionary";
export { JSStdLibFunction } from "./JSStdLibFunction";
export { JSBuiltinObject } from "./JSBuiltinObject";
export { JSIterator } from "./JSIterator";
export { JSClass, JSMethod, JSGetter, JSSetter } from "./JSClass";
export { JSInstance } from "./JSInstance";
export { JSBoundMethod } from "./JSBoundMethod";

// Import for helper functions
import { JikiObject } from "../../shared/jikiObject";
import { Fraction } from "../../shared/fraction";
import { JSNumber } from "./JSNumber";
import { JSString } from "./JSString";
import { JSBoolean } from "./JSBoolean";
import { JSNull } from "./JSNull";
import { JSUndefined } from "./JSUndefined";
import { JSArray } from "./JSArray";
import { JSDictionary } from "./JSDictionary";

// Helper function to create JSObjects from JavaScript values
export function createJSObject(value: any): JikiObject {
  if (value instanceof JikiObject) {
    return value;
  }
  if (value === null) {
    return new JSNull();
  } else if (value === undefined) {
    return new JSUndefined();
  } else if (typeof value === "number") {
    // Integers are always exactly representable, so attach an exact fraction to
    // keep subsequent arithmetic order-independent. Non-integer floats are left
    // inexact to avoid treating irrational results (e.g. sqrt) as exact.
    return new JSNumber(value, Number.isInteger(value) ? Fraction.fromInteger(value) : null);
  } else if (typeof value === "string") {
    return new JSString(value);
  } else if (typeof value === "boolean") {
    return new JSBoolean(value);
  } else if (Array.isArray(value)) {
    return new JSArray(value.map(elem => createJSObject(elem)));
  } else if (typeof value === "object" && value !== null) {
    const map = new Map<string, JikiObject>();
    for (const [key, val] of Object.entries(value)) {
      map.set(key, createJSObject(val));
    }
    return new JSDictionary(map);
  }
  throw new Error(`Cannot create JSObject for value: ${value}`);
}

// Helper function to unwrap JSObjects to JavaScript values
export function unwrapJSObject(obj: JikiObject | any): any {
  if (obj instanceof JSArray) {
    return obj.value.map(elem => unwrapJSObject(elem));
  } else if (obj instanceof JSDictionary) {
    const result: any = {};
    for (const [key, val] of obj.value.entries()) {
      result[key] = unwrapJSObject(val);
    }
    return result;
  } else if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
