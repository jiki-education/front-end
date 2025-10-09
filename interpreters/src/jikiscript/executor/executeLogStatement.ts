import type { Executor } from "../executor";
import type { LogStatement } from "../statement";
import type { EvaluationResultLogStatement } from "../evaluation-result";

export function executeLogStatement(executor: Executor, statement: LogStatement): void {
  executor.executeFrame<EvaluationResultLogStatement>(statement, () => {
    const value = executor.evaluate(statement.expression);

    // Log the output to logLines
    const output = value.jikiObject.toString();
    executor.log(output);

    return {
      type: "LogStatement",
      expression: value,
      jikiObject: value.jikiObject,
      immutableJikiObject: value.jikiObject.clone(), // For now, just reference the same object
    };
  });
}
