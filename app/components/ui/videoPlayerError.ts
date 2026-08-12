import { reportError } from "@/lib/reportError";

// HTML5 MediaError codes. Video.js v10 reuses the native codes, so the taxonomy
// that classified Mux Player's errors carries over unchanged.
const MEDIA_ERR_NETWORK = 2; // transient client connectivity (sleep, wifi loss)
const MEDIA_ERR_DECODE = 3; // codec-limited client (Firefox/Linux w/o H.264, webviews)
const MEDIA_ERR_SRC_NOT_SUPPORTED = 4; // per-viewer environment (dropped HLS fetch or no codec)

// A v10 MediaError, extended by Mux with a numeric muxCode on `data`.
export interface VideoMediaError {
  code?: number;
  message?: string;
  data?: { muxCode?: number } | undefined;
}

// Classify a player error the same way the Mux Player wrapper did: transient /
// client-environment failures are logged but kept out of Sentry; genuine errors
// are reported with a per-code fingerprint so each class is triaged separately.
export function handleVideoPlayerError(mediaError: VideoMediaError | null, onError?: (error: Error) => void): void {
  const code = mediaError?.code;
  const muxCode = mediaError?.data?.muxCode;
  const parts = ["VideoPlayer error"];
  if (code != null) parts.push(`code ${code}`);
  if (muxCode != null) parts.push(`muxCode ${muxCode}`);
  if (mediaError?.message) parts.push(mediaError.message);
  const error = new Error(parts.join(": "));

  onError?.(error);

  // Transient network drops (laptop sleep, wifi loss) — log, don't report.
  if (code === MEDIA_ERR_NETWORK) {
    console.error(error);
    return;
  }
  // Missing-codec problems on the client (Firefox/Linux w/o H.264, webviews) — log, don't report.
  if (code === MEDIA_ERR_DECODE) {
    console.error(error);
    return;
  }
  // Per-viewer environment (dropped HLS fetch or no compatible codec), not a broken upload — log, don't report.
  if (code === MEDIA_ERR_SRC_NOT_SUPPORTED) {
    console.error(error);
    return;
  }
  // Nothing actionable (no code and no message) — log, don't report.
  if (code == null && !mediaError?.message) {
    console.error(error);
    return;
  }

  reportError(error, {
    fingerprint: ["videoplayer-error", String(code ?? "none"), String(muxCode ?? "none")]
  });
}
