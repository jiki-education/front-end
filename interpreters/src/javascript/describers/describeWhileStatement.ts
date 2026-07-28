import type { WhileStatement } from "../statement";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import { describeExpression } from "./describeSteps";
import { unwrapJSObject } from "../jikiObjects";

export function describeWhileStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as WhileStatement;
  const conditionResult = frame.result;

  const conditionValue = Boolean(unwrapJSObject(conditionResult.immutableJikiObject));

  let result: string;
  let steps: string[] = [];

  if (conditionValue) {
    result = context.t("description.whileStatement.result_true");
    steps.push(context.t("description.whileStatement.step_true"));
  } else {
    result = context.t("description.whileStatement.result_false");
    steps.push(context.t("description.whileStatement.step_false"));
  }

  const conditionDescription = describeExpression(statement.condition, conditionResult, context);
  steps = [...conditionDescription, steps[0]];

  return { result, steps };
}
