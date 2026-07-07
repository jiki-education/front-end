import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import { type Executor, RuntimeError, type RuntimeErrorType } from "../executor";
import type { MemberExpression } from "../expression";
import { type JikiObject, JSString, JSStdLibFunction } from "../jsObjects";
import type { Property, Method } from "../stdlib";
import { getStdlibType, stdlib, isStdlibMemberAllowed, StdlibError } from "../stdlib";
import { translate } from "../translator";

// Generic stdlib member resolution
export function executeStdlibMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  object: JikiObject
): EvaluationResultMemberExpression {
  // Check if this object type has stdlib members
  const stdlibType = getStdlibType(object) as string;
  guardObjectHasStdLibMethods(stdlibType);
  const readableType = stdlibType === "array" ? "arrays" : "strings";

  // Check if this is computed access (bracket notation)
  // Stdlib members should only be accessed via dot notation
  guardNotComputedAccess();

  // Evaluate the property to get its name
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;
  guardPropertyIsString(property);

  // Get the property name
  const propertyName = property.value;

  // Check if it's a property
  const stdlibProperty = Object.hasOwn(stdlib[stdlibType].properties, propertyName)
    ? stdlib[stdlibType].properties[propertyName]
    : undefined;
  if (stdlibProperty) {
    return handleProperty(stdlibProperty);
  }

  // Check if it's a method
  const stdlibMethod = Object.hasOwn(stdlib[stdlibType].methods, propertyName)
    ? stdlib[stdlibType].methods[propertyName]
    : undefined;
  if (stdlibMethod) {
    return handleMethod(stdlibMethod);
  }

  // Unknown property/method
  executor.error("PropertyNotFound", expression.location, { property: propertyName, type: readableType });

  // Helper function to handle property access
  function handleProperty(stdlibProperty: Property): EvaluationResultMemberExpression {
    guardPropertyIsNotStub(stdlibProperty, propertyName);
    guardPropertyIsAllowed(stdlibType, propertyName);

    try {
      const value = stdlibProperty.get(executor.getExecutionContext(), object);
      return {
        type: "MemberExpression",
        object: objectResult,
        property: propertyResult,
        jikiObject: value,
        immutableJikiObject: value.clone(),
      };
    } catch (error) {
      handleStdlibError(error);
    }
  }

  // Helper function to handle method access
  function handleMethod(stdlibMethod: Method): EvaluationResultMemberExpression {
    // A method must be called - `arr.push` on its own is a mistake for the
    // brackets. If this member isn't the callee of a call, guide the student.
    if (!expression.isCalled) {
      executor.error("MethodUsedWithoutParentheses", expression.location, {
        property: propertyName,
        type: readableType,
      });
    }

    guardMethodIsAllowed(stdlibType, propertyName);

    // Return a JSStdLibFunction that can be called
    const methodFunction = new JSStdLibFunction(
      null,
      propertyName,
      stdlibMethod.arity,
      (ctx, _thisObj, args) => {
        try {
          return stdlibMethod.call(ctx, object, args);
        } catch (error) {
          handleStdlibError(error);
        }
      },
      stdlibMethod.description
    );

    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: methodFunction,
      immutableJikiObject: methodFunction.clone(),
    };
  }

  // Guard functions
  function guardObjectHasStdLibMethods(stdlibType: string | null) {
    if (stdlibType !== null) {
      return;
    }

    executor.error("CannotReadPropertiesOfType", expression.location, { type: object.type });
  }

  function guardNotComputedAccess() {
    if (!expression.computed) {
      return;
    }

    executor.error("ComputedAccessNotAllowedForStdlib", expression.location);
  }

  function guardPropertyIsString(property: JikiObject) {
    if (property instanceof JSString) {
      return;
    }

    executor.error("ComputedAccessNotAllowedForStdlib", expression.location);
  }

  function guardPropertyIsNotStub(property: Property, propertyName: string) {
    if (!property.isStub) {
      return;
    }

    executor.error("MethodNotYetImplemented", expression.location, { method: propertyName });
  }

  function guardPropertyIsAllowed(stdlibType: string, propertyName: string) {
    if (isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, false)) {
      return;
    }

    executor.error("PropertyNotYetAvailable", expression.location, { property: propertyName });
  }

  function guardMethodIsAllowed(stdlibType: string, propertyName: string) {
    if (isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, true)) {
      return;
    }

    executor.error("MethodNotYetAvailable", expression.location, { method: propertyName });
  }

  function handleStdlibError(error: unknown): never {
    if (error instanceof StdlibError) {
      // error.message is a translation key (e.g., "StdlibArgTypeMismatch")
      const message = translate(`error.stdlib.${error.message}`, error.context);
      throw new RuntimeError(message, expression.location, error.errorType as RuntimeErrorType, error.context);
    }
    throw error;
  }
}
