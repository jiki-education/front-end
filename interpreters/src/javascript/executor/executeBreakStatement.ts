import type { Executor } from "../executor";
import type { BreakStatement } from "../statement";
import type { EvaluationResultBreakStatement } from "../evaluation-result";
import type { Location } from "../../shared/location";

export class BreakFlowControlError extends Error {
  constructor(public location: Location) {
    super();
  }
}

export function executeBreakStatement(executor: Executor, statement: BreakStatement): void {
  executor.executeFrame<EvaluationResultBreakStatement>(statement, () => {
    return {
      type: "BreakStatement",
    } as EvaluationResultBreakStatement;
  });

  throw new BreakFlowControlError(statement.location);
}
