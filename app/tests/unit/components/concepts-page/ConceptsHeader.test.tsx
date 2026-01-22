import ConceptsHeader from "@/components/concepts/ConceptsHeader";
import { render, screen } from "@testing-library/react";
import { useAuthStore } from "@/lib/auth/authStore";

jest.mock("@/lib/auth/authStore");
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe("ConceptsHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    render(<ConceptsHeader />);
    expect(screen.getByText("Concept Library")).toBeInTheDocument();
  });

  it("displays page heading", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    render(<ConceptsHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Concept Library");
  });

  it("shows sign up message when not authenticated", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    render(<ConceptsHeader />);
    expect(screen.getByText(/Sign up to track your progress/)).toBeInTheDocument();
  });

  it("does not show sign up message when authenticated", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: true } as any));
    render(<ConceptsHeader />);
    expect(screen.queryByText(/Sign up to track your progress/)).not.toBeInTheDocument();
  });

  it("renders breadcrumb component", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    render(<ConceptsHeader />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
    expect(screen.getByText("All Concepts")).toBeInTheDocument();
  });
});
