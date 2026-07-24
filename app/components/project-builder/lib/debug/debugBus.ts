// App-wide debug bus (development only). Features push events onto named
// channels; the DebugDrawer renders them. Kept as a plain zustand vanilla store
// so non-React code (orchestrators, API clients) can push without hooks.

import { createStore } from "zustand/vanilla";

export interface DebugEvent {
  id: number;
  at: string;
  channel: string;
  label: string;
  payload?: unknown;
}

export interface DebugAction {
  name: string;
  run: () => void;
}

interface DebugBusState {
  events: DebugEvent[];
  actions: DebugAction[];
}

const MAX_EVENTS = 500;
let nextId = 1;

export const debugBusStore = createStore<DebugBusState>(() => ({
  events: [],
  actions: []
}));

export function debugLog(channel: string, label: string, payload?: unknown): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  debugBusStore.setState((state) => ({
    events: [
      ...state.events.slice(-(MAX_EVENTS - 1)),
      { id: nextId++, at: new Date().toISOString(), channel, label, payload }
    ]
  }));
}

// Features register actions (e.g. "Reset project") that appear as buttons in
// the drawer's Controls tab. Returns an unregister function for unmount.
export function registerDebugAction(name: string, run: () => void): () => void {
  debugBusStore.setState((state) => ({
    actions: [...state.actions.filter((a) => a.name !== name), { name, run }]
  }));
  return () => {
    debugBusStore.setState((state) => ({ actions: state.actions.filter((a) => a.name !== name) }));
  };
}

export function clearDebugEvents(): void {
  debugBusStore.setState({ events: [] });
}
