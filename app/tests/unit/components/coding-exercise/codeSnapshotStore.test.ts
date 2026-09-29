import {
  saveSnapshot,
  getSnapshots,
  makeSnapshotKey,
  shortHash
} from "@/components/coding-exercise/lib/codeSnapshotStore";

const KEY = "lesson:test-exercise";

describe("codeSnapshotStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("shortHash", () => {
    it("is deterministic for the same input", () => {
      expect(shortHash("hello")).toBe(shortHash("hello"));
    });

    it("differs for different input", () => {
      expect(shortHash("hello")).not.toBe(shortHash("world"));
    });
  });

  describe("makeSnapshotKey", () => {
    it("combines index and a content hash", () => {
      expect(makeSnapshotKey(3, "hi")).toBe(`3:${shortHash("hi")}`);
    });
  });

  describe("save / get round-trip", () => {
    it("stores and retrieves a snapshot under its identity key", () => {
      saveSnapshot(KEY, 0, "question one", "move()\n");

      const snaps = getSnapshots(KEY);
      expect(snaps[makeSnapshotKey(0, "question one")]).toBe("move()\n");
    });

    it("returns an empty map when nothing is stored", () => {
      expect(getSnapshots(KEY)).toEqual({});
    });

    it("keeps snapshots from different conversations separate", () => {
      saveSnapshot("lesson:a", 0, "q", "code-a");
      saveSnapshot("project:b", 0, "q", "code-b");

      expect(getSnapshots("lesson:a")[makeSnapshotKey(0, "q")]).toBe("code-a");
      expect(getSnapshots("project:b")[makeSnapshotKey(0, "q")]).toBe("code-b");
    });
  });

  describe("pruning", () => {
    it("keeps only the most recent snapshots, dropping the oldest by index", () => {
      for (let i = 0; i < 20; i++) {
        saveSnapshot(KEY, i, `q${i}`, `code-${i}`);
      }

      const snaps = getSnapshots(KEY);
      expect(Object.keys(snaps)).toHaveLength(15);

      // Oldest (index 0) pruned, newest (index 19) retained.
      expect(snaps[makeSnapshotKey(0, "q0")]).toBeUndefined();
      expect(snaps[makeSnapshotKey(4, "q4")]).toBeUndefined();
      expect(snaps[makeSnapshotKey(5, "q5")]).toBe("code-5");
      expect(snaps[makeSnapshotKey(19, "q19")]).toBe("code-19");
    });
  });

  describe("write failure tolerance", () => {
    // The availability probe writes too, so a blanket setItem mock would bail out
    // before the save itself is attempted. Throwing only for our own key exercises
    // the quota path proper.
    function throwOnSnapshotWrites() {
      return jest.spyOn(Storage.prototype, "setItem").mockImplementation((key: string) => {
        if (key.startsWith("jiki_code_snapshots_")) {
          throw new Error("QuotaExceededError");
        }
      });
    }

    it("does not throw when the snapshot write is rejected (quota)", () => {
      const setItem = throwOnSnapshotWrites();

      expect(() => saveSnapshot(KEY, 0, "question one", "move()\n")).not.toThrow();

      setItem.mockRestore();
    });

    it("degrades to no snapshots rather than failing the read", () => {
      const setItem = throwOnSnapshotWrites();
      saveSnapshot(KEY, 0, "question one", "move()\n");
      setItem.mockRestore();

      expect(getSnapshots(KEY)).toEqual({});
    });

    it("does not throw when localStorage is unavailable entirely", () => {
      const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });

      expect(() => saveSnapshot(KEY, 0, "question one", "move()\n")).not.toThrow();
      expect(getSnapshots(KEY)).toEqual({});

      setItem.mockRestore();
    });
  });

  describe("corruption tolerance", () => {
    it("returns an empty map for unparseable stored data", () => {
      localStorage.setItem("jiki_code_snapshots_lesson:test-exercise", "{not json");
      expect(getSnapshots(KEY)).toEqual({});
    });

    it("ignores stored data with a mismatched version", () => {
      localStorage.setItem(
        "jiki_code_snapshots_lesson:test-exercise",
        JSON.stringify({ version: 999, conversationKey: KEY, storedAt: "x", snapshots: { foo: "bar" } })
      );
      expect(getSnapshots(KEY)).toEqual({});
    });
  });
});
