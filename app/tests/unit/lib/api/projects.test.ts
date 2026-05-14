import { fetchProjects, fetchProject, fetchUserProject, startProject, submitProjectExercise } from "@/lib/api/projects";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

describe("Projects API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchProjects", () => {
    it("should fetch projects with default parameters", async () => {
      const mockResponse = {
        data: {
          results: [
            {
              slug: "test-project",
              title: "Test Project",
              description: "A test project",
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

      const result = await fetchProjects();

      expect(mockApi.get).toHaveBeenCalledWith("/internal/projects", { params: undefined });
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch projects with custom parameters", async () => {
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
      const result = await fetchProjects(params);

      expect(mockApi.get).toHaveBeenCalledWith("/internal/projects", { params });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("fetchProject", () => {
    it("should fetch individual project by slug", async () => {
      const mockProject = {
        slug: "test-project",
        title: "Test Project",
        description: "A test project",
        status: "unlocked"
      };

      const mockResponse = {
        data: {
          project: mockProject
        },
        status: 200,
        headers: new Headers()
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await fetchProject("test-project");

      expect(mockApi.get).toHaveBeenCalledWith("/internal/projects/test-project");
      expect(result).toEqual(mockProject);
    });
  });

  describe("startProject", () => {
    it("should POST to the user_projects start endpoint", async () => {
      mockApi.post.mockResolvedValue({ data: {}, status: 200, headers: new Headers() });

      await startProject("test-project");

      expect(mockApi.post).toHaveBeenCalledWith("/internal/user_projects/test-project/start");
    });

    it("should propagate errors from the API", async () => {
      const error = new Error("403 project_locked");
      mockApi.post.mockRejectedValue(error);

      await expect(startProject("locked-project")).rejects.toThrow("403 project_locked");
    });
  });

  describe("fetchUserProject", () => {
    it("should fetch user project data by slug", async () => {
      const mockUserProject = {
        project_slug: "test-project",
        status: "started",
        conversation: [],
        conversation_allowed: true,
        data: { last_submission: { files: [{ filename: "solution.js", content: "code" }] } }
      };

      mockApi.get.mockResolvedValue({
        data: { user_project: mockUserProject },
        status: 200,
        headers: new Headers()
      });

      const result = await fetchUserProject("test-project");

      expect(mockApi.get).toHaveBeenCalledWith("/internal/user_projects/test-project");
      expect(result).toEqual(mockUserProject);
    });
  });

  describe("submitProjectExercise", () => {
    it("should submit exercise files for a project", async () => {
      const mockResponse = {
        data: {},
        status: 201,
        headers: new Headers()
      };
      mockApi.post.mockResolvedValue(mockResponse);

      const files = [{ filename: "solution.js", code: "console.log('hello');" }];

      await submitProjectExercise("test-project", files);

      expect(mockApi.post).toHaveBeenCalledWith("/internal/projects/test-project/exercise_submissions", {
        submission: { files }
      });
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

      await submitProjectExercise("test-project", files);

      expect(mockApi.post).toHaveBeenCalledWith("/internal/projects/test-project/exercise_submissions", {
        submission: { files }
      });
    });
  });
});
