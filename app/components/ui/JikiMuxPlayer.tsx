"use client";

import { forwardRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type { MuxPlayerProps, MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { reportError } from "@/lib/reportError";

// Mux's HTML5 media error code for a network failure (see MediaError.MEDIA_ERR_NETWORK).
const MEDIA_ERR_NETWORK = 2;

// Mux's HTML5 media error code for a decode failure (see MediaError.MEDIA_ERR_DECODE).
// In practice these come from codec-limited clients — Firefox on Linux without an
// H.264/ffmpeg codec (hls.js finds no playable rendition), in-app webviews, and the
// like — rather than genuinely corrupt media or an actionable app bug.
const MEDIA_ERR_DECODE = 3;

// A Mux MediaError, carried on the error event's `detail`. It extends the native
// MediaError with Mux-specific fields. Typed locally so we don't depend on the
// playback-core internals just to read a few properties.
interface MuxMediaError {
  code?: number;
  message?: string;
  muxCode?: number;
  fatal?: boolean;
}

// Mux dispatches the player error as a CustomEvent whose `detail` is the Mux
// MediaError (HLS load failures, mid-stream teardown, etc.). If left unhandled
// it surfaces to Next's app-router as an `Event`-typed unhandled rejection, which
// trips its globalError path and has caused "Rendered more hooks than during the
// previous render" downstream.
function defaultOnError(event: Event) {
  // The rich error lives on event.detail; event.target.error is null for HLS
  // failures and only populated on the native-video fallback path. detail is
  // typed nullable because the native-video path dispatches a plain Event.
  const detail: MuxMediaError | null | undefined = (event as CustomEvent<MuxMediaError | undefined>).detail;
  const mediaError = detail ?? (event.target as HTMLMediaElement | null)?.error ?? null;

  const code = mediaError?.code;
  // muxCode is a Mux-specific field that only exists on the detail payload, not
  // on the native MediaError surfaced via event.target.error.
  const muxCode = detail?.muxCode;
  const parts = ["MuxPlayer error"];
  if (code != null) parts.push(`code ${code}`);
  if (muxCode != null) parts.push(`muxCode ${muxCode}`);
  if (mediaError?.message) parts.push(mediaError.message);
  const error = new Error(parts.join(": "));

  // Network failures are transient client-side connectivity drops (laptop sleep,
  // wifi loss) rather than actionable bugs — log them but keep them out of Sentry.
  if (code === MEDIA_ERR_NETWORK) {
    console.error(error);
    return;
  }

  // Decode failures are missing-codec problems on the client (Firefox/Linux without
  // H.264, in-app webviews) rather than corrupt media or an actionable app bug — log
  // them but keep them out of Sentry.
  if (code === MEDIA_ERR_DECODE) {
    console.error(error);
    return;
  }

  // A codeless plain Event (no detail, null event.target.error, so no code and no
  // message) carries nothing actionable. These fire from the native-video path as a
  // duplicate signal of the paired rich CustomEvent, which lands in its own Sentry
  // issue with a real code. Log it but keep the empty duplicate out of Sentry.
  if (code == null && !mediaError?.message) {
    console.error(error);
    return;
  }

  // Every variant funnels through this same stack frame, so without an explicit
  // fingerprint Sentry lumps decode failures, unsupported formats, and unknown
  // errors into one issue. Group per code/muxCode so each class is triaged on
  // its own volume.
  reportError(error, {
    fingerprint: ["muxplayer-error", String(code ?? "none"), String(muxCode ?? "none")]
  });
}

const JikiMuxPlayer = forwardRef<MuxPlayerRefAttributes, MuxPlayerProps>(function JikiMuxPlayer(props, ref) {
  return (
    <MuxPlayer
      ref={ref}
      streamType="on-demand"
      defaultHiddenCaptions={true}
      muted={false}
      volume={1}
      loop={false}
      accentColor="#7c3aed"
      onError={defaultOnError}
      {...props}
    />
  );
});

export default JikiMuxPlayer;
export type { MuxPlayerRefAttributes };
