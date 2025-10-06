import type { Description, DescriptionContext } from "../../shared/frames";
import { formatPyObject, getOrdinal } from "./helpers";
import type { EvaluationResultForInStatement } from "../evaluation-result";
import type { FrameWithResult } from "../frameDescribers";

export function describeForInStatement(frame: FrameWithResult, _context: DescriptionContext): Description {
  const frameResult = frame.result as EvaluationResultForInStatement;

  if (frameResult.iteration === 0) {
    const iterableValue = formatPyObject(frameResult.iterable.immutableJikiObject);
    const result = `<p>Python is starting a for loop over <code>${iterableValue}</code>.</p>`;
    const steps = [
      `<li>Python evaluated the iterable expression and got <code>${iterableValue}</code>.</li>`,
      `<li>Python prepared to iterate over the elements.</li>`,
    ];
    return { result, steps };
  }

  const currentValue = formatPyObject(frameResult.currentValue);
  const iterationOrdinal = getOrdinal(frameResult.iteration);

  const result = `<p>Python is on the ${iterationOrdinal} iteration, setting <code>${frameResult.variableName}</code> to <code>${currentValue}</code>.</p>`;
  const steps = [
    `<li>Python retrieved the ${iterationOrdinal} element: <code>${currentValue}</code>.</li>`,
    `<li>Python assigned <code>${currentValue}</code> to the loop variable <code>${frameResult.variableName}</code>.</li>`,
  ];

  return { result, steps };
}
