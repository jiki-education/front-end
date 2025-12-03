interface MilestoneButtonProps {
  levelTitle: string;
  onClick: () => void;
  disabled?: boolean;
  completed?: boolean;
  className?: string;
}

export function MilestoneButton({
  levelTitle,
  onClick,
  disabled = false,
  completed = false,
  className = ""
}: MilestoneButtonProps) {
  const buttonStyles = completed
    ? `group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 
       text-white font-bold rounded-xl shadow-lg
       border-4 border-green-400 cursor-default
       ${className}`
    : `group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
       text-white font-bold rounded-xl shadow-lg hover:shadow-xl 
       transition-all duration-300 transform hover:scale-105 
       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
       border-4 border-yellow-300 hover:border-yellow-200
       ${className}`;

  const glowColor = completed ? "from-green-500 to-emerald-600" : "from-yellow-400 to-orange-500";
  const emoji = completed ? "✅" : "🏆";
  const actionText = completed ? "Level Completed" : "Complete Level";

  return (
    <button
      onClick={completed ? undefined : onClick}
      disabled={disabled}
      className={buttonStyles}
      aria-label={completed ? `${levelTitle} completed` : `Complete ${levelTitle} milestone`}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${glowColor} opacity-20 blur-md ${!completed ? "group-hover:opacity-40" : ""} transition-opacity duration-300`}
      ></div>

      {/* Button content */}
      <div className="relative flex items-center gap-3">
        <div className="text-2xl">{emoji}</div>
        <div className="text-left">
          <div className="text-sm font-medium opacity-90">{actionText}</div>
          <div className="text-lg font-bold">{levelTitle}</div>
        </div>
      </div>

      {/* Shine animation - only for non-completed */}
      {!completed && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
      )}
    </button>
  );
}
