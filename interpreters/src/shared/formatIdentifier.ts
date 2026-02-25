import camelCase from "lodash/camelCase";

export function formatIdentifier(name: string, language: "javascript" | "python" | "jikiscript"): string {
  if (language === "javascript") {
    return camelCase(name);
  }
  return name;
}
