import type { JSString } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardNoArgs } from "../guards";

export const trim: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate no arguments
    guardNoArgs(args, "trim");

    return new JSStringClass(str.value.trim());
  },
  description: "returns a string with whitespace removed from both ends",
};
