"use client";

// Throwaway spike (branch: migrate-to-video-10) — now pointed at the REAL
// JikiVideoPlayer wrapper (not raw @videojs/react), driving it exactly as a real
// consumer will: a ref handle (currentTime get/set, play/pause) plus the on*
// callbacks. Verifies the wrapper's whole contract before cascading it into the
// hooks and consumers. Delete this route once the migration is signed off.

import JikiVideoPlayer, { type JikiVideoPlayerHandle } from "@/components/ui/JikiVideoPlayer";
import { useRef, useState } from "react";
import styles from "./page.module.css";

// Same Mux playback ID the video-exercise dev page uses.
const PLAYBACK_ID = "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU";

// Mirror the real hook's constant so the probe behaves like production.
const SEEK_TOLERANCE_SECONDS = 0.5;

export default function VideoJsSpikePage() {
  const playerRef = useRef<JikiVideoPlayerHandle>(null);
  const maxWatchedRef = useRef(0);
  const [log, setLog] = useState<Array<{ msg: string; clamp: boolean }>>([]);
  const [stats, setStats] = useState({ currentTime: 0, duration: 0, clamps: 0, lastClamp: "—" });

  const appendLog = (msg: string, clamp = false) => setLog((prev) => [...prev.slice(-80), { msg, clamp }]);

  // Mirrors useVideoExercise: advance the ceiling during natural playback, and
  // clamp forward seeks that cross it — all through the wrapper's ref handle.
  const handleTimeUpdate = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = p.currentTime;
    }
    setStats((s) => ({ ...s, currentTime: p.currentTime, duration: p.duration }));
  };

  const handleSeeking = () => {
    const p = playerRef.current;
    if (!p) return;
    const ceiling = maxWatchedRef.current + SEEK_TOLERANCE_SECONDS;
    if (p.currentTime > ceiling) {
      const from = p.currentTime.toFixed(2);
      const to = maxWatchedRef.current.toFixed(2);
      p.currentTime = maxWatchedRef.current;
      setStats((s) => ({ ...s, clamps: s.clamps + 1, lastClamp: `${from}s → ${to}s` }));
      appendLog(`CLAMP: forward seek to ${from}s blocked, snapped to ${to}s`, true);
    } else {
      appendLog(`seek to ${p.currentTime.toFixed(2)}s allowed (ceiling ${ceiling.toFixed(2)}s)`);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>JikiVideoPlayer wrapper spike</h1>
      <p className={styles.subheading}>
        Driving the real <code>JikiVideoPlayer</code> via its ref handle + on* callbacks — the same contract the hooks
        and consumers use. Play, then scrub forward past the watched point (or hit Skip) — it should clamp. Check the
        console for Mux Data / player logs.
      </p>

      <div className={styles.playerFrame}>
        <JikiVideoPlayer
          ref={playerRef}
          playbackId={PLAYBACK_ID}
          onPlay={() => appendLog("onPlay fired")}
          onCanPlay={() => appendLog("onCanPlay fired")}
          onLoadedMetadata={() => appendLog("onLoadedMetadata fired")}
          onEnded={() => appendLog("onEnded fired")}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onError={(e) => appendLog(`onError: ${e.message}`, true)}
          metadata={{ video_title: "Spike test" }}
        />
      </div>

      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => void playerRef.current?.play()}>
          Play
        </button>
        <button className={styles.btn} onClick={() => playerRef.current?.pause()}>
          Pause
        </button>
        <button
          className={styles.btn}
          onClick={() => {
            maxWatchedRef.current = Infinity;
            appendLog("cap lifted (maxWatched = Infinity)");
          }}
        >
          Lift cap
        </button>
        <button
          className={styles.btn}
          onClick={() => {
            const p = playerRef.current;
            if (p) p.currentTime = Math.min(p.currentTime + 30, p.duration);
          }}
        >
          Skip +30s (should clamp)
        </button>
      </div>

      <div className={styles.panel}>
        <Stat label="currentTime" value={`${stats.currentTime.toFixed(2)}s`} />
        <Stat label="duration" value={`${stats.duration.toFixed(2)}s`} />
        <Stat
          label="maxWatched"
          value={maxWatchedRef.current === Infinity ? "∞" : `${maxWatchedRef.current.toFixed(2)}s`}
        />
        <Stat label="clamps" value={String(stats.clamps)} clamp={stats.clamps > 0} />
        <Stat label="last clamp" value={stats.lastClamp} clamp={stats.lastClamp !== "—"} />
      </div>

      <EventLog log={log} />
    </div>
  );
}

function Stat({ label, value, clamp = false }: { label: string; value: string; clamp?: boolean }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statLabel}>{label}</div>
      <div className={`${styles.statValue} ${clamp ? styles.clampFlash : ""}`}>{value}</div>
    </div>
  );
}

function EventLog({ log }: { log: Array<{ msg: string; clamp: boolean }> }) {
  return (
    <div className={styles.log}>
      {log.length === 0
        ? "waiting for playback…"
        : log.map((entry, i) => (
            <div key={i} className={entry.clamp ? styles.logClamp : undefined}>
              {entry.msg}
            </div>
          ))}
    </div>
  );
}
