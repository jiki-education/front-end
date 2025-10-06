import type { Executor } from "../executor";
import type { ContinueStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { ContinueFlowControlError } from "./executeForInStatement";

export type EvaluationResultContinueStatement = EvaluationResult & {
  type: "ContinueStatement";
};

export function executeContinueStatement(executor: Executor, statement: ContinueStatement): void {
  executor.executeFrame<EvaluationResultContinueStatement>(statement, () => {
    return {
      type: "ContinueStatement",
      jikiObject: null as any, // Continue doesn't produce a value
      immutableJikiObject: null as any,
    };
  });

  throw new ContinueFlowControlError(statement.location);
}
