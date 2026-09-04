import { diffLines } from "@/lib/modal/modals/lineDiff";

describe("diffLines", () => {
  it("pairs identical texts row by row with nothing marked", () => {
    expect(diffLines("a\nb", "a\nb")).toEqual([
      { left: { text: "a", changed: false }, right: { text: "a", changed: false } },
      { left: { text: "b", changed: false }, right: { text: "b", changed: false } }
    ]);
  });

  it("gives a line only present on one side a spacer on the other", () => {
    expect(diffLines("a\nb\nc", "a\nc")).toEqual([
      { left: { text: "a", changed: false }, right: { text: "a", changed: false } },
      { left: { text: "b", changed: true }, right: null },
      { left: { text: "c", changed: false }, right: { text: "c", changed: false } }
    ]);
  });

  it("pairs a rewritten line onto one row, marked on both sides", () => {
    expect(diffLines("a\nold\nc", "a\nnew\nc")[1]).toEqual({
      left: { text: "old", changed: true },
      right: { text: "new", changed: true }
    });
  });

  it("aligns unequal runs with spacers on the shorter side", () => {
    expect(diffLines("a\nx\ny\nb", "a\nz\nb")).toEqual([
      { left: { text: "a", changed: false }, right: { text: "a", changed: false } },
      { left: { text: "x", changed: true }, right: { text: "z", changed: true } },
      { left: { text: "y", changed: true }, right: null },
      { left: { text: "b", changed: false }, right: { text: "b", changed: false } }
    ]);
  });

  it("marks everything when nothing matches", () => {
    const rows = diffLines("x\ny", "p\nq");

    expect(rows).toHaveLength(2);
    expect(rows.every((r) => r.left?.changed && r.right?.changed)).toBe(true);
  });

  it("skips highlighting on pathologically large inputs", () => {
    const big = Array.from({ length: 1000 }, (_, i) => `line ${i}`).join("\n");
    const rows = diffLines(big, `${big}\nextra`);

    expect(rows).toHaveLength(1001);
    expect(rows.some((r) => r.left?.changed || r.right?.changed)).toBe(false);
    expect(rows[1000]).toEqual({ left: null, right: { text: "extra", changed: false } });
  });
});
