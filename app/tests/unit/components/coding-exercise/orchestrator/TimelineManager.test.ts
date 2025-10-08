import { TimelineManager } from "@/components/coding-exercise/lib/orchestrator/TimelineManager";

import { createMockFrame, createMockOrchestratorStore, createMockTestResult } from "@/tests/mocks";

describe("TimelineManager", () => {
  describe("static findNextFrame", () => {
    it("should return undefined when frames is undefined", () => {
      const currentFrame = createMockFrame(100000, { line: 2 });
      const result = TimelineManager.findNextFrame(undefined, currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should return undefined when frames array is empty", () => {
      const currentFrame = createMockFrame(100000, { line: 2 });
      const result = TimelineManager.findNextFrame([], currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should return the next frame after current frame", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const currentFrame = frames[1]; // Frame at line 2
      const result = TimelineManager.findNextFrame(frames, currentFrame, []);
      expect(result).toEqual(frames[2]); // Should return frame at line 3
    });

    it("should skip folded lines", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 }),
        createMockFrame(300000, { line: 4 })
      ];
      const currentFrame = frames[1]; // Frame at line 2
      const result = TimelineManager.findNextFrame(frames, currentFrame, [3]); // Fold line 3
      expect(result).toEqual(frames[3]); // Should skip line 3 and return line 4
    });

    it("should return undefined when at last frame", () => {
      const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
      const currentFrame = frames[1]; // Last frame
      const result = TimelineManager.findNextFrame(frames, currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should handle frame before first frame in array", () => {
      const frames = [createMockFrame(100000, { line: 1 }), createMockFrame(200000, { line: 2 })];
      const currentFrame = createMockFrame(50000, { line: 0 }); // Before first frame
      const result = TimelineManager.findNextFrame(frames, currentFrame, []);
      expect(result).toEqual(frames[0]); // Should return first frame
    });

    it("should handle frame after last frame in array", () => {
      const frames = [createMockFrame(100000, { line: 1 }), createMockFrame(200000, { line: 2 })];
      const currentFrame = createMockFrame(300000, { line: 3 }); // After last frame
      const result = TimelineManager.findNextFrame(frames, currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should handle all frames being folded", () => {
      const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
      const currentFrame = frames[0];
      const result = TimelineManager.findNextFrame(frames, currentFrame, [1, 2]); // All folded
      expect(result).toBeUndefined();
    });
  });

  describe("static findPrevFrame", () => {
    it("should return undefined when frames is undefined", () => {
      const currentFrame = createMockFrame(100000, { line: 2 });
      const result = TimelineManager.findPrevFrame(undefined, currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should return undefined when frames array is empty", () => {
      const currentFrame = createMockFrame(100000, { line: 2 });
      const result = TimelineManager.findPrevFrame([], currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should return the previous frame before current frame", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const currentFrame = frames[1]; // Frame at line 2
      const result = TimelineManager.findPrevFrame(frames, currentFrame, []);
      expect(result).toEqual(frames[0]); // Should return frame at line 1
    });

    it("should skip folded lines", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 }),
        createMockFrame(300000, { line: 4 })
      ];
      const currentFrame = frames[3]; // Frame at line 4
      const result = TimelineManager.findPrevFrame(frames, currentFrame, [2, 3]); // Fold lines 2 and 3
      expect(result).toEqual(frames[0]); // Should skip folded lines and return line 1
    });

    it("should return undefined when at first frame", () => {
      const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
      const currentFrame = frames[0]; // First frame
      const result = TimelineManager.findPrevFrame(frames, currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should handle frame after last frame in array", () => {
      const frames = [createMockFrame(100000, { line: 1 }), createMockFrame(200000, { line: 2 })];
      const currentFrame = createMockFrame(300000, { line: 3 }); // After last frame
      const result = TimelineManager.findPrevFrame(frames, currentFrame, []);
      expect(result).toEqual(frames[1]); // Should return last frame
    });

    it("should handle frame before first frame in array", () => {
      const frames = [createMockFrame(100000, { line: 1 }), createMockFrame(200000, { line: 2 })];
      const currentFrame = createMockFrame(50000, { line: 0 }); // Before first frame
      const result = TimelineManager.findPrevFrame(frames, currentFrame, []);
      expect(result).toBeUndefined();
    });

    it("should handle all frames being folded", () => {
      const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
      const currentFrame = frames[1];
      const result = TimelineManager.findPrevFrame(frames, currentFrame, [1, 2]); // All folded
      expect(result).toBeUndefined();
    });
  });

  describe("static findNearestFrame", () => {
    it("should return null when frames is null", () => {
      const result = TimelineManager.findNearestFrame(null, 0, []);
      expect(result).toBeNull();
    });

    it("should return null when frames array is empty", () => {
      const result = TimelineManager.findNearestFrame([], 0, []);
      expect(result).toBeNull();
    });

    it("should return first frame when timeline time is negative", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const result = TimelineManager.findNearestFrame(frames, -50000, []);
      expect(result).toEqual(frames[0]);
    });

    it("should return last frame when timeline time is past the last frame", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const result = TimelineManager.findNearestFrame(frames, 300000, []);
      expect(result).toEqual(frames[2]);
    });

    it("should return exact frame when timeline time matches", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const result = TimelineManager.findNearestFrame(frames, 100000, []);
      expect(result).toEqual(frames[1]);
    });

    it("should return nearest frame when timeline time is between frames", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];

      // Closer to frame 1 (timeline 100)
      let result = TimelineManager.findNearestFrame(frames, 80000, []);
      expect(result).toEqual(frames[1]);

      // Closer to frame 2 (timeline 200)
      result = TimelineManager.findNearestFrame(frames, 160000, []);
      expect(result).toEqual(frames[2]);
    });

    it("should skip folded lines", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 }),
        createMockFrame(300000, { line: 4 })
      ];

      // Fold line 2
      const result = TimelineManager.findNearestFrame(frames, 100000, [2]);

      // Should skip frame at line 2 and return nearest non-folded frame
      expect(result?.line).not.toBe(2);
    });

    it("should handle all frames being folded", () => {
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];

      // Fold all lines
      const result = TimelineManager.findNearestFrame(frames, 100000, [1, 2, 3]);

      // Should return last frame as fallback
      expect(result).toEqual(frames[2]);
    });
  });

  describe("instance methods", () => {
    describe("setTime", () => {
      it("should update time in store and seek animation timeline", () => {
        const mockSeek = jest.fn();
        const testResult = createMockTestResult({ frames: [createMockFrame(0, { line: 1 })] });
        testResult.animationTimeline.seek = mockSeek;

        const store = createMockOrchestratorStore({ currentTest: testResult });
        const manager = new TimelineManager(store as any);

        manager.setTime(200000);

        const state = store.getState() as any;
        expect(state.currentTestTime).toBe(200000);
        expect(mockSeek).toHaveBeenCalledWith(200000); // Now expects microseconds directly
      });

      it("should not seek if no animation timeline exists", () => {
        const store = createMockOrchestratorStore();
        const manager = new TimelineManager(store as any);

        // Should not throw
        expect(() => manager.setTime(200000)).not.toThrow();
      });
    });

    describe("getNearestCurrentFrame", () => {
      it("should return null when no current test", () => {
        const store = createMockOrchestratorStore();
        const manager = new TimelineManager(store as any);

        expect(manager.getNearestCurrentFrame()).toBeNull();
      });

      it("should calculate nearest frame to current timeline time", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        // Set timeline time to 150 (between frames 1 and 2)
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 150000 });
        const manager = new TimelineManager(store as any);

        // Should return frame 2 (at time 200) as it's the nearest to 150
        expect(manager.getNearestCurrentFrame()).toEqual(frames[2]);
      });

      it("should find nearest frame even when stored currentFrame is different", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        // Timeline time at 250, but stored frame is frame 0 (incorrect)
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 250000 });
        const manager = new TimelineManager(store as any);

        // Should correctly calculate and return frame 3 (at time 300) as nearest
        expect(manager.getNearestCurrentFrame()).toEqual(frames[3]);
      });

      it("should handle folded lines when finding nearest frame", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }), // This will be folded
          createMockFrame(300000, { line: 4 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({
          currentTest: testResult,
          currentTestTime: 150000,
          foldedLines: [3]
        }); // Fold line 3
        const manager = new TimelineManager(store as any);

        // Should return frame 1, not the folded frame 2
        expect(manager.getNearestCurrentFrame()).toEqual(frames[1]);
      });
    });

    describe("findNextFrame", () => {
      it("should return undefined when no current test", () => {
        const store = createMockOrchestratorStore();
        const manager = new TimelineManager(store as any);

        expect(manager.findNextFrame(0)).toBeUndefined();
      });

      it("should return next non-folded frame", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, foldedLines: [3] }); // Fold line 3
        const manager = new TimelineManager(store as any);

        // From index 1 (line 2), should skip folded line 3 and return line 4
        const result = manager.findNextFrame(1);
        expect(result).toEqual(frames[3]);
      });

      it("should return undefined when at last frame", () => {
        const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult });
        const manager = new TimelineManager(store as any);

        expect(manager.findNextFrame(1)).toBeUndefined();
      });

      it("should skip multiple consecutive folded frames", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 }),
          createMockFrame(400000, { line: 5 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, foldedLines: [2, 3, 4] }); // Fold lines 2, 3, 4
        const manager = new TimelineManager(store as any);

        // From index 0 (line 1), should skip all folded lines and return line 5
        const result = manager.findNextFrame(0);
        expect(result).toEqual(frames[4]);
      });

      it("should use current position when no index provided", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        // Timeline at 150 (between frame 1 and 2)
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 150000 });
        const manager = new TimelineManager(store as any);

        // Should find next from current position
        const result = manager.findNextFrame();
        expect(result).toEqual(frames[2]);
      });

      it("should handle timeline time before all frames", () => {
        const frames = [
          createMockFrame(100000, { line: 1 }),
          createMockFrame(200000, { line: 2 }),
          createMockFrame(300000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // Before all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: -50000 });
        const manager = new TimelineManager(store as any);

        const result = manager.findNextFrame();
        expect(result).toEqual(frames[0]); // Should return first frame
      });

      it("should handle timeline time after all frames", () => {
        const frames = [
          createMockFrame(100000, { line: 1 }),
          createMockFrame(200000, { line: 2 }),
          createMockFrame(300000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // After all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 400000 });
        const manager = new TimelineManager(store as any);

        const result = manager.findNextFrame();
        expect(result).toBeUndefined(); // No next frame
      });

      it("should handle empty frames array", () => {
        const testResult = createMockTestResult({ frames: [] });
        const store = createMockOrchestratorStore({ currentTest: testResult });
        const manager = new TimelineManager(store as any);

        expect(manager.findNextFrame()).toBeUndefined();
        expect(manager.findNextFrame(0)).toBeUndefined();
      });

      it("should handle all frames being folded", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, foldedLines: [1, 2, 3] }); // All folded
        const manager = new TimelineManager(store as any);

        expect(manager.findNextFrame(0)).toBeUndefined();
      });
    });

    describe("findPrevFrame", () => {
      it("should return undefined when no current test", () => {
        const store = createMockOrchestratorStore();
        const manager = new TimelineManager(store as any);

        expect(manager.findPrevFrame(0)).toBeUndefined();
      });

      it("should return previous non-folded frame", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, foldedLines: [3] }); // Fold line 3
        const manager = new TimelineManager(store as any);

        // From index 3, should skip folded line 3 and return line 2
        const result = manager.findPrevFrame(3);
        expect(result).toEqual(frames[1]);
      });

      it("should return undefined when at first frame", () => {
        const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult });
        const manager = new TimelineManager(store as any);

        expect(manager.findPrevFrame(0)).toBeUndefined();
      });

      it("should skip multiple consecutive folded frames", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 }),
          createMockFrame(400000, { line: 5 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, foldedLines: [2, 3, 4] }); // Fold lines 2, 3, 4
        const manager = new TimelineManager(store as any);

        // From index 4 (line 5), should skip all folded lines and return line 1
        const result = manager.findPrevFrame(4);
        expect(result).toEqual(frames[0]);
      });

      it("should use current position when no index provided", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        // Timeline at 250ms (between frame 2 and 3)
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 250000 });
        const manager = new TimelineManager(store as any);

        // Should find prev from current position
        const result = manager.findPrevFrame();
        expect(result).toEqual(frames[1]);
      });

      it("should handle timeline time before all frames", () => {
        const frames = [
          createMockFrame(100000, { line: 1 }),
          createMockFrame(200000, { line: 2 }),
          createMockFrame(300000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // Before all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 50000 });
        const manager = new TimelineManager(store as any);

        const result = manager.findPrevFrame();
        expect(result).toBeUndefined(); // No previous frame
      });

      it("should handle timeline time after all frames", () => {
        const frames = [
          createMockFrame(100000, { line: 1 }),
          createMockFrame(200000, { line: 2 }),
          createMockFrame(300000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // After all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 400000 });
        const manager = new TimelineManager(store as any);

        const result = manager.findPrevFrame();
        expect(result).toEqual(frames[2]); // Should return last frame as previous
      });

      it("should handle empty frames array", () => {
        const testResult = createMockTestResult({ frames: [] });
        const store = createMockOrchestratorStore({ currentTest: testResult });
        const manager = new TimelineManager(store as any);

        expect(manager.findPrevFrame()).toBeUndefined();
        expect(manager.findPrevFrame(0)).toBeUndefined();
      });

      it("should handle all frames being folded", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({
          currentTest: testResult,
          currentTestTime: 150000,
          foldedLines: [1, 2, 3]
        }); // All folded
        const manager = new TimelineManager(store as any);

        expect(manager.findPrevFrame(2)).toBeUndefined();
      });
    });

    describe("getCurrentOrFirstFrameIdx", () => {
      it("should return undefined when no frames", () => {
        const store = createMockOrchestratorStore();
        const manager = new TimelineManager(store as any);

        // Access private method via any
        const result = (manager as any).getCurrentOrFirstFrameIdx();
        expect(result).toBeUndefined();
      });

      it("should return -1 when timeline time is negative", () => {
        const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: -50000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrFirstFrameIdx();
        expect(result).toBe(-1);
      });

      it("should return -1 when timeline time is before first frame", () => {
        const frames = [
          createMockFrame(100000, { line: 1 }), // First frame at 100
          createMockFrame(200000, { line: 2 })
        ];
        const testResult = createMockTestResult({ frames }); // Before first frame (100ms)
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 50000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrFirstFrameIdx();
        expect(result).toBe(-1);
      });

      it("should return correct index when timeline time is between frames", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        const testResult = createMockTestResult({ frames }); // Between frame 1 (100ms) and 2 (200ms)
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 150000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrFirstFrameIdx();
        expect(result).toBe(1); // Index of frame just before timeline time
      });

      it("should return last index when timeline time is after all frames", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // After all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 300000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrFirstFrameIdx();
        expect(result).toBe(2); // Last frame index
      });

      it("should return exact frame index when timeline time matches", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // Exactly at frame 1 (100ms)
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 100000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrFirstFrameIdx();
        expect(result).toBe(1); // Frame at timeline time 100
      });

      it("should handle single frame", () => {
        const frames = [createMockFrame(100000, { line: 1 })];

        // Before frame
        let testResult = createMockTestResult({ frames });
        let store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 50000 });
        let manager = new TimelineManager(store as any);
        expect((manager as any).getCurrentOrFirstFrameIdx()).toBe(-1);

        // At frame
        testResult = createMockTestResult({ frames });
        store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 100000 });
        manager = new TimelineManager(store as any);
        expect((manager as any).getCurrentOrFirstFrameIdx()).toBe(0);

        // After frame
        testResult = createMockTestResult({ frames });
        store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 150000 });
        manager = new TimelineManager(store as any);
        expect((manager as any).getCurrentOrFirstFrameIdx()).toBe(0);
      });
    });

    describe("getCurrentOrLastFrameIdx", () => {
      it("should return undefined when no frames", () => {
        const store = createMockOrchestratorStore();
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrLastFrameIdx();
        expect(result).toBeUndefined();
      });

      it("should return 0 when timeline time is before all frames", () => {
        const frames = [
          createMockFrame(100000, { line: 1 }), // First frame at 100
          createMockFrame(200000, { line: 2 })
        ];
        const testResult = createMockTestResult({ frames }); // Before all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 50000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrLastFrameIdx();
        expect(result).toBe(0); // Should return 0 as starting point for prev search
      });

      it("should return correct index when timeline time is between frames", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 }),
          createMockFrame(300000, { line: 4 })
        ];
        const testResult = createMockTestResult({ frames }); // Between frame 1 (100ms) and 2 (200ms)
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 150000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrLastFrameIdx();
        expect(result).toBe(1); // Last frame before or at timeline time
      });

      it("should return last index when timeline time is after all frames", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // After all frames
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 300000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrLastFrameIdx();
        expect(result).toBe(2); // Last frame index
      });

      it("should return exact frame index when timeline time matches", () => {
        const frames = [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ];
        const testResult = createMockTestResult({ frames }); // Exactly at frame 1 (100ms)
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 100000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrLastFrameIdx();
        expect(result).toBe(1); // Frame at timeline time 100
      });

      it("should handle negative timeline time", () => {
        const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
        const testResult = createMockTestResult({ frames });
        const store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: -50000 });
        const manager = new TimelineManager(store as any);

        const result = (manager as any).getCurrentOrLastFrameIdx();
        expect(result).toBe(0); // Should return 0 for negative time
      });

      it("should handle single frame", () => {
        const frames = [createMockFrame(100000, { line: 1 })];

        // Before frame
        let testResult = createMockTestResult({ frames });
        let store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 50000 });
        let manager = new TimelineManager(store as any);
        expect((manager as any).getCurrentOrLastFrameIdx()).toBe(0);

        // At frame
        testResult = createMockTestResult({ frames });
        store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 100000 });
        manager = new TimelineManager(store as any);
        expect((manager as any).getCurrentOrLastFrameIdx()).toBe(0);

        // After frame
        testResult = createMockTestResult({ frames });
        store = createMockOrchestratorStore({ currentTest: testResult, currentTestTime: 150000 });
        manager = new TimelineManager(store as any);
        expect((manager as any).getCurrentOrLastFrameIdx()).toBe(0);
      });
    });
  });
});
