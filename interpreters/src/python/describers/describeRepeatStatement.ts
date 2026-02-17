import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { EvaluationResultRepeatStatement } from "../evaluation-result";

export function describeRepeatStatement(frame: FrameWithResult, _context: DescriptionContext): Description {
  const frameResult = frame.result as EvaluationResultRepeatStatement;
  const result = `<p>This line started iteration ${frameResult.iteration} of the repeat loop.</p>`;
  const steps = [`<li>Python started iteration ${frameResult.iteration} of the repeat loop.</li>`];
  return { result, steps };
}
