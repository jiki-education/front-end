import type { Property, Method } from "../index";
import { createNotYetImplementedStub } from "../index";

// Import implemented methods
import { __len__ } from "./__len__";
import { index } from "./index_method";

// List properties (Python lists don't have properties in the traditional sense)
export const listProperties: Record<string, Property> = {};

// List of list methods that are not yet implemented
const notYetImplementedMethods = [
  // Mutating methods
  "append",
  "extend",
  "insert",
  "remove",
  "pop",
  "clear",
  "sort",
  "reverse",

  // Accessor methods
  "count",
  "copy",

  // Python-specific methods
  "__contains__",
  "__iter__",
  "__reversed__",
  "__add__",
  "__mul__",
  "__rmul__",
  "__iadd__",
  "__imul__",
];

// List methods
export const listMethods: Record<string, Method> = {
  __len__,
  index,

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
