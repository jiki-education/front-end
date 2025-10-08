import type { JSArray, JikiObject } from "../../jsObjects";
import { JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const indexOf: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "indexOf");

    const searchElement = args[0];

    // Parse optional fromIndex (defaults to 0)
    let fromIndex = 0;
    if (args.length === 2) {
      guardArgType(args[1], "number", "indexOf", "fromIndex");
      fromIndex = Math.trunc((args[1] as JSNumber).value);
    }

    // Handle negative fromIndex (count from end)
    if (fromIndex < 0) {
      fromIndex = Math.max(0, array.elements.length + fromIndex);
    }

    // Search for element using strict equality (===)
    // Note: We can't use native indexOf because elements are JikiObjects
    const searchValue = searchElement.value;
    for (let i = fromIndex; i < array.elements.length; i++) {
      if (array.elements[i].value === searchValue) {
        return new JSNumber(i);
      }
    }

    // Not found
    return new JSNumber(-1);
  },
  description: "returns the first index at which a given element is found, or -1 if not found",
};
