import type { JSArray } from "../../jsObjects";
import { JSNumber, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Property } from "../index";

export const length: Property = {
  get: (_ctx: ExecutionContext, obj: JikiObject) => {
    const array = obj as JSArray;
    return new JSNumber(array.length);
  },
  description: "the number of elements in the array",
};
