import type { JSArray, JikiObject } from "../../jsObjects";
import { JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const push: Method = {
  arity: [0, Infinity],
  call: (ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate zero or more arguments
    guardArgRange(args, 0, Infinity, "push");

    // Educational guard: in non-native mode, push() with no arguments is a logic error
    if (!ctx.languageFeatures.nativeJSMode && args.length === 0) {
      ctx.logicError("There's no point in calling push with no inputs");
    }

    // Use native JavaScript push() method
    const newLength = array.elements.push(...args);

    return new JSNumber(newLength);
  },
  description: "adds one or more elements to the end of the array and returns the new length",
};
