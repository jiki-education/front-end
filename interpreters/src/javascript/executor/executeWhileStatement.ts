import type { Executor } from "../executor";
import type { WhileStatement } from "../statement";
import { Environment } from "../environment";

export function executeWhileStatement(executor: Executor, statement: WhileStatement): void {
  // Create a new environment for the while loop
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    // Execute the loop
    while (true) {
      // Check condition - this should generate a frame
      const conditionResult = executor.executeFrame(statement.condition, () => {
        const result = executor.evaluate(statement.condition);
        executor.verifyBoolean(result.jikiObject, statement.condition.location);
        return result;
      });

      // If condition is false, break the loop
      if (!conditionResult.jikiObject.value) {
        break;
      }

      // Execute body - this generates its own frames
      executor.executeStatement(statement.body);
    }
  } finally {
    executor.environment = previous;
  }
}
