import { AnimationTimeline } from "@/components/coding-exercise/lib/AnimationTimeline";
import { createMockFrame } from "@/tests/mocks";
import type { Animation as CurriculumAnimation } from "@jiki/curriculum";
import type { Frame } from "@jiki/interpreters";
import type { DefaultsParams, Timeline } from "animejs";
import { createTimeline } from "animejs";

// Mock animejs
jest.mock("animejs", () => ({
  createTimeline: jest.fn()
}));

describe("AnimationTimeline", () => {
  let mockTimeline: Partial<Timeline>;
  let animationTimeline: AnimationTimeline;
  const mockFrames: Frame[] = [
    createMockFrame(0, { line: 1 }),
    createMockFrame(30000, { line: 2 }), // 30ms
    createMockFrame(60000, { line: 3 }), // 60ms
    createMockFrame(90000, {
      line: 4,
      status: "ERROR",
      error: { message: "Test error", type: "runtime" }
    })
  ];

  beforeEach(() => {
    // Reset the mock timeline
    mockTimeline = {
      duration: 100,
      currentTime: 0,
      paused: true,
      completed: false,
      play: jest.fn(),
      pause: jest.fn(),
      seek: jest.fn(),
      add: jest.fn().mockReturnThis()
    };

    // Setup createTimeline mock to capture callbacks
    (createTimeline as jest.Mock).mockImplementation((params) => {
      // Store callbacks for later triggering
      if (params?.onUpdate) {
        mockTimeline.onUpdate = params.onUpdate;
      }
      if (params?.onBegin) {
        mockTimeline.onBegin = params.onBegin;
      }
      if (params?.onComplete) {
        mockTimeline.onComplete = params.onComplete;
      }
      if (params?.onPause) {
        mockTimeline.onPause = params.onPause;
      }
      return mockTimeline as Timeline;
    });

    animationTimeline = new AnimationTimeline({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create timeline with default options", () => {
      expect(createTimeline).toHaveBeenCalledWith({
        defaults: {
          ease: "linear"
        },
        autoplay: false,
        onUpdate: expect.any(Function),
        onComplete: expect.any(Function)
      });
    });

    it("should merge initial options with defaults", () => {
      const customOptions: DefaultsParams = { duration: 500 };
      new AnimationTimeline(customOptions);

      expect(createTimeline).toHaveBeenCalledWith({
        defaults: {
          ease: "linear",
          duration: 500
        },
        autoplay: false,
        onUpdate: expect.any(Function),
        onComplete: expect.any(Function)
      });
    });

    it("should initialize with provided frames", () => {
      // Frames are now private, stored internally
      // getFrames() method has been removed
      expect(animationTimeline).toBeDefined();
    });

    it("should initialize state properties", () => {
      expect(animationTimeline.hasPlayedOrScrubbed).toBe(false);
      // progress, showPlayButton, and currentFrameIndex properties removed
    });
  });

  describe("populateTimeline", () => {
    it("should add animations with transformations to timeline", () => {
      const animations: CurriculumAnimation[] = [
        {
          targets: ".element",
          offset: 100,
          transformations: { opacity: 1, translateX: 100 }
        }
      ];

      animationTimeline.populateTimeline(animations, []);

      expect(mockTimeline.add).toHaveBeenCalledWith(".element", { opacity: 1, translateX: 100 }, 100);
    });

    it("should handle animations without transformations", () => {
      const animations = [
        {
          targets: ".element",
          offset: 0,
          duration: 1000,
          transformations: {
            opacity: 0.5
          }
        }
      ];

      animationTimeline.populateTimeline(animations as never, []);

      expect(mockTimeline.add).toHaveBeenCalledWith(".element", { duration: 1000, opacity: 0.5 }, 0);
    });

    // showPlayButton property removed

    it("should adjust duration to include last frame", () => {
      mockTimeline.duration = 50;
      animationTimeline.populateTimeline([], mockFrames);

      // Should set duration to the last frame's time (90000 microseconds = 90ms)
      expect(mockTimeline.duration).toBe(90);
    });

    it("should handle empty frames array", () => {
      const emptyTimeline = new AnimationTimeline({});
      mockTimeline.duration = 100;

      emptyTimeline.populateTimeline([], []);

      expect(mockTimeline.duration).toBe(100);
    });
  });

  describe("callback management", () => {
    describe("onUpdate", () => {
      it("should register update callbacks", () => {
        const callback = jest.fn();
        animationTimeline.onUpdate(callback);

        // Trigger update through mock
        mockTimeline.currentTime = 30;
        mockTimeline.onUpdate?.(mockTimeline as Timeline);

        expect(callback).toHaveBeenCalledWith(mockTimeline);
      });

      it("should register update callbacks without immediate call", () => {
        const callback = jest.fn();

        animationTimeline.onUpdate(callback);

        // Callback is no longer called immediately
        expect(callback).not.toHaveBeenCalled();

        // But should be called when timeline updates
        mockTimeline.onUpdate?.(mockTimeline as Timeline);
        expect(callback).toHaveBeenCalledWith(mockTimeline);
      });

      it("should handle multiple update callbacks", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        animationTimeline.onUpdate(callback1);
        animationTimeline.onUpdate(callback2);

        mockTimeline.onUpdate?.(mockTimeline as Timeline);

        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });

      it("should clear all update callbacks when clearUpdateCallbacks is called", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        animationTimeline.onUpdate(callback1);
        animationTimeline.onUpdate(callback2);

        // Clear previous calls from onUpdate immediate invocation
        callback1.mockClear();
        callback2.mockClear();

        animationTimeline.clearUpdateCallbacks();

        mockTimeline.onUpdate?.(mockTimeline as Timeline);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
      });
    });
  });

  // Frame navigation tests removed - functionality moved to TimelineManager

  describe("seek methods", () => {
    it("should seek to specific time with conversion from microseconds to milliseconds", () => {
      // 50000 microseconds = 50 milliseconds (using Math.round)
      animationTimeline.seek(50000);
      expect(mockTimeline.seek).toHaveBeenCalledWith(50);

      // Test rounding
      animationTimeline.seek(50500);
      expect(mockTimeline.seek).toHaveBeenCalledWith(51);
    });

    it("should handle seeking to zero", () => {
      animationTimeline.seek(0);
      expect(mockTimeline.seek).toHaveBeenCalledWith(0);
    });
  });

  describe("playback control", () => {
    describe("play", () => {
      it("should play the timeline", () => {
        animationTimeline.play();
        expect(mockTimeline.play).toHaveBeenCalled();
      });

      it("should play even if completed (no auto-reset)", () => {
        mockTimeline.completed = true;
        animationTimeline.play();

        // AnimationTimeline.play() no longer resets on completion
        // That responsibility moved to Orchestrator.play()
        expect(mockTimeline.seek).not.toHaveBeenCalled();
        expect(mockTimeline.play).toHaveBeenCalled();
      });

      it("should execute callback before playing", () => {
        const callback = jest.fn();
        animationTimeline.play(callback);

        expect(callback).toHaveBeenCalled();
        expect(mockTimeline.play).toHaveBeenCalled();
      });
    });

    describe("pause", () => {
      it("should pause the timeline", () => {
        animationTimeline.pause();
        expect(mockTimeline.pause).toHaveBeenCalled();
      });

      it("should execute callback after pausing", () => {
        const callback = jest.fn();
        const pauseFn = mockTimeline.pause as jest.Mock;

        animationTimeline.pause(callback);

        expect(pauseFn).toHaveBeenCalled();
        expect(callback).toHaveBeenCalled();
      });
    });

    // restart and reverse methods removed from AnimationTimeline
  });

  describe("property getters", () => {
    // timeline getter removed

    it("should return duration", () => {
      mockTimeline.duration = 250;
      expect(animationTimeline.duration).toBe(250000); // it scales into microseconds
    });

    it("should return paused state", () => {
      mockTimeline.paused = true;
      expect(animationTimeline.paused).toBe(true);

      mockTimeline.paused = false;
      expect(animationTimeline.paused).toBe(false);
    });

    it("should return completed state", () => {
      mockTimeline.completed = false;
      expect(animationTimeline.completed).toBe(false);

      mockTimeline.completed = true;
      expect(animationTimeline.completed).toBe(true);
    });

    // getProgress method and progress property removed

    // framesLength property removed - frames are internal
  });

  describe("destroy", () => {
    it("should pause timeline and set to null", () => {
      animationTimeline.destroy();

      expect(mockTimeline.pause).toHaveBeenCalled();
      // Can't directly test null assignment due to @ts-expect-error
    });
  });

  describe("edge cases", () => {
    it("should handle timeline with no frames", () => {
      const emptyTimeline = new AnimationTimeline({});
      // framesLength and getCurrentFrame methods removed
      expect(emptyTimeline).toBeDefined();
    });

    it("should handle seeking beyond timeline duration", () => {
      animationTimeline.seek(1000000); // microseconds
      expect(mockTimeline.seek).toHaveBeenCalledWith(1000); // converted to ms
    });

    it("should handle negative seek values", () => {
      animationTimeline.seek(-10000); // microseconds
      expect(mockTimeline.seek).toHaveBeenCalledWith(-10); // converted to ms
    });

    it("should handle updateScrubber with valid timeline", () => {
      // This should not throw when called with valid timeline
      expect(() => {
        mockTimeline.onUpdate?.(mockTimeline as Timeline);
      }).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should track hasPlayedOrScrubbed state correctly", () => {
      expect(animationTimeline.hasPlayedOrScrubbed).toBe(false);
      // This would typically be set by external code
      animationTimeline.hasPlayedOrScrubbed = true;
      expect(animationTimeline.hasPlayedOrScrubbed).toBe(true);
    });

    it("should handle complex animation sequence", () => {
      const animations: CurriculumAnimation[] = [
        {
          targets: ".element1",
          offset: 0,
          transformations: { opacity: 1 }
        },
        {
          targets: ".element2",
          offset: 100,
          transformations: { translateX: 100 }
        },
        {
          targets: ".element3",
          offset: 200,
          transformations: { scale: 1.5 }
        }
      ];

      animationTimeline.populateTimeline(animations, []);

      expect(mockTimeline.add).toHaveBeenCalledTimes(3);
      expect(mockTimeline.add).toHaveBeenNthCalledWith(1, ".element1", { opacity: 1 }, 0);
      expect(mockTimeline.add).toHaveBeenNthCalledWith(2, ".element2", { translateX: 100 }, 100);
      expect(mockTimeline.add).toHaveBeenNthCalledWith(3, ".element3", { scale: 1.5 }, 200);
    });

    it("should update all state when scrubbing through timeline", () => {
      const updateCallback = jest.fn();
      animationTimeline.onUpdate(updateCallback);

      // Simulate scrubbing to different positions
      const positions = [0, 15, 30, 45, 60, 75, 90];
      positions.forEach((pos) => {
        mockTimeline.currentTime = pos;
        mockTimeline.onUpdate?.(mockTimeline as Timeline);
      });

      // No initial call anymore, only called on timeline updates
      expect(updateCallback).toHaveBeenCalledTimes(positions.length);
      // progress and currentFrameIndex properties removed
    });
  });
});
