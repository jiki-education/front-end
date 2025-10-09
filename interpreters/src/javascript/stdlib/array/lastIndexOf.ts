import type { JSArray, JikiObject, JSNumber } from "../../jsObjects";
import { JSNumber as JSNumberClass } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const lastIndexOf: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "lastIndexOf");

    // Required search element
    const searchElement = args[0];

    // Optional fromIndex (defaults to array.length - 1)
    let fromIndex = array.elements.length - 1;
    if (args.length >= 2) {
      guardArgType(args[1], "number", "lastIndexOf", "fromIndex");
      fromIndex = Math.trunc((args[1] as JSNumber).value);
    }

    // Find the last index using native JavaScript lastIndexOf
    // We need to search using object equality for JikiObjects
    let resultIndex = -1;

    // Normalize fromIndex for negative values
    let actualFromIndex = fromIndex;
    if (actualFromIndex < 0) {
      actualFromIndex = array.elements.length + actualFromIndex;
    }
    if (actualFromIndex < 0) {
      // If still negative, no match possible
      return new JSNumberClass(-1);
    }
    if (actualFromIndex >= array.elements.length) {
      actualFromIndex = array.elements.length - 1;
    }

    // Search backwards from fromIndex
    for (let i = actualFromIndex; i >= 0; i--) {
      const element = array.elements[i];
      // Use strict equality semantics: compare both type and value
      if (element.constructor === searchElement.constructor && element.value === searchElement.value) {
        resultIndex = i;
        break;
      }
    }

    return new JSNumberClass(resultIndex);
  },
  description: "finds the last occurrence of an element in the array and returns its index, or -1 if not found",
};
