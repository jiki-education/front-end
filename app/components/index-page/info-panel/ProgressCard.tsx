import type { UserProgress } from "../lib/mockData";

interface ProgressCardProps {
  progress: UserProgress;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  const progressPercentage = (progress.completedExercises / progress.totalExercises) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Your Progress</h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Course Progress</span>
            <span className="font-medium">
              {progress.completedExercises}/{progress.totalExercises}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">{progress.totalXp}</div>
            <div className="text-xs text-gray-500">Total XP</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{progress.currentLevel}</div>
            <div className="text-xs text-gray-500">Current Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
