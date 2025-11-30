"use client";

interface SessionExpiredModalProps {
  error?: Error;
}

export function SessionExpiredModal({ error: _error }: SessionExpiredModalProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold text-text-primary">Session Expired</h2>
      <p className="text-text-secondary">Your session has expired. Please log in again.</p>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleReload}
          className="px-6 py-2 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
