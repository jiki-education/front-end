import type { EvaluationResultIfStatement } from "../evaluation-result";
import type { Executor } from "../executor";
import type { IfStatement } from "../statement";
import { isTruthy } from "../helpers";

export function executeIfStatement(executor: Executor, statement: IfStatement) {
  const conditionResult = executor.executeFrame<EvaluationResultIfStatement>(statement, () =>
    executeCondition(executor, statement)
  );

  // Use the truthiness value determined during frame generation
  const conditionValue = isTruthy(executor, conditionResult.jikiObject, statement.condition.location);

  if (conditionValue) {
    executor.executeStatement(statement.thenBranch);
    return;
  }

  if (statement.elseBranch === null) {
    return;
  }
  executor.executeStatement(statement.elseBranch);
}

function executeCondition(executor: Executor, statement: IfStatement): EvaluationResultIfStatement {
  const result = executor.evaluate(statement.condition);

  // Validate truthiness inside the frame - this will throw with the condition's location if invalid
  isTruthy(executor, result.jikiObject, statement.condition.location);

  return {
    type: "IfStatement",
    condition: result,
    jikiObject: result.jikiObject,
    immutableJikiObject: result.jikiObject.clone(),
  };
}
