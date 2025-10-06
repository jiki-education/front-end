import type { Property, Method } from "../index";
import { createNotYetImplementedStub } from "../index";

// Import implemented properties and methods
import { length } from "./length";
import { toUpperCase } from "./toUpperCase";
import { toLowerCase } from "./toLowerCase";

// String properties
export const stringProperties: Record<string, Property> = {
  length,
};

// List of string methods that are not yet implemented
const notYetImplementedMethods = [
  // Case methods
  "toLocaleLowerCase",
  "toLocaleUpperCase",

  // Search methods
  "indexOf",
  "lastIndexOf",
  "search",
  "includes",
  "startsWith",
  "endsWith",
  "match",
  "matchAll",

  // Extraction methods
  "charAt",
  "charCodeAt",
  "codePointAt",
  "slice",
  "substring",
  "substr",

  // Modification methods
  "concat",
  "repeat",
  "replace",
  "replaceAll",
  "split",
  "trim",
  "trimStart",
  "trimEnd",
  "trimLeft",
  "trimRight",
  "padStart",
  "padEnd",

  // Locale methods
  "localeCompare",
  "normalize",

  // Iterator methods
  "Symbol.iterator",

  // Other methods
  "toString",
  "valueOf",
  "anchor",
  "big",
  "blink",
  "bold",
  "fixed",
  "fontcolor",
  "fontsize",
  "italics",
  "link",
  "small",
  "strike",
  "sub",
  "sup",
];

// String methods
export const stringMethods: Record<string, Method> = {
  toUpperCase,
  toLowerCase,

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
