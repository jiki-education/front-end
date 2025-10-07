import type { Executor } from "../executor";
import type { WhileStatement } from "../statement";
import type { EvaluationResult, EvaluationResultWhileStatement } from "../evaluation-result";
import type { JikiObject } from "../jikiObjects";
import { BreakFlowControlError, ContinueFlowControlError } from "./executeForInStatement";

// Python truthiness rules (same as in executeIfStatement)
function isTruthy(obj: JikiObject): boolean {
  const value = obj.value;
  const type = obj.type;

  // Python falsy values: False, None, 0, 0.0, "", [], {}, set()
  if (type === "boolean") {
    return value as boolean;
  }
  if (type === "none") {
    return false;
  }
  if (type === "number") {
    return value !== 0;
  }
  if (type === "string") {
    return (value as string).length > 0;
  }

  // Lists - empty list is falsy
  if (type === "list") {
    return (value as JikiObject[]).length > 0;
  }

  // For now, we'll treat any other type as truthy
  return true;
}

export function executeWhileStatement(executor: Executor, statement: WhileStatement): EvaluationResult | null {
  // Execute the while loop
  while (true) {
    // Evaluate the condition - this generates a frame
    const conditionResult = executor.executeFrame<EvaluationResultWhileStatement>(statement, () => {
      const result = executor.evaluate(statement.condition);

      // Check if truthiness is disabled and we have a non-boolean
      if (!executor.languageFeatures.allowTruthiness && result.jikiObject.type !== "boolean") {
        executor.error("TruthinessDisabled", statement.condition.location, {
          value: result.jikiObject.type,
        });
      }

      return {
        type: "WhileStatement",
        condition: result,
        jikiObject: result.jikiObject,
        immutableJikiObject: result.immutableJikiObject,
      };
    });

    // Check the condition value using truthiness rules
    const conditionValue = isTruthy(conditionResult.jikiObject);

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
