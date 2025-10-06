"use client";

interface NavigationLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function NavigationLoadingOverlay({
  isVisible,
  message = "Loading exercise..."
}: NavigationLoadingOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-200 ease-in-out">
      <div className="text-center">
        {/* Simplified spinner using Tailwind's animate-spin */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full" />
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-700 font-medium">{message}</p>
        {/* Simple loading dots using Tailwind animations */}
        <div className="mt-2 flex justify-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:150ms]" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
