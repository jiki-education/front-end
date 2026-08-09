import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { InformationWidget } from "@/components/coding-exercise/ui/codemirror/extensions/end-line-information/information-widget";
import type { CodingExerciseTranslator } from "@/components/coding-exercise/lib/test-results-types";
import { makeTestTranslator } from "@/tests/test-utils/makeTestTranslator";

// CodeMirror widgets live outside the React tree, so their copy comes from a
// translator injected at construction rather than from `useTranslations()`. These
// tests pin that: the chrome must come from the translator, never from a literal.
function createMockView(): EditorView {
  const dom = document.createElement("div");
  document.body.appendChild(dom);
  return {
    dom,
    state: EditorState.create({ doc: "test content" }),
    dispatch: jest.fn()
  } as unknown as EditorView;
}

function renderWidget(status: "ERROR" | "SUCCESS", t: CodingExerciseTranslator) {
  const widget = new InformationWidget("<p>body</p>", status, createMockView(), jest.fn(), t);
  widget.toDOM();
  const tooltip = document.body.querySelector<HTMLElement>("[class*='informationTooltip']");
  return { widget, tooltip };
}

describe("InformationWidget", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the error heading from the injected translator", () => {
    const { tooltip } = renderWidget("ERROR", makeTestTranslator());

    expect(tooltip?.textContent).toContain("Oops, something went wrong!");
  });

  it("labels the close button from the injected translator", () => {
    const { tooltip } = renderWidget("ERROR", makeTestTranslator());

    expect(tooltip?.querySelector("button")?.getAttribute("aria-label")).toBe("Close tooltip");
  });

  it("uses the translator's copy rather than hardcoded English", () => {
    const t = ((key: string) => `translated:${key}`) as unknown as CodingExerciseTranslator;

    const { tooltip } = renderWidget("ERROR", t);

    expect(tooltip?.textContent).toContain("translated:informationTooltip.errorHeading");
    expect(tooltip?.textContent).not.toContain("Oops, something went wrong!");
    expect(tooltip?.querySelector("button")?.getAttribute("aria-label")).toBe(
      "translated:informationTooltip.closeAriaLabel"
    );
  });

  it("still renders the interpreter-supplied body html untouched", () => {
    const { tooltip } = renderWidget("ERROR", makeTestTranslator());

    expect(tooltip?.innerHTML).toContain("<p>body</p>");
  });

  it("renders no heading for a SUCCESS tooltip", () => {
    const { tooltip } = renderWidget("SUCCESS", makeTestTranslator());

    expect(tooltip?.textContent).not.toContain("Oops, something went wrong!");
    expect(tooltip?.innerHTML).toContain("<p>body</p>");
  });
});
