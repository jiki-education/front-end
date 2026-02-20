import { JikiObject } from "../../shared/jikiObject";
import type { ExecutionContext } from "../executor";
import type { Arity } from "../../shared/interfaces";
import { JSInstance } from "./JSInstance";

type Visibility = "public" | "private";

type RawConstructor = (executionContext: ExecutionContext, object: JSInstance, ...args: JikiObject[]) => void;

export type RawMethod = (
  executionContext: ExecutionContext,
  object: JSInstance,
  ...args: JikiObject[]
) => JikiObject | void;

export class JSMethod {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly visibility: Visibility,
    public readonly arity: Arity,
    public readonly fn: RawMethod
  ) {}
}

export class JSGetter {
  constructor(
    public readonly visibility: Visibility,
    public readonly fn: (executionContext: ExecutionContext, object: JSInstance) => JikiObject
  ) {}
}

export class JSSetter {
  constructor(
    public readonly visibility: Visibility,
    public readonly fn: (executionContext: ExecutionContext, object: JSInstance, value: JikiObject) => JikiObject
  ) {}
}

export class UnsetPropertyError extends Error {
  constructor(public readonly property: string) {
    super(`Property '${property}' was not set in constructor`);
    this.name = "UnsetPropertyError";
  }
}

export class JSClass extends JikiObject {
  private initialize: RawConstructor | undefined;
  private readonly properties: string[] = [];
  private readonly methods: Record<string, JSMethod> = {};
  private readonly getters: Record<string, JSGetter> = {};
  private readonly setters: Record<string, JSSetter> = {};
  public arity: Arity = 0;

  constructor(public readonly name: string) {
    super("class");
  }

  public instantiate(executionContext: ExecutionContext, args: JikiObject[]): JSInstance {
    const instance = new JSInstance(this);

    const initializer = this.initialize;
    if (initializer !== undefined) {
      initializer.apply(undefined, [executionContext, instance, ...args]);
    }

    // Check that the constructor set all the properties
    this.properties.forEach(property => {
      // Properties must be initialized in constructor - checking for undefined is valid
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (instance.getField(property) === undefined) {
        throw new UnsetPropertyError(property);
      }
    });

    return instance;
  }

  // Constructor
  public addConstructor(fn: RawConstructor) {
    this.initialize = fn;
    this.arity = fn.length - 2;
  }

  // Properties
  public hasProperty(name: string): boolean {
    return this.properties.includes(name);
  }

  public addProperty(name: string): void {
    this.properties.push(name);
  }

  //
  // Methods
  //
  public addMethod(name: string, description: string | null, visibility: Visibility, fn: RawMethod) {
    // Reduce the arity by 2 because the first argument is the execution context
    // and the second is the object, both of which are invisible to the user
    const arity: Arity = fn.length - 2;
    this.methods[name] = new JSMethod(name, description, visibility, arity, fn);
  }
  public getMethod(name: string): JSMethod | undefined {
    return this.methods[name];
  }

  //
  // Getters and Setters
  //
  public getGetter(name: string): JSGetter | undefined {
    return this.getters[name];
  }
  public getSetter(name: string): JSSetter | undefined {
    return this.setters[name];
  }
  public addGetter(name: string, visibility: Visibility, fn?: (_: ExecutionContext, object: JSInstance) => JikiObject) {
    if (fn === undefined) {
      fn = function (_: ExecutionContext, object: JSInstance) {
        return object.getField(name);
      };
    }
    this.getters[name] = new JSGetter(visibility, fn);
  }
  public addSetter(
    name: string,
    visibility: Visibility,
    fn?: (_: ExecutionContext, object: JSInstance, value: JikiObject) => JikiObject
  ) {
    if (fn === undefined) {
      fn = function (_: ExecutionContext, object: JSInstance, value: JikiObject) {
        object.setField(name, value);
        return value;
      };
    }
    this.setters[name] = new JSSetter(visibility, fn);
  }

  get value(): string {
    return this.name;
  }

  toString(): string {
    return `[class ${this.name}]`;
  }

  clone(): JSClass {
    return this; // Classes are immutable definitions
  }
}
