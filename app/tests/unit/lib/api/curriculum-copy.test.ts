import { resolveBadgeCopy, resolveCopy } from "@/lib/api/curriculum-copy";
import type { BadgeCopyCatalog, CurriculumCopyCatalog } from "@/lib/api/curriculum-copy";

// The fetch side is exercised through the pages that load it; these cover the
// resolution rules, which are what every render site depends on.
//
// The catalogs deliberately have no English fallback (see lib/api/curriculum-copy.ts):
// an unresolved slug renders as the slug itself so a gap is visible rather than
// silently showing English to a non-English reader.

describe("resolveCopy", () => {
  const catalog: CurriculumCopyCatalog = {
    "maze-solve-basic": { title: "Solve the Maze", description: "Guide Jiki through a maze." }
  };

  it("returns the catalog entry for a known slug", () => {
    expect(resolveCopy(catalog, "maze-solve-basic")).toEqual({
      title: "Solve the Maze",
      description: "Guide Jiki through a maze."
    });
  });

  it("falls back to the slug as the title when the entry is missing", () => {
    expect(resolveCopy(catalog, "not-in-catalog")).toEqual({ title: "not-in-catalog", description: "" });
  });

  it("falls back for every slug when the catalog is empty", () => {
    // This is the shape a failed fetch or an unknown locale resolves to.
    expect(resolveCopy({}, "maze-solve-basic")).toEqual({ title: "maze-solve-basic", description: "" });
  });

  it("does not treat inherited Object properties as entries", () => {
    // The catalog is parsed JSON, so a slug colliding with an Object.prototype
    // key must still miss rather than returning a function.
    expect(resolveCopy({}, "constructor")).toEqual({ title: "constructor", description: "" });
    expect(resolveCopy({}, "toString")).toEqual({ title: "toString", description: "" });
  });
});

describe("resolveBadgeCopy", () => {
  const catalog: BadgeCopyCatalog = {
    member: { name: "Member", description: "Joined Jiki", funFact: "Welcome to the community!" }
  };

  it("returns the catalog entry for a known badge", () => {
    expect(resolveBadgeCopy(catalog, "member")).toEqual({
      name: "Member",
      description: "Joined Jiki",
      funFact: "Welcome to the community!"
    });
  });

  it("falls back to the slug as the name when the badge is missing", () => {
    // The API can award a badge before its copy is authored; that must degrade
    // visibly rather than throwing on the achievements page.
    expect(resolveBadgeCopy(catalog, "maze_navigator")).toEqual({
      name: "maze_navigator",
      description: "",
      funFact: ""
    });
  });

  it("falls back for every badge when the catalog is empty", () => {
    expect(resolveBadgeCopy({}, "member")).toEqual({ name: "member", description: "", funFact: "" });
  });
});
