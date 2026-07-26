"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import YouTube from "react-youtube";
import PlayIcon from "@/icons/play.svg";
import styles from "./JikiYouTubePlayer.module.css";

// The native YouTube iframe player exposes synchronous getters on the event
// target (react-youtube types them loosely via youtube-player, which ships no
// TypeScript declarations). We narrow to just the methods we drive.
interface YTPlayer {
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
  /** Video title, shown on the start facade and used as the iframe title. */
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
    progressIntervalMs = 500
  },
  ref
) {
  const playerRef = useRef<YTPlayer | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activated, setActivated] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  const posterSrc = poster ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

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
    event.target.playVideo();
    onReady?.(imperativeHandle());
  };

  const handleStateChange = (event: { data: number; target: YTPlayer }) => {
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
          className={styles.iframeWrapper}
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
              rel: 0,
              iv_load_policy: 3,
              playsinline: 1,
              cc_load_policy: 0,
              color: "white"
            }
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />
      ) : (
        <StartFacade posterSrc={posterSrc} title={title} onActivate={() => setActivated(true)} />
      )}

      {/* End bookend: covers YouTube's suggested-video grid with our own replay. */}
      {activated && phase === "ended" && <EndOverlay onReplay={() => playerRef.current?.seekTo(0, true)} />}
    </div>
  );
});

export default JikiYouTubePlayer;

// Start facade — shown before the iframe mounts, so no request hits YouTube
// (beyond the poster image) until the viewer chooses to play.
function StartFacade({ posterSrc, title, onActivate }: { posterSrc: string; title?: string; onActivate: () => void }) {
  return (
    <button type="button" className={styles.facade} onClick={onActivate} aria-label={title ? `Play ${title}` : "Play"}>
      {/* Plain <img>: the poster is an external YouTube thumbnail and images are
          served unoptimized (see next.config), so next/image adds no benefit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={posterSrc} alt="" className={styles.poster} />
      <span className={styles.facadeScrim} />
      {title && <span className={styles.facadeTitle}>{title}</span>}
      <span className={styles.bigPlayButton}>
        <PlayIcon className={styles.bigPlayIcon} aria-hidden="true" />
      </span>
    </button>
  );
}

// Covers YouTube's end-screen suggested-video grid with our own scrim and a
// single replay action, keeping the post-video state on-brand.
function EndOverlay({ onReplay }: { onReplay: () => void }) {
  return (
    <div className={styles.stateOverlay}>
      <button type="button" className={styles.bigPlayButton} onClick={onReplay} aria-label="Replay">
        <PlayIcon className={styles.bigPlayIcon} aria-hidden="true" />
      </button>
    </div>
  );
}
