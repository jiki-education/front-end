import type { Description } from "../../shared/frames";
import type { EvaluationResultReturnStatement } from "../evaluation-result";
import type { ReturnStatement } from "../statement";
import type { FrameWithResult } from "../frameDescribers";
import type { DescriptionContext } from "../../shared/frames";

export function describeReturnStatement(frame: FrameWithResult, _context: DescriptionContext): Description {
  const result = frame.result as EvaluationResultReturnStatement;
  const statement = frame.context as ReturnStatement;

  if (statement.expression === null) {
    // void return
    return {
      result: `<p>JavaScript returned from the function with no value.</p>`,
      steps: [`<li>JavaScript exited the current function.</li>`, `<li>No value was returned.</li>`],
    };
  }

  const value = result.jikiObject.toString();
  return {
    result: `<p>JavaScript returned the value <code>${value}</code> from the function.</p>`,
    steps: [
      `<li>JavaScript evaluated the return expression to <code>${value}</code>.</li>`,
      `<li>JavaScript exited the current function, returning <code>${value}</code>.</li>`,
    ],
  };
}
