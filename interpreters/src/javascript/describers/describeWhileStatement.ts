import type { WhileStatement } from "../statement";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { EvaluationResultWhileStatement } from "../evaluation-result";
import type { DescriptionContext } from "./types";
import { describeExpression } from "./describeSteps";
import { unwrapJSObject } from "../jikiObjects";

export function describeWhileStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as WhileStatement;
  const result = frame.result as EvaluationResultWhileStatement;

  const conditionValue = Boolean(unwrapJSObject(result.immutableJikiObject));

  const finalStep = conditionValue
    ? context.t("description.whileStatement.step_true")
    : context.t("description.whileStatement.step_false");

  const steps = [...describeExpression(statement.condition, result.condition, context), finalStep];

  return {
    result: conditionValue
      ? context.t("description.whileStatement.result_true")
      : context.t("description.whileStatement.result_false"),
    steps,
  };
}
