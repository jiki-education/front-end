import type { JSString } from "../../jsObjects";
import { JSNumber, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Property } from "../index";

export const length: Property = {
  get: (_ctx: ExecutionContext, obj: JikiObject) => {
    const str = obj as JSString;
    return new JSNumber(str.value.length);
  },
  description: "the number of characters in the string",
};
