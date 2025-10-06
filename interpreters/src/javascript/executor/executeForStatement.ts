import type { Executor } from "../executor";
import type { ForStatement } from "../statement";
import { Environment } from "../environment";
import { VariableDeclaration } from "../statement";

export function executeForStatement(executor: Executor, statement: ForStatement): void {
  // Create a new environment for the for loop
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    // Execute init (if present) - this generates its own frame
    if (statement.init) {
      if (statement.init instanceof VariableDeclaration) {
        executor.executeStatement(statement.init);
      } else {
        // It's an expression - wrap in executeFrame
        executor.executeFrame(statement.init, () => {
          const result = executor.evaluate(statement.init!);
          return result;
        });
      }
    }

    // Execute the loop
    while (true) {
      // Check condition (if present) - this should generate a frame
      if (statement.condition) {
        const conditionResult = executor.executeFrame(statement.condition, () => {
          const result = executor.evaluate(statement.condition!);
          executor.verifyBoolean(result.jikiObject, statement.condition!.location);
          return result;
        });

        // If condition is false, break the loop
        if (!conditionResult.jikiObject.value) {
          break;
        }
      }

      // Execute body - this generates its own frames
      executor.executeStatement(statement.body);

      // Execute update (if present) - this should generate a frame
      if (statement.update) {
        executor.executeFrame(statement.update, () => {
          const result = executor.evaluate(statement.update!);
          return result;
        });
      }
    }
  } finally {
    executor.environment = previous;
  }
}
