import { TIME_SCALE_FACTOR } from "./frames.js";
import type { ExecutionContext } from "./interfaces.js";

export function createBaseExecutionContext(this: { time: number }): Omit<ExecutionContext, "logicError"> {
  return {
    fastForward: (milliseconds: number) => {
      this.time += milliseconds * TIME_SCALE_FACTOR;
    },
    getCurrentTimeInMs: () => this.time / TIME_SCALE_FACTOR,
  };
}
