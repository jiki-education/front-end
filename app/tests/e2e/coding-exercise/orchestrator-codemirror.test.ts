describe("Orchestrator-CodeMirror E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3081/test/coding-exercise/orchestrator-codemirror");
  }, 20000); // 20s timeout for navigation + compilation

  it("should render the CodeMirror editor with initial code", async () => {
    // Wait for the editor container to be visible
    await page.waitForSelector("#editor-container");

    // Wait for CodeMirror to render (it has a cm-editor class)
    await page.waitForSelector(".cm-editor");

    // Check that the initial code is displayed
    const codeContent = await page.evaluate(() => {
      const cmContent = document.querySelector(".cm-content");
      return cmContent?.textContent;
    });

    expect(codeContent).toContain("// Initial code");
    expect(codeContent).toContain("const x = 42");
  }, 20000); // 20s timeout for navigation + compilation

  it("should toggle breakpoint when clicking on line numbers", async () => {
    // Wait for CodeMirror to be ready
    await page.waitForSelector(".cm-editor");
    await page.waitForSelector(".cm-lineNumbers");

    // Wait for breakpoint gutter to be ready
    await page.waitForSelector(".cm-breakpoint-gutter");

    // Count initial breakpoint markers
    const initialMarkers = await page.$$(".cm-breakpoint-marker");
    const initialCount = initialMarkers.length;

    // Click on line number 2 to add a breakpoint
    await page.click(".cm-lineNumbers .cm-gutterElement:nth-child(2)");

    // Small delay to allow DOM update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify breakpoint was added
    let currentMarkers = await page.$$(".cm-breakpoint-marker");
    expect(currentMarkers.length).toBe(initialCount + 1);

    // Click again to remove the breakpoint
    await page.click(".cm-lineNumbers .cm-gutterElement:nth-child(2)");

    // Small delay to allow DOM update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify breakpoint was removed
    currentMarkers = await page.$$(".cm-breakpoint-marker");
    expect(currentMarkers.length).toBe(initialCount);
  });
});
