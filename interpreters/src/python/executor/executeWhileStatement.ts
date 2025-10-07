import type { Executor } from "../executor";
import type { WhileStatement } from "../statement";
import type { EvaluationResult, EvaluationResultWhileStatement } from "../evaluation-result";
import { BreakFlowControlError, ContinueFlowControlError } from "./executeForInStatement";
import { isTruthy } from "../helpers";

export function executeWhileStatement(executor: Executor, statement: WhileStatement): EvaluationResult | null {
  // Execute the while loop
  while (true) {
    // Guard against infinite loops
    executor.guardInfiniteLoop(statement.location);

    // Evaluate the condition - this generates a frame
    const conditionResult = executor.executeFrame<EvaluationResultWhileStatement>(statement, () => {
      const result = executor.evaluate(statement.condition);

      return {
        type: "WhileStatement",
        condition: result,
        jikiObject: result.jikiObject,
        immutableJikiObject: result.immutableJikiObject,
      };
    });

    // Check the condition value using truthiness rules (includes language feature guard)
    const conditionValue = isTruthy(executor, conditionResult.jikiObject, statement.condition.location);

    // If condition is false, exit the loop
    if (!conditionValue) {
      break;
    }

    // Execute the body statements
    try {
      for (const bodyStatement of statement.body) {
        executor.executeStatement(bodyStatement);
      }
    } catch (error) {
      if (error instanceof BreakFlowControlError) {
        // Break out of the loop
        break;
      } else if (error instanceof ContinueFlowControlError) {
        // Continue to the next iteration
        continue;
      } else {
        // Re-throw other errors
        throw error;
      }
    }
  }

  return null;
}
