import { BreakpointManager } from "@/components/coding-exercise/lib/orchestrator/BreakpointManager";
import type { Frame } from "@jiki/interpreters";
import { mockFrame } from "@/tests/mocks";

describe("BreakpointManager", () => {
  describe("findPrevBreakpointFrame", () => {
    it("should return undefined when no breakpoints are set", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 }), mockFrame(300, { line: 3 })];
      const currentFrame = frames[2];
      const breakpoints: number[] = [];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should return undefined when currentFrame is undefined", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 })];
      const breakpoints = [1, 2];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(undefined, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should find previous frame matching a breakpoint", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 }),
        mockFrame(500, { line: 5 })
      ];
      const currentFrame = frames[3]; // Line 4
      const breakpoints = [2, 4]; // Breakpoints on lines 2 and 4
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[1]); // Should return frame at line 2
    });

    it("should skip folded lines when finding previous breakpoint", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 }),
        mockFrame(500, { line: 5 })
      ];
      const currentFrame = frames[4]; // Line 5
      const breakpoints = [2, 3, 4];
      const foldedLines = [3, 4]; // Lines 3 and 4 are folded

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[1]); // Should return frame at line 2 (skipping 3 and 4)
    });

    it("should return undefined when no previous breakpoint exists", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 }), mockFrame(300, { line: 3 })];
      const currentFrame = frames[1]; // Line 2
      const breakpoints = [3]; // Only breakpoint is after current
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should handle multiple frames on the same line", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(250, { line: 2 }), // Another frame on line 2
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 })
      ];
      const currentFrame = frames[4]; // Line 4
      const breakpoints = [2];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[2]); // Should return the last frame on line 2
    });

    it("should return undefined when all previous breakpoints are folded", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 })
      ];
      const currentFrame = frames[3]; // Line 4
      const breakpoints = [1, 2, 3];
      const foldedLines = [1, 2, 3]; // All breakpoint lines are folded

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should find breakpoint when current frame is also on a breakpoint", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 })
      ];
      const currentFrame = frames[2]; // Line 3 (on a breakpoint)
      const breakpoints = [1, 3]; // Current frame is on a breakpoint
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[0]); // Should return frame at line 1
    });

    it("should handle empty frames array", () => {
      const frames: Frame[] = [];
      const currentFrame = mockFrame(100, { line: 1 });
      const breakpoints = [1];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findPrevBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });
  });

  describe("findNextBreakpointFrame", () => {
    it("should return undefined when no breakpoints are set", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 }), mockFrame(300, { line: 3 })];
      const currentFrame = frames[0];
      const breakpoints: number[] = [];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should return undefined when currentFrame is undefined", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 })];
      const breakpoints = [1, 2];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(undefined, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should find next frame matching a breakpoint", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 }),
        mockFrame(500, { line: 5 })
      ];
      const currentFrame = frames[1]; // Line 2
      const breakpoints = [2, 4]; // Breakpoints on lines 2 and 4
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[3]); // Should return frame at line 4
    });

    it("should skip folded lines when finding next breakpoint", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 }),
        mockFrame(500, { line: 5 })
      ];
      const currentFrame = frames[0]; // Line 1
      const breakpoints = [2, 3, 4];
      const foldedLines = [2, 3]; // Lines 2 and 3 are folded

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[3]); // Should return frame at line 4 (skipping 2 and 3)
    });

    it("should return undefined when no next breakpoint exists", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 }), mockFrame(300, { line: 3 })];
      const currentFrame = frames[1]; // Line 2
      const breakpoints = [1]; // Only breakpoint is before current
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should handle multiple frames on the same line", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(350, { line: 3 }), // Another frame on line 3
        mockFrame(400, { line: 4 })
      ];
      const currentFrame = frames[0]; // Line 1
      const breakpoints = [3];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[2]); // Should return the first frame on line 3
    });

    it("should return undefined when all next breakpoints are folded", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 })
      ];
      const currentFrame = frames[0]; // Line 1
      const breakpoints = [2, 3, 4];
      const foldedLines = [2, 3, 4]; // All breakpoint lines are folded

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should find breakpoint when current frame is also on a breakpoint", () => {
      const frames = [
        mockFrame(100, { line: 1 }),
        mockFrame(200, { line: 2 }),
        mockFrame(300, { line: 3 }),
        mockFrame(400, { line: 4 })
      ];
      const currentFrame = frames[1]; // Line 2 (on a breakpoint)
      const breakpoints = [2, 4]; // Current frame is on a breakpoint
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toEqual(frames[3]); // Should return frame at line 4
    });

    it("should handle empty frames array", () => {
      const frames: Frame[] = [];
      const currentFrame = mockFrame(100, { line: 1 });
      const breakpoints = [2];
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });

    it("should handle breakpoints on non-existent lines", () => {
      const frames = [mockFrame(100, { line: 1 }), mockFrame(200, { line: 2 }), mockFrame(300, { line: 3 })];
      const currentFrame = frames[0];
      const breakpoints = [5, 10]; // Breakpoints on lines that don't have frames
      const foldedLines: number[] = [];

      const result = BreakpointManager.findNextBreakpointFrame(currentFrame, frames, breakpoints, foldedLines);
      expect(result).toBeUndefined();
    });
  });
});
