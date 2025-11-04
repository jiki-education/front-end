import type { JSString, JSNumber } from "../../jsObjects";
import { JSString as JSStringClass, JSArray, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const split: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "split");

    // First argument must be a string
    guardArgType(args[0], "string", "split", "separator");
    const separator = (args[0] as JSString).value;

    // Parse optional limit parameter
    let limit: number | undefined = undefined;
    if (args.length === 2) {
      guardArgType(args[1], "number", "split", "limit");
      limit = Math.trunc((args[1] as JSNumber).value);
    }

    // Use native JavaScript split
    const resultArray = str.value.split(separator, limit);

    // Convert to JSArray of JSStrings
    const jsStrings = resultArray.map(s => new JSStringClass(s));
    return new JSArray(jsStrings);
  },
  description: "splits a string into an array of substrings using a separator",
};
