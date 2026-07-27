import type { Executor } from "../executor";
import type { ForInStatement } from "../statement";
import { Environment } from "../environment";
import { JSDictionary, JSString } from "../jikiObjects";

export function executeForInStatement(executor: Executor, statement: ForInStatement): void {
  // Evaluate the object expression. This does NOT generate its own frame:
  // the object value is surfaced as part of each ForInStatement iteration frame
  // (and the empty-object frame). Generating a separate frame here produced an
  // extra, describer-less frame on the `for` line ("There is no information
  // available for this line").
  const objectResult = executor.evaluate(statement.object);

  const obj = objectResult.jikiObject;

  // Check if the value is a dictionary
  if (!(obj instanceof JSDictionary)) {
    executor.error("ForInLoopTargetNotObject", statement.object.location, {
      type: obj.constructor.name,
      value: obj.toString(),
    });
    return;
  }

  // Get the keys to iterate over
  const keys = Array.from(obj.value.keys());

  // If the dictionary is empty, generate a single frame showing the for...in setup
  if (keys.length === 0) {
    executor.executeFrame(statement, () => {
      return {
        type: "ForInStatement" as const,
        variable: statement.variable.lexeme,
        object: objectResult,
        iteration: 0,
        immutableJikiObject: obj.clone(),
      };
    });
    return;
  }

  // Create a new environment for the for...in loop
  const loopEnvironment = new Environment(executor.languageFeatures, executor.environment);
  const previous = executor.environment;

  try {
    executor.environment = loopEnvironment;

    // Execute the loop with break/continue handling
    executor.executeLoop(() => {
      let iteration = 0;

      for (const key of keys) {
        iteration++;

        // Guard against infinite loops
        executor.guardInfiniteLoop(statement.location);

        const keyValue = new JSString(key);

        // Define the loop variable in the loop environment
        executor.environment.define(statement.variable.lexeme, keyValue, statement.variable.location);

        // Generate a frame for this iteration
        executor.executeFrame(statement, () => {
          return {
            type: "ForInStatement" as const,
            variable: statement.variable.lexeme,
            object: objectResult,
            currentKey: keyValue,
            iteration,
            immutableJikiObject: keyValue.clone(),
          };
        });

        // Execute the loop body with continue handling
        executor.executeLoopIteration(() => {
          executor.executeStatement(statement.body);
        });

        // Stop looping once the exercise signals completion
        if (executor._exerciseFinished) {
          break;
        }
      }
    });
  } finally {
    executor.environment = previous;
  }
}
