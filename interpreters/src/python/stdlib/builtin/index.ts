import { print, type BuiltinFunction } from "./print";

// Registry of Python builtin functions (global functions like print, len, etc.)
export const builtinFunctions: Record<string, BuiltinFunction> = {
  print,
};

export { print, type BuiltinFunction };
