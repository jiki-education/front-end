import type { EvaluationResultExpression, EvaluationResultForStatement } from "../evaluation-result";
import type { EvaluationResultUpdateExpression } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { ForStatement } from "../statement";
import type { Expression } from "../expression";
import { UpdateExpression } from "../expression";
import { describeExpression } from "./describeSteps";
import { codeTag, formatJSObject } from "../helpers";

export function describeForStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as ForStatement;
  const result = frame.result as EvaluationResultForStatement;

  const updateSteps = result.update && statement.update ? describeUpdate(statement.update, result.update, context) : [];

  // A for loop with no condition (`for (;;)`) always runs its body.
  if (result.condition === null) {
    return {
      result: context.t("description.forStatement.result_no_condition"),
      steps: [...updateSteps, context.t("description.forStatement.step_no_condition")],
    };
  }

  const conditionValue = Boolean(result.condition.immutableJikiObject.value);

  return {
    result: conditionValue
      ? context.t("description.forStatement.result_true")
      : context.t("description.forStatement.result_false"),
    steps: [
      ...updateSteps,
      ...describeExpression(statement.condition!, result.condition, context),
      conditionValue
        ? context.t("description.forStatement.step_true")
        : context.t("description.forStatement.step_false"),
    ],
  };
}

// `i++` has no describer of its own (it never used to generate a frame), so
// describe it here. Anything else in the update slot (e.g. `i = i + 1`) has a
// normal expression describer.
function describeUpdate(
  expression: Expression,
  result: EvaluationResultExpression,
  context: DescriptionContext
): string[] {
  if (!(expression instanceof UpdateExpression)) {
    return describeExpression(expression, result, context);
  }

  const updateResult = result as EvaluationResultUpdateExpression;
  const key =
    expression.operator.type === "INCREMENT"
      ? "description.forStatement.step_increased"
      : "description.forStatement.step_decreased";

  return [
    context.t(key, {
      name: codeTag(expression.operand.name.lexeme, expression.operand.location),
      oldValue: codeTag(formatJSObject(updateResult.oldValue), expression.location),
      newValue: codeTag(formatJSObject(updateResult.newValue), expression.location),
    }),
  ];
}
