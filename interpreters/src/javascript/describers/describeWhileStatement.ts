import type { WhileStatement } from "../statement";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import { describeExpression } from "./describeSteps";
import { unwrapJSObject } from "../jikiObjects";

export function describeWhileStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as WhileStatement;
  const conditionResult = frame.result;

  const conditionValue = Boolean(unwrapJSObject(conditionResult.immutableJikiObject));

  let result: string;
  let steps: string[] = [];

  if (conditionValue) {
    result = `<p>The while loop condition evaluated to <code>true</code> so the loop will continue.</p>`;
    steps.push(
      `<li>JavaScript evaluated the condition to <code>true</code> and decided to execute the loop body.</li>`
    );
  } else {
    result = `<p>The while loop condition evaluated to <code>false</code> so the loop will exit.</p>`;
    steps.push(`<li>JavaScript evaluated the condition to <code>false</code> and decided to exit the loop.</li>`);
  }

  const conditionDescription = describeExpression(statement.condition, conditionResult, context);
  steps = [...conditionDescription, steps[0]];

  return { result, steps };
}
