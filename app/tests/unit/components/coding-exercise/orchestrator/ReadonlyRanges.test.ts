import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import * as localStorage from "@/components/coding-exercise/lib/localStorage";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { ReadonlyRange } from "@jiki/curriculum";

jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(),
  saveCodeMirrorContent: jest.fn()
}));

const mockLoadCodeMirrorContent = localStorage.loadCodeMirrorContent as jest.MockedFunction<
  typeof localStorage.loadCodeMirrorContent
>;

function mockStored(data: { code?: string; readonlyRanges?: unknown }) {
  mockLoadCodeMirrorContent.mockReturnValue({
    success: true,
    data: {
      code: data.code ?? "// code",
      storedAt: new Date().toISOString(),
      exerciseId: "ranges-test",
      version: 1,
      readonlyRanges: data.readonlyRanges as ReadonlyRange[] | undefined
    }
  });
}

function makeOrchestrator(defaults?: ReadonlyRange[]) {
  const exercise = createMockExercise({
    slug: "ranges-test",
    readonlyRanges: defaults ? { javascript: defaults, python: defaults, jikiscript: defaults } : undefined
  });
  return new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
}

describe("Orchestrator.getStoredOrDefaultReadonlyRanges", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns stored ranges from localStorage when present and valid", () => {
    const stored: ReadonlyRange[] = [{ fromLine: 5, toLine: 5 }];
    mockStored({ readonlyRanges: stored });

    const orchestrator = makeOrchestrator([{ fromLine: 3, toLine: 3 }]);

    expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual(stored);
  });

  it("returns exercise defaults when localStorage has no data", () => {
    const defaults: ReadonlyRange[] = [{ fromLine: 3, toLine: 3 }];
    mockLoadCodeMirrorContent.mockReturnValue({ success: false, error: "No data found" });

    const orchestrator = makeOrchestrator(defaults);

    expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual(defaults);
  });

  it("returns no locks (not defaults) when a stored snapshot has no readonlyRanges field", () => {
    // A saved snapshot exists, so its code may be student-edited. Applying the
    // stub-relative exercise defaults here could lock lines the student wrote,
    // so we fall back to no locks rather than guessing.
    const defaults: ReadonlyRange[] = [{ fromLine: 3, toLine: 3 }];
    mockStored({ readonlyRanges: undefined });

    const orchestrator = makeOrchestrator(defaults);

    expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
  });

  it("returns empty array when neither localStorage nor exercise provide ranges", () => {
    mockLoadCodeMirrorContent.mockReturnValue({ success: false, error: "No data found" });

    const orchestrator = makeOrchestrator();

    expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
  });

  it("preserves stored ranges that include optional fromChar and toChar", () => {
    const stored: ReadonlyRange[] = [{ fromLine: 2, toLine: 4, fromChar: 0, toChar: 10 }];
    mockStored({ readonlyRanges: stored });

    const orchestrator = makeOrchestrator();

    expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual(stored);
  });

  describe("malformed input in a stored snapshot falls back to no locks", () => {
    // A snapshot exists (student may have edited), so a corrupt/older-version
    // ranges payload must not resurrect the stub-relative exercise defaults.
    const defaults: ReadonlyRange[] = [{ fromLine: 3, toLine: 3 }];

    it("rejects non-array readonlyRanges value", () => {
      mockStored({ readonlyRanges: "not-an-array" });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects array entries that are not objects", () => {
      mockStored({ readonlyRanges: [null, 42, "x"] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects entries missing fromLine", () => {
      mockStored({ readonlyRanges: [{ toLine: 5 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects entries missing toLine", () => {
      mockStored({ readonlyRanges: [{ fromLine: 5 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects non-integer fromLine", () => {
      mockStored({ readonlyRanges: [{ fromLine: 1.5, toLine: 2 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects fromLine less than 1", () => {
      mockStored({ readonlyRanges: [{ fromLine: 0, toLine: 2 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects toLine smaller than fromLine", () => {
      mockStored({ readonlyRanges: [{ fromLine: 5, toLine: 3 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects string-typed line numbers", () => {
      mockStored({ readonlyRanges: [{ fromLine: "5", toLine: "5" }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects negative fromChar", () => {
      mockStored({ readonlyRanges: [{ fromLine: 2, toLine: 2, fromChar: -1 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects non-integer toChar", () => {
      mockStored({ readonlyRanges: [{ fromLine: 2, toLine: 2, toChar: 1.5 }] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });

    it("rejects the whole array if even one entry is malformed", () => {
      const valid = { fromLine: 2, toLine: 2 };
      const invalid = { fromLine: 5 };
      mockStored({ readonlyRanges: [valid, invalid] });
      const orchestrator = makeOrchestrator(defaults);
      expect(orchestrator.getStoredOrDefaultReadonlyRanges()).toEqual([]);
    });
  });
});
