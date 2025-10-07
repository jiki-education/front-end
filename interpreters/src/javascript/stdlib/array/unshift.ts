import type { JSArray, JikiObject } from "../../jsObjects";
import { JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const unshift: Method = {
  arity: [0, Infinity],
  call: (ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate zero or more arguments
    guardArgRange(args, 0, Infinity, "unshift");

    // Educational guard: in non-native mode, unshift() with no arguments is a logic error
    if (!ctx.languageFeatures.nativeJSMode && args.length === 0) {
      ctx.logicError("There's no point in calling unshift with no inputs");
    }

    // Use native JavaScript unshift() method
    const newLength = array.elements.unshift(...args);

    return new JSNumber(newLength);
  },
  description: "adds one or more elements to the beginning of the array and returns the new length",
};
