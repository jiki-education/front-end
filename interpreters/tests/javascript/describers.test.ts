import { describe, expect, test } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@javascript/interpreter";
import { describeFrame } from "@javascript/frameDescribers";
import type { ExternalFunction } from "@shared/interfaces";
import type { ExecutionContext } from "@javascript/executor";
import type { JikiObject } from "@javascript/jsObjects";

describe("describers", () => {
  describe("frames and descriptions", () => {
    test("simple arithmetic expression", () => {
      const code = "3 + 4;";
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("Jiki");
      expect(description).toContain("Steps Jiki Took");
      expect(description).toContain("7");
    });

    test("string concatenation", () => {
      const code = '"hello" + " world";';
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("Jiki");
      expect(description).toContain("hello world");
    });

    test("boolean expression", () => {
      const code = "true && false;";
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("Jiki");
      expect(description).toContain("false");
    });

    test("grouping expression", () => {
      const code = "(5 + 3) * 2;";
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("Jiki");
      expect(description).toContain("16");
    });

    test("compound assignment with function call shows intermediate steps", () => {
      const marketGrowth: ExternalFunction = {
        name: "marketGrowth",
        func: (_context: ExecutionContext, _year: JikiObject) => 8,
        description: "returns market growth",
        arity: 1,
      };

      const code = `
        let year = 2026;
        let money = 100;
        money = money * (100 + marketGrowth(year)) / 99;
      `;
      const result = interpret(code, {
        externalFunctions: [marketGrowth],
      });

      expect(result.error).toBeNull();

      const assignFrame = result.frames[2];
      const description = describeFrame(assignFrame);
      expect(description).toMatchInlineSnapshot(`
        "<div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            What happened
          </div>
          <p>This expression evaluated to <code>109.09091</code>.</p>
          <hr/>
          <h3>Steps Jiki Took</h3>
          <ul>
            <li>Looked up the function <code>marketGrowth</code></li>
        <li>Called <code>marketGrowth</code> with <code>2026</code> and got <code>8</code></li>
        <li>Jiki evaluated <code data-hl-from="77" data-hl-to="101">100 + 8</code> and determined it was <code data-hl-from="77" data-hl-to="101">108</code>.</li>
        <li>Jiki evaluated <code data-hl-from="68" data-hl-to="102">100 * 108</code> and determined it was <code data-hl-from="68" data-hl-to="102">10800</code>.</li>
        <li>Jiki evaluated <code data-hl-from="68" data-hl-to="107">10800 / 99</code> and determined it was <code data-hl-from="68" data-hl-to="107">109.09091</code>.</li>
        <li>Jiki updated the variable <code>money</code> to <code>109.09091</code>.</li>
          </ul>"
      `);
    });
  });
});
