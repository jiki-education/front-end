import type { EditorView } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";
import { syntaxTree } from "@codemirror/language";
import { cursorPositionHelper, hex2rgb } from "../../utils";
import { getIsHexNode, getIsRgbNode } from "../../syntaxNodeChecks";
import { appendColorInput } from "./appendColorInput";
import { formatColorInputDefaultValue } from "./formatColorInputDefaultValue";
import { findColorNodeAbove } from "./findColorNodeAbove";

export function handleColorNode(node: SyntaxNode, view: EditorView) {
  const { top, left, isCursorInside } = cursorPositionHelper(view, node);
  if (!isCursorInside) return;

  const nodeContent = view.state.sliceDoc(node.from, node.to);
  const isHex = getIsHexNode(node, view);
  const isRgb = getIsRgbNode(view, node);

  if (!isHex && !isRgb) return;

  // Detect quote style for hex strings so we can preserve it on write-back
  const quoteChar = isHex ? nodeContent[0] : null;

  appendColorInput({
    top,
    left,
    defaultValue: formatColorInputDefaultValue(nodeContent),
    onChange: (color: string) => {
      let newColor: string;

      if (isRgb) {
        const [r, g, b] = hex2rgb(color);
        newColor = `rgb(${r}, ${g}, ${b})`;
      } else {
        // Re-wrap in original quote style
        newColor = `${quoteChar}${color}${quoteChar}`;
      }
      const cursorPos = view.state.selection.main.head;
      const updatedTree = syntaxTree(view.state);
      const updatedNode = updatedTree.resolve(cursorPos, 1);
      const colorNode = findColorNodeAbove(view, updatedNode);
      if (!colorNode) return;

      view.dispatch({
        changes: {
          from: colorNode.from,
          to: colorNode.to,
          insert: newColor
        }
      });
    }
  });
}
