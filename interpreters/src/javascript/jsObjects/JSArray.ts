import { JikiObject } from "../../shared/jikiObject";
import { JSString } from "./JSString";

export class JSArray extends JikiObject {
  public readonly elements: JikiObject[];

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
      // Sparse arrays can have undefined elements that need special handling
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (elem === undefined) {
        elementStrings.push("undefined");
      } else if (elem instanceof JSString) {
        elementStrings.push(JSON.stringify(elem.value));
      } else {
        elementStrings.push(elem.toString());
      }
    }

    return `[ ${elementStrings.join(", ")} ]`;
  }

  public clone(): JSArray {
    // Deep clone - handle sparse arrays correctly
    const clonedElements: JikiObject[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if (i in this.elements) {
        clonedElements[i] = this.elements[i].clone();
      }
    }
    return new JSArray(clonedElements);
  }
}
