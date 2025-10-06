import type { EvaluationResultExpressionStatement } from "../evaluation-result";
import type { Description, DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import type { ExpressionStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import type { FrameWithResult } from "../frameDescribers";

export function describeExpressionStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as ExpressionStatement;
  const frameResult = frame.result as EvaluationResultExpressionStatement;
  const value = formatPyObject(frameResult.immutableJikiObject);

  // Check if this is a CallExpression for better description
  let result: string;
  let steps: string[];

  if (frameResult.expression.type === "CallExpression") {
    const callResult = frameResult.expression as any;

    // Special handling for print() - similar to JikiScript's log statement
    if (callResult.functionName === "print") {
      const output = callResult.args.map((arg: any) => arg.immutableJikiObject.toString()).join(" ");
      result = output ? `<p>This printed <code>${output}</code>.</p>` : `<p>This printed a blank line.</p>`;
      steps = describeExpression(statement.expression, frameResult.expression, context);
    } else {
      result = `<p>Python used the <code>${callResult.functionName}</code> function and returned <code>${value}</code>.</p>`;
      steps = describeExpression(statement.expression, frameResult.expression, context);
    }
  } else {
    result = `<p>This expression evaluated to <code>${value}</code>.</p>`;
    steps = describeExpression(statement.expression, frameResult.expression, context);
    steps = [...steps, `<li>Python evaluated this expression and got <code>${value}</code>.</li>`];
  }

  return {
    result,
    steps,
  };
}
