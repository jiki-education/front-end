import type { Executor } from "../executor";
import type { RepeatStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { BreakFlowControlError, ContinueFlowControlError } from "./executeForInStatement";

export function executeRepeatStatement(executor: Executor, statement: RepeatStatement): EvaluationResult | null {
  // No-argument repeat: runs until the exercise signals completion (_exerciseFinished),
  // bounded only by the infinite-loop guard. Relying on guardInfiniteLoop to stop the loop
  // means hitting maxTotalLoopIterations raises MaxIterationsReached rather than silently
  // exiting one iteration before the guard would fire.
  while (true) {
    executor.guardInfiniteLoop(statement.location);

    try {
      for (const bodyStatement of statement.body) {
        executor.executeStatement(bodyStatement);
      }
    } catch (error) {
      if (error instanceof BreakFlowControlError) {
        break;
      } else if (error instanceof ContinueFlowControlError) {
        if (executor._exerciseFinished) {
          break;
        }
        continue;
      } else {
        throw error;
      }
    }

    if (executor._exerciseFinished) {
      break;
    }
  }

  return null;
}
