import type { JSString, JSNumber } from "../../jsObjects";
import { JSNumber as JSNumberClass } from "../../jsObjects";
import type { JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const indexOf: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "indexOf");

    // First argument must be a string
    guardArgType(args[0], "string", "indexOf", "searchString");
    const searchString = (args[0] as JSString).value;

    // Parse optional position parameter (defaults to 0)
    let position = 0;
    if (args.length === 2) {
      guardArgType(args[1], "number", "indexOf", "position");
      position = Math.trunc((args[1] as JSNumber).value);
    }

    // Use native JavaScript indexOf
    const result = str.value.indexOf(searchString, position);

    return new JSNumberClass(result);
  },
  description: "returns the index of the first occurrence of a substring, or -1 if not found",
};
