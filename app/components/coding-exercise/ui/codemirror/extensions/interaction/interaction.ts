import type { EditorView, ViewUpdate, PluginValue } from "@codemirror/view";
import { ViewPlugin } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { handleNode } from "./nodeHandlers";
import { removeInputElements } from "./removeInputElements";
import { findNodeAtCursor } from "./utils";

export class ValueInteractor implements PluginValue {
  private readonly removeScrollListener: () => void;

  constructor(private readonly view: EditorView) {
    requestAnimationFrame(() => this.findAndHandleNode(this.view));

    const onScroll = () => {
      removeInputElements();
    };

    view.scrollDOM.addEventListener("scroll", onScroll);

    this.removeScrollListener = () => {
      view.scrollDOM.removeEventListener("scroll", onScroll);
    };
  }

  update(update: ViewUpdate) {
    if (update.selectionSet) {
      removeInputElements();
      requestAnimationFrame(() => this.findAndHandleNode(update.view));
    }
  }

  destroy() {
    this.removeScrollListener();
    removeInputElements();
  }

  findAndHandleNode(view: EditorView) {
    const tree = syntaxTree(view.state);
    const cursorPos = view.state.selection.main.head;
    findNodeAtCursor(tree.topNode, cursorPos, (node) => handleNode(node, view));
  }
}

export function interactionExtension() {
  return ViewPlugin.fromClass(ValueInteractor);
}
