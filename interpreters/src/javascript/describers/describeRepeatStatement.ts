import type { EvaluationResultRepeatStatement } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { RepeatStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { unwrapJSObject } from "../jikiObjects";

export function describeRepeatStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const frameContext = frame.context as RepeatStatement;
  const frameResult = frame.result as EvaluationResultRepeatStatement;

  // No-argument repeat (forever loop) - no count to describe
  if (frameResult.count === null) {
    const ordinal = { count: frameResult.iteration, ordinal: true };
    const result = context.t("description.repeatStatement.foreverResult", ordinal);
    const steps = [context.t("description.repeatStatement.foreverStep", ordinal)];
    return { result, steps };
  }

  let res;
  if (unwrapJSObject(frameResult.count.jikiObject) === 0) {
    res = describeNoRepeats(frameResult, context);
  } else {
    res = describeRepeat(frameResult, context);
  }
  return {
    result: res.result,
    steps: [...describeExpression(frameContext.count!, frameResult.count, context), ...res.steps],
  };
}

function describeNoRepeats(_frameResult: EvaluationResultRepeatStatement, context: DescriptionContext): Description {
  const result = context.t("description.repeatStatement.zeroResult");
  const steps = [context.t("description.repeatStatement.zeroStep")];
  return { result, steps };
}

function describeRepeat(frameResult: EvaluationResultRepeatStatement, context: DescriptionContext): Description {
  const countValue = unwrapJSObject(frameResult.count!.jikiObject);
  const result = context.t("description.repeatStatement.repeatResult", {
    count: frameResult.iteration,
    ordinal: true,
  });
  const steps = [
    context.t("description.repeatStatement.repeatStep", {
      iteration: frameResult.iteration,
      countValue,
    }),
  ];
  return { result, steps };
}
