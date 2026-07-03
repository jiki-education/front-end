import styles from "@/app/styles/modules/concepts.module.css";
import { ConceptCardsLoadingSkeleton, InlineLoading, LoadingSkeleton } from "@/components/concepts/LoadingStates";
import { render, screen } from "@testing-library/react";

describe("LoadingSkeleton", () => {
  it("renders without crashing", () => {
    render(<LoadingSkeleton withSidebar={false} />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders with sidebar layout when withSidebar is true", () => {
    render(<LoadingSkeleton withSidebar={true} />);
    expect(screen.getByTestId("loading-skeleton")).toHaveAttribute("data-variant", "sidebar");
  });

  it("renders without sidebar layout when withSidebar is false", () => {
    render(<LoadingSkeleton withSidebar={false} />);
    expect(screen.getByTestId("loading-skeleton")).toHaveAttribute("data-variant", "full");
  });

  it("renders skeleton cards", () => {
    render(<LoadingSkeleton withSidebar={false} />);
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
  });
});

describe("InlineLoading", () => {
  it("renders without crashing", () => {
    render(<InlineLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays loading text and spinner", () => {
    render(<InlineLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders the loading badge", () => {
    render(<InlineLoading />);
    expect(screen.getByTestId("inline-loading")).toBeInTheDocument();
  });
});

describe("ConceptCardsLoadingSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ConceptCardsLoadingSkeleton />);
    expect(container.querySelector(`[class*="${styles.conceptsGrid}"]`)).toBeInTheDocument();
  });

  it("renders skeleton concept cards", () => {
    const { container } = render(<ConceptCardsLoadingSkeleton />);
    const skeletonCards = container.querySelectorAll(`[class*="placeholderCard"]`);
    expect(skeletonCards.length).toBe(6);
  });

  it("has shimmer animation on skeleton cards", () => {
    const { container } = render(<ConceptCardsLoadingSkeleton />);
    const firstCard = container.querySelector(`[class*="placeholderCard"]`);
    expect(firstCard).toBeInTheDocument();
  });
});
