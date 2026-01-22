import styles from "@/app/styles/modules/concepts.module.css";
import ConceptsGrid from "@/components/concepts/ConceptsGrid";
import { render, screen } from "@testing-library/react";

const mockConcepts = [
  {
    slug: "concept-1",
    title: "Concept 1",
    description: "Description 1",
    children_count: 0,
    standard_video_provider: null,
    standard_video_id: null,
    premium_video_provider: null,
    premium_video_id: null
  },
  {
    slug: "concept-2",
    title: "Concept 2",
    description: "Description 2",
    children_count: 3,
    standard_video_provider: null,
    standard_video_id: null,
    premium_video_provider: null,
    premium_video_id: null
  }
];

describe("ConceptsGrid", () => {
  it("renders without crashing", () => {
    render(<ConceptsGrid concepts={mockConcepts} isLoading={false} />);
    expect(document.querySelector(`[class*="${styles.conceptsGrid}"]`)).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<ConceptsGrid concepts={mockConcepts} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty grid when no concepts and not loading", () => {
    const { container } = render(<ConceptsGrid concepts={[]} isLoading={false} />);
    const grid = container.querySelector(`.${styles.conceptsGrid}`);
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(0);
  });

  it("renders concepts in grid", () => {
    render(<ConceptsGrid concepts={mockConcepts} isLoading={false} />);
    expect(screen.getByText("Concept 1")).toBeInTheDocument();
    expect(screen.getByText("Concept 2")).toBeInTheDocument();
  });
});
