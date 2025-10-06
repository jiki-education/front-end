import { render, screen } from "@testing-library/react";
import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";

describe("LessonLoadingPage", () => {
  it("renders without crashing", () => {
    render(<LessonLoadingPage />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays video icon and text for video type", () => {
    render(<LessonLoadingPage type="video" />);

    // Check for video-specific elements
    expect(screen.getByText("Preparing video lesson")).toBeInTheDocument();
    expect(screen.getByText(/adjust video playback speed/)).toBeInTheDocument();

    // Check SVG icon exists (video has play button path)
    const svgPaths = document.querySelectorAll("svg path");
    const hasVideoPath = Array.from(svgPaths).some((path) => path.getAttribute("d")?.includes("M14.752 11.168"));
    expect(hasVideoPath).toBeTruthy();
  });

  it("displays exercise icon and text for exercise type", () => {
    render(<LessonLoadingPage type="exercise" />);

    // Check for exercise-specific elements
    expect(screen.getByText("Setting up code editor")).toBeInTheDocument();
    expect(screen.getByText(/Cmd\/Ctrl \+ Enter/)).toBeInTheDocument();

    // Check SVG icon exists (exercise has code brackets path)
    const svgPaths = document.querySelectorAll("svg path");
    const hasCodePath = Array.from(svgPaths).some((path) => path.getAttribute("d")?.includes("M10 20l4-16"));
    expect(hasCodePath).toBeTruthy();
  });

  it("displays title when provided", () => {
    render(<LessonLoadingPage title="Learn Variables" />);
    expect(screen.getByText("Learn Variables")).toBeInTheDocument();
  });

  it("does not display title when not provided", () => {
    render(<LessonLoadingPage />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders loading dots with animation classes", () => {
    render(<LessonLoadingPage />);

    const loadingText = screen.getByText("Loading").parentElement;
    expect(loadingText).toBeInTheDocument();

    // Check for animated ellipsis - simplified to single span now
    const animatedSpan = loadingText?.querySelector("span.animate-pulse");
    expect(animatedSpan).toBeInTheDocument();
    expect(animatedSpan?.textContent).toBe("...");
  });

  it("renders progress bar with pulse animation", () => {
    render(<LessonLoadingPage />);

    const progressBar = document.querySelector(".animate-pulse.bg-gradient-to-r");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass("bg-gradient-to-r", "from-blue-500", "to-purple-500");
  });

  it("renders spinning ring around icon", () => {
    render(<LessonLoadingPage />);

    const spinningRing = document.querySelector(".animate-spin");
    expect(spinningRing).toBeInTheDocument();
    expect(spinningRing).toHaveClass("border-t-blue-500", "border-blue-200");
  });

  it("renders background circles for depth", () => {
    render(<LessonLoadingPage />);

    // Background circles no longer have float animation, just blur effect
    const backgroundCircles = document.querySelectorAll(".blur-3xl");
    expect(backgroundCircles.length).toBeGreaterThanOrEqual(2);
  });

  it("applies fadeIn animation to main container", () => {
    render(<LessonLoadingPage />);

    const mainContainer = document.querySelector("[class*='animate-'][class*='fadeIn']");
    expect(mainContainer).toBeInTheDocument();
  });

  it("applies pulse animation to icon container", () => {
    render(<LessonLoadingPage />);

    // Icon container now uses animate-pulse instead of iconPulse
    const iconContainer = document.querySelector(".relative.animate-pulse");
    expect(iconContainer).toBeInTheDocument();
  });

  it("renders with proper layout classes", () => {
    const { container } = render(<LessonLoadingPage />);

    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-blue-50",
      "via-white",
      "to-purple-50",
      "flex",
      "flex-col",
      "items-center",
      "justify-center"
    );
  });

  it("renders tip section with proper styling", () => {
    render(<LessonLoadingPage type="exercise" />);

    const tipContainer = screen.getByText(/💡 Tip:/).parentElement;
    expect(tipContainer).toHaveClass("bg-gray-50", "rounded-lg");
    // Check for animation class with a more flexible selector
    const tipText = screen.getByText(/💡 Tip:/);
    expect(tipText.className).toContain("animate-");
  });
});
