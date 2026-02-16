import type { EvaluationResultRepeatStatement } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { RepeatStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { addOrdinalSuffix } from "./helpers";
import { unwrapJSObject } from "../jikiObjects";

export function describeRepeatStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const frameContext = frame.context as RepeatStatement;
  const frameResult = frame.result as EvaluationResultRepeatStatement;

  let res;
  if (unwrapJSObject(frameResult.count.jikiObject) === 0) {
    res = describeNoRepeats(frameResult);
  } else {
    res = describeRepeat(frameResult);
  }
  return {
    result: res.result,
    steps: [...describeExpression(frameContext.count, frameResult.count, context), ...res.steps],
  };
}

function describeNoRepeats(_frameResult: EvaluationResultRepeatStatement): Description {
  const result = `<p>The repeat block was asked to run <code>0</code> times so this line did nothing.</p>`;
  const steps = [
    `<li>JavaScript saw that the loop should be run <code>0</code> times and so decided not to do anything further on this line.</li>`,
  ];
  return { result, steps };
}

function describeRepeat(frameResult: EvaluationResultRepeatStatement): Description {
  const ordinaledIteration = addOrdinalSuffix(frameResult.iteration);
  const countValue = unwrapJSObject(frameResult.count.jikiObject);
  const result = `<p>This line started the ${ordinaledIteration} iteration of this repeat block.</p>`;
  const steps = [
    `<li>JavaScript increased its internal counter for this loop to <code>${frameResult.iteration}</code>, checked <code>${frameResult.iteration} &le; ${countValue}</code>, and decided to run the code block.</li>`,
  ];
  return { result, steps };
}
