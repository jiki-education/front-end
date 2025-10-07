import { EditorView } from "@codemirror/view";
import type { StoreApi } from "zustand/vanilla";
import { readonlyCompartment, languageCompartment } from "../../../ui/codemirror/setup/editorCompartments";
import { getLanguageExtension } from "../../../ui/codemirror/setup/editorExtensions";
import {
  changeMultiLineHighlightEffect,
  informationWidgetDataEffect,
  showInfoWidgetEffect
} from "../../../ui/codemirror/extensions";
import { breakpointEffect } from "../../../ui/codemirror/extensions/breakpoint";
import { changeColorEffect, changeLineEffect } from "../../../ui/codemirror/extensions/lineHighlighter";
import { addUnderlineEffect } from "../../../ui/codemirror/extensions/underlineRange";
import { getBreakpointLines } from "../../../ui/codemirror/utils/getBreakpointLines";
import { scrollToLine } from "../../../ui/codemirror/utils/scrollToLine";
import type { InformationWidgetData, OrchestratorStore, UnderlineRange } from "../../types";

export class EditorStateManager {
  constructor(
    private readonly editorView: EditorView,
    private readonly store: StoreApi<OrchestratorStore>
  ) {}

  initializeSubscriptions() {
    let previousInformationWidgetData = this.store.getState().informationWidgetData;
    let previousShouldShowInformationWidget = this.store.getState().shouldShowInformationWidget;
    let previousReadonly = this.store.getState().readonly;
    let previousHighlightedLine = this.store.getState().highlightedLine;
    let previousHighlightedLineColor = this.store.getState().highlightedLineColor;
    let previousUnderlineRange = this.store.getState().underlineRange;
    let previousLanguage = this.store.getState().language;

    this.store.subscribe((state) => {
      if (state.informationWidgetData !== previousInformationWidgetData) {
        this.applyInformationWidgetData(state.informationWidgetData);
        previousInformationWidgetData = state.informationWidgetData;
      }

      if (state.shouldShowInformationWidget !== previousShouldShowInformationWidget) {
        this.applyShouldShowInformationWidget(state.shouldShowInformationWidget);
        previousShouldShowInformationWidget = state.shouldShowInformationWidget;
      }

      if (state.readonly !== previousReadonly) {
        this.applyReadonlyCompartment(state.readonly);
        previousReadonly = state.readonly;
      }

      if (state.highlightedLine !== previousHighlightedLine) {
        this.applyHighlightLine(state.highlightedLine);
        if (state.highlightedLine !== 0 && state.shouldShowInformationWidget) {
          scrollToLine(this.editorView, state.highlightedLine);
        }
        previousHighlightedLine = state.highlightedLine;
      }

      if (state.highlightedLineColor !== previousHighlightedLineColor) {
        this.applyHighlightLineColor(state.highlightedLineColor);
        previousHighlightedLineColor = state.highlightedLineColor;
      }

      if (state.underlineRange !== previousUnderlineRange) {
        this.applyUnderlineRange(state.underlineRange);
        previousUnderlineRange = state.underlineRange;
      }

      if (state.language !== previousLanguage) {
        this.applyLanguage(state.language);
        previousLanguage = state.language;
      }
    });
  }

  applyBreakpoints(breakpoints: number[]) {
    const currentBreakpoints = getBreakpointLines(this.editorView);
    const effects = [];

    for (const line of currentBreakpoints) {
      if (!breakpoints.includes(line)) {
        try {
          const pos = this.editorView.state.doc.line(line).from;
          effects.push(
            breakpointEffect.of({
              pos,
              on: false
            })
          );
        } catch {
          // Line might not exist, skip
        }
      }
    }

    for (const line of breakpoints) {
      if (!currentBreakpoints.includes(line) && line >= 1 && line <= this.editorView.state.doc.lines) {
        try {
          const pos = this.editorView.state.doc.line(line).from;
          effects.push(
            breakpointEffect.of({
              pos,
              on: true
            })
          );
        } catch {
          // Line might not exist, skip
        }
      }
    }

    if (effects.length > 0) {
      this.editorView.dispatch({ effects });
    }
  }

  setMultiLineHighlight(fromLine: number, toLine: number) {
    if (fromLine === 0 && toLine === 0) {
      this.editorView.dispatch({
        effects: [changeMultiLineHighlightEffect.of([])]
      });
    } else {
      const linesToHighlight = [];
      for (let i = fromLine; i <= toLine; i++) {
        linesToHighlight.push(i);
      }
      this.editorView.dispatch({
        effects: [changeMultiLineHighlightEffect.of(linesToHighlight)]
      });
    }
  }

  setMultipleLineHighlights(lines: number[]) {
    this.editorView.dispatch({
      effects: [changeMultiLineHighlightEffect.of(lines)]
    });
  }

  showInformationWidget() {
    const state = this.store.getState();

    if (state.shouldShowInformationWidget) {
      return;
    }

    // Enable the widget in the store first
    state.setShouldShowInformationWidget(true);

    // If we have a highlighted line and it's not 0 (initial state), scroll to it
    if (state.highlightedLine !== 0) {
      scrollToLine(this.editorView, state.highlightedLine);
    }

    // If current test has only one frame, set the highlighted line
    if (state.currentTest && state.currentTest.frames.length === 1) {
      state.setHighlightedLine(state.currentTest.frames[0].line);
    }
  }

  hideInformationWidget() {
    const state = this.store.getState();

    if (!state.shouldShowInformationWidget) {
      return;
    }

    // Disable the widget in the store
    state.setShouldShowInformationWidget(false);

    // If current test has only one frame, remove the highlight
    if (state.currentTest && state.currentTest.frames.length === 1) {
      state.setHighlightedLine(0);
    }
  }

  applyInformationWidgetData(data: InformationWidgetData) {
    this.editorView.dispatch({
      effects: [informationWidgetDataEffect.of(data)]
    });
  }

  applyShouldShowInformationWidget(show: boolean) {
    this.editorView.dispatch({
      effects: [showInfoWidgetEffect.of(show)]
    });
  }

  applyReadonlyCompartment(readonly: boolean) {
    this.editorView.dispatch({
      effects: readonlyCompartment.reconfigure(readonly ? [EditorView.editable.of(false)] : [])
    });
  }

  applyLanguage(language: "javascript" | "python" | "jikiscript") {
    this.editorView.dispatch({
      effects: languageCompartment.reconfigure(getLanguageExtension(language))
    });
  }

  applyHighlightLine(highlightedLine: number) {
    this.editorView.dispatch({
      effects: [changeLineEffect.of(highlightedLine)]
    });
  }

  applyHighlightLineColor(highlightedLineColor: string) {
    if (highlightedLineColor) {
      this.editorView.dispatch({
        effects: [changeColorEffect.of(highlightedLineColor)]
      });
    }
  }

  applyUnderlineRange(range: UnderlineRange | undefined) {
    if (range) {
      this.editorView.dispatch({
        effects: [addUnderlineEffect.of(range)]
      });
    }
  }
}
