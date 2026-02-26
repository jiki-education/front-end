import styles from "@/app/styles/modules/concepts.module.css";
import ConceptsGrid from "@/components/concepts/ConceptsGrid";
import { render, screen } from "@testing-library/react";
import type { ConceptForDisplay } from "@/types/concepts";

const mockConcepts: ConceptForDisplay[] = [
  {
    slug: "concept-1",
    title: "Concept 1",
    description: "Description 1",
    parentSlug: null,
    order: 1,
    category: false,
    childrenCount: 0,
    exerciseSlugs: [],
    isUnlocked: true
  },
  {
    slug: "concept-2",
    title: "Concept 2",
    description: "Description 2",
    parentSlug: null,
    order: 2,
    category: true,
    childrenCount: 3,
    exerciseSlugs: [],
    isUnlocked: true
  }
];

describe("ConceptsGrid", () => {
  it("renders without crashing", () => {
    render(<ConceptsGrid concepts={mockConcepts} />);
    expect(document.querySelector(`[class*="${styles.conceptsGrid}"]`)).toBeInTheDocument();
  });

  it("renders empty grid when no concepts", () => {
    const { container } = render(<ConceptsGrid concepts={[]} />);
    const grid = container.querySelector(`.${styles.conceptsGrid}`);
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(0);
  });

  it("renders concepts in grid", () => {
    render(<ConceptsGrid concepts={mockConcepts} />);
    expect(screen.getByText("Concept 1")).toBeInTheDocument();
    expect(screen.getByText("Concept 2")).toBeInTheDocument();
  });

  it("shows empty state when showEmptyState is true", () => {
    render(<ConceptsGrid concepts={mockConcepts} showEmptyState={true} />);
    expect(screen.getByText("No concepts yet")).toBeInTheDocument();
  });
});
