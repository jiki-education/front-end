import { JikiObject } from "../../shared/jikiObject";

export class JSNull extends JikiObject {
  constructor() {
    super("null");
  }

  public get value(): null {
    return null;
  }

  public toString(): string {
    return "null";
  }

  public clone(): JSNull {
    // Null is immutable, so return self
    return this;
  }
}
