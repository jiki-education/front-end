import type { Description, DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import type { IfStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import type { FrameWithResult } from "../frameDescribers";

export function describeIfStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as IfStatement;
  const frameResult = frame.result as any; // Using any since IfStatement result type isn't defined
  const conditionValue = formatPyObject(frameResult.immutableJikiObject);
  const isTruthy = frameResult.jikiObject.isTruthy ? frameResult.jikiObject.isTruthy() : !!frameResult.jikiObject.value;

  const result = isTruthy
    ? `<p>The condition evaluated to <code>${conditionValue}</code>, which is truthy, so Python executed the if block.</p>`
    : `<p>The condition evaluated to <code>${conditionValue}</code>, which is falsy, so Python skipped the if block.</p>`;

  const steps = [
    ...describeExpression(statement.condition, frameResult.condition || frameResult, context),
    `<li>Python checked if <code>${conditionValue}</code> is truthy: ${isTruthy ? "yes" : "no"}.</li>`,
    isTruthy ? `<li>Python executed the if block.</li>` : `<li>Python skipped the if block.</li>`,
  ];

  return { result, steps };
}
