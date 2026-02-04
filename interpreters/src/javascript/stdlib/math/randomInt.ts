import type { Method } from "../index";
import type { JikiObject } from "../../jsObjects";
import { JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";

export const randomInt: Method = {
  arity: 2,
  call: (_ctx: ExecutionContext, _thisObj: JikiObject, args: JikiObject[]) => {
    const min = (args[0] as JSNumber).value;
    const max = (args[1] as JSNumber).value;
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    return new JSNumber(result);
  },
  description: "returns a random integer between min and max (both inclusive)",
};
