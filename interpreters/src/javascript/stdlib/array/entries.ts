import type { JSArray, JikiObject } from "../../jsObjects";
import { JSIterator, JSArray as JSArrayClass, JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const entries: Method = {
  arity: [0, 0],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardArgRange(args, 0, 0, "entries");

    // Create an array of [index, value] pairs
    const entryPairs: JikiObject[] = array.elements.map((value, index) => {
      return new JSArrayClass([new JSNumber(index), value]);
    });

    // Return an iterator containing the entry pairs
    return new JSIterator(entryPairs, "entries");
  },
  description: "returns an iterator of [index, value] pairs for each element in the array",
};
