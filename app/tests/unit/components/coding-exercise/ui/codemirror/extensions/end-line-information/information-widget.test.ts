import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { InformationWidget } from "@/components/coding-exercise/ui/codemirror/extensions/end-line-information/information-widget";
import { setEditorMessages } from "@/components/coding-exercise/lib/i18n/editorMessages";
import { seedEditorMessages } from "@/tests/test-utils/seedEditorMessages";

// CodeMirror widgets live outside the React tree, so their copy comes from the
// editorMessages registry rather than from `useTranslations()`. These tests pin that:
// the chrome must come from the registry, never from a literal.
function createMockView(): EditorView {
  const dom = document.createElement("div");
  document.body.appendChild(dom);
  return {
    dom,
    state: EditorState.create({ doc: "test content" }),
    dispatch: jest.fn()
  } as unknown as EditorView;
}

function renderWidget(status: "ERROR" | "SUCCESS") {
  const widget = new InformationWidget("<p>body</p>", status, createMockView(), jest.fn());
  widget.toDOM();
  const tooltip = document.body.querySelector<HTMLElement>("[class*='informationTooltip']");
  return { widget, tooltip };
}

describe("InformationWidget", () => {
  beforeEach(() => {
    seedEditorMessages();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the error heading from the message registry", () => {
    const { tooltip } = renderWidget("ERROR");

    expect(tooltip?.textContent).toContain("Oops, something went wrong!");
  });

  it("labels the close button from the message registry", () => {
    const { tooltip } = renderWidget("ERROR");

    expect(tooltip?.querySelector("button")?.getAttribute("aria-label")).toBe("Close tooltip");
  });

  it("uses the registry's copy rather than hardcoded English", () => {
    setEditorMessages((key) => `translated:${key}`);

    const { tooltip } = renderWidget("ERROR");

    expect(tooltip?.textContent).toContain("translated:informationTooltip.errorHeading");
    expect(tooltip?.textContent).not.toContain("Oops, something went wrong!");
    expect(tooltip?.querySelector("button")?.getAttribute("aria-label")).toBe(
      "translated:informationTooltip.closeAriaLabel"
    );
  });

  it("still renders the interpreter-supplied body html untouched", () => {
    const { tooltip } = renderWidget("ERROR");

    expect(tooltip?.innerHTML).toContain("<p>body</p>");
  });

  it("renders no heading for a SUCCESS tooltip", () => {
    const { tooltip } = renderWidget("SUCCESS");

    expect(tooltip?.textContent).not.toContain("Oops, something went wrong!");
    expect(tooltip?.innerHTML).toContain("<p>body</p>");
  });
});
