import type { JSString } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardExactArgs, guardArgType } from "../guards";

export const replaceAll: Method = {
  arity: 2,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate exactly 2 arguments
    guardExactArgs(args, 2, "replaceAll");

    // Both arguments must be strings
    guardArgType(args[0], "string", "replaceAll", "searchValue");
    guardArgType(args[1], "string", "replaceAll", "replaceValue");

    const searchValue = (args[0] as JSString).value;
    const replaceValue = (args[1] as JSString).value;

    // Use native JavaScript replaceAll (replaces all occurrences)
    const result = str.value.replaceAll(searchValue, replaceValue);

    return new JSStringClass(result);
  },
  description: "returns a new string with all occurrences of a substring replaced",
};
