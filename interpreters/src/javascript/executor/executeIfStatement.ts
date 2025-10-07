import type { EvaluationResultIfStatement } from "../evaluation-result";
import type { Executor } from "../executor";
import type { IfStatement } from "../statement";
import { isTruthy } from "../helpers";

export function executeIfStatement(executor: Executor, statement: IfStatement) {
  let conditionValue!: boolean;

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
    executor.executeStatement(statement.thenBranch);
    return;
  }

  if (statement.elseBranch === null) {
    return;
  }
  executor.executeStatement(statement.elseBranch);
}
