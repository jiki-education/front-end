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
import { splice } from "./splice";
import { sort } from "./sort";
import { reverse } from "./reverse";
import { fill } from "./fill";
import { lastIndexOf } from "./lastIndexOf";
import { toString } from "./toString";
import { entries } from "./entries";
import { keys } from "./keys";
import { values } from "./values";

// Array properties
export const arrayProperties: Record<string, Property> = {
  length,
};

// List of array methods that are not yet implemented
const notYetImplementedMethods = [
  // Mutating methods
  "copyWithin",

  // Accessor methods
  "toLocaleString",

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
  splice,
  sort,
  reverse,
  fill,
  lastIndexOf,
  toString,
  entries,
  keys,
  values,

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
