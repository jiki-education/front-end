import { RangeSet, StateEffect, StateField } from "@codemirror/state";
import type { Range } from "@codemirror/state";
import { EditorView, gutter, GutterMarker, lineNumbers } from "@codemirror/view";
import type { CodingExerciseTranslator } from "../../../lib/test-results-types";

export const breakpointEffect = StateEffect.define<{
  pos: number;
  on: boolean;
}>({
  map: (val, mapping) => {
    return { pos: mapping.mapPos(val.pos), on: val.on };
  }
});

export const breakpointState = StateField.define<RangeSet<GutterMarker>>({
  create() {
    return RangeSet.empty;
  },
  update(set, transaction) {
    set = set.map(transaction.changes);
    for (const e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on) {
          set = set.update({ add: [breakpointMarker.range(e.value.pos)] });
        } else {
          set = set.update({ filter: (from) => from !== e.value.pos });
        }
      }
    }
    return set;
  }
});

function toggleBreakpoint(view: EditorView, pos: number) {
  const breakpoints = view.state.field(breakpointState);
  let hasBreakpoint = false;

  breakpoints.between(pos, pos, () => {
    hasBreakpoint = true;
  });

  view.dispatch({
    effects: breakpointEffect.of({ pos, on: !hasBreakpoint })
  });
}

// The `title` is the marker's hover tooltip, so it is user-facing copy and has to be
// translated. Gutter markers are built outside the React tree, so the translator is
// injected when the extension is created rather than read from a hook.
class BreakpointMarker extends GutterMarker {
  constructor(private readonly title?: string) {
    super();
  }
  toDOM() {
    const dot = document.createElement("div");
    dot.classList.add("cm-breakpoint-marker");
    if (this.title !== undefined) {
      dot.title = this.title;
    }
    return dot;
  }
}

class IdleMarker extends GutterMarker {
  constructor(private readonly title?: string) {
    super();
  }
  toDOM() {
    const dot = document.createElement("div");
    dot.classList.add("cm-idle-marker");
    if (this.title !== undefined) {
      dot.title = this.title;
    }
    return dot;
  }
}

// The marker stored in `breakpointState` is never the one the gutter renders (the
// gutter rebuilds its own markers from the range set on every redraw), so this
// untitled instance exists purely to occupy the range and needs no translator.
const breakpointMarker = new BreakpointMarker();

export function breakpointGutter(t: CodingExerciseTranslator) {
  const activeMarker = new BreakpointMarker(t("breakpointGutter.removeBreakpoint"));
  const idleMarker = new IdleMarker(t("breakpointGutter.addBreakpoint"));

  return [
    breakpointState,
    gutter({
      class: "cm-breakpoint-gutter",
      markers: (view) => {
        const breakpoints = view.state.field(breakpointState);
        const markers: Range<GutterMarker>[] = [];

        for (let i = 1; i <= view.state.doc.lines; i++) {
          const pos = view.state.doc.line(i).from;
          let hasBreakpoint = false;

          breakpoints.between(pos, pos, (from) => {
            if (from === pos) {
              hasBreakpoint = true;
            }
          });

          // TODO: Review why this is always falsy
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          markers.push((hasBreakpoint ? activeMarker : idleMarker).range(pos));
        }

        return RangeSet.of(markers);
      },
      initialSpacer: () => activeMarker,
      domEventHandlers: {
        mousedown(view, line) {
          toggleBreakpoint(view, line.from);
          return true;
        }
      }
    }),
    lineNumbers({
      domEventHandlers: {
        mousedown(view, line) {
          toggleBreakpoint(view, line.from);
          return true;
        },
        mousemove(view, line) {
          const lineNumber = view.state.doc.lineAt(line.from).number;
          document.querySelectorAll(".hovered-idle-marker").forEach((el) => {
            el.classList.remove("hovered-idle-marker");
          });

          const breakpointMarkerElement = view.dom.querySelector(
            `.cm-breakpoint-gutter .cm-gutterElement:nth-child(${lineNumber + 1}) .cm-idle-marker`
          );

          if (breakpointMarkerElement) {
            breakpointMarkerElement.classList.add("hovered-idle-marker");
            return true;
          }
          return false;
        },
        mouseleave(view) {
          const breakpointMarkerElement = view.dom.querySelectorAll(
            `.cm-breakpoint-gutter .cm-gutterElement .cm-idle-marker`
          );

          // Check if it's valid that it's always truthy
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (breakpointMarkerElement) {
            breakpointMarkerElement.forEach((el) => el.classList.remove("hovered-idle-marker"));
            return true;
          }
          return false;
        }
      }
    }),
    EditorView.baseTheme({
      ".cm-breakpoint-gutter .cm-gutterElement": {
        display: "grid",
        placeContent: "center"
      },
      ".cm-lineNumbers .cm-gutterElement": {
        cursor: "pointer"
      }
    })
  ];
}
