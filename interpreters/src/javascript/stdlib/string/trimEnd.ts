import type { JSString } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardNoArgs } from "../guards";

export const trimEnd: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate no arguments
    guardNoArgs(args, "trimEnd");

    return new JSStringClass(str.value.trimEnd());
  },
  description: "returns a string with whitespace removed from the end",
};
