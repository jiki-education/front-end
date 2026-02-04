import { arrayProperties, arrayMethods } from "./array";
import { stringProperties, stringMethods } from "./string";
import type { JikiObject } from "../jsObjects";
import type { ExecutionContext } from "../executor";
import type { LanguageFeatures } from "../interfaces";

// General types for properties and methods
export interface Property {
  get: (ctx: ExecutionContext, obj: JikiObject) => JikiObject;
  description: string;
  isStub?: boolean; // Marks properties that are not yet implemented
}

export interface Method {
  arity: number | [number, number]; // exact or [min, max]
  call: (ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => JikiObject;
  description: string;
  isStub?: boolean; // Marks methods that are not yet implemented
}

// Type definitions for the stdlib structure
interface StdlibType {
  properties: Record<string, Property>;
  methods: Record<string, Method>;
}

// The main stdlib object
export const stdlib: Record<string, StdlibType> = {
  array: {
    properties: arrayProperties,
    methods: arrayMethods,
  },
  string: {
    properties: stringProperties,
    methods: stringMethods,
  },
};

// Get the stdlib type for a JikiObject
export function getStdlibType(obj: JikiObject): string | null {
  // Map JikiObject types to stdlib types
  if (obj.type === "list") {
    return "array";
  }
  if (obj.type === "string") {
    return "string";
  }
  // Future: if (obj.type === "number") return "number";
  return null;
}

// Internal error class for stdlib functions
// This gets caught and converted to a RuntimeError with proper location
export class StdlibError extends Error {
  constructor(
    public errorType: string,
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = "StdlibError";
  }
}

// Helper to create a stub method that throws MethodNotYetImplemented
export function createNotYetImplementedStub(methodName: string): Method {
  return {
    arity: [0, 999], // Accept any reasonable number of arguments (999 is a practical upper limit)
    call: (_ctx: ExecutionContext, _obj: JikiObject, _args: JikiObject[]) => {
      throw new StdlibError("MethodNotYetImplemented", "MethodNotYetImplemented", {
        method: methodName,
      });
    },
    description: `${methodName} (not yet implemented)`,
    isStub: true,
  };
}

// Helper to check if a stdlib member is allowed by language features
export function isStdlibMemberAllowed(
  features: LanguageFeatures | undefined,
  stdlibType: string,
  memberName: string,
  isMethod: boolean
): boolean {
  // If no features specified or no stdlib restrictions, everything is allowed
  if (!features?.allowedStdlib) {
    return true;
  }

  // Get the restrictions for this type (e.g., 'array')
  const typeRestrictions = features.allowedStdlib[stdlibType as keyof typeof features.allowedStdlib];
  if (!typeRestrictions) {
    // No restrictions for this type means everything is allowed
    return true;
  }

  // Check the appropriate list (methods or properties)
  const allowedList = isMethod ? typeRestrictions.methods : typeRestrictions.properties;
  if (!allowedList) {
    // If the list is not defined, everything of that kind is allowed
    return true;
  }

  // Check if the member is in the allowed list
  return allowedList.includes(memberName);
}
