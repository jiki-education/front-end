import type { JSArray, JikiObject } from "../../jsObjects";
import { JSUndefined } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardNoArgs } from "../guards";

export const shift: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardNoArgs(args, "shift");

    // Use native JavaScript shift() method
    const element = array.elements.shift();

    return element ?? new JSUndefined();
  },
  description: "removes and returns the first element of the array",
};
