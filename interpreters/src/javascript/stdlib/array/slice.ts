import type { JSArray, JikiObject, JSNumber } from "../../jsObjects";
import { JSArray as JSArrayClass } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const slice: Method = {
  arity: [0, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 0, 1, or 2 arguments
    guardArgRange(args, 0, 2, "slice");

    // Parse optional start (defaults to 0)
    let start = 0;
    if (args.length >= 1) {
      guardArgType(args[0], "number", "slice", "start");
      start = Math.trunc((args[0] as JSNumber).value);
    }

    // Parse optional end (defaults to array.length)
    let end = array.elements.length;
    if (args.length >= 2) {
      guardArgType(args[1], "number", "slice", "end");
      end = Math.trunc((args[1] as JSNumber).value);
    }

    // Use native JavaScript slice() method on the elements array
    // This handles negative indices, out of bounds, etc. automatically
    const slicedElements = array.elements.slice(start, end);

    // Return new JSArray (does not mutate original)
    return new JSArrayClass(slicedElements);
  },
  description: "returns a shallow copy of a portion of the array without modifying the original",
};
