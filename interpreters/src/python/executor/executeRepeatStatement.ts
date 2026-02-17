import type { Executor } from "../executor";
import type { RepeatStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { BreakFlowControlError, ContinueFlowControlError } from "./executeForInStatement";

export function executeRepeatStatement(executor: Executor, statement: RepeatStatement): EvaluationResult | null {
  const count = executor.languageFeatures.maxTotalLoopIterations ?? 10000;
  let iteration = 0;

  while (iteration < count) {
    iteration++;
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
