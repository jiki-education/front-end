import type { Executor } from "../executor";
import type { ContinueStatement } from "../statement";
import type { EvaluationResultContinueStatement } from "../evaluation-result";
import { ContinueFlowControlError } from "./executeForInStatement";

export function executeContinueStatement(executor: Executor, statement: ContinueStatement): void {
  executor.executeFrame<EvaluationResultContinueStatement>(statement, () => {
    return {
      type: "ContinueStatement",
    };
  });

  throw new ContinueFlowControlError(statement.location);
}
