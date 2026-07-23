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
        className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2 rounded-t-md border border-b-0 border-border-primary bg-bg-secondary px-4 py-0.5 font-mono text-xs text-gray-500"
      >
        debug
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-72 border-t border-border-primary bg-bg-primary font-mono text-xs shadow-lg">
      <div className="flex items-center gap-1 border-b border-border-primary px-2 py-1">
        {(["controls", "agent", "console", "state"] as Tab[]).map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`rounded px-2 py-0.5 ${tab === name ? "bg-blue-100 text-blue-900" : "text-gray-500"}`}
          >
            {name}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={clearDebugEvents} className="px-2 text-gray-400">
          clear
        </button>
        <button onClick={() => setIsOpen(false)} className="px-2 text-gray-400">
          close
        </button>
      </div>
      <div className="h-[calc(100%-29px)] overflow-y-auto p-2">
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

  return (
    <div className="flex max-w-xl flex-col gap-2">
      <label className="flex items-center gap-2">
        <span className="w-28 text-gray-500">Provider</span>
        <select
          value={settings.endpoint}
          onChange={(e) => updateDevSettings({ endpoint: e.target.value as LlmEndpoint })}
          className="flex-1 rounded border border-border-primary px-2 py-1"
        >
          {Object.entries(PROVIDERS).map(([id, provider]) => (
            <option key={id} value={id}>
              {provider.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="w-28 text-gray-500">API key</span>
        <input
          type="password"
          value={settings.llmKey}
          onChange={(e) => updateDevSettings({ llmKey: e.target.value })}
          className="flex-1 rounded border border-border-primary px-2 py-1"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="w-28 text-gray-500">Model</span>
        <input
          list="project-builder-models"
          value={settings.model}
          onChange={(e) => updateDevSettings({ model: e.target.value })}
          className="flex-1 rounded border border-border-primary px-2 py-1"
        />
        <datalist id="project-builder-models">
          {PROVIDERS[settings.endpoint].suggestedModels.map((model) => (
            <option key={model} value={model} />
          ))}
        </datalist>
      </label>
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={action.run}
            className="rounded border border-border-primary px-2 py-1 hover:bg-bg-secondary"
          >
            {action.name}
          </button>
        ))}
      </div>
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
