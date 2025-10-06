import type { Executor } from "../executor";
import type { MethodCallStatement } from "../statement";
import type { EvaluationResultMethodCallStatement } from "../evaluation-result";

export function executeMethodCallStatement(executor: Executor, statement: MethodCallStatement): void {
  executor.executeFrame<EvaluationResultMethodCallStatement>(statement, () => {
    const result = executor.visitMethodCallExpression(statement.expression);

    return {
      type: "MethodCallStatement",
      jikiObject: result.jikiObject,
      // jikiObject can be undefined for void methods
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      immutableJikiObject: result.jikiObject?.clone(),
      expression: result,
    };
  });
}
