import type { Method } from "../index";
import { StdlibError } from "../index";
import type { JikiObject } from "../../jikiObjects";
import { PyNumber } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import { guardArgType } from "../guards";

export const randint: Method = {
  arity: 2,
  call: (ctx: ExecutionContext, _thisObj: JikiObject | null, args: JikiObject[]) => {
    // Validate argument types
    guardArgType(args[0], "number", "randint", "a");
    guardArgType(args[1], "number", "randint", "b");

    // Convert to integers (like Python's randint)
    const min = Math.trunc((args[0] as PyNumber).value);
    const max = Math.trunc((args[1] as PyNumber).value);

    // Validate min <= max (like Python's random.randint)
    if (min > max) {
      throw new StdlibError("ValueError", "StdlibRandintMinGreaterThanMax", { min, max });
    }

    const result = Math.floor(ctx.random() * (max - min + 1)) + min;
    return new PyNumber(result);
  },
  description: "returns a random integer between a and b (both inclusive)",
};
