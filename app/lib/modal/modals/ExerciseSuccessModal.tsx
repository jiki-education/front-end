"use client";

import { hideModal } from "../store";

interface ExerciseSuccessModalProps {
  title?: string;
  message?: string;
  buttonText?: string;
}

export function ExerciseSuccessModal({
  title = "Congratulations!",
  message = "All tests passed! You've successfully completed this exercise.",
  buttonText = "Continue"
}: ExerciseSuccessModalProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-green-700">{title}</h2>
      <div className="text-gray-600">
        <p>{message}</p>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={hideModal}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
