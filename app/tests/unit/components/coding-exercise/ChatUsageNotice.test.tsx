import { render, screen } from "@testing-library/react";
import ChatUsageNotice from "@/components/coding-exercise/ui/ChatUsageNotice";
import type { UsageStatus } from "@/components/coding-exercise/lib/chatUsage";

function status(overrides: Partial<UsageStatus>): UsageStatus {
  return { scope: "daily", used: 0, limit: 100, atCap: false, warning: false, ...overrides };
}

describe("ChatUsageNotice", () => {
  it("renders nothing when status is null", () => {
    const { container } = render(<ChatUsageNotice status={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when neither warning nor atCap is set", () => {
    const { container } = render(<ChatUsageNotice status={status({})} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the daily warning copy", () => {
    render(<ChatUsageNotice status={status({ scope: "daily", used: 90, limit: 100, warning: true })} />);
    expect(screen.getByText("You're getting close to your daily limit (90/100 messages today).")).toBeInTheDocument();
  });

  it("renders the monthly warning copy", () => {
    render(<ChatUsageNotice status={status({ scope: "monthly", used: 450, limit: 500, warning: true })} />);
    expect(
      screen.getByText("You're getting close to your monthly limit (450/500 messages this month).")
    ).toBeInTheDocument();
  });

  it("renders the daily limit-reached copy", () => {
    render(<ChatUsageNotice status={status({ scope: "daily", used: 100, limit: 100, atCap: true })} />);
    expect(
      screen.getByText("You've used all 100 of today's messages. They reset at midnight UTC.")
    ).toBeInTheDocument();
  });

  it("renders the monthly limit-reached copy", () => {
    render(<ChatUsageNotice status={status({ scope: "monthly", used: 500, limit: 500, atCap: true })} />);
    expect(screen.getByText("You've used all 500 messages this month. They reset on the 1st.")).toBeInTheDocument();
  });

  it("links to the fair-usage article", () => {
    render(<ChatUsageNotice status={status({ scope: "daily", used: 90, limit: 100, warning: true })} />);
    const link = screen.getByRole("link", { name: "Learn More" });
    expect(link).toHaveAttribute("href", "/help/fair-usage-jiki-ai-policy");
  });
});
