import type { Executor } from "../executor";
import type { BreakStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { BreakFlowControlError } from "./executeForInStatement";

export type EvaluationResultBreakStatement = EvaluationResult & {
  type: "BreakStatement";
};

export function executeBreakStatement(executor: Executor, statement: BreakStatement): void {
  executor.executeFrame<EvaluationResultBreakStatement>(statement, () => {
    return {
      type: "BreakStatement",
      jikiObject: null as any, // Break doesn't produce a value
      immutableJikiObject: null as any,
    };
  });

  throw new BreakFlowControlError(statement.location);
}
