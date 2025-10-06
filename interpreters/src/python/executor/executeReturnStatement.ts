import type { Executor } from "../executor";
import { ReturnValue } from "../functions";
import type { ReturnStatement } from "../statement";
import type { EvaluationResultReturnStatement } from "../evaluation-result";
import { createPyObject } from "../jikiObjects";

export function executeReturnStatement(executor: Executor, statement: ReturnStatement): void {
  const evaluationResult = executor.executeFrame(statement, () => {
    if (statement.expression === null) {
      // None return - create a JikiObject with None value
      const noneObj = createPyObject(null);
      return {
        type: "ReturnStatement",
        jikiObject: noneObj,
        immutableJikiObject: noneObj.clone(),
      };
    }

    const value = executor.evaluate(statement.expression);
    return {
      type: "ReturnStatement",
      expression: value,
      jikiObject: value.jikiObject,
      immutableJikiObject: value.jikiObject.clone(),
    };
  }) as EvaluationResultReturnStatement;

  // Throw ReturnValue to unwind the call stack
  throw new ReturnValue(evaluationResult.jikiObject, statement.location);
}
