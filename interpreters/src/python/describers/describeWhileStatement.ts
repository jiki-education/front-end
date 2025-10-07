import type { Description, DescriptionContext } from "../../shared/frames";
import type { EvaluationResultWhileStatement } from "../evaluation-result";
import type { FrameWithResult } from "../frameDescribers";
import type { WhileStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { PyBoolean } from "../jikiObjects";

export function describeWhileStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as WhileStatement;
  const frameResult = frame.result as EvaluationResultWhileStatement;
  const conditionResult = frameResult.condition;

  // Determine condition value using Python truthiness rules
  const conditionValue =
    conditionResult.immutableJikiObject instanceof PyBoolean
      ? conditionResult.immutableJikiObject.value
      : Boolean(conditionResult.immutableJikiObject.value);

  let result: string;
  let steps: string[] = [];

  if (conditionValue) {
    result = `<p>The while loop condition evaluated to <code>True</code> so the loop will continue.</p>`;
    steps.push(`<li>Python evaluated the condition to <code>True</code> and decided to execute the loop body.</li>`);
  } else {
    result = `<p>The while loop condition evaluated to <code>False</code> so the loop will exit.</p>`;
    steps.push(`<li>Python evaluated the condition to <code>False</code> and decided to exit the loop.</li>`);
  }

  // Add condition expression steps
  const conditionDescription = describeExpression(statement.condition, conditionResult, context);
  steps = [...conditionDescription, steps[0]];

  return { result, steps };
}
