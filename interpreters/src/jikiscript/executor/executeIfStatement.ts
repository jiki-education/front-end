import type { EvaluationResultIfStatement } from "../evaluation-result";
import type { Executor } from "../executor";
import type { Expression } from "../expression";
import type { IfStatement } from "../statement";

export function executeIfStatement(executor: Executor, statement: IfStatement) {
  const conditionResult = executor.executeFrame<EvaluationResultIfStatement>(statement, () =>
    executeCondition(executor, statement.condition)
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

function executeCondition(executor: Executor, condition: Expression): EvaluationResultIfStatement {
  const result = executor.evaluate(condition);
  executor.verifyBoolean(result.jikiObject, condition);

  return {
    type: "IfStatement",
    condition: result,
    jikiObject: result.jikiObject,
    immutableJikiObject: result.jikiObject.clone(),
  };
}
