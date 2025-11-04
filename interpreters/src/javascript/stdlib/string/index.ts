import type { Property, Method } from "../index";
import { createNotYetImplementedStub } from "../index";

// Import implemented properties and methods
import { length } from "./length";
import { toUpperCase } from "./toUpperCase";
import { toLowerCase } from "./toLowerCase";
import { indexOf } from "./indexOf";
import { lastIndexOf } from "./lastIndexOf";
import { includes } from "./includes";
import { startsWith } from "./startsWith";
import { endsWith } from "./endsWith";
import { concat } from "./concat";
import { repeat } from "./repeat";
import { replace } from "./replace";
import { replaceAll } from "./replaceAll";
import { split } from "./split";
import { trim } from "./trim";
import { trimStart } from "./trimStart";
import { trimEnd } from "./trimEnd";
import { padStart } from "./padStart";
import { padEnd } from "./padEnd";

// String properties
export const stringProperties: Record<string, Property> = {
  length,
};

// List of string methods that are not yet implemented
const notYetImplementedMethods = [
  // Case methods
  "toLocaleLowerCase",
  "toLocaleUpperCase",

  // Search methods (regex-based, not yet implemented)
  "search",
  "match",
  "matchAll",

  // Extraction methods
  "charAt",
  "charCodeAt",
  "codePointAt",
  "slice",
  "substring",
  "substr",

  // Modification methods (legacy aliases only)
  "trimLeft",
  "trimRight",

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
  indexOf,
  lastIndexOf,
  includes,
  startsWith,
  endsWith,
  concat,
  repeat,
  replace,
  replaceAll,
  split,
  trim,
  trimStart,
  trimEnd,
  padStart,
  padEnd,

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
