import type { EvaluationResult, EvaluationResultAttributeExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { AttributeExpression } from "../expression";
import { type JikiObject, PyString, PyStdLibFunction } from "../jikiObjects";
import type { Property, Method } from "../stdlib";
import { getStdlibType, stdlib, isStdlibMemberAllowed, StdlibError } from "../stdlib";

// Generic stdlib member resolution
export function executeStdlibAttributeExpression(
  executor: Executor,
  expression: AttributeExpression,
  objectResult: EvaluationResult,
  object: JikiObject
): EvaluationResultAttributeExpression {
  // Check if this object type has stdlib members
  const stdlibType = getStdlibType(object) as string;
  guardObjectHasStdLibMethods(stdlibType);

  // Get the attribute name from the token
  const attributeName = expression.attribute.lexeme;

  // Create a property result for the attribute name
  const propertyResult = {
    type: "IdentifierExpression" as const,
    jikiObject: new PyString(attributeName),
    immutableJikiObject: new PyString(attributeName),
  };

  // Check if it's a property
  const stdlibProperty = stdlib[stdlibType].properties[attributeName] as Property | undefined;
  if (stdlibProperty) {
    return handleProperty(stdlibProperty);
  }

  // Check if it's a method
  const stdlibMethod = stdlib[stdlibType].methods[attributeName] as Method | undefined;
  if (stdlibMethod) {
    return handleMethod(stdlibMethod);
  }

  // Unknown property/method
  let typeName = object.type;
  if ("pythonTypeName" in object && typeof object.pythonTypeName === "function") {
    typeName = object.pythonTypeName();
  }
  executor.error("AttributeError", expression.location, {
    attribute: attributeName,
    type: typeName,
  });

  // Helper function to handle property access
  function handleProperty(stdlibProperty: Property): EvaluationResultAttributeExpression {
    guardPropertyIsNotStub(stdlibProperty, attributeName);
    guardPropertyIsAllowed(stdlibType, attributeName);

    try {
      const value = stdlibProperty.get(executor.getExecutionContext(), object);
      return {
        type: "AttributeExpression",
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
  function handleMethod(stdlibMethod: Method): EvaluationResultAttributeExpression {
    // Note: For stub methods, we still return a function, but it will throw when called
    // This maintains the correct semantics where list.append returns a function
    guardMethodIsAllowed(stdlibType, attributeName);

    // Return a PyStdLibFunction that can be called
    const methodFunction = new PyStdLibFunction(
      attributeName,
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
      type: "AttributeExpression",
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

    let typeName = object.type;
    if ("pythonTypeName" in object && typeof object.pythonTypeName === "function") {
      typeName = object.pythonTypeName();
    }
    executor.error("TypeError", expression.location, {
      message: `'${typeName}' object has no attributes`,
    });
  }

  function guardPropertyIsNotStub(property: Property, propertyName: string) {
    if (!property.isStub) {
      return;
    }

    executor.error("MethodNotYetImplemented", expression.location, {
      method: propertyName,
    });
  }

  function guardPropertyIsAllowed(stdlibType: string, propertyName: string) {
    if (isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, false)) {
      return;
    }

    executor.error("MethodNotYetAvailable", expression.location, {
      method: propertyName,
    });
  }

  function guardMethodIsAllowed(stdlibType: string, propertyName: string) {
    if (isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, true)) {
      return;
    }

    executor.error("MethodNotYetAvailable", expression.location, {
      method: propertyName,
    });
  }

  function handleStdlibError(error: unknown): never {
    if (error instanceof StdlibError) {
      executor.error(error.errorType, expression.location, error.context || { message: error.message });
    }
    throw error;
  }
}
