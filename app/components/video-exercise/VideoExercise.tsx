"use client";

import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import type { LessonData } from "@/lib/api/lessons";
import { markLessonComplete } from "@/lib/api/lessons";
import { showConfirmation } from "@/lib/modal";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface VideoExerciseProps {
  lessonData: LessonData;
}

export default function VideoExercise({ lessonData }: VideoExerciseProps) {
  const router = useRouter();
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoSkipped, setVideoSkipped] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const playerRef = useRef<MuxPlayerRefAttributes>(null);

  // Extract video source from lesson data
  // Backend returns: data.sources[0] = {host: 'mux', id: 'playbackId'}
  let playbackId = "";
  let videoSource = null;

  if (lessonData.data?.sources && Array.isArray(lessonData.data.sources) && lessonData.data.sources.length > 0) {
    videoSource = lessonData.data.sources[0];
    // Extract the id which is the Mux playback ID
    playbackId = videoSource.id || "";
  }

  useEffect(() => {
    // Start playing immediately when component mounts
    setIsInitializing(false);
    if (playerRef.current) {
      playerRef.current.play().catch((error) => {
        // Autoplay failed, but still show the video so user can manually play
        console.warn("Autoplay was prevented:", error.message);
        setIsVideoVisible(true);
      });
    }
  }, []);

  const handleVideoEnd = () => {
    setVideoWatched(true);
    setVideoProgress(100);
  };

  const handleVideoPlay = () => {
    setIsVideoVisible(true);
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime || 0;
      const duration = playerRef.current.duration || 1;
      const progress = (currentTime / duration) * 100;
      setVideoProgress(Math.min(progress, 100));
    }
  };

  const handleSkipClick = () => {
    showConfirmation({
      title: "Skip Video",
      message: "Are you sure you want to skip the video?",
      variant: "default",
      onConfirm: () => {
        setVideoSkipped(true);
        setVideoWatched(true);
        setVideoProgress(100); // Mark as complete
        if (playerRef.current) {
          playerRef.current.pause();
        }
      }
    });
  };

  const handleContinue = async () => {
    if (isMarking) {
      return;
    }

    try {
      setIsMarking(true);
      await markLessonComplete(lessonData.slug);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen py-2 relative transition-opacity duration-500 ${isInitializing ? "opacity-0" : "opacity-100"}`}
    >
      <LessonQuitButton />
      <h1 className="text-4xl font-bold mb-8">{lessonData.title}</h1>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Progress</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">{Math.round(videoProgress)}%</span>
        </div>
      </div>

      <div className="w-full max-w-4xl relative">
        {/* Reserve space with aspect ratio to prevent layout shift */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          {playbackId ? (
            <MuxPlayer
              ref={playerRef}
              playbackId={playbackId}
              streamType="on-demand"
              title={lessonData.title}
              autoPlay
              loop={false}
              muted={false}
              volume={0.5}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                isVideoVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ visibility: isVideoVisible ? "visible" : "hidden" }}
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-lg">
              <div className="text-white text-center p-4">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <p className="text-lg mb-2">No video source available</p>
                {videoSource && <p className="text-sm text-gray-400 mt-2">Host: {videoSource.host}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        {!videoWatched && !videoSkipped && (
          <button
            onClick={handleSkipClick}
            className="px-6 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            Skip Video
          </button>
        )}
        <button
          onClick={handleContinue}
          disabled={!videoWatched || isMarking}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            videoWatched && !isMarking
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isMarking ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
