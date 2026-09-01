import { exerciseInstructionsHtml } from "@/lib/exercises/instructions";

// `marked` is mocked project-wide (__mocks__/marked.js), so these assert that the
// whole brief is passed through and rendered, not on marked's own output.
describe("exerciseInstructionsHtml", () => {
  it("renders every block of the instructions, not just the opening", () => {
    const html = exerciseInstructionsHtml("First para.\n\n- a bullet\n\nA later paragraph.");
    expect(html).toContain("First para.");
    expect(html).toContain("a bullet");
    expect(html).toContain("A later paragraph.");
  });

  it("renders inline markdown", () => {
    expect(exerciseInstructionsHtml("Use `move()` to go **right**.")).toContain("<code>move()</code>");
    expect(exerciseInstructionsHtml("Use `move()` to go **right**.")).toContain("<strong>right</strong>");
  });

  it("returns an empty string for empty instructions", () => {
    expect(exerciseInstructionsHtml("")).toBe("");
  });
});
