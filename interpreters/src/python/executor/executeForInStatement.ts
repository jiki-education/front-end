import type { Executor } from "../executor";
import type { ForInStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { PyList, PyString, PyNumber, PyBoolean, PyNone, type JikiObject } from "../jikiObjects";
import type { Location } from "../../shared/location";

// Flow control errors for break and continue
export class BreakFlowControlError extends Error {
  constructor(public location: Location) {
    super();
  }
}

export class ContinueFlowControlError extends Error {
  constructor(public location: Location) {
    super();
  }
}

export type EvaluationResultForInStatement = EvaluationResult & {
  type: "ForInStatement";
  variableName: string;
  iterable: EvaluationResult;
  currentValue?: JikiObject;
  iteration: number;
};

export function executeForInStatement(executor: Executor, statement: ForInStatement): EvaluationResult | null {
  // Evaluate the iterable expression
  const iterableResult = executor.evaluate(statement.iterable);
  const iterable = iterableResult.jikiObject;

  // Check if the object is iterable (list or string for now)
  let items: JikiObject[] = [];
  if (iterable instanceof PyList) {
    items = iterable.value;
  } else if (iterable instanceof PyString) {
    // Convert string to array of character PyStrings
    items = iterable.value.split("").map(char => new PyString(char));
  } else {
    // Get the proper Python type name
    const typeName =
      iterable instanceof PyNumber
        ? iterable.pythonTypeName()
        : iterable instanceof PyBoolean
          ? "bool"
          : iterable instanceof PyNone
            ? "NoneType"
            : iterable.type;

    executor.error("TypeError", statement.iterable.location, {
      message: `'${typeName}' object is not iterable`,
    });
  }

  const variableName = statement.variable.lexeme;

  // Create initial frame showing we're starting the loop
  executor.executeFrame<EvaluationResultForInStatement>(statement, () => {
    return {
      type: "ForInStatement",
      variableName,
      iterable: iterableResult,
      iteration: 0,
      jikiObject: iterableResult.jikiObject,
      immutableJikiObject: iterableResult.immutableJikiObject,
    };
  });

  // If the iterable is empty, we're done
  if (items.length === 0) {
    return null;
  }

  // Execute the loop
  let iteration = 0;
  for (const item of items) {
    iteration++;

    // Set the loop variable
    executor.environment.define(variableName, item);

    // Create a frame for this iteration
    executor.executeFrame<EvaluationResultForInStatement>(statement, () => {
      return {
        type: "ForInStatement",
        variableName,
        iterable: iterableResult,
        currentValue: item,
        iteration,
        jikiObject: item,
        immutableJikiObject: item.clone(),
      };
    });

    // Execute the body statements
    try {
      for (const bodyStatement of statement.body) {
        executor.executeStatement(bodyStatement);
      }
    } catch (error) {
      if (error instanceof BreakFlowControlError) {
        // Break out of the loop
        break;
      } else if (error instanceof ContinueFlowControlError) {
        // Continue to the next iteration
        continue;
      } else {
        // Re-throw other errors
        throw error;
      }
    }
  }

  return null;
}
