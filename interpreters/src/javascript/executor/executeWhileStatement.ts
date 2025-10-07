import type { Executor } from "../executor";
import type { WhileStatement } from "../statement";
import { Environment } from "../environment";
import { isTruthy } from "../helpers";

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

        // Check condition - this should generate a frame
        const conditionResult = executor.executeFrame(statement.condition, () => {
          const result = executor.evaluate(statement.condition);
          return result;
        });

        // Check the condition value using truthiness rules (includes language feature guard)
        const conditionValue = isTruthy(executor, conditionResult.jikiObject, statement.condition.location);

        // If condition is false, break the loop
        if (!conditionValue) {
          break;
        }

        // Execute body with continue handling - this generates its own frames
        executor.executeLoopIteration(() => {
          executor.executeStatement(statement.body);
        });
      }
    });
  } finally {
    executor.environment = previous;
  }
}
