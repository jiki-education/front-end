"use client";

import { useRouter } from "next/navigation";

export default function ChallengeError({ error }: { error: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => router.push("/challenges")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Challenges
        </button>
      </div>
    </div>
  );
}
