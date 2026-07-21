// Unit tests for the build-time PostCSS plugin that reshuffles physical
// margin/padding shorthands into two-axis logical form.
/* eslint-disable @typescript-eslint/no-require-imports */
const postcss = require("postcss");
const plugin = require("@/postcss-plugins/shorthand-physical-to-logical.cjs");

function run(css: string): string {
  return postcss([plugin]).process(css, { from: undefined }).css;
}

describe("shorthand-physical-to-logical PostCSS plugin", () => {
  it("expands a 1-value padding to both axes", () => {
    expect(run("a { padding: 4px }")).toContain("padding-block: 4px");
    expect(run("a { padding: 4px }")).toContain("padding-inline: 4px");
  });

  it("expands a 2-value margin (block then inline)", () => {
    const out = run("a { margin: 1px 2px }");
    expect(out).toContain("margin-block: 1px");
    expect(out).toContain("margin-inline: 2px");
  });

  it("expands a 3-value padding (block = top bottom, inline = middle)", () => {
    const out = run("a { padding: 1px 2px 3px }");
    expect(out).toContain("padding-block: 1px 3px");
    expect(out).toContain("padding-inline: 2px");
  });

  it("expands a 4-value padding with inline order LEFT then RIGHT (D B)", () => {
    const out = run("a { padding: 1px 2px 3px 4px }");
    expect(out).toContain("padding-block: 1px 3px");
    expect(out).toContain("padding-inline: 4px 2px");
  });

  it("expands a 4-value margin with inline order LEFT then RIGHT (D B)", () => {
    const out = run("a { margin: 1px 2px 3px 4px }");
    expect(out).toContain("margin-block: 1px 3px");
    expect(out).toContain("margin-inline: 4px 2px");
  });

  it("carries !important onto both resulting declarations", () => {
    const out = run("a { padding: 1px 2px !important }");
    expect(out).toContain("padding-block: 1px !important");
    expect(out).toContain("padding-inline: 2px !important");
  });

  it("keeps calc()/var() values with internal spaces intact", () => {
    const out = run("a { padding: calc(1rem + 2px) var(--x, 3px 4px) }");
    expect(out).toContain("padding-block: calc(1rem + 2px)");
    expect(out).toContain("padding-inline: var(--x, 3px 4px)");
  });

  it("handles margin: 0 auto", () => {
    const out = run("a { margin: 0 auto }");
    expect(out).toContain("margin-block: 0");
    expect(out).toContain("margin-inline: auto");
  });

  it("passes CSS-wide keywords through both axes", () => {
    const out = run("a { padding: inherit }");
    expect(out).toContain("padding-block: inherit");
    expect(out).toContain("padding-inline: inherit");
  });

  it("is idempotent — already-logical props are untouched", () => {
    const input = "a { padding-inline: 4px 2px; margin-block: 1px 3px }";
    expect(run(input)).toBe(input);
  });

  it("leaves other shorthands untouched", () => {
    const input = "a { border: 1px solid; inset: 0 1px 2px 3px; gap: 1px 2px }";
    expect(run(input)).toBe(input);
  });

  it("leaves directional longhands untouched", () => {
    const input = "a { margin-top: 4px; padding-inline-start: 2px }";
    expect(run(input)).toBe(input);
  });
});
