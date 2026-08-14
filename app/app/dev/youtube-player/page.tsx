"use client";

import JikiYouTubePlayer, { type JikiYouTubePlayerProgress } from "@/components/youtube-player/JikiYouTubePlayer";
import { useState } from "react";
import styles from "./page.module.css";

const SAMPLE_VIDEO_ID = "ao5pfcKXDCo";

// "Me at the zoo" — 19 seconds, so the end-screen bookend is reachable without
// waiting. It also has no maxresdefault thumbnail, so it exercises the poster
// fallback at the same time.
const SHORT_VIDEO_ID = "jNQXAC9IVRw";

interface Scenario {
  key: string;
  label: string;
  videoId: string;
  poster?: string;
  muted?: boolean;
  hint: string;
}

const SCENARIOS: Scenario[] = [
  {
    key: "default",
    label: "Default",
    videoId: SAMPLE_VIDEO_ID,
    hint: "Baseline. Facade → click → spinner → playback. Check the Settings gear still offers Audio track + Captions."
  },
  {
    key: "short",
    label: "Short video (end overlay + poster fallback)",
    videoId: SHORT_VIDEO_ID,
    hint: "19 seconds, so the end screen arrives fast. Two things to check: our overlay covers YouTube's suggested-video grid and Replay resumes on ONE click; and the facade poster still appears (this video has no maxresdefault, so it's served by the hqdefault fallback)."
  },
  {
    key: "poster-broken",
    label: "Poster hard-fail",
    videoId: SAMPLE_VIDEO_ID,
    poster: "https://i.ytimg.com/vi/this-id-does-not-exist/maxresdefault.jpg",
    hint: "An explicit poster that 404s. Explicit posters get no fallback by design, so this shows the bare failure mode — the play button must stay visible and clickable over the empty poster."
  },
  {
    key: "bad-video",
    label: "Unavailable video (error path)",
    videoId: "aaaaaaaaaaa",
    hint: "Invalid ID. After clicking play the spinner must CLEAR and YouTube's own error surface — it must not spin forever."
  },
  {
    key: "muted",
    label: "Muted start",
    videoId: SAMPLE_VIDEO_ID,
    muted: true,
    hint: "Starts muted. Playback should still begin immediately on click."
  }
];

export default function YouTubePlayerDevPage() {
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState<JikiYouTubePlayerProgress | null>(null);
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS[0].key);

  const scenario = SCENARIOS.find((s) => s.key === scenarioKey) ?? SCENARIOS[0];

  const addLog = (message: string) => setLog((prev) => [`${message}`, ...prev].slice(0, 12));

  const selectScenario = (key: string) => {
    setScenarioKey(key);
    setLog([]);
    setProgress(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>YouTube Player</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Plain native embed</h2>
          <p className={styles.sectionBlurb}>
            Vanilla YouTube iframe with native controls. Open the <strong>Settings</strong> gear (bottom-right) and look
            for an <strong>Audio track</strong> option to confirm whether this video ships multiple audio tracks.
          </p>
          <div className={styles.videoFrame}>
            <iframe
              className={styles.nativeEmbed}
              src={`https://www.youtube.com/embed/${SAMPLE_VIDEO_ID}`}
              title="Plain YouTube embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <h2 className={styles.sectionTitle}>Custom Jiki player</h2>
        <p className={styles.blurb}>
          Bookended hybrid: our facade at the start (nothing loads from YouTube until you click), native controls during
          playback so the Settings gear stays reachable for audio track + captions, and our overlay over the end screen.
        </p>

        <div className={styles.scenarioBar} role="group" aria-label="Test scenario">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={styles.scenarioButton}
              data-active={s.key === scenarioKey}
              onClick={() => selectScenario(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className={styles.scenarioHint}>{scenario.hint}</p>

        <div className={styles.playerFrame}>
          {/* Keyed so switching scenarios remounts the player back to its facade. */}
          <JikiYouTubePlayer
            key={scenario.key}
            videoId={scenario.videoId}
            poster={scenario.poster}
            muted={scenario.muted}
            title="Agentic Coding 101 - Build Yourself a Homepage"
            onReady={() => addLog("ready")}
            onPlay={(t) => addLog(`play @ ${t.toFixed(1)}s`)}
            onPause={(t) => addLog(`pause @ ${t.toFixed(1)}s`)}
            onEnded={() => addLog("ended")}
            onProgress={setProgress}
          />
        </div>

        <div className={styles.panels}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Progress</h2>
            {progress ? (
              <dl className={styles.progressList}>
                <div>
                  <dt className={styles.progressTerm}>Current:</dt>
                  <dd className={styles.progressValue}>{progress.currentTime.toFixed(1)}s</dd>
                </div>
                <div>
                  <dt className={styles.progressTerm}>Duration:</dt>
                  <dd className={styles.progressValue}>{progress.duration.toFixed(1)}s</dd>
                </div>
                <div>
                  <dt className={styles.progressTerm}>Percent:</dt>
                  <dd className={styles.progressValue}>{progress.percent.toFixed(1)}%</dd>
                </div>
              </dl>
            ) : (
              <p className={styles.placeholder}>Press play to start tracking.</p>
            )}
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Event log</h2>
            <ul className={styles.eventLog}>
              {log.length === 0 ? (
                <li className={styles.eventLogEmpty}>No events yet.</li>
              ) : (
                log.map((entry, index) => <li key={index}>{entry}</li>)
              )}
            </ul>
          </div>
        </div>

        <div className={styles.checklist}>
          <h2 className={styles.panelTitle}>Manual checks</h2>
          <p className={styles.checklistNote}>
            Unit tests cover the phase/replay/fallback logic. These are the things only a real browser can confirm.
          </p>
          <ol className={styles.checklistList}>
            <li>
              <strong>Poster loads at all.</strong> The facade image is served from <code>i.ytimg.com</code>, which needs
              a CSP <code>img-src</code> entry. If it&apos;s missing you get a broken image and a console CSP violation.
            </li>
            <li>
              <strong>Click → playback actually starts.</strong> The iframe only mounts on click, so playback relies on
              inheriting that gesture. If it mounts but sits paused, autoplay is being blocked.
            </li>
            <li>
              <strong>Settings gear offers Audio track + Captions.</strong> This is why native controls stay on — the
              iframe API can&apos;t switch per-language dubs. Losing this breaks i18n.
            </li>
            <li>
              <strong>Replay takes one click.</strong> On the short video, let it end and press Replay once.
            </li>
            <li>
              <strong>Spinner always clears.</strong> Especially on the unavailable-video scenario.
            </li>
            <li>
              <strong>No console CSP violations.</strong> Check DevTools throughout.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
