import { JikiObject } from "../../shared/jikiObject";
import { JSString } from "./JSString";

export class JSDictionary extends JikiObject {
  private readonly map: Map<string, JikiObject>;

  constructor(map: Map<string, JikiObject>) {
    super("dictionary");
    this.map = map;
  }

  public getProperty(key: string): JikiObject | undefined {
    return this.map.get(key);
  }

  public setProperty(key: string, value: JikiObject): void {
    this.map.set(key, value);
  }

  public get value(): Map<string, JikiObject> {
    return this.map;
  }

  public toString(): string {
    if (this.map.size === 0) {
      return "{}";
    }

    const entries: string[] = [];
    for (const [key, value] of this.map.entries()) {
      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      const valueStr = value instanceof JSString ? JSON.stringify(value.value) : value.toString();
      entries.push(`${keyStr}: ${valueStr}`);
    }

    return `{ ${entries.join(", ")} }`;
  }

  public clone(): JSDictionary {
    // Deep clone - recursively clone all values
    const clonedMap = new Map<string, JikiObject>();
    for (const [key, value] of this.map.entries()) {
      clonedMap.set(key, value.clone());
    }
    return new JSDictionary(clonedMap);
  }
}
