import type { Executor } from "../executor";
import type { ForStatement } from "../statement";
import type { EvaluationResultExpression, EvaluationResultForStatement } from "../evaluation-result";
import { Environment } from "../environment";
import { VariableDeclaration } from "../statement";
import { TIME_SCALE_FACTOR } from "../../entry-shared";

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

    // Execute the loop with break handling
    executor.executeLoop(() => {
      let iteration = 0;
      // The update runs at the end of an iteration but is described at the top of
      // the next one, so that each trip round the loop is a single frame on the
      // `for` line and the body's frames still see the pre-update value.
      let update: EvaluationResultExpression | null = null;

      while (true) {
        // Guard against infinite loops
        executor.guardInfiniteLoop(statement.location);

        iteration++;

        // One frame per iteration on the `for` line, carrying the previous
        // iteration's update and this iteration's condition check (mirrors
        // while/for-of: separate frames per header part had no describers).
        const frameResult = executor.executeFrame<EvaluationResultForStatement>(statement, () => {
          let condition: EvaluationResultExpression | null = null;
          if (statement.condition) {
            condition = executor.evaluate(statement.condition);
            executor.verifyBoolean(condition.jikiObject, statement.condition.location);
          }

          return {
            type: "ForStatement" as const,
            condition,
            update,
            iteration,
          };
        });

        // If condition is false, break the loop
        if (frameResult.condition && !frameResult.condition.jikiObject.value) {
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

        // Execute update (if present). No frame of its own - it is described on
        // the next iteration's frame.
        if (statement.update) {
          update = executor.evaluate(statement.update);
        }
      }
    });
  } finally {
    executor.environment = previous;
  }
}
