import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GlobalModalProvider } from "@/lib/modal/GlobalModalProvider";
import { hideModal, showModal, useModalStore } from "@/lib/modal/store";

// Mock react-modal to avoid DOM warnings in tests
jest.mock("react-modal", () => ({
  __esModule: true,
  default: ({ isOpen, children, onRequestClose }: any) =>
    isOpen ? (
      <div role="dialog">
        {children}
        <button onClick={onRequestClose} aria-label="Close modal">
          X
        </button>
      </div>
    ) : null
}));

describe("GlobalModalProvider", () => {
  beforeEach(() => {
    // Reset modal store before each test
    useModalStore.setState({
      isOpen: false,
      modalName: null,
      modalProps: {}
    });
  });

  it("should not render anything when no modal is open", () => {
    const { container } = render(<GlobalModalProvider />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render example modal when opened", async () => {
    render(<GlobalModalProvider />);

    // Open example modal
    act(() => {
      showModal("example-modal", { title: "Test Title", message: "Test Message" });
    });

    // Check modal is rendered (async due to next/dynamic lazy loading)
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("should render confirmation modal with correct props", async () => {
    render(<GlobalModalProvider />);

    act(() => {
      showModal("confirmation-modal", {
        title: "Confirm Action",
        message: "Are you sure?",
        confirmText: "Yes",
        cancelText: "No"
      });
    });

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByText("Confirm Action")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("should render info modal with correct props", async () => {
    render(<GlobalModalProvider />);

    act(() => {
      showModal("info-modal", {
        title: "Information",
        content: "Some important info",
        buttonText: "Got it"
      });
    });

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByText("Information")).toBeInTheDocument();
    expect(screen.getByText("Some important info")).toBeInTheDocument();
    expect(screen.getByText("Got it")).toBeInTheDocument();
  });

  it("should close modal when hideModal is called", async () => {
    render(<GlobalModalProvider />);

    // Open modal
    act(() => {
      showModal("example-modal");
    });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    // Close modal
    act(() => {
      hideModal();
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should close modal when close button is clicked", async () => {
    render(<GlobalModalProvider />);

    // Open modal
    act(() => {
      showModal("example-modal");
    });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    // Click close button - get all and click the first one (from BaseModal)
    const closeButtons = screen.getAllByLabelText("Close modal");
    fireEvent.click(closeButtons[0]);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should switch between modals when a new one is opened", async () => {
    render(<GlobalModalProvider />);

    // Open first modal
    act(() => {
      showModal("example-modal", { message: "First modal" });
    });
    expect(await screen.findByText("First modal")).toBeInTheDocument();

    // Open second modal (should replace first)
    act(() => {
      showModal("info-modal", { content: "Second modal" });
    });
    await waitFor(() => {
      expect(screen.queryByText("First modal")).not.toBeInTheDocument();
    });
    expect(await screen.findByText("Second modal")).toBeInTheDocument();
  });

  it("should handle unknown modal names gracefully", () => {
    render(<GlobalModalProvider />);

    // Try to open a non-existent modal
    act(() => {
      showModal("non-existent-modal");
    });

    // Should not render anything
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should pass modal props correctly to modal components", async () => {
    render(<GlobalModalProvider />);

    const testProps = {
      title: "Custom Title",
      message: "Custom Message",
      customProp: "Custom Value"
    };

    act(() => {
      showModal("example-modal", testProps);
    });

    expect(await screen.findByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Message")).toBeInTheDocument();
  });
});
