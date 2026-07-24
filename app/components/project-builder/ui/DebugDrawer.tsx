"use client";

// Development-only drawer pinned to the bottom of the viewport. Mounted by the
// dev page (not the app layout) but positioned fixed so it sits "below" the
// whole UI. Tabs: Controls (BYOK key, model, registered actions), Agent
// (request/stream events), Console (preview capture), State.

import { useState } from "react";
import { useStore } from "zustand";
import { clearDebugEvents, debugBusStore, type DebugEvent } from "../lib/debug/debugBus";
import { devSettingsStore, PROVIDERS, updateDevSettings, type LlmEndpoint } from "../lib/debug/devSettingsStore";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";
import controls from "./DebugControls.module.css";

// Where to grab a free key for each provider, shown as a hint under the field.
const KEY_SIGNUP_URL: Record<LlmEndpoint, string> = {
  "opencode-zen": "https://opencode.ai/zen",
  openrouter: "https://openrouter.ai/keys"
};

type Tab = "controls" | "agent" | "console" | "state";

export function DebugDrawer({ orchestrator }: { orchestrator: Orchestrator }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("controls");

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2 rounded-t-md border border-b-0 border-border-primary bg-bg-secondary px-4 py-1 font-mono text-sm text-gray-500 shadow-md hover:text-gray-700"
      >
        debug
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex h-[60vh] max-h-[600px] min-h-[320px] flex-col border-t border-border-primary bg-bg-primary font-mono text-sm shadow-2xl">
      <div className="flex flex-shrink-0 items-center gap-1.5 border-b border-border-primary px-3 py-2">
        {(["controls", "agent", "console", "state"] as Tab[]).map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`rounded px-3 py-1 ${tab === name ? "bg-blue-100 text-blue-900" : "text-gray-500 hover:bg-bg-secondary"}`}
          >
            {name}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={clearDebugEvents}
          className="rounded px-3 py-1 text-gray-400 hover:bg-bg-secondary hover:text-gray-600"
        >
          clear
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded px-3 py-1 text-gray-400 hover:bg-bg-secondary hover:text-gray-600"
        >
          close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "controls" && <ControlsTab />}
        {tab === "agent" && <EventList channels={["agent"]} />}
        {tab === "console" && <EventList channels={["console", "preview"]} />}
        {tab === "state" && <StateTab orchestrator={orchestrator} />}
      </div>
    </div>
  );
}

function ControlsTab() {
  const settings = useStore(devSettingsStore);
  const actions = useStore(debugBusStore, (state) => state.actions);
  const isReady = settings.llmKey.trim().length > 0;

  return (
    <div className={controls.panel}>
      <p className={controls.intro}>
        Connect a model to chat with Jiki. Your key is stored locally and sent straight from the browser.
      </p>

      <div className={`${controls.status} ${isReady ? controls.statusReady : controls.statusIdle}`}>
        <span className={controls.statusDot} aria-hidden />
        {isReady ? `Ready — chatting with ${settings.model}` : "No key yet — add one below to start"}
      </div>

      <div className={controls.fields}>
        <label className={controls.field}>
          <span className={controls.label}>Provider</span>
          <select
            className={controls.select}
            value={settings.endpoint}
            onChange={(e) => updateDevSettings({ endpoint: e.target.value as LlmEndpoint })}
          >
            {Object.entries(PROVIDERS).map(([id, provider]) => (
              <option key={id} value={id}>
                {provider.label}
              </option>
            ))}
          </select>
        </label>

        <label className={controls.field}>
          <span className={controls.label}>API key</span>
          <input
            className={controls.input}
            type="password"
            value={settings.llmKey}
            onChange={(e) => updateDevSettings({ llmKey: e.target.value })}
            placeholder="Paste your API key"
          />
          <p className={controls.hint}>
            Get a free key at{" "}
            <a className={controls.link} href={KEY_SIGNUP_URL[settings.endpoint]} target="_blank" rel="noreferrer">
              {KEY_SIGNUP_URL[settings.endpoint].replace(/^https:\/\//, "")}
            </a>{" "}
            — no card needed.
          </p>
        </label>

        <label className={controls.field}>
          <span className={controls.label}>Model</span>
          <input
            className={controls.input}
            list="project-builder-models"
            value={settings.model}
            onChange={(e) => updateDevSettings({ model: e.target.value })}
          />
          <datalist id="project-builder-models">
            {PROVIDERS[settings.endpoint].suggestedModels.map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
          <p className={controls.hint}>Free models end in “-free”. The default works out of the box.</p>
        </label>
      </div>

      {actions.length > 0 && (
        <div className={controls.actions}>
          {actions.map((action) => (
            <button key={action.name} className={controls.actionButton} onClick={action.run}>
              {action.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EventList({ channels }: { channels: string[] }) {
  const events = useStore(debugBusStore, (state) => state.events);
  const filtered = events.filter((event) => channels.includes(event.channel));

  return (
    <div className="flex flex-col gap-1">
      {filtered.length === 0 && <span className="text-gray-400">no events yet</span>}
      {filtered.map((event) => (
        <EventRow key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventRow({ event }: { event: DebugEvent }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)} className="text-left">
        <span className="text-gray-400">{event.at.slice(11, 19)}</span> <span>{event.label}</span>
      </button>
      {isExpanded && event.payload !== undefined && (
        <pre className="mt-1 overflow-x-auto rounded bg-bg-secondary p-2">{JSON.stringify(event.payload, null, 2)}</pre>
      )}
    </div>
  );
}

function StateTab({ orchestrator }: { orchestrator: Orchestrator }) {
  const { files, agentStatus, transcript } = useProjectBuilderStore(orchestrator.getStore(), (state) => ({
    files: state.files,
    agentStatus: state.agentStatus,
    transcript: state.transcript
  }));

  return (
    <pre className="overflow-x-auto">
      {JSON.stringify(
        {
          agentStatus,
          transcriptItems: transcript.length,
          historyMessages: orchestrator.history.length,
          files: Object.fromEntries(Object.entries(files).map(([name, content]) => [name, `${content.length} chars`]))
        },
        null,
        2
      )}
    </pre>
  );
}
