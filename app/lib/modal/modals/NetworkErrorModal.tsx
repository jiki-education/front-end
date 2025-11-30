"use client";

interface NetworkErrorModalProps {
  error?: Error;
}

export function NetworkErrorModal({ error: _error }: NetworkErrorModalProps) {
  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold text-text-primary">Connection Error</h2>
      <p className="text-text-secondary">
        We&apos;re having trouble connecting to the server. We&apos;re retrying automatically...
      </p>
      <ul className="list-disc list-inside text-text-secondary space-y-1 ml-2">
        <li>Check your internet connection</li>
        <li>The server may be temporarily unavailable</li>
        <li>There may be a network issue</li>
      </ul>
      <p className="text-text-secondary text-sm">
        This modal will close automatically when the connection is restored.
      </p>
    </div>
  );
}
