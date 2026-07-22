"use client";

import { appModals } from "./modals/app";
import { registerModals } from "./modals/registry";

// Side-effect: register (app) modals when this client-component module
// loads. Hoisted to module scope (not useEffect) so the registry is
// populated before GlobalModalProvider tries to read it, even on the
// first render after hydration.
registerModals(appModals);

export function AppModalRegistrar(): null {
  return null;
}
