import type { Method } from "../index";
import { StdlibError } from "../index";
import type { JikiObject } from "../../jsObjects";
import { JSNumber } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import { guardArgType } from "../guards";

export const randomInt: Method = {
  arity: 2,
  call: (_ctx: ExecutionContext, _thisObj: JikiObject, args: JikiObject[]) => {
    // Validate argument types
    guardArgType(args[0], "number", "randomInt", "min");
    guardArgType(args[1], "number", "randomInt", "max");

    // Convert to integers (like Python's randint and JS's other stdlib methods)
    const min = Math.trunc((args[0] as JSNumber).value);
    const max = Math.trunc((args[1] as JSNumber).value);

    // Validate min <= max (like Python's random.randint)
    if (min > max) {
      throw new StdlibError("ValueError", "StdlibRandomIntMinGreaterThanMax", { min, max });
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    return new JSNumber(result);
  },
  description: "returns a random integer between min and max (both inclusive)",
};
