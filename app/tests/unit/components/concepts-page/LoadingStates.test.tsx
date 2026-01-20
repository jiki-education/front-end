import styles from "@/app/styles/modules/concepts.module.css";
import { ConceptCardsLoadingSkeleton, InlineLoading, LoadingSkeleton } from "@/components/concepts/LoadingStates";
import { render, screen } from "@testing-library/react";

describe("LoadingSkeleton", () => {
  it("renders without crashing", () => {
    render(<LoadingSkeleton withSidebar={false} />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders with sidebar layout when withSidebar is true", () => {
    const { container } = render(<LoadingSkeleton withSidebar={true} />);
    expect(container.querySelector(".ml-\\[260px\\]")).toBeInTheDocument();
  });

  it("renders without sidebar layout when withSidebar is false", () => {
    const { container } = render(<LoadingSkeleton withSidebar={false} />);
    expect(container.querySelector(".container")).toBeInTheDocument();
  });

  it("renders skeleton cards", () => {
    const { container } = render(<LoadingSkeleton withSidebar={false} />);
    const skeletonCards = container.querySelectorAll(".grid > div");
    expect(skeletonCards.length).toBe(6);
  });
});

describe("InlineLoading", () => {
  it("renders without crashing", () => {
    render(<InlineLoading isAuthenticated={false} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays loading text and spinner", () => {
    render(<InlineLoading isAuthenticated={false} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("applies authenticated styles when isAuthenticated is true", () => {
    const { container } = render(<InlineLoading isAuthenticated={true} />);
    const loadingElement = container.querySelector(".inline-flex");
    expect(loadingElement).toHaveClass("text-info-text");
  });

  it("applies unauthenticated styles when isAuthenticated is false", () => {
    const { container } = render(<InlineLoading isAuthenticated={false} />);
    const loadingElement = container.querySelector(".inline-flex");
    expect(loadingElement).toHaveClass("text-blue-600");
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
