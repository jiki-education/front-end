// Python objects system extending shared base
import { JikiObject } from "../shared/jikiObject";
export { JikiObject } from "../shared/jikiObject";
export { PyStdLibFunction } from "./jikiObjects/PyStdLibFunction";
export { PyBuiltinModule } from "./jikiObjects/PyBuiltinModule";

export class PyNumber extends JikiObject {
  constructor(public readonly _value: number) {
    super("number");
  }

  public get value(): number {
    return this._value;
  }

  public toString(): string {
    return this._value.toString();
  }

  public clone(): PyNumber {
    // Numbers are immutable, so return self
    return this;
  }

  // Python-specific: Check if this is an integer
  public isInteger(): boolean {
    return Number.isInteger(this._value);
  }

  // Python-specific: Get the type name
  public getTypeName(): string {
    return this.isInteger() ? "int" : "float";
  }

  public pythonTypeName(): string {
    return this.getTypeName();
  }
}

export class PyString extends JikiObject {
  constructor(public readonly _value: string) {
    super("string");
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public clone(): PyString {
    // Strings are immutable, so return self
    return this;
  }

  // Python-specific: Get string representation with quotes
  public repr(): string {
    return `"${this._value}"`;
  }

  public pythonTypeName(): string {
    return "str";
  }
}

export class PyBoolean extends JikiObject {
  constructor(public readonly _value: boolean) {
    super("boolean");
  }

  public get value(): boolean {
    return this._value;
  }

  public toString(): string {
    // Python uses True/False, not true/false
    return this._value ? "True" : "False";
  }

  public clone(): PyBoolean {
    // Booleans are immutable, so return self
    return this;
  }

  public pythonTypeName(): string {
    return "bool";
  }
}

export class PyNone extends JikiObject {
  constructor() {
    super("none");
  }

  public get value(): null {
    return null;
  }

  public toString(): string {
    return "None";
  }

  public clone(): PyNone {
    // None is immutable, so return self
    return this;
  }

  public pythonTypeName(): string {
    return "NoneType";
  }
}

export class PyList extends JikiObject {
  private readonly elements: JikiObject[];

  constructor(elements: JikiObject[]) {
    super("list");
    this.elements = elements;
  }

  public get length(): number {
    return this.elements.length;
  }

  public getElement(index: number): JikiObject | undefined {
    return this.elements[index];
  }

  public setElement(index: number, value: JikiObject): void {
    this.elements[index] = value;
  }

  public get value(): JikiObject[] {
    return this.elements;
  }

  public toString(): string {
    if (this.elements.length === 0) {
      return "[]";
    }

    // Handle sparse arrays - map over indices to show undefined for missing elements
    const elementStrings: string[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      const elem = this.elements[i];
      // Sparse arrays can have undefined elements - checking is necessary
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (elem === undefined) {
        elementStrings.push("undefined");
      } else if (elem instanceof PyString) {
        // Python uses single quotes for string representation in lists
        elementStrings.push(`'${elem.value}'`);
      } else {
        elementStrings.push(elem.toString());
      }
    }

    return `[${elementStrings.join(", ")}]`;
  }

  public clone(): PyList {
    // Deep clone - handle sparse arrays correctly
    const clonedElements: JikiObject[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if (i in this.elements) {
        clonedElements[i] = this.elements[i].clone();
      }
    }
    return new PyList(clonedElements);
  }

  public pythonTypeName(): string {
    return "list";
  }
}

// Helper function to create PyObjects from Python values
export function createPyObject(value: any): JikiObject {
  if (typeof value === "number") {
    return new PyNumber(value);
  } else if (typeof value === "string") {
    return new PyString(value);
  } else if (typeof value === "boolean") {
    return new PyBoolean(value);
  } else if (value === null || value === undefined) {
    return new PyNone();
  } else if (Array.isArray(value)) {
    return new PyList(value.map(elem => createPyObject(elem)));
  }
  throw new Error(`Cannot create PyObject for value: ${value}`);
}

// Helper function to unwrap PyObjects to JavaScript values
export function unwrapPyObject(obj: JikiObject | any): any {
  if (obj instanceof PyList) {
    return obj.value.map(elem => unwrapPyObject(elem));
  } else if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
