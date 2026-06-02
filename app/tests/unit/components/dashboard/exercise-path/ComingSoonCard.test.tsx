import { render, screen } from "@testing-library/react";
import { ComingSoonCard } from "@/components/dashboard/exercise-path/ui/ComingSoonCard";

describe("ComingSoonCard", () => {
  it("renders the coming soon title", () => {
    render(<ComingSoonCard />);
    expect(screen.getByText("More Lessons Coming Soon")).toBeInTheDocument();
  });

  it("renders the coming soon subtitle", () => {
    render(<ComingSoonCard />);
    expect(
      screen.getByText("We're busy finalising the next lessons. Check back soon to continue your journey!")
    ).toBeInTheDocument();
  });
});
