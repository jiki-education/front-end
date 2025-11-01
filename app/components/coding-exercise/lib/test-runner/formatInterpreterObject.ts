/**
 * Format a value for display in test results
 * Works with values from any interpreter (JavaScript, Python, Jikiscript)
 * - Strings are wrapped in double quotes
 * - Numbers, booleans, null display as-is
 * - Arrays and objects are JSON-formatted
 * - undefined returns "undefined"
 */
export function formatInterpreterObject(value?: any): string {
  if (value === undefined) {
    return "undefined";
  }

  return JSON.stringify(value);
}
