import { StateEffect, StateField } from "@codemirror/state";
import type { Range } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { Decoration, type DecorationSet, EditorView, ViewPlugin } from "@codemirror/view";
import { highlightedLineField } from "../lineHighlighter";
import { placeholderTheme } from "../placeholder-widget";
import { cleanupAllInformationTooltips } from "./cleanup";
import { InformationWidget } from "./information-widget";
import type { CodingExerciseTranslator } from "../../../../lib/test-results-types";

export const showInfoWidgetEffect = StateEffect.define<boolean>();

export const showInfoWidgetField = StateField.define<boolean>({
  create() {
    return false;
  },
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(showInfoWidgetEffect)) {
        return effect.value;
      }
    }
    return value;
  }
});

export interface InformationWidgetData {
  html: string;
  line: number;
  status: "ERROR" | "SUCCESS";
}
export const informationWidgetDataEffect = StateEffect.define<InformationWidgetData>();

export const informationWidgetDataField = StateField.define<InformationWidgetData>({
  create() {
    return { html: "", line: 0, status: "SUCCESS" };
  },
  update(value, tr) {
    if (tr.docChanged) {
      return { html: "", line: 1, status: "SUCCESS" };
    }
    for (const effect of tr.effects) {
      if (effect.is(informationWidgetDataEffect)) {
        return effect.value;
      }
    }
    return value;
  }
});

function lineInformationWidget(
  view: EditorView,
  onClose: (view: EditorView) => void,
  t: CodingExerciseTranslator
): DecorationSet {
  const widgets: Range<Decoration>[] = [];

  const shouldShowWidget = view.state.field(showInfoWidgetField);
  const widgetData = view.state.field(informationWidgetDataField);

  if (widgetData.line > view.state.doc.lines || widgetData.line <= 0) {
    return Decoration.none;
  }
  if (!shouldShowWidget) {
    // Clean up any existing tooltips when widget should be hidden
    cleanupAllInformationTooltips();
    return Decoration.none;
  }

  const { html, status } = widgetData;

  const deco = Decoration.widget({
    widget: new InformationWidget(html, status, view, onClose, t),
    side: 1
  });

  const lastPosOfLine = view.state.doc.line(widgetData.line).to;

  widgets.push(deco.range(lastPosOfLine));

  return Decoration.set(widgets);
}

class EndlineDecoration {
  placeholders: DecorationSet;
  onClose: (view: EditorView) => void;
  t: CodingExerciseTranslator;
  constructor(view: EditorView, onClose: (view: EditorView) => void, t: CodingExerciseTranslator) {
    this.onClose = onClose;
    this.t = t;
    this.placeholders = lineInformationWidget(view, this.onClose, this.t);
  }
  update(update: ViewUpdate) {
    if (
      update.docChanged ||
      update.viewportChanged ||
      update.startState.field(highlightedLineField) !== update.state.field(highlightedLineField) ||
      update.startState.field(showInfoWidgetField) !== update.state.field(showInfoWidgetField) ||
      update.startState.field(informationWidgetDataField) !== update.state.field(informationWidgetDataField)
    ) {
      this.placeholders = lineInformationWidget(update.view, this.onClose, this.t);
    }
  }
}

function endlineDecoration(onClose: (view: EditorView) => void, t: CodingExerciseTranslator) {
  return ViewPlugin.define(
    (view) => {
      return new EndlineDecoration(view, onClose, t);
    },
    {
      decorations: (instance) => instance.placeholders,
      provide: (plugin) => {
        return EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.placeholders ?? Decoration.none;
        });
      }
    }
  );
}

export function lineInformationExtension({
  onClose,
  t
}: {
  onClose: (view: EditorView) => void;
  t: CodingExerciseTranslator;
}) {
  return [placeholderTheme, endlineDecoration(onClose, t)];
}
