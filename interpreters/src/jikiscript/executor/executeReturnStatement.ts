import type { Executor } from "../executor";
import { ReturnValue } from "../functions";
import type { ReturnStatement } from "../statement";
import type { EvaluationResultReturnStatement } from "../evaluation-result";

export function executeReturnStatement(executor: Executor, statement: ReturnStatement): void {
  const evaluationResult = executor.executeFrame<EvaluationResultReturnStatement>(statement, () => {
    if (statement.expression === null) {
      return {
        type: "ReturnStatement",
        jikiObject: undefined,
      };
    }

    const value = executor.evaluate(statement.expression);
    return {
      type: "ReturnStatement",
      expression: value,
      jikiObject: value.jikiObject,
      // jikiObject can be undefined for void returns
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      immutableJikiObject: value.jikiObject?.clone(),
    };
  });
  // evaluationResult can be undefined for bare return statements
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  throw new ReturnValue(evaluationResult?.jikiObject, statement.location);
}
