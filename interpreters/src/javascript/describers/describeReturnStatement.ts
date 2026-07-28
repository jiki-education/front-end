import type { Description } from "../../shared/frames";
import type { EvaluationResultReturnStatement } from "../evaluation-result";
import type { ReturnStatement } from "../statement";
import type { FrameWithResult } from "../frameDescribers";
import type { DescriptionContext } from "./types";

export function describeReturnStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const result = frame.result as EvaluationResultReturnStatement;
  const statement = frame.context as ReturnStatement;

  if (statement.expression === null) {
    // void return
    return {
      result: context.t("description.returnStatement.void.result"),
      steps: [context.t("description.returnStatement.void.step1"), context.t("description.returnStatement.void.step2")],
    };
  }

  const value = result.jikiObject.toDisplayString();
  return {
    result: context.t("description.returnStatement.value.result", { value }),
    steps: [
      context.t("description.returnStatement.value.step1", { value }),
      context.t("description.returnStatement.value.step2", { value }),
    ],
  };
}
