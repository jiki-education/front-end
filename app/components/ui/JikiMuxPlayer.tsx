"use client";

import { forwardRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type { MuxPlayerProps, MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { reportError } from "@/lib/reportError";

// Mux dispatches a raw DOM Event for player errors (HLS load failures, mid-stream
// teardown, etc.). If left unhandled it surfaces to Next's app-router as an
// `Event`-typed unhandled rejection, which trips its globalError path and has
// caused "Rendered more hooks than during the previous render" downstream.
function defaultOnError(event: Event) {
  const target = event.target as HTMLMediaElement | null;
  const mediaError = target?.error;
  const message = mediaError ? `MuxPlayer error ${mediaError.code}: ${mediaError.message}` : "MuxPlayer error";
  reportError(new Error(message));
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
