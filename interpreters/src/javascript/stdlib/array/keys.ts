import type { JSArray, JikiObject } from "../../jsObjects";
import { JSIterator, JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const keys: Method = {
  arity: [0, 0],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardArgRange(args, 0, 0, "keys");

    // Create an array of indices
    const indices: JikiObject[] = array.elements.map((_, index) => new JSNumber(index));

    // Return an iterator containing the indices
    return new JSIterator(indices, "keys");
  },
  description: "returns an iterator of array indices",
};
