import type { PyString } from "../../jikiObjects";
import { PyString as PyStringClass, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardNoArgs } from "../guards";

export const upper: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject | null, args: JikiObject[]) => {
    const str = obj as PyString;

    // Validate no arguments
    guardNoArgs(args, "upper");

    return new PyStringClass(str.value.toUpperCase());
  },
  description: "returns a string with all characters converted to uppercase",
};
