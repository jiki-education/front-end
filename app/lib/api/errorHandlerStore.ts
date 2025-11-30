import { create } from "zustand";

interface ErrorHandlerState {
  criticalError: Error | null;
}

interface ErrorHandlerActions {
  setCriticalError: (error: Error | null) => void;
  clearCriticalError: () => void;
}

type ErrorHandlerStore = ErrorHandlerState & ErrorHandlerActions;

// Create the global error handler store
const useErrorHandlerStore = create<ErrorHandlerStore>((set) => ({
  // Initial state
  criticalError: null,

  // Actions
  setCriticalError: (error) =>
    set({
      criticalError: error
    }),

  clearCriticalError: () =>
    set({
      criticalError: null
    })
}));

// Export the hook for React components
export { useErrorHandlerStore };

// Export convenience functions that can be called from anywhere (e.g., API client)
export const setCriticalError = (error: Error) => {
  useErrorHandlerStore.getState().setCriticalError(error);
};

export const clearCriticalError = () => {
  useErrorHandlerStore.getState().clearCriticalError();
};
