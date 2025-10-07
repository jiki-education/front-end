import type { Executor } from "../executor";
import type { IfStatement } from "../statement";
import type { EvaluationResult, EvaluationResultIfStatement } from "../evaluation-result";
import { isTruthy } from "../helpers";

export function executeIfStatement(executor: Executor, statement: IfStatement): EvaluationResult | null {
  let conditionValue!: boolean;

  // Evaluate the condition and generate a frame for it
  executor.executeFrame<EvaluationResultIfStatement>(statement, () => {
    const result = executor.evaluate(statement.condition);

    // Validate truthiness inside the frame - this will throw with the condition's location if invalid
    conditionValue = isTruthy(executor, result.jikiObject, statement.condition.location);

    return {
      type: "IfStatement",
      condition: result,
      jikiObject: result.jikiObject,
      immutableJikiObject: result.jikiObject.clone(),
    };
  });

  if (conditionValue) {
    // Execute the then branch
    return executor.executeStatement(statement.thenBranch);
  } else if (statement.elseBranch) {
    // Execute the else branch if it exists
    return executor.executeStatement(statement.elseBranch);
  }

  // If condition is false and no else branch, return null (if statements don't produce values)
  return null;
}
