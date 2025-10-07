import type { Executor } from "../executor";
import type { ForOfStatement } from "../statement";
import { Environment } from "../environment";
import { JSArray, JSString } from "../jikiObjects";

export function executeForOfStatement(executor: Executor, statement: ForOfStatement): void {
  // Evaluate the iterable expression
  const iterableResult = executor.executeFrame(statement.iterable, () => {
    return executor.evaluate(statement.iterable);
  });

  const iterable = iterableResult.jikiObject;

  // Check if the value is iterable (JSArray or JSString)
  if (!(iterable instanceof JSArray) && !(iterable instanceof JSString)) {
    executor.error("ForOfLoopTargetNotIterable", statement.iterable.location, {
      type: iterable.constructor.name,
      value: iterable.toString(),
    });
    return;
  }

  // Get the array of elements to iterate over
  const elements = iterable.value;

  // If the iterable is empty, generate a single frame showing the for...of setup
  if (elements.length === 0) {
    executor.executeFrame(statement, () => {
      return {
        type: "ForOfStatement" as const,
        variable: statement.variable.lexeme,
        iterable: iterableResult,
        iteration: 0,
        immutableJikiObject: iterable.clone(),
      };
    });
    return;
  }

  // Create a new environment for the for...of loop
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    // Execute the loop with break/continue handling
    executor.executeLoop(() => {
      let iteration = 0;

      for (const element of elements) {
        iteration++;

        // Guard against infinite loops
        executor.guardInfiniteLoop(statement.location);

        // Convert string characters to JSString if needed
        const elementValue = typeof element === "string" ? new JSString(element) : element;

        // Define the loop variable in the loop environment
        executor.environment.define(statement.variable.lexeme, elementValue, statement.variable.location);

        // Generate a frame for this iteration
        executor.executeFrame(statement, () => {
          return {
            type: "ForOfStatement" as const,
            variable: statement.variable.lexeme,
            iterable: iterableResult,
            currentElement: elementValue,
            iteration,
            immutableJikiObject: elementValue.clone(),
          };
        });

        // Execute the loop body with continue handling
        executor.executeLoopIteration(() => {
          executor.executeStatement(statement.body);
        });

        // Remove the loop variable before the next iteration
        // (it will be redefined in the next iteration)
      }
    });
  } finally {
    executor.environment = previous;
  }
}
