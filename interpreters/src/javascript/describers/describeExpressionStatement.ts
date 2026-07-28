import type { EvaluationResultExpressionStatement, EvaluationResultCallExpression } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import { formatJSObject } from "../helpers";
import { JSUndefined } from "../jsObjects/JSUndefined";
import type { ExpressionStatement } from "../statement";
import { CallExpression, AssignmentExpression } from "../expression";
import { describeExpression } from "./describeSteps";

export function describeExpressionStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const expressionStatement = frame.context as ExpressionStatement;
  const frameResult = frame.result as EvaluationResultExpressionStatement;
  const value = formatJSObject(frameResult.immutableJikiObject);

  // Special case for function calls - more educational description
  if (expressionStatement.expression instanceof CallExpression) {
    const callResult = frameResult.expression as EvaluationResultCallExpression;
    const functionName = callResult.functionName || context.t("description.common.defaultFunctionName");
    const argCount = expressionStatement.expression.args.length;
    // The leading space is glue, kept in TS so the catalog values carry no
    // leading/trailing whitespace (enforced by the translations guard).
    const argsDesc = argCount > 0 ? " " + context.t("description.expressionStatement.args", { count: argCount }) : "";

    // Omit "and got undefined" for void functions
    const retDesc =
      callResult.jikiObject instanceof JSUndefined
        ? ""
        : " " + context.t("description.expressionStatement.ret", { value });
    const result = context.t("description.expressionStatement.result_call", {
      functionName,
      args: argsDesc,
      ret: retDesc,
    });
    const steps = describeExpression(expressionStatement.expression, frameResult.expression, context);

    return {
      result,
      steps,
    };
  }

  // Special case for assignment expressions - show what variable changed
  if (expressionStatement.expression instanceof AssignmentExpression) {
    const result = context.t("description.expressionStatement.result_default", { value });
    const steps = describeExpression(expressionStatement.expression, frameResult.expression, context);

    return {
      result,
      steps,
    };
  }

  // Default behavior for other expressions
  const result = context.t("description.expressionStatement.result_default", { value });
  let steps = describeExpression(expressionStatement.expression, frameResult.expression, context);
  steps = [...steps, context.t("description.expressionStatement.step_default", { value })];

  return {
    result,
    steps,
  };
}
