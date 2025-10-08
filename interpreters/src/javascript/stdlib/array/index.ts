import type { Property, Method } from "../index";
import { createNotYetImplementedStub } from "../index";

// Import implemented properties and methods
import { length } from "./length";
import { at } from "./at";
import { push } from "./push";
import { pop } from "./pop";
import { shift } from "./shift";
import { unshift } from "./unshift";
import { indexOf } from "./indexOf";
import { includes } from "./includes";
import { slice } from "./slice";
import { concat } from "./concat";
import { join } from "./join";

// Array properties
export const arrayProperties: Record<string, Property> = {
  length,
};

// List of array methods that are not yet implemented
const notYetImplementedMethods = [
  // Mutating methods
  "splice",
  "sort",
  "reverse",
  "fill",
  "copyWithin",

  // Accessor methods
  "lastIndexOf",
  "toString",
  "toLocaleString",
  "entries",
  "keys",
  "values",

  // Iteration methods
  "forEach",
  "map",
  "filter",
  "reduce",
  "reduceRight",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "every",
  "some",
  "flat",
  "flatMap",

  // Static methods (would need special handling)
  "from",
  "isArray",
  "of",
];

// Array methods
export const arrayMethods: Record<string, Method> = {
  at,
  push,
  pop,
  shift,
  unshift,
  indexOf,
  includes,
  slice,
  concat,
  join,

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
