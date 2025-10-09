import type { JSArray, JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const reverse: Method = {
  arity: [0, 0],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardArgRange(args, 0, 0, "reverse");

    // Use native JavaScript reverse() to reverse the array in place
    array.elements.reverse();

    // Return the reversed array
    return array;
  },
  description: "reverses the order of elements in the array in place and returns the reversed array",
};
