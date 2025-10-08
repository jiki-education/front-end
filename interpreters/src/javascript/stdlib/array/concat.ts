import type { JSArray, JikiObject } from "../../jsObjects";
import { JSArray as JSArrayClass } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const concat: Method = {
  arity: [0, Infinity],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate zero or more arguments
    guardArgRange(args, 0, Infinity, "concat");

    // Start with the original array's elements
    const result: JikiObject[] = [...array.elements];

    // Concatenate each argument
    for (const arg of args) {
      if (arg instanceof JSArrayClass) {
        // If argument is an array, flatten one level (spread its elements)
        result.push(...arg.elements);
      } else {
        // Otherwise, add the value directly
        result.push(arg);
      }
    }

    // Return new JSArray (does not mutate original)
    return new JSArrayClass(result);
  },
  description: "merges two or more arrays into a new array without modifying the originals",
};
