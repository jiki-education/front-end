"use client";

interface LessonLoadingPageProps {
  title?: string;
  type?: "video" | "exercise";
}

export default function LessonLoadingPage({ title, type }: LessonLoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center">
      {/* Main loading container with subtle entrance animation */}
      <div className="relative opacity-0 animate-[fadeIn_300ms_ease-in-out_forwards]">
        {/* Background circles for depth - using transform for better performance */}
        <div className="absolute -inset-20 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="relative bg-white rounded-2xl shadow-xl p-12 max-w-md w-full">
          {/* Icon based on exercise type */}
          <div className="flex justify-center mb-8">
            <div className="relative animate-pulse">
              {type === "video" ? (
                <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              )}

              {/* Simplified spinning ring */}
              <div className="absolute -inset-2 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          </div>

          {/* Exercise title if provided */}
          {title && <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">{title}</h2>}

          {/* Loading text with simplified animation */}
          <div className="text-center">
            <p className="text-lg text-gray-600 font-medium mb-2">
              Loading<span className="animate-pulse">...</span>
            </p>
            <p className="text-sm text-gray-500">
              {type === "video" ? "Preparing video lesson" : "Setting up code editor"}
            </p>
          </div>

          {/* Simplified progress bar */}
          <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-1/2 rounded-full animate-pulse" />
          </div>

          {/* Quick tips while loading */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center opacity-0 animate-[fadeIn_1s_ease-in-out_500ms_forwards]">
              💡 Tip:{" "}
              {type === "video"
                ? "You can adjust video playback speed using the controls"
                : "Use Cmd/Ctrl + Enter to quickly run your code"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
