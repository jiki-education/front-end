import { updateExerciseSubmissionProgression } from "@/lib/api/exerciseSubmissions";

jest.mock("@/lib/api/client", () => ({
  api: {
    patch: jest.fn()
  }
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

describe("Exercise Submissions API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateExerciseSubmissionProgression", () => {
    it("patches the progression scores onto the submission by uuid", async () => {
      mockApi.patch.mockResolvedValue({ data: {}, status: 200, headers: new Headers() });

      const scores = { v: 1, scenarios: 1, distance: 5 };
      await updateExerciseSubmissionProgression("abc-123", scores);

      expect(mockApi.patch).toHaveBeenCalledWith("/internal/exercise_submissions/abc-123", {
        progression_scores: scores
      });
    });
  });
});
