"use client";

import JikiYouTubePlayer, { type JikiYouTubePlayerProgress } from "@/components/youtube-player/JikiYouTubePlayer";
import { useState } from "react";

const SAMPLE_VIDEO_ID = "ao5pfcKXDCo";

export default function YouTubePlayerDevPage() {
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState<JikiYouTubePlayerProgress | null>(null);

  const addLog = (message: string) => setLog((prev) => [`${message}`, ...prev].slice(0, 12));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">YouTube Player</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-1">Plain native embed</h2>
          <p className="text-gray-600 mb-4">
            Vanilla YouTube iframe with native controls. Open the <strong>Settings</strong> gear (bottom-right) and look
            for an <strong>Audio track</strong> option to confirm whether this video ships multiple audio tracks.
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${SAMPLE_VIDEO_ID}`}
              title="Plain YouTube embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <h2 className="text-xl font-semibold mb-1">Custom Jiki player</h2>
        <p className="text-gray-600 mb-6">
          Clean, chrome-free YouTube embed (nocookie host, facade start, custom controls, pause/end overlays). Events
          below come from the component callbacks the deep-dive wrapper will consume.
        </p>

        <div className="rounded-xl overflow-hidden shadow-lg mb-6">
          <JikiYouTubePlayer
            videoId={SAMPLE_VIDEO_ID}
            title="Agentic Coding 101 - Build Yourself a Homepage"
            onReady={() => addLog("ready")}
            onPlay={(t) => addLog(`play @ ${t.toFixed(1)}s`)}
            onPause={(t) => addLog(`pause @ ${t.toFixed(1)}s`)}
            onEnded={() => addLog("ended")}
            onProgress={setProgress}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Progress</h2>
            {progress ? (
              <dl className="text-sm space-y-1">
                <div>
                  <dt className="inline font-medium">Current:</dt>
                  <dd className="inline ms-2">{progress.currentTime.toFixed(1)}s</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Duration:</dt>
                  <dd className="inline ms-2">{progress.duration.toFixed(1)}s</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Percent:</dt>
                  <dd className="inline ms-2">{progress.percent.toFixed(1)}%</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-gray-500">Press play to start tracking.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Event log</h2>
            <ul className="text-sm font-mono space-y-1">
              {log.length === 0 ? (
                <li className="text-gray-500">No events yet.</li>
              ) : (
                log.map((entry, index) => <li key={index}>{entry}</li>)
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
