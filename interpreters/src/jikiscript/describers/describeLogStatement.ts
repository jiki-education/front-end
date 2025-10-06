import type { EvaluationResultLogStatement } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import { formatJikiObject } from "../helpers";
import type { LogStatement } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeLogStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const logStatement = frame.context as LogStatement;
  const frameResult = frame.result as EvaluationResultLogStatement;
  // Use immutableJikiObject if available, otherwise fall back to jikiObject
  const value = formatJikiObject(frameResult.immutableJikiObject);

  const result = `<p> This logged <code>${value}</code>.</p>`;
  let steps = describeExpression(logStatement.expression, frameResult.expression, context);
  steps = [...steps, `<li>Jiki wrote <code>${value}</code> here for you!</li>`];

  return {
    result,
    steps,
  };
}
