import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";

export function describeBreakStatement(_frame: FrameWithResult, context: DescriptionContext): Description {
  const result = context.t("description.breakStatement.result");
  const steps = [context.t("description.breakStatement.step")];
  return { result, steps };
}
