import type { JikiObject } from "../jikiObjects";
import { PyString, PyList } from "../jikiObjects";

export function formatPyObject(obj: JikiObject | undefined | null): string {
  if (!obj) {
    return "undefined";
  }
  if (obj instanceof PyString) {
    return `'${obj.toString()}'`;
  }
  if (obj instanceof PyList) {
    return obj.toString();
  }
  return obj.toString();
}

export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
