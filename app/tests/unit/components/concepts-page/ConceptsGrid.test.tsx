import styles from "@/app/styles/modules/concepts.module.css";
import ConceptsGrid from "@/components/concepts/ConceptsGrid";
import { render, screen } from "@testing-library/react";

const mockConcepts = [
  {
    slug: "concept-1",
    title: "Concept 1",
    description: "Description 1",
    standard_video_provider: null,
    standard_video_id: null,
    premium_video_provider: null,
    premium_video_id: null
  },
  {
    slug: "concept-2",
    title: "Concept 2",
    description: "Description 2",
    standard_video_provider: null,
    standard_video_id: null,
    premium_video_provider: null,
    premium_video_id: null
  }
];

describe("ConceptsGrid", () => {
  it("renders without crashing", () => {
    render(
      <ConceptsGrid
        concepts={mockConcepts}
        isLoading={false}
        debouncedSearchQuery=""
        onClearSearch={jest.fn()}
        isAuthenticated={false}
      />
    );
    expect(document.querySelector(`[class*="${styles.conceptsGrid}"]`)).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(
      <ConceptsGrid
        concepts={mockConcepts}
        isLoading={true}
        debouncedSearchQuery=""
        onClearSearch={jest.fn()}
        isAuthenticated={false}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when no concepts and not loading", () => {
    render(
      <ConceptsGrid
        concepts={[]}
        isLoading={false}
        debouncedSearchQuery="test search"
        onClearSearch={jest.fn()}
        isAuthenticated={false}
      />
    );
    expect(screen.getByText('No concepts found for "test search"')).toBeInTheDocument();
  });

  it("renders concepts grid when authenticated", () => {
    render(
      <ConceptsGrid
        concepts={[]}
        isLoading={false}
        debouncedSearchQuery=""
        onClearSearch={jest.fn()}
        isAuthenticated={true}
      />
    );
    expect(document.querySelector(`[class*="${styles.conceptsGrid}"]`)).toBeInTheDocument();
  });
});
