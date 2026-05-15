import { render, screen } from "@testing-library/react";
import { IOTestResultView } from "@/components/coding-exercise/ui/test-results-view/IOTestResultView";
import tableStyles from "@/components/coding-exercise/ui/test-results-view/io/IOScenarioTable.module.css";
import type { IOTestExpect } from "@/components/coding-exercise/lib/test-results-types";

function makeExpect(overrides: Partial<IOTestExpect> = {}): IOTestExpect {
  return {
    pass: false,
    codeRun: "f(1)",
    expected: "a",
    actual: "b",
    diff: [],
    ...overrides
  } as IOTestExpect;
}

describe("IOTestResultView", () => {
  it("renders errorHtml when present and skips the table", () => {
    const { container } = render(
      <IOTestResultView expect={makeExpect({ errorHtml: "<em>boom</em>" })} language="jikiscript" />
    );

    expect(container.querySelector("em")?.textContent).toBe("boom");
    expect(screen.queryByText("Code run")).not.toBeInTheDocument();
    expect(screen.queryByText("Expected")).not.toBeInTheDocument();
    expect(screen.queryByText("Actual")).not.toBeInTheDocument();
  });

  it("renders Code run, Expected and Actual rows when no errorHtml", () => {
    const { container } = render(
      <IOTestResultView
        expect={makeExpect({
          codeRun: "even_or_odd(14)",
          expected: "Even",
          actual: "Odd",
          diff: [
            { value: "Even", removed: true },
            { value: "Odd", added: true }
          ] as any
        })}
        language="jikiscript"
      />
    );

    expect(screen.getByText("Code run")).toBeInTheDocument();
    expect(container.querySelector("code")?.textContent).toBe("even_or_odd(14)");
    expect(screen.getByText("Expected")).toBeInTheDocument();
    expect(screen.getByText("Actual")).toBeInTheDocument();
  });

  it("highlights the removed part on the Expected row with the addedPart class", () => {
    const { container } = render(
      <IOTestResultView
        expect={makeExpect({
          diff: [
            { value: "Even", removed: true },
            { value: "Odd", added: true }
          ] as any
        })}
        language="jikiscript"
      />
    );

    const expectedRow = container.querySelectorAll("tr")[1];
    const addedPart = expectedRow.querySelector(`.${tableStyles.addedPart}`);
    expect(addedPart?.textContent).toBe("Even");
    // The added chunk must not appear on the Expected row
    expect(expectedRow.textContent).not.toMatch(/Odd/);
  });

  it("highlights the added part on the Actual row with the removedPart class", () => {
    const { container } = render(
      <IOTestResultView
        expect={makeExpect({
          diff: [
            { value: "Even", removed: true },
            { value: "Odd", added: true }
          ] as any
        })}
        language="jikiscript"
      />
    );

    const actualRow = container.querySelectorAll("tr")[2];
    const removedPart = actualRow.querySelector(`.${tableStyles.removedPart}`);
    expect(removedPart?.textContent).toBe("Odd");
    // The removed chunk must not appear on the Actual row
    expect(actualRow.textContent).not.toMatch(/Even/);
  });

  it("renders common parts without highlight on both rows", () => {
    const { container } = render(
      <IOTestResultView
        expect={makeExpect({
          diff: [
            { value: "prefix " },
            { value: "old", removed: true },
            { value: "new", added: true },
            { value: " suffix" }
          ] as any
        })}
        language="jikiscript"
      />
    );

    const [, expectedRow, actualRow] = container.querySelectorAll("tr");
    expect(expectedRow.textContent).toBe("Expectedprefix old suffix");
    expect(actualRow.textContent).toBe("Actualprefix new suffix");
    // Common parts should not carry diff highlight classes
    const commonSpans = expectedRow.querySelectorAll(`span:not(.${tableStyles.addedPart})`);
    commonSpans.forEach((s) => {
      expect(s.className).not.toContain(tableStyles.addedPart);
      expect(s.className).not.toContain(tableStyles.removedPart);
    });
  });

  it("splits common-part newlines into <br> elements", () => {
    const { container } = render(
      <IOTestResultView
        expect={makeExpect({
          diff: [{ value: "line1\nline2\nline3" }, { value: "x", removed: true }] as any
        })}
        language="jikiscript"
      />
    );

    const expectedRow = container.querySelectorAll("tr")[1];
    expect(expectedRow.querySelectorAll("br").length).toBe(2);
  });

  it("uses the shared IOScenarioTable wrapper styling regardless of pass/fail", () => {
    const { container: passContainer } = render(
      <IOTestResultView expect={makeExpect({ pass: true })} language="jikiscript" />
    );
    const { container: failContainer } = render(
      <IOTestResultView expect={makeExpect({ pass: false })} language="jikiscript" />
    );

    [passContainer, failContainer].forEach((c) => {
      const wrapper = c.firstChild as HTMLElement;
      expect(wrapper.className).toContain(tableStyles.wrapper);
      expect(wrapper.className).not.toContain("border-green-200");
      expect(wrapper.className).not.toContain("border-red-200");
    });
  });
});
