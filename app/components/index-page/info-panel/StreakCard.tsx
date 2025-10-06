interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date().getDay();

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Daily Streak</h3>
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-orange-600">{streak} days</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`
              w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium
              ${
                index <= today ? "bg-gradient-to-br from-orange-400 to-red-500 text-white" : "bg-gray-200 text-gray-400"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-3">Keep it up! Practice daily to maintain your streak.</p>
    </div>
  );
}
