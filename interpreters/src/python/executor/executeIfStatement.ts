import type { Executor } from "../executor";
import type { IfStatement } from "../statement";
import type { EvaluationResult, EvaluationResultIfStatement } from "../evaluation-result";
import { isTruthy } from "../helpers";

export function executeIfStatement(executor: Executor, statement: IfStatement): EvaluationResult {
  // Evaluate the condition and generate a frame for it
  const conditionResult = executor.executeFrame<EvaluationResultIfStatement>(statement, () => {
    const result = executor.evaluate(statement.condition);

    return {
      type: "IfStatement",
      condition: result,
      jikiObject: result.jikiObject,
      immutableJikiObject: result.jikiObject.clone(),
    };
  });

  // Check the condition value using truthiness rules (includes language feature guard)
  const conditionValue = isTruthy(executor, conditionResult.jikiObject, statement.condition.location);

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
