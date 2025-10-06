import type { PyString } from "../../jikiObjects";
import { PyString as PyStringClass, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardNoArgs } from "../guards";

export const lower: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as PyString;

    // Validate no arguments
    guardNoArgs(args, "lower");

    return new PyStringClass(str.value.toLowerCase());
  },
  description: "returns a string with all characters converted to lowercase",
};
