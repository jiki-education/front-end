import type { JSString, JSNumber } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardExactArgs, guardArgType } from "../guards";

export const repeat: Method = {
  arity: 1,
  call: (ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate exactly 1 argument
    guardExactArgs(args, 1, "repeat");

    // Argument must be a number
    guardArgType(args[0], "number", "repeat", "count");
    const count = (args[0] as JSNumber).value;

    // Count must be non-negative and finite
    if (count < 0 || !Number.isFinite(count)) {
      ctx.logicError("The repeat count must be a non-negative finite number.");
    }

    // Use native JavaScript repeat
    const result = str.value.repeat(count);

    return new JSStringClass(result);
  },
  description: "returns a new string with the specified number of copies concatenated together",
};
