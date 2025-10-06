import type { Method } from "../index";
import type { JikiObject } from "../../jikiObjects";
import { JSUndefined } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";

// console.log() method
// Accepts any number of arguments and logs them to output
// Returns undefined
export const log: Method = {
  arity: [0, Infinity], // Accept any number of arguments
  call: (ctx: ExecutionContext, _thisObj: JikiObject, args: JikiObject[]) => {
    // Convert arguments to strings and join with spaces (JavaScript behavior)
    const output = args.map(arg => arg.toString()).join(" ");
    // Log the output with current execution time
    ctx.log(output);
    // JavaScript's console.log() returns undefined
    return new JSUndefined();
  },
  description: "logs the given arguments to the console",
};
