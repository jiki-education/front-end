import type { Shared } from "./types";

export function isNumber(obj: any): obj is Shared.Number {
  return obj?.type === "number";
}

export function isString(obj: any): obj is Shared.String {
  return obj?.type === "string";
}

export function isBoolean(obj: any): obj is Shared.Boolean {
  return obj?.type === "boolean";
}

export function isList(obj: any): obj is Shared.List {
  return obj?.type === "list";
}

export function isDictionary(obj: any): obj is Shared.Dictionary {
  return obj?.type === "dictionary";
}
