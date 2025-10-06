import type { EvaluationResultIfStatement } from "../evaluation-result";
import type { Executor } from "../executor";
import type { IfStatement } from "../statement";

export function executeIfStatement(executor: Executor, statement: IfStatement) {
  const conditionResult = executor.executeFrame<EvaluationResultIfStatement>(statement, () =>
    executeCondition(executor, statement)
  );

  if (conditionResult.jikiObject.value) {
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

  // Verify that the condition is a boolean if truthiness is disabled
  executor.verifyBoolean(result.jikiObject, statement.condition.location);

  return {
    type: "IfStatement",
    condition: result,
    jikiObject: result.jikiObject,
    immutableJikiObject: result.jikiObject.clone(),
  };
}
