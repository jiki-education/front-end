import type { Description } from "../../shared/frames";
import type { EvaluationResultReturnStatement } from "../evaluation-result";
import type { ReturnStatement } from "../statement";
import type { FrameWithResult } from "../frameDescribers";
import type { DescriptionContext } from "./types";
import { describeExpression } from "./describeSteps";
import { codeTag } from "../helpers";

export function describeReturnStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const result = frame.result as EvaluationResultReturnStatement;
  const statement = frame.context as ReturnStatement;

  if (statement.expression === null) {
    // Naked return - no value
    return {
      result: context.t("description.returnStatement.naked_result"),
      steps: [context.t("description.returnStatement.final")],
    };
  }

  const value = codeTag(result.jikiObject, statement.expression.location);
  const expressionSteps = describeExpression(statement.expression, result.expression!, context);

  return {
    result: context.t("description.returnStatement.value_result", { value }),
    steps: [
      ...expressionSteps,
      context.t("description.returnStatement.value_chute", { value }),
      context.t("description.returnStatement.final"),
    ],
  };
}
