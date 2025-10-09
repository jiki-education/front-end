import type { JSArray, JikiObject, JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const fill: Method = {
  arity: [1, 3],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 1 to 3 arguments
    guardArgRange(args, 1, 3, "fill");

    // Required value to fill with
    const value = args[0];

    // Optional start index (defaults to 0)
    let start = 0;
    if (args.length >= 2) {
      guardArgType(args[1], "number", "fill", "start");
      start = Math.trunc((args[1] as JSNumber).value);
    }

    // Optional end index (defaults to array.length)
    let end = array.elements.length;
    if (args.length >= 3) {
      guardArgType(args[2], "number", "fill", "end");
      end = Math.trunc((args[2] as JSNumber).value);
    }

    // Use native JavaScript fill() to fill the array in place
    // This handles negative indices, out of bounds, etc. automatically
    array.elements.fill(value, start, end);

    // Return the filled array
    return array;
  },
  description: "fills all or part of the array with a specified value and returns the modified array",
};
