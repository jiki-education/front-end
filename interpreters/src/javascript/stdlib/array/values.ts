import type { JSArray, JikiObject } from "../../jsObjects";
import { JSIterator } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange } from "../guards";

export const values: Method = {
  arity: [0, 0],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate no arguments
    guardArgRange(args, 0, 0, "values");

    // Return an iterator containing the array values
    // We clone the elements to create a snapshot
    const valuesCopy = array.elements.map(elem => elem.clone());
    return new JSIterator(valuesCopy, "values");
  },
  description: "returns an iterator of array values",
};
