import type { JSString } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardExactArgs, guardArgType } from "../guards";

export const replace: Method = {
  arity: 2,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate exactly 2 arguments
    guardExactArgs(args, 2, "replace");

    // Both arguments must be strings
    guardArgType(args[0], "string", "replace", "searchValue");
    guardArgType(args[1], "string", "replace", "replaceValue");

    const searchValue = (args[0] as JSString).value;
    const replaceValue = (args[1] as JSString).value;

    // Use native JavaScript replace (replaces first occurrence only)
    const result = str.value.replace(searchValue, replaceValue);

    return new JSStringClass(result);
  },
  description: "returns a new string with the first occurrence of a substring replaced",
};
