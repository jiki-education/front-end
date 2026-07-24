import type { Orchestrator } from "@/components/project-builder/lib/Orchestrator";
import { executeTool, MAX_FILES } from "@/components/project-builder/lib/tools";
import type { ConsoleLine, PreviewError, ProjectFiles } from "@/components/project-builder/lib/types";

// A minimal stand-in for the orchestrator: just the file-state surface the
// tools use, plus a stubbed runForAgent.
function fakeOrchestrator(
  initialFiles: ProjectFiles,
  runResult: { consoleLines: ConsoleLine[]; error: PreviewError | null } = { consoleLines: [], error: null }
) {
  const files = { ...initialFiles };
  return {
    orchestrator: {
      getFiles: () => files,
      agentSetFile: (filename: string, content: string) => {
        files[filename] = content;
      },
      agentDeleteFile: (filename: string) => {
        delete files[filename];
      },
      runForAgent: () => Promise.resolve(runResult)
    } as unknown as Orchestrator,
    files
  };
}

function args(value: object): string {
  return JSON.stringify(value);
}

describe("executeTool", () => {
  describe("edit_file", () => {
    it("replaces a unique match", async () => {
      const { orchestrator, files } = fakeOrchestrator({ "main.js": "const a = 1;\nconst b = 2;" });
      const result = await executeTool(
        orchestrator,
        "edit_file",
        args({ filename: "main.js", old_str: "const b = 2;", new_str: "const b = 3;" })
      );
      expect(result.isError).toBe(false);
      expect(files["main.js"]).toBe("const a = 1;\nconst b = 3;");
    });

    it("errors when old_str is missing", async () => {
      const { orchestrator } = fakeOrchestrator({ "main.js": "const a = 1;" });
      const result = await executeTool(
        orchestrator,
        "edit_file",
        args({ filename: "main.js", old_str: "nope", new_str: "x" })
      );
      expect(result.isError).toBe(true);
      expect(result.result).toContain("not found");
    });

    it("errors when old_str matches more than once", async () => {
      const { orchestrator, files } = fakeOrchestrator({ "main.js": "x = 1;\nx = 1;" });
      const result = await executeTool(
        orchestrator,
        "edit_file",
        args({ filename: "main.js", old_str: "x = 1;", new_str: "y" })
      );
      expect(result.isError).toBe(true);
      expect(result.result).toContain("2 times");
      expect(files["main.js"]).toBe("x = 1;\nx = 1;");
    });
  });

  describe("write_file", () => {
    it("creates and overwrites files", async () => {
      const { orchestrator, files } = fakeOrchestrator({ "index.html": "" });
      await executeTool(orchestrator, "write_file", args({ filename: "style.css", content: "body {}" }));
      expect(files["style.css"]).toBe("body {}");
    });

    it("rejects path traversal", async () => {
      const { orchestrator } = fakeOrchestrator({ "index.html": "" });
      const result = await executeTool(orchestrator, "write_file", args({ filename: "../evil.js", content: "" }));
      expect(result.isError).toBe(true);
    });

    it("rejects a 21st file", async () => {
      const many: ProjectFiles = {};
      for (let i = 0; i < MAX_FILES; i++) {
        many[`f${i}.js`] = "";
      }
      const { orchestrator } = fakeOrchestrator(many);
      const result = await executeTool(orchestrator, "write_file", args({ filename: "one-more.js", content: "" }));
      expect(result.isError).toBe(true);
    });
  });

  describe("delete_file", () => {
    it("refuses to delete index.html", async () => {
      const { orchestrator, files } = fakeOrchestrator({ "index.html": "x" });
      const result = await executeTool(orchestrator, "delete_file", args({ filename: "index.html" }));
      expect(result.isError).toBe(true);
      expect(files["index.html"]).toBe("x");
    });
  });

  describe("read_file", () => {
    it("returns numbered lines for a range", async () => {
      const { orchestrator } = fakeOrchestrator({ "main.js": "one\ntwo\nthree\nfour" });
      const result = await executeTool(
        orchestrator,
        "read_file",
        args({ filename: "main.js", start_line: 2, end_line: 3 })
      );
      expect(result.result).toBe("2: two\n3: three");
    });
  });

  describe("glob", () => {
    it("matches * within a segment and ** across segments", async () => {
      const { orchestrator } = fakeOrchestrator({ "a.css": "", "lib/b.css": "", "lib/c.js": "" });
      const star = await executeTool(orchestrator, "glob", args({ pattern: "*.css" }));
      expect(star.result).toBe("a.css");
      const doubleStar = await executeTool(orchestrator, "glob", args({ pattern: "**.css" }));
      expect(doubleStar.result).toBe("a.css\nlib/b.css");
    });
  });

  describe("grep", () => {
    it("returns filename:line matches", async () => {
      const { orchestrator } = fakeOrchestrator({
        "main.js": "let color = 'red';",
        "style.css": "h1 { color: blue; }"
      });
      const result = await executeTool(orchestrator, "grep", args({ pattern: "color" }));
      expect(result.result).toContain("main.js:1:");
      expect(result.result).toContain("style.css:1:");
    });
  });

  describe("run_code", () => {
    it("reports console output and errors", async () => {
      const { orchestrator } = fakeOrchestrator(
        { "index.html": "" },
        { consoleLines: [{ level: "log", text: "hi" }], error: { message: "boom", filename: "main.js", line: 3 } }
      );
      const result = await executeTool(orchestrator, "run_code", "{}");
      expect(result.isError).toBe(true);
      expect(result.result).toContain("[log] hi");
      expect(result.result).toContain("boom");
      expect(result.result).toContain("main.js:3");
    });
  });

  it("reports unknown tools", async () => {
    const { orchestrator } = fakeOrchestrator({});
    const result = await executeTool(orchestrator, "bash", "{}");
    expect(result.isError).toBe(true);
    expect(result.result).toContain("unknown tool");
  });
});
