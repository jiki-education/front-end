import type { JSArray, JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const sort: Method = {
  arity: [0, 1],
  call: (ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 0 or 1 argument
    guardArgRange(args, 0, 1, "sort");

    if (args.length === 0) {
      // Default sort: convert elements to strings and sort lexicographically
      array.elements.sort((a, b) => {
        const aStr = a.toString();
        const bStr = b.toString();
        if (aStr < bStr) {
          return -1;
        }
        if (aStr > bStr) {
          return 1;
        }
        return 0;
      });
    } else {
      // Custom comparator function provided
      // Note: This requires function support which may not be implemented yet
      // For now, throw a LogicError
      ctx.logicError("Custom compare functions for sort() are not yet supported");
    }

    // Return the sorted array (mutates in place)
    return array;
  },
  description: "sorts the elements of the array in place and returns the sorted array",
};
