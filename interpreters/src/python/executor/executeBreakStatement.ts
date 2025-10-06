import type { Executor } from "../executor";
import type { BreakStatement } from "../statement";
import type { EvaluationResultBreakStatement } from "../evaluation-result";
import { BreakFlowControlError } from "./executeForInStatement";

export function executeBreakStatement(executor: Executor, statement: BreakStatement): void {
  executor.executeFrame<EvaluationResultBreakStatement>(statement, () => {
    return {
      type: "BreakStatement",
    };
  });

  throw new BreakFlowControlError(statement.location);
}
