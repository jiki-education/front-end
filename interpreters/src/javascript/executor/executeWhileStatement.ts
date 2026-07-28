import type { Executor } from "../executor";
import type { WhileStatement } from "../statement";
import { Environment } from "../environment";
import { isTruthy } from "../helpers";
import { TIME_SCALE_FACTOR } from "../../entry-shared";

export function executeWhileStatement(executor: Executor, statement: WhileStatement): void {
  // Create a new environment for the while loop
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    // Execute the loop with break handling
    executor.executeLoop(() => {
      while (true) {
        // Guard against infinite loops
        executor.guardInfiniteLoop(statement.location);

        // Check the condition and emit a WhileStatement frame on the loop line
        // (mirrors for-of: the frame carries the condition result so the describer
        // can show the condition's sub-steps and the true/false outcome).
        const frameResult = executor.executeFrame(statement, () => {
          const condition = executor.evaluate(statement.condition);
          return {
            type: "WhileStatement" as const,
            condition,
            jikiObject: condition.jikiObject,
            immutableJikiObject: condition.jikiObject.clone(),
          };
        });

        // Check the condition value using truthiness rules (includes language feature guard)
        const conditionValue = isTruthy(executor, frameResult.condition.jikiObject, statement.condition.location);

        // If condition is false, break the loop
        if (!conditionValue) {
          break;
        }

        // Execute body with continue handling - this generates its own frames
        executor.executeLoopIteration(() => {
          executor.executeStatement(statement.body);
        });

        // Stop looping once the exercise signals completion
        if (executor._exerciseFinished) {
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
