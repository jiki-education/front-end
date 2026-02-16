import type { Executor } from "../executor";
import type { RepeatStatement } from "../statement";
import type { EvaluationResultRepeatStatement } from "../evaluation-result";
import { Environment } from "../environment";
import { JSNumber } from "../jikiObjects";

export function executeRepeatStatement(executor: Executor, statement: RepeatStatement): void {
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
  const max = executor.languageFeatures.maxTotalLoopIterations ?? 10000;
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

  // Create a new environment for the repeat loop (same scoping as for loop)
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    executor.executeLoop(() => {
      let iteration = 0;
      while (iteration < count.value) {
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
      }
    });
  } finally {
    executor.environment = previous;
  }
}
