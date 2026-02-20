import { JikiObject } from "../../shared/jikiObject";
import type { JSClass, JSMethod, JSGetter, JSSetter } from "./JSClass";

export class JSInstance extends JikiObject {
  protected fields: Record<string, JikiObject> = {};

  constructor(private readonly jsClass: JSClass) {
    super("instance");
  }

  public get value(): never {
    throw new Error("value should not be called on instance");
  }

  public toString() {
    return `(an instance of ${this.jsClass.name})`;
  }
  public getClassName(): string {
    return this.jsClass.name;
  }
  public getMethod(name: string): JSMethod | undefined {
    return this.jsClass.getMethod(name);
  }
  public hasProperty(name: string): boolean {
    return this.jsClass.hasProperty(name);
  }
  public getGetter(name: string): JSGetter | undefined {
    return this.jsClass.getGetter(name);
  }
  public getSetter(name: string): JSSetter | undefined {
    return this.jsClass.getSetter(name);
  }
  public getField(name: string): JikiObject {
    return this.fields[name];
  }
  public getUnwrappedField(name: string): any {
    const field = this.fields[name];
    // Fields may not exist at runtime despite Record type - checking for undefined is valid
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (field === undefined) {
      return field;
    }
    return field.value;
  }
  public setField(name: string, value: JikiObject): void {
    this.fields[name] = value;
  }
  public clone(): JSInstance {
    // Create a new instance of the same class
    const clonedInstance = new JSInstance(this.jsClass);
    // Deep clone all fields
    for (const [name, value] of Object.entries(this.fields)) {
      clonedInstance.fields[name] = value.clone();
    }
    return clonedInstance;
  }
}
