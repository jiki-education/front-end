import type { EditorView } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";
import { syntaxTree } from "@codemirror/language";
import { FAUX_RANGE_INPUT_ID } from ".";
import { formatNumber, getSensitivity } from "./utils";
export function appendNumberScrubber({
  top,
  left,
  originalValue,
  unit,
  node,
  view
}: {
  top: number;
  left: number;
  originalValue: number;
  unit: string;
  node: SyntaxNode;
  view: EditorView;
}) {
  const id = FAUX_RANGE_INPUT_ID;
  const scrubber = document.createElement("div");
  scrubber.id = id;
  Object.assign(scrubber.style, {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    transform: "translate(-50%, -100%)",
    zIndex: "9999",
    width: "34px",
    height: "20px",
    backgroundColor: "white",
    backgroundImage: `url(/static/icons/move.svg)`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    filter: "drop-shadow(0px 0px 5px rgba(0, 120, 255, 0.5))",
    borderRadius: "5px",
    cursor: "ew-resize",
    userSelect: "none"
  });

  // This tooltip can be appended if we'd like to - keep this for debug purposes
  // const tooltip = createTooltip(`${originalValue}${unit}`)
  // scrubber.appendChild(tooltip)

  let isDragging = false;
  let startX = 0;
  let currentDelta = 0;

  // we can multiply the delta with sensitivity
  // can be made kinda dynamic with getSensitivity util function
  let sensitivity = getSensitivity(originalValue);

  // Track the position of the value in the document as edits happen,
  // so we always replace the right range regardless of sign changes.
  let trackedFrom = node.from;

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    currentDelta = e.clientX - startX;
    scrubber.style.left = `${left + currentDelta}px`;

    const deltaValue = currentDelta * sensitivity;
    const newValue = formatNumber(originalValue + deltaValue);

    const updatedTree = syntaxTree(view.state);
    // Resolve at trackedFrom to find the Number node (or its UnaryExpression parent)
    const currentNode = updatedTree.resolve(trackedFrom, 1);
    const parent = currentNode.parent;
    const valueNode = parent?.type.name === "UnaryExpression" ? parent : currentNode;
    const from = valueNode.from;
    const to = valueNode.to;

    const tr = view.state.update({
      changes: { from, to, insert: `${newValue}${unit}` }
    });
    // Map trackedFrom through the change so next dispatch resolves correctly
    trackedFrom = tr.changes.mapPos(trackedFrom);
    view.dispatch(tr);
  };

  const removeDragListeners = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    scrubber.style.left = `${left}px`;

    const updatedTree = syntaxTree(view.state);
    const updatedNode = updatedTree.resolve(trackedFrom, 1);
    const updatedParent = updatedNode.parent;
    const valueNode = updatedParent?.type.name === "UnaryExpression" ? updatedParent : updatedNode;
    const updatedText = view.state.sliceDoc(valueNode.from, valueNode.to).trim();
    const parsed = parseFloat(updatedText);

    if (!isNaN(parsed)) {
      originalValue = parsed;
      sensitivity = getSensitivity(originalValue);
    }

    removeDragListeners();
  };

  (scrubber as HTMLElement & { cleanup?: () => void }).cleanup = removeDragListeners;

  scrubber.addEventListener("mousedown", (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  document.body.appendChild(scrubber);

  // remove element if it's inactive for 3 seconds
  setTimeout(() => {
    if (document.getElementById(id) && !isDragging) {
      scrubber.remove();
    }
  }, 3000);
}
