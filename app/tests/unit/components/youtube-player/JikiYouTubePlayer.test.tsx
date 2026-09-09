import { render, screen, fireEvent, act } from "@testing-library/react";
import JikiYouTubePlayer from "@/components/youtube-player/JikiYouTubePlayer";

// YT.PlayerState values the component branches on.
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

interface YouTubeMockProps {
  videoId: string;
  className?: string;
  opts?: { playerVars?: Record<string, unknown> };
  onReady?: (event: { target: unknown }) => void;
  onStateChange?: (event: { data: number; target: unknown }) => void;
  onError?: () => void;
}

// Captures the props react-youtube is rendered with so tests can drive the
// player's callbacks, and exposes a fake native player for assertions.
let latestProps: YouTubeMockProps | null = null;
let fakePlayer: ReturnType<typeof createFakePlayer>;

function createFakePlayer(overrides: { duration?: number } = {}) {
  return {
    playVideo: jest.fn(),
    pauseVideo: jest.fn(),
    getCurrentTime: jest.fn(() => 10),
    getDuration: jest.fn(() => overrides.duration ?? 100),
    seekTo: jest.fn(),
    mute: jest.fn()
  };
}

jest.mock("react-youtube", () => ({
  __esModule: true,
  default: (props: YouTubeMockProps) => {
    latestProps = props;
    // Carries className through so tests can assert on the loading/visible state.
    return <div data-testid="yt-iframe" data-video-id={props.videoId} className={props.className} />;
  }
}));

/** Fire react-youtube's onReady with the fake player. */
function ready() {
  act(() => {
    latestProps?.onReady?.({ target: fakePlayer });
  });
}

function fireState(data: number) {
  act(() => {
    latestProps?.onStateChange?.({ data, target: fakePlayer });
  });
}

describe("JikiYouTubePlayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    latestProps = null;
    fakePlayer = createFakePlayer();
  });

  describe("mounting", () => {
    it("mounts the iframe immediately, with no facade in the way", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      expect(screen.getByTestId("yt-iframe")).toHaveAttribute("data-video-id", "abc123");
      // Nothing of ours is clickable over the player, so the only play button
      // present is YouTube's own - which is what makes the view count.
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("never asks YouTube to autoplay", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      expect(latestProps?.opts?.playerVars?.autoplay).toBe(0);
    });
  });

  describe("playback", () => {
    it("does not start playback itself, so YouTube credits the view", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      ready();

      // A playback started by us (playVideo/autoplay) is not counted by YouTube,
      // so the viewer has to press the player's own button.
      expect(fakePlayer.playVideo).not.toHaveBeenCalled();
    });

    it("mutes on ready when muted is set", () => {
      render(<JikiYouTubePlayer videoId="abc123" muted />);

      ready();

      expect(fakePlayer.mute).toHaveBeenCalled();
    });

    it("emits onPlay and onPause with the current time", () => {
      const onPlay = jest.fn();
      const onPause = jest.fn();
      render(<JikiYouTubePlayer videoId="abc123" onPlay={onPlay} onPause={onPause} />);

      ready();
      fireState(YT_PLAYING);
      expect(onPlay).toHaveBeenCalledWith(10);

      fireState(YT_PAUSED);
      expect(onPause).toHaveBeenCalledWith(10);
    });

    it("emits onEnded when the video finishes", () => {
      const onEnded = jest.fn();
      render(<JikiYouTubePlayer videoId="abc123" onEnded={onEnded} />);

      ready();
      fireState(YT_ENDED);

      expect(onEnded).toHaveBeenCalled();
    });

    it("stops holding the frame behind the spinner when YouTube errors", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      const iframe = screen.getByTestId("yt-iframe");
      expect(iframe).toHaveClass("iframeWrapperHidden");

      // An unavailable video never fires onReady, so onError has to clear the
      // loading state or the spinner spins forever over YouTube's own error.
      act(() => {
        latestProps?.onError?.();
      });

      expect(iframe).not.toHaveClass("iframeWrapperHidden");
    });
  });

  describe("end overlay", () => {
    it("is hidden during playback and shown once ended", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      ready();
      fireState(YT_PLAYING);
      expect(screen.queryByLabelText("Replay")).not.toBeInTheDocument();

      fireState(YT_ENDED);
      expect(screen.getByLabelText("Replay")).toBeInTheDocument();
    });

    it("seeks to the start AND resumes playback on replay", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      ready();
      fireState(YT_ENDED);
      fakePlayer.playVideo.mockClear();

      fireEvent.click(screen.getByLabelText("Replay"));

      expect(fakePlayer.seekTo).toHaveBeenCalledWith(0, true);
      // Seeking out of ENDED does not reliably resume on its own.
      expect(fakePlayer.playVideo).toHaveBeenCalled();
    });

    it("shows the poster again on the end screen, covering YouTube's suggestions", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      ready();
      fireState(YT_ENDED);

      const replay = screen.getByLabelText("Replay");
      expect(replay.querySelector("img")).toHaveAttribute("src", "https://i.ytimg.com/vi/abc123/maxresdefault.jpg");
    });

    it("falls back to hqdefault when the maxres poster fails to load", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      ready();
      fireState(YT_ENDED);

      const poster = screen.getByLabelText("Replay").querySelector("img")!;
      expect(poster).toHaveAttribute("src", "https://i.ytimg.com/vi/abc123/maxresdefault.jpg");

      fireEvent.error(poster);

      expect(poster).toHaveAttribute("src", "https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    });

    it("keeps an explicitly supplied poster even if it fails", () => {
      render(<JikiYouTubePlayer videoId="abc123" poster="https://example.com/custom.jpg" />);

      ready();
      fireState(YT_ENDED);

      const poster = screen.getByLabelText("Replay").querySelector("img")!;
      fireEvent.error(poster);

      expect(poster).toHaveAttribute("src", "https://example.com/custom.jpg");
    });

    it("hides the overlay once playback resumes", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      ready();
      fireState(YT_ENDED);
      fireEvent.click(screen.getByLabelText("Replay"));
      fireState(YT_PLAYING);

      expect(screen.queryByLabelText("Replay")).not.toBeInTheDocument();
    });
  });

  describe("progress", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("emits progress on an interval while playing and stops when paused", () => {
      const onProgress = jest.fn();
      render(<JikiYouTubePlayer videoId="abc123" onProgress={onProgress} progressIntervalMs={500} />);

      ready();
      fireState(YT_PLAYING);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(onProgress).toHaveBeenCalledWith({ currentTime: 10, duration: 100, percent: 10 });

      fireState(YT_PAUSED);
      onProgress.mockClear();
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onProgress).not.toHaveBeenCalled();
    });

    it("does not emit progress before a duration is available", () => {
      const onProgress = jest.fn();
      fakePlayer = createFakePlayer({ duration: 0 });
      render(<JikiYouTubePlayer videoId="abc123" onProgress={onProgress} />);

      ready();
      fireState(YT_PLAYING);
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onProgress).not.toHaveBeenCalled();
    });
  });

  describe("raw passthroughs", () => {
    it("forwards the native ready and state-change events", () => {
      const onRawReady = jest.fn();
      const onRawStateChange = jest.fn();
      render(<JikiYouTubePlayer videoId="abc123" onRawReady={onRawReady} onRawStateChange={onRawStateChange} />);

      ready();
      expect(onRawReady).toHaveBeenCalledWith({ target: fakePlayer });

      fireState(YT_PLAYING);
      expect(onRawStateChange).toHaveBeenCalledWith({ data: YT_PLAYING, target: fakePlayer });
    });
  });
});
