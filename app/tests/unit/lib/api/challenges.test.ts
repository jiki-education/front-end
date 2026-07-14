import {
  fetchChallenge,
  fetchChallenges,
  fetchUserChallenge,
  startChallenge,
  submitChallengeExercise
} from "@/lib/api/challenges";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
  }
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

describe("Challenges API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchChallenges", () => {
    it("should fetch challenges with default parameters", async () => {
      const mockResponse = {
        data: {
          results: [
            {
              slug: "test-challenge",
              title: "Test Challenge",
              description: "A test challenge",
              status: "unlocked"
            }
          ],
          meta: {
            current_page: 1,
            total_count: 1,
            total_pages: 1
          }
        },
        status: 200,
        headers: new Headers()
      };

      mockApi.get.mockResolvedValue(mockResponse);

      const result = await fetchChallenges();

      expect(mockApi.get).toHaveBeenCalledWith("/internal/challenges", { params: undefined });
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch challenges with custom parameters", async () => {
      const mockResponse = {
        data: {
          results: [],
          meta: {
            current_page: 1,
            total_pages: 1,
            total_count: 0
          }
        },
        status: 200,
        headers: new Headers()
      };

      mockApi.get.mockResolvedValue(mockResponse);

      const params = { title: "test", page: 1, per: 10 };
      const result = await fetchChallenges(params);

      expect(mockApi.get).toHaveBeenCalledWith("/internal/challenges", { params });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("fetchChallenge", () => {
    it("should fetch individual challenge by slug", async () => {
      const mockChallenge = {
        slug: "test-challenge",
        title: "Test Challenge",
        description: "A test challenge",
        status: "unlocked"
      };

      const mockResponse = {
        data: {
          challenge: mockChallenge
        },
        status: 200,
        headers: new Headers()
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await fetchChallenge("test-challenge");

      expect(mockApi.get).toHaveBeenCalledWith("/internal/challenges/test-challenge");
      expect(result).toEqual(mockChallenge);
    });
  });

  describe("startChallenge", () => {
    it("should POST to the user_challenges start endpoint", async () => {
      mockApi.post.mockResolvedValue({ data: {}, status: 200, headers: new Headers() });

      await startChallenge("test-challenge");

      expect(mockApi.post).toHaveBeenCalledWith("/internal/user_challenges/test-challenge/start");
    });

    it("should propagate errors from the API", async () => {
      const error = new Error("403 challenge_locked");
      mockApi.post.mockRejectedValue(error);

      await expect(startChallenge("locked-challenge")).rejects.toThrow("403 challenge_locked");
    });
  });

  describe("fetchUserChallenge", () => {
    it("should fetch user challenge data by slug", async () => {
      const mockUserChallenge = {
        challenge_slug: "test-challenge",
        status: "started",
        conversation: [],
        conversation_allowed: true,
        data: { last_submission: { files: [{ filename: "solution.js", content: "code" }] } }
      };

      mockApi.get.mockResolvedValue({
        data: { user_challenge: mockUserChallenge },
        status: 200,
        headers: new Headers()
      });

      const result = await fetchUserChallenge("test-challenge");

      expect(mockApi.get).toHaveBeenCalledWith("/internal/user_challenges/test-challenge");
      expect(result).toEqual(mockUserChallenge);
    });
  });

  describe("submitChallengeExercise", () => {
    it("should submit exercise files for a challenge", async () => {
      const mockResponse = {
        data: {},
        status: 201,
        headers: new Headers()
      };
      mockApi.post.mockResolvedValue(mockResponse);

      const files = [{ filename: "solution.js", code: "console.log('hello');" }];

      await submitChallengeExercise("test-challenge", files);

      expect(mockApi.post).toHaveBeenCalledWith("/internal/challenges/test-challenge/exercise_submissions", {
        submission: { files }
      });
    });

    it("returns the created submission's uuid", async () => {
      mockApi.post.mockResolvedValue({
        data: { submission: { uuid: "abc-123" } },
        status: 201,
        headers: new Headers()
      });

      const uuid = await submitChallengeExercise("test-challenge", [{ filename: "solution.js", code: "" }]);

      expect(uuid).toBe("abc-123");
    });

    it("returns null when the response has no uuid", async () => {
      mockApi.post.mockResolvedValue({ data: {}, status: 201, headers: new Headers() });

      const uuid = await submitChallengeExercise("test-challenge", [{ filename: "solution.js", code: "" }]);

      expect(uuid).toBeNull();
    });

    it("returns null when the response has no body", async () => {
      mockApi.post.mockResolvedValue({ data: null, status: 201, headers: new Headers() });

      const uuid = await submitChallengeExercise("test-challenge", [{ filename: "solution.js", code: "" }]);

      expect(uuid).toBeNull();
    });

    it("should handle multiple files", async () => {
      const mockResponse = {
        data: {},
        status: 201,
        headers: new Headers()
      };
      mockApi.post.mockResolvedValue(mockResponse);

      const files = [
        { filename: "solution.js", code: "console.log('hello');" },
        { filename: "utils.js", code: "export const helper = () => {};" }
      ];

      await submitChallengeExercise("test-challenge", files);

      expect(mockApi.post).toHaveBeenCalledWith("/internal/challenges/test-challenge/exercise_submissions", {
        submission: { files }
      });
    });
  });
});
