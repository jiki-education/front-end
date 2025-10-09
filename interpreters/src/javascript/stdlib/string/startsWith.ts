import type { JSString, JSNumber } from "../../jsObjects";
import { JSBoolean } from "../../jsObjects";
import type { JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const startsWith: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "startsWith");

    // First argument must be a string
    guardArgType(args[0], "string", "startsWith", "searchString");
    const searchString = (args[0] as JSString).value;

    // Parse optional position parameter (defaults to 0)
    let position = 0;
    if (args.length === 2) {
      guardArgType(args[1], "number", "startsWith", "position");
      position = Math.trunc((args[1] as JSNumber).value);
    }

    // Use native JavaScript startsWith
    const result = str.value.startsWith(searchString, position);

    return new JSBoolean(result);
  },
  description: "determines whether a string begins with a substring, returning true or false",
};
