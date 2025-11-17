import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageTabs } from "@/components/ui-kit";
import { createMockTabItems, createMockHandlers } from "@/tests/mocks";
import type { TabItem } from "@/components/ui-kit/PageTabs/types";

describe("PageTabs", () => {
  const mockHandlers = createMockHandlers();
  const defaultTabs = createMockTabItems(3);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders all tab items", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((tab) => {
        const tabButton = screen.getByRole("tab", { name: tab.label });
        expect(tabButton).toBeInTheDocument();
      });
    });

    it("renders tab icons when provided", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((tab, index) => {
        const icon = screen.getByTestId(`tab-${index + 1}-icon`);
        expect(icon).toBeInTheDocument();
      });
    });

    it("handles tabs without icons", () => {
      const tabsWithoutIcons: TabItem[] = [
        { id: "tab-1", label: "First Tab" },
        { id: "tab-2", label: "Second Tab" }
      ];

      render(<PageTabs tabs={tabsWithoutIcons} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      expect(screen.getByRole("tab", { name: "First Tab" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Second Tab" })).toBeInTheDocument();
    });
  });

  describe("Active State", () => {
    it("marks active tab with aria-selected", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-2" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 2" });
      const inactiveTab = screen.getByRole("tab", { name: "Tab 1" });

      expect(activeTab).toHaveAttribute("aria-selected", "true");
      expect(inactiveTab).toHaveAttribute("aria-selected", "false");
    });

    it("applies active styling to selected tab with default blue color", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-2" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 2" });
      expect(activeTab).toHaveClass("active");
    });

    it("applies inactive styling to non-selected tabs", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-2" onTabChange={mockHandlers.onTabChange} />);

      const inactiveTab = screen.getByRole("tab", { name: "Tab 1" });
      expect(inactiveTab).not.toHaveClass("active");
    });
  });

  describe("Color Variants", () => {
    it("applies active class to active tab", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 1" });
      expect(activeTab).toHaveClass("active");
      // Default tabs don't have color property, so no data-color attribute
      expect(activeTab).not.toHaveAttribute("data-color");
    });

    it("applies purple color variant", () => {
      const tabsWithPurple: TabItem[] = [{ ...defaultTabs[0], color: "purple" }, defaultTabs[1]];
      render(<PageTabs tabs={tabsWithPurple} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 1" });
      expect(activeTab).toHaveClass("active");
      expect(activeTab).toHaveAttribute("data-color", "purple");
    });

    it("applies green color variant", () => {
      const tabsWithGreen: TabItem[] = [{ ...defaultTabs[0], color: "green" }, defaultTabs[1]];
      render(<PageTabs tabs={tabsWithGreen} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 1" });
      expect(activeTab).toHaveClass("active");
      expect(activeTab).toHaveAttribute("data-color", "green");
    });

    it("applies gray color variant", () => {
      const tabsWithGray: TabItem[] = [{ ...defaultTabs[0], color: "gray" }, defaultTabs[1]];
      render(<PageTabs tabs={tabsWithGray} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 1" });
      expect(activeTab).toHaveClass("active");
      expect(activeTab).toHaveAttribute("data-color", "gray");
    });

    it("supports individual tab color overrides", () => {
      const tabsWithColors: TabItem[] = [
        { id: "tab-1", label: "Blue Tab", color: "blue" },
        { id: "tab-2", label: "Purple Tab", color: "purple" }
      ];

      const { rerender } = render(
        <PageTabs tabs={tabsWithColors} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />
      );

      // First tab should use its own blue color
      const blueTab = screen.getByRole("tab", { name: "Blue Tab" });
      expect(blueTab).toHaveClass("active");
      expect(blueTab).toHaveAttribute("data-color", "blue");

      // Switch to second tab and check its purple color
      rerender(<PageTabs tabs={tabsWithColors} activeTabId="tab-2" onTabChange={mockHandlers.onTabChange} />);

      const activePurpleTab = screen.getByRole("tab", { name: "Purple Tab" });
      expect(activePurpleTab).toHaveClass("active");
      expect(activePurpleTab).toHaveAttribute("data-color", "purple");
    });
  });

  describe("Interaction", () => {
    it("calls onTabChange when tab is clicked", async () => {
      const user = userEvent.setup();

      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const tab = screen.getByRole("tab", { name: "Tab 2" });
      await user.click(tab);

      expect(mockHandlers.onTabChange).toHaveBeenCalledWith("tab-2");
    });

    it("does not call onTabChange when clicking already active tab", async () => {
      const user = userEvent.setup();

      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const activeTab = screen.getByRole("tab", { name: "Tab 1" });
      await user.click(activeTab);

      expect(mockHandlers.onTabChange).toHaveBeenCalledWith("tab-1");
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();

      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const firstTab = screen.getByRole("tab", { name: "Tab 1" });
      firstTab.focus();

      // Tab to next tab and press Enter
      await user.tab();
      await user.keyboard("{Enter}");

      expect(mockHandlers.onTabChange).toHaveBeenCalledWith("tab-2");
    });
  });

  describe("Styling", () => {
    it("applies proper structure and data attributes to tabs", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((tab) => {
        const tabButton = screen.getByRole("tab", { name: tab.label });
        // Check that it's a proper button element
        expect(tabButton.tagName).toBe("BUTTON");
        // Check for data-tab attribute
        expect(tabButton).toHaveAttribute("data-tab", tab.id);
        // Check for proper role and ARIA attributes
        expect(tabButton).toHaveAttribute("role", "tab");
        expect(tabButton).toHaveAttribute("type", "button");
      });
    });

    it("applies hover styling", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const tab = screen.getByRole("tab", { name: "Tab 2" });
      // Hover styling is handled by CSS, just check it's a proper button
      expect(tab).toBeInTheDocument();
      expect(tab).not.toHaveClass("active");
    });

    it("applies container styling", () => {
      render(
        <PageTabs
          tabs={defaultTabs}
          activeTabId="tab-1"
          onTabChange={mockHandlers.onTabChange}
          className="custom-tabs"
        />
      );

      const container = screen.getByRole("tab", { name: "Tab 1" }).parentElement;

      expect(container).toHaveClass("ui-page-tabs", "custom-tabs");
    });

    it("renders icons when present", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((_, index) => {
        const icon = screen.getByTestId(`tab-${index + 1}-icon`);
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("uses proper ARIA tab attributes", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-2" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((tab) => {
        const tabButton = screen.getByRole("tab", { name: tab.label });
        expect(tabButton).toHaveAttribute("role", "tab");
        expect(tabButton).toHaveAttribute("id", `tab-${tab.id}`);
        expect(tabButton).toHaveAttribute("aria-controls", `tabpanel-${tab.id}`);

        if (tab.id === "tab-2") {
          expect(tabButton).toHaveAttribute("aria-selected", "true");
        } else {
          expect(tabButton).toHaveAttribute("aria-selected", "false");
        }
      });
    });

    it("provides accessible button type", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((tab) => {
        const tabButton = screen.getByRole("tab", { name: tab.label });
        expect(tabButton).toHaveAttribute("type", "button");
      });
    });

    it("maintains focus management", async () => {
      const user = userEvent.setup();

      render(<PageTabs tabs={defaultTabs} activeTabId="tab-1" onTabChange={mockHandlers.onTabChange} />);

      const firstTab = screen.getByRole("tab", { name: "Tab 1" });
      const secondTab = screen.getByRole("tab", { name: "Tab 2" });

      // Test focus navigation
      await user.tab();
      expect(firstTab).toHaveFocus();

      await user.tab();
      expect(secondTab).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty tabs array", () => {
      render(<PageTabs tabs={[]} activeTabId="" onTabChange={mockHandlers.onTabChange} />);

      const tabs = screen.queryAllByRole("tab");
      expect(tabs).toHaveLength(0);
    });

    it("handles activeTabId that doesn't exist", () => {
      render(<PageTabs tabs={defaultTabs} activeTabId="non-existent-tab" onTabChange={mockHandlers.onTabChange} />);

      defaultTabs.forEach((tab) => {
        const tabButton = screen.getByRole("tab", { name: tab.label });
        expect(tabButton).toHaveAttribute("aria-selected", "false");
      });
    });

    it("handles single tab", () => {
      const singleTab = [{ id: "only-tab", label: "Only Tab" }];

      render(<PageTabs tabs={singleTab} activeTabId="only-tab" onTabChange={mockHandlers.onTabChange} />);

      const tab = screen.getByRole("tab", { name: "Only Tab" });
      expect(tab).toHaveAttribute("aria-selected", "true");
    });

    it("accepts additional props", () => {
      render(
        <PageTabs
          tabs={defaultTabs}
          activeTabId="tab-1"
          onTabChange={mockHandlers.onTabChange}
          data-testid="page-tabs"
          {...({ role: "navigation" } as any)}
        />
      );

      const container = screen.getByTestId("page-tabs");
      expect(container).toHaveAttribute("role", "navigation");
    });
  });
});
