import type { JSString } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgType } from "../guards";

export const concat: Method = {
  arity: [0, Infinity],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // All arguments must be strings
    for (let i = 0; i < args.length; i++) {
      guardArgType(args[i], "string", "concat", `argument ${i + 1}`);
    }

    // Concatenate all string arguments
    const result = str.value + args.map(arg => (arg as JSString).value).join("");

    return new JSStringClass(result);
  },
  description: "concatenates one or more strings and returns a new string",
};
