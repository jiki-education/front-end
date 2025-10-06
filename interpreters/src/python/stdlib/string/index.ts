import type { Property, Method } from "../index";
import { createNotYetImplementedStub } from "../index";

// Import implemented methods
import { upper } from "./upper";
import { lower } from "./lower";

// String properties (Python strings don't have properties in the traditional sense)
export const stringProperties: Record<string, Property> = {};

// List of string methods that are not yet implemented
const notYetImplementedMethods = [
  // Case methods (others)
  "capitalize",
  "casefold",
  "swapcase",
  "title",
  "islower",
  "isupper",
  "istitle",

  // Search methods
  "find",
  "rfind",
  "index",
  "rindex",
  "count",
  "startswith",
  "endswith",

  // Modification methods
  "replace",
  "strip",
  "lstrip",
  "rstrip",
  "split",
  "rsplit",
  "splitlines",
  "join",
  "center",
  "ljust",
  "rjust",
  "zfill",
  "expandtabs",

  // Validation methods
  "isalnum",
  "isalpha",
  "isascii",
  "isdecimal",
  "isdigit",
  "isidentifier",
  "isnumeric",
  "isprintable",
  "isspace",

  // Encoding methods
  "encode",

  // Format methods
  "format",
  "format_map",

  // Other methods
  "translate",
  "maketrans",
  "partition",
  "rpartition",

  // Magic methods
  "__contains__",
  "__iter__",
  "__add__",
  "__mul__",
  "__rmul__",
  "__mod__",
  "__rmod__",
  "__getitem__",
  "__len__",
];

// String methods
export const stringMethods: Record<string, Method> = {
  upper,
  lower,

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
