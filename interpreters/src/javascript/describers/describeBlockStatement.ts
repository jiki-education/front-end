import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { BlockStatement } from "../statement";

export function describeBlockStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const blockStatement = frame.context as BlockStatement;
  const statementCount = blockStatement.statements.length;

  let result: string;
  let steps: string[];

  if (statementCount === 0) {
    result = context.t("description.blockStatement.result_zero");
    steps = [context.t("description.blockStatement.step_zero")];
  } else if (statementCount === 1) {
    result = context.t("description.blockStatement.result_one");
    steps = [
      context.t("description.blockStatement.step_enter"),
      context.t("description.blockStatement.step_one_executed"),
      context.t("description.blockStatement.step_exit"),
    ];
  } else {
    result = context.t("description.blockStatement.result_other", { count: statementCount });
    steps = [
      context.t("description.blockStatement.step_enter"),
      context.t("description.blockStatement.step_other_executed", { count: statementCount }),
      context.t("description.blockStatement.step_exit"),
    ];
  }

  return {
    result,
    steps,
  };
}
