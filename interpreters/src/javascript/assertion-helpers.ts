import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { CallExpression } from "./expression";

/**
 * Extract all CallExpression nodes from an AST tree
 * Uses the children() method to recursively traverse the tree
 */
export function extractCallExpressions(tree: Statement[] | Expression[]): CallExpression[] {
  return extractExpressions(tree, CallExpression);
}

/**
 * Generic recursive AST tree traversal to extract specific expression types
 * Traverses using the children() method that all Statement and Expression nodes implement
 *
 * @param tree - Array of Statement or Expression nodes to search
 * @param type - Constructor of the Expression type to extract
 * @returns Array of matching expressions found in the tree
 */
export function extractExpressions<T extends Expression>(
  tree: Statement[] | Expression[],
  type: new (...args: any[]) => T
): T[] {
  // Filter null/undefined, then map to results and flatten
  return (
    tree
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter(obj => obj)
      .map((elem: Statement | Expression) => {
        const res = elem instanceof type ? [elem] : [];
        return res.concat(extractExpressions<T>(elem.children(), type));
      })
      .flat()
  );
}
