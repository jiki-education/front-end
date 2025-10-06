import type { JSArray, JikiObject } from "../../jsObjects";
import type { JSNumber } from "../../jsObjects";
import { JSUndefined } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardExactArgs, guardArgType } from "../guards";

export const at: Method = {
  arity: 1,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate exactly one argument
    guardExactArgs(args, 1, "at");

    // Validate argument is a number
    guardArgType(args[0], "number", "at", "index");
    const indexArg = args[0] as JSNumber;

    // JavaScript's native at() accepts non-integers and truncates them
    // We match this behavior for compatibility (e.g., arr.at(1.5) returns arr[1])
    const index = Math.trunc(indexArg.value);

    // Handle negative indices
    const actualIndex = index < 0 ? array.length + index : index;

    // Check bounds and get element
    if (actualIndex < 0 || actualIndex >= array.length) {
      return new JSUndefined();
    }

    const element = array.getElement(actualIndex);
    return element || new JSUndefined();
  },
  description: "returns the element at the specified index, supporting negative indices",
};
