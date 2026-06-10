import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WelcomeModal } from "@/lib/modal/modals/WelcomeModal";
import { hideModal } from "@/lib/modal/store";

jest.mock("@/lib/modal/store", () => {
  const actual = jest.requireActual("@/lib/modal/store");
  return {
    ...actual,
    hideModal: jest.fn()
  };
});

// Resolve next/dynamic synchronously so the forwarded ref reaches the mock player.
 
jest.mock("next/dynamic", () => (loader: () => Promise<{ default: any }>) => {
   
  const Comp = React.forwardRef<unknown, Record<string, any>>(function DynamicMock(props, ref) {
     
    const [Loaded, setLoaded] = React.useState<any>(null);
    React.useEffect(() => {
      void loader().then((mod) => setLoaded(() => mod.default));
    }, []);
    if (!Loaded) {
      return null;
    }
    return <Loaded ref={ref} {...props} />;
  });
  return Comp;
});

const pauseMock = jest.fn();
const playMock = jest.fn().mockResolvedValue(undefined);
let lastOnEnded: (() => void) | undefined;

jest.mock("@/components/ui/JikiMuxPlayer", () => ({
  __esModule: true,
  default: React.forwardRef<unknown, { onEnded?: () => void; playbackId: string }>(function MockMuxPlayer(props, ref) {
    lastOnEnded = props.onEnded;
    React.useImperativeHandle(ref, () => ({
      pause: pauseMock,
      play: playMock
    }));
    return <div data-testid="mux-player" data-playback-id={props.playbackId} />;
  })
}));

describe("WelcomeModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastOnEnded = undefined;
  });

  async function renderModal() {
    render(<WelcomeModal />);
    return await screen.findByTestId("mux-player");
  }

  it("renders the welcome video", async () => {
    await renderModal();
    expect(screen.getByText("Welcome to Jiki!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("closes the modal when Continue is clicked after the video ends", async () => {
    await renderModal();

    act(() => {
      lastOnEnded?.();
    });

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(hideModal).toHaveBeenCalledTimes(1);
    expect(pauseMock).not.toHaveBeenCalled();
  });

  it("pauses the video and shows a confirm dialog when Continue is clicked mid-video", async () => {
    await renderModal();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(pauseMock).toHaveBeenCalledTimes(1);
    expect(hideModal).not.toHaveBeenCalled();
    expect(await screen.findByText("Skip the welcome video?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip video" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep watching" })).toBeInTheDocument();
  });

  it("closes the modal when the user confirms skipping", async () => {
    await renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    fireEvent.click(await screen.findByRole("button", { name: "Skip video" }));
    expect(hideModal).toHaveBeenCalledTimes(1);
  });

  it("resumes playback and dismisses the confirm dialog when the user keeps watching", async () => {
    await renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    fireEvent.click(await screen.findByRole("button", { name: "Keep watching" }));

    expect(playMock).toHaveBeenCalledTimes(1);
    expect(hideModal).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText("Skip the welcome video?")).not.toBeInTheDocument();
    });
  });
});
