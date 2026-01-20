import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import * as localStorage from "@/components/coding-exercise/lib/localStorage";
import { createMockExercise } from "@/tests/mocks/exercise";

// Mock localStorage functions
jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(),
  saveCodeMirrorContent: jest.fn()
}));

const mockLoadCodeMirrorContent = localStorage.loadCodeMirrorContent as jest.MockedFunction<
  typeof localStorage.loadCodeMirrorContent
>;

describe("Data Initialization Priority Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Rule 1: No server data and no localStorage", () => {
    it("should use initial code when no data exists", () => {
      // Arrange
      const exerciseUuid = "it-exercise-1";
      const initialCode = "// Initial starter code";
      mockLoadCodeMirrorContent.mockReturnValue({
        success: false,
        error: "No data found for this exercise"
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData();

      // Assert
      const state = store.getState();
      expect(state.code).toBe(initialCode);
      expect(state.defaultCode).toBe(initialCode);
      expect(mockLoadCodeMirrorContent).toHaveBeenCalledWith(exerciseUuid);
    });
  });

  describe("Rule 2: No server data but localStorage exists", () => {
    it("should use localStorage when no server data provided", () => {
      // Arrange
      const exerciseUuid = "it-exercise-2";
      const initialCode = "// Initial starter code";
      const localStorageCode = "// Saved user code from localStorage";
      const storedAt = new Date().toISOString();

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt,
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData();

      // Assert
      const state = store.getState();
      expect(state.code).toBe(localStorageCode);
      expect(state.defaultCode).toBe(localStorageCode);
    });
  });

  describe("Rule 3: Server data exists", () => {
    it("should use server data when no localStorage exists", () => {
      // Arrange
      const exerciseUuid = "it-exercise-3";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const serverData = {
        code: serverCode,
        storedAt: new Date().toISOString()
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: false,
        error: "No data found for this exercise"
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(serverCode);
      expect(state.defaultCode).toBe(serverCode);
    });

    it("should use localStorage when server has no timestamp", () => {
      // Arrange
      const exerciseUuid = "it-exercise-4";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const localStorageCode = "// Saved user code";
      const localStoredAt = new Date().toISOString();

      const serverData = {
        code: serverCode
        // No storedAt timestamp
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt: localStoredAt,
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(localStorageCode);
      expect(state.defaultCode).toBe(localStorageCode);
    });

    it("should use server data when server is newer by more than 1 minute", () => {
      // Arrange
      const exerciseUuid = "it-exercise-5";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const localStorageCode = "// Saved user code";

      const localTime = new Date();
      const serverTime = new Date(localTime.getTime() + 120000); // 2 minutes later

      const serverData = {
        code: serverCode,
        storedAt: serverTime.toISOString()
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt: localTime.toISOString(),
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(serverCode);
      expect(state.defaultCode).toBe(serverCode);
    });

    it("should use localStorage when server is only slightly newer (less than 1 minute)", () => {
      // Arrange
      const exerciseUuid = "it-exercise-6";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const localStorageCode = "// Saved user code";

      const localTime = new Date();
      const serverTime = new Date(localTime.getTime() + 30000); // 30 seconds later

      const serverData = {
        code: serverCode,
        storedAt: serverTime.toISOString()
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt: localTime.toISOString(),
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(localStorageCode);
      expect(state.defaultCode).toBe(localStorageCode);
    });

    it("should use localStorage when localStorage is newer than server", () => {
      // Arrange
      const exerciseUuid = "it-exercise-7";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const localStorageCode = "// Saved user code";

      const serverTime = new Date();
      const localTime = new Date(serverTime.getTime() + 120000); // 2 minutes later

      const serverData = {
        code: serverCode,
        storedAt: serverTime.toISOString()
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt: localTime.toISOString(),
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(localStorageCode);
      expect(state.defaultCode).toBe(localStorageCode);
    });

    it("should use localStorage when timestamps are equal", () => {
      // Arrange
      const exerciseUuid = "it-exercise-8";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const localStorageCode = "// Saved user code";
      const timestamp = new Date().toISOString();

      const serverData = {
        code: serverCode,
        storedAt: timestamp
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt: timestamp,
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(localStorageCode);
      expect(state.defaultCode).toBe(localStorageCode);
    });
  });

  describe("Edge cases", () => {
    it("should handle corrupted localStorage gracefully", () => {
      // Arrange
      const exerciseUuid = "it-exercise-corrupted";
      const initialCode = "// Initial starter code";

      mockLoadCodeMirrorContent.mockReturnValue({
        success: false,
        error: "Failed to parse JSON"
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData();

      // Assert
      const state = store.getState();
      expect(state.code).toBe(initialCode);
      expect(state.defaultCode).toBe(initialCode);
    });

    it("should handle localStorage unavailable", () => {
      // Arrange
      const exerciseUuid = "it-exercise-no-storage";
      const initialCode = "// Initial starter code";

      mockLoadCodeMirrorContent.mockReturnValue({
        success: false,
        error: "localStorage is not available"
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData();

      // Assert
      const state = store.getState();
      expect(state.code).toBe(initialCode);
      expect(state.defaultCode).toBe(initialCode);
    });

    it("should handle invalid server timestamp", () => {
      // Arrange
      const exerciseUuid = "it-exercise-invalid-timestamp";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";
      const localStorageCode = "// Saved user code";

      const serverData = {
        code: serverCode,
        storedAt: "invalid-date"
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localStorageCode,
          storedAt: new Date().toISOString(),
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert - Should use localStorage when server timestamp is invalid
      const state = store.getState();
      expect(state.code).toBe(localStorageCode);
      expect(state.defaultCode).toBe(localStorageCode);
    });

    it("should handle invalid localStorage timestamp", () => {
      // Arrange
      const exerciseUuid = "it-exercise-invalid-local-timestamp";
      const initialCode = "// Initial starter code";
      const serverCode = "// Server code";

      const serverData = {
        code: serverCode,
        storedAt: new Date().toISOString()
      };

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: "// Local code",
          storedAt: "invalid-date",
          exerciseId: exerciseUuid,
          version: 1
        }
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
      store.getState().initializeExerciseData(serverData);

      // Assert - Should use server data when localStorage timestamp is invalid
      const state = store.getState();
      expect(state.code).toBe(serverCode);
      expect(state.defaultCode).toBe(serverCode);
    });
  });

  describe("Orchestrator integration", () => {
    it("should call initializeExerciseData through orchestrator method", () => {
      // Arrange
      const exerciseUuid = "integration-test";
      const initialCode = "// Initial code";
      const serverCode = "// Server code";

      mockLoadCodeMirrorContent.mockReturnValue({
        success: false,
        error: "No data found"
      });

      // Act
      const exercise = createMockExercise({
        slug: exerciseUuid,
        stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
      });
      const store = createOrchestratorStore(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });

      // Simulate calling through orchestrator
      const serverData = {
        code: serverCode,
        storedAt: new Date().toISOString()
      };
      store.getState().initializeExerciseData(serverData);

      // Assert
      const state = store.getState();
      expect(state.code).toBe(serverCode);
      expect(state.defaultCode).toBe(serverCode);
    });
  });
});
