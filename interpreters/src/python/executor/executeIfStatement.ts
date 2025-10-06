import type { Executor } from "../executor";
import type { IfStatement } from "../statement";
import type { EvaluationResult, EvaluationResultIfStatement } from "../evaluation-result";
import type { JikiObject } from "../jikiObjects";

// Python truthiness rules (same as in executeBinaryExpression)
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

  // For now, we'll treat any other type as truthy
  // This will be expanded when we add lists, dicts, etc.
  return true;
}

export function executeIfStatement(executor: Executor, statement: IfStatement): EvaluationResult {
  // Evaluate the condition and generate a frame for it
  const conditionResult = executor.executeFrame<EvaluationResultIfStatement>(statement, () => {
    const result = executor.evaluate(statement.condition);

    // Check if truthiness is disabled and we have a non-boolean
    if (!executor.languageFeatures.allowTruthiness && result.jikiObject.type !== "boolean") {
      executor.error("TruthinessDisabled", statement.condition.location, {
        value: result.jikiObject.type,
      });
    }

    return {
      type: "IfStatement",
      condition: result,
      jikiObject: result.jikiObject,
      immutableJikiObject: result.jikiObject.clone(),
    };
  });

  // Check the condition value using truthiness rules
  const conditionValue = isTruthy(conditionResult.jikiObject);

  if (conditionValue) {
    // Execute the then branch
    const result = executor.executeStatement(statement.thenBranch);
    return result || conditionResult;
  } else if (statement.elseBranch) {
    // Execute the else branch if it exists
    const result = executor.executeStatement(statement.elseBranch);
    return result || conditionResult;
  }

  // If condition is false and no else branch, return the condition result
  return conditionResult;
}
