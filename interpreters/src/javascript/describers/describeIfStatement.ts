import type { EvaluationResultIfStatement } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { IfStatement } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeIfStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const ifStatement = frame.context as IfStatement;
  const result = frame.result as EvaluationResultIfStatement;

  let steps = describeExpression(ifStatement.condition, result.condition, context);
  steps = [...steps, describeFinalStep(result, ifStatement, context)];

  return {
    result: describeResult(result, ifStatement, context),
    steps,
  };
}

function describeFinalStep(
  result: EvaluationResultIfStatement,
  statement: IfStatement,
  context: DescriptionContext
): string {
  const conditionValue = Boolean(result.immutableJikiObject.value);

  if (conditionValue) {
    return context.t("description.ifStatement.step_true");
  }
  if (statement.elseBranch) {
    return context.t("description.ifStatement.step_false_else");
  }
  return context.t("description.ifStatement.step_false");
}

function describeResult(
  result: EvaluationResultIfStatement,
  statement: IfStatement,
  context: DescriptionContext
): string {
  const conditionValue = Boolean(result.immutableJikiObject.value);

  if (conditionValue) {
    return context.t("description.ifStatement.result_true");
  }
  if (statement.elseBranch) {
    return context.t("description.ifStatement.result_false_else");
  }
  return context.t("description.ifStatement.result_false");
}
