import type { EditorView } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";

export function getIsColorNode(view: EditorView, node: SyntaxNode) {
  return getIsHexNode(node, view) || getIsRgbNode(view, node);
}

export function getIsRgbNode(view: EditorView, node: SyntaxNode) {
  const nodeContent = view.state.sliceDoc(node.from, node.to);
  return node.type.name === "CallExpression" && nodeContent.startsWith("rgb");
}

export function getIsHexNode(node: SyntaxNode, view: EditorView) {
  if (node.type.name !== "String") return false;
  const content = view.state.sliceDoc(node.from, node.to);
  // Match quoted hex color strings like "#ff0000" or '#abc'
  return /^['"]#[0-9a-fA-F]{3,8}['"]/i.test(content);
}

export function getIsNumberNode(node: SyntaxNode) {
  return node.type.name === "Number";
}
