import type { JSArray, JikiObject, JSNumber } from "../../jsObjects";
import { JSBoolean } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const includes: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "includes");

    const searchElement = args[0];

    // Parse optional fromIndex (defaults to 0)
    let fromIndex = 0;
    if (args.length === 2) {
      guardArgType(args[1], "number", "includes", "fromIndex");
      fromIndex = Math.trunc((args[1] as JSNumber).value);
    }

    // Handle negative fromIndex (count from end)
    if (fromIndex < 0) {
      fromIndex = Math.max(0, array.elements.length + fromIndex);
    }

    // Search for element using SameValueZero equality
    // SameValueZero: NaN equals NaN, +0 equals -0
    for (let i = fromIndex; i < array.elements.length; i++) {
      const element = array.elements[i];
      const elementValue = element.value;
      const searchValue = searchElement.value;

      // SameValueZero comparison
      if (elementValue === searchValue || (Number.isNaN(elementValue) && Number.isNaN(searchValue))) {
        return new JSBoolean(true);
      }
    }

    // Not found
    return new JSBoolean(false);
  },
  description: "determines whether an array includes a certain element, returning true or false",
};
