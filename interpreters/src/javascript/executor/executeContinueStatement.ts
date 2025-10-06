import type { Executor } from "../executor";
import type { ContinueStatement } from "../statement";
import type { EvaluationResultContinueStatement } from "../evaluation-result";
import type { Location } from "../../shared/location";

export class ContinueFlowControlError extends Error {
  constructor(public location: Location) {
    super();
  }
}

export function executeContinueStatement(executor: Executor, statement: ContinueStatement): void {
  executor.executeFrame<EvaluationResultContinueStatement>(statement, () => {
    return {
      type: "ContinueStatement",
    } as EvaluationResultContinueStatement;
  });

  throw new ContinueFlowControlError(statement.location);
}
