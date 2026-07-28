import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";

export function describeContinueStatement(_frame: FrameWithResult, context: DescriptionContext): Description {
  const result = context.t("description.continueStatement.result");
  const steps = [context.t("description.continueStatement.step")];
  return { result, steps };
}
