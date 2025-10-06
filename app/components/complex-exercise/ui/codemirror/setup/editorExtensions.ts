import { defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldKeymap, indentOnInput } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import {
  crosshairCursor,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  rectangularSelection
} from "@codemirror/view";
import { minimalSetup } from "codemirror";

import * as Ext from "../extensions";
import { moveCursorByPasteLength } from "../extensions/move-cursor-by-paste-length";
import { unfoldableFunctionsField } from "../utils/unfoldableFunctionNames";
import { readonlyCompartment } from "./editorCompartments";

import type { Extension } from "@codemirror/state";

export interface EditorExtensionsConfig {
  highlightedLine: number;
  readonly: boolean;
  onBreakpointChange: Extension;
  onFoldChange: Extension;
  onEditorChange: Extension;
  onCloseInfoWidget: () => void;
}

export function createEditorExtensions({
  highlightedLine: _highlightedLine,
  readonly: _readonly,
  onBreakpointChange,
  onFoldChange,
  onEditorChange,
  onCloseInfoWidget
}: EditorExtensionsConfig) {
  return [
    // Core CodeMirror extensions
    minimalSetup,
    javascript(),

    // Editor behavior
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),

    // Visual enhancements
    highlightActiveLineGutter(),
    highlightActiveLine(),
    dropCursor(),
    rectangularSelection(),
    crosshairCursor(),

    // Custom extensions
    Ext.breakpointGutter,
    Ext.foldGutter,
    Ext.underlineExtension(),
    Ext.readOnlyRangeDecoration(),
    Ext.jsTheme,
    unfoldableFunctionsField,
    moveCursorByPasteLength,

    // Dynamic extensions - start with no highlight, orchestrator will control it
    Ext.highlightLine(0),
    Ext.showInfoWidgetField,
    Ext.informationWidgetDataField,
    Ext.lineInformationExtension({
      onClose: onCloseInfoWidget
    }),
    Ext.multiHighlightLine([]),
    Ext.cursorTooltip(),
    Ext.highlightedCodeBlock(),
    Ext.initReadOnlyRangesExtension(),

    // State management - start editable, orchestrator will control readonly state
    readonlyCompartment.of([EditorView.editable.of(true)]),

    // Keymaps
    keymap.of([...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...lintKeymap, indentWithTab]),

    // Event listeners
    onBreakpointChange,
    onFoldChange,
    onEditorChange
  ];
}
