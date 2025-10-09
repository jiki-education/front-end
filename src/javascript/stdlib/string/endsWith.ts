import type { JSString, JSNumber } from "../../jsObjects";
import { JSBoolean } from "../../jsObjects";
import type { JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const endsWith: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "endsWith");

    // First argument must be a string
    guardArgType(args[0], "string", "endsWith", "searchString");
    const searchString = (args[0] as JSString).value;

    // Parse optional length parameter (defaults to string length)
    // Note: endsWith uses 'length' parameter, not 'position'
    let length: number | undefined;
    if (args.length === 2) {
      guardArgType(args[1], "number", "endsWith", "length");
      length = Math.trunc((args[1] as JSNumber).value);
    }

    // Use native JavaScript endsWith
    const result = str.value.endsWith(searchString, length);

    return new JSBoolean(result);
  },
  description: "determines whether a string ends with a substring, returning true or false",
};
