import type { JSArray, JikiObject } from "../../jsObjects";
import { JSArray as JSArrayClass } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const toReversed: Method = {
  arity: [0, 0],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardArgRange(args, 0, 0, "toReversed");

    // Copy the elements, then reverse the copy so the original is untouched
    const reversedElements = array.elements.slice().reverse();

    // Return new JSArray (does not mutate original)
    return new JSArrayClass(reversedElements);
  },
  description: "returns a new array with the elements in reversed order, without modifying the original",
};
