import type { JSArray, JikiObject } from "../../jsObjects";
import { JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const push: Method = {
  arity: [1, Infinity],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate at least one argument
    guardArgRange(args, 1, Infinity, "push");

    // Use native JavaScript push() method
    const newLength = array.elements.push(...args);

    return new JSNumber(newLength);
  },
  description: "adds one or more elements to the end of the array and returns the new length",
};
