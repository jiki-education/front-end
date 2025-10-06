import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import { type Executor, RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import { type JikiObject, JSString, JSStdLibFunction } from "../jsObjects";
import type { Property, Method } from "../stdlib";
import { getStdlibType, stdlib, isStdlibMemberAllowed, StdlibError } from "../stdlib";

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
  const stdlibProperty = stdlib[stdlibType].properties[propertyName] as Property | undefined;
  if (stdlibProperty) {
    return handleProperty(stdlibProperty);
  }

  // Check if it's a method
  const stdlibMethod = stdlib[stdlibType].methods[propertyName] as Method | undefined;
  if (stdlibMethod) {
    return handleMethod(stdlibMethod);
  }

  // Unknown property/method
  throw new RuntimeError(`PropertyNotFound: property: ${propertyName}`, expression.location, "PropertyNotFound", {
    property: propertyName,
  });

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
    // Note: For stub methods, we still return a function, but it will throw when called
    // This maintains the correct semantics where arr.push returns a function
    guardMethodIsAllowed(stdlibType, propertyName);

    // Return a JSStdLibFunction that can be called
    const methodFunction = new JSStdLibFunction(
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

    throw new RuntimeError(
      `TypeError: message: Cannot read properties of ${object.type}`,
      expression.location,
      "TypeError",
      { message: `Cannot read properties of ${object.type}` }
    );
  }

  function guardNotComputedAccess() {
    if (!expression.computed) {
      return;
    }

    throw new RuntimeError(
      `TypeError: message: Cannot use computed property access for stdlib members`,
      expression.location,
      "TypeError",
      { message: "Cannot use computed property access for stdlib members" }
    );
  }

  function guardPropertyIsString(property: JikiObject) {
    if (property instanceof JSString) {
      return;
    }

    throw new RuntimeError(
      `TypeError: message: Cannot use computed property access for stdlib members`,
      expression.location,
      "TypeError",
      { message: "Cannot use computed property access for stdlib members" }
    );
  }

  function guardPropertyIsNotStub(property: Property, propertyName: string) {
    if (!property.isStub) {
      return;
    }

    throw new RuntimeError(
      `MethodNotYetImplemented: method: ${propertyName}`,
      expression.location,
      "MethodNotYetImplemented",
      { method: propertyName }
    );
  }

  function guardPropertyIsAllowed(stdlibType: string, propertyName: string) {
    if (isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, false)) {
      return;
    }

    throw new RuntimeError(
      `MethodNotYetAvailable: method: ${propertyName}`,
      expression.location,
      "MethodNotYetAvailable",
      { method: propertyName }
    );
  }

  function guardMethodIsAllowed(stdlibType: string, propertyName: string) {
    if (isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, true)) {
      return;
    }

    throw new RuntimeError(
      `MethodNotYetAvailable: method: ${propertyName}`,
      expression.location,
      "MethodNotYetAvailable",
      { method: propertyName }
    );
  }

  function handleStdlibError(error: unknown): never {
    if (error instanceof StdlibError) {
      throw new RuntimeError(
        `${error.errorType}: message: ${error.message}`,
        expression.location,
        error.errorType as any,
        error.context
      );
    }
    throw error;
  }
}
