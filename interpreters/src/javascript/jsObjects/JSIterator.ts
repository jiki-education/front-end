import { JikiObject } from "../../shared/jikiObject";

/**
 * Represents a JavaScript Array Iterator object
 * This is returned by methods like entries(), keys(), and values()
 */
export class JSIterator extends JikiObject {
  constructor(
    public readonly items: JikiObject[],
    public readonly iteratorType: "entries" | "keys" | "values"
  ) {
    super("iterator");
  }

  get value(): any {
    // Return a simple representation for debugging
    return `[Array Iterator]`;
  }

  toString(): string {
    return "[object Array Iterator]";
  }

  clone(): JSIterator {
    // Iterators are immutable snapshots, so return self
    return this;
  }
}
