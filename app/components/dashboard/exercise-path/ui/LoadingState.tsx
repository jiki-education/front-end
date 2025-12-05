export function LoadingState() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
