"use client";

import { createPlayer } from "@videojs/react";
import { videoFeatures, VideoSkin } from "@videojs/react/video";
import { MuxVideo } from "@videojs/react/media/mux-video";
import "@videojs/react/video/skin.css";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { handleVideoPlayerError } from "./videoPlayerError";
import styles from "./JikiVideoPlayer.module.css";

// Mux Data environment key. Mux Player self-configured telemetry off the
// playbackId, but Video.js's MuxData needs an explicit key to emit beacons.
// Sourced from the Mux dashboard; telemetry is simply off until it's set.
const MUX_ENV_KEY = process.env.NEXT_PUBLIC_MUX_ENV_KEY;

// Mux serves every asset as HLS; a playbackId maps 1:1 to these URLs.
function hlsSrc(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
function posterUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg`;
}

// The imperative surface consumers drive the player through. v10 is store-based,
// but progress hooks legitimately need one-shot reads and a seek (position
// restore, the first-watch seek-cap snap-back), so the wrapper bridges the store
// to this small handle rather than forcing every read through a subscription.
export interface JikiVideoPlayerHandle {
  get currentTime(): number;
  set currentTime(value: number);
  readonly duration: number;
  play: () => Promise<void>;
  pause: () => void;
}

export interface JikiVideoPlayerProps {
  playbackId: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  poster?: string;
  // Hide the skin's skip-forward/back buttons (the landing Hero wants this).
  hideSeekButtons?: boolean;
  // Reactive playback callbacks, driven by an internal store subscription so
  // consumers keep the DOM-style on* contract they used with Mux Player.
  onPlay?: () => void;
  onPlaying?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: () => void;
  onSeeking?: () => void;
  onCanPlay?: () => void;
  onLoadedMetadata?: () => void;
  onError?: (error: Error) => void;
  // Mux Data telemetry metadata (e.g. { video_title }). NOTE: unlike Mux Player
  // (which self-configured Mux Data from the playbackId), Video.js's MuxData needs
  // an envKey to actually emit beacons — see muxEnvKey below. Without a key the
  // metadata is inert.
  metadata?: Record<string, unknown>;
}

const Player = createPlayer({ features: videoFeatures });

const JikiVideoPlayer = forwardRef<JikiVideoPlayerHandle, JikiVideoPlayerProps>(function JikiVideoPlayer(
  { playbackId, className, style, autoPlay, poster, metadata, hideSeekButtons, ...callbacks },
  ref
) {
  const containerClassName = [styles.videoPlayer, className, hideSeekButtons ? styles.hideSeekButtons : undefined]
    .filter(Boolean)
    .join(" ");
  return (
    <Player.Provider>
      <div className={containerClassName} style={style}>
        <VideoSkin>
          <MuxVideo
            src={hlsSrc(playbackId)}
            poster={poster ?? posterUrl(playbackId)}
            streamType="on-demand"
            autoPlay={autoPlay}
            playsInline
            config={MUX_ENV_KEY ? { muxData: { envKey: MUX_ENV_KEY, metadata } } : undefined}
          />
        </VideoSkin>
      </div>
      <PlayerBridge ref={ref} {...callbacks} />
    </Player.Provider>
  );
});

export default JikiVideoPlayer;

// Lives inside Player.Provider so it can reach the store. Translates store state
// transitions into the on* callbacks, and exposes the imperative handle.
type PlayerBridgeProps = Pick<
  JikiVideoPlayerProps,
  "onPlay" | "onPlaying" | "onEnded" | "onTimeUpdate" | "onSeeking" | "onCanPlay" | "onLoadedMetadata" | "onError"
>;

const PlayerBridge = forwardRef<JikiVideoPlayerHandle, PlayerBridgeProps>(function PlayerBridge(callbacks, ref) {
  const store = Player.usePlayer();

  // Keep the latest callbacks in a ref so the subscription effect doesn't
  // resubscribe on every render (callbacks are usually fresh each render).
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useImperativeHandle(
    ref,
    () => ({
      get currentTime() {
        return store.state.currentTime;
      },
      set currentTime(value: number) {
        void store.seek(value);
      },
      get duration() {
        return store.state.duration;
      },
      play: () => store.play(),
      pause: () => store.pause()
    }),
    [store]
  );

  useEffect(() => {
    const prev = {
      currentTime: store.state.currentTime,
      seeking: store.state.seeking,
      paused: store.state.paused,
      waiting: store.state.waiting,
      ended: store.state.ended,
      canPlay: store.state.canPlay,
      duration: store.state.duration,
      error: store.state.error
    };

    const unsubscribe = store.subscribe(() => {
      const s = store.state;
      const cb = callbacksRef.current;

      // Fire onSeeking BEFORE onTimeUpdate so a consumer's seek handler (e.g. the
      // first-watch seek-cap) can snap the position back before the seeked time is
      // ever observed as "watched" — matching Mux Player / native media ordering.
      if (s.seeking && !prev.seeking) cb.onSeeking?.();
      // Suppress onTimeUpdate while a seek is in progress: a forward-scrubbed
      // position must not count as natural playback. Native timeupdate likewise
      // doesn't advance mid-seek.
      if (s.currentTime !== prev.currentTime && !s.seeking) cb.onTimeUpdate?.();
      // onPlay = playback requested (paused → not paused), matching the DOM `play` event.
      if (!s.paused && prev.paused) cb.onPlay?.();
      // onPlaying = frames actually flowing, matching the DOM `playing` event. v10's store
      // has no `playing` field; the equivalent is entering !paused && !waiting (playback
      // resumed after a start/stall), which is what Hero waits on to reveal the player.
      if (!s.paused && !s.waiting && (prev.paused || prev.waiting)) cb.onPlaying?.();
      if (s.ended && !prev.ended) cb.onEnded?.();
      if (s.canPlay && !prev.canPlay) cb.onCanPlay?.();
      // duration going from 0/NaN to a real value ≈ loadedmetadata.
      if (!prev.duration && s.duration) cb.onLoadedMetadata?.();
      if (s.error && s.error !== prev.error) handleVideoPlayerError(s.error, cb.onError);

      prev.currentTime = s.currentTime;
      prev.seeking = s.seeking;
      prev.paused = s.paused;
      prev.waiting = s.waiting;
      prev.ended = s.ended;
      prev.canPlay = s.canPlay;
      prev.duration = s.duration;
      prev.error = s.error;
    });

    return unsubscribe;
  }, [store]);

  return null;
});
