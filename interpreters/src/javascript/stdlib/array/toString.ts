import type { JSArray, JikiObject } from "../../jsObjects";
import { JSString } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const toString: Method = {
  arity: [0, 0],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardArgRange(args, 0, 0, "toString");

    // Convert array to string using native JavaScript toString behavior
    // This joins elements with commas (equivalent to join(","))
    const stringParts = array.elements.map(elem => elem.toString());
    const resultString = stringParts.join(",");

    return new JSString(resultString);
  },
  description: "converts the array to a comma-separated string",
};
