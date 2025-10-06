import type { Executor } from "../executor";
import type { FunctionCallStatement } from "../statement";
import type { EvaluationResultFunctionCallStatement } from "../evaluation-result";

export function executeFunctionCallStatement(executor: Executor, statement: FunctionCallStatement): void {
  executor.executeFrame<EvaluationResultFunctionCallStatement>(statement, () => {
    const result = executor.visitFunctionCallExpression(statement.expression);

    return {
      type: "FunctionCallStatement",
      jikiObject: result.jikiObject,
      // jikiObject can be undefined for void functions
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      immutableJikiObject: result.jikiObject?.clone(),
      expression: result,
    };
  });
}
