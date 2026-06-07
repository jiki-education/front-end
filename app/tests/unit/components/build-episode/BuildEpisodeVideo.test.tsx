import { render, screen } from "@testing-library/react";
import BuildEpisodeVideo from "@/components/build-episode/BuildEpisodeVideo";
import { useAuthStore } from "@/lib/auth/authStore";
import { showPremiumUpgradeModal } from "@/lib/modal";

jest.mock("@/lib/auth/authStore");
jest.mock("@/lib/modal", () => ({
  showPremiumUpgradeModal: jest.fn()
}));
jest.mock("@/components/build-episode/lib/useBuildEpisodeProgress", () => ({
  useBuildEpisodeProgress: () => ({
    muxPlayerRef: { current: null },
    handleMuxTimeUpdate: jest.fn(),
    handleMuxEnded: jest.fn(),
    handleMuxLoadedMetadata: jest.fn(),
    handleYouTubeReady: jest.fn(),
    handleYouTubeStateChange: jest.fn()
  })
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush })
}));

jest.mock("@/components/ui/JikiMuxPlayer", () => ({
  __esModule: true,
  default: (props: { playbackId: string }) => <div data-testid="mux-player" data-playback-id={props.playbackId} />
}));
jest.mock("react-youtube", () => ({
  __esModule: true,
  default: (props: { videoId: string }) => <div data-testid="youtube-player" data-video-id={props.videoId} />
}));

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

function setAuthState(state: { user: { membership_type: string } | null; isLoading: boolean }) {
  mockUseAuthStore.mockImplementation((selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state
  );
}

const baseProps = {
  uuid: "065e457e-4e9d-478b-bd0a-bbe384d8347f",
  seriesSlug: "building-basics",
  videoKey: "abc123"
} as const;

describe("BuildEpisodeVideo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Mux player for mux episodes", () => {
    setAuthState({ user: { membership_type: "premium" }, isLoading: false });

    render(<BuildEpisodeVideo {...baseProps} videoProvider="mux" premium={false} />);

    expect(screen.getByTestId("mux-player")).toHaveAttribute("data-playback-id", "abc123");
    expect(screen.queryByTestId("youtube-player")).not.toBeInTheDocument();
  });

  it("renders the YouTube player for youtube episodes", () => {
    setAuthState({ user: { membership_type: "standard" }, isLoading: false });

    render(<BuildEpisodeVideo {...baseProps} videoProvider="youtube" premium={false} />);

    expect(screen.getByTestId("youtube-player")).toHaveAttribute("data-video-id", "abc123");
    expect(screen.queryByTestId("mux-player")).not.toBeInTheDocument();
  });

  it("redirects non-premium users from premium episodes and opens the upgrade modal", () => {
    setAuthState({ user: { membership_type: "standard" }, isLoading: false });

    render(<BuildEpisodeVideo {...baseProps} videoProvider="mux" premium={true} />);

    expect(showPremiumUpgradeModal).toHaveBeenCalledWith("locked_episode_video", expect.any(Object));
    expect(mockReplace).toHaveBeenCalledWith("/build/building-basics");
    // Player should not be rendered while locked
    expect(screen.queryByTestId("mux-player")).not.toBeInTheDocument();
    expect(screen.queryByTestId("youtube-player")).not.toBeInTheDocument();
  });

  it("renders premium episodes for premium users without redirecting", () => {
    setAuthState({ user: { membership_type: "premium" }, isLoading: false });

    render(<BuildEpisodeVideo {...baseProps} videoProvider="mux" premium={true} />);

    expect(showPremiumUpgradeModal).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByTestId("mux-player")).toBeInTheDocument();
  });

  it("waits for auth to resolve before deciding on premium gate", () => {
    setAuthState({ user: null, isLoading: true });

    render(<BuildEpisodeVideo {...baseProps} videoProvider="mux" premium={true} />);

    expect(showPremiumUpgradeModal).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
