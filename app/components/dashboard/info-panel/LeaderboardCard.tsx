interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Alice Chen", xp: 1250, avatar: "AC" },
  { rank: 2, name: "Bob Smith", xp: 1180, avatar: "BS" },
  { rank: 3, name: "Carol Davis", xp: 1050, avatar: "CD" },
  { rank: 4, name: "You", xp: 25, avatar: "JD" },
  { rank: 5, name: "Eva Wilson", xp: 20, avatar: "EW" }
];

export function LeaderboardCard() {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Weekly Leaderboard</h3>

      <div className="space-y-2">
        {mockLeaderboard.map((entry) => (
          <LeaderboardEntry key={entry.rank} entry={entry} />
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View Full Leaderboard →
      </button>
    </div>
  );
}

function LeaderboardEntry({ entry }: { entry: LeaderboardEntry }) {
  const isCurrentUser = entry.name === "You";
  const getRankDisplay = () => {
    return `#${entry.rank}`;
  };

  return (
    <div
      className={`
      flex items-center gap-3 p-2 rounded-lg
      ${isCurrentUser ? "bg-white shadow-sm border-2 border-amber-400" : ""}
    `}
    >
      <div className="w-8 text-center font-bold text-sm text-gray-600">{getRankDisplay()}</div>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
        {entry.avatar}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{entry.name}</div>
      </div>
      <div className="text-sm font-bold text-amber-600">{entry.xp} XP</div>
    </div>
  );
}
