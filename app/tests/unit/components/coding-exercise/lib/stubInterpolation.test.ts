import {
  hasPlaceholders,
  extractPlaceholderSlugs,
  interpolateStub
} from "@/components/coding-exercise/lib/stubInterpolation";

// Mock the API module
jest.mock("@/lib/api/lessons", () => ({
  fetchLatestExerciseSubmission: jest.fn()
}));

import { fetchLatestExerciseSubmission } from "@/lib/api/lessons";

const mockFetch = fetchLatestExerciseSubmission as jest.MockedFunction<typeof fetchLatestExerciseSubmission>;

describe("hasPlaceholders", () => {
  it("returns false for stubs without placeholders", () => {
    expect(hasPlaceholders("set x to 5\nset y to 10")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(hasPlaceholders("")).toBe(false);
  });

  it("returns true for a single placeholder", () => {
    expect(hasPlaceholders("{{LESSON:process-guess}}\nset x to 5")).toBe(true);
  });

  it("returns true for multiple placeholders", () => {
    expect(hasPlaceholders("{{LESSON:a}}\ncode\n{{LESSON:b}}")).toBe(true);
  });

  it("returns true when placeholder is the entire content", () => {
    expect(hasPlaceholders("{{LESSON:my-lesson}}")).toBe(true);
  });

  it("returns false for similar but invalid patterns", () => {
    expect(hasPlaceholders("{{EXERCISE:foo}}")).toBe(false);
    expect(hasPlaceholders("{LESSON:foo}")).toBe(false);
    expect(hasPlaceholders("{{ LESSON:foo }}")).toBe(false);
  });
});

describe("extractPlaceholderSlugs", () => {
  it("returns empty array for no placeholders", () => {
    expect(extractPlaceholderSlugs("just code")).toEqual([]);
  });

  it("extracts a single slug", () => {
    expect(extractPlaceholderSlugs("{{LESSON:my-lesson}}")).toEqual(["my-lesson"]);
  });

  it("extracts multiple unique slugs", () => {
    const stub = "{{LESSON:a}}\ncode\n{{LESSON:b}}";
    expect(extractPlaceholderSlugs(stub)).toEqual(["a", "b"]);
  });

  it("deduplicates repeated slugs", () => {
    const stub = "{{LESSON:a}}\ncode\n{{LESSON:b}}\n{{LESSON:a}}";
    expect(extractPlaceholderSlugs(stub)).toEqual(["a", "b"]);
  });
});

describe("interpolateStub", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns stub unchanged when no placeholders", async () => {
    const result = await interpolateStub("plain code", "jikiscript");
    expect(result).toBe("plain code");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("replaces a single placeholder with submission code", async () => {
    mockFetch.mockResolvedValue({
      uuid: "abc",
      context_type: "UserLesson",
      context_slug: "process-guess",
      files: [{ filename: "code.jiki", content: "set answer to 42" }]
    });

    const result = await interpolateStub("{{LESSON:process-guess}}\n\n// New code here", "jikiscript");

    expect(result).toBe("set answer to 42\n\n// New code here");
    expect(mockFetch).toHaveBeenCalledWith("process-guess");
  });

  it("replaces multiple placeholders", async () => {
    mockFetch.mockImplementation((slug: string) => {
      if (slug === "lesson-a") {
        return Promise.resolve({
          uuid: "a",
          context_type: "UserLesson",
          context_slug: "lesson-a",
          files: [{ filename: "code.jiki", content: "code A" }]
        });
      }
      if (slug === "lesson-b") {
        return Promise.resolve({
          uuid: "b",
          context_type: "UserLesson",
          context_slug: "lesson-b",
          files: [{ filename: "code.jiki", content: "code B" }]
        });
      }
      return Promise.resolve(null);
    });

    const result = await interpolateStub("{{LESSON:lesson-a}}\n\n{{LESSON:lesson-b}}", "jikiscript");

    expect(result).toBe("code A\n\ncode B");
  });

  it("replaces with empty string when no submission exists", async () => {
    mockFetch.mockResolvedValue(null);

    const result = await interpolateStub("{{LESSON:missing}}\n\n// Code here", "jikiscript");

    expect(result).toBe("\n\n// Code here");
  });

  it("replaces with empty string on API error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const result = await interpolateStub("{{LESSON:broken}}\n\n// Code here", "jikiscript");

    expect(result).toBe("\n\n// Code here");
  });

  it("selects the correct file based on language", async () => {
    mockFetch.mockResolvedValue({
      uuid: "abc",
      context_type: "UserLesson",
      context_slug: "my-lesson",
      files: [
        { filename: "code.jiki", content: "jiki code" },
        { filename: "code.js", content: "js code" },
        { filename: "code.py", content: "py code" }
      ]
    });

    const jikiResult = await interpolateStub("{{LESSON:my-lesson}}", "jikiscript");
    expect(jikiResult).toBe("jiki code");

    const jsResult = await interpolateStub("{{LESSON:my-lesson}}", "javascript");
    expect(jsResult).toBe("js code");

    const pyResult = await interpolateStub("{{LESSON:my-lesson}}", "python");
    expect(pyResult).toBe("py code");
  });

  it("uses the only file when submission has a single file", async () => {
    mockFetch.mockResolvedValue({
      uuid: "abc",
      context_type: "UserLesson",
      context_slug: "my-lesson",
      files: [{ filename: "main.txt", content: "the code" }]
    });

    const result = await interpolateStub("{{LESSON:my-lesson}}", "jikiscript");
    expect(result).toBe("the code");
  });

  it("makes only one API call per unique slug", async () => {
    mockFetch.mockResolvedValue({
      uuid: "abc",
      context_type: "UserLesson",
      context_slug: "lesson-a",
      files: [{ filename: "code.jiki", content: "code A" }]
    });

    await interpolateStub("{{LESSON:lesson-a}}\n// gap\n{{LESSON:lesson-a}}", "jikiscript");

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
