import type { Executor } from "../executor";
import type { RepeatStatement } from "../statement";
import type { EvaluationResultExpression, EvaluationResultRepeatStatement } from "../evaluation-result";
import { Environment } from "../environment";
import { JSNumber } from "../jikiObjects";
import { TIME_SCALE_FACTOR } from "../../entry-shared";

export function executeRepeatStatement(executor: Executor, statement: RepeatStatement): void {
  // No-argument repeat: runs until the exercise signals completion (_exerciseFinished),
  // bounded only by the infinite-loop guard. Passing a null count makes the loop rely on
  // guardInfiniteLoop to stop it, so hitting maxTotalLoopIterations raises MaxIterationsReached
  // rather than silently exiting one iteration before the guard would fire.
  if (statement.count === null) {
    executeLoop(executor, statement, null, null);
    return;
  }

  // Evaluate the count expression
  const countResult = executor.evaluate(statement.count);
  const count = countResult.jikiObject;

  // Validate: must be a number
  if (!(count instanceof JSNumber)) {
    executor.error("RepeatCountMustBeNumber", statement.count.location, {
      type: count.type,
    });
  }

  // Validate: must be non-negative
  if (count.value < 0) {
    executor.error("RepeatCountMustBeNonNegative", statement.count.location, {
      value: count.value,
    });
  }

  // Validate: must not exceed max iterations
  const max = executor.languageFeatures.maxTotalLoopIterations ?? 1000;
  if (count.value > max) {
    executor.error("RepeatCountTooHigh", statement.count.location, {
      value: count.value,
      max,
    });
  }

  // Handle zero iterations
  if (count.value === 0) {
    executor.executeFrame<EvaluationResultRepeatStatement>(statement, () => {
      return {
        type: "RepeatStatement",
        count: countResult,
        iteration: 0,
      };
    });
    return;
  }
  executeLoop(executor, statement, count.value, countResult);
}

function executeLoop(
  executor: Executor,
  statement: RepeatStatement,
  count: number | null,
  countResult: EvaluationResultExpression | null
) {
  // Create a new environment for the repeat loop (same scoping as for loop)
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    executor.executeLoop(() => {
      let iteration = 0;
      while (count === null || iteration < count) {
        iteration++;
        executor.guardInfiniteLoop(statement.keyword.location);

        executor.executeFrame<EvaluationResultRepeatStatement>(statement, () => {
          return {
            type: "RepeatStatement",
            count: countResult,
            iteration,
          };
        });

        executor.executeLoopIteration(() => {
          executor.executeStatement(statement.body);
        });

        if (countResult == null && executor._exerciseFinished) {
          break;
        }

        // Delay repeat for things like animations
        executor.time += (executor.languageFeatures.repeatDelay ?? 0) * TIME_SCALE_FACTOR;
      }
    });
  } finally {
    executor.environment = previous;
  }
}
