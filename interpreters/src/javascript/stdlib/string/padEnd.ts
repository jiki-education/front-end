import type { JSString, JSNumber } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const padEnd: Method = {
  arity: [1, 2],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate 1 or 2 arguments
    guardArgRange(args, 1, 2, "padEnd");

    // First argument must be a number (target length)
    guardArgType(args[0], "number", "padEnd", "targetLength");
    const targetLength = Math.trunc((args[0] as JSNumber).value);

    // Parse optional fillString parameter (defaults to " ")
    let fillString = " ";
    if (args.length === 2) {
      guardArgType(args[1], "string", "padEnd", "fillString");
      fillString = (args[1] as JSString).value;
    }

    // Use native JavaScript padEnd
    const result = str.value.padEnd(targetLength, fillString);

    return new JSStringClass(result);
  },
  description: "pads the string from the end with another string until it reaches the target length",
};
