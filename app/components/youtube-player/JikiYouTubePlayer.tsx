"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import YouTube from "react-youtube";
import PlayIcon from "@/icons/play.svg";
import styles from "./JikiYouTubePlayer.module.css";

// The native YouTube iframe player exposes synchronous getters on the event
// target (react-youtube types them loosely via youtube-player, which ships no
// TypeScript declarations). We narrow to just the methods we drive.
export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
}

// YT.PlayerState values (https://developers.google.com/youtube/iframe_api_reference#Playback_status)
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

type Phase = "idle" | "playing" | "paused" | "ended";

export interface JikiYouTubePlayerProgress {
  currentTime: number;
  duration: number;
  percent: number;
}

export interface JikiYouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  /** Mount the player and start playback without a facade click. */
  activate: () => void;
}

export interface JikiYouTubePlayerProps {
  videoId: string;
  /** Video title. Not shown on the facade — used for the iframe title and ARIA labels. */
  title?: string;
  /** Poster image for the start facade. Defaults to the YouTube thumbnail. */
  poster?: string;
  /** Start muted (helps unattended autoplay). Defaults to false. */
  muted?: boolean;
  className?: string;
  onReady?: (player: JikiYouTubePlayerHandle) => void;
  onPlay?: (currentTime: number) => void;
  onPause?: (currentTime: number) => void;
  onEnded?: () => void;
  onProgress?: (progress: JikiYouTubePlayerProgress) => void;
  /** How often (ms) to emit onProgress while playing. */
  progressIntervalMs?: number;
  /**
   * Raw react-youtube passthroughs, for consumers driving the underlying player
   * directly (e.g. useEpisodeProgress, which restores position from the native
   * target and keys off YT.PlayerState). Fire alongside the friendlier callbacks
   * above rather than replacing them.
   */
  onRawReady?: (event: { target: YTPlayer }) => void;
  onRawStateChange?: (event: { data: number; target: YTPlayer }) => void;
}

const JikiYouTubePlayer = forwardRef<JikiYouTubePlayerHandle, JikiYouTubePlayerProps>(function JikiYouTubePlayer(
  {
    videoId,
    title,
    poster,
    muted = false,
    className,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onProgress,
    progressIntervalMs = 500,
    onRawReady,
    onRawStateChange
  },
  ref
) {
  const playerRef = useRef<YTPlayer | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activated, setActivated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  const posterSrc = poster ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  // Only meaningful for the default poster; an explicit `poster` gets no fallback.
  const fallbackPosterSrc = poster ? undefined : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const stopProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const startProgressTimer = useCallback(() => {
    stopProgressTimer();
    progressTimerRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) {
        return;
      }
      const time = player.getCurrentTime();
      const total = player.getDuration();
      if (total) {
        onProgress?.({ currentTime: time, duration: total, percent: (time / total) * 100 });
      }
    }, progressIntervalMs);
  }, [onProgress, progressIntervalMs, stopProgressTimer]);

  useEffect(() => {
    return () => stopProgressTimer();
  }, [stopProgressTimer]);

  const imperativeHandle = useCallback((): JikiYouTubePlayerHandle => {
    return {
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      seekTo: (seconds: number) => playerRef.current?.seekTo(seconds, true),
      getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
      getDuration: () => playerRef.current?.getDuration() ?? 0,
      activate: () => setActivated(true)
    };
  }, []);

  useImperativeHandle(ref, imperativeHandle, [imperativeHandle]);

  const handleReady = (event: { target: YTPlayer }) => {
    playerRef.current = event.target;
    if (muted) {
      event.target.mute();
    }
    setIsReady(true);
    // The iframe only mounts after the facade click, so this play() inherits that
    // user gesture and isn't treated as unattended autoplay.
    event.target.playVideo();
    onReady?.(imperativeHandle());
    onRawReady?.(event);
  };

  // Seeking out of the ENDED state doesn't reliably resume on its own, so drive
  // playback explicitly — otherwise the end overlay stays up and the viewer has
  // to click twice.
  const handleReplay = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    player.seekTo(0, true);
    player.playVideo();
  };

  const handleStateChange = (event: { data: number; target: YTPlayer }) => {
    onRawStateChange?.(event);

    if (event.data === YT_PLAYING) {
      setPhase("playing");
      startProgressTimer();
      onPlay?.(event.target.getCurrentTime());
    } else if (event.data === YT_PAUSED) {
      setPhase("paused");
      stopProgressTimer();
      onPause?.(event.target.getCurrentTime());
    } else if (event.data === YT_ENDED) {
      setPhase("ended");
      stopProgressTimer();
      onEnded?.();
    }
  };

  return (
    <div
      className={`${styles.player} ${className ?? ""}`}
      role="region"
      aria-label={title ? `Video player: ${title}` : "Video player"}
    >
      {activated ? (
        <YouTube
          videoId={videoId}
          title={title}
          className={`${styles.iframeWrapper} ${isReady ? "" : styles.iframeWrapperHidden}`}
          iframeClassName={styles.iframe}
          opts={{
            width: "100%",
            height: "100%",
            host: "https://www.youtube-nocookie.com",
            playerVars: {
              autoplay: 1,
              // Native controls stay on so the Settings gear (audio track +
              // captions, needed for per-language dubs) is reachable.
              controls: 1,
              modestbranding: 1,
              // Since 2018 rel=0 no longer removes end-screen suggestions, it
              // only restricts them to this channel. The end overlay is what
              // actually hides them.
              rel: 0,
              // No annotations/cards over the video.
              iv_load_policy: 3,
              playsinline: 1,
              cc_load_policy: 0,
              color: "white"
            }
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          // Clear the loading state on failure too, so a broken/unavailable video
          // surfaces YouTube's own error rather than spinning forever.
          onError={() => setIsReady(true)}
        />
      ) : (
        <PosterFacade
          posterSrc={posterSrc}
          fallbackPosterSrc={fallbackPosterSrc}
          label={title ? `Play ${title}` : "Play"}
          onActivate={() => setActivated(true)}
        />
      )}

      {activated && !isReady && (
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinner} />
        </div>
      )}

      {/* End bookend: the same poster + play button as the start, which both
          hides YouTube's suggested-video grid and returns the player to the
          state the viewer first saw. */}
      {activated && phase === "ended" && (
        <PosterFacade
          posterSrc={posterSrc}
          fallbackPosterSrc={fallbackPosterSrc}
          label="Replay"
          entering
          onActivate={handleReplay}
        />
      )}
    </div>
  );
});

export default JikiYouTubePlayer;

// The poster + play button shown both before the iframe mounts (so no request
// hits YouTube beyond the poster image until the viewer chooses to play) and
// again once the video ends, where it doubles as the cover over YouTube's
// suggested-video grid.
function PosterFacade({
  posterSrc,
  fallbackPosterSrc,
  label,
  entering = false,
  onActivate
}: {
  posterSrc: string;
  fallbackPosterSrc?: string;
  label: string;
  /** Fade in on mount. Used by the end screen, which replaces a visible video. */
  entering?: boolean;
  onActivate: () => void;
}) {
  const [src, setSrc] = useState(posterSrc);

  return (
    <button
      type="button"
      className={`${styles.facade} ${entering ? styles.facadeEntering : ""}`}
      onClick={onActivate}
      aria-label={label}
    >
      {/* Plain <img>: the poster is an external YouTube thumbnail and images are
          served unoptimized (see next.config), so next/image adds no benefit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={styles.poster}
        // maxresdefault only exists for videos uploaded with a high-res thumbnail;
        // fall back to hqdefault, which YouTube always generates.
        onError={() => {
          if (fallbackPosterSrc && src !== fallbackPosterSrc) {
            setSrc(fallbackPosterSrc);
          }
        }}
      />
      <span className={styles.facadeScrim} />
      <span className={styles.bigPlayButton}>
        <PlayIcon className={styles.bigPlayIcon} aria-hidden="true" />
      </span>
    </button>
  );
}
