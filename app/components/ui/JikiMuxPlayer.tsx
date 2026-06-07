"use client";

import { forwardRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type { MuxPlayerProps, MuxPlayerRefAttributes } from "@mux/mux-player-react";

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
      {...props}
    />
  );
});

export default JikiMuxPlayer;
export type { MuxPlayerRefAttributes };
