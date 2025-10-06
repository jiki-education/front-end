import type { Description } from "../../shared/frames";
import type { EvaluationResultReturnStatement } from "../evaluation-result";
import type { ReturnStatement } from "../statement";
import type { FrameWithResult } from "../frameDescribers";
import type { DescriptionContext } from "../../shared/frames";

export function describeReturnStatement(frame: FrameWithResult, _context: DescriptionContext): Description {
  const result = frame.result as EvaluationResultReturnStatement;
  const statement = frame.context as ReturnStatement;

  if (statement.expression === null || result.jikiObject === undefined) {
    // void return - returns None
    return {
      result: `<p>Python returned from the function with <code>None</code>.</p>`,
      steps: [`<li>Python exited the current function.</li>`, `<li>Returned <code>None</code>.</li>`],
    };
  }

  const value = result.jikiObject.toString();
  return {
    result: `<p>Python returned the value <code>${value}</code> from the function.</p>`,
    steps: [
      `<li>Python evaluated the return expression to <code>${value}</code>.</li>`,
      `<li>Python exited the current function, returning <code>${value}</code>.</li>`,
    ],
  };
}
