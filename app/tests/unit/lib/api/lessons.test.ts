import { markLessonBonusCompleted, markLessonComplete } from "@/lib/api/lessons";

jest.mock("@/lib/api/client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
  },
  NotFoundError: class NotFoundError extends Error {}
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

describe("Lessons API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.patch.mockResolvedValue({ data: {} } as any);
  });

  describe("markLessonComplete", () => {
    it("sends bonus_passed false by default", async () => {
      await markLessonComplete("look-around");
      expect(mockApi.patch).toHaveBeenCalledWith("/internal/user_lessons/look-around/complete", {
        bonus_passed: false
      });
    });

    it("sends bonus_passed true when asked", async () => {
      await markLessonComplete("look-around", true);
      expect(mockApi.patch).toHaveBeenCalledWith("/internal/user_lessons/look-around/complete", {
        bonus_passed: true
      });
    });
  });

  describe("markLessonBonusCompleted", () => {
    it("PATCHes the bonus_completed endpoint", async () => {
      await markLessonBonusCompleted("look-around");
      expect(mockApi.patch).toHaveBeenCalledWith("/internal/user_lessons/look-around/bonus_completed");
    });
  });
});
