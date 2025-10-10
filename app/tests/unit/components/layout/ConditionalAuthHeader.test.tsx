import { ConditionalAuthHeader } from "@/components/layout/ConditionalAuthHeader";
import { useAuthStore } from "@/stores/authStore";
import { render, screen } from "@testing-library/react";

// Mock the auth store
jest.mock("@/stores/authStore");

// Mock Next.js navigation
const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

describe("ConditionalAuthHeader Route-based Visibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default auth store mock
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  });

  it("shows header on blog pages", () => {
    mockPathname.mockReturnValue("/blog");

    render(<ConditionalAuthHeader />);

    // Should render the header
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Blog")).toHaveLength(2); // Title and nav link
  });

  it("shows header on blog post pages", () => {
    mockPathname.mockReturnValue("/blog/some-post-slug");

    render(<ConditionalAuthHeader />);

    // Should render the header with Blog title
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Blog")).toHaveLength(2);
  });

  it("shows header on articles pages", () => {
    mockPathname.mockReturnValue("/articles");

    render(<ConditionalAuthHeader />);

    // Should render the header
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Articles")).toHaveLength(2); // Title and nav link
  });

  it("shows header on article post pages", () => {
    mockPathname.mockReturnValue("/articles/some-article-slug");

    render(<ConditionalAuthHeader />);

    // Should render the header with Articles title
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Articles")).toHaveLength(2);
  });

  it("shows header on localized blog pages", () => {
    mockPathname.mockReturnValue("/hu/blog");

    render(<ConditionalAuthHeader />);

    // Should render the header
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Blog")).toHaveLength(2);
  });

  it("hides header on dashboard page", () => {
    mockPathname.mockReturnValue("/dashboard");

    render(<ConditionalAuthHeader />);

    // Should NOT render the header
    expect(screen.queryByText("Jiki Learn")).not.toBeInTheDocument();
  });

  it("hides header on auth pages", () => {
    mockPathname.mockReturnValue("/auth/login");

    render(<ConditionalAuthHeader />);

    // Should NOT render the header
    expect(screen.queryByText("Jiki Learn")).not.toBeInTheDocument();
  });

  it("hides header on home page", () => {
    mockPathname.mockReturnValue("/");

    render(<ConditionalAuthHeader />);

    // Should NOT render the header
    expect(screen.queryByText("Jiki Learn")).not.toBeInTheDocument();
  });
});
