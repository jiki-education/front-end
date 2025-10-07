import type { JSArray, JikiObject } from "../../jsObjects";
import { JSUndefined } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardNoArgs } from "../guards";

export const pop: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardNoArgs(args, "pop");

    // Use native JavaScript pop() method
    const element = array.elements.pop();

    return element ?? new JSUndefined();
  },
  description: "removes and returns the last element of the array",
};
