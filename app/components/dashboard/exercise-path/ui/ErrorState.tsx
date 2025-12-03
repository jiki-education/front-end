interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const handleClearSession = () => {
    sessionStorage.clear();
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/auth/login";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-error-text mb-4">Error: {error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring"
          >
            Retry
          </button>
          <button
            onClick={handleClearSession}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-90 transition-opacity focus-ring"
          >
            Clear Session
          </button>
        </div>
      </div>
    </div>
  );
}
