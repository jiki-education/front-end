import { render, screen, fireEvent, act } from "@testing-library/react";
import JikiYouTubePlayer from "@/components/youtube-player/JikiYouTubePlayer";

// YT.PlayerState values the component branches on.
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

interface YouTubeMockProps {
  videoId: string;
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
    return <div data-testid="yt-iframe" data-video-id={props.videoId} />;
  }
}));

/** Click the facade, then fire react-youtube's onReady with the fake player. */
function activateAndReady() {
  fireEvent.click(screen.getByRole("button"));
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

  describe("start facade", () => {
    it("shows the facade and mounts no iframe until clicked", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      expect(screen.queryByTestId("yt-iframe")).not.toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("mounts the iframe once the facade is clicked", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByTestId("yt-iframe")).toHaveAttribute("data-video-id", "abc123");
    });

    it("falls back to hqdefault when the maxres poster fails to load", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      const poster = screen.getByRole("button").querySelector("img")!;
      expect(poster).toHaveAttribute("src", "https://i.ytimg.com/vi/abc123/maxresdefault.jpg");

      fireEvent.error(poster);

      expect(poster).toHaveAttribute("src", "https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    });

    it("keeps an explicitly supplied poster even if it fails", () => {
      render(<JikiYouTubePlayer videoId="abc123" poster="https://example.com/custom.jpg" />);

      const poster = screen.getByRole("button").querySelector("img")!;
      fireEvent.error(poster);

      expect(poster).toHaveAttribute("src", "https://example.com/custom.jpg");
    });
  });

  describe("playback", () => {
    it("starts playback on ready, carrying the facade click gesture", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      activateAndReady();

      expect(fakePlayer.playVideo).toHaveBeenCalled();
    });

    it("mutes before playing when muted is set", () => {
      render(<JikiYouTubePlayer videoId="abc123" muted />);

      activateAndReady();

      expect(fakePlayer.mute).toHaveBeenCalled();
    });

    it("emits onPlay and onPause with the current time", () => {
      const onPlay = jest.fn();
      const onPause = jest.fn();
      render(<JikiYouTubePlayer videoId="abc123" onPlay={onPlay} onPause={onPause} />);

      activateAndReady();
      fireState(YT_PLAYING);
      expect(onPlay).toHaveBeenCalledWith(10);

      fireState(YT_PAUSED);
      expect(onPause).toHaveBeenCalledWith(10);
    });

    it("emits onEnded when the video finishes", () => {
      const onEnded = jest.fn();
      render(<JikiYouTubePlayer videoId="abc123" onEnded={onEnded} />);

      activateAndReady();
      fireState(YT_ENDED);

      expect(onEnded).toHaveBeenCalled();
    });
  });

  describe("end overlay", () => {
    it("is hidden during playback and shown once ended", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      activateAndReady();
      fireState(YT_PLAYING);
      expect(screen.queryByLabelText("Replay")).not.toBeInTheDocument();

      fireState(YT_ENDED);
      expect(screen.getByLabelText("Replay")).toBeInTheDocument();
    });

    it("seeks to the start AND resumes playback on replay", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      activateAndReady();
      fireState(YT_ENDED);
      fakePlayer.playVideo.mockClear();

      fireEvent.click(screen.getByLabelText("Replay"));

      expect(fakePlayer.seekTo).toHaveBeenCalledWith(0, true);
      // Seeking out of ENDED does not reliably resume on its own.
      expect(fakePlayer.playVideo).toHaveBeenCalled();
    });

    it("hides the overlay once playback resumes", () => {
      render(<JikiYouTubePlayer videoId="abc123" />);

      activateAndReady();
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

      activateAndReady();
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

      activateAndReady();
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

      activateAndReady();
      expect(onRawReady).toHaveBeenCalledWith({ target: fakePlayer });

      fireState(YT_PLAYING);
      expect(onRawStateChange).toHaveBeenCalledWith({ data: YT_PLAYING, target: fakePlayer });
    });
  });
});
