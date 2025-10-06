import { PyNone, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";

// Builtin function interface (similar to Method but for global functions)
export interface BuiltinFunction {
  arity: number | [number, number];
  call: (ctx: ExecutionContext, args: JikiObject[]) => JikiObject;
  description: string;
}

// Python's print() builtin function
// Accepts variable arguments and returns None
// Describers access the arguments directly from the evaluation result
export const print: BuiltinFunction = {
  arity: [0, Infinity], // Accept any number of arguments
  call: (_ctx: ExecutionContext, _args: JikiObject[]) => {
    // Python's print() always returns None
    return new PyNone();
  },
  description: "prints the given arguments to the output",
};
