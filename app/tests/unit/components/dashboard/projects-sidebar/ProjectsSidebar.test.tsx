import ProjectsSidebar from "@/components/dashboard/projects-sidebar/ProjectsSidebar";
import { fetchBadges } from "@/lib/api/badges";
import { fetchProfile } from "@/lib/api/profile";
import { fetchProjects, type ProjectData, type ProjectStatus } from "@/lib/api/projects";
import { createMockUser } from "@/tests/mocks/user";
import { act, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/api/profile", () => ({ fetchProfile: jest.fn() }));
jest.mock("@/lib/api/projects", () => ({ fetchProjects: jest.fn() }));
jest.mock("@/lib/api/badges", () => ({ fetchBadges: jest.fn() }));

jest.mock("@/lib/auth/authStore", () => {
  const { createMockUser: makeUser } = jest.requireActual("@/tests/mocks/user");
  let state = { user: makeUser({ membership_type: "premium" }) };
  return {
    useAuthStore: jest.fn((selector?: (s: typeof state) => unknown) => (selector ? selector(state) : state)),
    __setUser: (user: unknown) => {
      state = { user: user as ReturnType<typeof makeUser> };
    }
  };
});

jest.mock("@/components/dashboard/projects-sidebar/ui/UserProfile", () => ({
  UserProfile: ({ profile }: { profile: { name: string } | null }) => (
    <div data-testid="user-profile">{profile?.name ?? "loading"}</div>
  )
}));

jest.mock("@/components/dashboard/projects-sidebar/ui/ProjectsUpsellCard", () => ({
  ProjectsUpsellCard: () => <div data-testid="upsell-card">upsell</div>
}));

jest.mock("@/components/dashboard/projects-sidebar/ui/RecentProjects", () => ({
  RecentProjects: ({ projects, unlockedCount }: { projects: ProjectData[]; unlockedCount: number }) => (
    <div data-testid="recent-projects" data-unlocked={unlockedCount}>
      {projects.map((p) => (
        <div key={p.slug} data-testid={`project-${p.slug}`} data-status={p.status}>
          {p.title}
        </div>
      ))}
    </div>
  )
}));

const mockFetchProfile = fetchProfile as jest.MockedFunction<typeof fetchProfile>;
const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;
const mockFetchBadges = fetchBadges as jest.MockedFunction<typeof fetchBadges>;

const authStoreMock = jest.requireMock("@/lib/auth/authStore");

function makeProject(slug: string, status: ProjectStatus): ProjectData {
  return { slug, title: slug, description: `${slug} desc`, status };
}

function mockProjects(list: ProjectData[]) {
  mockFetchProjects.mockResolvedValue({
    results: list,
    meta: { current_page: 1, total_count: list.length, total_pages: 1 }
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  authStoreMock.__setUser(createMockUser({ membership_type: "premium" }));
  mockFetchProfile.mockResolvedValue({
    profile: { avatar_url: "", icon: "", streaks_enabled: false, total_active_days: 0 }
  });
  mockFetchBadges.mockResolvedValue({ badges: [], num_locked_secret_badges: 0 });
  mockProjects([]);
});

describe("ProjectsSidebar", () => {
  describe("non-premium users", () => {
    it("renders the upsell card and does not call fetchProjects", async () => {
      authStoreMock.__setUser(createMockUser({ membership_type: "standard" }));

      render(<ProjectsSidebar />);

      await waitFor(() => expect(mockFetchProfile).toHaveBeenCalled());
      expect(screen.getByTestId("upsell-card")).toBeInTheDocument();
      expect(mockFetchProjects).not.toHaveBeenCalled();
    });
  });

  describe("premium users", () => {
    it("fires profile, badges, and projects requests in parallel on mount", async () => {
      let resolveProfile: () => void = () => {};
      mockFetchProfile.mockReturnValue(
        new Promise((resolve) => {
          resolveProfile = () =>
            resolve({
              profile: { avatar_url: "", icon: "", streaks_enabled: false, total_active_days: 0 }
            });
        })
      );

      render(<ProjectsSidebar />);

      // All three fire on mount, regardless of profile resolving
      expect(mockFetchProfile).toHaveBeenCalledTimes(1);
      expect(mockFetchBadges).toHaveBeenCalledTimes(1);
      expect(mockFetchProjects).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolveProfile();
        await Promise.resolve();
      });
    });

    it("passes the count of non-locked projects as unlockedCount", async () => {
      mockProjects([
        makeProject("a", "started"),
        makeProject("b", "unlocked"),
        makeProject("c", "completed"),
        makeProject("d", "locked"),
        makeProject("e", "locked")
      ]);

      render(<ProjectsSidebar />);

      await screen.findByTestId("project-a");
      const recent = screen.getByTestId("recent-projects");
      expect(recent.getAttribute("data-unlocked")).toBe("3");
    });
  });

  describe("recentProjects padding", () => {
    it("returns up to 3 active (started/unlocked) projects when available", async () => {
      mockProjects([
        makeProject("s1", "started"),
        makeProject("s2", "started"),
        makeProject("u1", "unlocked"),
        makeProject("u2", "unlocked"),
        makeProject("l1", "locked"),
        makeProject("c1", "completed")
      ]);

      render(<ProjectsSidebar />);

      await screen.findByTestId("project-s1");
      expect(screen.getByTestId("project-s2")).toBeInTheDocument();
      expect(screen.getByTestId("project-u1")).toBeInTheDocument();
      expect(screen.queryByTestId("project-u2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("project-l1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("project-c1")).not.toBeInTheDocument();
    });

    it("pads with locked projects after active ones", async () => {
      mockProjects([
        makeProject("s1", "started"),
        makeProject("l1", "locked"),
        makeProject("l2", "locked"),
        makeProject("l3", "locked"),
        makeProject("c1", "completed")
      ]);

      render(<ProjectsSidebar />);

      await screen.findByTestId("project-s1");
      expect(screen.getByTestId("project-l1")).toBeInTheDocument();
      expect(screen.getByTestId("project-l2")).toBeInTheDocument();
      expect(screen.queryByTestId("project-l3")).not.toBeInTheDocument();
      expect(screen.queryByTestId("project-c1")).not.toBeInTheDocument();
    });

    it("pads with completed projects after locked when fewer than 3 active+locked exist", async () => {
      mockProjects([
        makeProject("s1", "started"),
        makeProject("l1", "locked"),
        makeProject("c1", "completed"),
        makeProject("c2", "completed")
      ]);

      render(<ProjectsSidebar />);

      await screen.findByTestId("project-s1");
      expect(screen.getByTestId("project-l1")).toBeInTheDocument();
      expect(screen.getByTestId("project-c1")).toBeInTheDocument();
      expect(screen.queryByTestId("project-c2")).not.toBeInTheDocument();
    });

    it("falls back to completed projects only when nothing else exists", async () => {
      mockProjects([
        makeProject("c1", "completed"),
        makeProject("c2", "completed"),
        makeProject("c3", "completed"),
        makeProject("c4", "completed")
      ]);

      render(<ProjectsSidebar />);

      await screen.findByTestId("project-c1");
      expect(screen.getByTestId("project-c2")).toBeInTheDocument();
      expect(screen.getByTestId("project-c3")).toBeInTheDocument();
      expect(screen.queryByTestId("project-c4")).not.toBeInTheDocument();
    });

    it("returns fewer than 3 if there aren't enough projects of any status", async () => {
      mockProjects([makeProject("s1", "started"), makeProject("c1", "completed")]);

      render(<ProjectsSidebar />);

      await screen.findByTestId("project-s1");
      expect(screen.getByTestId("project-c1")).toBeInTheDocument();
      expect(screen.queryByTestId("project-l1")).not.toBeInTheDocument();
    });
  });
});
