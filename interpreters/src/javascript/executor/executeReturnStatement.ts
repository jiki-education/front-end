import type { Executor } from "../executor";
import { ReturnValue } from "../functions";
import type { ReturnStatement } from "../statement";
import type { EvaluationResultReturnStatement } from "../evaluation-result";
import { createJSObject } from "../jikiObjects";

export function executeReturnStatement(executor: Executor, statement: ReturnStatement): void {
  const evaluationResult = executor.executeFrame(statement, () => {
    if (statement.expression === null) {
      // Void return - create a JikiObject with undefined value
      const undefinedObj = createJSObject(undefined);
      return {
        type: "ReturnStatement",
        jikiObject: undefinedObj,
        immutableJikiObject: undefinedObj.clone(),
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

  // evaluationResult can be undefined for bare return statements
  throw new ReturnValue(evaluationResult.jikiObject, statement.location);
}
