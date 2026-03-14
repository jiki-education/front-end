import { rgb2hex } from "../../utils";

export function formatColorInputDefaultValue(input: string): string {
  // Strip surrounding quotes from JS string literals like "#ff0000"
  const unquoted = input.replace(/^['"]|['"]$/g, "");
  if (unquoted.startsWith("#")) return unquoted;

  const match = input.match(/rgb\s*\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)/);
  if (match) {
    const [r, g, b] = match.slice(1).map(Number);
    return rgb2hex(r, g, b);
  }

  return "#000000";
}
