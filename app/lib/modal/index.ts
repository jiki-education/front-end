// Public modal API for callsites outside (app).
// See ./app.ts for the (app)-only show* helpers.

// Export the provider component
export { GlobalModalProvider } from "./GlobalModalProvider";

// Core modal trigger helpers — safe to import from any route.
export { hideModal, showConfirmation, showInfo, showModal, useModalStore } from "./store";
