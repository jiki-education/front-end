import type { Executor } from "../executor";
import type { ContinueStatement } from "../statement";
import type { EvaluationResultContinueStatement } from "../evaluation-result";
import type { Location } from "../../shared/location";

export class ContinueFlowControlError extends Error {
  constructor(
    public location: Location,
    public lexeme: string
  ) {
    super();
  }
}

export function executeContinueStatement(executor: Executor, statement: ContinueStatement): void {
  const result: EvaluationResultContinueStatement = {
    type: "ContinueStatement",
  };

  executor.addSuccessFrame(statement.location, result as any, statement);

  throw new ContinueFlowControlError(statement.location, statement.keyword.lexeme);
}
